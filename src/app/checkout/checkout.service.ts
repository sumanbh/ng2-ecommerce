import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthHttp } from 'angular2-jwt';
import { NavService } from '../shared/nav.service';

@Injectable()
export class CheckoutService {

    constructor(
        private authHttp: AuthHttp,
        private navService: NavService,
    ) { }

    getCartById(): Observable<any> {
        const productUrl = `/api/user/checkout`;  // api url
        return this.authHttp.get(productUrl)
            .map((res: Response) => res.json());
    }

    sendCheckout(value: any): Observable<any> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const checkoutUrl = `/api/user/checkout/confirm`;
        return this.authHttp.post(checkoutUrl, value, { headers: headers })
            .map((res: Response) => res.json())
            .map(res => {
                if (res.success) {
                    localStorage.setItem('id_cart', res.cart);
                    this.navService.changeCart(res.cart);
                    return true;
                }
                return false;
            });
    }
}
