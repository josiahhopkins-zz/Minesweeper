(function(){


	"use strict";
	const tileDim = 30;
	var bombs;
	var bombsFound = 0;


	window.onload = function(){
		makeBoard();
		//document.getElementById("reCustomSet").onclick = shuffle;
	};

	//This functino constructs the puzzle area
	function makeBoard() {
		var area = document.getElementById("gamearea");
		var width = 10;
		var height = 10;
		bombs = 20;
		bombsFound = 0;
		var bombCustomSet = getBombCustomSet(bombs, width, height);
		area.style.height = tileDim * height + "px";
		area.style.width = tileDim * width + "px";
		var board = new Array(width);
		for(var i = 0; i < width; i++){
			board[i] = new Array(height);
		}

		printSet(bombCustomSet);
		for(var i = 0; i < width; i++){
			for (var j = 0; j < height; j++) {
				
				var tile = document.createElement("div");
				tile.style.width = tileDim - 2 +"px";
				tile.style.height = tileDim - 2 + "px";
				tile.classList.add("tile");
				area.appendChild(tile);
				var pic = document.createAttribute("bombValue");
				var y = j * tileDim;
				var x = i * tileDim;
				tile.style.top = y + "px";
				tile.style.left =  x + "px";
				board[i][j] = tile;
				var testing = getNeighbors(i, j, width, height);
				var value = getTileValue(i, j, bombCustomSet, testing);
				tile.onclick = (function(arg, theValue){
					return function(){
						arg.innerHTML = theValue;
					}
				})(tile, value);
			}
		}
	}

	/*
	class Tile extends img{ 
	 	constructor() {

	 	}
	  
	  	flip() {

	  	}
	}
	*/
	function getBombCustomSet(bombNum, width, height){
		var toReturn = new CustomSet();
		for (var i = 0; i < bombNum; i++) {
			var x = Math.floor(Math.random() * width);
			var y = Math.floor(Math.random() * height);
			var toPlace = new Array(2);
			toPlace[0] = x;
			toPlace[1] = y;
			if(toReturn.has(toPlace)){
				i--;
			} else{
				toReturn.add(toPlace);
			}
		}
		toReturn.add([0,0]);
		return toReturn;
	}

	function getNeighbors(i, j, width, height){
		var neighbors = new CustomSet();
		for(var k = i - 1; k < i + 2; k++){
			for (var l = j - 1; l < j + 2; l++) {
				if(l > -1 && k > -1 && k < width && l < height && (l != j || k != i)){
					neighbors.add([k, l]);
				} 
			}
		}
		return neighbors;
	}

	function getTileValue(i, j, bombCustomSet, neighborCustomSet){
		var total = 0;
		var toCheck = new Array(2);
		toCheck[0] = i;
		toCheck[1] = j;
		if(bombCustomSet.has(toCheck)){
			console.log("*********" + toCheck);
			total = -1;
		} else {
			for (let variable of neighborCustomSet){
				if(bombCustomSet.has(variable)){
					total++;
				}
			}
			
		}
		return total;
	}

	class CustomSet extends Set {
		
		has(temp){
			for(let current of this){
				if(temp[0] === current[0] && temp[1] === current[1]){
					return true;
				}
			}
			return false;
		}
		
	}

	function printSet(toPrint){
		for(let thisOne of toPrint){
			console.log(thisOne[0] + ", " + thisOne[1] + "\n");
		}
	}
})();
