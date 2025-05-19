import { Injectable, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';

declare global {
  interface Window { dataLayer: any[]; gtag: (...args: unknown[]) => void; }
}

@Injectable({ providedIn: 'root' })
export class GoogleAnalyticsService {
  private readonly id = environment.analytics.measurementId;
  private loaded = false;

  /** injects gtag.js once */
  load(): void {
    if (this.loaded) { return; }
    const url = `https://www.googletagmanager.com/gtag/js?id=${this.id}`;
    if (!document.querySelector(`script[src="${url}"]`)) {
      const s = document.createElement('script');
      s.async = true;
      s.src = url;
      document.head.appendChild(s);
    }
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    this.loaded = true;
  }

  emit(event: string, params: Record<string, unknown> = {}): void {
    if (!this.loaded) { return; }
    try {
      window.gtag('event', event, params);
    } catch { /* noop */ }
  }

  pageView(path: string, title: string): void {
    this.emit('page_view', { page_path: path, page_title: title });
  }
}
