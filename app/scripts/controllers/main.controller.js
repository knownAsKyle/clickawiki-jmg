(function() {
    angular.module("clickawiki").controller("mainController", mainController);
    mainController.$inject = ["loggerFactory","$timeout", "storageFactory", "constants", "firebaseFactory", "classFactory", "methodFactory", "helperFactory", "authFactory"];

    function mainController(loggerFactory,$timeout, storageFactory, constants, firebaseFactory, classFactory, methodFactory, helperFactory, authFactory) {
        var vm = this;
        /*Set db reference*/
        var ref = firebaseFactory.getRef();
        /*Set some defaults*/
        vm.headerTitle = constants.headerTitle;
        vm.returnTypes = constants.types;
        vm.formTitleText = "New";
        vm.editModeActive = false;
        vm.isLoggedIn = false;
        vm.sortMessage = constants.sortMessage.default;
        vm.allClasses = [];
        var logger = loggerFactory;
        /*Set listener for db changes*/
        ref.on("value", handleDataUpdate);
        ref.onAuth(function(auth) {
            $timeout(function() {
                vm.isLoggedIn = auth ? true : false;
                if (auth) {
                    storageFactory.set("cw_token", auth.token);
                }

            });
        });
        if (storageFactory.get("cw_token")) {
            var token = storageFactory.get("cw_token");
            authFactory.login(ref, null, null, token);
        }
        /*template exposed functions*/
        //for classes
        vm.addNewClass = addNewClass;
        vm.removeClass = removeClass;
        vm.updateClass = updateClass;
        vm.handleClassInfo = handleClassInfo;
        vm.selectClass = selectClass;
        //search
        vm.search = search;
        //for methods associated with classes
        vm.addNewMethod = addNewMethod;
        vm.removeMethod = removeMethod;
        vm.updateMethod = updateMethod;
        //for attributes associated with methods
        vm.addMethodAttribute = addMethodAttribute;
        vm.removeMethodAttribute = removeMethodAttribute;
        //authentication methods
        vm.loginPrompt = loginPrompt;
        vm.logOut = logOut;
        //extra stuff
        vm.sortMethodList = sortMethodList;
        vm.checkForEnter = checkForEnter;
        vm.setEditClassName = setEditClassName;
        vm.displayAddNewMethod = displayAddNewMethod;
        vm.cancelMethodForm = cancelMethodForm;
        vm.resetMethodForm = resetMethodForm;


        function handleClassInfo(loggedIn) {
            console.log(loggedIn)
            if (loggedIn) {
                //show edit Class Info thing
            } else {
                //show uneditable class thing
            }
        }



        /*Handles logging in/out*/
        function logOut(ev) {
            ev.preventDefault();
            return authFactory.logout(ref);
        }

        function loginPrompt(ev) {
            ev.preventDefault();
            swal(constants.loginPromptSettings, authFactory.loginPrompt);
        }
        /*Action for db update*/
        function handleDataUpdate(snap) {
            $timeout(function() {
                vm.allClasses = snap.val() || {};
                if (vm.sortMessage && vm.sortMessage !== constants.sortMessage.default) {
                    sortMethodList(vm.sortMessage);
                }
                logger.info(vm.selectedClass)
                if (vm.selectedClass) {
                    console.log("reseting selectedClass? ",vm.allClasses[vm.selectedClass.key].info)
                    vm.selectedClass.info = vm.allClasses[vm.selectedClass.key].info;
                }
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
            helperFactory.confirmDelete("", false, response);

            function response(confirm) {
                if (confirm && id) {
                    classFactory.removeClass(ref, id);
                    vm.selectedClass = null;
                }
            }
        }

        function updateClass(classObj) {

            if (classObj && classObj.val.name.length > 0) {
                console.log("updateClass ", classObj)
                classFactory.updateClass(ref, classObj.key, {
                    info: classObj.info
                });
            }
        }
        //search
        function search(searchTerm) {
            // TODO: All the hard stuff...
            console.log("Searching for '" + searchTerm + "'");
        }
        //handles when a class is selected


        function selectClass(key, val) {
            vm.formTitleText = "New";
            vm.selectedClass = {};
            vm.selectedClass.key = key;
            vm.selectedClass.val = val;
            vm.selectedClass.info = val.info;
            vm.setEditClassName(false);
            vm.editModeActive = false;
            console.log(vm.selectedClass)
            resetMethodForm();
            angular.element(document).find(".panel-collapse").removeClass("in");
        }
        /*controller method functions*/
        function addNewMethod(method) {
            if (vm.editModeActive) {
                vm.editModeActive = false;
                methodFactory.updateMethod(ref, vm.selectedClass.key, vm.editMethodKey, method);
            } else {
                methodFactory.addMethod(ref, vm.selectedClass.key, method);
                vm.method = {};
                vm.method.returnType = 'Return type';
            }
            vm.displayMethodForm = false;
        }

        function removeMethod(key) {
            if (key) {
                helperFactory.confirmDelete("", "", response);
            }

            function response(confirm) {
                if (confirm) {
                    methodFactory.removeMethod(ref, vm.selectedClass.key, key);
                }
            }
        }

        function updateMethod(key, method) {
            vm.displayMethodForm = true;
            vm.formTitleText = "Edit";
            vm.method = method;
            vm.editModeActive = true;
            vm.editMethodKey = key;
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
            vm.editModeActive = false;
            vm.formTitleText = "New";
            resetMethodForm();
            vm.displayMethodForm = !vm.displayMethodForm;
        }

        function cancelMethodForm() {
            vm.displayMethodForm = false;
            vm.formTitleText = "New";
            resetMethodForm();
        }

        function resetMethodForm() {
            vm.method = {};
            vm.method.returnType = 'Return type';
            vm.method.attributes = [];
            vm.displayMethodForm = false;
        }
        //for sorting method list - ascending/descending or natural
        function sortMethodList(type) {
            var methods = vm.allClasses[vm.selectedClass.key].methods;
            switch (type) {
                case constants.sortMessage.default:
                    vm.sortMessage = constants.sortMessage.default;
                    ref.once("value", handleDataUpdate);
                    break;
                case constants.sortMessage.a:
                    vm.sortMessage = constants.sortMessage.a;
                    vm.allClasses[vm.selectedClass.key].methods = helperFactory.sortList(methods, constants.sortMessage.a);
                    break;
                case constants.sortMessage.d:
                    vm.sortMessage = constants.sortMessage.d;
                    vm.allClasses[vm.selectedClass.key].methods = helperFactory.sortList(methods, constants.sortMessage.d);
                    break;
                default:
                    break;
            }
        }
    }
})();