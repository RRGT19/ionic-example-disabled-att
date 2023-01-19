import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import {InputFormControlComponent} from "../components/input-form-control/input-form-control.component";
import {CreditCardDetailsComponent} from "../components/credit-card-details/credit-card-details.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    HomePage,
    InputFormControlComponent,
    CreditCardDetailsComponent
  ]
})
export class HomePageModule {}
