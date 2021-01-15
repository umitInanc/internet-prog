import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {Kategori} from '../../modeller/kategori';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthService} from '../../servisler/auth.service';
import {Uye} from '../../modeller/uye';
import {Router} from '@angular/router';
import {Cevap} from '../../modeller/cevap';
import {Soru} from '../../modeller/soru';

@Component({
  selector: 'app-admin-sayfa',
  templateUrl: './admin-sayfa.component.html',
  styleUrls: ['./admin-sayfa.component.css']
})
export class AdminSayfaComponent implements OnInit {
  public kategori: string;
  kategoriler: Observable<Kategori[]>;
  kategorilerRef: AngularFireList<Kategori>;
  sorular: Observable<Soru[]>;
  sorularRef: AngularFireList<Soru>;

  suankiKategori: Kategori = new Kategori();

  constructor(
    public db: AngularFireDatabase,
    public authServis: AuthService,
    public router: Router
  ) {

  }

  ngOnInit(): void {
    this.kategorilerRef = this.db.list<Kategori>('kategori');
    this.kategoriler = this.kategorilerRef.snapshotChanges().pipe(map(changes => {
      return changes.map(c => {
        return {
          id: c.key,
          ...c.payload.val()
        };
      });
    }));
    this.sorularRef = this.db.list<Soru>('soru');
    this.sorular = this.sorularRef.snapshotChanges().pipe(map(changes => {
      return changes.map(c => {
        return {
          id: c.key,
          ...c.payload.val()
        };
      });
    }));

    this.db.list<Uye>('uye', ref => ref.orderByChild('kullaniciId').equalTo(this.authServis.kullanici.uid)).snapshotChanges().subscribe(changes => {
      const uye = changes[0].payload.val() as Uye;

      if (uye.rol !== 'admin') {
        this.router.navigate(['anasayfa']);
      }
    });
  }

  kategoriEkle() {
    return this.kategorilerRef.push({
      adi: this.kategori
    });
  }

  kategoriyiSil(id: string) {
    if (confirm('Emin misiniz?')) {
      return this.db.object<Kategori>('kategori/' + id).remove();
    }

  }

  suankiKategoriyiKoy(kategori: Kategori) {
    this.suankiKategori = {...kategori};
  }

  suankiKategoriyiGuncelle() {
    return this.db.object<Kategori>('kategori/' + this.suankiKategori.id).update({
      adi: this.suankiKategori.adi
    });
  }

  soruSil(soruId: string) {
    if (confirm('Emin misiniz?')) {
      this.sorularRef.remove(soruId).then(() => {
        return this.db.list<Cevap>('cevap', ref => ref.orderByChild('soruId').equalTo(soruId))
          .snapshotChanges()
          .subscribe(changes => {
            changes.forEach(c => {
              return this.db.object<Cevap>('cevap/' + c.key).remove();
            });
          });
      });
    }
  }

}
