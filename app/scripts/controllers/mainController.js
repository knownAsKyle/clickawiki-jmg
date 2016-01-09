(function() {
	angular.module("clickawiki").controller("mainController", mainController);
	mainController.$inject = ["$timeout", "firebaseFactory"];

	function mainController($timeout, firebaseFactory) {
		var vm = this;
		vm.leftSideItems = [];
		ref = firebaseFactory.getRef();
		ref.on("value", handleDataUpdate);
		vm.selectedItem = {};
		vm.displayAddNewMethodFlag = false;

		function handleDataUpdate(snap) {
			$timeout(function() {
				console.log(snap.val())
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
			firebaseFactory.update(vm.leftSideItems);
		};
		vm.removeMethod = function(item) {
			if (item && confirmDelete()) {
				var index = vm.selectedItem.methods.indexOf(item);
				vm.selectedItem.methods.splice(index, 1);
				firebaseFactory.update(vm.leftSideItems);
			}
		};

		vm.checkForEnter = function(evt) {
			if (evt && evt.keyCode === 13) {
				vm.addNewLeftSideItem(vm.leftSideItem);
			}
		};

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