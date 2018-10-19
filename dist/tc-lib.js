angular.module('tcLib', ['camera', 'ngDialog', 'ui.bootstrap']);
angular.module('tcLib').directive('bindHtmlCompile', ['$compile', function($compile) {
	return {
        restrict : 'A',
        link : function(scope, element, attrs) {
            scope.$watch(function() {
                return scope.$eval(attrs.bindHtmlCompile);
            }, function(value) {
                element.html(value);
                $compile(element.contents())(scope);
            });
        }
    };
}]);

angular.module('tcLib').directive('tcCamera', ['ngDialog', function(ngDialog) {
    return {
		restrict: 'A',
		require: 'ngModel',
		scope: {
			onCapture: '&',
			confirmText: '@'
		},
		link: function(scope, ele, attr, ngModel) {
			angular.element(ele).bind('click', function() {
				scope.capturePhoto();
			});
			scope.autoClose = !scope.confirmText;
			scope.setModel = function(snap) {
				scope.tempModel = snap;
			};
			scope.setConfirmed = function(confirmed) {
				scope.confirmed = confirmed;
			};
			scope.capturePhoto = function() {
				ngDialog.open({
		    		template:'app/camera/camera-modal.html',
		    		className: 'ngdialog-theme-default ngdialog-lg',
		    		controller: 'cameraModelCtrl',
		    		scope: scope
		    	}).closePromise.then(function() {
		    		if (typeof scope.onCapture === 'function') {
		    			if (scope.confirmed) {
							debugger;
		    				ngModel.$setViewValue(scope.tempModel);
		    			}
		    			scope.onCapture({$snap: scope.tempModel});
		    		}
		    	});
			};	
		}
	};
}]);

angular.module('tcLib').controller('cameraModelCtrl', ['$scope', 'ngDialog', function($scope, ngDialog) {
	$scope.onCamCapture = function(snap) {
		$scope.setModel(snap);
		if ($scope.autoClose) {
			$scope.confirm();
		}
	};
	
	$scope.confirm = function() {
		$scope.setConfirmed(true);
	};

	$scope.cancel = function() {
		$scope.setConfirmed(false);
	};
}]);

angular.module('tcLib').directive('clickAndDisable', [function() {
	return {
        restrict: 'A',
		scope: {
			clickAndDisable: '&'
		},
		link: function(scope, iElement, iAttrs) {
			iElement.bind('click', function() {
                scope.clickAndDisable = scope.clickAndDisable || $timeout(angular.noop, 5000);
				iElement.prop('disabled',true);
				scope.clickAndDisable().finally(function() {
					iElement.prop('disabled',false);
				});
			});
		}
	};
}]);

angular.module('tcLib').directive('tcDatePicker', ['$parse', function($parse) {
	return {
		restrict: 'E',
		scope: {
			name: '@',
			options: '=?',
			placeholder: '@',
			model: "=ngModel",
		},
		templateUrl: 'app/date-picker/date-picker.html',
		link: function(scope, attr, e) {

			function updateOptions() {
				scope.dateOptions = {
					formatYear: 'yy',
					showWeeks: false,
					customClass: getDayClass,
					minDate: $parse('options.minDate')(scope) || null,
					maxDate: $parse('options.maxDate')(scope) || new Date(2040, 12, 31),
					startingDay: 1
				};
			}
			scope.calendarPanel = {
				opened: false
			};
			
			scope.openCalendar = function() {
				scope.calendarPanel.opened = true;
			};

			scope.$watch('options', function(newVal, oldVal) {
				updateOptions();
			});
			
			function getDayClass(data) {
				var date = data.date,
					mode = data.mode;
				if (mode === 'day') {
					var dayToCheck = new Date(date).setHours(0, 0, 0, 0);
					for (var i = 0; i < ($parse('events.length')(scope) || 0); i++) {
						var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);
						if (dayToCheck === currentDay) {
							return $scope.events[i].status;
						}
					}
				}
				return '';
		  	}
		}
	};
}]);

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
                ngModel.$setViewValue(null);
                if (attr.multiple) {
                    ngModel.$setViewValue(files.length ? files: null);
                } else {
                    ngModel.$setViewValue(files[0]);
                }
            });
        }
    }
}]);

angular.module('tcLib').service('casesheet', ['httpService', function(httpService) {
    this.save = save;
    this.caseSheetList = caseSheetList;

    function save(casesheet) {
        return httpService.post('casesheet/saveorupdate', casesheet);
    }

    function caseSheetList(opPatientId) {
        return httpService.get('casesheet/search', {
            opPatientId: opPatientId // optional
        });
    }
}]);

