angular.module('tcLib').service('tcOPService', ['httpService', function(httpService) {
    this.create = create;
    this.search = search;
    this.get = get;
    this.statusList = statusList;
    this.configCreate = configCreate;
    this.configList = configList;
    this.login = login;

    function login(payload) {
        return httpService.post('auth/login', payload);
    }

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
