/**
 * Created by CherylRuo on 10/28/16.
 */
(function() {
    angular
        .module("wamDirectives", [])
        .directive("wamSortable", wamSortable);
    function wamSortable() {
        function linker(scope, element) {
            var start = -1;
            var end = -1;
            element
                .sortable({
                    start: function (event, ui) {
                        start = $(ui.item).index();
                    },
                    stop: function (event, ui) {
                        end = $(ui.item).index();
                        scope.sortableController.sort(start, end);
                    }
                });
        }

        return {
            scope: {},
            link: linker,
            controller: sortableController,
            controllerAs: 'sortableController'
        }
    }

    function sortableController(WidgetService, $routeParams) {
        var vm = this;
        vm.sort = sort;
        var pageId = parseInt($routeParams.pid);

        function sort(start, end) {
            var promise = WidgetService.sort(start, end, pageId);
            promise.then();
        }
    }
})();
