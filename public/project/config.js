/**
 * Created by CherylRuo on 11/26/16.
 */
/**
 * Created by CherylRuo on 10/7/16.
 */
(function()
{
    angular
        .module("WebAppMaker")
        .config(Config);
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/api/loggedin').success(function(user) {
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $rootScope.currentUser = user;
                deferred.resolve();
            } else {
                deferred.reject();
                $location.url('/');
            }
        });
        return deferred.promise;
    };
    var checkIsAdmin = function($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/api/isAdmin').success(function(user) {
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $rootScope.currentUser = user;
                deferred.resolve();
            } else {
                $rootScope.currentUser = null;
                deferred.reject();
                $location.url('/');
            }
        });
        return deferred.promise;
    };
    function Config($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/login", {
                templateUrl: "views/user/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/register", {
                templateUrl: "views/user/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/user", {
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when("/user/:uid", {
                templateUrl: "views/user/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedin }
            })
            .when("/user/:uid/theme", {
                templateUrl: "views/theme/theme-list.view.client.html",
                controller: "ThemeListController",
                controllerAs: "model"
            })
            .when("/user/:uid/theme/new", {
                templateUrl: "views/theme/theme-new.view.client.html",
                controller: "NewThemeController",
                controllerAs: "model"
            })
            .when("/user/:uid/theme/:tid", {
                templateUrl: "views/theme/theme-edit.view.client.html",
                controller: "EditThemeController",
                controllerAs: "model"
            })
            .when("/user/:uid/theme/:tid/snatch", {
                templateUrl: "views/snatch/snatch-list.view.client.html",
                controller: "SnatchListController",
                controllerAs: "model"
            })
            .when("/user/:uid/theme/:tid/snatch/:sid", {
                templateUrl: "views/snatch/snatch-edit.view.client.html",
                controller: "EditSnatchController",
                controllerAs: "model"
            })
            .when("/admin", {
                    templateUrl: "views/admin/admin.view.client.html",
                    controller: "AdminController",
                    controllerAs: "model",
                    resolve: {isAdmin: checkIsAdmin}
                })
            .otherwise({redirectTo: "/"});
    }
})();