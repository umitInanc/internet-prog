import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../servisler/auth.service';
import {Router} from '@angular/router';
import {Sonuc} from '../../modeller/sonuc';

@Component({
  selector: 'app-kayit-sayfa',
  templateUrl: './kayit-sayfa.component.html',
  styleUrls: ['./kayit-sayfa.component.css']
})
export class KayitSayfaComponent implements OnInit {

  isim: string = '';
  soyisim: string = '';
  eposta: string = '';
  sifre: string = '';

  sonuc: Sonuc = new Sonuc();

  constructor(public authServis: AuthService, public router: Router) {
  }

  ngOnInit(): void {

  }

  kayitOl() {
    return this.authServis.kayitOl(this.isim, this.soyisim, this.eposta, this.sifre).then(
      () => {
        this.sonuc.islem = true;
        this.sonuc.mesaj = 'Kayıt yapıldı';
        this.router.navigate(['anasayfa']);
      }
    ).catch(
      err => {
        this.sonuc.islem = false;
        this.sonuc.mesaj = 'Böyle bir kullanıcı zaten mevcut';
      }
    );
  }

}
