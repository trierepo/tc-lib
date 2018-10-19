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
