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
    $scope.Logout = function () {
        $state.go('Login');
    }

    $scope.DeviceHeight = $window.innerHeight;
    $scope.DeviceWidth = $window.innerWidth;

}]);

module.controller('LeagueMenuController', ['$scope', '$state', '$window', '$rootScope', 'LeagueService','$stateParams','$ionicModal', 'PopupService', function ($scope, $state, $window, $rootScope, LeagueService, $stateParams, $ionicModal, PopupService) {
    //check to see if user is logged in
    if ($rootScope.User == null) {
        $state.go('Login');
    }
    $scope.Logout = function () {
        $state.go('Login');
    }

    PopupService.InitializeModal($ionicModal, $scope, 'templates/modal.html');

    $scope.DeviceHeight = $window.innerHeight;
    $scope.DeviceWidth = $window.innerWidth;

    $scope.Model = {};
    $scope.Model._Name = "LeagueMenuController";
    
    LeagueService.GetUserLeaguesForLeague($stateParams.id).then(function (response) {
        $rootScope.UserLeagues = response.data;
        $scope.Model.UserLeagues = response.data;
        $scope.Model.League = response.data[0].League;
        console.log($scope.Model);
    });

    $scope.SearchUsers = function (search) {
        LeagueService.SearchUsers(search).then(function (response) {
            $scope.Model.SearchResults = response.data;
        });
    }

    $scope.AddUserToLeague = function (userid, leagueid) {
        LeagueService.AddUserToLeague(userid, leagueid).then(function () {
            $scope.$apply();
        });
    }
}]);

module.controller('HomeController', ['$scope', '$rootScope', 'LeagueService', function ($scope, $rootScope, LeagueService) {
    $scope.Model = {};
    $scope.Model.Leagues = LeagueService.GetLeaguesForUser($rootScope.User.ID).then(function (response) {
        $rootScope.User.Leagues = response.data;
    });
    
}]);


module.controller('LeagueHomeController', ['$scope', 'AccountService', '$rootScope', 'LeagueService', '$stateParams', function ($scope, AccountService, $rootScope, LeagueService, $stateParams) {
    $scope.Model = {};
    $scope.Model._Name = "LeagueHome";

    for (var i = 0; i < $rootScope.User.Leagues.length; i++) {
        if ($rootScope.User.Leagues[i].ID == $stateParams.id) {
            $scope.Model.League = $rootScope.User.Leagues[i];
            $scope.Model.UserLeague = $rootScope.User.UserLeagues[i];
        }
    }

    LeagueService.GetGamesForLeague($stateParams.id).then(function (response) {
        $scope.Model.Games = response.data;
        $rootScope.Games = response.data;
        //console.log(response);
    });

    console.log($scope.Model);
}]);

module.controller('CreateGameController', ['$scope', 'AccountService', '$rootScope', '$stateParams', '$ionicModal', 'LeagueService', 'PopupService', '$state', function ($scope, AccountService, $rootScope, $stateParams, $ionicModal, LeagueService, PopupService, $state) {
    $scope.Model = {};
    $scope.Model._Name = "CreateGame";
    for (var i = 0; i < $rootScope.User.UserLeagues.length; i++) {
        if ($rootScope.User.UserLeagues[i].LeagueID == $stateParams.id) {
            $scope.Model.User = $rootScope.User.UserLeagues[i];
        }
    }

    PopupService.InitializeModal($ionicModal, $scope, 'templates/modal.html');

    $scope.Model.UserLeagues = $rootScope.UserLeagues;

    $scope.SelectUser = function (user) {
        $scope.Model.Opponent = user;
        $scope.closeModal();
    };

    $scope.CreateGame = function (user, opponent, game) {
        LeagueService.CreateGame(user, opponent, game).then(function (response) {
            $state.go('LeagueMenu.LeagueHome');
        });
    }

    console.log($scope.Model);
}]);

module.controller('ProfileController', ['$scope', 'AccountService', '$rootScope', '$stateParams', 'LeagueService', '$window', function ($scope, AccountService, $rootScope, $stateParams, LeagueService, $window) {
    $scope.Model = {};
    $scope.Model._name = "Profile";

    $scope.DeviceHeight = $window.innerHeight;
    $scope.DeviceWidth = $window.innerWidth;

    for (var i = 0; i < $rootScope.UserLeagues.length; i++) {
        if ($rootScope.UserLeagues[i].ID == $stateParams.id) {
            $scope.Model.UserLeague = $rootScope.UserLeagues[i];
            $scope.Model.User = $rootScope.UserLeagues[i].User;
            console.log($scope.Model);

            LeagueService.GetGamesPlayedCountForUser($stateParams.id).then(function (response) {
                $scope.Model.UserLeague.GamesPlayed = response.data;
            });
        }
    }
}]);

module.controller('ScheduleController', ['$scope', 'AccountService', '$rootScope', '$stateParams', 'LeagueService', function ($scope, AccountService, $rootScope, $stateParams, LeagueService) {
    $scope.Model = {};
    $scope.Model._name = "Schedule";

    for (var i = 0; i < $rootScope.UserLeagues.length; i++) {
        if ($rootScope.UserLeagues[i].ID == $stateParams.id) {
            $scope.Model.UserLeague = $rootScope.UserLeagues[i];
            $scope.Model.User = $rootScope.UserLeagues[i].User;
            console.log($scope.Model);

            LeagueService.GetGamesForUserLeague($stateParams.id).then(function (response) {
                $scope.Model.Games = response.data;
            });
        }
    }
}]);

module.controller('CreateLeagueController', ['$scope', '$rootScope', 'LeagueService', function ($scope, $rootScope, LeagueService) {
    $scope.CreateLeague = function (name, type) {
        LeagueService.CreateLeague(name, type, $rootScope.User.ID);
    };
}]);