(function() {
	angular.module("clickawiki").factory("storageFactory", storageFactory);
	storageFactory.$inject = ["constants"];

	function storageFactory() {
		var store = localStorage || false;
		return {
			set: set,
			get: get,
			remove: remove
		};

		function set(key, val) {
			return (store) ? store.setItem(key, val) : false;
		}

		function get(key) {
			return (store) ? store.getItem(key) : false;
		}

		function remove(key) {
			return (store) ? store.removeItem(key) : false;
		}
	}

})();