//define the module so that app.js can recognize it
var module = angular.module('HomeController', []);

module.controller('LoginController', ['$scope', 'PopupService', 'AccountService', '$state', '$rootScope', '$ionicLoading', '$ionicHistory', '$ionicSideMenuDelegate', '$window', function ($scope, PopupService, AccountService, $state, $rootScope, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate, $window) {
    $scope.Username = "bhafenri@gmail.com";
    $scope.Password = "password";

    if ($window.localStorage.getItem("UserId") != null && $window.localStorage.getItem("Token") != null) {
        $state.go('Menu.Home');
    }

    $rootScope.isLoggedIn = function () {
        if ($rootScope.User != null) {
            return true;
        } else {
            return false;
        }
    };

    $rootScope.isHomeMenu = function () {
        return $state.includes('Menu.Home');
    };

    $scope.Login = function (Username, Password) {
        //make it a promise
        $ionicLoading.show({ template: 'Logging In' });
        AccountService.Login(Username, Password).then(function (response) {
            console.log(response);
            $ionicLoading.hide();
            if (response.data != null) {
                //set user security token
                AccountService.GenerateSecurityToken(response.data.ID).then(function (response) {
                    console.log("Created Token");
                    $window.localStorage.setItem("UserId", response.data.UserID);
                    $window.localStorage.setItem("Token", response.data.SessionToken);
                    $state.go('Menu.Home');
                });
            } else {
                //user doesn't exist
                PopupService.MessageDialog("Your credentials were incorrect. Please try again.");
            }
        });
    }

    $rootScope.redirectToLeagueMenu = function () {
        $ionicHistory.clearCache();
        if ($ionicSideMenuDelegate.isOpen()) {
            $ionicSideMenuDelegate.toggleRight();
        }
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

module.controller('SettingsController', ['$scope', '$state', '$window', '$rootScope', '$cordovaImagePicker', "$cordovaFileTransfer", function ($scope, $state, $window, $rootScope, $cordovaImagePicker, $cordovaFileTransfer) {
    //check to see if user is logged in
    if ($rootScope.User == null) {
        $state.go('Login');
    }
    console.log($rootScope.User.ID);
    $scope.DeviceHeight = $window.innerHeight;
    $scope.DeviceWidth = $window.innerWidth;

    $scope.chooseProfilePicture = function () {
        var options = {
            maximumImagesCount: 1,
            width: 800,
            height: 800,
            quality: 80
        };

        $cordovaImagePicker.getPictures(options).then(function (results) {
            var options = {};
            options.mimeType = "multipart/form-data";
            options.httpMethod = "POST";
            options.headers = { Connection: "close" };
            $cordovaFileTransfer.upload("http://myleague-data.azurewebsites.net/api/Upload?id=" + $rootScope.User.ID, results[0], {}).then(function (results) {
                console.log(results);
            }, function (err) {
                console.log(err);
            }, function (progress) {
                console.log(progress);
            });

        }, function (error) {
            // error getting photos
            console.log(error);
        });
    }

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

    for (var i = 0; i < $rootScope.User.Leagues.length; i++) {
        if ($rootScope.User.Leagues[i].ID == $stateParams.id) {
            //pull the userleagues from the league iself
            $scope.Model.League = $rootScope.User.Leagues[i];
        }
    }
    console.log($scope.Model);

    $scope.SearchUsers = function (search) {
        LeagueService.SearchUsers(search).then(function (response) {
            $scope.Model.SearchResults = response.data;
        });
    }

    $scope.AddUserToLeague = function (userid, leagueid) {
        LeagueService.AddUserToLeague(userid, leagueid).then(function () {
            PopupService.MessageDialog("User added to League.");
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

    $scope.LeaveLeague = function (id) {
        LeagueService.LeaveLeague(id).then(function () {
            $state.go("Menu.Home");
        });
    }

    $scope.$on('league:updated', function (event, response) {
        //called by refresh
        

        //set the leagues userleague data
        for (var i = 0; i < $rootScope.User.Leagues.length; i++) {
            if ($rootScope.User.Leagues[i].ID == $stateParams.id) {
                $rootScope.User.Leagues[i].UserLeagues.UserLeagues = response;
            }
        }
        console.log($rootScope.User);
        $scope.Model.League.UserLeagues = response.data;
    });
}]);

module.controller('HomeController', ['$scope', '$rootScope', 'LeagueService', 'AccountService', '$ionicHistory', '$window', '$ionicLoading', '$state', function ($scope, $rootScope, LeagueService, AccountService, $ionicHistory, $window, $ionicLoading, $state) {
    $scope.Model = {};

    if ($rootScope.User == null) {
        if ($window.localStorage.getItem("UserId") != null && $window.localStorage.getItem("Token") != null) {
            $ionicLoading.show({ template: 'Loading...' });
            //user has already logged in, use their security token to get their information

            AccountService.ValidateSecurityToken($window.localStorage.getItem("UserId"), $window.localStorage.getItem("Token")).then(function (response) {
                console.log(response);
                if (response.data != null) {
                    $rootScope.User = response.data.User;

                    //initialize homecontroller data
                    $scope.Model.Leagues = [];
                    for (var i = 0; i < $rootScope.User.UserLeagues.length; i++) {
                        if ($rootScope.User.UserLeagues[i].IsDeleted == false) {
                            //current account userleague is not in Leagues UserLeague array by default, must add it manually
                            $rootScope.User.UserLeagues[i].User = $rootScope.User;
                            $rootScope.User.UserLeagues[i].League.UserLeagues.push($rootScope.User.UserLeagues[i]);
                            $scope.Model.Leagues.push($rootScope.User.UserLeagues[i].League);

                        }
                    }
                    $rootScope.User.Leagues = $scope.Model.Leagues;
                    console.log($scope.Model.Leagues);
                    $ionicLoading.hide();
                } else {
                    //userid and token don't match up, clear cache and log in with new token
                    $window.localStorage.clear();
                    $ionicLoading.hide();
                    $state.go("Login");
                }
            });
        } else {
            //the token isn't validated, therefore go back to the login screen
            $window.localStorage.clear();
            $ionicLoading.hide();
            $state.go("Login");
        }
        
    } else {
        //user logged in for the first time, $rootScope.User has already been filled
        //initialize homecontroller data
        $scope.Model.Leagues = [];
        for (var i = 0; i < $rootScope.User.UserLeagues.length; i++) {
            if ($rootScope.User.UserLeagues[i].IsDeleted == false) {
                //current account userleague is not in Leagues UserLeague array by default, must add it manually
                $rootScope.User.UserLeagues[i].User = $rootScope.User;
                $rootScope.User.UserLeagues[i].League.UserLeagues.push($rootScope.User.UserLeagues[i]);
                $scope.Model.Leagues.push($rootScope.User.UserLeagues[i].League);

            }
        }
        $rootScope.User.Leagues = $scope.Model.Leagues;
        console.log($scope.Model.Leagues);
        $ionicLoading.hide();
    }

    //accesses internet, default to local data
    $scope.refreshLeagueFeed = function () {
        LeagueService.GetLeaguesForUser($rootScope.User.ID).then(function (response) {
            $rootScope.User.Leagues = response.data;
            $scope.$broadcast('scroll.refreshComplete');
        });
    }

    $rootScope.ProfilePictureUrlBase = "https://myleague.blob.core.windows.net/profile-picture/";
}]);


module.controller('LeagueHomeController', ['$scope', 'AccountService', '$rootScope', 'LeagueService', '$stateParams', function ($scope, AccountService, $rootScope, LeagueService, $stateParams) {


    $scope.Model = {};
    $scope.Model._Name = "LeagueHome";

    for (var i = 0; i < $rootScope.User.Leagues.length; i++) {
        console.log($rootScope.User);
        if ($rootScope.User.Leagues[i].ID == $stateParams.id) {
            $scope.Model.League = $rootScope.User.Leagues[i];
            $scope.Model.UserLeague = $rootScope.User.UserLeagues[i];
        }
    }

    //load the games from  server because it takes load off of initial hit
    LeagueService.GetGamesForLeague($stateParams.id).then(function (response) {
        $scope.Model.Games = response.data;
        $scope.$broadcast('scroll.refreshComplete');
        //console.log(response);
    });

    LeagueService.GetUserLeaguesForLeague($stateParams.id).then(function (response) {
        console.log("broadcasting");
        $rootScope.$broadcast('league:updated', response);
    });

    $scope.refreshLeague = function () {
        LeagueService.GetGamesForLeague($stateParams.id).then(function (response) {
            $scope.Model.Games = response.data;
            $scope.$broadcast('scroll.refreshComplete');
            //console.log(response);
        });

        LeagueService.GetUserLeaguesForLeague($stateParams.id).then(function (response) {
            console.log("broadcasting");
            $rootScope.$broadcast('league:updated', response);
        });
    }
    console.log($scope.Model);
}]);

module.controller('CreateGameController', ['$scope', 'AccountService', '$rootScope', '$stateParams', '$ionicModal', 'LeagueService', 'PopupService', '$state', function ($scope, AccountService, $rootScope, $stateParams, $ionicModal, LeagueService, PopupService, $state) {
    $scope.Model = {};
    $scope.Game = {};
    $scope.OpponentUrl = "https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg";

    $scope.Model._Name = "CreateGame";
    for (var i = 0; i < $rootScope.User.UserLeagues.length; i++) {
        if ($rootScope.User.UserLeagues[i].LeagueID == $stateParams.id) {
            $scope.Model.User = $rootScope.User.UserLeagues[i];
        }
    }

    PopupService.InitializeModal($ionicModal, $scope, 'templates/modal.html');

    LeagueService.GetUserLeaguesForLeague($stateParams.id).then(function (response) {
        $scope.Model.UserLeagues = response.data;
        console.log($scope.Model);
    });

    $scope.SelectUser = function (user) {
        if (user.UserID != $scope.Model.User.UserID) {
            $scope.Model.Opponent = user;
            $scope.OpponentUrl = $rootScope.ProfilePictureUrlBase + $scope.Model.Opponent.ID + ".png";
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

}]);

module.controller('ProfileController', ['$scope', 'AccountService', '$rootScope', '$stateParams', 'LeagueService', '$window', '$ionicLoading', function ($scope, AccountService, $rootScope, $stateParams, LeagueService, $window, $ionicLoading) {
    $scope.Model = {};
    $scope.Model._name = "Profile";

    $scope.DeviceHeight = $window.innerHeight;
    $scope.DeviceWidth = $window.innerWidth;

    $ionicLoading.show({ template: 'Loading User' });

    //index used for looking up userleagues
    var leagueIndex = 0; 
    for (var i = 0; i < $rootScope.User.Leagues.length; i++) {
        for (var j = 0; j < $rootScope.User.Leagues[i].UserLeagues.length; j++) {
            if ($rootScope.User.Leagues[i].UserLeagues[j].ID == $stateParams.id) {
                console.log($rootScope.User.Leagues[i].UserLeagues[j]);
                leagueIndex = i;
                $scope.Model.UserLeague = $rootScope.User.Leagues[i].UserLeagues[j];
                $scope.Model.User = $rootScope.User.Leagues[i].UserLeagues[j].User;
                $scope.Model.UserLeague.GamesPlayed = $scope.Model.UserLeague.Games.length + $scope.Model.UserLeague.Games1.length;
                $ionicLoading.hide();
                console.log($scope.Model.UserLeague);
            }
        }
    }

    $scope.GetUserLeague = function (id) {
        for (var i = 0; i < $rootScope.User.Leagues[leagueIndex].UserLeagues.length; i++) {
            if ($rootScope.User.Leagues[leagueIndex].UserLeagues[i].ID == id) {
                return $rootScope.User.Leagues[leagueIndex].UserLeagues[i];
            }
        }
    }
    
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