const canvas = document.getElementById('myCanvas');
const rc = rough.canvas(canvas);
const ctx = canvas.getContext("2d");
let x = canvas.width/2;
let y = canvas.height-30;
let dx = 2;
let dy = -2;
const ballRadius = 10;
const ballDiameter = 20;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth) / 2;
let score = 0;
let highScore = 0;

// generate bricks
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
function newGame(){
    // reset values
    x = canvas.width/2;
    y = canvas.height-30;
    dx = 2;
    dy = -2;
    paddleX = (canvas.width-paddleWidth) / 2;
    score = 0;

    // add bricks
    bricks = [];
    for(let c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(let r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0 , status: 1 };
        }
    }
}


// handle keypresses
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

// draw objects
function drawPaddle() {
    rc.rectangle(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight, {
        'fill': 'blue',
        'fillStyle': 'cross-hatch'
    })
}

function drawBall() {
    rc.circle(x, y, ballDiameter, {
        fill: 'red',
        fillStyle: 'hachure',
        fillWeight: 2
    })
}

function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
                if(bricks[c][r].status == 1) {
                    let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                    let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    rc.rectangle(brickX, brickY, brickWidth, brickHeight, {
                        fill: 'green',
                        fillStyle: 'zigzag'
                    })
        }
        }
    }
}

function drawScore() {
    ctx.font = "italic 16px Helvetica";
    ctx.fillStyle = "#000000";
    ctx.fillText("Score: "+score, 8, 20);
    ctx.fillText("High Score: "+highScore, 100, 20)
}

// game logic
function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status == 1 && x + ballRadius > b.x && x - ballRadius < b.x+brickWidth && y + ballRadius > b.y && y - ballRadius < b.y+brickHeight) {
                dy = -dy;
                b.status = 0;
                score++;
                if (score > highScore) {
                    highScore = score
                }
                if(score == brickRowCount*brickColumnCount) {
                    alert("YOU WIN, CONGRATULATIONS!");
                    newGame();
                }
            }
        }
    }
}

function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // call draw functions
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();

    collisionDetection();
    
    if(x + dx > canvas.width-ballDiameter || x + dx < ballDiameter) {
        dx = -dx;
    }
    if(y + dy < ballDiameter) {
        dy = -dy;
    } else if(y + dy > canvas.height-ballDiameter) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            alert("GAME OVER"); 
            newGame();
        }
    }
    
    if(rightPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if(leftPressed) {
        paddleX -= 7;
        if (paddleX < 0){
            paddleX = 0;
        }
    }
    
    x += dx;
    y += dy;
    window.requestAnimationFrame(tick)
}

newGame();
let frame = window.requestAnimationFrame(tick)