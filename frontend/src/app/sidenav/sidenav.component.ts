import { Component, OnInit } from '@angular/core';

import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router'; // router to redirect
import { CharaService } from '../shared/chara.service';
import { Chara } from '../shared/chara.model';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  constructor(private authServ: AuthService,
              private router: Router,
              private alohaSnackBar: MatSnackBar,
              private charaservice: CharaService) { }

  public static hamburger: boolean;
  private allcharas = [];


  ngOnInit() {
    this.charaservice.listenfor('Read_all_user_charas').subscribe((data) => {
        this.allcharas = data as Chara[];
    });

    this.charaservice.listenfor('Updated_one_chara').subscribe((data) => {
      const replacementIndex = this.allcharas.findIndex(e => e._id === (data as Chara)._id);
      this.allcharas[replacementIndex] = data as Chara;
    });

    this.charaservice.listenfor('Created_new_chara').subscribe((data) => {
      // get all characterids in user localstorage obj
      // append this new chara id
      // set localstorage new characterlist
      const userinfo = JSON.parse(localStorage.getItem('user'));
      userinfo.charas.push((data as Chara)._id); // add id to list of charas
      localStorage.setItem('user', JSON.stringify(userinfo));
      this.allcharas.push(data);
    });
  }

  onSignoutClick() {
    this.authServ.signout(); // dont need an observer so this is good enough
    this.charaservice.leaveCharacterRoom(this.charaservice.CharaId);
    this.charaservice.leaveUserRoom(); // this probably doesn't work like its supposed to
    this.allcharas.length = 0;
    this.alohaSnackBar.open('You\'ve logged out', 'okay',
      {duration: 2000, verticalPosition: 'top', panelClass: ['alohasnackbar']});
    this.router.navigate(['/signin']);
    return false;
  }

  loadCharacterIdAndRoom(chara) {
    if (this.charaservice.CharaId != null) { // leave this room
      this.charaservice.leaveCharacterRoom(this.charaservice.CharaId);
    }
    this.charaservice.CharaId = chara._id;
    this.charaservice.joinCharacterRoom(chara._id);
    this.charaservice.sendback('Get_selected_chara', {characterid: chara._id});
  }

}
