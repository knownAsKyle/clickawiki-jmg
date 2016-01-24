(function() {
    angular.module("clickawiki").factory("classFactory", classFactory);
    classFactory.$inject = ["loggerFactory"];

    function classFactory(logger) {
        return {
            addClass: addClass,
            removeClass: removeClass,
            updateClass: updateClass,
            makeNewClass: makeNewClass
        };

        function makeNewClass(className) {
            return {
                name: className
            };
        }

        function addClass(ref, className) {
            ref.push(makeNewClass(className), handleReturn);
        }

        function removeClass(ref, id) {
            ref.child(id).remove(handleReturn);
        }

        function updateClass(ref, id, val) {
            ref.child(id).update(val, handleReturn);
        }

        function handleReturn(err) {
            return err ? loggerFactory.log(err) : true;
        }
    }
})();