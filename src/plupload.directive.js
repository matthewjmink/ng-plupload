(function() {
  'use strict'

  angular.module('cpPlupload')
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
            uploader.setOption('url', newValue)
          } else {
            initUploader();
          }
        }
      });

      function initUploader() {
        uploader = pluploadService.new(scope.id, opts);
        if(scope.events) {
          var callbackMethods = ['Init', 'PostInit', 'OptionChanged',
          'Refresh', 'StateChanged', 'UploadFile', 'BeforeUpload', 'QueueChanged',
          'UploadProgress', 'FilesRemoved', 'FileFiltered', 'FilesAdded',
          'FileUploaded', 'ChunkUploaded', 'UploadComplete', 'Error', 'Destroy'];
          angular.forEach(callbackMethods, function(method) {
            var callback = (scope.events[method] || angular.noop);
            uploader.bind(method, function() {
              callback.apply(null, arguments);
              if (!scope.$$phase && !scope.$root.$$phase) {
                scope.$apply();
              }
            });
          });
        }
        uploader.init();
      }
    }
  }
})();