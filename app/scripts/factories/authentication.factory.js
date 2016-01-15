(function() {
    angular.module("clickawiki").factory("authFactory", authFactory);
    authFactory.$inject = ["firebaseFactory", "constants"];

    function authFactory(firebaseFactory, constants) {
        return {
            loginPrompt: loginPrompt,
            getAuth: getAuth,
            logout: logout,
            login: login
        };

        function getAuth() {}

        function logout(ref) {
            return ref.unauth();
        }

        function loginPrompt(inputValue) {
            if (inputValue === false) return false;
            if (inputValue === "") {
                swal.showInputError("You need to enter your access code!");
                return false;
            }
            swal.close();
            login(firebaseFactory.getRef(), null, inputValue)
            console.log("now loging in with access code: ", inputValue);
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
            	swal("Login Failure", err, "error");
                console.log(err);
            } else {
                //set localstorage with session id to use auto login from then on.
            }
        }
    }
})();