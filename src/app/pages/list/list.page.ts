import { Component, OnInit } from '@angular/core';
import { MaterialsService } from 'src/app/services/materials.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  constructor(private materialsService: MaterialsService, private route: ActivatedRoute) { }

  goods:any;
  id: any;
  neededGood: any;

  ngOnInit() {
    this.getListOfGoods();
  }

  getListOfGoods() {
    this.goods = [];
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.materialsService.getListOfMaterials().subscribe((data) => {
      this.goods = data;
      console.log(this.goods);
      this.getgoodsOfId(this.id);
    })
  }

  getgoodsOfId(id: any) {
    for(let item of this.goods) {
      if(item.id == id) {
        this.neededGood = item.goods;
        sessionStorage.setItem(id, JSON.stringify(item.goods));
      }
    }
  }

}
