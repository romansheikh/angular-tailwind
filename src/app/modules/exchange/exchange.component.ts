import { Component, ViewChild, HostListener, signal, inject } from '@angular/core';
import { StepOneComponent } from './step-one/step-one.component';
import { StepTwoComponent } from './step-two/step-two.component';
import { StepThreeComponent } from './step-three/step-three.component';
import { CommonModule } from '@angular/common';
import { ExchangeInfoComponent } from './exchange-info/exchange-info.component';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { OrderService } from 'src/app/core/services/order.service';

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
  orderService = inject(OrderService);
  stepTwoDataValid = false;
  currentStep = signal(1);
  steps = signal([
    { number: 1, label: 'Step 1' },
    { number: 2, label: 'Step 2' },
    { number: 3, label: 'Step 3' },
  ]);

  // Special labels for selected step
  stepLabels: Record<number, string> = {
    1: 'Select Amount',
    2: 'Provide Details',
    3: 'Confirm Exchange',
  };

  goToStep(stepNumber: number) {

    if (stepNumber < this.currentStep()) {
      this.currentStep.set(stepNumber);
    } else {
      if (this.isCurrentStepValid()) {
        this.currentStep.set(stepNumber);
      } else {
        console.log('Cannot proceed: current step is invalid');
      }
    }
  }

  nextStep() {
    if (this.currentStep() < 3 && this.isCurrentStepValid()) {
      this.currentStep.update((s) => s + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update((s) => s - 1);
    }
  }

  isCurrentStepValid(): boolean {
    switch (this.currentStep()) {
      case 1:
        return true; // Step 1 is always valid
      case 2:
        return this.stepTwoDataValid; // Step 2 must be valid
      default:
        return true;
    }
  }
  // Update Step 2 validation (called from child component)
  onStepTwoDataChange(isValid: boolean) {
    this.stepTwoDataValid = isValid;
  }

 confirmExchange() {
  const payload = {
    ...this.stepOne.formGroup.getRawValue(),
    ...this.stepTwo.formGroup.value,
    ...this.stepThree.formGroup.value,
    ExchangeRateApplied: this.stepOne.currentRate,
  };
  this.orderService.SaveOrder(payload);
}


  // Warn user before leaving page
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    $event.preventDefault();
    $event.returnValue = 'Are you sure you want to leave? Your selected currencies will be lost!';
  }
}
