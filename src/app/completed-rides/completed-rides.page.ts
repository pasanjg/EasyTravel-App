import { Component, OnInit } from '@angular/core';
import { Ride, RideService } from '../services/ride.service/ride.service';
import { ModalController } from '@ionic/angular';
import { RideDetailsModalPage } from '../ride-details-modal/ride-details-modal.page';
import { Storage } from '@ionic/storage';
import { UserServiceService } from '../services/user-service/user-service.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-completed-rides',
  templateUrl: './completed-rides.page.html',
  styleUrls: ['./completed-rides.page.scss'],
})
export class CompletedRidesPage implements OnInit {

  userId: any = 'XpLThkfoeYcPTquTA2RIcoCLuO12';
  // userId: any = ' ';
  user: any;
  rides: Ride[];

  constructor(private rideService: RideService, private modalController: ModalController, private storage: Storage, private fireStore: AngularFirestore) {

    this.storage.get('user').then((val) => {
      this.user = val;
      this.userId = this.user.userId;
      console.log(this.user.userId);
    });

  }

  ngOnInit() {

    this.fireStore.collection('passengers').doc(this.userId).valueChanges()
      .subscribe(user => {
        this.user = user;
        this.getRides(this.userId);
      });

  }

  getRides(userId) {

    this.rideService.getRides(userId).subscribe(ride => {
      this.rides = null;
      ride.forEach(element => {
        if (element.status == 'upcoming' || element.status == 'ongoing') {
          this.rides = ride;
        }
      });
    });

  }

  async viewRide(ride) {
    const modal = await this.modalController.create({
      component: RideDetailsModalPage,
      componentProps: {
        'ride': ride
      }
    });
    return await modal.present();
  }

  removeRide(rideId) {
    this.rideService.removeRide(rideId);
  }

}
