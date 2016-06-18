var module = angular.module('PopupModule', []);

module.service('PopupService', ['$ionicPopup', function ($ionicPopup) {
    var factory = {};

    factory.ConfirmDialog = function (title, contents, actionName) {
        var data = {};

        return $ionicPopup.prompt({
            title: title,
            inputType: 'input',
            inputPlaceholder: contents
        });
    }

    factory.MessageDialog = function (message) {
        var alertPopup = $ionicPopup.alert({
            title: 'Message',
            template: message
        });
    };

    return factory;
}]);