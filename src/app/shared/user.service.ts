import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { NavService } from '../shared/nav.service';

@Injectable()
export class UserService {
    loggedIn = false;
    jwt: string;
    jwtHelper: JwtHelper = new JwtHelper();

    constructor(
        private http: Http,
        private navService: NavService
    ) {
    }

    checkLocalStorage() {
        this.loggedIn = !!localStorage.getItem('id_token');
    }

    login(email, password): Observable<any> {
        const user = JSON.stringify({ email, password });
        const headers = new Headers({ 'Content-Type': 'application/json' });

        return this.http.post(`/login`, user, { headers: headers })
            .map((res: Response) => res.json())
            .map((res) => {
                if (res.success) {
                    localStorage.setItem('id_token', res.token);
                    localStorage.setItem('id_cart', res.cart);
                    this.navService.changeNav(true);
                    this.navService.changeCart(res.cart);
                    return true;
                }
                return false;
            });
    }

    onLogin(): Observable<any> {
        return this.http.get(`/user/status/`)
            .map((res: Response) => res.json());
    }

    logout(): Observable<any> {
        localStorage.removeItem('id_token');
        localStorage.removeItem('id_cart');
        return this.http.get('/logout')
            .map((res: Response) => res.status);
    }

    isLoggedIn() {
        this.checkLocalStorage();
        if (this.loggedIn) {
            const cart = localStorage.getItem('id_cart') || 0;
            this.navService.changeCart(cart);
            this.jwt = localStorage.getItem('id_token');
            return this.jwtHelper.decodeToken(this.jwt) || false;
        }
        return false;
    }
}
