import {Component, Input, Optional, Self} from '@angular/core';
import {NgControl} from '@angular/forms';
import {BaseControlValueAccessor} from "../base-control-value-accessor";

/**
 * A component to be embedded in a FormGroup instance.
 */
@Component({
  selector: 'app-input-form-control',
  templateUrl: './input-form-control.component.html',
  styleUrls: ['./input-form-control.component.scss']
})
export class InputFormControlComponent extends BaseControlValueAccessor<any> {

  /**
   * The label to show above the input.
   */
  @Input() label: string;

  /**
   * @param ngControl To bind the FormControl object to the DOM element.
   * - @Self(): We want to retrieve the dependency only from the local injector, not from the parent or ancestors.
   * - @Optional(): We want to be able to use the component without a form, so we mark the dependency as optional.
   */
  constructor(
    @Optional() @Self() public ngControl: NgControl
  ) {
    super(ngControl);
  }

}
