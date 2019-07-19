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
  @Input() selectedMode: 'select' | 'random';
  startDate: string;
  endDate: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);

    if (this.selectedMode === 'random') {
      // conversion a una semana en milisengundos al final
      this.startDate = new Date(
        availableFrom.getTime() + Math.random() * (availableFrom.getTime() - 7 * 24 * 60 * 60 * 1000 - availableFrom.getTime()))
        .toISOString();

      this.endDate = new Date(
        new Date(this.startDate).getTime() + Math.random() * (new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime()))
        .toISOString();
    }

  }

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
