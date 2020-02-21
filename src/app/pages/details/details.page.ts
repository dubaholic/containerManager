import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialsService } from 'src/app/services/materials.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  id: any;
  listId: any;
  grid: any;
  material: any = [];
  reportedDamage: any = [];
  changedLocation: any = [];
  constructor(
    private alertController: AlertController,
    private route: ActivatedRoute,
    private materialsService: MaterialsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('listid');
    this.id = this.route.snapshot.paramMap.get('id');
    
    //this.getMaterialData();

    /*Call of the this method to get the list on each spot */
     this.getMaterialDataFromList();
  }

  /*Method to switch locations of certain goods where there is only 1 good on each spot */
  switchPosition(numberOfplaces: any) {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.grid = JSON.parse(sessionStorage.getItem("grid"));
    for (let item of this.grid) {
      var changePosition = 0;
      if (item != null) {
        if (item.id == this.id) {
          if (numberOfplaces > 0) {
            changePosition = item.position + numberOfplaces;
            console.log(changePosition);
            if (this.grid[changePosition] == null && changePosition <=11) {
              this.grid[item.position] = null;
              item.position = changePosition;
              this.grid[changePosition] = item;
              sessionStorage.setItem("grid", JSON.stringify(this.grid));
              break;
            }
            if (this.grid[changePosition] != null) {
              console.log("Occupied");
            }
          } else {
            changePosition = item.position + numberOfplaces;
            console.log(changePosition);
            if (this.grid[changePosition] == null && changePosition <=11) {
              this.grid[item.position] = null;
              item.position = changePosition;
              this.grid[changePosition] = item;
              console.log(this.grid);
              sessionStorage.setItem("grid", JSON.stringify(this.grid));
            }
            if (this.grid[changePosition] != null) {
              console.log("Occupied");
            }
          } 
        }
      }
    }
  }

  /*Method to switch locations of certain goods where there are multiple goods on the spot */
  switchPositionList(numberOfplaces: any) {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.listId = this.route.snapshot.paramMap.get('listid');
    this.grid = JSON.parse(sessionStorage.getItem("grid"));
    for (let item of this.grid) {
      console.log(item);
      var changePosition = 0;
      if (item != null) {
        if (item.id == this.listId) {
          if (numberOfplaces > 0) {
            changePosition = item.position + numberOfplaces;
            console.log(changePosition);
            if (this.grid[changePosition] == null && changePosition <=11) {
              this.grid[item.position] = null;
              item.position = changePosition;
              this.grid[changePosition] = item;
              sessionStorage.setItem("grid", JSON.stringify(this.grid));
              break;
            }
            if (this.grid[changePosition] != null) {
              console.log("Occupied");
            }
          } else {
            changePosition = item.position + numberOfplaces;
            console.log(changePosition);
            if (this.grid[changePosition] == null && changePosition <=11) {
              this.grid[item.position] = null;
              item.position = changePosition;
              this.grid[changePosition] = item;
              console.log(this.grid);
              sessionStorage.setItem("grid", JSON.stringify(this.grid));
            }
            if (this.grid[changePosition] != null) {
              console.log("Occupied");
            }
          } 
        }
      }
    }
  }

  /*Method to retrieve all the data from a json which just contains an array of all the different goods*/
  getMaterialData() {
    this.materialsService.getMaterials().subscribe((data) => {
      data.forEach(element => {
        if (element.id == this.id) {
          this.material = element;
          console.log(this.material);
        }
      });
    })
  }

  /*Method to retrieve all the data from a json where each spot contains a list of goods */
  getMaterialDataFromList() {
    this.materialsService.getListOfMaterials().subscribe((data) => {
      data.forEach(element => {
        if (element.id == this.listId) {
          this.material = element;
          for(let item of this.material.goods) {
            if(item.goodId = this.id) {
             this.material = item
              return this.material;
            }
          }
        }
      });
    })
  }
  

  async showAlert() {

    const alert = await this.alertController.create({
      header: "Report Damage",
      message: "Report any damage to the goods",
      inputs: [
        {
          name: 'remark',
          placeholder: ''
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: data => {
            if (data.remark != 0) {
              console.log(data.remark);
              localStorage.setItem(this.material.id, data.remark);
              this.reportedDamage = localStorage.getItem(this.material.id);
              this.showAlertSaved();
            }
          }
        }
      ],
    });

    await alert.present();
  }

  async showAlertSaved() {
    const alert = await this.alertController.create({
      header: "Notice",
      message: "Report send to backoffice",
      buttons: [
        {
          text: "OK",
          handler: () => {
          }
        }
      ],
    });

    await alert.present();
  }



}
