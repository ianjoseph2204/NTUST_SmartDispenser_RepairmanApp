import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetailPage } from '../detail/detail.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };


  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }



  async openDetail() {

    const modal = await this.modalController.create({
      component: DetailPage,
      componentProps: { value: 123 },
      cssClass: 'my-custom-modal-css'

    });

    await modal.present();
  }

}
