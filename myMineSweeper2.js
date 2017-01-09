(function(){


	"use strict";
	const tileDim = 30;
	var nonBombsFound;
	var tileBoard;
	var arrayBoard;
	var lostYet;
	var bombs;


	window.onload = function(){
		playGame();
		document.getElementById("resetButton").onclick = playGame;

	};

	function playGame(){
		document.getElementById("gamearea").innerHTML = "";
		var width = document.getElementById("width").value;
		var height = document.getElementById("height").value;
		bombs = document.getElementById("bombs").value;
		makeBoard(width, height, bombs);
		showBoard(width, height);
	}

	//This functino constructs the puzzle area
	function makeBoard(width, height, bombs) {
		nonBombsFound = 0;
		arrayBoard = new Array(width);
		for(var i = 0; i < width; i++){
			arrayBoard[i] = new Array(height);
		}
		for(i = 0; i < bombs; i++){
			var x = Math.floor(Math.random() * width);
			var y = Math.floor(Math.random() * height);
			if(arrayBoard[x][y] == -1){
				i--;
			}
			arrayBoard[x][y] = -1;
		}
		for(i = 0; i < width; i++){
			for(var j = 0; j < height; j++){
				arrayBoard[i][j] = getValue(i, j);
			}
		}
		lostYet = false;
	}

	function submitClick(i, j){

		if(!lostYet && i > -1 && j > -1 && i < arrayBoard.length && j < arrayBoard[0].length && arrayBoard[i][j] < 9){
			showTile(i, j);
			if(arrayBoard[i][j] == -1){
				gameOver();
			} else {
				arrayBoard[i][j] += 20;
				if(arrayBoard[i][j] % 10 === 0){
					for(var tempI = i - 1; tempI < i + 2; tempI++){
						for (var tempJ = j - 1; tempJ < j + 2; tempJ++) {
							if(tempJ != j || tempI != i){
								submitClick(tempI, tempJ);
							}
						}
					}
				}
				nonBombsFound++;
			} 
		}
		if(nonBombsFound === (arrayBoard.length * arrayBoard[0].length) - bombs){
			winGame();
		}
	}

	function getBombCustomSet(bombNum, width, height){
		var toReturn = new CustomSet();
		for (i = 0; i < bombNum; i++) {
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

	function gameOver(){
		lostYet = true;
	}

	function showTile(i, j){
		if(arrayBoard[i][j] != -1){
			tileBoard[i][j].innerHTML = arrayBoard[i][j];
			tileBoard[i][j].style.backgroundColor = "white";
		} else{
			tileBoard[i][j].style.backgroundColor = "red";
		}
	}

	function getValue(i, j){
		var total = -1;
		if(arrayBoard[i][j] != -1){ 
			total++;
			for(var tempI = i - 1; tempI < i + 2; tempI++){
				for (var tempJ = j - 1; tempJ < j + 2; tempJ++) {
					if(tempI > -1 && tempJ > -1 && tempI < arrayBoard.length && tempJ < arrayBoard[0].length && 
							(tempJ != j || tempI != i) && arrayBoard[tempI][tempJ] == -1){
						total++;
					}
					
				}
			}
		}
		return total;
	}

	function submitRightClick(i, j){
		arrayBoard[i][j] = (arrayBoard[i][j] + 10) % 20;
		if(arrayBoard[i][j] > 8){
			tileBoard[i][j].style.backgroundColor = "green";	
		} else{
			tileBoard[i][j].style.backgroundColor = "white";
		}
	}

	function showBoard(width, height){
		tileBoard = new Array(width);
		for (var i = 0; i < width; i++) {
			tileBoard[i] = new Array(height);
		}
		var area = document.getElementById("gamearea");
		area.style.height = tileDim * height + "px";
		area.style.width = tileDim * width + "px";

		for (var j = 0; j < height; j++) {
			for(var i = 0; i < width; i++){
				var tile = document.createElement("div");
				tile.style.width = tileDim - 2 +"px";
				tile.style.height = tileDim - 2 + "px";
				tile.classList.add("tile");
				area.appendChild(tile);
				var y = j * tileDim;
				var x = i * tileDim;
				tile.style.top = y + "px";
				tile.style.left =  x + "px";
				tileBoard[i][j] = tile;
				
				tile.onclick = function(i, j){
					return (function(){
						submitClick(i, j);
					});
				}(i, j);
				tile.removeEventListener('oncontextmenu', tile.oncontextmenu);
				tile.addEventListener('oncontextmenu', function(e){
					e.preventDefault();
					e.stopPropogation();
				});
				tile.oncontextmenu = function(i, j){
					return (function(){
						submitRightClick(i, j);
					});
				}(i, j);
				tile.ondblclick = function(i, j){
					return (function(){
						submitdoubleclick(i, j);
					});
				}(i, j);
			}
		}
	}

	function printBoard(){
		console.log(arrayBoard.length);
		for (var i = 0; i < arrayBoard.length; i++) {
			console.log(arrayBoard[i]);
		}
	}
	function winGame(){
		alert("You won");
	}

	function submitdoubleclick(i, j){
		for(var tempI = i - 1; tempI < i + 2; tempI++){
			for (var tempJ = j - 1; tempJ < j + 2 && nonBombsFound != (arrayBoard.length * arrayBoard[0].length) - bombs; tempJ++) {
				if(tempJ != j || tempI != i){
					submitClick(tempI, tempJ);
				}
			}
		}
	}
})();
