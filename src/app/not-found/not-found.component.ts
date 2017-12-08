import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(private router: Router, private authenticationService: AuthenticationService) {
    if(!this.authenticationService.user$.value){
    this.router.navigateByUrl("/login");
  } }

  ngOnInit() {
  }

}
