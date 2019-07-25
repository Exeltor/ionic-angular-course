import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { PlaceLocation } from './location.model';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  // BehaviourSubject para marcar que los componentes se pueden suscribir a esto como observable
  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    // Devolvemos el array como Observable, para que se diferentes partes se puedan suscribir a el
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  fetchPlaces() {
    // Hacemos una request 'get' a la tabla que nos interesa con la URL
    return this.http.get<{ [key: string]: PlaceData }>('https://ionic-angular-course-a45fb.firebaseio.com/offered-places.json')
    // Formateamos los datos obtenidos, que son guardados en una variable (en este caso 'resData')
    .pipe(map(resData => {
      const places = [];
      // Iteramos por todas las claves de la respuesta resData y creamos objetos Place para guardarlos en un array
      for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
          places.push(
            new Place(
              key,
              resData[key].title,
              resData[key].description,
              resData[key].imageUrl,
              resData[key].price,
              new Date(resData[key].availableFrom),
              new Date(resData[key].availableTo),
              resData[key].userId,
              resData[key].location
            )
          );
        }
      }
      // Devolvemos el array formateado
      return places;
    }),
    // A partir de este resultado (places), lo añadimos al array a mostrar en la aplicacion (en este caso '_places')
      tap(places => {
        this._places.next(places);
      })
    );
  }

  getPlace(id: string) {
    return this.http.get<PlaceData>(
      `https://ionic-angular-course-a45fb.firebaseio.com/offered-places/${id}.json`,
    ).pipe(
      map(placeData => {
        return new Place(
          id,
          placeData.title,
          placeData.description,
          placeData.imageUrl,
          placeData.price,
          new Date(placeData.availableFrom),
          new Date(placeData.availableTo),
          placeData.userId,
          placeData.location
        );
      })
    );
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date, location: PlaceLocation) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId,
      location
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
    let updatedPlaces: Place[];
    return this.places.pipe(take(1), switchMap(places => {
      // Nos aseguramos que los sitios han sido cargados previamente
      if (!places || places.length <= 0) {
        return this.fetchPlaces();
      } else {
        return of(places);
      }
    }),
    switchMap(places => {
      const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
      updatedPlaces = [...places];
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
        oldPlace.userId,
        oldPlace.location
      );
      return this.http.put(
        `https://ionic-angular-course-a45fb.firebaseio.com/offered-places/${placeId}.json`,
        { ...updatedPlaces[updatedPlaceIndex], id: null}
      );
    }), tap(() => {
      this._places.next(updatedPlaces);
    }));
  }
}
