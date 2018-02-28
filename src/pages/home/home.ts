import {ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import 'rxjs/add/operator/map';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PriceService} from "../services/PriceService";

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  headers = new HttpHeaders({
    'Authorization': 'Token 977zOJkGCisL2BqDZ35vDk6wPx9K6xCWCRo8W7wb',
    'Accept-Language': 'en_US',
    'Content-Type': 'application/json',
  });
  url : string = "https://api.uber.com/v1.2/estimates/price";

  constructor(public http: HttpClient, public navCtrl: NavController, public geolocation: Geolocation, public priceService: PriceService,
  public cdRef: ChangeDetectorRef) {
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    let directionsService = new google.maps.DirectionsService();
    let directionsDisplay = new google.maps.DirectionsRenderer();
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      directionsDisplay.setMap(this.map);

      let startMarker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });

      google.maps.event.addListener(this.map, 'click',  (event)  => {
        let request = {
          origin: latLng,
          destination: event.latLng,
          travelMode: google.maps.TravelMode.DRIVING
        };
        this.url+="?start_latitude="+latLng.lat()+"&start_longitude="+latLng.lng()+"&end_latitude="+event.latLng.lat()+"&end_longitude="+event.latLng.lng();
        let HttpOptions = { headers: this.headers };
        console.log(this.url);
        console.log(HttpOptions);
        this.http.get<PriceList>(this.url, HttpOptions)
          .subscribe(data => {
            console.log(data);
            let estimation: Array<Object> = new Array();
            for(let price of data.prices){
              estimation.push(price);
            }
            this.priceService.setEstimations(estimation);
            this.cdRef.detectChanges();
          }, err => {
            console.log(err);
          });
        directionsService.route(request, function (response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            directionsDisplay.setMap(this.map);
            startMarker.setMap(null);
          } else {
            alert("Directions Request from failed: " + status);
          }
        });
      })

    }, (err) => {
      console.log(err);
    });
  }

}

export interface PriceList{
  prices: Object[];
}
