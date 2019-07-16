import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  // Se requiere crear una form con FormGroup para forms reactivas
  form: FormGroup;

  constructor() { }

  ngOnInit() {
    // Las forms reactivas se configuran solo dentro de ngOnInit
    this.form = new FormGroup({
      // Declaramos los elementos como FormControl y los ajustamos
      title: new FormControl(null, {
        // 'blur' para cuando pierde focus
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onCreateOffer() {
    console.log('Creating offered place');
  }

}
