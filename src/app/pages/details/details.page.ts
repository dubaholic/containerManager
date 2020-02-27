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
  coordinate: any;
  coordinates: any = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4"];

  constructor(
    private alertController: AlertController,
    private route: ActivatedRoute,
    private materialsService: MaterialsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('listid');
    this.id = this.route.snapshot.paramMap.get('id');

    // this.getMaterialData();

    /*Call of the this method to get the list on each spot */
    this.getMaterialDataFromList();
  }

  /*Method to switch locations of certain goods where there is only 1 good on each spot */
  switchPosition(numberOfplaces: any) {
    this.id = parseInt(this.route.snapshot.paramMap.get('listid'));
    this.grid = JSON.parse(sessionStorage.getItem("grid"));
    for (let item of this.grid) {
      var changePosition = 0;
      if (item != null) {
        if (item.id == this.id) {
          if (numberOfplaces > 0) {
            changePosition = item.position + numberOfplaces;
            if (this.grid[changePosition] == null && changePosition <= 11) {
              this.grid[item.position] = null;
              item.position = changePosition;
              this.grid[changePosition] = item;
              sessionStorage.setItem("grid", JSON.stringify(this.grid));
              this.router.navigateByUrl('/');
              break;
            }
            if (this.grid[changePosition] != null) {
              this.showAlertError();
            }
          } else {
            changePosition = item.position + numberOfplaces;
            if (this.grid[changePosition] == null && changePosition <= 11) {
              this.grid[item.position] = null;
              item.position = changePosition;
              this.grid[changePosition] = item;
              console.log(this.grid);
              sessionStorage.setItem("grid", JSON.stringify(this.grid));
              this.router.navigateByUrl('/');
              break;
            }
            if (this.grid[changePosition] != null) {
              this.showAlertError();
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
      var changePosition = 0;
      if (item != null) {
        if (item.id == this.listId) {
          for (let good of item.goods) {
            if (good.goodId == this.id) {
              //movement to the right and down
              if (numberOfplaces > 0) {
                changePosition = item.position + numberOfplaces;
                //movement to an empty spot in the grid
                if (this.grid[changePosition] == null && changePosition <= 11) {
                  var object = { id: changePosition, goods: [], position: changePosition, weight: 3 };
                  object.goods.push(good);
                  for (let searchgood of this.grid[item.position].goods) {
                    if (good == searchgood) {
                      this.grid[item.position].goods.splice(this.grid[item.position].goods.indexOf(searchgood), 1);
                      break;
                    }
                  }
                    if (this.grid[item.position].goods.length == 0) {
                    this.grid[item.position] = null;
                  }
                  item.position = changePosition;
                  this.grid[changePosition] = object;
                  sessionStorage.setItem("grid", JSON.stringify(this.grid));
                  break;
                }
                //movement to a not empty spot in the grid
                if (this.grid[changePosition] != null) {
                  this.grid[changePosition].goods.push(good);
                  for (let searchgood of this.grid[item.position].goods) {
                    if (searchgood == good) {
                      this.grid[item.position].goods.splice(this.grid[item.position].goods.indexOf(searchgood), 1);
                    }
                  }
                  if (this.grid[item.position].goods.length == 0) {
                    this.grid[item.position] = null;
                    // sessionStorage.setItem("grid", JSON.stringify(this.grid));
                  } sessionStorage.setItem("grid", JSON.stringify(this.grid));
                  
                  // this.showAlertError();
                }
              } 
              // movement to the left and up
              else {
                changePosition = item.position + numberOfplaces;
                //movement to empty spot
                if (this.grid[changePosition] == null && changePosition <= 11) {
                  var object = { id: changePosition, goods: [], position: changePosition, weight: 3 };
                  object.goods.push(good);
                  for (let searchgood of this.grid[item.position].goods) {
                    if (good == searchgood) {
                      this.grid[item.position].goods.splice(this.grid[item.position].goods.indexOf(searchgood), 1);
                      break;
                    }
                  }
                  if (this.grid[item.position].goods.length == 0) {
                    this.grid[item.position] = null;
                  }
                  item.position = changePosition;

                  this.grid[changePosition] = object;
                  sessionStorage.setItem("grid", JSON.stringify(this.grid));
                  break;
                }
                //movement to not empty spot
                if (this.grid[changePosition] != null) {
                  this.grid[changePosition].goods.push(good);
                  for (let searchgood of this.grid[item.position].goods) {
                    if (searchgood == good) {
                      this.grid[item.position].goods.splice(this.grid[item.position].goods.indexOf(searchgood), 1);
                      break;
                    }
                  }
                  if (this.grid[item.position].goods.length == 0) {
                    this.grid[item.position] = null;
                  }
                  sessionStorage.setItem("grid", JSON.stringify(this.grid));
                }
              }
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
        }
      });
    })
  }

  /*Method to retrieve all the data from a json where each spot contains a list of goods */
  getMaterialDataFromList() {
    this.grid = JSON.parse(sessionStorage.getItem('grid'));
    if(this.grid == null) {
      this.materialsService.getListOfMaterials().subscribe((data) => {
      data.forEach(element => {
        if (element.id == this.listId) {
          this.material = element;
          for (let item of this.material.goods) {
            if (item.goodId == this.id) {
              this.material = item;
              return this.material;
            }
          }
        }
      });
    })
  }
  for(let item of this.grid) {
    if(item != null) {
      if(item.id == this.listId) {
        for(let good of item.goods) {
          if(good.goodId == this.id ) {
            this.material = good;
            return this.material;
          }
        }
      }
    }
    
  }
    
  }

  async showAlertError() {
    const alert = await this.alertController.create({
      header: "Error",
      message: "Can't move good to this location",
      buttons: [
        {
          text: 'Confirm',
          handler: () => {
          }
        }
      ]
    })

    await alert.present();
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

  jumpToPlace() {
    switch (this.coordinate) {
      case 'A1':
        this.jumpPosition(0);
        break;
      case 'A2':
        this.jumpPosition(1);
        break;
      case 'A3':
        this.jumpPosition(2);
        break;
      case 'A4':
        this.jumpPosition(3);
        break;
      case 'B1':
        this.jumpPosition(4);
        break;
      case 'B2':
        this.jumpPosition(5);
        break;
      case 'B3':
        this.jumpPosition(6);
        break;
      case 'B4':
        this.jumpPosition(7);
        break;
      case 'C1':
        this.jumpPosition(8);
        break;
      case 'C2':
        this.jumpPosition(9);
        break;
      case 'C3':
        this.jumpPosition(10);
        break;
      case 'C4':
        this.jumpPosition(11);
        break;
      default:
        console.log("doesn't work");
        break;
    }
  }

  jumpPosition(location: any) {
    this.id = parseInt(this.route.snapshot.paramMap.get('listid'));
    this.grid = JSON.parse(sessionStorage.getItem("grid"));
    for (let item of this.grid) {
      var changePosition = location;
      if (item != null) {
        if (item.id == this.id) {
          for(let good of item.goods) {
            console.log(good);
            if (location >= 0) {
              changePosition = location;
              //spot is empty
              if (this.grid[changePosition] == null && changePosition <= 11) {
                var object = {id: changePosition, goods: [], position: changePosition, weight:3};
                object.goods.push(good);
                for (let searchgood of this.grid[item.position].goods) {
                  if (good == searchgood) {
                    this.grid[item.position].goods.splice(this.grid[item.position].goods.indexOf(searchgood), 1);
                    break;
                  }
                }
                if (this.grid[item.position].goods.length == 0) {
                  this.grid[item.position] = null;
                }
                item.position = changePosition;
                this.grid[changePosition] = object;
                sessionStorage.setItem("grid", JSON.stringify(this.grid));
                break;
              }
              //spot is not empty
              if (this.grid[changePosition] != null) {
                this.grid[changePosition].goods.push(good);
                  for (let searchgood of this.grid[item.position].goods) {
                    if (searchgood == good) {
                      this.grid[item.position].goods.splice(this.grid[item.position].goods.indexOf(searchgood), 1);
                      break;
                    }
                  }
                  if (this.grid[item.position].goods.length == 0) {
                    this.grid[item.position] = null;
                  }
                  sessionStorage.setItem("grid", JSON.stringify(this.grid));
              }
            }
          }
          
        }
      }
    }
  }
}
