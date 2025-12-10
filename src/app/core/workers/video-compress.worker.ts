/// <reference lib="webworker" />
import { FFmpeg } from '@ffmpeg/ffmpeg';


type StartMsg = {
  type: 'start';
  file: {
    name: string;
    arrayBuffer: ArrayBuffer;
    duration: number;
    type?: string;
  };
  targetMB: number;
  format: 'mp4' | 'webm' | 'mov';
};

type CancelMsg = { type: 'cancel' };

type InMsg = StartMsg | CancelMsg;

self.onmessage = async (ev: MessageEvent<InMsg>) => {
  const msg = ev.data;

  if (msg.type === 'cancel') {
    // worker will handle this by toggling a flag (we use return in long ops)
    (self as any).cancelRequested = true;
    return;
  }

  if (msg.type === 'start') {
    (self as any).cancelRequested = false;

    const { file, targetMB, format } = msg;

    try {
      const ff = new FFmpeg();

      // Use local assets we bundled in src/assets/ffmpeg
      await ff.load({
        coreURL: '/assets/ffmpeg/ffmpeg-core.js',
        wasmURL: '/assets/ffmpeg/ffmpeg-core.wasm',
      });

      // progress hook (progress: 0..1)
      ff.on('progress', ({ progress }) => {
        self.postMessage({ type: 'progress', percent: Math.floor(progress * 100) });
      });

      const inputName = file.name || 'input.mp4';
      const outputName = `output.${format}`;

      // write file to ffmpeg FS
      await ff.writeFile(inputName, new Uint8Array(file.arrayBuffer));

      const duration = file.duration || 60;
      let bitrate = Math.max(100, Math.floor((targetMB * 8192) / Math.max(1, duration))); // kbps

      let finalBlob: Blob | null = null;

      for (let attempt = 1; attempt <= 6; attempt++) {
        if ((self as any).cancelRequested) {
          self.postMessage({ type: 'error', message: 'Cancelled' });
          return;
        }

        // prepare args for hybrid CRF + bitrate
        const args = [
          '-i',
          inputName,
          '-c:v',
          format === 'webm' ? 'libvpx-vp9' : 'libx264',
          '-preset',
          'veryfast',
          '-b:v',
          `${bitrate}k`,
          '-crf',
          '28',
          '-c:a',
          'aac',
          '-b:a',
          '96k',
          '-y',
          outputName,
        ];

        // run encoding
        await ff.exec(args);

        const fileData = await ff.readFile(outputName);

        if (typeof fileData === 'string') {
          throw new Error('Unexpected FFmpeg output: string instead of binary');
        }

        const data = fileData as Uint8Array;

        // CONVERT SAFELY: Remove SharedArrayBuffer
        const safeBuffer = data.slice().buffer;

        const finalBlob = new Blob([safeBuffer], {
          type: format === 'webm' ? 'video/webm' : 'video/mp4',
        });

        const sizeMB = +(finalBlob.size / (1024 * 1024)).toFixed(2);

        // success condition within ±5%
        const lower = targetMB * 0.95;
        const upper = targetMB * 1.05;

        if (sizeMB >= lower && sizeMB <= upper) {
          const blobUrl = URL.createObjectURL(finalBlob);
          self.postMessage({ type: 'done', blobUrl, sizeMB, filename: outputName });
          return;
        }

        // adjust bitrate for next attempt (proportional)
        const ratio = targetMB / Math.max(sizeMB, 0.1);
        const clamped = Math.max(0.5, Math.min(2, ratio));
        bitrate = Math.max(64, Math.floor(bitrate * clamped));

        // cleanup output in FS before retry
        try {
          await ff.deleteFile(outputName);
        } catch (_) {}

        // if last attempt, return whatever we have
        if (attempt === 6) {
          const blobUrl = URL.createObjectURL(finalBlob);
          self.postMessage({ type: 'done', blobUrl, sizeMB, filename: outputName });
          return;
        }
      }
    } catch (err: any) {
      self.postMessage({ type: 'error', message: String(err?.message || err) });
    }
  }
};