angular.module('tcLib').service('companyService', ['httpService', function(httpService) {
    this.save = save;
    this.companiesList = companiesList;

    function save(company) {
        return httpService.post('company/saveorupdate', company);
    }

    function companiesList() {
        return httpService.get('company/list');
    }
}]);

angular.module('tcLib').service('complaintService', ['httpService', function(httpService) {
    this.saveComplaint = saveComplaint;
    this.saveComplaintTransationm = saveComplaintTransation;
    this.complaintMastersList = complaintMastersList;
    this.complaintTransactList = complaintTransactList;

    function saveComplaint(complaintMaster) {
        return httpService.post('complaint/save', complaintMaster);
    }

    function saveComplaintTransation(complaintTransact) {
        return httpService.post('complaint/transact/saveorupdate', complaintTransact);
    }

    function complaintMastersList(patientId) {
        return httpService.get('complaint/search', {
            patientId: patientId // optional
        });
    }

    function complaintTransactList(patientId) {
        return httpService.get('complaint/transact/search', {
            patientId: patientId // optional
        });
    }
}]);

angular.module('tcLib').service('drugFormulae', ['httpService', function(httpService) {
    this.save = save;
    this.drugFormulaeList = drugFormulaeList;

    function save(drugFormulae) {
        return httpService.post('drugFormulae/saveorupdate', drugFormulae);
    }

    function drugFormulaeList() {
        return httpService.get('drugFormulae/list');
    }
}]);

angular.module('tcLib').provider('httpService', function() {
	var basePath = '';
	try {
		basePath = location.href.split('/')[3];
	} catch(err) {
		basePath = '';
	}

	this.setBasePath = function(_basePath) {
		basePath = _basePath;
	};

	this.$get = ['$http', '$q', function httpService($http, $q) {
		return {
			get: reqWithoutPayload.bind(null, 'GET'),
			del: reqWithoutPayload.bind(null, 'DELETE'),
			put: reqWithPayload.bind(null, 'PUT'),
			post: reqWithPayload.bind(null, 'POST'),
			upload: upload.bind(null, 'POST'),
			getJSON: getJSON.bind(null, 'GET')
		};
	
		function reqWithoutPayload(reqType, url, urlParams, nullAllowed) {
			url = _appendUrlParams(url, urlParams, nullAllowed);
			return _sendRequest({
				method: reqType,
				url: url
			});
		}
	
		function reqWithPayload(reqType, url, payload, urlParams, nullAllowed) {
			url = _appendUrlParams(url, urlParams, nullAllowed);
			return _sendRequest({
				method: reqType,
				url: url,
				data: payload
			});
		}
		
		function upload(reqType, url, formData, urlParams, nullAllowed) {
			url = _appendUrlParams(url, urlParams, nullAllowed);
			return _sendRequest({
				url: url,
				method: reqType,
				data: formData,
				transformRequest: angular.identity,
				headers: { 'Content-Type': undefined }
			});
		}
		
		function getJSON(reqType, url, cacheKey) {
			if (cacheKey && localStorage.getItem(cacheKey)) {
				return $q.when(null).then(function() {
					var cacheData = localStorage.getItem(cacheKey);
					return JSON.parse(cacheData);
				});
			} else {
				return reqWithoutPayload(reqType, url).then(function(res) {
					localStorage.setItem(cacheKey, res.json);
					return res;
				});
			}
		}
		
		function _appendUrlParams(url, urlParams, nullAllowed) {
			if (urlParams) {
				url += '?' + toURLParams(urlParams, nullAllowed);
			}
			return '/' + basePath + '/' + url;
		}
		
		function _sendRequest(req) {
			var defer = $q.defer();
			$http(req).success(function(res) {
				if (res.isSuccess) {
					defer.resolve(res.response);
				} else {
					defer.reject(res);
				}
			}).error(function(err) {
				defer.reject(err);
			});
			return defer.promise;
		}
	}];
});

angular.module('tcLib').service('locationService', ['httpService', function(httpService) {
    this.save = save;
    this.locationsList = locationsList;

    function save(location) {
        return httpService.post('location/saveorupdate', location);
    }

    function locationsList() {
        return httpService.get('location/list');
    }
}]);

angular.module('tcLib').service('medicineCategoryService', ['httpService', function(httpService) {
    this.save = save;
    this.medicineCategoryList = medicineCategoryList;

    function save(medicineCategory) {
        return httpService.post('medicinecategory/saveorupdate', medicineCategory);
    }

    function medicineCategoryList() {
        return httpService.get('medicinecategory/list');
    }
}]);

