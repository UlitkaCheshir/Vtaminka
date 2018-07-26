"use strict";


export default class CartService{


    constructor(localStorageService){

        if(localStorageService.get('cartProduct')){
            this.cart = localStorageService.get('cartProduct');
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

        this.localStorageService.set( 'cartProduct' , this.cart );
    }//addProduct

}