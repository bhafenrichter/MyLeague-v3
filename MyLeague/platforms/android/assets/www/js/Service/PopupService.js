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

    factory.InitializeModal = function ($ionicModal, $scope, templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope,
            animation: 'slide-in-up',
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function () {
            $scope.modal.show();
        };

        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            // Execute action
        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });
    };

    return factory;
}]);