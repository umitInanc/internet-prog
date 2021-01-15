import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../servisler/auth.service';
import {Router} from '@angular/router';
import {Sonuc} from '../../modeller/sonuc';

@Component({
  selector: 'app-giris-sayfa',
  templateUrl: './giris-sayfa.component.html',
  styleUrls: ['./giris-sayfa.component.css']
})
export class GirisSayfaComponent implements OnInit {
  eposta: string = ""
  sifre: string = ""

  sonuc: Sonuc = new Sonuc();

  constructor(public authServis: AuthService, public router: Router) { }

  ngOnInit(): void {

  }

  girisYap() {
    this.authServis.girisYap(this.eposta, this.sifre).then(
      () => {
        this.sonuc.islem = true;
        this.sonuc.mesaj = "Giriş yapıldı"
        this.router.navigate(["anasayfa"])
      },
    ).catch(
      err => {
        this.sonuc.islem = false;
        this.sonuc.mesaj = "Şifre yada Eposta yanlış"
      }
    )
  }

}
