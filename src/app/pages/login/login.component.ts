import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../shared/service/login.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  passwordVisible = false;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private notificationService: NzNotificationService,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit() {
  }

  private initForm() {
    this.form = this.fb.group({
      userName: [null, Validators.required],
      password: [null, Validators.required],
    })
  }

  async onLogin() {
    const {value} = this.form;
    const body = {
      userName: value.userName,
      password: value.password,
    };
    const res = await this.loginService.onLogin(body).toPromise();
    // console.log('res', res);
    if (res?.token) {
      localStorage.setItem('access_token', res.token);
      this.router.navigate([''])
    } else {
      this.notificationService.error('Login Fail', 'Please check your username or password!')
    }
  }
}
