import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  private _foundUsers: String[];

  constructor(private router: Router, private profileService: ProfileService) { }

  ngOnInit() {
  }

  search(string: HTMLInputElement){
    console.log(string.value)
    
    this.profileService.findUser(string.value).subscribe(e => {
       this._foundUsers = e;
    });
  }

  get foundUsers(): String[]{
    return this._foundUsers;
  }

}
