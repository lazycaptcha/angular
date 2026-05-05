import { InjectionToken, Provider } from '@angular/core';
import { LazyCaptchaTheme, LazyCaptchaType, LazyCaptchaWidgetPreset, LazyCaptchaWidgetWidth } from './lazycaptcha.types';

export interface LazyCaptchaConfig {
    siteKey: string;
    baseUrl?: string;
    type?: LazyCaptchaType;
    theme?: LazyCaptchaTheme;
    widget?: LazyCaptchaWidgetPreset;
    width?: LazyCaptchaWidgetWidth;
}

export const LAZYCAPTCHA_CONFIG = new InjectionToken<LazyCaptchaConfig>('LAZYCAPTCHA_CONFIG');

/**
 * Root provider. Use in your app's bootstrap providers:
 *
 *   // main.ts (standalone)
 *   bootstrapApplication(AppComponent, {
 *     providers: [provideLazyCaptcha({ siteKey: '...' })],
 *   });
 */
export function provideLazyCaptcha(config: LazyCaptchaConfig): Provider {
    return {
        provide: LAZYCAPTCHA_CONFIG,
        useValue: {
            baseUrl: 'https://lazycaptcha.com',
            type: 'auto' as const,
            theme: 'auto' as const,
            widget: 'standard' as const,
            ...config,
        },
    };
}
