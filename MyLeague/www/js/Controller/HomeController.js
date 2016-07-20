//define the module so that app.js can recognize it
var module = angular.module('HomeController', []);

module.controller('LoginController', ['$scope', 'PopupService', 'AccountService', '$state', '$rootScope', '$ionicLoading', '$ionicHistory', function ($scope, PopupService, AccountService, $state, $rootScope, $ionicLoading, $ionicHistory) {
    $scope.Username = "bhafenri@gmail.com";
    $scope.Password = "password";
    $rootScope.isLoggedIn = function () {
        if ($rootScope.User != null) {
            return true;
        } else {
            return false;
        }
    };
    
    $scope.Login = function (Username, Password) {
        //make it a promise
        $ionicLoading.show({ template: 'Logging In' });
        AccountService.Login(Username, Password).then(function (response) {
            console.log(response);
            $ionicLoading.hide();
            if (response.data != null) {
                //user exists, redirect to home page
                $rootScope.User = response.data;
                $rootScope.User.Leagues = {};
                $state.go('Menu.Home');
            } else {
                //user doesn't exist
                PopupService.MessageDialog("Your credentials were incorrect. Please try again.");
            }
        });
    }

    $rootScope.redirectToLeagueMenu = function () {
        $state.go('Menu.Home');
    }
}]);

module.controller('CreateController', ['$scope', 'PopupService', 'AccountService', '$state', '$rootScope', function ($scope, PopupService, AccountService, $state, $rootScope) {
    $scope.CreateAccount = function (email, password, firstname, lastname) {
        AccountService.CreateAccount(email, password, firstname, lastname).then(function (response) {
            PopupService.MessageDialog("Account Created.");
            $state.go("Login");
        });
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

module.controller('RequestsController', ['$scope', '$state', '$window', '$rootScope', function ($scope, $state, $window, $rootScope) {
    //check to see if user is logged in
    if ($rootScope.User == null) {
        $state.go('Login');
    }

    $scope.DeviceHeight = $window.innerHeight;
    $scope.DeviceWidth = $window.innerWidth;

}]);

module.controller('LeagueMenuController', ['$scope', '$state', '$window', '$rootScope', 'LeagueService', '$stateParams', '$ionicModal', 'PopupService', '$ionicNavBarDelegate', '$ionicSideMenuDelegate', function ($scope, $state, $window, $rootScope, LeagueService, $stateParams, $ionicModal, PopupService, $ionicNavBarDelegate, $ionicSideMenuDelegate) {
    $ionicNavBarDelegate.showBackButton(true);

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
            PopupService.MessageDialog("User Invited to League.");
            LeagueService.GetUserLeaguesForLeague($stateParams.id).then(function (response) {
                $scope.Model.UserLeagues = response.data;
                $scope.Model.League = response.data[0].League;
                console.log($scope.Model);
            });
            $state.go("LeagueMenu.LeagueHome");
        });
    }

    $rootScope.toggleLeagueMenu = function () {
        $ionicSideMenuDelegate.toggleRight();
    };
}]);

module.controller('HomeController', ['$scope', '$rootScope', 'LeagueService', '$ionicHistory', function ($scope, $rootScope, LeagueService, $ionicHistory) {
    $scope.Model = {};
    $scope.Model.Leagues = LeagueService.GetLeaguesForUser($rootScope.User.ID).then(function (response) {
        $rootScope.User.Leagues = response.data;
    });
    
    $scope.refreshLeagueFeed = function () {
        LeagueService.GetLeaguesForUser($rootScope.User.ID).then(function (response) {
            $rootScope.User.Leagues = response.data;
            $scope.$broadcast('scroll.refreshComplete');
        });

    }
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
        //console.log(response);
    });

    $scope.refreshLeague = function(){
        LeagueService.GetGamesForLeague($stateParams.id).then(function (response) {
            $scope.Model.Games = response.data;
            $scope.$broadcast('scroll.refreshComplete');
            //console.log(response);
        });
    }

    console.log($scope.Model);
}]);

