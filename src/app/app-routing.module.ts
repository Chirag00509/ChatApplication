import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ChatComponent } from './pages/chat/chat.component';
import { authGuard } from './services/auth/auth.guard';
import { ConversationComponent } from './pages/conversation/conversation.component';

const routes: Routes = [
  {
    path : 'register',
    component : RegisterComponent
  },
  {
    path : 'login',
    component : LoginComponent
  },
  {
    path : "",
    redirectTo : "/login",
    pathMatch : 'full'
  },

  {
    path : "chat",
    component : ChatComponent,
    canActivate : [authGuard],
    children : [
      {
        path : "user/:id",
        component : ConversationComponent,
        outlet: 'childPopup'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
