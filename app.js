angular.module('app', ['ui.bootstrap']);

angular.module('app')
  .controller('HomeController', function($modal, UserService) {
    var vm = this;
    var fuse;

    vm.search = search;
    vm.showHospital = showHospital;
    vm.hospital = {
      '醫院': '臺大醫院',
      '社福中心': '中正',
      '辦公室電話': '02-23962340',
      '主任': '林巧翊主任',
      '主任手機': '972699132',
      '附註': '於臺北市醫院就醫之傷者家屬,若有相關問題,於晚上八點前可撥打社會局社工科電話 02-27206528'
    };

    activate();

    function activate() {
      fetchUsers();
    }

    function fetchUsers() {
      UserService.getUsers().then(function(response) {
        vm.lastmodify = response.data.lastmodify;
        vm.users = response.data.data;
        vm.result = response.data.data;

        var allHospitals = _.unique(_.pluck(vm.users, '收治單位'));
        console.log(allHospitals);

        fuse = new Fuse(vm.users, {
          keys: ['編號', '縣市別', '收治單位', '檢傷編號', '姓名', '性別', '國籍', '年齡',
            '醫療檢傷', '救護檢傷', '即時動向', '轉診要求', '刪除註記'
          ]
        });
      });
    }

    function search(name) {
      var fSearch = _.partial(fussySearch, name);
      var delaySearch = _.throttle(fSearch, 100);

      delaySearch();
    }

    function fussySearch(name) {
      console.log('search', name);
      name = name || vm.searchText;

      if (!name) {
        vm.result = vm.users;
        return;
      }

      vm.result = fuse.search(name);
    }

    function showHospital(name) {
      vm.hospital = _.find(hospitals, {
        '醫院': name
      });

      var modalInstance = $modal.open({
        animation: true,
        controller: 'ModalInstanceCtrl',
        templateUrl: 'hospital.html',
        size: 'lg',
        resolve: {
          hospital: function() {
            return vm.hospital;
          }
        }
      });

      modalInstance.result.then(function(selectedItem) {

      }, function() {

      });
    }
  })
  .controller('ModalInstanceCtrl', function($scope, $modalInstance, hospital) {

    $scope.hospital = hospital;

    $scope.ok = function() {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  })
  .factory('UserService', function($http) {
    return {
      getUsers: getUsers
    };

    function getUsers() {
      return $http.get(
        'https://gist.githubusercontent.com/tony1223/098e45623c73274f7ae3/raw'
      );
    }
  });
