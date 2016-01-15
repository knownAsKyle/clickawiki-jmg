(function() {
	angular.module("clickawiki").constant("constants", {
		firebaseURL: "https://quicktest1.firebaseio.com/wiki",
		headerTitle: "Clickawiki",
		confirmDeleteDefault: "Are you sure you want to delete this? ",
		types: ["ArrayList", "Boolean", "Integer", "Double", "Number", "Object", "String"]
	});
})();