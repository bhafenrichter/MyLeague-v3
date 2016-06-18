var module = angular.module('LeagueModule', []);

var baseurl = "http://localhost:51147";

module.service('LeagueService', ['$http', function ($http) {
    var service = {};
    service.GetLeaguesForUser = function (userid) {
        return $http.get(baseurl + "/api/GetLeaguesForUser?id=" + userid);
    };

    service.CreateLeague = function (name, type, userid) {
        $http.post(baseurl + "/api/CreateLeague?Name=" + name + "&Type=" + type + "&UserID=" + userid);
    }
    return service;
}]);