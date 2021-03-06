(function() {
    angular.module("clickawiki").constant("constants", {
        ///firebaseURL: "https://quicktest1.firebaseio.com/wiki",
        useWebServer: false,
        firebaseURL: "https://apiwiki.firebaseio.com",
        headerTitle: "Clickawiki",
        defaultDeleteMessage: "Are you sure you want to delete this? ",
        types: ["ArrayList", "Boolean", "Character", "Double", "Integer", "Number", "Object", "String", "Void"],
        path: {
            templatePath: "/assets/templates/"
        },
        sortMessage: {
            default: "",
            a: "ascending",
            d: "descending"
        },
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
        },
        loginPromptSettings: {
            title: "Login",
            text: "Please provide your access code:",
            type: "input",
            inputType: "password",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputValue: "click",
            inputPlaceholder: "Acess code..."
        }
    });
})();