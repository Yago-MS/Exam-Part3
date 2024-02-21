import {Component, inject, OnInit} from '@angular/core';
import {icon, Map, marker, Marker, tileLayer} from "leaflet";
import {PlacesService} from "../places.service";
import {ActivatedRoute} from "@angular/router";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {parseJson} from "@angular/cli/src/utilities/json-file";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {

  route: ActivatedRoute = inject(ActivatedRoute);
  houseid!: string;
  houseGeo: any;
  userGeo: any;
  map: any;
  houseWeather: any;
  condition!:string;
  image!:string;
  temperature!:string;

  constructor(private placesSvc: PlacesService) {
    this.houseid = this.route.snapshot.params['id']
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.houseGeo = this.placesSvc.getHouseLocation(this.houseid);

      this.userGeo = this.placesSvc.getUserLocation();

      this.getHouseWeather(`https://api.weatherapi.com/v1/current.json?key=eac9cec4b3714567b0a115018241802&q=${this.houseGeo[0]},${this.houseGeo[1]}&aqi=no`)
        .then(data => {
          this.houseWeather =  data
          this.condition = this.houseWeather.current.condition.text;
          this.image = this.houseWeather.current.condition.icon
          this.temperature = this.houseWeather.current.temp_c;
        });
    }, 1000)
  }

  houseMap() {
    if (this.map) {
      this.map.remove()
    }
    setTimeout(() => {

      this.map = new Map('map').setView(this.houseGeo, 13);

      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);
      marker(this.houseGeo).addTo(this.map)
    }, 1000);
  }

  userMap() {
    this.map.remove()
    setTimeout(() => {
      this.map = new Map('map').setView(this.userGeo, 13);

      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);
      marker(this.userGeo).addTo(this.map)
    }, 1000);
  }

  async getHouseWeather(url: string) {
    let response = await fetch(url);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("error");
    }
  }

  ngAfterViewInit() {
    this.houseMap();
  }
}
