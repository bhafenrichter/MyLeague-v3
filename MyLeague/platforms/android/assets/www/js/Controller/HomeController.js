//define the module so that app.js can recognize it
var module = angular.module('HomeController', []);

module.controller('LoginController', ['$scope', 'PopupService', 'AccountService', '$state', '$rootScope', function ($scope, PopupService, AccountService, $state, $rootScope) {
    $scope.Username = "bhafenri@gmail.com";
    $scope.Password = "password";

    $scope.Login = function (Username, Password) {
        //make it a promise
        AccountService.Login(Username, Password).then(function (response) {
            //console.log(response);
            if (response.data != null) {
                //user exists, redirect to home page
                $rootScope.User = response.data;
                $state.go('Menu.Home');
            } else {
                //user doesn't exist
                PopupService.MessageDialog("Your credentials were incorrect. Please try again.");
            }
        });
    }
}]);

module.controller('CreateController', ['$scope', 'PopupService', 'AccountService', '$state', '$rootScope', function ($scope, PopupService, AccountService, $state, $rootScope) {
    $scope.CreateAccount = function (email, password, firstname, lastname) {
        AccountService.CreateAccount(email, password, firstname, lastname);
    };
}]);

module.controller('MenuController', ['$scope', '$state', '$window', '$rootScope', function ($scope, $state, $window, $rootScope) {
    //check to see if user is logged in
    if ($rootScope.User == null) {
        $state.go('Login');
    }
    console.log($rootScope.User);
    $scope.Logout = function () {
        $state.go('Login');
    }

    $scope.DeviceHeight = $window.innerHeight;
    $scope.DeviceWidth = $window.innerWidth;

}]);

module.controller('HomeController', ['$scope', '$rootScope', 'LeagueService', function ($scope, $rootScope, LeagueService) {
    $scope.Model = {};
    $scope.Model.Leagues = LeagueService.GetLeaguesForUser($rootScope.User.ID).then(function (response) {
        $rootScope.User.Leagues = response.data;
        console.log($rootScope.User);
    });
    
}]);

module.controller('ProfileController', ['$scope', 'AccountService', '$rootScope', function ($scope, AccountService, $rootScope) {

}]);

module.controller('CreateLeagueController', ['$scope', '$rootScope', 'LeagueService', function ($scope, $rootScope, LeagueService) {
    $scope.CreateLeague = function (name, type) {
        LeagueService.CreateLeague(name, type, $rootScope.User.ID);
    };
}]);