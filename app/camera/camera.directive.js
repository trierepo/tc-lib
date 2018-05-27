angular.module('tcLib').directive('tcCamera', ['ngDialog', function(ngDialog) {
    return {
        restrict: 'E',
		scope: {
			model: "=ngModel",
			onCapture: '&',
			confirmText: '@'
		},
		template: '<button class="btn btn-info"ng-click="capturePhoto()">Photo</button>',
		link: function(scope, ele, attr) {
			scope.autoClose = !scope.confirmText;
			scope.setModel = function(snap) {
				scope.tempModel = snap;
			};
			scope.setConfirmed = function(confirmed) {
				scope.confirmed = confirmed;
			};
			scope.capturePhoto = function() {
				ngDialog.open({
		    		template:'capturPhotoTemplate.html',
		    		className: 'ngdialog-theme-default ngdialog-lg',
		    		controller: 'cameraModelCtrl',
		    		scope: scope
		    	}).closePromise.then(function() {
		    		if (typeof scope.onCapture === 'function') {
		    			if (scope.confirmed) {
		    				scope.model = scope.tempModel;
		    			}
		    			scope.onCapture({$snap: scope.tempModel});
		    		}
		    	});
			};	
		}
	};
}]);
