(function() {
    angular.module("clickawiki").directive("cwHeader", cwHeader);
    cwHeader.$inject = ["$compile"];

    function cwHeader($compile) {
        var template = [
            '<nav class="navbar navbar-default">',
            '<div class="container">',
            '<div class="navbar-header"><a class="navbar-brand navbar-link" href="#">{{headerTitle}}</a>',
            '<button class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navcol-1"></button>',
            '</div>',
            '<div class="collapse navbar-collapse" id="navcol-1"></div>',
            '</div>',
            '</nav>'
        ].join('');
        var directive = {
            restrict: "EA",
            template: template,
            transclude: true,
            scope: {
                headerTitle: "@"
            }
        };
        return directive;
    }
})();