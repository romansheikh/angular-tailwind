import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  Output,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { filter, fromEvent, Subscription } from 'rxjs';

@Directive({
  selector: '[clickOutside]',
  standalone: true,
})
export class ClickOutsideDirective implements AfterViewInit, OnDestroy {
  @Output() clickOutside = new EventEmitter<void>();

  private subscription?: Subscription;

  constructor(
    private element: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngAfterViewInit(): void {
    this.subscription = fromEvent<PointerEvent>(this.document, 'pointerdown')
      .pipe(
        filter((event) => {
          const target = event.target;

          if (!(target instanceof HTMLElement)) {
            return false;
          }

          return !this.element.nativeElement.contains(target);
        }),
      )
      .subscribe(() => {
        this.clickOutside.emit();
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
