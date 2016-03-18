var dashboardApp = angular.module('hack24-dashboard', ['pusher-angular']);

dashboardApp.factory('ChallengesService', function() {
  return function() {
    return [
      { name: 'Cronofy', image:'http://static1.squarespace.com/static/54f1b189e4b0f6df27b46455/t/56cf6e23b6aa60ad3e53602d/1456434751380/?format=750w'},
      { name: 'Blenheim Chalcot', height:'80px', image:'http://static1.squarespace.com/static/54f1b189e4b0f6df27b46455/t/56cf6f6a2b8dde932f49f1e6/1456435065478/?format=750w'},
      { name: 'Esendex', height:'60px', image: 'http://static1.squarespace.com/static/54f1b189e4b0f6df27b46455/t/56cf6fe22fe131a105bf2b3e/1456435191171/?format=750w' },
      { name: 'Artificial Minds', image: 'http://static1.squarespace.com/static/54f1b189e4b0f6df27b46455/t/56cf7053d51cd4432a4dae03/1456435301411/?format=750w' },
      { name: 'MHR', image: 'http://static1.squarespace.com/static/54f1b189e4b0f6df27b46455/t/56deee6eab48def3179e4d2d/1457450634906/?format=500w' },
      { name: 'Packed Pixels', image: 'http://static1.squarespace.com/static/54f1b189e4b0f6df27b46455/t/56cf7107859fd0aad5a1e1be/1456435470162/?format=750w' },
      { name: 'Pusher', height:'80px', image: 'http://static1.squarespace.com/static/54f1b189e4b0f6df27b46455/t/56cf71faf850828b7a3878f7/1456435720688/?format=750w' },
      { name: 'Tech Nottingham', height:'90px', image: 'http://static1.squarespace.com/static/54f1b189e4b0f6df27b46455/t/56e40751ab48de1dc3bc74e4/1457784685204/?format=500w' }
    ];
  }
});

dashboardApp.controller('DashboardCtrl', ['$scope', '$http', '$interval', '$pusher', 'ChallengesService',
  function($scope, $http, $interval, $pusher, challengesService) {
    $scope.events = [];

    $scope.totalTeams = 99;
    $scope.totalHacks = 150;

    const yayson = window.yayson();

    $http.get('http://api.hack24.co.uk/teams').then((result) => {
      const store = new yayson.Store()
      const teams = store.sync(result.data)
      $scope.totalTeams = teams.length
    })

    $scope.sponsors = challengesService();

    $interval(function() {
      $scope.currentTime = moment().format('ddd HH:mm');
      $scope.timeRemaining = getDateDiff();
    }, 1000);

    var client = new Pusher('7ca76e24461e7363e0fd', { cluster: 'eu' });
    var pusher = $pusher(client);
    var channel = pusher.subscribe('api_events');
    channel.bind('teams_add',
      function(data) {
        var event = {timestamp: moment().format('HH:mm') , data: data.message};
        $scope.events.push(event);
        console.log(event);
      }
    );
  }]);

function getDateDiff() {
  var a = moment();
  var b = moment('20/03/2016 12:00', 'DD/MM/YYYY hh:mm');
  var diffe = moment.duration(b.diff(a));

  var hours = Math.floor(diffe / (60 * 60 * 1000));
  var minutes = Math.floor((diffe / (60 * 1000)) % 60) + 1;

  //return hours + ":" + minutes;
  return diffe.humanize();
}

dashboardApp.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});