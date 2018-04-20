

(function(){

  var view = {
    displayMessage: function(msg){
      var messageArea = document.getElementById("messageArea");
      messageArea.innerHTML = msg;

    },

    displayHit: function(location){
      var cell = document.getElementById(location);
      cell.setAttribute("class", "hit");
    },

    dysplayMiss: function(location){
      var cell = document.getElementById(location);
      cell.setAttribute("class", "miss");
    }
  };


  var model = {
    boardSize: 7,
    numShips: 3,
    shipLenght: 3,
    shipsSunk: 0,

    ships: [{locations: ["00", "00", "00"], hits: ["", "", ""]},
            {locations: ["00", "00", "00"], hits: ["", "", ""]},
            {locations: ["00", "00", "00"], hits: ["", "", ""]}],

    fire: function(guess){

      for(var i = 0; i < this.numShips; i++){
        var ship = this.ships[i];
        var index = ship.locations.indexOf(guess);

        if(index >= 0){
          ship.hits[index] = "hit";
          view.displayHit(guess);
          view.displayMessage("HIT");
          if(this.isSunk(ship)){
            view.displayMessage("You sank my ship!!!");
            this.shipsSunk++;
          }
          return true;

        }

      }
      view.dysplayMiss(guess);
      view.displayMessage("MISS");
      return false;
    },


    isSunk: function(ship){
      for(var i = 0; i < ship.shipLenght; i++){
        if(ship.hits[i] !== "hit")
          return false;
      }
      return true;
    },


    generateShip: function(){
      var direction = Math.floor(Math.random() * 2);
      var row, col;

      if(direction === 1){
        row = Math.floor(Math.random() * this.boardSize);
        col = Math.floor(Math.random() * (this.boardSize - this.shipLenght));
      }
      else{
        row = Math.floor(Math.random() * (this.boardSize - this.shipLenght));
        col = Math.floor(Math.random() * this.boardSize);
      }

      var newShipLocations = [];
      for(var i = 0; i < this.shipLenght; i++){
        if(direction === 1)
          newShipLocations.push(row + "" + (col + i));
        else
          newShipLocations.push((row + i) + "" + col);
      }
      return newShipLocations;
    },


    collision: function(location){
      for(var i = 0; i < this.numShips; i++){
        var ship = model.ships[i];
        for(var j = 0; j < location.length; j++){
          if(ship.locations.indexOf(location[j]) >= 0)
            return true;
        }

      }
      return false;
    },

    generateShipLocations: function(){
      var locations;
      for(var i = 0; i < this.numShips; i++){
        do{
          
          locations = this.generateShip();

        }while(this.collision(locations));

        this.ships[i].locations = locations;
      }
    }
  };


  function parseGuess(guess){

    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if(guess === null || guess.length !== 2){
      alert("Oops! Wrong input! Enter a letter and a number on the board!");
      view.displayMessage("Gunner's error!!!");
    }
    else{
      var firstChar = guess.charAt(0);
      var row = alphabet.indexOf(firstChar);
      var column = guess.charAt(1);

      if(isNaN(row) || isNaN(column)){
        alert("Oops, that is not on the board");
        view.displayMessage("Gunner's error!!!");
      }

      else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
        alert("Oops, that's off the board!!!");
        view.displayMessage("Gunner's error!!!");
      }
      else
        return row + column;
    }

    return null;
  }



  var controller = {

    guess: 0,

    processGuess: function(guess){
       var location = parseGuess(guess);
        if(location){
          this.guess++;
          var hit = model.fire(location);
          if(hit && model.shipsSunk === model.numShips){
            alert("You sank all my ships, in " + this.guess + " guess");
            view.displayMessage("You sank all my ships, in " + this.guess + " guess");
          }
        }
    }
  };



  function init(){
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
    model.generateShipLocations();
  }

  function handleKeyPress(e){
    var fireButton = document.getElementById("fireButton");
    if(e.keyCode === 13){
      fireButton.click();
      return false;
    }
  }


  function handleFireButton(){
    var guessInput = document.getElementById("guessInput");
    controller.processGuess(guessInput.value);
    guessInput.value = "";
  }

  window.onload = init;
  
  


})();