module.controller('CreateGameController', ['$scope', 'AccountService', '$rootScope', '$stateParams', '$ionicModal', 'LeagueService', 'PopupService', '$state', function ($scope, AccountService, $rootScope, $stateParams, $ionicModal, LeagueService, PopupService, $state) {
    $scope.Model = {};
    $scope.Game = {};
    $scope.Model._Name = "CreateGame";
    for (var i = 0; i < $rootScope.User.UserLeagues.length; i++) {
        if ($rootScope.User.UserLeagues[i].LeagueID == $stateParams.id) {
            $scope.Model.User = $rootScope.User.UserLeagues[i];
        }
    }

    PopupService.InitializeModal($ionicModal, $scope, 'templates/modal.html');

    LeagueService.GetUserLeaguesForLeague($stateParams.id).then(function (response) {
        $scope.Model.UserLeagues = response.data;
    });

    $scope.SelectUser = function (user) {
        if (user.UserID != $scope.Model.User.UserID) {
            $scope.Model.Opponent = user;
            $scope.closeModal();
        } else {
            PopupService.MessageDialog("You cannot select yourself.");
        }
    };

    $scope.CreateGame = function (user, opponent, game) {
        LeagueService.CreateGame(user, opponent, game).then(function (response) {
            PopupService.MessageDialog("Game added to League.");
            $state.go('LeagueMenu.LeagueHome');
        });
    }

    $scope.numberPickerObject = {
        inputValue: 0, //Optional
        minValue: -9007199254740991,
        maxValue: 9007199254740991,
        format: "WHOLE",  //Optional - "WHOLE" or "DECIMAL"
        unit: "",  //Optional - "m", "kg", "℃" or whatever you want
        titleLabel: 'Set Score',  //Optional
        setLabel: 'Set',  //Optional
        closeLabel: 'Close',  //Optional
        setButtonType: 'button-positive',  //Optional
        closeButtonType: 'button-stable',  //Optional
        callback: function (val) {    //Mandatory
            if (val != 0) {
                $scope.Game.userScore = val;
            }
            
        }
    };

    $scope.opponentNumberPickerObject = {
        inputValue: 0, //Optional
        minValue: -9007199254740991,
        maxValue: 9007199254740991,
        format: "WHOLE",  //Optional - "WHOLE" or "DECIMAL"
        unit: "",  //Optional - "m", "kg", "℃" or whatever you want
        titleLabel: 'Set Score',  //Optional
        setLabel: 'Set',  //Optional
        closeLabel: 'Close',  //Optional
        setButtonType: 'button-positive',  //Optional
        closeButtonType: 'button-stable',  //Optional
        callback: function (val) {    //Mandatory
            if (val != 0) {
                $scope.Game.opponentScore = val;
            }
        }
    };

    console.log($scope.Model);
}]);

module.controller('ProfileController', ['$scope', 'AccountService', '$rootScope', '$stateParams', 'LeagueService', '$window','$ionicLoading', function ($scope, AccountService, $rootScope, $stateParams, LeagueService, $window, $ionicLoading) {
    $scope.Model = {};
    $scope.Model._name = "Profile";

    $scope.DeviceHeight = $window.innerHeight;
    $scope.DeviceWidth = $window.innerWidth;

    $ionicLoading.show({ template: 'Loading User' });

    LeagueService.GetUserLeagueForID($stateParams.id).then(function (response) {
        console.log(response);
        $scope.Model.UserLeague = response.data;
        $scope.Model.User = response.data.User;
        LeagueService.GetGamesPlayedCountForUser($stateParams.id).then(function (response) {
            $scope.Model.UserLeague.GamesPlayed = response.data;
            $ionicLoading.hide();
            console.log($scope.Model);
        });
    });
}]);

module.controller('ScheduleController', ['$scope', 'AccountService', '$rootScope', '$stateParams', 'LeagueService', function ($scope, AccountService, $rootScope, $stateParams, LeagueService) {
    $scope.Model = {};
    $scope.Model._name = "Schedule";

    LeagueService.GetGamesForUserLeague($stateParams.id).then(function (response) {
        $scope.Model.Games = response.data;
    });

}]);

module.controller('CreateLeagueController', ['$scope', '$rootScope', 'LeagueService', '$ionicHistory', function ($scope, $rootScope, LeagueService, $ionicHistory) {
    $scope.User = $rootScope.User;
    $scope.CreateLeague = function (name, type) {
        LeagueService.CreateLeague(name, type, $scope.User.ID).then(function (event) {
            LeagueService.GetLeaguesForUser($scope.User.ID).then(function (response) {
                $rootScope.User.Leagues = response.data;
                $ionicHistory.goBack();
            });
        });
    };
}]);