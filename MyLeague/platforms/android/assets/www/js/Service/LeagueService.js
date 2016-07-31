var module = angular.module('LeagueModule', []);

var baseurl = "http://localhost:51147";
//var baseurl = "http://myleague-data.azurewebsites.net"
module.service('LeagueService', ['$http', function ($http) {
    var service = {};
    service.GetLeaguesForUser = function (userid) {
        return $http.get(baseurl + "/api/GetLeaguesForUser?id=" + userid);
    };

    service.CreateLeague = function (name, type, userid) {
        return $http.post(baseurl + "/api/CreateLeague?Name=" + name + "&Type=" + type + "&UserID=" + userid);
    }

    service.GetGamesForLeague = function (id) {
        return $http.get(baseurl + "/api/GetGamesForLeague?id=" + id);
    }

    service.GetUserLeaguesForLeague = function (id) {
        return $http.get(baseurl + "/api/GetUserLeaguesForLeague?id=" + id);
    }

    service.LeaveLeague = function (id) {
        return $http.post(baseurl + "/api/LeaveLeague?userleagueid=" + id);
    }

    service.CreateGame = function (user, opponent, game) {
        console.log(user);
        console.log(opponent);
        console.log(game);
        return $http.post(baseurl + "/api/CreateGame?" 
            + "userid=" + user.ID
            + "&opponentid=" + opponent.ID
            + "&userscore=" + game.userScore
            + "&opponentscore=" + game.opponentScore
            //+ "&lat=" + game.latitude
            //+ "&lng=" + game.longitude
            + "&lat=" + 0
            + "&lng=" + 0
            + "&leagueid=" + user.LeagueID);
    };

    service.GetGamesPlayedCountForUser = function (id) {
        return $http.get(baseurl + "/api/GetGamesPlayedCountForUser?id=" + id);
    }

    service.GetGamesForUserLeague = function (id) {
        return $http.get(baseurl + "/api/GetGamesForUserLeague?id=" + id);
    };

    service.SearchUsers = function (search) {
        return $http.get(baseurl + "/api/SearchUsers?searchtext=" + search);
    }

    service.AddUserToLeague = function (userid, leagueid) {
        return $http.post(baseurl + "/api/AddUserToLeague?userid=" + userid + "&leagueid=" + leagueid);
    }

    service.GetUserForID = function (id) {
        return $http.get(baseurl + "/api/Users/" + id);
    }

    service.GetUserLeagueForID = function (id) {
        return $http.get(baseurl + "/api/UserLeagues/" + id);
    }
    return service;
}]);