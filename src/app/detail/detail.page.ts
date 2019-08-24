import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  // Initite variable get from modal page
  val;

  // Initiate variable for modal page
  Arrived = false;
  inputCamera = false;

  // Initaite variable for upload image
  image: any = [];
  reader: any = []

  constructor(public modalController: ModalController, public navParams: NavParams) {

    // Get variable from modal page
    this.val = this.navParams.get('value');
  }

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
   * dismiss() is function to get back from modal page to home page
   */
  dismiss() {
    this.modalController.dismiss();
  }

  /**
   * arrived() is function make boolean Arrived true when user click Arrived button
   */
  arrived() {
    this.Arrived = true;
  }

  /**
   * applyForComponent is function run when use click Apply for Component button
   */
  applyForComponent() {

    // DO SOMETHING
  }

  /**
   * compleRepair is function run when use click compler repair button
   */
  compleRepair() {
    this.inputCamera = true;

    // DO SOMETHING
  }

  /**
   * 
   * @param event is parameter when image is selected
   * 
   * uploadImage function is funtcion to select one or more image from device
   */
  uploadImage(event) { // called each time file input changes

    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.reader[i] = new FileReader();
        this.reader[i].readAsDataURL(event.target.files[i]); // read file as data url
        this.reader[i].onload = (event) => { // called once readAsDataURL is completed
          this.image[i] = this.reader[i].result;
        }
      }

      // This is for debugging
      // console.log(this.image);
    }
  }

}
