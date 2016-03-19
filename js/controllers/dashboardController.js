var dashboardApp = angular.module('hack24-dashboard', ['pusher-angular']);

dashboardApp.factory('ChallengesService', function() {
  return function() {
    return [
      { name: 'Cronofy', image:'img/Cronofy.png'},
      { name: 'Blenheim Chalcot', image:'img/BlenheimChalcot.png'},
      { name: 'Esendex', image: 'img/Esendex.png' },
      { name: 'Artificial Minds', image: 'img/ArtificialMinds.png' },
      { name: 'MHR', image: 'img/MHR.png' },
      { name: 'Packed Pixels', image: 'img/PackedPixels.png' },
      { name: 'Pusher', image: 'img/Pusher.png' },
      { name: 'Tech Nottingham', image: 'img/TechNottingham.png' }
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

    var client = new Pusher('ab3012cb643ea1541144', { cluster: 'eu' });
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
