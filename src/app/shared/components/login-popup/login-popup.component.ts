import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonService } from 'src/app/core/services/common.service';
import { GoogleOneTapService } from 'src/app/core/services/google/google-one-tap.service';
import { LoginPopupService } from 'src/app/core/services/login-popup.service';
import { ButtonComponent } from '../button/button.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-login-popup',
  imports: [CommonModule, AngularSvgIconModule, ButtonComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './login-popup.component.html',
  styleUrl: './login-popup.component.css',
  animations: [
    trigger('tabAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))]),
    ]),
  ],
})
export class LoginPopupComponent {
  passwordVisible = signal(false);
  activeTab = signal<'login' | 'signup'>('login');
  flipDirection = signal<'in' | 'out'>('in');
  popup = inject(LoginPopupService);
  common = inject(CommonService);
  auth = inject(AuthService);

  fb = inject(FormBuilder);
  signinForm: FormGroup = this.buildSignInForm(this.fb);
  signupForm: FormGroup = this.buildSingupForm(this.fb);
  oneTap = inject(GoogleOneTapService);
  title = signal<'Login with email' | 'Login with credential'>('Login with email');

  buildSingupForm(fb: FormBuilder) {
    return fb.group(
      {
        Name: ['', [Validators.required]],
        Email: ['', [Validators.required, Validators.email]],
        PhoneNumber: ['', [Validators.required]],
        Password: ['', Validators.required],
        ConfirmPassword: ['', Validators.required],
        AcceptTerm: [false, Validators.requiredTrue],
      },
      { validators: this.common.passwordMatchValidator },
    );
  }
  buildSignInForm(fb: FormBuilder) {
    return fb.nonNullable.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.required],
      Remember: [false],
  
    });
  }
  submitSignIn() {
    if (this.signinForm.invalid) {
      this.signinForm.markAllAsTouched();
      return;
    }
    this.auth.processSignIndata(this.signinForm.getRawValue());
  }
  submitSignUp() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.auth.processSignUpdata(this.signupForm.getRawValue());
  }

  openGoogleOneTap() {
    this.oneTap.showOneTapPrompt();
  }

  togglePasswordVisibility() {
    this.passwordVisible.update((v) => !v);
  }
  setTab(tab: 'login' | 'signup') {
    this.flipDirection.set('out');
    this.title.set(tab === 'login' ? 'Login with email' : 'Login with credential');
    setTimeout(() => {
      this.activeTab.set(tab);
      this.flipDirection.set('in');
    }, 300);
  }
  close() {
    this.popup.close();
  }
}
