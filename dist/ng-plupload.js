(function() {
    'use strict'
    angular.module('plupload', []);
})();

(function() {
    'use strict'

    angular.module('plupload')
        .factory('pluploadService', pluploadService);

    function pluploadService() {
        var defaultOptions = {
            runtimes: 'html5',
            chunk_size: '2000KB',
            max_retries: 0,
            multi_selection: false,
            filters: {
                max_file_size: '400mb',
                mime_types: [
                { title: "Files", extensions: "pdf,doc,docx,xls,xlsx,xlsb,xlsm,ppt,pptx,pptm,png,gif,jpg,zip" }
                ]
            },
        };
        var uploaders = {};

        return {
            new: newUploader,
            get: getUploader,
            setOption: setOption,
            defaultOptions: defaultOptions
        };


        function uniqueId() {
            return 'd' + s4() + s4() + s4();
        }

        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        function getUploader(id) {
            if(id && uploaders[id]) {
                return uploaders[id];
            }
            return null;
        }

        function newUploader(scope, id, opts, events) {
            if(typeof id !== 'string' || typeof uploaders[id] !== 'undefined') {
                id = uniqueId();
            }
            uploaders[id] = new plupload.Uploader(opts);
            if(events) {
                var callbackMethods = ['Init', 'PostInit', 'OptionChanged',
                'Refresh', 'StateChanged', 'UploadFile', 'BeforeUpload', 'QueueChanged',
                'UploadProgress', 'FilesRemoved', 'FileFiltered', 'FilesAdded',
                'FileUploaded', 'ChunkUploaded', 'UploadComplete', 'Error', 'Destroy'];
                angular.forEach(callbackMethods, function(method) {
                    var callback = (events[method] || angular.noop);
                    uploaders[id].bind(method, function() {
                        callback.apply(null, arguments);
                        if (!scope.$$phase && !scope.$root.$$phase) {
                            scope.$apply();
                        }
                    });
                });
            }
            return uploaders[id];
        }

        function setOption(id, option, value) {
            uploaders[id].setOption(option, value);
            return uploaders[id];
        }
    }
})();

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
