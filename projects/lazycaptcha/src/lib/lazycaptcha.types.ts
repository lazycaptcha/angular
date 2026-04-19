export type LazyCaptchaType = 'auto' | 'image_puzzle' | 'pow' | 'behavioral' | 'text_math' | 'press_hold' | 'rotate_align';
export type LazyCaptchaTheme = 'light' | 'dark' | 'auto';

export interface LazyCaptchaRenderOptions {
    sitekey: string;
    type?: LazyCaptchaType;
    theme?: LazyCaptchaTheme;
    callback?: (token: string) => void;
    'expired-callback'?: () => void;
    'error-callback'?: (err: unknown) => void;
}

export interface LazyCaptchaGlobal {
    render(selectorOrEl: string | HTMLElement, options: LazyCaptchaRenderOptions): unknown;
    reset(selectorOrEl: string | HTMLElement): void;
    getToken(selectorOrEl: string | HTMLElement): string | null;
}

declare global {
    interface Window {
        LazyCaptcha?: LazyCaptchaGlobal;
    }
}
