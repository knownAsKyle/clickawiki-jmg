(function() {
    angular.module("clickawiki").directive("cwHeader", cwHeader);
    cwHeader.$inject = ["$compile", "constants"];

    function cwHeader($compile, constants) {
        var template = '<nav class="navbar navbar-default"><div class="container"><div class="navbar-header"><button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navcol-1" aria-expanded="false"><span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span></button> <a class="navbar-brand navbar-link" href="#">{{vm.headerTitle}}</a></div><div class="collapse navbar-collapse" id="navcol-1"><form class="navbar-form navbar-left" role="search"><div class="form-group"><div class="input-group"><input type="text" class="form-control" placeholder="Search" ng-model="vm.searchTerm"> <span class="input-group-btn"><button class="btn btn-default" type="button"><span class="glyphicon glyphicon-search" aria-hidden="true" ng-click="vm.search(vm.searchTerm)"></span></button></span></div></div></form><ul class="nav navbar-nav"><li ng-if="!vm.isLoggedIn"><a href="#" ng-click="vm.loginPrompt($event)">Log In</a></li><li ng-if="vm.isLoggedIn"><a href="#" ng-click="vm.logOut($event)">Log Out</a></li></ul></div></div></nav>';
        var directive = {
            restrict: "EA",
            transclude: true,
        };
        templateUrl = constants.path.templatePath + "cwHeader.directive.html";
        if (constants.useWebServer) {
            directive.templateUrl = templateUrl;
        } else {
            directive.template = template;
        }
        return directive;
    }
})();