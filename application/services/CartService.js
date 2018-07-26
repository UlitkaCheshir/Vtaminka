"use strict";


export default class CartService{


    constructor(localStorageService){

        if(localStorageService.get('cart')){
            this.cart = localStorageService.get('cart');
        }//if
        else{
            this.cart = [];
        }//else

        this.localStorageService=localStorageService;
    }//constructor

    getCart(){
        return this.cart;
    }//getCart

    addProduct( product ){

        this.cart.push( product );

        this.localStorageService.set( 'cart' , this.cart );
    }//addProduct

}