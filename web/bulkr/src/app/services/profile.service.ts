import { Injectable } from '@angular/core';
import { Http, Response} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Recipe } from '../models/recipe';
@Injectable()
export class ProfileService {

  constructor(private http: Http) { }

  getMyPosts(email : string): Observable<Recipe[]>{
    return this.http.get('http://localhost:3000/api/recipe/getAll/' + email).map((response: Response) => response.json()
  .map(item => new Recipe(item.title,item.description)));
  }
}
