(function() {
	angular.module("clickawiki").filter("methodFilter", methodFilter);

	function methodFilter() {
		console.log("in filter")
		return function(input, search) {
			console.log("in filter")
			if (!input) return input;
			if (!search) return input;
			var expected = ('' + search).toLowerCase();
			var result = {};
			angular.forEach(input, function(value, key) {
				var actual = ('' + value).toLowerCase();
				if (actual.indexOf(expected) !== -1) {
					result[key] = value;
				}
			});
			return result;
		};
	}
})();