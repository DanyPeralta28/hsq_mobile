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
  selector: 'app-salidas',
  templateUrl: './salidas.page.html',
  styleUrls: ['./salidas.page.scss'],
})
export class SalidasPage implements OnInit {
  typeNetwork: string;

  ubicaciones: any;
  locationArr = [];
  enterInfo: boolean = true;

  myIDLocation: any;
  myNameLocation: any;
  idTarima : any;
  idDestino : any;
  name : any;

  transferencias : any;
  arrTransferencias = [];
  arrTransferenciasFailed = [];

  tarima: any;

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
    this.handleGetStorageLocation();
    this.getLocations();
  }

  async handleGetStorageLocation() {
    this.storage.get("location").then(
      location => {
        console.log(location);
        this.myIDLocation = location;
        this.handleGetStorageUser();
      }
    )
  }

  async handleGetStorageUser() {
    this.storage.get("user").then(
      user => {
        console.log(user);
        this.name = user.Nombre;
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
            if (element.TipoUbicacion === "Almacen") {
              this.locationArr.push(element);
            }
          });

          this.ubicaciones.forEach(element => {
            if (element.IdUbicacion === this.myIDLocation) {
              this.myNameLocation = element.NombreUbicacion;
            }
          });
          console.log(this.myNameLocation)

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

  selectDestino(ev) {
    this.idDestino = ev.detail.value;
    if (this.idDestino === this.myIDLocation) {
      this.alertMsj(
        "El destino es igual a su ubicación actual.",
        "Por favor elija otro destino"
      );
      this.enterInfo = true;
    } else {
      this.enterInfo = false;
    }
  }

  onEnter(ev) {
    let enter = ev.key;
    if (enter === "Enter") {
      let lineas;
      let linea;
      lineas = this.tarima.split(/\n/);
      for (let i = 0; i < lineas.length; i++) {
        linea = lineas[i];
        if (linea.includes("IdTarima")) { 
          let id=linea.split(":");
          this.idTarima = parseInt(id[1].trim())
          console.log(this.idTarima)
          this.getTransfer();
        } 
      }
    } else {

    }
  }

  async getTransfer() {
    this.typeNetwork = this.network.type;
    if (this.typeNetwork != 'none') {
      let data = {
        "IdTarima": this.idTarima,
        "IdOrigen": this.myIDLocation,
        "IdDestino": this.idDestino,
        "Usuario": this.name
      }
      console.log(data)
      const loading = await this.loadingController.create({
        message: 'Cargando...',
        duration: 3000,
        mode: 'ios'
      });
      await loading.present();
      await this._loginProvider.handlePostTransfer(data)
        .subscribe((res) => {
          this.transferencias = res;
          console.log(this.transferencias);
          if(this.transferencias.CodeResult!=="100"){
            this.arrTransferenciasFailed.push(this.transferencias)
            this.arrTransferenciasFailed.reverse();
            this.alertMsj(
              "Alerta",
              this.transferencias.Message
            );
            this.tarima = "";
          } else {
            this.arrTransferencias.push(this.transferencias)
            this.arrTransferencias.reverse();
            this.tarima = "";
          }

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

  async goReset(){
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      duration: 3000,
      mode: 'ios'
    });
    await loading.present();
    this.arrTransferencias = [];
    this.tarima = "";
    loading.dismiss();
  }

}
