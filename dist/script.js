(function() {
    angular.module("clickawiki", []);
})();
(function() {
    angular.module("clickawiki").constant("constants", {
        firebaseURL: "https://quicktest1.firebaseio.com/wiki",
        headerTitle: "Clickawiki",
        defaultDeleteMessage: "Are you sure you want to delete this? ",
        types: ["ArrayList", "Boolean", "Integer", "Double", "Number", "Object", "String"],
        auth: {
            email: "admin@admin.com"
        }
    });
})();
(function() {
    angular.module("clickawiki").factory("authFactory", authFactory);
    authFactory.$inject = [];

    function authFactory() {
        return {
            getAuth: getAuth,
            logout: logout,
            login: login
        };

        function getAuth() {}

        function logout(ref) {
            return ref.unauth();
        }

        function login(ref, u, p, token) {
            if (!token) {
                u = u || constants.auth.email;
                var auth = {};
                auth.email = u;
                auth.password = p;
                ref.authWithPassword(auth, loginResponse);
            } else {
                ref.authWithCustomToken(token, loginResponse);
            }

        }

        function loginResponse(err, authData) {
            if (err) {
                console.log(err);
            } else {
                //set localstorage with session id to use auto login from then on.
            }
        }
    }
})();
(function() {
    angular.module("clickawiki").factory("classFactory", classFactory);
    classFactory.$inject = [];

    function classFactory() {
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
            console.dir(val);
            ref.child(id).update(val, handleReturn);
        }

        function handleReturn(err) {
            return err ? console.log(err) : true;
        }
    }
})();
(function() {
    angular.module("clickawiki").factory("firebaseFactory", firebaseFactory);
    firebaseFactory.$inject = ["constants"];

    function firebaseFactory(constants) {
        var ref = new Firebase(constants.firebaseURL);

        return {
            getRef: getRef,
            update: update
        };

        function getRef() {
            return ref;
        }

        function update(data) {
            ref.set(data, function(err) {
                return err || "complete";
            });
        }
    }
})();
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
            msg = partial ? constants.defaultDeleteMessage + "(" + msg + ")" : msg;
            msg = msg || constants.defaultDeleteMessage;
            return confirm(msg);
        }
    }
})();
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
        vm.formTitleText = "New";
        vm.allClasses = [];
        // vm.displayMethodForm = false;
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
        vm.updateMethod = updateMethod;
        //for attributes associated with methods
        vm.addMethodAttribute = addMethodAttribute;
        vm.removeMethodAttribute = removeMethodAttribute;
        //extra stuff
        vm.checkForEnter = checkForEnter;
        vm.setEditClassName = setEditClassName;
        vm.displayAddNewMethod = displayAddNewMethod;
        vm.cancelMethodForm = cancelMethodForm;
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
                vm.selectedClass = null;
                console.log("removeClass() ", vm.selectedClass);
            }
        }

        function updateClass(classObj) {
            if (classObj && classObj.val.name.length > 0) {
                classFactory.updateClass(ref, classObj.key, classObj.val);
            }
        }
        //handles when a class is selected
        function selectClass(key, val) {
            vm.formTitleText = "New";
            vm.selectedClass = {};
            vm.selectedClass.key = key;
            vm.selectedClass.val = val;
            vm.setEditClassName(false);
            resetMethodForm();
        }

        /*controller method functions*/
        function addNewMethod(method) {
            methodFactory.addMethod(ref, vm.selectedClass.key, method);
            vm.method = {};
            vm.method.returnType = 'Return type';
            vm.displayMethodForm = false;
        }

        function removeMethod(key) {
            if (key && helperFactory.confirmDelete(vm.selectedClass.val.methods[key].name, true)) {
                methodFactory.removeMethod(ref, vm.selectedClass.key, key);
            }
        }

        function updateMethod(method) {
            vm.displayMethodForm = true;
            vm.formTitleText = "Edit";
            vm.method = method;
            console.log(method);
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
    }
})();
(function() {
    angular.module("clickawiki").directive("cwHeader", cwHeader);
    cwHeader.$inject = ["$compile"];

    function cwHeader($compile) {
        var template = [
            '<nav class="navbar navbar-default">',
            '<div class="container">',
            '<div class="navbar-header"><a class="navbar-brand navbar-link" href="#">{{headerTitle}}</a>',
            '<button class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navcol-1"></button>',
            '</div>',
            '<div class="collapse navbar-collapse" id="navcol-1"></div>',
            '</div>',
            '</nav>'
        ].join('');
        var directive = {
            restrict: "EA",
            template: template,
            transclude: true,
            scope: {
                headerTitle: "@"
            }
        };
        return directive;
    }
})();
// (function() {
//     angular.module("clickawiki").filter("methodFilter", methodFilter);

//     function methodFilter() {
//         return function(input, search) {
//             if (!input) return input;
//             if (!search) return input;
//             var expected = ('' + search).toLowerCase();
//             var result = {};
//             angular.forEach(input, function(value, key) {
//                 var actual = ('' + value).toLowerCase();
//                 if (actual.indexOf(expected) !== -1) {
//                     result[key] = value;
//                 }
//             });
//             return result;
//         };
//     }
// })();