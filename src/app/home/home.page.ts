import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  workingForm: FormGroup;
  notWorkingForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.workingForm = this.fb.group({
      name: [{value: 'This is working good, I am disabled', disabled: true}, Validators.required],
    });

    this.notWorkingForm = this.fb.group({
      creditCard: [null, Validators.required],
    });
  }

}
