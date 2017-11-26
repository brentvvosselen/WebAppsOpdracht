import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { ActivatedRoute } from '@angular/router';

import { User } from '../models/user';
import { Post } from '../models/post';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  private email: string;
  private user: User;
  private posts: Post[];
  private follows: boolean = false;

  constructor(private profileService: ProfileService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => this.email = params.email)
    
    this.profileService.getUserProfile(this.email).subscribe(user => {
      this.user = user
      this.posts = this.user.posts.map(item => new Post(item["_id"],item.title,item.description,item.createdAt,item.likes,item.saves));
      console.log(this.user);
    });

    

  }

  ngOnInit() {
  }

  follow(){
    console.log("follow");
    this.profileService.follow("brentvanvosselen@live.be",this.user.email).subscribe(result => console.log(result));
  }

}
