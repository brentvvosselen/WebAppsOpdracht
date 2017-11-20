import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Post } from '../models/post';  
 
@Injectable()
export class PostService {

  constructor(private http: Http) { }

  addPost(email: string, post: Post){
    return this.http.post("http://localhost:3000/api/recipe/add/" + email, post).map((response: Response) => response.json());
  }

  savePost(email: string, recipeid: string){
    return this.http.post("http://localhost:3000/api/recipe/save/" + email, {recipeid: recipeid}).map((response: Response) => response.json());
  }

  getSavedPosts(email: string): Observable<Post[]>{
    return this.http.get("http://localhost:3000/api/recipes/saved/"+ email).map((response: Response) => response.json().map(item => new Post(item._id, item.title, item.description, item.createdAt, item.likes,item.saves)));
  }

  bulkPost(email: string, recipeid: string){
    return this.http.put("http://localhost:3000/api/recipes/like/"+email, {recipeid: recipeid}).map((response: Response) => response.json());
  }

}
