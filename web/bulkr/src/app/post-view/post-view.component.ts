import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../models/post';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})
export class PostViewComponent implements OnInit {
  
  @Input() public post: Post;

  constructor(private postService: PostService) { }

  ngOnInit() {
  }

  save(){
    console.log("save" + this.post.id);
    this.postService.savePost("brentvanvosselen@live.be",this.post.id).subscribe(res => console.log(res));
  
  }

}
