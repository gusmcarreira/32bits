import { Injectable } from '@angular/core';
import Usuario from '../model/usuario';
import { Observable } from 'rxjs';
import Query from '../model/firestore/query';
import { sha256 } from 'js-sha256';
import { MessageService } from 'primeng/api';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import RegistroLogin from '../model/registroLogin';

import { RastrearTempoOnlineService } from '../analytics-module/rastrear-tempo-online.service';
import Gamification from '../model/gamification/gamification';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private messageService: MessageService,
    private rastrearTempoOnline: RastrearTempoOnlineService
  ) {}

  getUsuarioLogado(): Usuario {
    if (this.isUsuarioLogado()) {
      const json = JSON.parse(sessionStorage.getItem('usuario'));
      return Usuario.fromJson(json);
    }

    return null;
  }

  isUsuarioLogado() {
    return sessionStorage.getItem('usuario') != undefined ? true : false;
  }

  criarSessao(usuario: Usuario) {
    let usuarioString = JSON.stringify(usuario.stringfiy());
    sessionStorage.setItem('usuario', usuarioString);
  }

  logarFacebook(usuario) {
    return new Observable((observer) => {
      Usuario.getByQuery(new Query('email', '==', usuario.email)).subscribe(
        (usuarioLogado: Usuario) => {
          if (usuarioLogado != null) {
            this.criarSessao(usuarioLogado);
            observer.next(true);
            observer.complete();
          } else {
            observer.next(false);
            observer.complete();
          }
        },
        (err) => {
          alert('Erro ao tentar realizar login: ' + err.toString());
        }
      );
    });
  }

  logar(usuario: Usuario) {
    return new Observable((observer) => {
      Usuario.getByQuery([
        new Query('email', '==', usuario.email),
        new Query('senha', '==', sha256(usuario.senha)),
      ]).subscribe(
        (usuarioLogado: Usuario) => {
          if (usuarioLogado != null) {
            this.criarSessao(usuarioLogado);
            this.rastrearTempoOnline.iniciarTimer(usuarioLogado);

            const registroLogin = new RegistroLogin(null, usuarioLogado);
            registroLogin.save().subscribe(() => {});
            observer.next(true);
            observer.complete();
          } else {
            observer.next(false);
            observer.complete();
          }
        },
        (err) => {
          alert('Erro ao tentar realizar login: ' + err.toString());
        }
      );
    });
  }

  validarLogin(usuario: Usuario) {
    if (
      usuario.email == '' ||
      usuario.senha == '' ||
      usuario.email == null ||
      usuario.senha == null ||
      usuario.email == undefined ||
      usuario.senha == undefined
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Falha ao entrar',
        detail: 'Certifique-se de preencher os campos!',
      });
      return false;
    } else {
      return true;
    }
  }

  signInWithFacebook() {
    /* return this.firebaseAuth.auth.signInWithPopup(
			new firebase.auth.FacebookAuthProvider()
		) */
  }

  signInWithGoogle() {
    /* return this.firebaseAuth.auth.signInWithPopup(
			new firebase.auth.GoogleAuthProvider()
		) */
  }

  logout1() {
    /* this.firebaseAuth.auth.signOut()
			.then((res) => this.router.navigate(['/'])); */
  }

  logout() {
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('dialogTipsAutorregulacao');
    return true;
  }
}
