import { Component, OnInit, Input } from '@angular/core';
import { Place } from 'src/app/places/place.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  // Decorator Input para indicar que alli se reciben datos (en este caso de clave/valor de "page-detail.page.ts")
  @Input() selectedPlace: Place;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  onCancel() {
    // Se cierra el mas cercano, pero se puede pasar una "id"
    // Devuelve role "cancel"
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onBookPlace() {
    // Devuelve role "confirm"
    this.modalCtrl.dismiss({message: 'This is a dummy message'}, 'confirm');
  }

}
