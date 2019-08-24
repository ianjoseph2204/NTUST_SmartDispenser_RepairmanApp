import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetailPage } from '../detail/detail.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // Iniate variable to regulate slide
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  // Intiate variable for this page
  click = false;

  constructor(public modalController: ModalController) { }

  /**
   * ngOnInit() is the function that called when page being loaded.
   * Like in many programming, it's like main function.
   * 
   * If want to use async function:
   * - create new function with async (ex: async myFunctionName() { } )
   * - call in here with "this.myFunctionName();"
   */
  ngOnInit() {
  }


  /**
   * openDetail() function is function run to activate modal page
   */
  async openDetail() {

    // Change card style
    this.click = true;

    // Create modal page
    let modal = await this.modalController.create({
      component: DetailPage,
      componentProps: { value: 123, },
      cssClass: 'my-custom-modal-css'
    });

    // Funtion when modal page is close
    modal.onDidDismiss().then(() => {
      this.click = false;
    });

    await modal.present();
  }
}
