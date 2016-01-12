(function() {
	angular.module("clickawiki").directive("navBar", navBar);
	navBar.$inject = ["$compile"];
	function navBar($compile) {
		var template = [
				'<nav class="navbar navbar-default">',
				'<div class="container">',
				'<div class="navbar-header"><a class="navbar-brand navbar-link" href="#">{{navtitle}}</a>',
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
			scope:{ 
				navtitle:"@"
			}
		}
		return directive;
	}
})()