angular.module('tcLib').service('medicineCategoryByDoctorService', ['httpService', function(httpService) {
    this.save = save;
    this.medicineCategoryByDoctorList = medicineCategoryByDoctorList;

    function save(medicineCategoryByDoctor) {
        return httpService.post('medicinecategorybydoctor/saveorupdate', medicineCategoryByDoctor);
    }

    function medicineCategoryByDoctorList() {
        return httpService.get('medicinecategorybydoctor/list');
    }
}]);

angular.module('tcLib').service('medicineService', ['httpService', function(httpService) {
    this.save = save;
    this.medicinesList = medicinesList;
    this.medicineViewList = medicineViewList;

    function save(medicine) {
        return httpService.post('medicine/saveorupdate', medicine);
    }

    function medicineViewList(payload) {
        return httpService.get('medicine/listbyoptions', payload);
    }

    function medicinesList(id) {
        return httpService.get('medicine/list', {
            id: id // optional
        });
    }

}]);

angular.module('tcLib').service('opPatientService', ['httpService', function(httpService) {
    this.save = save;
    this.getOpPatientsListByOptions = getOpPatientsListByOptions;
    this.getOpPatientByPatientId = getOpPatientByPatientId;
    this.getOpPatientCountWithStatusByOpId = getOpPatientCountWithStatusByOpId;
    this.getOrCreatePatientCard = getOrCreatePatientCard;
    this.createPatientCard = createPatientCard;

    function save(opPatient) {
        return httpService.post('oppatient/createorupdate', opPatient);
    }

    function getOpPatientsListByOptions(opPatient) {
        return httpService.post('oppatient/listbyoptions', opPatient);
    }

    function getOpPatientByPatientId(opPatientId) {
        return httpService.get('oppatient/getoppatientbyid/' + opPatientId);
    }

    function getOpPatientCountWithStatusByOpId(opId) {
        return httpService.get('oppatient/statuscount/{opId}',opId);
    }

    function getOrCreatePatientCard(patientCardInfo) {
        return httpService.post('oppatient/patient-card', patientCardInfo);
    }

    function createPatientCard(patientCardInfo) {
        return httpService.post('oppatient/patient-card/new',patientCardInfo);
    }
}]);

angular.module('tcLib').service('opPrescriptionService', ['httpService', function(httpService) {
    this.save = save;
    this.searchPurchaseMedicines = searchPurchaseMedicines;
    this.opPrescriptionList = opPrescriptionList;

    function save(prescription) {
        return httpService.post('opprescription/saveorupdate', prescription);
    }

    function searchPurchaseMedicines(payload) {
        return httpService.get('opprescription/medicine-search', payload);
    }

    function opPrescriptionList(payload) {
        return httpService.get('opprescription/list', payload);
    }

}]);

angular.module('tcLib').service('opService', ['httpService', function(httpService) {
    this.create = create;
    this.search = search;
    this.get = get;
    this.statusList = statusList;
    this.configCreate = configCreate;
    this.configList = configList;

    function create(op) {
        return httpService.post('op/create', op);
    }

    function search(payload) {
        return httpService.post('op/op-list', payload);
    }

    function get(id) {
        return httpService.get('op/get/' + id);
    }

    function statusList(date) {
        return httpService.get('op/op-status-list', {
            date: date
        });
    }

    function configCreate(payload) {
        return httpService.post('op/config/create', payload);
    }

    function configList() {
        return httpService.get('op/config/list');
    }
}]);

angular.module('tcLib').service('patientService', ['httpService', function(httpService) {
    this.save = save;
    this.patientsListByOptions = patientsListByOptions;
    this.imageData = imageData;

    function save(patient) {
        return httpService.post('patient/saveorupdate', patient);
    }

    function patientsListByOptions(payload) {
        return httpService.get('patient/listbyoptions', payload);
    }

    function imageData(payload) {
        return httpService.get('patient/getphoto', payload);
    }

    
  
}]);

angular.module('tcLib').service('purchasebillMedicineService', ['httpService', function(httpService) {
    this.purchaseBillMedicines = purchaseBillMedicines;
    this.alertInfo = alertInfo;
    this.pendingBillMedicines  = pendingBillMedicines;

  
    function purchaseBillMedicines(payload) {
        return httpService.get('purchasebillmedicine/search', payload);
    }

    function alertInfo(payload) {
        return httpService.get('purchasebillmedicine/alertinfo', payload);
    }
    function pendingBillMedicines(billId) {
        return httpService.get('purchasebillmedicine/pendingbills', {
            billId: billId
        });
    }

}]);

