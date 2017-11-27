import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  private _posts: Post[] = [];
  private _counter: number = 0;

  constructor(private postService: PostService) { 
    this.postService.fillFeed("brentvanvosselen@live.be",this._counter).subscribe(posts => {
      posts.forEach(e => {
        this._posts.push(e);
      });
    });
  }

  ngOnInit() {
    
  }
  more(){
    this._counter++;
    this.postService.fillFeed("brentvanvosselen@live.be",this._counter).subscribe(posts => {
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

}
