(function() {
	if (angular) {
		angular.module("logger", []).factory("loggerFactory", loggerFactory);
		loggerFactory.$inject = [];
	}

	function loggerFactory() {
		return {
			log: log,
			error: error,
			warn: warn,
			info: info,
			dir: dir
		};

		function log(val, type) {
			if (type) {
				type = type.toString().charAt(0).toLowerCase();
				switch (type) {
					case "e":
						return error(val);
					case "w":
						return warn(val);
					case "i":
						return info(val);
					case "d":
						return info(val);
					default:
				}
			}
			return console.log(val);
		}

		function error(val) {
			return console.error(val);
		}

		function warn(val) {
			return console.warn(val);
		}

		function info(val) {
			return console.info(val);
		}

		function dir(val) {
			return console.dir(val);
		}

	}
})();