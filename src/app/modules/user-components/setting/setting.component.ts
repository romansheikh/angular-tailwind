import { Component, inject, signal } from '@angular/core';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-setting',
  imports: [ReactiveFormsModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
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

   // drawer open state
  open = signal(false);

  // open / close helpers
  openDrawer() { this.open.set(true); }
  closeDrawer() { this.open.set(false); }
  toggleDrawer() { this.open.update(v => !v); }

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
