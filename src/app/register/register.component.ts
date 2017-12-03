import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators, FormControl } from '@angular/forms';
import { ValidatorFn, AbstractControl} from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { Observable } from 'rxjs/Observable';
import { matchOtherValidator } from './matchOther';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  model: any = {};

  registerForm: FormGroup;
  
  constructor(private authenticationService: AuthenticationService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
        email: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-z0-9._%+-]+@[a-z0-9]+\\.[a-z]{2,3}')]],
        password: ['', [Validators.required, Validators.minLength(3)]],
        passwordConfirm: ['', [Validators.required, Validators.minLength(3), matchOtherValidator('password')]],
      });

    //background
    document.querySelector('body').classList.add('bg-red');
  }

  ngOnDestroy(): void{
    document.querySelector('body').classList.remove('bg-red');
  }

  serverSideValidateUsername(): ValidatorFn {
    return (control: AbstractControl): 
      Observable<{ [key: string]: any }> => {
      return this.authenticationService.
        checkUserNameAvailability(control.value).map(available => {
        if (available) {
          return null;
        }
        return { userAlreadyExists: true };
      })
    };

  }

  register(){
     this.model = {
       email: this.registerForm.get('email').value,
       password: this.registerForm.get('password').value,
       passwordConfirm: this.registerForm.get('passwordConfirm').value
     }
     this.authenticationService.checkUserNameAvailability(this.model.email).subscribe(e => {
       if(e == false){
         console.log('USER EXISTS');
       }else{
        this.authenticationService.register(this.model.email,this.model.password).subscribe(value => {
          this.router.navigate(['/login']);
         });
       }
       });

       
     }
  }



function passwordValidator(length: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    return control.value.length < length ? { 'passwordTooShort': 
      { requiredLength: length, actualLength: control.value.length } } : null;
  };
}

function comparePasswords(control: AbstractControl): { [key: string]: any } {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password.value === confirmPassword.value ? null : { 'passwordsDiffer': true };
}
