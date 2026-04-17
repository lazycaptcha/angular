import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LazyCaptchaComponent } from './lazycaptcha.component';
import { provideLazyCaptcha } from './lazycaptcha.config';

describe('LazyCaptchaComponent', () => {
    let fixture: ComponentFixture<LazyCaptchaComponent>;
    let renderSpy: jasmine.Spy;

    beforeEach(async () => {
        renderSpy = jasmine.createSpy('render');
        (window as any).LazyCaptcha = {
            render: renderSpy,
            reset: jasmine.createSpy('reset'),
            getToken: () => 'mock-token',
        };

        await TestBed.configureTestingModule({
            imports: [LazyCaptchaComponent],
            providers: [provideLazyCaptcha({ siteKey: 'test-key' })],
        }).compileComponents();

        fixture = TestBed.createComponent(LazyCaptchaComponent);
    });

    it('creates the component', () => {
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('calls LazyCaptcha.render after view init', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        expect(renderSpy).toHaveBeenCalled();
        const [, options] = renderSpy.calls.mostRecent().args;
        expect(options.sitekey).toBe('test-key');
    });
});
