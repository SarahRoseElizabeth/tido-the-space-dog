
// utilities

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

// main
$(document).ready(function(){

  const MAX_CRATERS =  15;
  const GRID_SIZE = 5;
  let playButton = $("#play-button"),
      craterTemplate = $(".crater-png"),
      errorTemplate = $(".error"),
      splashPage = $("#splash-page"),
      gameboard = $("#gameboard"),
      gridArray = new Array(GRID_SIZE),
      boneIndex = Math.floor(getRandom(0, MAX_CRATERS - 1)),
      successScreen = $("#success"),
      playAgain = $("#play-again"),
      instructions = $ ("#instructions"),
      happyTido = $("#happy-tido"),
      sadTido = $("#sad-tido");


  // handlers
  function craterClick(){
    const crater = $(this);
    if (crater.data("craterIndex") === boneIndex){
      successScreen.show();
    }
    else {
      // temporarily toggle sad tido
      sadTido.toggle();
      happyTido.toggle();
      setTimeout(function(){
        sadTido.toggle();
        happyTido.toggle();
      }, 1000);

      //generate an x and place it on crater
      const craterPos = crater.position();
      const craterHeight = crater.height();
      const craterWidth = crater.width();

      const newError = errorTemplate.clone();
      gameboard.append(newError);

      const errorHeight = newError.height();
      const errorWidth = newError.width();

      newError.show().offset({
        top: craterPos.top + craterHeight/2 - errorHeight/2,
        left: craterPos.left + craterWidth/2 - errorWidth/2,
      }).addClass("spawned-error");
    }
  }

  // actions
  playButton.click(function(){
    splashPage.hide();
    gameboard.show();
    instructions.show();
  });

  // reset game
  playAgain.click(function(){
    splashPage.show();
    gameboard.hide();
    successScreen.hide();
    instructions.hide();

    boneIndex = Math.floor(getRandom(0, MAX_CRATERS - 1));
    $(".spawned-error").remove();
  });

  // game setup
  successScreen.hide();
  instructions.hide();
  sadTido.hide();

  for (i = 0; i < GRID_SIZE; i++) {
    gridArray[i] = new Array(GRID_SIZE).fill(false);
  }

  // reserve grid spaces for game instructions and random others
  gridArray[GRID_SIZE - 2][0] = true;
  gridArray[GRID_SIZE - 1][0] = true;
  gridArray[0][0] = true;
  gridArray[GRID_SIZE - 1][GRID_SIZE - 1] = true;
  gridArray[0][GRID_SIZE - 1] = true;

  for(i = 0; i < MAX_CRATERS; i++){
    let colPosition = Math.floor(getRandom(0, GRID_SIZE));
    let rowPosition = Math.floor(getRandom(0, GRID_SIZE));

    while(gridArray[colPosition][rowPosition]){
      colPosition = Math.floor(getRandom(0, GRID_SIZE));
      rowPosition = Math.floor(getRandom(0, GRID_SIZE));
    }

    // make a copy of the crater image and put into array
    let newCrater = craterTemplate.clone();

    gridArray[colPosition][rowPosition] = newCrater;


    // put the crater onto the gameboard
    gameboard.append(newCrater);
    // show the crater, set a random width and store the craterIndex
    newCrater.show().width(getRandom(70, 200)).data("craterIndex", i);

    const colWidth = gameboard.width() / GRID_SIZE;
    const colHeight = gameboard.height() / GRID_SIZE;

    const newLeft = colPosition * colWidth;
    const newTop = rowPosition * colHeight;

    newCrater.offset({
      top: newTop,
      left: newLeft,
    })

    // on click check for win
    newCrater.click(craterClick);
  }

});
