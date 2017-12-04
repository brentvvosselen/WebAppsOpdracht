import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { ActivatedRoute } from '@angular/router';

import { User } from '../models/user';
import { Post } from '../models/post';
import { Image } from '../models/image';
import { AuthenticationService } from '../authentication.service';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnChanges {
  ngOnChanges(): void {
    console.log("change");
  }

  private _email: string;
  private _user: User;
  private _posts: Post[];
  private _follows: boolean = false;
  private _profileImage: Image

  constructor(private profileService: ProfileService, private route: ActivatedRoute, private authenticationService: AuthenticationService) {
    this.route.paramMap.subscribe(params => {
      this._email = params["params"]["email"];
      console.log(params);

    
    
    
    this.profileService.getUserProfile(this._email).subscribe(user => {
      this._user = user
      this._posts = this._user.posts.map(item => new Post(item["_id"],item.title,item.description,item.createdAt,item.likes,item.saves));
      console.log(this._user);
      this._profileImage = this._user.picture;
      this.profileService.doesFollow(this.authenticationService.user$.value,this.user.email).subscribe(result => {
        this._follows = result;
      });
    });

  });

    

  }

  ngOnInit() {
    
  }

  follow(){
    console.log("follow");
    this.profileService.follow(this.authenticationService.user$.value,this.user.email).subscribe(result => console.log(result));
    this._follows = true;
  }

  unfollow(){
    console.log("unfollow");
    this.profileService.unfollow(this.authenticationService.user$.value,this.user.email).subscribe(result => console.log(result));
    this._follows = false;
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

  get profileImage(): Image{
    return this._profileImage;
  }
  
}
