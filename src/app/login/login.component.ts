import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error: string;
  model: any = {};
  returnUrl: string;
  loading = false;

  constructor(private authenticationService: AuthenticationService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      
  }

  login(){
    this.loading = true;
    this.authenticationService.login(this.model.email,this.model.password).subscribe(res => {
      this.router.navigate([this.returnUrl]);
      console.log("logged in");
    }, error => {
      console.log("not logged in");
      this.loading = false;
      this.error = "Credentials are wrong";
    });
  }

}
