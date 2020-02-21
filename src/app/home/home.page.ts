import { Component } from '@angular/core';
import { MaterialsService } from '../services/materials.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  xCoordinates: any = [1, 2, 3, 4, 5, 6, 7, 8];
  yCoordinates: any = [1, 2, 3, 4, 5, 6, 7, 8];

  allMaterials: any = [];
  grid: any[8] = [];
  searchGrid: any[8] = [];

  selectedFilter: any;
  searchedValue:any;

  constructor(private materialService: MaterialsService, private router: Router) {
    this.selectedFilter = 'nameClient';
    this.getAllMaterials();
  }

  getAllMaterials() {
    this.materialService.getMaterials().subscribe((result) => {
      this.allMaterials = result;
      this.fillGrid();
    });

    /*
      Fill the grid with the json that contains the list with all of the spots on the grid with in each spot a list of different goods. 
    */

    // this.materialService.getListOfMaterials().subscribe((result) => {
    //   this.allMaterials = result;
    //   this.fillGrid();
    // })
    
  }

  search() {
    this.grid = JSON.parse(sessionStorage.getItem("grid"));
    this.searchGrid = [];
    for(var i = 0; i <= 10; i++) {
      var material = this.grid[i];
      if(material != null) {
        switch(this.selectedFilter) {
          case 'nameClient':
            if(this.grid[material.position].nameClient == this.searchedValue) {
              this.searchGrid[material.position] = material;
              console.log(material);
            }
            break;
          case 'id':
            if(this.grid[material.position].id == this.searchedValue) {
              this.searchGrid[material.position] = material;
              console.log(material);
            }
            break;
          case 'nameGoods':
            if(this.grid[material.position].nameGoods == this.searchedValue) {
              this.searchGrid[material.position] = material;
              console.log(material);
            }
            break;
          default:
            console.log("filter failed");
            break;
        }
      } this.searchGrid.push(null);
     }
    console.log(this.searchGrid);
    sessionStorage.setItem("searchGrid", JSON.stringify(this.searchGrid));
    this.fillSearchGrid();
  }

  showList(id: any) {
    this.router.navigateByUrl('/list/'+id);
  }

  showDetails(id: any) {
    this.router.navigateByUrl('/detailsitem/'+id);
  }

  amount(id: any) {
    this.grid = JSON.parse(sessionStorage.getItem("grid"));
    if(id != null) {
      for(let item of this.allMaterials) {
        if(item != null && item.id == id) {
          var total = 0;
          for(let good of item.goods) {
            total +=good.amount;
          }
          return total;
        }
      }
    } 
    return 0;
    
  }

  fillGrid() {
    this.grid = JSON.parse(sessionStorage.getItem("grid"));
    if (this.grid == null) {
      this.grid = [];
      for (let material of this.allMaterials) {
        if (material != null) {
          this.grid[material.id] = material;
        }
        if (material == null) {
          this.grid.push(null);
        }
      }
      sessionStorage.setItem("grid", JSON.stringify(this.grid));
    }
    if(this.grid.length > 12) {
      sessionStorage.clear();
    }
  }

  fillSearchGrid() {
    this.grid = JSON.parse(sessionStorage.getItem("searchGrid"));
    if (this.grid == null) {
      this.grid = [];
      for (let material of this.allMaterials) {
        if (material != null) {
          this.grid[material.id] = material;
        }
        if (material == null) {
          this.grid.push(null);
        }
      }
      sessionStorage.setItem("searchGrid", JSON.stringify(this.grid));
    }
    if(this.grid.length > 12) {
      sessionStorage.clear();
    }
  }

}
