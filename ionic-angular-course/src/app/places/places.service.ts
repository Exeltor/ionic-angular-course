import { Injectable } from '@angular/core';
import { Place } from './place.model'
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  // BehaviourSubject para marcar que los componentes se pueden suscribir a esto como observable
  private _places = new BehaviorSubject<Place[]>([
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


  ]);

  get places() {
    // Devolvemos el array como Observable, para que se diferentes partes se puedan suscribir a el
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  getPlace(id: string) {
    return this.places.pipe(take(1), map(places => {
      // Clonamos el objeto con "..." al principio, lo buscamos con .find segun el criterio de que las id's sean iguales
      return {...places.find(p => p.id === id)};
    }));
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );

    // Elegimos la tabla despues del '/' (en este caso 'offered-places'), igual que en MongoDB
    // primer argumento URL
    // Segundo el dato a mandar (en este caso porque es una request 'POST')
    return this.http.post<{name: string}>(
      'https://ionic-angular-course-a45fb.firebaseio.com/offered-places.json',
      { ...newPlace, id: null }
    )
    .pipe(
      switchMap(resData => {
        generatedId = resData.name;
        return this.places;
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    );
    // Nos suscribimos a places
    // pipe se usa para pasar argumentos a suscripciones (usamos 'take(1)' para solo pillar el dato mas reciente) y cerrar suscripcion
    // return this.places.pipe(take(1), delay(1000), tap(places => {
    //   // Añadimos el nuevo place con contatenamiento al array.
    //   this._places.next(places.concat(newPlace));
    // }));
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(take(1), delay(1000), tap(places => {
      const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
      const updatedPlaces = [...places];
      // Swap en el array
      const oldPlace = updatedPlaces[updatedPlaceIndex];
      updatedPlaces[updatedPlaceIndex] = new Place(
        oldPlace.id,
        title,
        description,
        oldPlace.imageUrl,
        oldPlace.price,
        oldPlace.availableFrom,
        oldPlace.availableTo,
        oldPlace.userId
      );

      this._places.next(updatedPlaces);
    }));
  }
}
