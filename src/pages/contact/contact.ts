import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {PriceService} from "../services/PriceService";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController, public priceService: PriceService) {

  }

}
