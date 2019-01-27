import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showSignUp: boolean = true;
  email = '';
  pass = '';
  confirmPass = '';

  errorMessage: string;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  login() {
  }

  signUp(e: Event, form: NgForm) {
    e.preventDefault();

    if (form.invalid) {
      return;
    }

    this.auth.signUpWithEmail(this.email, this.pass)
      .subscribe(u => {
        this.router.navigateByUrl('/');
      }, err => {
        this.errorMessage = err.message;
      });
  }
}
