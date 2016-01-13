(function() {
    angular.module("clickawiki").factory("classFactory", classFactory);
    classFactory.$inject = [];

    function classFactory() {
        return {
            makeNewClass: makeNewClass,
            removeClass: removeClass,
            updateClass: updateClass
        };

        function makeNewClass(className) {
            return {
                name: className
            };
        }

        function removeClass(ref, id) {
            ref.child(id).remove(function(err) {
                return err ? console.log(err) : true;
            });
        }

        function updateClass(ref, id, val) {
        	ref.child(id).update(val,function(err){
        		return err ? console.log(err) : true;
        	});
        }
    }
})();