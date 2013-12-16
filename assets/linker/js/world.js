define([], function(){
	'use strict';

	function initialize() {
		console.log("init world");
	}
	function patate() {
		console.log("init patate");
	}

	return {
		initialize : initialize,
		patate : patate
	}
});