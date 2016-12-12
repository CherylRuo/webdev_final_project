/**
 * Created by CherylRuo on 10/7/16.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("SnatchListController", SnatchListController)
        .controller("EditSnatchController", EditSnatchController)
        .controller("SnatchSearchController", SnatchSearchController);
    function SnatchListController($routeParams, SnatchService, UserService, $location, $rootScope) {
        var vm = this;
        vm.logout = logout;
        vm.createSnatch = createSnatch;
        vm.addCommentToSnatch = addCommentToSnatch;
        vm.user = $rootScope.currentUser;
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
            if (snatch == undefined) {
                snatch = {};
            }
            snatch._user = vm.user._id;
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
                    if (snatch.comment == undefined) {
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

    function EditSnatchController($location, $routeParams, SnatchService, ThemeService, $rootScope, UserService) {
        var vm = this;
        vm.updateSnatch = updateSnatch;
        vm.deleteSnatch = deleteSnatch;
        var user = $rootScope.currentUser;
        if (user == undefined) {
            UserService
                .findUserById($routeParams.uid)
                .then(
                    function (response) {
                        var user = response.data;
                        $rootScope.currentUser = user;
                    },
                    function (error) {
                        vm.error = error;
                    });
        }
        var snatchId = parseInt($routeParams.sid);
        var userId = parseInt($routeParams.uid);
        var themeId = parseInt($routeParams.tid);
        var promise = SnatchService.findSnatchById(snatchId);
        vm.themeTags = "";
        promise.then(
            function (response) {
                vm.snatch = response.data;
                var themeIds = vm.snatch._theme;
                for (var i = 0; i < themeIds.length; i++) {
                    var promise1 = ThemeService.findThemeById(themeIds[i]);
                    promise1.then(
                        function (response1) {
                            vm.themeTags += "#" + response1.data.name;
                        },
                        function (httpError) {
                            vm.error = "Cannot find snatch."
                        });
                }
            },
            function (httpError) {
                vm.error = "Cannot find snatch."
            });

        function updateSnatch(updateSnatch, name) {
            if (name == undefined) {
                var promise1 = SnatchService.updateSnatch(snatchId, updateSnatch);
                promise1.then(
                    function (response1) {

                        $location.url("/user/" + userId + "/theme/" + themeId + "/snatch");
                    },
                    function (httpError) {
                        vm.error = "Cannot update snatch."
                    });
            } else {
                var themeTag = {};
                themeTag.name = name;
                var promise2 = ThemeService.getCreateIdByName(snatchId, themeTag);
                promise2.then(
                    function (response) {
                        var id = response.data;
                        updateSnatch._theme.push(id);
                        var promise3 = SnatchService.updateSnatch(snatchId, updateSnatch);
                        promise3.then(
                            function (response1) {

                                $location.url("/user/" + userId + "/theme/" + themeId + "/snatch");
                            },
                            function (httpError) {
                                vm.error = "Cannot update snatch."
                            });
                    },
                    function (httpError) {
                        vm.error = "Cannot update snatch."
                    });
            }
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

    function SnatchSearchController(WalmartService, $routeParams, $rootScope) {
        var vm = this;
        vm.searchQuery = searchQuery;
        var themeId = parseInt($routeParams.tid);
        var userId = parseInt($routeParams.uid);
        vm.user = $rootScope.currentUser;
        function searchQuery(query) {
            var result = WalmartService.searchWalmart(query);
            vm.products = result.items;
            console.log(result);
        }

        vm.userId = userId;
        vm.themeId = themeId;
    }
})();