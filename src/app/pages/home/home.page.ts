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
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  typeNetwork: string;

  name: string;
  fecha : any;

  ubicaciones : any;
  locationArr = [];

  constructor(
    private _loginProvider: GlbserviceService,
    private route: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController,
    private storage: Storage,
    private network: Network,
    public loadingController: LoadingController,
  ) {}

  ngOnInit() {
    this.handleGetStorageUser();
    let date = new Date();
    this.fecha = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  }

  async handleGetStorageUser() {
    this.storage.get("user").then(
      user => {
        console.log(user);
        this.name = user.Nombre;

        this.getLocations();
      }
    )
  }

  async getLocations() {
    this.typeNetwork = this.network.type;
    if (this.typeNetwork != 'none') {
      const loading = await this.loadingController.create({
        message: 'Cargando...',
        duration: 3000,
        mode: 'ios'
      });
      await loading.present();
      await this._loginProvider.handleGetLocation()
        .subscribe((res) => {
          this.ubicaciones = res;
          // console.log(this.ubicaciones);
        
          this.ubicaciones.forEach(element => {
            console.log(element);
            if(element.TipoUbicacion ==="Almacen"){
              this.locationArr.push(element);
            }
          });
          
          loading.dismiss();

        }, (err) => {
          console.error(err);
        });
    } else {
      this.alertMsj(
        "Error de conexión",
        "Verifica tu conexión a internet."
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

  locationSelect(ev){
    console.log(ev)
    let location = ev.detail.value;
    this.storage.set('location', location);
  }

  goView() {
    this.router.navigate(['viewer']);
  }

  goOuts() {
    this.router.navigate(['salidas']);
  }

  goEntry() {
    this.router.navigate(['entradas']);
  }

  logout(){
    this.storage.clear();
    this.router.navigateByUrl('login');
  }

}
