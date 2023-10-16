import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../shared/service/login.service";
import { differenceInCalendarDays, setHours } from 'date-fns';
import * as moment from "moment";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  readonly EMAIL_PATTERN = '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
  readonly patenPassword = /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/;
  passwordVisible = false;
  password?: string;
  validateEmail = {
    email: [
      {type: 'required', message: 'The required field!'},
      {type: 'pattern', message: 'Wrong email type'},
    ],
  };
  form: FormGroup;
  validatorPassword: boolean;
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private notificationService: NzNotificationService,
    private router: Router
  ) {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      email: [null, Validators.compose([Validators.required, Validators.pattern(this.EMAIL_PATTERN)])],
      username: [null, Validators.required],
      password: [null, Validators.required],
      fullName: [''],
      dateofBirth: [''],
      address: [''],
      gender: [''],
      phoneNumber: ['']
    })
  }

  onInput(target: any) {
    if (target.value !== null && target.value !== '') {
      this.validatorPassword = !this.patenPassword.test(target.value);
      console.log(this.validatorPassword)
    }
  }

  async onSubmit() {
    const {valid, value} = this.form;
    if (valid) {
      // console.log(value);
      value.dateofBirth = moment(value.dateofBirth).format('YYYY-MM-DD');
      value.gender = value.gender === 'F' ? 0 : 1;
      const res = await this.loginService.onRegister(value).toPromise();
      // console.log(res);
      if (res && res.Object.entries(res).length > 0 && res?.token) {
        this.notificationService.success('Register success', 'Register account success! Please wait we will direct you to home')
        localStorage.setItem('access_token', res.token);
        this.router.navigate([''])
      } else {
        this.notificationService.error('Register fail', 'Register account failure! Please check your information and try again')
      }
    }
  }

  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.today) > 0;
}
