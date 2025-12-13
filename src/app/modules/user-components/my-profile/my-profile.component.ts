import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/user.service';
import { AngularSvgIconModule } from "angular-svg-icon";

@Component({
  selector: 'app-my-profile',
  imports: [CommonModule, ReactiveFormsModule, AngularSvgIconModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css',
})
export class MyProfileComponent {
confrim() {
throw new Error('Method not implemented.');
}
  readonly user = inject(UserService).user();
  private readonly fb = inject(FormBuilder);
  readonly common = inject(CommonService);
  formGroup: FormGroup;
  constructor() {
    this.formGroup = this.buildStepTwoForm();
  }

  private buildStepTwoForm(): FormGroup {
    const form = this.fb.group({
      Name: [this.user?.FullName, Validators.required],
      Email: [this.user?.Email, [Validators.required, Validators.email]],
      Phone: [this.user?.Phone, [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      DateOfBirth: [''],
      Gender: [''],
    });
    return form;
  }
}
