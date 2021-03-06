import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/servies/alert.service';
import { LoadingService } from 'src/app/servies/loading.service';
import { Alert } from 'src/app/classes/alert';
import { AlertType } from 'src/app/enum/alert-type.enum';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  public signupForm: FormGroup;
  private returnUrl: string;
  private subscription: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  private createForm(): void {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  public submit(): void {
    if (this.signupForm.valid) {
      const { firstName, lastName, email, password } = this.signupForm.value;

      this.subscription.push(
        this.auth.signup(firstName, lastName, email, password).subscribe(success => {
          if (success) {
            this.router.navigate(['/chat'])
          } else {
            const failedSignupAlert = new Alert('There was a problem signing up, try again.', AlertType.Danger);
            this.alertService.alerts.next(failedSignupAlert);
          }

          this.loadingService.isLoading.next(false)
        })
      );
    } else {
      const failedSignupAlert = new Alert('Please enter a valid name, email and password, try again.', AlertType.Danger);
      this.alertService.alerts.next(failedSignupAlert);
    }
  }

  ngOnDestroy() {
    this.subscription.forEach(sub => sub.unsubscribe())
  }
}
