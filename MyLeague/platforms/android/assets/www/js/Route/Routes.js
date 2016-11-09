var routes = angular.module('Routes', ['ui.router']);

routes.config(function ($stateProvider, $urlRouterProvider) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    .state('Login', {
        url: '/Login',
        templateUrl: 'View/Login.html',
        controller: 'LoginController',
        cache:false
    })

    .state('Create', {
        url: '/Create',
        templateUrl: 'View/Create.html',
        controller: 'CreateController'
    })

    .state('LeagueMenu.Settings', {
        url: '/Settings',
        cache: false,
        views: {
            'MenuContent': {
                templateUrl: 'View/Settings.html',
                controller: 'SettingsController'
            }
        }
    })

    //.state('Menu', {
    //    url: '/Menu',
    //    abstract: true,
    //    templateUrl: 'View/Menu.html',
    //    controller: 'MenuController'
    //})

    .state('LeagueMenu', {
        url: '/LeagueMenu/id/:id',
        abstract: true,
        templateUrl: 'View/LeagueMenu.html',
        controller: 'LeagueMenuController'
    })

    .state('LeagueMenu.Home', {
        url: '/Home',
        views: {
            'MenuContent': {
                templateUrl: 'View/Home.html',
                controller: 'HomeController'
            }
        }
    })


        //.state('Menu.Requests', {
        //    url: '/Requests',
        //    views: {
        //        'MenuContent': {
        //            templateUrl: 'View/Requests.html',
        //            controller: 'LeagueRequestsController'
        //        }
        //    }
        //})

    .state('LeagueMenu.Profile', {
        url: '/Profile/id/:id',
        views:{
            'MenuContent':{
                templateUrl: 'View/Profile.html',
                controller: 'ProfileController'
            }
        }
    })

    .state('LeagueMenu.Schedule', {
        url: '/Schedule/id/:id',
        views:{
            'MenuContent':{
                templateUrl: 'View/Schedule.html',
                controller: 'ScheduleController'
            }
        }
    })

    .state('LeagueMenu.CreateLeague', {
        url: '/CreateLeague',
        views:{
            'MenuContent':{
                templateUrl: 'View/CreateLeague.html',
                controller: 'CreateLeagueController'
            }
        }
    })

    .state('LeagueMenu.LeagueHome', {
        cache:false,
        url: '/LeagueHome/id/:id',
        views:{
            'MenuContent': {
                templateUrl: 'View/LeagueHome.html',
                controller: 'LeagueHomeController'
            }
        }
        
    })

    .state('LeagueMenu.CreateGame', {
        url: '/CreateGame/id/:id',
        views:{
            'MenuContent':{
                templateUrl: 'View/CreateGame.html',
                controller: 'CreateGameController'
            }
        }
    })


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/LeagueMenu/id/0/Home');
});