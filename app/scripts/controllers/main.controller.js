(function() {
    angular.module("clickawiki").controller("mainController", mainController);
    mainController.$inject = ["$timeout", "constants", "firebaseFactory", "classFactory"];

    function mainController($timeout, constants, firebaseFactory, classFactory) {
        var vm = this;
        vm.navTitle = constants.navTitle;
        vm.returnTypes = constants.types;
        vm.allClasses = [];
        var ref = firebaseFactory.getRef();
        ref.on("value", handleDataUpdate);
        // vm.displayAddNewMethodFlag = false;

        function handleDataUpdate(snap) {
            $timeout(function() {
                console.log("handleDataUpdate() ", snap.val());
                vm.allClasses = snap.val() || {};
            });
        }

        vm.addNewClass = function(className) {
            if (className) {
                ref.push(classFactory.makeNewClass(className));
                vm.newClassName = "";
            }
        };

        vm.removeClass = function(id) {
            if (id && confirmDelete()) {
                classFactory.removeClass(ref, id);
            }
        };

        vm.updateClass = function(classObj) {
            if (classObj && classObj.val.name.length > 0) {
                classFactory.updateClass(ref, classObj.key, classObj.val);
            }
        };

        vm.selectClass = function(key, val) {
            vm.selectedClass = {};
            vm.selectedClass.key = key;
            vm.selectedClass.val = val;
            vm.displayAddNewMethodFlag = false;
            // vm.editClass = false;
        };

        vm.displayAddNewMethod = function() {
            vm.displayAddNewMethodFlag = !vm.displayAddNewMethodFlag;
        };



        vm.addNewMethod = function(method) {
        	console.log(method,vm.selectedClass)
        	ref.child(vm.selectedClass.key).child("methods").push(method,function(err){
        		if(err){
        			console.log(err)
        		}
        	});
        	vm.method = {};
        	vm.displayAddNewMethodFlag = false;
        	// vm.selectedItem.methods = vm.selectedItem.methods || [];
        	// vm.selectedItem.methods.push(makeNewMethod(name, body));
        	// vm.newMethodName = "";
        	// vm.newMethodBody = "";
        };
        // vm.removeMethod = function(item) {
        // 	if (item && confirmDelete()) {
        // 		var index = vm.selectedItem.methods.indexOf(item);
        // 		vm.selectedItem.methods.splice(index, 1);
        // 		firebaseFactory.update(vm.leftSideItems);
        // 	}
        // };

        // vm.checkForEnter2 = function(evt) {
        // 	return (evt && evt.keyCode === 13 && vm.selectedItem.name) ? true : false;
        // };

        // vm.checkForEnter = function(evt) {
        // 	if (evt && evt.keyCode === 13) {
        // 		vm.addNewLeftSideItem(vm.leftSideItem);
        // 	}
        // };

        // vm.isEmpty = isEmpty;

        // function isEmpty(obj) {
        // 	for (var prop in obj) {
        // 		if (obj.hasOwnProperty(prop))
        // 			return false;
        // 	}
        // 	return true;
        // }

        // function makeNewLeftSideItem(name) {
        // 	return {
        // 		name: name
        // 	};
        // }

        // function makeNewMethod(name, body) {
        // 	return {
        // 		name: name,
        // 		body: body
        // 	};
        // }

        function confirmDelete() {
            return confirm("Are you sure you want to delete this?");
        }
    }
})();