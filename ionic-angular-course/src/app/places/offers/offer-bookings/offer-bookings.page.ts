import { Component, OnInit } from '@angular/core';
import { Place } from '../../place.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {
  place: Place;

  // route es ActivatedRoute para acceder a partes de la URL activa
  constructor(private route: ActivatedRoute, private navCtrl: NavController, private placesService: PlacesService) { }

  ngOnInit() {
    // Buscamos si la URL actual contiene la id "placeId", si no, volvemos atras a ofertas
    // Con "paramMap" buscamos los campos dinamicos de la URL (en este caso "placeId")
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      // Si la id existe, la guardamos y cargamos el sitio con la id.
      this.place = this.placesService.getPlace(paramMap.get('placeId'));

    });
  }

}
