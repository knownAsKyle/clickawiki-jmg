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

        function confirmDelete(msg, partial, callback) {
            var popup = constants.popUpDeleteSettings;
            msg = partial ? constants.defaultDeleteMessage + "(" + msg + ")" : msg;
            msg = msg || constants.defaultDeleteMessage;
            popup.text = msg;
            swal(popup, function(isConfirm) {
                if (isConfirm) {
                    swal("Deleted!", "", "success");
                    callback(true);
                } else {
                    swal("Cancelled", "you've stopped it!", "error");
                    callback();
                }
            });
        }
    }
})();