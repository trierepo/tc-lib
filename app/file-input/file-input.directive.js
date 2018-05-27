angular.module('tcLib').directive('tcFileInput', [function() {
    return {
        restrict: 'AE',
        require: 'ngModel',
        scope: {
            ngModel: '=',
        },
        link: function(scope, elem, attr, ngModel) {
            elem.on("change", function(e) {
                var files = elem[0].files;
                if (attr.multiple) {
                    ngModel.$setViewValue(files);
                } else {
                    ngModel.$setViewValue(files[0]);
                }
            });
        }
    }
}]);
