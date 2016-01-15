(function() {
    angular.module("clickawiki").factory("authFactory", authFactory);
    authFactory.$inject = [];

    function authFactory() {
        return {
            getAuth: getAuth,
            logout: logout,
            login: login
        };

        function getAuth() {}

        function logout(ref) {
            return ref.unauth();
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
                console.log(err);
            } else {
                //set localstorage with session id to use auto login from then on.
            }
        }
    }
})();