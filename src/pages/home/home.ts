import {Component, ViewChild, ElementRef} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { NavController } from 'ionic-angular';
declare var google;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	 map: any;
   infoWindow: any;
   alamat: any;
   @ViewChild('map') mapElement: ElementRef;
  constructor(private geolocation: Geolocation,private nativeGeocoder: NativeGeocoder, public navCtrl: NavController) {

  }

  ionViewDidLoad(){
    this.loadMap();
  }

  loadMap(){ 
    this.geolocation.getCurrentPosition().then((resp) => {
       let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
       let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
       //Menampilkan peta
       this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
       //Menambah marker
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        draggable: true,
        position: this.map.getCenter()
      });
     
      //Membuat info window
      this.infoWindow = new google.maps.InfoWindow({
        content: this.alamat
      });

      //Menampilkan info window ketika marker diklik
      google.maps.event.addListener(marker, 'click', () => {
        this.infoWindow.open(this.map, marker);
      });

      this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude)
        .then((result: NativeGeocoderReverseResult[]) =>{
          
          let jln = result[0].thoroughfare;
          let desa = result[0].subLocality;
          let kec = result[0].locality;
          let kab = result[0].subAdministrativeArea;

          this.alamat = jln+", "+desa+", "+kec+", "+kab;
        })
        .catch((error: any) => console.log(error));
        

     }).catch((error) => {
       console.log('Error getting location', error);
     });
     
     let watch = this.geolocation.watchPosition();
     watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
       data.coords.latitude
       data.coords.longitude
     });

    
 
  }

}
