(function() {
    'use strict'

    angular.module('plupload')
        .directive('pluploadSubmit', pluploadSubmit);

    pluploadSubmit.$inject = ['pluploadService'];
    function pluploadSubmit (pluploadService) {
        return {
            scope: {
                id: '=pluploadId',
                beforeStart: '=before'
            },
            link: pluploadLinkFunc
        };

        function pluploadLinkFunc(scope, element, attrs) {
            element[0].onclick = function(){
                var uploader = pluploadService.get(scope.id);
                if(uploader){
                    if(typeof scope.beforeStart === 'function') {
                        scope.beforeStart().then(function(){
                            // Setting a timeout of 10 milliseconds to avoid a race condition
                            //     with the OptionChanged Event.
                            setTimeout(function() {
                                uploader = pluploadService.get(scope.id);
                                uploader.start();
                            }, 10);
                        })
                    } else {
                        uploader.start();
                    }
                }
            };
        }
    }
})();
