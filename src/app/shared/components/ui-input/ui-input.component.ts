import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ui-input',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './ui-input.component.html',
  styleUrl: './ui-input.component.css'
})
export class UiInputComponent {
 @Input() form!: FormGroup;
  @Input() controlName!: string;
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() errorRequired: string = 'This field is required';
  @Input() errorType: string = ''; // example: invalid email
  
  get control(): FormControl {
    return this.form.get(this.controlName) as FormControl;
  }

  hasError(type: string): boolean {
    return this.control.touched && this.control.hasError(type);
  }
}
