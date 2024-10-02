// Welcome to the JS file! This is where your website can be made interactive, adding tons of awesome web functionality.
// In this file, there is a secret button. You can reveal the super awesome button by commenting out Line _.
//To comment out a line, just add two slashes at the beginning of the line like this: //

//See what happens when you click the button! :D 

const button = document.getElementById('button');
//button.style.display="none"; 
button.addEventListener("click", fun);

function fun() {
    const canvas = document.getElementById("coolthingy");
    const ctx = canvas.getContext("2d");
    const message = document.querySelector(".welcome-message");
    const userName = document.querySelector(".text-section h1").textContent.trim();

    message.style.display = "flex";
    message.querySelector("p").textContent = `Welcome to FRC, ${userName}!`;
    button.style.display = "none";

    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.display = "block";

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const hideableElements = document.querySelectorAll(".yay");
    hideableElements.forEach(element => {
        element.style.display = "none";
    });

    /*
    Regular Settings:
    const paddleWidth = 250, paddleHeight = 10;
    const ballRadius = 20;
    let ballSpeedX = 4, ballSpeedY = -4;
    const duplicateBallOnCollision = false;
    const maxBalls = 5;
    */
    
    //YOU CAN CHANGE SETTINGS HERE :))
    const paddleWidth = 250, paddleHeight = 10; //sets height and width of paddle (what you control) in pixels
    const ballRadius = 20; //sets size/radius of the ball in pixels
    let ballSpeedX = 4, ballSpeedY = -4; //sets speed of the ball in the x and y directions (make sure to keep the negative sign for y. or not. find out yourself lol)
    const duplicateBallOnCollision = true; // Toggle ball duplication on collision
    const maxBalls = 5; // Maximum number of balls that can appear on the screen
    //YOU CAN CHANGE SETTINGS HERE :))

    let paddleX = (canvas.width - paddleWidth) / 2;
    let ballX = canvas.width / 2, ballY = canvas.height - 30;

    let rightPressed = false, leftPressed = false;

    // Extract text content from the .text-block elements
    const textBlockElements = document.querySelectorAll(".text-block");
    const randomTexts = Array.from(textBlockElements).map(element => element.textContent.trim());

    // Function to get a random text from the array
    function getRandomText() {
        return randomTexts[Math.floor(Math.random() * randomTexts.length)];
    }

    // Generate blocks to fill up half of the screen
    const blocks = [];
    const numRows = 10; // Number of rows
    const numCols = 10; // Number of columns
    const blockWidth = canvas.width / numCols;
    const blockHeight = (canvas.height / 2) / numRows;

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            blocks.push({
                x: col * blockWidth,
                y: row * blockHeight,
                width: blockWidth,
                height: blockHeight,
                text: getRandomText()
            });
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = true;
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key == "Right" || e.key == "ArrowRight") {
            rightPressed = false;
        } else if (e.key == "Left" || e.key == "ArrowLeft") {
            leftPressed = false;
        }
    }

    function drawPaddle() {
        const paragraph = document.querySelector(".text-block");
        const paragraphStyles = window.getComputedStyle(paragraph);
        const paddleColor = paragraphStyles.backgroundColor;
        ctx.fillStyle = paddleColor;
        ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    }

    function drawBall(ball) {
        const ballImage = document.getElementById("cool-img");
        ctx.drawImage(ballImage, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
    }

    function drawBlocks() {
        const paragraph = document.querySelector(".text-block");
        const paragraphStyles = window.getComputedStyle(paragraph);
        const htmlStyles = window.getComputedStyle(document.documentElement);
        
        const blockColor = paragraphStyles.backgroundColor;
        const textColor = paragraphStyles.color;
        const htmlBackgroundColor = htmlStyles.backgroundColor;
    
        blocks.forEach(block => {
            ctx.fillStyle = blockColor; 
            ctx.fillRect(block.x, block.y, block.width, block.height);
 
            ctx.strokeStyle = htmlBackgroundColor; 
            ctx.lineWidth = 2;
            ctx.strokeRect(block.x, block.y, block.width, block.height);
    
            // Draw the text inside the block
            ctx.fillStyle = textColor; 
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
    
            // Adjust font size to fit the text inside the block
            let fontSize = 16;
            ctx.font = `${fontSize}px Arial`;
            while (ctx.measureText(block.text).width > block.width - 10 && fontSize > 6) {
                fontSize--;
                ctx.font = `${fontSize}px Arial`;
            }
    
            ctx.fillText(block.text, block.x + block.width / 2, block.y + block.height / 2);
        });
    }

    function collisionDetection(ball) {
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            if (ball.x > block.x && ball.x < block.x + block.width && ball.y > block.y && ball.y < block.y + block.height) {
                ball.speedY = -ball.speedY;
                blocks.splice(i, 1); // Remove block from the array

                if (duplicateBallOnCollision && balls.length < maxBalls) {
                    balls.push({
                        x: ball.x,
                        y: ball.y,
                        radius: ball.radius,
                        speedX: ball.speedX,
                        speedY: -ball.speedY
                    });
                }

                break; // Exit the loop after removing the block
            }
        }
    }

    const balls = [{
        x: ballX,
        y: ballY,
        radius: ballRadius,
        speedX: ballSpeedX,
        speedY: ballSpeedY
    }];

    // loop
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawPaddle();
        drawBlocks();

        for (let i = 0; i < balls.length; i++) {
            const ball = balls[i];
            drawBall(ball);
            collisionDetection(ball);

            ball.x += ball.speedX;
            ball.y += ball.speedY;

            if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
                ball.speedX = -ball.speedX;
            }
            if (ball.y - ball.radius < 0) {
                ball.speedY = -ball.speedY;
            } else if (ball.y + ball.radius > canvas.height) {
                if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
                    ball.speedY = -ball.speedY;
                } else {
                    // Remove the ball that hits the bottom
                    balls.splice(i, 1);
                    i--; // Adjust index after removal
                }
            }
        }

        if (balls.length === 0) {
            // Game over, all balls have hit the bottom
            endGame();
            return;
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        requestAnimationFrame(draw);
    }

    function endGame() {
        // Show the button again when the game is over
        button.style.display = "block";
        message.style.display = 'none';

        // Show all elements with the class 'hideable'
        hideableElements.forEach(element => {
            element.style.display = "block";
        });

        // Reset the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = "none";
    }

    draw();
}