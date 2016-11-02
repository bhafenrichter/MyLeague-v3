//define the module so that app.js can recognize it
var module = angular.module('HomeController', []);

module.controller('LoginController', ['$scope', 'PopupService', 'AccountService', '$state', '$rootScope', '$ionicLoading', '$ionicHistory', '$ionicSideMenuDelegate', '$window', function ($scope, PopupService, AccountService, $state, $rootScope, $ionicLoading, $ionicHistory, $ionicSideMenuDelegate, $window) {
    $scope.Username = "bhafenri@gmail.com";
    $scope.Password = "password";

    if ($window.localStorage.getItem("UserId") != null && $window.localStorage.getItem("Token") != null) {
        $ionicHistory.clearCache();
        $state.go('LeagueMenu.Home');
    }

    $rootScope.isLeagueHome = function () {
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
                //set user security token
                AccountService.GenerateSecurityToken(response.data.ID).then(function (response) {
                    console.log("Created Token");
                    $window.localStorage.setItem("UserId", response.data.UserID);
                    $window.localStorage.setItem("Token", response.data.SessionToken);
                    $state.go('LeagueMenu.Home');
                });
            } else {
                //user doesn't exist
                PopupService.MessageDialog("Your credentials were incorrect. Please try again.");
            }
        });
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

module.controller('SettingsController', ['$scope', '$state', '$window', '$rootScope', '$cordovaImagePicker', "$cordovaFileTransfer", 'AccountService', 'PopupService', function ($scope, $state, $window, $rootScope, $cordovaImagePicker, $cordovaFileTransfer, AccountService, PopupService) {
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

    $scope.SaveUser = function (firstName, lastName) {
        AccountService.SaveUser($rootScope.User.ID, firstName, lastName).then(function (response) {
            if (response.data == true) {
                $rootScope.User.FirstName = firstName;
                $rootScope.User.LastName = lastName;
            } else {
                PopupService.MessageDialog("There was an internal error.  Please try again later.");
            }
            
            $state.go("Home");
        });
    };

}]);

module.controller('LeagueMenuController', ['$scope', '$state', '$window', '$rootScope', 'LeagueService', '$stateParams', '$ionicModal', 'PopupService', '$ionicNavBarDelegate', '$ionicSideMenuDelegate', '$cordovaImagePicker', '$cordovaFileTransfer', function ($scope, $state, $window, $rootScope, LeagueService, $stateParams, $ionicModal, PopupService, $ionicNavBarDelegate, $ionicSideMenuDelegate, $cordovaImagePicker, $cordovaFileTransfer) {
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

    if ($rootScope.User != null) {
        for (var i = 0; i < $rootScope.User.Leagues.length; i++) {
            if ($rootScope.User.Leagues[i].ID == $stateParams.id) {
                //pull the userleagues from the league iself
                $scope.Model.League = $rootScope.User.Leagues[i];
            }
        }

        //get max # of games played by any user for heuristic
        var maxGameCount = 0;
        for (var i = 0; i < $scope.Model.League.UserLeagues.length; i++) {
            if ($scope.Model.League.UserLeagues[i].Games.length + $scope.Model.League.UserLeagues[i].Games1.length > maxGameCount) {
                maxGameCount = $scope.Model.League.UserLeagues[i].Games.length + $scope.Model.League.UserLeagues[i].Games1.length;
            }
        }
    } else {
        $scope.Model.League = [];
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
            
            $state.go("LeagueMenu.LeagueHome");
        });
    }

    $rootScope.toggleLeagueMenu = function () {
        $ionicSideMenuDelegate.toggleRight();
    };

    $scope.LeaveLeague = function (leagueid) {
        var id = -1;
        for (var i = 0; i < $rootScope.User.UserLeagues.length; i++) {
            if ($rootScope.User.UserLeagues[i].LeagueID == leagueid) {
                id = $rootScope.User.UserLeagues[i].ID;
            }
        }

        console.log(id);

        LeagueService.LeaveLeague(id).then(function () {
            $state.go("LeagueMenu.Home");
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
        console.log("ID:" + response.data[0].LeagueID);
        $scope.Model.League.ID = response.data[0].LeagueID;
        $scope.Model.League.UserLeagues = response.data;

    });

    $scope.chooseLeagueAvatar = function (id) {
        var options = {
            maximumImagesCount: 1,
            width: 800,
            height: 800,
            quality: 80
        };
        console.log(id);
        $cordovaImagePicker.getPictures(options).then(function (results) {
            var options = {};
            options.mimeType = "multipart/form-data";
            options.httpMethod = "POST";
            options.headers = { Connection: "close" };
            $cordovaFileTransfer.upload("http://myleague-data.azurewebsites.net/api/AvatarUpload?id=" + id, results[0], {}).then(function (results) {
                $state.reload();
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
    };



    $scope.getRecordHeuristic = function (userleague) {
        var gamesPlayed = userleague.Games.length + userleague.Games1.length;
        //games played accounts for 35% of value and legitimacy
        var heuristic = (gamesPlayed / maxGameCount) * .35;
        heuristic += (userleague.Wins / gamesPlayed) * .65;
        return -heuristic;
    }
}]);

module.controller('HomeController', ['$scope', '$rootScope', 'LeagueService', 'AccountService', '$ionicHistory', '$window', '$ionicLoading', '$state', '$ionicSideMenuDelegate', function ($scope, $rootScope, LeagueService, AccountService, $ionicHistory, $window, $ionicLoading, $state, $ionicSideMenuDelegate) {
    $scope.Model = {};

    $ionicSideMenuDelegate.canDragContent(false);

    //clears any chance of going to login if logged in
    $ionicHistory.clearCache();
    if ($rootScope.User == null || $rootScope.User.UserLeagues == null) {
        if ($window.localStorage.getItem("UserId") != null && $window.localStorage.getItem("Token") != null) {
            $ionicLoading.show({ template: 'Validating User...' });
            //user has already logged in, use their security token to get their information

            //use local data if available and update when you can
            if (localStorage.getItem("User") != null) {
                $rootScope.User = localStorage.getItem("User");
                $ionicLoading.hide();
            }

            AccountService.ValidateSecurityToken($window.localStorage.getItem("UserId"), $window.localStorage.getItem("Token")).then(function (response) {
                console.log(response);
                if (response.data != null) {
                    //token is validated, go get the user!
                    AccountService.GetUserForId(response.data.UserID).then(function (data) {
                        $ionicLoading.hide();
                        $ionicLoading.show({ template: 'Grabbing User Info...' });
                        console.log(data);

                        $rootScope.User = data.data;
                        localStorage.setItem("User", $rootScope.User);
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
                    });

                    
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
        AccountService.GetUserForId($rootScope.User.ID).then(function (data) {
            $rootScope.User = [];
            $rootScope.User = data.data;

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
            $scope.$broadcast('scroll.refreshComplete');
        });
    }

    $rootScope.ProfilePictureUrlBase = "https://myleague.blob.core.windows.net/profile-picture/";


    //navigation menu logic
    $rootScope.checkSideMenu = function () {
        if ($state.current.name != 'LeagueMenu.LeagueHome') {
            if ($ionicSideMenuDelegate.isOpen()) {
                $ionicSideMenuDelegate.toggleRight();
            }
        }
    };

    $rootScope.redirectToSettingsMenu = function () {
        $ionicHistory.clearCache();
        if ($ionicSideMenuDelegate.isOpen()) {
            $ionicSideMenuDelegate.toggleRight();
        }
        $state.go('LeagueMenu.Settings');
    }
}]);


module.controller('LeagueHomeController', ['$scope', 'AccountService', '$rootScope', 'LeagueService', '$stateParams', '$ionicSideMenuDelegate', function ($scope, AccountService, $rootScope, LeagueService, $stateParams, $ionicSideMenuDelegate) {


    $scope.Model = {};
    $scope.Model._Name = "LeagueHome";

    //select the league
    for (var i = 0; i < $rootScope.User.Leagues.length; i++) {
        if ($rootScope.User.Leagues[i].ID == $stateParams.id) {
            $scope.Model.League = $rootScope.User.Leagues[i];
            $scope.Model.UserLeagues = [];
            $scope.Model.UserLeagues.push($rootScope.User.UserLeagues[i]);
        }
    }

    LeagueService.GetUserLeaguesForLeague($stateParams.id).then(function (response) {
        $rootScope.$broadcast('league:updated', response);
        $scope.Model.League.UserLeagues = response.data;

        //load the games from  server NOW because it takes load off of initial hit
        LeagueService.GetGamesForLeague($stateParams.id).then(function (games) {
            console.log("Getting Games for League");
            //combine user leagues with games because we don't load them from server
            for (var i = 0; i < games.data.length; i++) {
                //find the userleague with id
                for (var j = 0; j < $scope.Model.League.UserLeagues.length; j++) {
                    if ($scope.Model.League.UserLeagues[j].ID == games.data[i].UserID) {
                        //set game's userleague and add game to userleague
                        games.data[i].UserLeague = $scope.Model.League.UserLeagues[j];
                        $scope.Model.League.UserLeagues[j].Games.push(games.data[i]);
                    }
                }
                //find opponent with id
                for (var j = 0; j < $scope.Model.League.UserLeagues.length; j++) {
                    if ($scope.Model.League.UserLeagues[j].ID == games.data[i].OpponentID) {
                        games.data[i].UserLeague1 = $scope.Model.League.UserLeagues[j];
                        $scope.Model.League.UserLeagues[j].Games1.push(games.data[i]);
                    }
                }
            }

            $scope.Model.Games = games.data;
            console.log($scope.Model.League.UserLeagues);
            //$scope.$broadcast('scroll.refreshComplete');
            //console.log(response);
        });
    });

    $scope.refreshLeague = function () {
        LeagueService.GetUserLeaguesForLeague($stateParams.id).then(function (response) {
            $rootScope.$broadcast('league:updated', response);
            $scope.Model.League.UserLeagues = response.data;
            //load the games from  server NOW because it takes load off of initial hit
            LeagueService.GetGamesForLeague($stateParams.id).then(function (games) {
                console.log("Getting Games for League");
                //combine user leagues with games because we don't load them from server
                for (var i = 0; i < games.data.length; i++) {
                    //find the userleague with id
                    for (var j = 0; j < $scope.Model.League.UserLeagues.length; j++) {
                        if ($scope.Model.League.UserLeagues[j].ID == games.data[i].UserID) {
                            //set game's userleague and add game to userleague
                            games.data[i].UserLeague = $scope.Model.League.UserLeagues[j];
                            $scope.Model.League.UserLeagues[j].Games.push(games.data[i]);
                        }
                    }
                    //find opponent with id
                    for (var j = 0; j < $scope.Model.League.UserLeagues.length; j++) {
                        if ($scope.Model.League.UserLeagues[j].ID == games.data[i].OpponentID) {
                            games.data[i].UserLeague1 = $scope.Model.League.UserLeagues[j];
                            $scope.Model.League.UserLeagues[j].Games1.push(games.data[i]);
                        }
                    }
                }

                $scope.Model.Games = games.data;
                $scope.$broadcast('scroll.refreshComplete');
            });
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

    $scope.GetRank = function (type) {
        //get the userleagues 
        var userleagues = [];
        for (var i = 0; i < $rootScope.User.Leagues.length; i++) {
            if ($rootScope.User.Leagues[i].ID == $scope.Model.UserLeague.LeagueID) {
                userleagues = $rootScope.User.Leagues[i].UserLeagues;
            }
        }

        console.log(userleagues);

        if (type == 'offense') {
            var rank = 1;
            var userGamesPlayed = $scope.Model.UserLeague.Games.length + $scope.Model.UserLeague.Games1.length;
            for (var i = 0; i < userleagues.length; i++) {
                if ((userleagues[i].PointsScored / (userleagues[i].Games.length + userleagues[i].Games1.length)) > ($scope.Model.UserLeague.PointsScored / userGamesPlayed) && userleagues[i].ID != $scope.Model.UserLeague.ID) {
                    rank++;
                }
            }
            return rank;
        } else if (type == 'defense') {
            var rank = 1;
            var userGamesPlayed = $scope.Model.UserLeague.Games.length + $scope.Model.UserLeague.Games1.length;
            for (var i = 0; i < userleagues.length; i++) {
                if ((userleagues[i].PointsAllowed / (userleagues[i].Games.length + userleagues[i].Games1.length)) < ($scope.Model.UserLeague.PointsAllowed / userGamesPlayed) && userleagues[i].ID != $scope.Model.UserLeague.ID) {
                    rank++;
                }
            }
            return rank;
        } else {
            return '';
        }
    }

    console.log($scope.Model);
    
}]);

module.controller('ScheduleController', ['$scope', 'AccountService', '$rootScope', '$stateParams', 'LeagueService', function ($scope, AccountService, $rootScope, $stateParams, LeagueService) {
    $scope.Model = {};
    $scope.Model._name = "Schedule";

    //LeagueService.GetGamesForUserLeague($stateParams.id).then(function (response) {
    //    $scope.Model.Games = response.data;
    //});

    for (var i = 0; i < $rootScope.User.Leagues.length; i++) {
        for (var j = 0; j < $rootScope.User.Leagues[i].UserLeagues.length; j++) {
            if ($rootScope.User.Leagues[i].UserLeagues[j].ID == $stateParams.id) {
                console.log($rootScope.User.Leagues[i].UserLeagues[j]);
                leagueIndex = i;
                $scope.Model.UserLeague = $rootScope.User.Leagues[i].UserLeagues[j];
                $scope.Model.User = $rootScope.User.Leagues[i].UserLeagues[j].User;
                $scope.Model.UserLeague.GamesPlayed = $scope.Model.UserLeague.Games.length + $scope.Model.UserLeague.Games1.length;
                console.log($scope.Model.UserLeague);
            }
        }
    }

    $scope.Model.Games = $scope.Model.UserLeague.Games.concat($scope.Model.UserLeague.Games1);
}]);

module.controller('CreateLeagueController', ['$scope', '$rootScope', 'LeagueService', '$ionicHistory', 'PopupService', function ($scope, $rootScope, LeagueService, $ionicHistory, PopupService) {
    $scope.User = $rootScope.User;
    $scope.CreateLeague = function (name, type) {
        LeagueService.CreateLeague(name, type, $scope.User.ID).then(function (event) {
            $ionicHistory.goBack();
            PopupService.MessageDialog("League Created!");
        });
    };
}]);