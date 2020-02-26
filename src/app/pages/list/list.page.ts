import { Component, OnInit } from '@angular/core';
import { MaterialsService } from 'src/app/services/materials.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  constructor(private materialsService: MaterialsService, private route: ActivatedRoute, private router: Router) { }

  goods: any;
  id: any;
  neededGood: any;

  ngOnInit() {
    this.getListOfGoods();
  }

  getListOfGoods() {
    this.goods = [];
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.goods = JSON.parse(sessionStorage.getItem("grid"));
    
    if (this.goods == null) {
      this.materialsService.getListOfMaterials().subscribe((data) => {
        this.goods = data;
        this.getgoodsOfId(this.id);
      })
    }

    this.getgoodsOfId(this.id);

  }

  details(id: any, goodId: any) {
    this.router.navigateByUrl('/details/' + id + "/" + goodId);

  }

  getgoodsOfId(id: any) {
    for (let item of this.goods) {
      if (item != null) {
        if (item.id == id) {
          this.neededGood = item.goods;
          sessionStorage.setItem(id, JSON.stringify(item.goods));
        }
      }

    }
  }
}
