//define the module so that app.js can recognize it
var module = angular.module('PhotoModule', []);

module.service('PhotoService', ['$ionicPopup', '$cordovaCamera', '$cordovaFileTransfer', function ($ionicPopup, $cordovaCamera, $cordovaFileTransfer) {
    var factory = {};
    // open PhotoLibrary
    factory.openPhotoLibrary = function (id) {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {

            //console.log(imageData);
            //console.log(options);   
            var image = document.getElementById('tempImage');
            image.src = imageData;

            var server = "http://yourdomain.com/upload.php",
                filePath = imageData;

            var date = new Date();

            var options = {
                fileKey: "file",
                fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
                chunkedMode: false,
                mimeType: "image/jpg"
            };

            $cordovaFileTransfer.upload(server, filePath, options).then(function (result) {
                console.log("SUCCESS: " + JSON.stringify(result.response));
                console.log('Result_' + result.response[0] + '_ending');
                alert("success");
                alert(JSON.stringify(result.response));

            }, function (err) {
                console.log("ERROR: " + JSON.stringify(err));
                //alert(JSON.stringify(err));
            }, function (progress) {
                // constant progress updates
            });


        }, function (err) {
            // error
            console.log(err);
        });
    }

}]);
