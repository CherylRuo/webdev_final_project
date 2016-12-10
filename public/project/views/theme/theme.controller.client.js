/**
 * Created by CherylRuo on 10/7/16.
 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("ThemeListController", ThemeListController)
        .controller("NewThemeController", NewThemeController)
        .controller("EditThemeController", EditThemeController);

    function ThemeListController($routeParams, ThemeService, $location, UserService) {
        var vm = this;
        var userId = parseInt($routeParams.uid);
        var promise = ThemeService.findFollowedUsersByUserId(userId);
        promise.then(
            function(response){
                vm.followedUsers = response.data;
            },
            function (httpError) {
                vm.error = "Cannot find followed users for this user."
            });
        var promise1 = ThemeService.findAllThemesForUser(userId);
        promise1.then(
            function(response){
                vm.themes = response.data;
            },
            function (httpError) {
                vm.error = "Cannot find theme for this user."
            });

        vm.keywords = ["Themes", "Users"];

        vm.searchQuery = searchQuery;
        function searchQuery(query) {
            if (vm.selectedName == "Themes") {
                var promise = ThemeService.searchThemes(query);
                promise.then(
                    function (response) {
                        vm.themeSearchResult = response.data;
                    },
                    function (httpError) {
                        vm.error = "Cannot find themes."
                    });
            } else {
                var promise = ThemeService.searchUsers(query);
                promise.then(
                    function (response) {
                        vm.userSearchResult = response.data;
                        for(var i=vm.userSearchResult.length-1; i>=0; i--) {
                            if(vm.userSearchResult[i]._id == userId) {
                                vm.userSearchResult.splice(i, 1);
                            }
                        }
                    },
                    function (httpError) {
                        vm.error = "Cannot find users."
                    });
            }
        }

        vm.followUser = followUser;
        function followUser(followUserId) {
            var promise = UserService.findUserById(userId);
            promise.then(
                function (response) {
                    var currentUser = response.data;
                    currentUser.user_followed.push(followUserId);
                    var promise1 = UserService.updateUser(userId, currentUser);
                    promise1.then(
                        function(response) {
                            $location.url("/user/"+ userId +"/theme");
                        },
                        function (httpError) {
                            vm.error = "Error!";
                        });
                },
                function (httpError) {
                    vm.error = "Error!";
                });
        }

        vm.followTheme = followTheme;
        function followTheme(followThemeId) {
            var promise = UserService.findUserById(userId);
            promise.then(
                function (response) {
                    var currentUser = response.data;
                    currentUser.themes_followed.push(followThemeId);
                    var promise1 = UserService.updateUser(userId, currentUser);
                    promise1.then(
                        function(response) {
                            $location.url("/user/"+ userId +"/theme");
                        },
                        function (httpError) {
                            vm.error = "Error!";
                        });
                },
                function (httpError) {
                    vm.error = "Error!";
                });
        }
        vm.userId = userId;
    }

    function NewThemeController($location, $routeParams, ThemeService) {
        var vm = this;
        var userId = parseInt($routeParams.uid);
        var promise = ThemeService.findAllThemesForUser(userId);
        promise.then(
            function(response) {
                vm.themes = response.data;
            },
            function (httpError) {
                vm.error = "Cannot find theme for this user."
            });
        vm.createTheme = createTheme;
        function createTheme(theme) {
            if(theme == null) {
                vm.alert = "Please create a theme.";
                return;
            }
            var promise = ThemeService.createTheme(vm.userId, theme);
            promise.then(
                function(response){
                    vm.theme = response.data;
                    $location.url("/user/"+ userId +"/theme");
                },
                function (httpError) {
                    vm.error = "Cannot create theme."
                });
        }
        vm.userId = userId;
    }

    function EditThemeController($location, $routeParams, ThemeService) {
        var vm = this;
        var userId = parseInt($routeParams.uid);
        var themeId = parseInt($routeParams.tid);

        var promise = ThemeService.findThemeById(themeId);
        promise.then(
            function(response){
                vm.theme = response.data;
            },
            function (httpError) {
                vm.error = "Cannot find theme."
            });
        var promise1 = ThemeService.findAllThemesForUser(userId);
        promise1.then(
            function(response){
                vm.themes = response.data;
            },
            function (httpError) {
                vm.error = "Cannot find theme for this user."
            });
        vm.updateTheme = updateTheme;
        vm.deleteTheme = deleteTheme;
        function updateTheme(updateTheme) {
            var promise = ThemeService.updateTheme(themeId, updateTheme);
            promise.then(
                function(response){
                    $location.url("/user/" + userId + "/theme");
                },
                function (httpError) {
                    vm.error = "Cannot update theme."
                });
        }
        function deleteTheme() {
            var promise = ThemeService.deleteTheme(themeId);
            promise.then(
                function(response){
                    $location.url("/user/" + userId + "/theme");
                },
                function (httpError) {
                    vm.error = "Cannot delete theme."
                });
        }
        vm.userId = userId;
        vm.themeId = themeId;
    }
})();