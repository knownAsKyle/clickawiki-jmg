(function() {
	angular.module("clickawiki").constant("constants", {
		firebaseURL: "https://quicktest1.firebaseio.com/wiki",
		headerTitle: "Clickawiki",
		defaultDeleteMessage: "Are you sure you want to delete this? ",
		types: ["ArrayList", "Boolean", "Integer", "Double", "Number", "Object", "String"],
		auth: {
			email: "admin@admin.com"
		},
		popUpDeleteSettings: {
			title: "Are you sure?",
			text: "",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#5cb85c",
			confirmButtonText: "Yes, delete it!",
			cancelButtonText: "No, cancel!",
			closeOnConfirm: false,
			closeOnCancel: false
		}
	});
})();