import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Post } from '../models/post';
import { User } from '../models/user';
import { Image } from '../models/image';

@Injectable()
export class ProfileService {

  private _prefix: string = "";
  private auth;

  constructor(private http: Http) { }

  getMyPosts(email: string): Observable<Post[]>{
    return this.http.get(this._prefix + '/api/recipe/getAll/' + email,this.jwt()).map((response: Response) => response.json()
  .map(item => new Post(item._id, item.title,item.description, item.createdAt, item.likes, item.saves, item.picture, item.poster)));
  }

  getUserProfile(email: string): Observable<User>{
    return this.http.get(this._prefix + '/api/user/' + email, this.jwt()).map((response: Response) => response.json());
  }

  getProfilePicture(email: string): Observable<Image>{
    return this.http.get(this._prefix + '/api/user/picture/' + email, this.jwt()).map((response: Response) => response.json());
  }

  follow(email: string, followEmail: string){
    return this.http.post(this._prefix + '/api/user/'+ email + '/follow/'+ followEmail, null,this.jwt()).map((response: Response) => response.json());
  }

  unfollow(email: string, unfollowEmail: string){
    return this.http.put(this._prefix + '/api/user/' + email + '/unfollow/'+ unfollowEmail,null,this.jwt()).map((response: Response) => response.json());
  }

  doesFollow(email: string, follow: string){
    console.log("call");
    return this.http.get(this._prefix + '/api/user/' + email + '/doesFollow/' + follow,this.jwt()).map((response: Response) => response.json());
  }

  findUser(value: string): Observable<User[]>{
    if(value === ''){
      value = '+nouser+';
    }
    return this.http.get(this._prefix + '/api/user/find/' + value,this.jwt()).map((response: Response) => response.json().map(user => new User(undefined,user.email,undefined,undefined,user.picture)));
  }

  addPicture(email: string, picture: Image){
    return this.http.post(this._prefix + '/api/user/picture/' + email, picture,this.jwt()).map((response: Response) => response.json());
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
