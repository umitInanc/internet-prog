import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../servisler/auth.service';
import {AngularFireDatabase, AngularFireObject} from '@angular/fire/database';
import {Soru} from '../../modeller/soru';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Cevap} from '../../modeller/cevap';

@Component({
  selector: 'app-soru-detay-sayfa',
  templateUrl: './soru-detay-sayfa.component.html',
  styleUrls: ['./soru-detay-sayfa.component.css']
})
export class SoruDetaySayfaComponent implements OnInit {
  soruRef: AngularFireObject<Soru>;
  soru: Soru = new Soru();

  constructor(public authServis: AuthService, public db: AngularFireDatabase, public route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.soruRef = this.db.object<Soru>('soru/' + this.route.snapshot.paramMap.get('id'));
    this.soruRef.snapshotChanges().subscribe(change => {
      const soru: Soru = {id: change.key, ...change.payload.val()};

      this.db.list<Cevap>('cevap', ref => ref.orderByChild('soruId').equalTo(soru.id))
        .snapshotChanges()
        .subscribe(cevapChanges => {
          soru.cevaplar = cevapChanges.map(cevapC => {
            return {id: cevapC.key, ...cevapC.payload.val()};
          });
        });

      this.soru = soru
    });

  }

  cevabimiSil(cevapId: string) {
    if (confirm("Emin misiniz?")) {
      return this.db.object<Cevap>("cevap/" + cevapId).remove()
    }
  }

}
