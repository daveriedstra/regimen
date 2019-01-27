import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';

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

  constructor(private auth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
  }

  doLogIn(e: Event, form: NgForm) {
    e.preventDefault();

    if (form.invalid) {
      return;
    }

    this.auth.auth.signInWithEmailAndPassword(this.email, this.pass)
      .then(u => {
        this.router.navigateByUrl('/');
      }, err => {
        this.errorMessage = err;
      });
  }

  doSignUp(e: Event, form: NgForm) {
    e.preventDefault();

    if (form.invalid) {
      return;
    }

    this.auth.auth.createUserWithEmailAndPassword(this.email, this.pass)
      .then(u => {
        this.router.navigateByUrl('/');
      }, err => {
        this.errorMessage = err.message;
      });
  }
}
