app.factory('ScoreFactory', function () {
	
	var score = 0;

	function getScore() {
		return score;
	};

	function addPoint() {
		return ++score;
	};

	return {
		getScore, getScore,
		addPoint: addPoint
	};
});