(function() {
    angular.module("clickawiki").factory("helperFactory", helperFactory);
    helperFactory.$inject = ["constants"];

    function helperFactory(constants) {
        return {
            checkForEnterPress: checkForEnterPress,
            confirmDelete: confirmDelete
        };

        function checkForEnterPress(evt) {
            return evt && evt.keyCode === 13 ? true : false;
        }

        function confirmDelete(msg, partial) {
            msg = msg || constants.confirmDeleteDefault;
            msg = partial ? constants.confirmDeleteDefault + msg : msg;
            return confirm(msg);
        }
    }
})();