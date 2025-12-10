import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoCompressService {
  // The main compression flows are handled in the worker.
  // This service only helps to create worker and communicate.
  createWorker(): Worker | null {
    if (typeof Worker !== 'undefined') {
      // Angular's web worker ts file will be built and available as an asset.
      return new Worker(new URL('../workers/video-compress.worker', import.meta.url), { type: 'module' });
    }
    return null;
    
  }

  
}
