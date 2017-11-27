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

  private _email: string;
  private _user: User;
  private _posts: Post[];
  private _follows: boolean = false;

  constructor(private profileService: ProfileService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => this._email = params.email)
    
    this.profileService.getUserProfile(this._email).subscribe(user => {
      this._user = user
      this._posts = this._user.posts.map(item => new Post(item["_id"],item.title,item.description,item.createdAt,item.likes,item.saves));
      console.log(this._user);
    });

    

  }

  ngOnInit() {
  }

  follow(){
    console.log("follow");
    this.profileService.follow("brentvanvosselen@live.be",this.user.email).subscribe(result => console.log(result));
  }

  get email(): string{
    return this._email;
  }

  get user(): User{
    return this._user;
  }

  get posts(): Post[]{
    return this._posts;
  }

  get follows(): boolean{
    return this._follows;
  }

}