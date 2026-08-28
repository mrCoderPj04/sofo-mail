import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { MfaComponent } from './features/auth/mfa/mfa.component';
import { ProvisioningComponent } from './features/auth/provisioning/provisioning.component';
import { ShellComponent } from './features/layout/shell/shell.component';
import { MailListComponent } from './features/mail/mail-list/mail-list.component';
import { DirectoryComponent } from './features/contacts/directory/directory.component';
import { SettingsContainerComponent } from './features/settings/settings-container.component';

export const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: 'auth/mfa',
    component: MfaComponent
  },
  {
    path: 'auth/provisioning',
    component: ProvisioningComponent
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'inbox',
        pathMatch: 'full'
      },
      {
        path: 'inbox',
        component: MailListComponent
      },
      {
        path: 'contacts',
        component: DirectoryComponent
      },
      {
        path: 'settings',
        component: SettingsContainerComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'inbox'
  }
];
