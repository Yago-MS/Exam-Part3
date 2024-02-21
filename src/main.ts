import {bootstrapApplication, provideProtractorTestingSupport} from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import routeConfig from './app/app.routes'
import {provideRouter} from "@angular/router";

if(!navigator.geolocation){
  alert("tu navegador no es compatible con geolocation")
  throw Error("El navegador no es compatible con geolocation")
}
bootstrapApplication(AppComponent, {
  providers:[
    provideProtractorTestingSupport(),
    provideRouter(routeConfig)
  ]
}).catch((err) => console.error(err));