angular.module('tcLib').service('purchasebillService', ['httpService', function(httpService) {
    this.createPurchaseBill = createPurchaseBill;
    this.purchaseBillById = purchaseBillById;
    this.purchaseBillsListByOptions = purchaseBillsListByOptions;
    this.purchaseTotal = purchaseTotal;
    this.createPurchaseBillPayment = createPurchaseBillPayment;
    this.purchaseBillPaymentList = purchaseBillPaymentList;
    this.createPurchaseBillReturn = createPurchaseBillReturn;
    this.purchaseReturns = purchaseReturns;
    this.purchaseReturnMedicines = purchaseReturnMedicines;
    this.uploadPurchaseBill = uploadPurchaseBill;

    function createPurchaseBill(purchaseBill) {
        return httpService.post('purchasebill/save', purchaseBill);
    }

    function purchaseBillById(id) {
        return httpService.get('purchasebill/get/{id}' + id);
    }

    function purchaseBillsListByOptions(payload) {
        return httpService.get('purchasebill/search', payload);
    }

    function purchaseTotal(payload) {
        return httpService.get('purchasebill/total', payload);
    }

    function createPurchaseBillPayment(purchasePayment) {
        return httpService.post('purchasebill/payment/save', purchasePayment);
    }

    function purchaseBillPaymentList(payload) {
        return httpService.get('purchasebill/payment/search', payload);
    }

    function createPurchaseBillReturn(purchaseReturn) {
        return httpService.post('purchasebill/return/save', purchaseReturn);
    }    
    
    function purchaseReturns(payload) {
        return httpService.get('purchasebill/returns/get', payload);
    }

    function purchaseReturnMedicines(payload) {
        return httpService.get('purchasebill/return/medicines/get', payload);
    }
    
    function uploadPurchaseBill(payload) {
        return httpService.post('purchasebill/upload/{billId}', payload);
    }

}]);



angular.module('tcLib').service('reportsService', ['httpService', function(httpService) {
    this.salesReports = salesReports;
    this.salesReturnReports = salesReturnReports;
    this.salesPaymentReports = salesPaymentReports;
    this.purchaseReports = purchaseReports;
    this.salesTransactions  = salesTransactions;
    this.purchaseTransactions = purchaseTransactions;
    this.paymentTransactionsByDateRange = paymentTransactionsByDateRange;
    this.adjustMrpByDateRange = adjustMrpByDateRange;
    this.adjustUnitsOrAvailability = adjustUnitsOrAvailability;

    function salesReports(payload) {
        return httpService.get('reports/sales/bills', payload);
    }

    function salesReturnReports(payload) {
        return httpService.get('reports/sales/returns', payload);
    }

    function salesPaymentReports(payload) {
        return httpService.get('reports/sales/payments', payload);
    }


    function purchaseReports(payload) {
        return httpService.get('reports/purchase', payload);
    }

    
    function salesTransactions(payload) {
        return httpService.get('reports/salesTransactions', payload);
    }

    function purchaseTransactions(payload) {
        return httpService.get('reports/purchaseTransactions', payload);
    }

    function paymentTransactionsByDateRange(salesPayment) {
        return httpService.post('reports/create', salesPayment);
    }

    function adjustMrpByDateRange(taxAdjust) {
        return httpService.post('reports/adjustMrp', taxAdjust);
    }

    function adjustUnitsOrAvailability(salesBillMedicines) {
        return httpService.post('reports/adjustunitsoravailability', salesBillMedicines);
    }   

    function salesTransactions(payload) {
        return httpService.get('reports/salesPayments', payload);
    }

}]);

angular.module('tcLib').service('representativeService', ['httpService', function(httpService) {
    this.save = save;
    this.representativesList = representativesList;

    function save(representative) {
        return httpService.post('representative/saveorupdate', representative);
    }

   
    function representativesList() {
        return httpService.get('representative/list');
    }
}]);

