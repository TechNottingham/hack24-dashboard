var dashboardApp = angular.module('hack24-dashboard', ['pusher-angular']);

dashboardApp.factory('ChallengesService', function() {
  return function() {
    return [
      { name: 'Cronofy' },
      { name: 'Blenheim Chalcot' },
      { name: 'Esendex' },
      { name: 'Artificial Minds' },
      { name: 'MHR' },
      { name: 'Packed Pixels' },
      { name: 'Pusher' },
      { name: 'Tech Nottingham' },
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

    $scope.teams = challengesService();

    $interval(function() {
      $scope.currentTime = moment().format('ddd HH:mm');
      $scope.timeRemaining = getDateDiff();
    }, 1000);

    var client = new Pusher('7ca76e24461e7363e0fd', { cluster: 'eu' });
    var pusher = $pusher(client);
    var channel = pusher.subscribe('api_events');
    channel.bind('teams_add',
      function(data) {
        $scope.events.push(data);
        console.log(data);
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