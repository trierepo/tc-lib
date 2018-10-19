angular.module('tcLib').service('opService', ['httpProvider', function(httpProvider) {
    return {
        create: create,
        search: search,
        get: get,
        statusList: statusList,
        configCreate: configCreate,
        configList: configList
    };

    function create(op) {
        return httpProvider.post('op/create', op);
    }

    function search(payload) {
        return httpProvider.post('op/op-list', payload);
    }

    function get(id) {
        return httpProvider.get('op/get/' + id);
    }

    function statusList(date) {
        return httpProvider.get('op/op-status-list', {
            date: date
        });
    }

    function configCreate(payload) {
        return httpProvider.post('op/config/create', payload);
    }

    function configList() {
        return httpProvider.get('op/config/list');
    }
}]);
