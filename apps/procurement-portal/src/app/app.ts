import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCurrentUser } from './auth/state/auth.selectors';
import { authActions } from './auth/state/auth.actions';
import { User } from './core/models';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private store = inject(Store);
  user$: Observable<User | null> = this.store.select(selectCurrentUser);

  signOut() {
    this.store.dispatch(authActions.signOut());
  }
}
