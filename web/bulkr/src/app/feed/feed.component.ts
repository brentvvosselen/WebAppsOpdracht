import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  private posts: Post[] = [];
  private counter: number = 0;

  constructor(private postService: PostService) { 
    this.postService.fillFeed("brentvanvosselen@live.be",this.counter).subscribe(posts => {
      posts.forEach(e => {
        this.posts.push(e);
      });
    });
  }

  ngOnInit() {
    
  }
  more(){
    this.counter++;
    this.postService.fillFeed("brentvanvosselen@live.be",this.counter).subscribe(posts => {
      posts.forEach(e => {
        this.posts.push(e);
      });
    });
  }

}
