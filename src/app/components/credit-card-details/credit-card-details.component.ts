import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {BaseGroupControlValueAccessor, createGroupProviders} from "../base-group-control-value-accessor";

/**
 * A reusable FormGroup to be embedded into other forms.
 */
@Component({
  selector: 'app-credit-card-details',
  templateUrl: './credit-card-details.component.html',
  styleUrls: ['./credit-card-details.component.scss'],
  providers: createGroupProviders(CreditCardDetailsComponent)
})
export class CreditCardDetailsComponent extends BaseGroupControlValueAccessor<any> implements OnInit {

  constructor(
    private fb: FormBuilder,
  ) {
    super();
  }

  ngOnInit(): void {
    // Notes. See src/global.scss for styles.
    this.form = this.fb.group({
      creditCardName: [null],
      creditCardNumber: [null],
      creditCardCVV: [{value: 'I should be disabled', disabled: true}], // <=== disabled is on
      creditCardExpirationDate: [null],
    });
  }

}
