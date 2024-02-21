import {inject, Injectable, input} from '@angular/core';
import {HousingLocation} from "./housinglocation";
import {HousingService} from "./housing.service";
@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  housingService : HousingService = inject(HousingService);
  houses?: HousingLocation[];
  house?: HousingLocation;
  private userLocation?: [number|undefined, number|undefined];
  private houseLocation?: [number|undefined, number|undefined];
  constructor() {
    this.getUserLocation();
    this.housingService.getAllHousingLocations().then((housingLocationList: HousingLocation[]) => {
      this.houses = housingLocationList;
    });
  }

  public getUserLocation() {
   navigator.geolocation.getCurrentPosition(
      ({coords}) => {
        this.userLocation = [coords.latitude, coords.longitude];
      }
    );
   return this.userLocation;
  }
  public getHouseLocation(id:string){
    this.house = this.houses?.find(house => house.id == parseInt(id));
    this.houseLocation = [this.house?.coordinates.latitude, this.house?.coordinates.longitude]
    return this.houseLocation;
  }
}
