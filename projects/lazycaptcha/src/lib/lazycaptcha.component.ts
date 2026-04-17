import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    ViewChild,
    inject,
} from '@angular/core';
import { LazyCaptchaTheme, LazyCaptchaType } from './lazycaptcha.types';
import { LazyCaptchaService } from './lazycaptcha.service';

@Component({
    selector: 'lz-captcha',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<div #container class="lazycaptcha-angular-root"></div>`,
    styles: [`.lazycaptcha-angular-root { display: inline-block; }`],
})
export class LazyCaptchaComponent implements AfterViewInit, OnDestroy {
    @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

    @Input() sitekey?: string;
    @Input() type: LazyCaptchaType = 'auto';
    @Input() theme: LazyCaptchaTheme = 'light';
    @Input() baseUrl?: string;

    @Output() readonly verify = new EventEmitter<string>();
    @Output() readonly expired = new EventEmitter<void>();
    @Output() readonly errored = new EventEmitter<unknown>();
    @Output() readonly loaded = new EventEmitter<void>();

    private readonly service = inject(LazyCaptchaService);

    async ngAfterViewInit(): Promise<void> {
        const cfg = this.service.getConfig();
        const sitekey = this.sitekey ?? cfg.siteKey;
        const type = this.type ?? cfg.type ?? 'auto';
        const theme = this.theme ?? cfg.theme ?? 'light';
        const baseUrl = this.baseUrl ?? cfg.baseUrl;

        if (!sitekey) {
            this.errored.emit(new Error('missing_sitekey'));
            return;
        }

        try {
            await this.service.loadScript(baseUrl);
        } catch (err) {
            this.errored.emit(err);
            return;
        }

        if (!window.LazyCaptcha) {
            this.errored.emit(new Error('LazyCaptcha global missing'));
            return;
        }

        window.LazyCaptcha.render(this.containerRef.nativeElement, {
            sitekey,
            type,
            theme,
            callback: (token: string) => this.verify.emit(token),
            'expired-callback': () => this.expired.emit(),
            'error-callback': (err: unknown) => this.errored.emit(err),
        });

        this.loaded.emit();
    }

    reset(): void {
        if (this.containerRef?.nativeElement && window.LazyCaptcha) {
            window.LazyCaptcha.reset(this.containerRef.nativeElement);
        }
    }

    getToken(): string | null {
        if (this.containerRef?.nativeElement && window.LazyCaptcha) {
            return window.LazyCaptcha.getToken(this.containerRef.nativeElement);
        }
        return null;
    }

    ngOnDestroy(): void {
        // Widget cleans itself up when container is removed from DOM
    }
}
