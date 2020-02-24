import { Injectable } from '@angular/core';
import { Material } from '../models/Material';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialsService {
  materialCount: number;
  materials: any = [];
  
  materialsData = './assets/data/materials.json';
  materialsDataList = './assets/data/materialslist.json';
  constructor(private http: HttpClient) { }

  getMaterials(): Observable<any>{
    return this.http.get(this.materialsData);
  }

  getListOfMaterials(): Observable<any> {
    return this.http.get(this.materialsDataList);
  }
}
