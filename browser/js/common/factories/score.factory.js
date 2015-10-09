app.factory('ScoreFactory', function () {
	
	var score = 0;

	function getScore() {
		return score;
	};

	function addPoint() {
		return ++score;
	};

	function resetPoints(){
		score = 0;
		return score;
	}

	return {
		getScore, getScore,
		addPoint: addPoint,
		resetPoints: resetPoints
	};
});