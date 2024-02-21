import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {HousingService} from '../housing.service';
import {HousingLocation} from '../housinglocation';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule, RouterLink, NgOptimizedImage, FormsModule],
  template: `
    <article>
      <img class="listing-photo" [src]="housingLocation?.photo"
           alt="Exterior photo of {{housingLocation?.name}}"/>
      <section class="listing-description">
        <h2 class="listing-heading">{{housingLocation?.name}}</h2>
        <p class="listing-location">{{housingLocation?.city}}, {{housingLocation?.state}}</p>
      </section>
      <section class="listing-features">
        <h2 class="section-heading">About this housing location</h2>
        <ul>
          <li>Units available: {{housingLocation?.availableUnits}}</li>
          <li>Does this location have wifi: {{housingLocation?.wifi}}</li>
          <li>Does this location have laundry: {{housingLocation?.laundry}}</li>
          <li>valoration: {{housingLocation?.valoration}}/5</li>
          <li>
            <img [src]="valorationSrc" width="100px" height="100px">
          </li>
          <input [(ngModel)]="valoration" type="number" min="0" max="5" id="valoration">
          <button (click)="submitValoration()">Submit Valoration</button>
        </ul>
      </section>
      <section class="listing-apply">
        <h2 class="section-heading">Apply now to live here</h2>
        <form [formGroup]="applyForm" (submit)="submitApplication()">
          <label for="first-name">First Name</label>
          <input id="first-name" type="text" formControlName="firstName">

          <label for="last-name">Last Name</label>
          <input id="last-name" type="text" formControlName="lastName">

          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email">
          <button type="submit" class="primary">Apply now</button>
        </form>
        <br>
        <button [routerLink]="['/map', housingLocation?.id]">See map</button>
      </section>
    </article>
  `,
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit{

  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  housingLocation: HousingLocation | undefined;
  valorationSrc?:String;
  valoration?:number;
  applyForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
  });
  ngOnInit(){
    setTimeout(()=>{
      if(this.housingLocation?.id!==undefined) //aunque el undefined parezca redundante, si el id de la casa es 0, no pasa de aqui
      if(localStorage.getItem(this.housingLocation.id.toString())){
        let val = localStorage.getItem(this.housingLocation.id.toString());
        if(val!==null){
        this.housingLocation.valoration = parseInt(val);
        this.setValoration();
        }
      }else{
        this.setValoration()
      }
    this.setValoration();
    }, 1000)
  }
  constructor() {
    const housingLocationId = parseInt(this.route.snapshot.params['id'], 10);
    this.housingService.getHousingLocationById(housingLocationId).then(housingLocation => {
      this.housingLocation = housingLocation;
    });
  }
  submitApplication() {
    if(this.applyForm.valid){
      this.housingService.submitApplication(
        this.applyForm.value.firstName ?? '',
        this.applyForm.value.lastName ?? '',
        this.applyForm.value.email ?? ''
      );
    }else{
      console.log("Invalid form")
    }
  }
  setValoration(){
      if(this.housingLocation?.valoration || this.housingLocation?.valoration ===0){
        let value = this.housingLocation.valoration
        let sources = ["horrible", "bad", "meh", "middle", "good", "very_good"];
        this.valorationSrc = "../../assets/" + sources[value] + ".png"
        this.valoration = value;
        localStorage.setItem(this.housingLocation.id.toString(), value.toString())
      }
  }
  submitValoration(){
    if(this.housingLocation?.valoration !== undefined && this.valoration !==undefined){
      this.housingLocation.valoration = this.valoration;
      this.setValoration();
    }
  }
}
