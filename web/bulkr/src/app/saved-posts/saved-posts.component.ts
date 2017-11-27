import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { Post } from '../models/post';

@Component({
  selector: 'app-saved-posts',
  templateUrl: './saved-posts.component.html',
  styleUrls: ['./saved-posts.component.css']
})
export class SavedPostsComponent implements OnInit {

  private _savedPosts: Post[];

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.postService.getSavedPosts("brentvanvosselen@live.be").subscribe(posts => {this._savedPosts = posts; console.log(posts);});
    console.log(this._savedPosts);
  }

  get savedPosts(): Post[]{
    return this._savedPosts;
  }

}
