import { Component, ViewChild, HostListener, signal, inject } from '@angular/core';
import { StepOneComponent } from './step-one/step-one.component';
import { StepTwoComponent } from './step-two/step-two.component';
import { StepThreeComponent } from './step-three/step-three.component';
import { CommonModule } from '@angular/common';
import { ExchangeInfoComponent } from './exchange-info/exchange-info.component';
import { CurrencyService } from 'src/app/core/services/currency.service';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  imports: [StepOneComponent, StepTwoComponent, StepThreeComponent, CommonModule, ExchangeInfoComponent],
})
export class ExchangeComponent {
  @ViewChild(StepOneComponent) stepOne!: StepOneComponent;
  @ViewChild(StepTwoComponent) stepTwo!: StepTwoComponent;
  @ViewChild(StepThreeComponent) stepThree!: StepThreeComponent;
  currencyService = inject(CurrencyService);
  currentStep = signal(1);

  steps = [
    { number: 1, label: 'Step 1' },
    { number: 2, label: 'Step 2' },
    { number: 3, label: 'Step 3' },
  ];

  // Step navigation
  nextStep() {
    if (this.currentStep() < 3) this.currentStep.update((s) => s + 1);
  }

  prevStep() {
    if (this.currentStep() > 1) this.currentStep.update((s) => s - 1);
  }

  // Collect all form values and prepare final payload
  confirmExchange() {
    const payload = {
      ...this.stepOne.formGroup.getRawValue(),
      ...this.stepTwo.formGroup.value,
      ...this.stepThree.formGroup.value,
      rate: this.stepOne.currentRate,
    };
    console.log('✅ Final Exchange Payload:', payload);
  }

  // Warn user before leaving page
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.preventDefault();
    $event.returnValue = 'Are you sure you want to leave? Your selected currencies will be lost!';
  }
}
