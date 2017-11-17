import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  
  private post: Post;
  currentUser: String;

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.post = new Post();
  }

  add(){
    this.postService.addPost("brentvanvosselen@live.be",this.post).subscribe(res => (console.log(res)));
  }

}
