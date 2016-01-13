(function() {
    angular.module("clickawiki").factory("methodFactory", methodFactory);
    methodFactory.$inject = [];

    function methodFactory() {
        return {
            addMethod: addMethod,
            removeMethod: removeMethod,
            updateMethod: updateMethod
        };

        function addMethod(ref, key, val) {
            ref.child(key).child("methods").push(val, handleReturn);
        }

        function removeMethod(ref, classKey, key) {
            ref.child(classKey).child("methods").child(key).remove(handleReturn);
        }

        function updateMethod() {}

        function handleReturn(err) {
            return err ? console.log(err) : true;
        }
    }
})();