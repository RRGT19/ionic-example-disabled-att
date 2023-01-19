import {
  AbstractControl,
  ControlValueAccessor,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {Directive, ExistingProvider, forwardRef, OnDestroy, Type} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

/**
 * Function to create the basic provider to components which use `ngModel` as required by Angular.
 * @param type Component type which extends `BaseGroupControlValueAccessor<T>`.
 */
export function createGroupProviders<T>(type: Type<BaseGroupControlValueAccessor<T>>): ExistingProvider[] {
  return [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => type),
      multi: true
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => type),
      multi: true
    }
  ];
}

/*
  About the @Directive().
  To let Angular know that there are Angular things inside this class and correctly inherit them.
  Issue: https://github.com/angular/angular/issues/35295
  Docs: https://angular.io/guide/migration-undecorated-classes
 */

/* tslint:disable */
@Directive()
export class BaseGroupControlValueAccessor<T> implements OnDestroy, ControlValueAccessor, Validator {

  /**
   * Use this to build your FormGroup in the other side.
   */
  form: FormGroup;

  /**
   * A way to unsubscribe from Observables.
   * Example of use: observable$.pipe(takeUntil(this.destroy))
   */
  destroy: Subject<void> = new Subject();

  /**
   * To notify the parent form when the value has changed programmatically.
   */
  onTouched = () => {
  };

  /**
   * Emit the notifier Subject to cancel all the Observables.
   */
  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  /**
   * ControlValueAccessor's methods implementations.
   *
   * Note:
   * They are not meant to be called directly by our code as these are framework callbacks,
   * meant to be called only by the Forms module at runtime to facilitate communication
   * between our form control and the parent form.
   */

  /*
    Write form value to the DOM element (model => view).
    Called on initialization or when we call "patchValue" or "setValue" from the parent.
   */
  public writeValue(value: T): void {
    if (value) {
      this.form.setValue(value, {emitEvent: false});
    }
  }

  /*
    Update form when DOM element value changes (view => model).
   */
  public registerOnChange(fn: any): void {
    this.form.valueChanges
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe(fn);
  }

  /*
    Update form when DOM element is blurred (view => model).
   */
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /*
    Write form disabled state to the DOM element (model => view).
    Form controls can be enabled and disabled using the Forms API.
   */
  public setDisabledState(disabled: boolean) {
    disabled ? this.form.disable() : this.form.enable();
  }

  /**
   * Validator's methods implementations.
   */

  validate(control: AbstractControl): ValidationErrors | null {
    if (control.touched) {
      this.form.markAllAsTouched();
    }

    if (this.form.valid) {
      return null;
    }

    return {
      'group-error': {
        value: this.form.value,
      },
    };
  }

}
