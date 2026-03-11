// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('food.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('music.mp3');
let speed = 8;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    { x: 13, y: 15 }
];
let food = { x: 6, y: 7 };

let board = document.getElementById("board");

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);

    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If snake collides with itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    // If snake collides with wall
    if (snake[0].x <= 0 || snake[0].x > 18 || snake[0].y <= 0 || snake[0].y > 18)
        return true;

    return false;
}

function gameEngine() {
    // 1. Check for collision
    if (isCollide(snakeArr)) {
        alert("Game over! Press OK to restart.");
        snakeArr = [{ x: 13, y: 15 }];
        inputDir = { x: 0, y: 0 };
        score = 0;
        return;
    }

    // 2. If snake eats food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;
        if(score>hiscoreval){
            hiscoreval=score;
            localStorage.getItem("hiscore",JSON.stringify(hiscoreval))
            highScorebox.innerHTML="HIghScore: "+ hiscoreval;
        }

        scorebox.innerHTML="Score"+score
        // Add new head segment in the direction of movement
        snakeArr.unshift({
            x: snakeArr[0].x ,
            y: snakeArr[0].y 
        });

        // Generate new food position
        let a = 2;
        let b = 16;
        food = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random())
        };
    }

    // 3. Move the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // 4. Display the snake
    board.innerHTML = "";
    snakeArr.forEach((segment, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.classList.add('snake');

        // First segment is always head (red)
        if (index == 0) {
            snakeElement.classList.add('head');
        }

        board.appendChild(snakeElement);
    });

    // 5. Display the food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Keyboard Controls
let hiscore=localStorage.getItem("hiscore");
if(hiscore===null){
    hiscoreval=0;
    localStorage.getItem("hiscore",JSON.stringify(hiscoreval));
}
else{
    hiscoreval=JSON.parse(hiscore);
    highScorebox.innerHTML="HighScore: "+ hiscore;
}
window.addEventListener('keydown', e => {
    // Start the game on first key press
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
    }
});

// Start the game
window.requestAnimationFrame(main);

