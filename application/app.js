"use strict";

//====================CONTROLLERS===========================//
import MainController from './controllers/MainController';

//====================SERVICES==============================//
import LocaleService from './services/LocaleService';
import ProductService from './services/ProductService';
import CartService from './services/CartService';
import NewsService from './services/NewsService';

//====================FILTERS==============================//

//====================DIRECTIVES==============================//
import LangsOptionDirective from './directives/LangsOptionDirective';
import ProductDirective from './directives/ProductDirective';

angular.module('VtaminkaApplication.controllers' , []);
angular.module('VtaminkaApplication.services' , []);
angular.module('VtaminkaApplication.filters' , []);
angular.module('VtaminkaApplication.directives' , []);
angular.module('VtaminkaApplication.constants' , []);

//====================CONTROLLERS DECLARATIONS================================//
angular.module('VtaminkaApplication.controllers')
    .controller( 'MainController' , [ '$scope' , 'LocaleService' , '$translate', MainController ]);

//====================CONSTANTS================================//
angular.module('VtaminkaApplication.constants')
       .constant('HOST' , 'http://localhost:63342/Vtaminka/public/');

angular.module('VtaminkaApplication.constants')
    .constant('PASS' , {
        HOST: 'http://localhost:63342/Vtaminka/public/',
        NEWS : 'news/news-list.json',
    });

angular.module('VtaminkaApplication.constants')
    .constant('GET_LANGS' , 'i18n/langs.json');

//GET_PRODUCTS
angular.module('VtaminkaApplication.constants')
    .constant('GET_PRODUCTS' , 'products/products-list.json');

angular.module('VtaminkaApplication.constants')
    .constant('GET_TRANSLATIONS' , 'i18n/{{LANG}}.json');

//====================SERVICES DECLARATIONS===================//
angular.module('VtaminkaApplication.services')
    .service('LocaleService' , [ '$http', 'HOST' , 'GET_LANGS' , 'GET_TRANSLATIONS' , LocaleService ]);

angular.module('VtaminkaApplication.services')
    .service('ProductService' , [ '$http', 'HOST' , 'GET_PRODUCTS' , ProductService ]);

angular.module('VtaminkaApplication.services')
    .service( 'CartService' , [ 'localStorageService', CartService ]);

angular.module('VtaminkaApplication.services')
    .service('NewsService', ['$http', 'PASS', NewsService ]);

//====================DIRECTIVES DECLARATIONS===================//
angular.module('VtaminkaApplication.directives')
    .directive('langsOptionDirective' , [ LangsOptionDirective ]);

angular.module('VtaminkaApplication.directives')
    .directive('productDirective' , [ ProductDirective ]);


let app = angular.module('VtaminkaApplication',[
    'angular-loading-bar',
    'LocalStorageModule',
    'VtaminkaApplication.controllers',
    'VtaminkaApplication.filters',
    'VtaminkaApplication.services',
    'VtaminkaApplication.directives',
    'VtaminkaApplication.constants',
    'ngRoute',
    'ui.router',
    'pascalprecht.translate',
]);

app.config( [
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    'localStorageServiceProvider' ,
    'cfpLoadingBarProvider',
    '$translateProvider',
    ($stateProvider , $urlRouterProvider , $locationProvider , localStorageServiceProvider , cfpLoadingBarProvider , $translateProvider)=>{

    $locationProvider.html5Mode(true).hashPrefix('!')

    $urlRouterProvider.otherwise('/home');

    $translateProvider.useStaticFilesLoader({
        'prefix': 'i18n/',
        'suffix': '.json'
    });

    $translateProvider.preferredLanguage('RU');

    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar = true;

    localStorageServiceProvider.setStorageCookie( 7 , '/' );
    localStorageServiceProvider.setStorageCookieDomain('localhost');

    $stateProvider.state('home' , {
        'url': '/home',
        'views':{
            "header":{
                "templateUrl": "templates/header.html",
                controller: [ '$scope' , 'CartService' , 'langs' , function ($scope, CartService , langs ){
                    $scope.langs = langs;
                    $scope.cart = CartService.getCart();
                } ]
            },
            "content": {
                'templateUrl': "templates/home/home.html",
                controller: [ '$scope' ,  'CartService' , 'products', 'news' , function ($scope , CartService , products,news){

                    let start=0;
                    let end=12;
                    $scope.cart = CartService.getCart();
                    products.forEach(p=>{

                        for(let i=0; i<$scope.cart.length; i++){
                            if(p.ProductID === $scope.cart[i].ProductID){
                                p.isInCart=true;
                            }
                        }
                    })

                    $scope.products = products.slice(start,end);

                    $scope.MoreProduct = function  (){

                        if(products.length>end){
                            end += 4;
                        }

                        console.log(`start: ${start} end: ${end}`);

                        $scope.products = products.slice(start,end);
                    }

                    $scope.news = news;


                } ]
            },
            "footer": {
                'templateUrl': "templates/footer.html",
            }
        },
        'resolve': {

            'products': [ 'ProductService' , function ( ProductService ){
                return ProductService.getProducts();
            } ],
            'langs': [ 'LocaleService' , function ( LocaleService ){
                return LocaleService.getLangs();
            }  ],
            'news': [ 'NewsService', function  ( NewsService ){
                return NewsService.getNews()
            }
            ]

        }
    });

    $stateProvider.state('singleProduct' , {
            'url': '/product/:productID',
            'views':{
                "header":{
                    "templateUrl": "templates/header.html",
                    controller: [ '$scope' , 'CartService' , 'langs' , function ($scope, CartService , langs ){
                       $scope.langs = langs;
                        $scope.cart = CartService.getCart();
                    } ]
                },
                "content": {
                    'templateUrl': "product.html",
                     },
                "footer": {
                    'templateUrl': "templates/footer.html",
                }

            },
            'resolve': {


            'langs': [ 'LocaleService' , function ( LocaleService ){
                return LocaleService.getLangs();
            }  ]

        }
        });

} ] );

app.run(
    [          '$rootScope', '$state', '$stateParams',
        function ($rootScope,   $state,   $stateParams) {

        }
    ]);
