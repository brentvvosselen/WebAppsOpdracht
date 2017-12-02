import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../models/post';
import { PostService } from '../services/post.service';
import { forEach } from '@angular/router/src/utils/collection';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})
export class PostViewComponent implements OnInit {
  
  @Input() public post: Post;
  private _likes: number;
  private _liked: boolean;
  private _saved: boolean;
  private _user: string;

  constructor(private postService: PostService, private authenticationService: AuthenticationService) { 
    
  }

  ngOnInit() {
    this._user = this.authenticationService.user$.value;
    console.log(this.post);
    if(this.post.id === undefined){
      this.post.id = this.post._id;
    }
    this._likes = Object.keys(this.post.likes).length;
    /*check if liked*/
    for(let user of this.post.likes){
      if(user.email === this._user){
        this._liked = true;
      }
    }
    /*check if saved*/
    for(let user of this.post.saves){
      if(user.email === this._user){
        this._saved = true;
      }
    }

  }

  save(){
    if(!this._saved){
      this.postService.savePost(this._user,this.post.id).subscribe(res => console.log(res));
      this._saved = true;
    }
    
  }

  bulkit(){
    if(!this._liked){
      console.log(this.post.id);
      this.postService.bulkPost(this._user,this.post.id).subscribe(res => console.log(res));
      this._likes += 1;
      this._liked = true;
    }
    
  }

  get liked():boolean{
    return this._liked;
  }
  get likes():number{
    return this._likes;
  }
  get saved():boolean{
    return this._saved;
  }
}
