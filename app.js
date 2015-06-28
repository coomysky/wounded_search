angular.module('app', ['ngMaterial']);

angular.module('app')
  .controller('HomeController', function($mdDialog, UserService) {
    var vm = this;
    var fuse;

    vm.search = search;
    vm.showHospital = showHospital;
    vm.hospitals = hospitals;
    vm.hospital = {};
    vm.loaded = false;

    activate();

    function activate() {
      fetchUsers();
    }

    function fetchUsers() {
      UserService.getUsers().then(function(response) {
        var data = response.data;
        var hospital;
        var sources = data.source.split('http');

        vm.lastmodify = data.lastmodify;
        vm.users = processUsers(data.data);
        vm.result = vm.users;
        vm.loaded = true;
        vm.source = {
          name: sources[0].trim(),
          url: 'http' + sources[1]
        };

        fuse = new Fuse(vm.users, {
          keys: ['編號', '縣市別', '收治單位', '檢傷編號', '姓名', '性別', '國籍', '年齡',
            '醫療檢傷', '救護檢傷', '即時動向', '轉診要求', '刪除註記'
          ]
        });
      });
    }

    function processUsers(users) {
      return _.map(users, function(user) {
        user['即時動向'] = user['即時動向'].trim();
        user['救護檢傷'] = user['救護檢傷'].trim();
        user.hospital_tel = (hospital = _.find(hospitals, function(
          h) {
          return h['醫院'] === user['收治單位'];
        })) && hospital['辦公室電話'];

        return user;
      });
    }

    function search() {
      vm.result = vm.searchText ? fuse.search(vm.searchText) : vm.users;
    }

    function showHospital(ev, name) {
      vm.hospital = _.find(hospitals, {
        '醫院': name
      });

      $mdDialog.show({
        resolve: {
          hospital: function() {
            return vm.hospital;
          }
        },
        controller: DialogController,
        templateUrl: 'hospital.html',
        parent: angular.element(document.body),
        targetEvent: ev
      });
    }
  })
  .factory('UserService', function($http) {
    return {
      getUsers: getUsers
    };

    function getUsers() {
      return $http.get(
        'http://tonyq.org/kptaipei/api-20150628.php'
      );
    }
  });

function DialogController($scope, $mdDialog, hospital) {
  $scope.hospital = hospital;

  $scope.close = function() {
    $mdDialog.cancel();
  };
}
