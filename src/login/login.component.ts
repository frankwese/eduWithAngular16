import { Component, signal, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AuthenticationService, LoginInfo, RestConstants } from 'ngx-edu-sharing-api';
import { finalize, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

const notLoggedIn: LoginInfo = {
  currentScope: '',
  isAdmin: false,
  isGuest: true,
  isValidLogin: false,
  sessionTimeout: 0,
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,

    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @ViewChild('dialog_template')
  dialogTemplate: TemplateRef<any>;
  loggedIn = signal(false);
  isLoading = true;
  showPassword = false;
  username: string;
  password: string;
  loginData: BehaviorSubject<LoginInfo> = new BehaviorSubject<LoginInfo>(notLoggedIn);

  constructor(
    public authenticationApi: AuthenticationService,
    protected dialogHandler: MatDialog,
    private router: Router
  ) {
    this.authenticationApi
      .observeLoginInfo()
      .pipe(takeUntilDestroyed())
      .subscribe((loginInfo) => {
        this.isLoading = false;
        this.loginData.next(loginInfo);
        this.loggedIn.update((oldvalue) => {
          if (!oldvalue && loginInfo.statusCode === RestConstants.STATUS_CODE_OK && !loginInfo.isGuest) {
            this.forceReload();
          }
          return loginInfo.statusCode === RestConstants.STATUS_CODE_OK && !loginInfo.isGuest;
        });

        if (!this.loggedIn()) {
          const _openedDialog = this.dialogHandler.open(this.dialogTemplate);
        }
      });
  }

  private forceReload() {
    const currentRoute = this.router.routerState.root.firstChild;
    this.router.navigate(currentRoute!.snapshot.url || ['/'], {
      queryParams: { forceReload: new Date().getTime() },
      onSameUrlNavigation: 'reload',
      skipLocationChange: true,
    });
  }

  login() {
    this.isLoading = true;
    this.authenticationApi
      .login(this.username, this.password)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((data) => {
        if (data.statusCode === RestConstants.STATUS_CODE_OK) {
          this.loginData.next(data);
        } else {
          this.password = '';
        }
      });
  }
  public logout() {
    return this.authenticationApi.logout().pipe(
      tap((data) => {
        this.loginData.next(data);
      })
    );
  }

  getInputType(): string {
    if (this.showPassword) {
      return 'text';
    } else {
      return 'password';
    }
  }
}
