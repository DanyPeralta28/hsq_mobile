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
  selector: 'app-entradas',
  templateUrl: './entradas.page.html',
  styleUrls: ['./entradas.page.scss'],
})
export class EntradasPage implements OnInit {
  typeNetwork: string;
  name : any;

  ubicaciones : any;
  locationArr = [];
  enterInfo : boolean = false;

  myIDLocation : any;
  myNameLocation : any;

  idTarima : any;
  tarima: any;

  transferencias : any;
  arrTransferencias = [];
  arrTransferenciasFailed = [];

  constructor(
    private _loginProvider: GlbserviceService,
    private route: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController,
    private storage: Storage,
    private network: Network,
    public loadingController: LoadingController,
  ) { }

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
            if(element.TipoUbicacion ==="Almacen"){
              this.locationArr.push(element);
            }
          });

          this.ubicaciones.forEach(element => {
            if(element.IdUbicacion===this.myIDLocation){
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
        "IdUbicacion": this.myIDLocation,
        "Usuario": this.name
      }
      console.log(data)
      const loading = await this.loadingController.create({
        message: 'Cargando...',
        duration: 3000,
        mode: 'ios'
      });
      await loading.present();
      await this._loginProvider.handlePostReciveTransfer(data)
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
