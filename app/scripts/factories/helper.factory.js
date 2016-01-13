(function() {
    angular.module("clickawiki").factory("helperFactory", helperFactory);
    helperFactory.$inject = [];

    function helperFactory() {
        return {
            checkForEnterPress: checkForEnterPress,
            confirmDelete: confirmDelete
        };

        function checkForEnterPress(evt) {
            return evt && evt.keyCode === 13 ? true : false;
        }

        function confirmDelete() {
            return confirm("Are you sure you want to delete this?");
        }
    }
})();