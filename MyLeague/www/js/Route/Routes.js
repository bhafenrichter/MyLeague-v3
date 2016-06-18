var routes = angular.module('Routes', []);

routes.config(function ($stateProvider, $urlRouterProvider) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    .state('Login', {
        url: '/Login',
        templateUrl: 'View/Login.html',
        controller: 'LoginController'
    })

    .state('Create', {
        url: '/Create',
        templateUrl: 'View/Create.html',
        controller: 'CreateController'
    })

    .state('Menu', {
        url: '/Menu',
        abstract: true,
        templateUrl: 'View/Menu.html',
        controller: 'MenuController'
    })

    .state('Menu.Home', {
        url: '/Home',
        views: {
            'MenuContent': {
                templateUrl: 'View/Home.html',
                controller: 'HomeController'
            }
        }
    })

    .state('Menu.Profile', {
        url: '/Profile',
        views: {
            'MenuContent': {
                templateUrl: 'View/Profile.html',
                controller: 'ProfileController'
            }
        }
    })

    .state('CreateLeague', {
        url: '/CreateLeague',
        templateUrl: 'View/CreateLeague.html',
        controller: 'CreateLeagueController'
    })



    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/Login');
});