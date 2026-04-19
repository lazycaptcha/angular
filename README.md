# @lazycaptcha/angular

Standalone Angular component + service for [LazyCaptcha](https://lazycaptcha.com). Self-hostable, privacy-friendly CAPTCHA — drop-in alternative to hCaptcha and reCAPTCHA.

[![npm](https://img.shields.io/npm/v/@lazycaptcha/angular.svg)](https://npmjs.com/package/@lazycaptcha/angular)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @lazycaptcha/angular
```

## Setup

### Standalone (Angular 16+)

```ts
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideLazyCaptcha } from '@lazycaptcha/angular';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
    providers: [
        provideLazyCaptcha({
            siteKey: 'YOUR_SITE_KEY',
            baseUrl: 'https://lazycaptcha.com',    // optional
            type: 'auto',                           // optional
            theme: 'light',                         // optional
        }),
    ],
});
```

### NgModule (legacy)

```ts
import { LazyCaptchaComponent, provideLazyCaptcha } from '@lazycaptcha/angular';

@NgModule({
    imports: [LazyCaptchaComponent],
    providers: [provideLazyCaptcha({ siteKey: 'YOUR_SITE_KEY' })],
})
export class AppModule {}
```

## Usage

### Template

```html
<form (ngSubmit)="submit()">
    <input [(ngModel)]="email" type="email" name="email" required />

    <lz-captcha
        (verify)="token = $event"
        (expired)="token = null"
        (errored)="onCaptchaError($event)"
    />

    <button type="submit" [disabled]="!token">Send</button>
</form>
```

### Component

```ts
import { Component, inject, ViewChild } from '@angular/core';
import { LazyCaptchaComponent } from '@lazycaptcha/angular';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [FormsModule, LazyCaptchaComponent],
    templateUrl: './contact.component.html',
})
export class ContactComponent {
    @ViewChild(LazyCaptchaComponent) captcha?: LazyCaptchaComponent;
    email = '';
    token: string | null = null;

    async submit() {
        if (!this.token) return;
        await fetch('/api/contact', {
            method: 'POST',
            body: JSON.stringify({ email: this.email, 'lazycaptcha-token': this.token }),
            headers: { 'Content-Type': 'application/json' },
        });
        this.captcha?.reset();
    }

    onCaptchaError(err: unknown) {
        console.error(err);
    }
}
```

## Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `sitekey` | `string` | (from provider) | Override the configured site key |
| `type` | `'auto' \| 'image_puzzle' \| 'pow' \| 'behavioral' \| 'text_math' \| 'press_hold' \| 'rotate_align'` | `'auto'` | Challenge type |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | Widget theme. `'auto'` follows the host page's dark-mode class/attribute and the OS `prefers-color-scheme`. |
| `baseUrl` | `string` | `'https://lazycaptcha.com'` | Override LazyCaptcha instance |

## Outputs

| Output | Payload | When |
|--------|---------|------|
| `verify` | `string` | User solved the challenge |
| `expired` | — | Token expired (5 min) |
| `errored` | `unknown` | Error during load/render |
| `loaded` | — | Widget rendered |

## Programmatic API

Via `@ViewChild`:

```ts
@ViewChild(LazyCaptchaComponent) captcha!: LazyCaptchaComponent;

resetCaptcha() { this.captcha.reset(); }
currentToken() { return this.captcha.getToken(); }
```

## SSR (Angular Universal)

The component checks for `window` before touching the DOM, so it's safe to import in SSR code. The widget itself only initializes on the client after hydration.

## Server verification

Verify the token from your backend with a POST to `{baseUrl}/api/captcha/v1/verify`. Official server libraries: `lazycaptcha/laravel`, `lazycaptcha-django`, `@lazycaptcha/nextjs`, and others.

## Compatibility

- Angular 16, 17, 18
- Works with both standalone and NgModule apps
- SSR-safe

## License

[MIT](LICENSE)
