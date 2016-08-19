(function() {
    'use strict'

    angular.module('plupload')
        .directive('plupload', pluploadDir);

    pluploadDir.$inject = ['pluploadService'];
    function pluploadDir (pluploadService) {
        return {
            scope: {
                id: '=pluploadId',
                url:'=',
                options:'=',
                events:'=',
            },
            link: pluploadLinkFunc
        };

        function pluploadLinkFunc(scope, element, attrs) {
            var opts = pluploadService.defaultOptions;
            var uploader;
            opts.url = scope.url || opts.url;
            opts.browse_button = element[0];
            angular.extend(opts, scope.options);

            if(opts.url){
                initUploader();
            }

            scope.$watch('url', function(newValue, oldValue) {
                if(newValue !== oldValue) {
                    opts.url = newValue;
                    if(uploader) {
                        uploader = pluploadService.setOption(scope.id, 'url', newValue);
                    } else {
                        initUploader();
                    }
                }
            });

            function initUploader() {
                uploader = pluploadService.new(scope, scope.id, opts, scope.events);
                uploader.init();
            }
        }
    }
})();
