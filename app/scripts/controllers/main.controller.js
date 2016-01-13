(function() {
    angular.module("clickawiki").controller("mainController", mainController);
    mainController.$inject = ["$timeout", "constants", "firebaseFactory", "classFactory", "methodFactory", "helperFactory"];

    function mainController($timeout, constants, firebaseFactory, classFactory, methodFactory, helperFactory) {
        var vm = this;
        /*Set db reference*/
        var ref = firebaseFactory.getRef();
        /*Set some defaults*/
        vm.headerTitle = constants.headerTitle;
        vm.returnTypes = constants.types;
        vm.allClasses = [];
        // vm.displayAddNewMethodFlag = false;
        /*Set listener for db changes*/
        ref.on("value", handleDataUpdate);
        /*template exposed functions*/

        //for classes
        vm.addNewClass = addNewClass;
        vm.removeClass = removeClass;
        vm.updateClass = updateClass;
        vm.selectClass = selectClass;
        //for methods associated with classes
        vm.addNewMethod = addNewMethod;
        vm.removeMethod = removeMethod;
        //for attributes associated with methods
        vm.addMethodAttribute = addMethodAttribute;
        vm.removeMethodAttribute = removeMethodAttribute;
        //extra stuff
        vm.checkForEnter = checkForEnter;
        vm.setEditClassName = setEditClassName;
        vm.displayAddNewMethod = displayAddNewMethod;
        vm.resetMethodForm = resetMethodForm;

        /*Action for db update*/
        function handleDataUpdate(snap) {
            $timeout(function() {
                console.log("handleDataUpdate() ", snap.val());
                vm.allClasses = snap.val() || {};
            });
        }

        /*controller class functions*/
        function addNewClass(className) {
            if (className) {
                classFactory.addClass(ref, className);
                vm.newClassName = "";
            }
        }

        function removeClass(id) {
            if (id && helperFactory.confirmDelete()) {
                classFactory.removeClass(ref, id);
            }
        }

        function updateClass(classObj) {
            if (classObj && classObj.val.name.length > 0) {
                classFactory.updateClass(ref, classObj.key, classObj.val);
            }
        }
        //handles when a class is selected
        function selectClass(key, val) {
            vm.selectedClass = {};
            vm.selectedClass.key = key;
            vm.selectedClass.val = val;
            vm.displayAddNewMethodFlag = false;
            vm.setEditClassName(false);
        }

        /*controller method functions*/
        function addNewMethod(method) {
            methodFactory.addMethod(ref, vm.selectedClass.key, method);
            vm.method = {};
            vm.method.returnType = 'Return type';
            vm.displayAddNewMethodFlag = false;
        }

        function removeMethod(key) {
            if (key && helperFactory.confirmDelete()) {
                methodFactory.removeMethod(ref, vm.selectedClass.key, key);
            }
        }

        function addMethodAttribute() {
            vm.method.attributes = vm.method.attributes || [];
            vm.method.attributes.push({});
        }

        function removeMethodAttribute(ev, index, attr) {
            ev.preventDefault();
            if (vm.method.attributes) {
                vm.method.attributes.splice(index, 1);
            }
        }

        /*Extra stuff*/
        //handle enter press
        function checkForEnter(evt, val, callback) {
            return helperFactory.checkForEnterPress(evt) ? callback(val) : false;
        }
        //value to show/hide edit class name feature
        function setEditClassName(bool) {
            return (vm.editClass = bool);
        }

        function displayAddNewMethod() {
            vm.displayAddNewMethodFlag = !vm.displayAddNewMethodFlag;
        }

        function resetMethodForm() {}
    }
})();