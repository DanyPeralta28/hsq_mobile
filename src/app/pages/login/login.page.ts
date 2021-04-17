import {
  Component,
  OnInit
} from '@angular/core';
import {
  NavController,
  Platform,
  AlertController,
  LoadingController,
  MenuController
} from '@ionic/angular';
import {
  ActivatedRoute,
  Router,
  NavigationExtras
} from '@angular/router';
import {
  Storage
} from '@ionic/storage';
import {
  Network
} from '@ionic-native/network/ngx';
import {
  GlbserviceService
} from '../../services/glbservice/glbservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  typeNetwork: string;

  login: any;
  email: any;
  password: any;

  constructor(
    private _loginProvider: GlbserviceService,
    private route: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController,
    private storage: Storage,
    private network: Network,
    public loadingController: LoadingController,
  ) {}

  ngOnInit() {}

  async goToHome() {
    this.typeNetwork = this.network.type;
    if (this.typeNetwork != 'none') {
      let data = {
        'usuario': this.email,
        'password': this.password,
      };
      const loading = await this.loadingController.create({
        message: 'Cargando...',
        duration: 3000,
        mode: 'ios'
      });
      await loading.present();
      await this._loginProvider.handleLogin(data)
        .subscribe((res) => {
          this.login = res;
          console.log(this.login)
          if (this.login.IsValid === true) {
            this.storage.set('user', this.login.UsrInfo);
            this.router.navigate(['home']);
          } else if (this.login.IsValid === false) {
            this.alertMsj(
              "El usuario o la contraseña son incorrectos",
              "Por favor, intente de nuevo..."
            );
          }
          loading.dismiss();

        }, (err) => {
          this.alertMsj(
            "El usuario o la contraseña son incorrectos",
            "Por favor, intente de nuevo..."
          );
          console.error(err);
        });
    } else {
      this.alertMsj(
        "Error de conexión",
        "Verifica tu conexión a la red."
      );
    }
  }

  async alertMsj(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['Ok'],
      mode: 'ios'
    });
    alert.present();
  }

}
