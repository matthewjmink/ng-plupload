(function() {
  'use strict'

  angular.module('cpPlupload')
    .directive('pluploadSubmit', pluploadSubmit);

  pluploadSubmit.$inject = ['pluploadService'];
  function pluploadSubmit (pluploadService) {
    return {
      scope: {
        id: '=pluploadId'
      },
      link: pluploadLinkFunc
    };

    function pluploadLinkFunc(scope, element, attrs) {
      element[0].onclick = function(){
        var uploader = pluploadService.get(scope.id);
        if(uploader){
          uploader.start();
        }
      };
    }
  }
})();
