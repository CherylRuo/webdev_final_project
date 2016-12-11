/**
 * Created by CherylRuo on 12/11/16.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("GuestController", GuestController);

    function GuestController(ThemeService) {
        var vm = this;
        vm.searchQuery = searchQuery;
        var promise = ThemeService.findAllThemes();
        promise.then(
            function (response) {
                vm.themelist = response.data;
            },
            function (httpError) {
                vm.error = "Cannot find themes."
            });

        function searchQuery(query) {
            var promise = ThemeService.searchThemes(query);
            promise.then(
                function (response) {
                    vm.themelist = response.data;
                },
                function (httpError) {
                    vm.error = "Cannot find themes."
                });
        }
    }
})();