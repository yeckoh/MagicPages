import { Component, OnInit, OnDestroy } from '@angular/core';
import * as wsocket from 'socket.io-client';

@Component({
  selector: 'app-secret-socket',
  templateUrl: './secret-socket.component.html',
  styleUrls: ['./secret-socket.component.css']
})
export class SecretSocketComponent implements OnInit, OnDestroy {

  static mysock: any;
  constructor() { }

  static newCharacter(incomingdata) {
    // send an event to the hook, 'newchara'

    // tslint:disable-next-line: prefer-const
    let forwardingdata = {
      userid: JSON.parse(localStorage.getItem('user')).id,
      name: incomingdata.name,
      gender: incomingdata.gender,
      race: incomingdata.race
    };
    this.mysock.emit('makenewchara', forwardingdata);

   // .mysock.emit('testevent', {data_sent_AngularToNode: 'lets goooooo'});
  }

  static getUserCharacters() {
    // console.log('calling getusercharacters');
    const characterids = JSON.parse(localStorage.getItem('user')).charas;
    // console.log(characterids);
    this.mysock.emit('getallusercharas', characterids);
  }

  ngOnDestroy() { // this works for now
    SecretSocketComponent.mysock.disconnect();
    sessionStorage.clear();
  }

  ngOnInit() {
    // if (localStorage.getItem('id_token') == null) {
    //   return;
    // }
    // if (sessionStorage.getItem('active_socket') == null) {
      this.connectToSocket();
    // }

    // define a hook to listen for, called 'madenewchara'
      SecretSocketComponent.mysock.on('madenewchara', (data) => {
        console.log(data);
        // get all characterids in user localstorage obj
        // append this new chara id
        // set localstorage new characterlist
        const userinfo = JSON.parse(localStorage.getItem('user'));
        userinfo.charas.push(data._id);
        localStorage.setItem('user', JSON.stringify(userinfo));
        // probably update the sidebar list here too
      });

      SecretSocketComponent.mysock.on('sendallusercharas', (data) => {
        // pull all characters belonging to the logged-in user only
        // console.log(data);
        let i = 0;
        data.forEach(element => {
          console.log(i++);
          console.log(element);
        });
      });
  }










  connectToSocket() {
    SecretSocketComponent.mysock = wsocket('http://localhost:3000');
    const keypair = {is_active: true};
    sessionStorage.setItem('active_socket', JSON.stringify(keypair)); // dont need this already
  }














}