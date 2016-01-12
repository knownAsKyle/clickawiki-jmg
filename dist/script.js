(function() {
	angular.module("clickawiki", []);
})();
(function() {
	angular.module("clickawiki").constant("constants", {
		firebaseURL: "https://quicktest1.firebaseio.com/wiki",
		navTitle: "Clickawiki"
	});
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
	angular.module("clickawiki").controller("mainController", mainController);
	mainController.$inject = ["$timeout", "constants", "firebaseFactory"];

	function mainController($timeout, constants, firebaseFactory) {
		var vm = this;
		vm.navTitle = constants.navTitle;
		vm.leftSideItems = [];
		ref = firebaseFactory.getRef();
		ref.on("value", handleDataUpdate);
		vm.selectedItem = {};
		vm.displayAddNewMethodFlag = false;

		function handleDataUpdate(snap) {
			$timeout(function() {
				vm.leftSideItems = snap.val() || [];
			});
		}

		vm.addNewClass = function(item) {
			if (item) {
				vm.leftSideItems.push(makeNewLeftSideItem(item));
				firebaseFactory.update(vm.leftSideItems);
				vm.leftSideItem = "";
			}
		};

		vm.removeClass = function(item) {
			if (item && confirmDelete()) {
				var index = vm.leftSideItems.indexOf(item);

				if (item.name === vm.selectedItem.name) {
					vm.selectedItem = {};
				}

				vm.leftSideItems.splice(index, 1);
				firebaseFactory.update(vm.leftSideItems);
			}
		};

		vm.selectClass = function(item) {
			vm.selectedItem = item;
			vm.editClass = false;
		};

		vm.displayAddNewMethod = function() {
			vm.displayAddNewMethodFlag = !vm.displayAddNewMethodFlag;
		};

		vm.addNewMethod = function(name, body) {
			vm.selectedItem.methods = vm.selectedItem.methods || [];
			vm.selectedItem.methods.push(makeNewMethod(name, body));
			vm.newMethodName = "";
			vm.newMethodBody = "";
			vm.displayAddNewMethodFlag = false;
			firebaseFactory.update(vm.leftSideItems,function(){console.log("here")}).then(function(){alert()})
		};
		vm.removeMethod = function(item) {
			if (item && confirmDelete()) {
				var index = vm.selectedItem.methods.indexOf(item);
				vm.selectedItem.methods.splice(index, 1);
				firebaseFactory.update(vm.leftSideItems);
			}
		};

		vm.checkForEnter2 = function(evt) {
			return (evt && evt.keyCode === 13 && vm.selectedItem.name) ? true : false;
		};

		vm.checkForEnter = function(evt) {
			if (evt && evt.keyCode === 13) {
				vm.addNewLeftSideItem(vm.leftSideItem);
			}
		};

		vm.isEmpty = isEmpty;

		function isEmpty(obj) {
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop))
					return false;
			}
			return true;
		}

		function makeNewLeftSideItem(name) {
			return {
				name: name
			};
		}

		function makeNewMethod(name, body) {
			return {
				name: name,
				body: body
			};
		}

		function confirmDelete() {
			return confirm("Are you sure you want to delete this?");
		}
	}
})();
(function() {
	angular.module("clickawiki").directive("navBar", navBar);
	navBar.$inject = ["$compile"];
	function navBar($compile) {
		var template = [
				'<nav class="navbar navbar-default">',
				'<div class="container">',
				'<div class="navbar-header"><a class="navbar-brand navbar-link" href="#">{{navtitle}}</a>',
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
			scope:{ 
				navtitle:"@"
			}
		}
		return directive;
	}
})()