angular.module('tcLib').service('salesbillService', ['httpService', function(httpService) {
    this.create = create;
    this.salesBillsListByOptions = salesBillsListByOptions;
    this.salesAmount = salesAmount;
    this.medicineSearch = medicineSearch;
    this.createSalesBillPayment = createSalesBillPayment;
    this.paymentsList = paymentsList;
    this.createSalesBillReturn  = createSalesBillReturn;
    this.returnsList = returnsList;
    this.prescriptionsList = prescriptionsList;
    this.savePrescriptionSale = savePrescriptionSale;
    this.createPrescriptionSale = createPrescriptionSale;
    this.salesReturnTotal = salesReturnTotal;


    this.configCreate = configCreate;
    this.configList = configList;

    function create(salesBill) {
        return httpService.post('salesbill/save', salesBill);
    }

    function salesBillsListByOptions(payload) {
        return httpService.get('salesbill/list', payload);
    }

    function salesAmount(payload) {
        return httpService.get('salesbill/total', payload);
    }

    function medicineSearch(payload) {
        return httpService.get('salesbill/medicines/search', payload);
    }

    function createSalesBillPayment(payment) {
        return httpService.post('salesbill/payment/save', payment);
    }

    function paymentsList(billId) {
        return httpService.get('salesbill/payment/search', {
            billId: billId //optional
        });
    }

    function createSalesBillReturn(salesReturns) {
        return httpService.post('salesbill/return/save', salesReturns);
    }

    function returnsList(payload) {
        return httpService.get('salesbill/return/search', payload);
    }


    function prescriptionsList(payload) {
        return httpService.get('salesbill/prescription/search', payload);
    }

    function savePrescriptionSale(payload) {
        return httpService.post('salesbill/prescription/save/{prescriptionId}', payload);
    }

    function createPrescriptionSale(salesBill) {
        return httpService.post('salesbill/prescription/add', salesBill);
    }
    
    function salesReturnTotal(payload) {
        return httpService.get('salesbill/returns/total', payload);
    }

}]);

angular.module('tcLib').service('supplierService', ['httpService', function(httpService) {
    this.save = save;
    this.suppliersList = suppliersList;

    function save(supplier) {
        return httpService.post('supplier/saveorupdate', supplier);
    }

    function suppliersList() {
        return httpService.get('supplier/list');
    }
}]);

angular.module('tcLib').run(['$templateCache', function($templateCache) {
$templateCache.put('src/camera/camera-modal.html',
    "<div class=\"camera-wrapper row\"><ng-camera capture-message=\"Done!\" class=\"grid-md-5\" countdown=\"3\" output-height=\"240\" output-width=\"320\" viewer-height=\"315\" viewer-width=\"420\" image-format=\"jpeg\" jpeg-quality=\"100\" action-message=\"Take picture\" snapshot=\"model\" overlay-url=\"./assets/images/overlay.png\" shutter-url=\"./assets/sounds/camera-click.mp3\" on-capture=\"onCamCapture($snap)\"></ng-camera><div class=\"preview-wrapper grid-md-5\" ng-if=\"model\"><img ng-src=\"{{model}}\" alt=\"Click capture to see preview\"><div class=\"grid-md-4 ngdialog-buttons\"><button class=\"btn btn-md btn-green\" ng-if=\"confirmText && model\" ng-click=\"confirm();closeThisDialog(0)\">{{confirmText}}</button> <button class=\"btn btn-md btn-grey\" ng-if=\"confirmText\" ng-click=\"cancel();closeThisDialog(0);\">Cancel</button></div></div></div>"
  );


  $templateCache.put('src/date-picker/date-picker.html',
    "<input placeholder=\"{{placeholder}}\" class=\"form-field grid-md-12\" ng-attr-name=\"{{name}}\" ng-model=\"model\" uib-datepicker-popup is-open=\"calendarPanel.opened\" datepicker-options=\"dateOptions\" ng-required=\"{{required}}\" close-text=\"Close\"> <span class=\"form-field-icon\"><button type=\"button\" class=\"btn btn-sm btn-sky-blue\" ng-click=\"openCalendar()\"><i class=\"fa fa-calendar\"></i></button></span>"
  );
}]);

angular.module('tcLib').directive("whenScrolled", function() {
	return {
		restrict: 'A',
		scope: {
			scrollerApi: '=?',
			whenScrolled: '&'
		},
		link: function(scope, elem, attrs) {
			var prevScrollTop = 0;
			raw = elem[0];

            elem.bind("scroll", function() {
				if ((prevScrollTop < raw.scrollTop) && (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight)) {
					scope.whenScrolled();
					prevScrollTop = raw.scrollTop;
				}
			});
			
			function scrollerApi() {
				function resetScroll() {
					prevScrollTop = 0;
					raw.scrollTop = 0;
				}

				return {
					resetScroll: resetScroll
				};
			}

			scope.scrollerApi = scrollerApi();
		}
	};
})