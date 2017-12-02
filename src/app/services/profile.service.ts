import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Post } from '../models/post';
import { User } from '../models/user';
@Injectable()
export class ProfileService {

  private _prefix: string = "http://localhost:3000";
  private auth;

  constructor(private http: Http) { }

  getMyPosts(email: string): Observable<Post[]>{
    return this.http.get(this._prefix + '/api/recipe/getAll/' + email,this.jwt()).map((response: Response) => response.json()
  .map(item => new Post(item._id, item.title,item.description, item.createdAt, item.likes, item.saves)));
  }

  getUserProfile(email: string): Observable<User>{
    return this.http.get(this._prefix + '/api/user/' + email, this.jwt()).map((response: Response) => response.json());
  }

  follow(email: string, followEmail: string){
    return this.http.post(this._prefix + '/api/user/'+ email + '/follow/'+ followEmail, null,this.jwt()).map((response: Response) => response.json());
  }

  findUser(value: string): Observable<String[]>{
    return this.http.get(this._prefix + '/api/user/find/' + value,this.jwt()).map((response: Response) => response.json().map(user => user.email));
  }

  private jwt() {
    // create authorization header with jwt token
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
        let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
        return new RequestOptions({ headers: headers });
    }
}
}
