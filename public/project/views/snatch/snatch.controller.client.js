/**
 * Created by CherylRuo on 10/7/16.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("SnatchListController", SnatchListController)
        .controller("EditSnatchController", EditSnatchController);
    function SnatchListController($routeParams, SnatchService, UserService, $location, $rootScope) {
        var vm = this;
        vm.logout = logout;
        vm.createSnatch = createSnatch;
        vm.addCommentToSnatch = addCommentToSnatch;
        var themeId = parseInt($routeParams.tid);
        var userId = parseInt($routeParams.uid);
        var promise = SnatchService.findAllSnatchsForTheme(themeId);
        promise.then(
            function (response) {
                vm.snatches = response.data;
            },
            function (httpError) {
                vm.error = "Cannot find snatch for this theme."
            });

        function createSnatch(snatch) {
            var promise = SnatchService.createSnatch(vm.themeId, snatch);
            promise.then(
                function (response) {
                    $location.url("/user/" + userId + "/theme/" + themeId + "/snatch/" + response.data._id);
                },
                function (httpError) {
                    vm.error = "Cannot create snatch."
                });
        }

        function addCommentToSnatch(snatch) {
            var promise = UserService.findUserById(userId);
            promise.then(
                function (response) {
                    var username = response.data.username;
                    if(snatch.comment == undefined) {
                        snatch.comment = username + ": " + vm.textModel;
                    } else {
                        snatch.comment += "\n" + username + ": " + vm.textModel;
                    }
                    var promise = SnatchService.updateSnatch(snatch._id, snatch);
                    promise.then(
                        function (response) {
                            $location.url("/user/" + userId + "/theme/" + themeId + "/snatch");
                        },
                        function (httpError) {
                            vm.error = "Cannot update snatch."
                        });
                }
            )
        }
        function logout() {
            UserService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/");
                    });
        }


        vm.userId = userId;
        vm.themeId = themeId;
    }

    function EditSnatchController($location, $routeParams, SnatchService, ThemeService) {
        var vm = this;
        vm.updateSnatch = updateSnatch;
        vm.deleteSnatch = deleteSnatch;
        var snatchId = parseInt($routeParams.sid);
        var userId = parseInt($routeParams.uid);
        var themeId = parseInt($routeParams.tid);

        var promise = SnatchService.findSnatchById(snatchId);
        var themeName = "";
        promise.then(
            function (response) {
                vm.snatch = response.data;
                var themeIds = vm.snatch._theme;
                for(var i=0; i<themeIds.length; i++) {
                    var promise1 = ThemeService.findThemeById(themeIds[i]);
                    promise1.then(
                        function (response1) {
                            themeName += "#" + response1.data.name + " ";
                            vm.themeName = themeName;
                        },
                        function (httpError) {
                            vm.error = "Cannot find snatch."
                        });
                }
            },
            function (httpError) {
                vm.error = "Cannot find snatch."
            });

        function updateSnatch(updateSnatch) {
            var promise = SnatchService.updateSnatch(snatchId, updateSnatch);
            promise.then(
                function (response) {
                    $location.url("/user/" + userId + "/theme/" + themeId + "/snatch");
                },
                function (httpError) {
                    vm.error = "Cannot update snatch."
                });
        }

        function deleteSnatch() {
            var promise = SnatchService.deleteSnatch(snatchId);
            promise.then(
                function (response) {
                    $location.url("/user/" + userId + "/theme/" + themeId + "/snatch");
                },
                function (httpError) {
                    vm.error = "Cannot delete snatch."
                });
        }
        vm.snatchId = snatchId;
        vm.themeId = themeId;
        vm.userId = userId;
    }
})();