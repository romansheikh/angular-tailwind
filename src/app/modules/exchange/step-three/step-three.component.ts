import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
    imports: [CommonModule, ReactiveFormsModule], // ✅ Add this
})
export class StepThreeComponent {
  @Input() formGroup!: FormGroup;
  @Output() back = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
}
