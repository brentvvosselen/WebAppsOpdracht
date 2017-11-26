import { Injectable } from '@angular/core';
import { Http, Response} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Post } from '../models/post';
import { User } from '../models/user';
@Injectable()
export class ProfileService {

  constructor(private http: Http) { }

  getMyPosts(email: string): Observable<Post[]>{
    return this.http.get('http://localhost:3000/api/recipe/getAll/' + email).map((response: Response) => response.json()
  .map(item => new Post(item._id, item.title,item.description, item.createdAt, item.likes, item.saves)));
  }

  getUserProfile(email: string): Observable<User>{
    return this.http.get('http://localhost:3000/api/user/' + email).map((response: Response) => response.json());
  }

  follow(email: string, followEmail: string){
    return this.http.post('http://localhost:3000/api/user/'+ email + '/follow/'+ followEmail, null).map((response: Response) => response.json());
    
  }
}
