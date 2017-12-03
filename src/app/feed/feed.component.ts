import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post';
import { PostService } from '../services/post.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  private _posts: Post[] = [];
  private _counter: number = 0;
  private _user: string;
  private _hasMorePosts = true;

  constructor(private postService: PostService, private authenticationService: AuthenticationService) { 
    this._user = this.authenticationService.user$.value;
    this.postService.fillFeed(this._user,this._counter).subscribe(posts => {
      if (posts.length < 3){
        this._hasMorePosts = false;
      }
      posts.forEach(e => {
        this._posts.push(e);
      });
    });

    console.log(this.authenticationService.user$);
  }

  ngOnInit() {
    
  }
  more(){
    this._counter++;
    this.postService.fillFeed(this._user,this._counter).subscribe(posts => {
      if (posts.length < 3){
        this._hasMorePosts = false;
      }
      posts.forEach(e => {
        this._posts.push(e);
      });
    });
  }

  get posts(): Post[]{
    return this._posts;
  }

  get counter(): number{
    return this._counter;
  }
  
  get hasMorePosts(): boolean{
    return this._hasMorePosts;
  }
}
