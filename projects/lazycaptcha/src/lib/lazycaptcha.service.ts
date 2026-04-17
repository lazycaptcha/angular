import { Injectable, Optional, Inject } from '@angular/core';
import { LAZYCAPTCHA_CONFIG, LazyCaptchaConfig } from './lazycaptcha.config';

@Injectable({ providedIn: 'root' })
export class LazyCaptchaService {
    private loadPromise: Promise<void> | null = null;

    constructor(
        @Optional() @Inject(LAZYCAPTCHA_CONFIG) private readonly config: LazyCaptchaConfig | null,
    ) {}

    getConfig(): LazyCaptchaConfig {
        if (!this.config) {
            throw new Error(
                'LazyCaptcha is not configured. Use provideLazyCaptcha({ siteKey: "..." }) in your bootstrap providers.'
            );
        }
        return this.config;
    }

    loadScript(baseUrl?: string): Promise<void> {
        if (typeof window === 'undefined') {
            return Promise.resolve(); // SSR
        }
        if (window.LazyCaptcha) {
            return Promise.resolve();
        }
        if (this.loadPromise) {
            return this.loadPromise;
        }

        const resolved = (baseUrl ?? this.config?.baseUrl ?? 'https://lazycaptcha.com').replace(/\/$/, '');
        const src = `${resolved}/api/captcha/v1/lazycaptcha.js`;

        this.loadPromise = new Promise<void>((resolve, reject) => {
            const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
            if (existing) {
                if (window.LazyCaptcha) return resolve();
                existing.addEventListener('load', () => resolve());
                existing.addEventListener('error', () => reject(new Error('script_load_failed')));
                return;
            }

            const s = document.createElement('script');
            s.src = src;
            s.async = true;
            s.defer = true;
            s.addEventListener('load', () => resolve());
            s.addEventListener('error', () => reject(new Error('script_load_failed')));
            document.head.appendChild(s);
        });

        return this.loadPromise;
    }
}
