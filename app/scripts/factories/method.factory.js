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

        function updateMethod(ref, key, methodKey, val) {
            console.log(ref, key, val)
            ref.child(key).child("methods").child(methodKey).set(val, handleReturn);
        }

        function handleReturn(err) {
            return err ? console.log(err) : true;
        }
    }
})();