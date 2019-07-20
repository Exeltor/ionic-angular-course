import { Injectable } from '@angular/core';
import { Place } from './place.model'
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City',
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
      149.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
    new Place(
      'p2',
      "L'Amour Tojours",
      'Romantic place in Paris',
      'https://i.ytimg.com/vi/NQv9Z-LZ618/hqdefault.jpg',
      189.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://previews.123rf.com/images/andrascsontos/andrascsontos1609/andrascsontos160900120/63752595-foggy-old-stairway-of-a-palace.jpg',
      99.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    )


  ];

  get places() {
    return[...this._places];
  }

  constructor(private authService: AuthService) { }

  getPlace(id: string) {
    // Clonamos el objeto con "..." al principio, lo buscamos con .find segun el criterio de que las id's sean iguales
    return {...this._places.find(p => p.id === id)};
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId);

      this.places.push(newPlace);
  }
}
