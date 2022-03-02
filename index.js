console.log("Am I working?");

let gameIsOver = false;
let gameIsWon = false;
let score = 0;
let vaxScore = 0;
let interval = 0;

//Lounch screen; Canvas screen; GameOver screen
let firstScreen = document.querySelector("#first-screen");
let secondScreen = document.querySelector("#second-screen");
let thirdScreen = document.querySelector("#third-screen");

//buttons
let startBtn = document.querySelector("#start-btn");
let restartBtn = document.querySelector("#restart-btn");

//character variables
let sarsHeight = 100;
let sarsWidth = 90;
let sarsX = 20;
let sarsY = 500 - sarsHeight - 20;

//all object variables
//Virus
let covX = 2000;
let covY = 100;
let covLength = 100;
let covHeight = 100;
//Vaxxine
let vaxX = 2000;
let vaxY = 500;
let vaxLength = 100;
let vaxHeight = 100;

//Array of virus Objects
let virusArray = [{ x: covX, y: covY, i: 0 }];
let vaxArray = [{ x: vaxX, y: vaxY }];

class virus {
  constructor(x, y, i) {
    this.x = x;
    this.y = y;
    this.i = i;
    this.length = 100;
    this.width = 100;
  }
}

class vaxxine {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

//Load all images
function preload() {
  bg = loadImage("assets/starsSecondScreen.gif");
  sars = loadImage("assets/character.png");

  virusBright = loadImage("assets/collision/stateBright.png");
  virusDark = loadImage("assets/collision/stateDark.png");

  vaxxinePic = loadImage("assets/collision/Vax.png");

  maskClean = loadImage("assets/collision/maskClean.png");
  maskDirty = loadImage("assets/collision/maskDirty.png");
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("second-screen");
  textAlign(CENTER);
}

function draw() {
  if (gameIsWon) {
    //background(bg);
  } else {
    background(bg);
    interval += 1;
    // delay (in the number of drawings) between changing virus' frames
    frq = 20;

    //character of Sars
    image(sars, sarsX, sarsY, sarsWidth, sarsHeight);
    //random virus spawning
    if (interval % 100 == 0) {
      virusArray.push(new virus(width, random(20, windowHeight), interval));
    }
    //if (vaxScore == 30) {
    //  gameIsWon = true;
    //}
    //random vaxxine spawning
    if (interval % 1000 == 0) {
      vaxArray.push(new vaxxine(width, random(40, windowHeight)));
    }

    //for loop for the looping of the virusArray
    for (let i = 0; i < virusArray.length; i++) {
      if (int(int((interval + virusArray[i].i) / frq)) % 2 == 0) {
        image(
          virusBright,
          virusArray[i].x,
          virusArray[i].y,
          covLength,
          covHeight
        );
      } else {
        image(
          virusDark,
          virusArray[i].x,
          virusArray[i].y,
          covLength,
          covHeight
        );
      }
    }

    for (let i = 0; i < vaxArray.length; i++) {
      image(vaxxinePic, vaxArray[i].x, vaxArray[i].y, vaxLength, vaxHeight);
    }

    for (let i = 0; i < virusArray.length; i++) {
      virusArray[i].x -= 4;

      //collision with virus
      if (
        sarsX < virusArray[i].x + covLength - 50 && //left
        sarsX + sarsWidth > virusArray[i].x + 50 && //Right
        sarsY < virusArray[i].y - 50 + covLength && //Top
        sarsHeight + sarsY > virusArray[i].y + 50 //Bottom
      ) {
        gameIsOver = true;
      }
      if (virusArray[i].x < 0) {
        virusArray.splice(i, 1);
        score = score + 1;
        if (gameIsOver == true) {
          score = 0;
        }
      }
      /*   console.log(score); */
    }

    for (let i = 0; i < vaxArray.length; i++) {
      vaxArray[i].x -= 6;
      //collision with vaxxine
      if (
        sarsX < vaxArray[i].x + vaxLength - 20 && //left
        sarsX + sarsWidth > vaxArray[i].x + 20 && //Right
        sarsY < vaxArray[i].y - 20 + vaxLength && //Top
        sarsHeight + sarsY > vaxArray[i].y + 20 //Bottom
      ) {
        //Manhatten distance is smaller than 50,=> splice object,=> increment vaxScore by one, => reset score
        //if (abs(vaxArray[i].x - sarsX) < 50 && abs(vaxArray[i].y - sarsY) < 50) {
        vaxArray.splice(i, 1);
        vaxScore = vaxScore + 1;
        if (vaxScore == 10) {
          //vaxScore = 0;
          gameIsWon = true;
        }
      }
      /*   console.log(vaxScore); */
    }

    // function to move my char left, right, up and down
    if (keyIsPressed && keyIsDown(LEFT_ARROW) && sarsX > 0) {
      sarsX -= 10;
    }
    if (keyIsPressed && keyIsDown(RIGHT_ARROW) && sarsX + sarsWidth < width) {
      sarsX += 3;
    }
    if (keyIsPressed && keyIsDown(UP_ARROW) && sarsY > 0) {
      sarsY -= 5;
    }
    if (keyIsPressed && keyIsDown(DOWN_ARROW) && sarsY + sarsHeight < height) {
      sarsY += 5;
    }
    if (gameIsOver) {
      gameOver();
    }
    // status bar
    fill(255, 204, 0);
    textSize(64);
    text("Score:", 200, 100);
    text(score, 350, 100);
  }
}

//Stop draw function to reset objects + display game-over screen
function gameOver() {
  firstScreen.style.display = "none";
  secondScreen.style.display = "none";
  thirdScreen.style.display = "flex";
  sarsX = 20;
  sarsY = 500 - sarsHeight - 20;
  score = 0; //left
  noLoop();
}

//Showing the first screen
window.addEventListener("load", () => {
  secondScreen.style.display = "none";
  thirdScreen.style.display = "none";
  noLoop();

  //listener on start button; link to game-canvas
  startBtn.addEventListener("click", () => {
    firstScreen.style.display = "none";
    secondScreen.style.display = "flex";
    thirdScreen.style.display = "none";
    loop();
  });

  //listener on re-start button; link to game-canvas
  restartBtn.addEventListener("click", () => {
    firstScreen.style.display = "none";
    secondScreen.style.display = "flex";
    thirdScreen.style.display = "none";
    gameIsOver = false;

    //Start the game again
    virusArray = [
      { x: covX, y: covY },
      { x: covX + 800, y: covY + 200 },
      { x: covX + 1400, y: covY + 400 },
    ];
    loop();
  });

  //to simulate that the game is over
  restartBtn.addEventListener("click", () => {
    gameIsOver = false;
  });
});
