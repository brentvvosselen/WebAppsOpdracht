import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { Recipe } from '../models/recipe';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private _recipes: Recipe[];

  constructor(private _profileService: ProfileService) { }

  ngOnInit() {
    console.log("executing");
    this._profileService.getMyPosts("brentvanvosselen@live.be").subscribe(recipes => {
      this._recipes = recipes;
    console.log(recipes);});
    console.log(this._recipes);
    console.log("end");
  }

}
