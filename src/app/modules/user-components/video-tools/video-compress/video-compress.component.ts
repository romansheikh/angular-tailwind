import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VideoCompressService } from 'src/app/core/services/video-compress.service';

type FrameItem = { url: string; timestamp: number };
@Component({
  selector: 'app-video-compress',
  imports: [CommonModule, FormsModule],
  templateUrl: './video-compress.component.html',
  styleUrl: './video-compress.component.css'
})
export class VideoCompressComponent implements OnDestroy {
  // UI bindings
  targetWidth = 640;
  targetHeight = 360;
  frameRate = 15;
  extractionSpeed = 8; // playbackRate to speed seeking
  quality = 0.7; // 0.1..1.0
  // runtime state
  selectedFile: File | null = null;
  originalDuration = 0;
  originalVideoElement: HTMLVideoElement | null = null;
  progressText = '';
  progressPercent = 0;
  processing = false;
  frames: FrameItem[] = [];
  outputUrl: string | null = null;
  outputSizeBytes: number | null = null;
  outputFilename = 'compressed-video.webm';

  // internal
  private canvas = document.createElement('canvas');
  private ctx = this.canvas.getContext('2d');
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: BlobPart[] = [];

  constructor() {}

  // file input change
  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const f = input.files?.[0] ?? null;
    this.resetAll();
    if (!f) return;
    if (!f.type.startsWith('video/')) {
      alert('Please select a video file.');
      return;
    }
    this.selectedFile = f;
    this.preparePreview(f);
  }

  // show preview and metadata
  private preparePreview(file: File) {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = url;
    video.onloadedmetadata = () => {
      this.originalDuration = video.duration || 0;
      this.originalVideoElement = video;
      URL.revokeObjectURL(url);
      // show brief info via bindings in template
    };
  }

  // start processing
  async compressVideo(): Promise<void> {
    if (!this.selectedFile || !this.originalVideoElement) return;

    this.processing = true;
    this.progressText = 'Preparing...';
    this.progressPercent = 0;
    this.frames = [];
    this.outputUrl = null;
    this.outputSizeBytes = null;
    this.recordedChunks = [];

    // compute final canvas size preserving aspect
    const ov = this.originalVideoElement;
    const aspect = ov.videoWidth / ov.videoHeight || (this.targetWidth / this.targetHeight);
    let finalW: number;
    let finalH: number;
    if (ov.videoWidth >= ov.videoHeight) {
      finalW = Math.min(this.targetWidth, ov.videoWidth);
      finalH = Math.round(finalW / aspect);
      if (finalH > this.targetHeight) {
        finalH = this.targetHeight;
        finalW = Math.round(finalH * aspect);
      }
    } else {
      finalH = Math.min(this.targetHeight, ov.videoHeight);
      finalW = Math.round(finalH * aspect);
      if (finalW > this.targetWidth) {
        finalW = this.targetWidth;
        finalH = Math.round(finalW / aspect);
      }
    }

    this.canvas.width = finalW;
    this.canvas.height = finalH;

    // compute frame extraction count
    const duration = Math.max(1, this.originalDuration || (this.selectedFile.size / (1000 * 1000))); // fallback
    const totalFrames = Math.max(10, Math.min(300, Math.round(duration * this.frameRate)));

    const frameInterval = duration / totalFrames; // seconds between frames

    this.progressText = `Extracting ${totalFrames} frames...`;
    this.progressPercent = 0;

    // use a video element to seek and draw frames
    const seeker = document.createElement('video');
    seeker.preload = 'auto';
    seeker.muted = true;
    seeker.src = URL.createObjectURL(this.selectedFile);
    // speed up seeking to reduce waiting
    seeker.playbackRate = this.extractionSpeed;

    // ensure metadata loaded
    await new Promise<void>((resolve) => {
      seeker.onloadedmetadata = () => resolve();
    });

    // extract frames sequentially
    for (let i = 0; i < totalFrames; i++) {
      const t = Math.min(duration - 0.001, i * frameInterval);
      try {
        await this.seekVideoTo(seeker, t);
      } catch {
        // on error, continue
      }
      // draw to canvas
      this.ctx?.clearRect(0, 0, finalW, finalH);
      this.ctx?.drawImage(seeker, 0, 0, finalW, finalH);

      // convert to blob with requested quality
      // wrap to promise because toBlob is callback-based
      const blob: Blob = await new Promise((res) =>
        this.canvas.toBlob((b) => res(b as Blob), 'image/jpeg', this.quality)
      );

      const frameUrl = URL.createObjectURL(blob);
      this.frames.push({ url: frameUrl, timestamp: t });

      // add some frames to gallery (template handles showing subset)
      if (i % Math.max(1, Math.floor(totalFrames / 20)) === 0) {
        // gallery update handled by frames array change detection
      }

      // progress: first 50%
      this.progressPercent = Math.floor(((i + 1) / totalFrames) * 50);
      this.progressText = `Extracting frames: ${i + 1}/${totalFrames}`;
      // allow UI update
      await this.nextTick();
    }

    // finalize extraction
    this.progressText = 'Creating compressed video...';
    this.progressPercent = 50;

    // create an offscreen canvas for recording frames into a stream
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = finalW;
    tempCanvas.height = finalH;
    const tempCtx = tempCanvas.getContext('2d') as CanvasRenderingContext2D;

    const stream = (tempCanvas as HTMLCanvasElement).captureStream(this.frameRate);
    // configure bitrate roughly from quality (not exact)
    const estimatedBps = Math.round(1_500_000 * (this.quality));
    try {
      // try exact codec option
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8',
        videoBitsPerSecond: estimatedBps
      });
    } catch (err) {
      try {
        // fallback
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm',
          videoBitsPerSecond: estimatedBps
        });
      } catch (err2) {
        this.progressText = 'Browser does not support MediaRecorder for video/webm';
        this.processing = false;
        return;
      }
    }

    this.recordedChunks = [];
    this.mediaRecorder.ondataavailable = (ev: BlobEvent) => {
      if (ev.data && ev.data.size > 0) {
        this.recordedChunks.push(ev.data);
      }
    };

    const stopPromise = new Promise<void>((resolve) => {
      this.mediaRecorder!.onstop = () => resolve();
    });

    // start recording
    this.mediaRecorder.start();

    // draw frames in real time to recording canvas
    for (let idx = 0; idx < this.frames.length; idx++) {
      const img = new Image();
      img.src = this.frames[idx].url;
      await new Promise<void>((resolve) => {
        img.onload = () => {
          tempCtx.clearRect(0, 0, finalW, finalH);
          tempCtx.drawImage(img, 0, 0, finalW, finalH);
          resolve();
        };
        img.onerror = () => resolve(); // continue even if a frame fails
      });

      // update progress 50-100%
      this.progressPercent = 50 + Math.floor(((idx + 1) / this.frames.length) * 50);
      this.progressText = `Recording frames: ${idx + 1}/${this.frames.length}`;
      // wait frame duration
      await this.sleep(Math.max(0, Math.round(1000 / this.frameRate)));
    }

    // stop recorder and await data finalize
    this.mediaRecorder.stop();
    await stopPromise;

    // combine recorded chunks
    const outBlob = new Blob(this.recordedChunks, { type: 'video/webm' });
    this.outputSizeBytes = outBlob.size;
    this.outputUrl = URL.createObjectURL(outBlob);

    this.progressPercent = 100;
    this.progressText = 'Compression complete';
    this.processing = false;
  }

  // small helpers
  private seekVideoTo(video: HTMLVideoElement, timeSec: number): Promise<void> {
    return new Promise((res, rej) => {
      const handler = () => {
        video.removeEventListener('seeked', handler);
        res();
      };
      video.addEventListener('seeked', handler);
      try {
        video.currentTime = timeSec;
      } catch (e) {
        // older browsers might throw for invalid seeks
        video.removeEventListener('seeked', handler);
        rej(e);
      }
    });
  }

  // small tick to let UI update
  private nextTick(): Promise<void> {
    return new Promise((res) => setTimeout(res, 0));
  }

  private sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }

  // download result
  downloadResult() {
    if (!this.outputUrl) return;
    const a = document.createElement('a');
    a.href = this.outputUrl;
    a.download = this.outputFilename;
    a.click();
  }

  // small human readable helpers (same as original)
  formatTime(sec?: number) {
    if (!sec || isNaN(sec) || sec === Infinity) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  formatSize(bytes?: number) {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  }

  // reset
  resetAll() {
    this.processing = false;
    this.frames.forEach((f) => URL.revokeObjectURL(f.url));
    this.frames = [];
    if (this.outputUrl) {
      URL.revokeObjectURL(this.outputUrl);
      this.outputUrl = null;
    }
    this.recordedChunks = [];
    this.mediaRecorder = null;
    this.selectedFile = null;
    this.progressText = '';
    this.progressPercent = 0;
  }

  ngOnDestroy(): void {
    this.resetAll();
  }
}

