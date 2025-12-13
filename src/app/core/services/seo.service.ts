import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { SeoMeta } from '../models/seo_meta';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  apply(metaData: SeoMeta) {
    if (!metaData) return;

    if (metaData.title) {
      this.title.setTitle(metaData.title);
      this.meta.updateTag({ property: 'og:title', content: metaData.og?.title ?? metaData.title });
    }

    if (metaData.description) {
      this.meta.updateTag({ name: 'description', content: metaData.description });
      this.meta.updateTag({ property: 'og:description', content: metaData.og?.description ?? metaData.description });
    }

    if (metaData.keywords) {
      this.meta.updateTag({ name: 'keywords', content: metaData.keywords });
    }

    if (metaData.og?.image) {
      this.meta.updateTag({ property: 'og:image', content: metaData.og.image });
    }

    if (metaData.canonical) {
      // only manipulate DOM in browser
      if (isPlatformBrowser(this.platformId)) {
        let link: HTMLLinkElement | null = this.doc.querySelector("link[rel='canonical']");
        if (!link) {
          link = this.doc.createElement('link');
          link.setAttribute('rel', 'canonical');
          this.doc.head.appendChild(link);
        }
        link.setAttribute('href', metaData.canonical);
      }
    }
  }
}
