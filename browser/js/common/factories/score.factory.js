app.factory('ScoreFactory', function () {
	
	var score = 0;
	var combo = 0;

	function getScore() {
		return score;
	};

	function getCombo() {
		return combo;
	};

	function addScore() {
		return ++score;
	};

	function addCombo() {
		return ++combo;
	};

	function resetScore(){
		score = 0;
		return score;
	}

	function resetCombo(){
		combo = 0;
		return combo;
	}

	return {
		getScore: getScore,
		getCombo: getCombo,
		addScore: addScore,
		addCombo: addCombo,
		resetScore: resetScore,
		resetCombo: resetCombo
	};
});