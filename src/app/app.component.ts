import {Component, OnInit} from '@angular/core';
import {AuthService} from './servisler/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'internet-programciligi';

  url: string;

  ngOnInit() {
    this.url = this.router.url;
    console.log(this.url)
  }

  constructor(public authServis: AuthService, public router: Router) {

  }

  cikisYap() {
    this.authServis.cikisYap().then(() => {
      this.router.navigate(['giris']);
    });
  }
}
