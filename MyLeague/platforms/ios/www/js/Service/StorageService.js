var module = angular.module('StorageModule', []);

module.service('StorageService', ['$cordovaSQLite', function ($http, $cordovaSQLite) {
    var service = {};
    var db = $cordovaSQLite.openDB({ name: "my.db" });

    var query = "INSERT INTO test_table (data, data_num) VALUES (?,?)";
    $cordovaSQLite.execute(db, query, ["test", 100]).then(function (res) {
        console.log("insertId: " + res.insertId);
    }, function (err) {
        console.error(err);
    });

    return service;
}]);