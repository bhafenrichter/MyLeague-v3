var module = angular.module('AccountModule', []);

//var baseurl = "http://localhost:51147";
var baseurl = "http://myleague-data.azurewebsites.net";
module.service('AccountService', ['$http', function ($http) {
    var service = {};

    service.Login = function (Username, Password) {
        return $http.post(baseurl + "/api/Login?Username=" + Username + "&Password=" + Password)
            .success(function (data) {
                if (data != null) {
                    return data;
                } else {
                    return {};
                }
            })
            .error(function () {
                return {};
            });
    };

    service.CreateAccount = function (email, password, firstname, lastname) {
        return $http.post(baseurl + "/api/Create?Email=" + email + "&Password=" + password + "&FirstName=" + firstname + "&LastName=" + lastname)
            .success(function (data) {
                if (data != null) {
                    return data;
                } else {
                    return {};
                }
            })
            .error(function () {
                return {};
            });
    }

    service.GetUser = function (UserId) {
        return $http.get(baseurl + "/api/Users/" + UserId)
            .success(function (data) {
                if (data != null) {
                    return data;
                } else {
                    return {};
                }
            })
            .error(function () {
                return {};
            });
    };

    return service;
}]);