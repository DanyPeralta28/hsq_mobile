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
  selector: 'app-viewer',
  templateUrl: './viewer.page.html',
  styleUrls: ['./viewer.page.scss'],
})
export class ViewerPage implements OnInit {
  typeNetwork: string;

  viewTarima: boolean = false;
  viewCaja: boolean = false;

  idtarima: any;
  idcaja: any;

  tarima: any;
  idVisual : any;

  // DATOS DE LA TARIMA
  identificadorTarima: string = "";
  fechaTarima: string = "";
  prodTarima: string = "";
  pesoTarima: string = "";
  casetaTarima: string = "";
  noCajasTarima: string = "";
  cajasTarima: any = "";
  tarimas : any;
  UMPeso : string = "";

  // DATOS DE LA CAJA
  identificadorCaja: string = "";
  ideTarimaCaja: string = "";
  ubicacionCaja: string = "";
  fechaCaja: string = "";
  productoCaja: string = "";
  pesoCaja: string = "";
  casetaCaja : string = "";
  cajas : any;

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

  getSelect(ev) {
    let select = ev.detail.value;
    console.log(select)
    if (select === "1") {
      this.viewTarima = true;
      this.viewCaja = false;
    } else if (select === "2") {
      this.viewCaja = true;
      this.viewTarima = false;
    }
  }

  onEnter(ev) {
    let enter = ev.key;
    if (enter === "Enter") {
      let lineas;
      let linea;
      lineas = this.tarima.split(/\n/);
    
      for(let i=0;i<lineas.length;i++){
        linea=lineas[i];         
        if(linea.includes("IdTarima")){
          let id=linea.split(":");
          this.idtarima = parseInt(id[1].trim())
          console.log(this.idtarima)
          this.viewTarima = true;
          this.viewCaja = false;
          this.handleViewTarima();
        }else if(linea.includes("ID")){
          let id=linea.split(":");
          this.idcaja = parseInt(id[1].trim())
          console.log(this.idcaja)
          this.viewCaja = true;
          this.viewTarima = false;
          this.handleViewCaja();
        }
      }  
    } else {

    }
  }

  async handleViewTarima() {
    this.typeNetwork = this.network.type;
    if (this.typeNetwork != 'none') {
      let data = {
        idTarima : this.idtarima
      }
      const loading = await this.loadingController.create({
        message: 'Cargando...',
        duration: 3000,
        mode: 'ios'
      });
      await loading.present();
      await this._loginProvider.handleGetTarimas(data)
        .subscribe((res) => {
          this.tarimas = res;
          console.log(this.tarimas);
          this.tarima = "";
          // INFO TARIMAS
          this.identificadorTarima = this.tarimas[0].IdTarima;
          this.fechaTarima = this.tarimas[0].FechaProduccion;
          this.prodTarima = this.tarimas[0].ClaveProducto;
          this.pesoTarima = this.tarimas[0].PesoTarima;
          this.UMPeso = this.tarimas[0].UMPeso;
          this.casetaTarima = this.tarimas[0].ClaveCaseta;
          this.noCajasTarima = this.tarimas[0].Cajas;

          this.handleViewTarimaDetail();
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

  async handleViewTarimaDetail() {
    this.typeNetwork = this.network.type;
    if (this.typeNetwork != 'none') {
      let data = {
        idTarima : this.idtarima
      }
      await this._loginProvider.handleGetTarimasDetail(data)
        .subscribe((res) => {
          this.cajasTarima = res;
          console.log(this.cajasTarima);

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

  async handleViewCaja() {
    this.typeNetwork = this.network.type;
    if (this.typeNetwork != 'none') {
      let data = {
        idcaja : this.idcaja
      }
      const loading = await this.loadingController.create({
        message: 'Cargando...',
        duration: 3000,
        mode: 'ios'
      });
      await loading.present();
      await this._loginProvider.handleGetCaja(data)
        .subscribe((res) => {
          this.cajas = res;
          console.log(this.cajas);
          this.tarima = "";

          // INFO CAJAS
          this.identificadorCaja = this.cajas[0].IdCaja;
          this.ideTarimaCaja = this.cajas[0].IdTarima;
          this.ubicacionCaja = this.cajas[0].IdUbicacion;
          this.fechaCaja = this.cajas[0].FechaProduccion;
          this.productoCaja = this.cajas[0].ClaveProducto;
          this.pesoCaja = this.cajas[0].Peso;
          this.casetaCaja  = this.cajas[0].ClaveCaseta;
          this.UMPeso = this.cajas[0].UMPeso;
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

}
