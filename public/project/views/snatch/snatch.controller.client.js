/**
 * Created by CherylRuo on 10/7/16.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("SnatchListController", SnatchListController)
        .controller("EditSnatchController", EditSnatchController);
    function SnatchListController($routeParams, SnatchService) {
        var vm = this;
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
        vm.createSnatch = createSnatch;
        function createSnatch(snatch) {
            if (snatch == null) {
                vm.alert = "Please create a new snatch.";
                return;
            }
            var promise = SnatchService.createSnatch(vm.themeId, snatch);
            promise.then(
                function (response) {
                    $location.url("/user/" + userId + "/theme/" + themeId + "/snatch" + snatchId);
                },
                function (httpError) {
                    vm.error = "Cannot create snatch."
                });
        }
        vm.userId = userId;
        vm.themeId = themeId;
    }



    function EditSnatchController($location, $routeParams, SnatchService) {
        var vm = this;
        var snatchId = parseInt($routeParams.sid);
        var userId = parseInt($routeParams.uid);
        var themeId = parseInt($routeParams.tid);
        var promise = SnatchService.findAllSnatchsForTheme(themeId);
        promise.then(
            function (response) {
                vm.snatches = response.data;
            },
            function (httpError) {
                vm.error = "Cannot find snatch for this theme."
            });
        var promise1 = SnatchService.findSnatchById(snatchId);
        promise1.then(
            function (response) {
                vm.snatch = response.data;
            },
            function (httpError) {
                vm.error = "Cannot find snatch."
            });
        vm.updateSnatch = updateSnatch;
        vm.deleteSnatch = deleteSnatch;
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