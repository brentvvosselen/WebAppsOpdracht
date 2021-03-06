import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  

  private _foundUsers: User[];
  private _user: String;

  constructor(private router: Router, private profileService: ProfileService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.authenticationService.user$.subscribe(e => {
      this._user = e;
    })
  }


  search(string: HTMLInputElement){
    this.profileService.findUser(string.value).subscribe(e => {
       this._foundUsers = e;
    });
  }

  get foundUsers(): User[]{
    return this._foundUsers;
  }

  get user(): String{
    return this._user;
  }

  logout(){
    this.authenticationService.logout();
    this.router.navigateByUrl("/login");
  }

  emptysearch(input: HTMLInputElement){
    input.value="";
    this.search(input);
  }

}
