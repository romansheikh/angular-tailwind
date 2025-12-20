import { Component, inject, signal } from '@angular/core';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { AngularSvgIconModule } from "angular-svg-icon";

@Component({
  selector: 'app-setting',
  imports: [ReactiveFormsModule, RouterModule, AngularSvgIconModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css',
})
export class SettingComponent {
  confrim() {
    throw new Error('Method not implemented.');
  }
  common = inject(CommonService);
  formGroup = this.fb.group({
    name: ['Brian Hughes', Validators.required],
    username: ['brianh', [Validators.required]],
    title: ['Senior Frontend Developer'],
    company: ['YXZ Software'],
    about: [
      `Hey! This is Brian; husband, father and gamer. I'm mostly passionate about bleeding edge tech and chocolate! 🍫`,
    ],
  });

  settings = [
    { name: 'Account', icon: './assets/icons/heroicons/outline/user-circle.svg', route: '/user/setting/account' },
    { name: 'Security', icon: './assets/icons/heroicons/outline/shield-check.svg', route: '/user/setting/security' },
    { name: 'Password', icon: './assets/icons/heroicons/outline/lock.svg', route: '/user/setting/password' },
    { name: 'Privacy', icon: './assets/icons/heroicons/outline/finger-print.svg', route: '/user/setting/privacy' },
    { name: 'Affiliate', icon: './assets/icons/heroicons/outline/user-group.svg', route: '/user/setting/affiliate' },
    { name: 'Transaction', icon: './assets/icons/heroicons/outline/credit-card.svg', route: '/user/setting/transaction' },
    { name: 'Language', icon: './assets/icons/heroicons/outline/globe-alt.svg', route: '/user/setting/language' },
  ];

  // drawer open state
  open = signal(false);

  // open / close helpers
  openDrawer() {
    this.open.set(true);
  }
  closeDrawer() {
    this.open.set(false);
  }
  toggleDrawer() {
    this.open.update((v) => !v);
  }

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    // replace with your save logic
    console.log('Saved', this.formGroup.value);
    alert('Settings saved (hook up your API).');
  }
}
