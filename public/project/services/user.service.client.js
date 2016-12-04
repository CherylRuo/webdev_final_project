/**
 * Created by CherylRuo on 10/7/16.
 */
(function () {
    angular
        .module("WebAppMaker")
        .factory("UserService", UserService);
    function UserService($http) {
        var api = {
            register: register,
            findUserById: findUserById,
            findUserByUsername: findUserByUsername,
            findUserByCredentials: findUserByCredentials,
            updateUser: updateUser,
            unregisterUser: unregisterUser,
            login: login,
            logout: logout
        };
        return api;

        function login(user) {
            return $http
                .post("/api/login", user);
        }

        function logout() {
            return $http
                .post("/api/logout");
        }

        function register(user) {
            return $http
                .post("/api/register", user)
        }

        function findUserById(id) {
            return $http
                .get("/api/user/" + id)
        }

        function findUserByUsername(username) {
            return $http
                .get("/api/user?username=" + username)
        }

        function findUserByCredentials(username, password) {
            return $http
                .get("/api/user?username=" + username + "&password=" + password)

        }

        function updateUser(userId, user) {
            return $http
                .put("/api/user/" + userId, user)
        }

        function unregisterUser(userId) {
            return $http
                .delete("/api/user/" + userId)
        }
    }
})();