import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoCompressComponent } from './video-compress/video-compress.component';

const routes: Routes = [
  {
    path: '',
    component: VideoCompressComponent, // default component for /exchange
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoToolsRoutingModule { }
