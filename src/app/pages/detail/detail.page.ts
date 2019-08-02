import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  data: any;
  Arrived = false;
  inputCamera = false;


  constructor(
    public modalController: ModalController, 
    public navParams: NavParams
  ) {
    this.data = navParams.get('Data');
  }

  ngOnInit() {
   
  }

  dismiss() {
    this.modalController.dismiss();
  }

  arrived() {
    this.Arrived = true;
  }

  applyForComponent() {
  }

  compleRepair() {
    this.inputCamera = true;

    // Function to extend the interface
  }

  image: any = [];
  reader: any = []
  uploadImage(event) { // called each time file input changes

    console.log(event.target.files.FileList);
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.reader[i] = new FileReader();
        this.reader[i].readAsDataURL(event.target.files[i]); // read file as data url
        this.reader[i].onload = (event) => { // called once readAsDataURL is completed
          this.image[i] = this.reader[i].result;
        }
      }
      console.log(this.image);
    }
  }

}
