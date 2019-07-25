import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPagePage } from '../modal-page/modal-page.page';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  constructor(public modalController: ModalController) { }



  ngOnInit() {
  }

  async openModal() {

    const modal = await this.modalController.create({
      component: ModalPagePage,
      componentProps: { value: 123 },
      cssClass: 'my-custom-modal-css'

    });

    await modal.present();
  }
}
