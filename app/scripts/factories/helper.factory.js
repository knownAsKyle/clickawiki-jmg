(function() {
    angular.module("clickawiki").factory("helperFactory", helperFactory);
    helperFactory.$inject = ["constants"];

    function helperFactory(constants) {
        return {
            checkForEnterPress: checkForEnterPress,
            confirmDelete: confirmDelete,
            sortList: sortList
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

        function sortList(methods, sortType) {
            var newOrder = [],
                tempMethods = {};
            angular.forEach(methods, function(v, k) {
                var obj = v;
                v.key = k;
                this.push(obj);
            }, newOrder);
            newOrder.sort(function(a, b) {
                var nameA = a.name.toLowerCase(),
                    nameB = b.name.toLowerCase();
                if (sortType === "ascending") {
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB)
                        return 1;
                    return 0;
                } else if (sortType === "descending") {
                    if (nameA > nameB)
                        return -1;
                    if (nameA < nameB)
                        return 1;
                    return 0;
                } else {
                    return 0;
                }

            });

            angular.forEach(newOrder, function(v, k) {
                tempMethods[k] = v;
            });
            return tempMethods;
        }
    }
})();