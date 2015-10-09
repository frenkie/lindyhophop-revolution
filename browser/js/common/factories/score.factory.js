app.factory('ScoreFactory', function() {

    var score = 0;
    var combo = 0;
    var maxCombo = 0;
    //Joe, this is for you
    //there be dragonGuys
    var totalArrowGuy;

    var mult = 0.005;
    var scaleFactor = 1;

    var TIMINGWINDOWS = {
        Flawless: 0.03,
        Marvelous: 0.08,
        Great: 0.15
    }

    var POINTS = {
        Flawless: 10,
        Marvelous: 8,
        Great: 6
    }

    var accuracyCountGuy = {
    	Flawless: 0,
    	Marvelous: 0,
    	Great: 0,
    	Miss: 0
    }

    function getScore() {
        return score;
    }

    function getCombo() {
        return combo;
    }

    function getMaxCombo() {
        return maxCombo;
    }

    function addScore(diff) {
        if (diff <= TIMINGWINDOWS.Flawless) {
            score += POINTS.Flawless;
            accuracyCountGuy.Flawless++;
        } else if (diff <= TIMINGWINDOWS.Marvelous) {
            score += POINTS.Marvelous;
            accuracyCountGuy.Marvelous++;
        } else if (diff <= TIMINGWINDOWS.Great) {
            score += POINTS.Great;
            accuracyCountGuy.Great++;
        } else {
            accuracyCountGuy.Miss++;
        }
        return score;
    }

    function addCombo(diff) {
        if (diff <= TIMINGWINDOWS.Great) {
            combo++;
            if (combo > maxCombo) maxCombo = combo;
        }
        return combo;
    }

    function resetScore() {
        score = 0;
        return score;
    }

    function resetCombo() {
        combo = 0;
        return combo;
    }

    function setTotalArrows (stepChart) {
    	console.log('stepChart:', stepChart);
    	totalArrowGuy = stepChart.chart.reduce(function(a, measure) {
    		return a + measure.reduce(function(b, line) {
    			return b + line.reduce(function(c, arrow) {
    				var value = (arrow === '1' || arrow === '2') ? 1 : 0;
    				return c + value;
    			}, 0);
    		}, 0);
    	}, 0);

    	console.log('total arrows:', totalArrowGuy);
		// totalArrowGuy = Object.keys(stepChart).reduce(function(a, dir) {
		// 	return a + dir.list.reduce(b, function(arrow) {
		// 		var value = (arrow === '1' || arrow === '2') ? 1 : 0;
		// 		return b + value;
		// 	}, 0)
		// }, 0)
    }

    function finalScore() {
        var realScore = score * 1000000 / (totalArrowGuy * POINTS.Flawless);
        return Math.floor((realScore + 1000000)/2);
    }

    return {
        getScore: getScore,
        getCombo: getCombo,
        getMaxCombo: getMaxCombo,
        addScore: addScore,
        addCombo: addCombo,
        resetScore: resetScore,
        resetCombo: resetCombo,
        finalScore: finalScore,
        setTotalArrows: setTotalArrows,
        accuracyCountGuy: accuracyCountGuy
    };
});