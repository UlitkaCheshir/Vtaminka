"use strict";


export default function LangsOptionDirective( ){

    return {

        restrict: 'A',
        template: '',
        scope: {
            'langs': '='
        },
        controller: [ '$scope', 'localStorageService' , function ( $scope , localStorageService){

            if(localStorageService.get('vtaminka_lang')){
                $scope.currentLang = localStorageService.get('vtaminka_lang');
                //console.log(localStorageService.get('vtaminka_lang'));
                
            }//if
            else{
                $scope.currentLang = $scope.langs[0];
            }//else

            $scope.changeLanguage = function ( newLanguage ){

                $scope.$parent.updateTranslations( newLanguage );
                //$translate.use(newLanguage);
                localStorageService.set( 'vtaminka_lang' , newLanguage );
            };

        } ],
        link: function ( scope, element, attrs, controller, transcludeFn ){

            let options = '<option value="RU" >Язык</option>';

            scope.langs.forEach( (lang) => {
                options += `<option value="${lang}" >${lang}</option>`;
            } );

            element.html( options );

            new SelectFx(
                document.querySelector('#langs'),{
                    onChange: scope.changeLanguage
                }
            );

        }//link

    }//LangsListDirective {}

}//LangsListDirective ()