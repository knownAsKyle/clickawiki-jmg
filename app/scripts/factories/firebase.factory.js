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