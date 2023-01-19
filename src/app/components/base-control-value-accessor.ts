import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl} from '@angular/forms';
import {Directive, DoCheck, ExistingProvider, forwardRef, Input, Optional, Self, Type} from '@angular/core';

/**
 * Function to create the basic provider to components which use `ngModel` as required by Angular.
 * @param type Component type which extends `BaseControlValueAccessor<T>`.
 */
export function createProviders<T>(type: Type<BaseControlValueAccessor<T>>): ExistingProvider[] {
  return [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => type),
    multi: true
  }];
}

/*
  About the @Directive().
  To let Angular know that there are Angular things inside this class and correctly inherit them.
  Issue: https://github.com/angular/angular/issues/35295
  Docs: https://angular.io/guide/migration-undecorated-classes
 */

/* tslint:disable */
@Directive()
export class BaseControlValueAccessor<T> implements ControlValueAccessor, DoCheck {

  /**
   * Optional properties that can be passed from the parent component when this component
   * is not attached to a FormControl and we need to set these properties for display purposes.
   *
   * Example of use:  <app-my-component [value]="someValue"
   *                                    [disabled]="true">
   *                  </app-my-component>
   */
  @Input() value: T;
  @Input() disabled = false;

  /**
   * Intended to be called directly by our code to set a new value.
   */
  set newValue(newValue: T) {
    if (newValue !== this.value) {
      this.value = newValue;
      this.onChange(newValue);
    }
  }

  /**
   * When true, it specifies that an input field must be filled out before submitting the form.
   */
  required = false;

  /**
   * A unique id for each control.
   * Can be used on the "id" and "for" for an HTML element.
   */
  id = Math.random().toString(36).substring(2);

  /**
   * To notify the parent form when the value has changed programmatically.
   */
  onChange = (newValue: T) => {
  };
  onTouched = () => {
  };

  /**
   * @param ngControl To bind the FormControl object to the DOM element.
   * - @Self(): We want to retrieve the dependency only from the local injector, not from the parent or ancestors.
   * - @Optional(): We want to be able to use the component without a form, so we mark the dependency as optional.
   */
  constructor(
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (ngControl != null) {
      // Setting the value accessor directly (instead of using the providers) to avoid running into a circular import.
      ngControl.valueAccessor = this;
    }
  }

  /**
   * DoCheck's methods implementations.
   */

  ngDoCheck(): void {
    const control = this.ngControl && this.ngControl.control;
    if (control instanceof FormControl) {
      // Check if this field is required or not.
      const validator = this.ngControl.control.validator && this.ngControl.control.validator(new FormControl(null));
      this.required = Boolean(validator && validator.hasOwnProperty('required'));
    }
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
  writeValue(value: T): void {
    if (value !== this.value) {
      this.value = value;
    }
  }

  /*
    Update form when DOM element value changes (view => model).
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /*
    Update form when DOM element is blurred (view => model).
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /*
    Write form disabled state to the DOM element (model => view).
    Form controls can be enabled and disabled using the Forms API.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
