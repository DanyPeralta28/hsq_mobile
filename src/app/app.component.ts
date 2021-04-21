import { Component } from '@angular/core';
import {
  Storage
} from '@ionic/storage';
import {
  Router,
  NavigationExtras
} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private storage: Storage,
    private router: Router,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.handleGetStorageUser();
  }

  async handleGetStorageUser() {
    this.storage.get("user").then(
      user => {
        console.log(user);
        let usuario = user.Usuario

        if (usuario) {
          this.router.navigate(['home']);
        } else {
          console.log('error faltan campos de el local storage')
        }
      }
    )
  }
}
