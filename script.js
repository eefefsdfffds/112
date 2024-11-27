const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 24;
const COLORS = ['#000', '#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'];

const tetrominos = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 0], [0, 1, 1]], // Z
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]]  // J
];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let currentTetromino = getRandomTetromino();
let currentX = Math.floor(COLS / 2) - 1;
let currentY = 0;
let score = 0;
let interval;

function drawBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) {
                context.fillStyle = COLORS[board[y][x]];
                context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function drawTetromino() {
    context.fillStyle = COLORS[currentTetromino.color];
    for (let y = 0; y < currentTetromino.shape.length; y++) {
        for (let x = 0; x < currentTetromino.shape[y].length; x++) {
            if (currentTetromino.shape[y][x]) {
                context.fillRect((currentX + x) * BLOCK_SIZE, (currentY + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function getRandomTetromino() {
    const shape = tetrominos[Math.floor(Math.random() * tetrominos.length)];
    return {
        shape: shape,
        color: Math.floor(Math.random() * (COLORS.length - 1)) + 1
    };
}

function collision(xOffset, yOffset) {
    for (let y = 0; y < currentTetromino.shape.length; y++) {
        for (let x = 0; x < currentTetromino.shape[y].length; x++) {
            if (currentTetromino.shape[y][x]) {
                const newX = currentX + x + xOffset;
                const newY = currentY + y + yOffset;
                if (newX < 0 || newX >= COLS || newY >= ROWS || board[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function mergeTetromino() {
    for (let y = 0; y < currentTetromino.shape.length; y++) {
        for (let x = 0; x < currentTetromino.shape[y].length; x++) {
            if (currentTetromino.shape[y][x]) {
                board[currentY + y][currentX + x] = currentTetromino.color;
            }
        }
    }
    clearLines();
}

function clearLines() {
    outer: for (let y = ROWS - 1; y >= 0; y--) {
        for (let x = 0; x < COLS; x++) {
            if (!board[y][x]) {
                continue outer;
            }
        }
        board.splice(y, 1);
        board.unshift(Array(COLS).fill(0));
        score += 100;
    }
    document.getElementById('score').innerText = `Score: ${score}`;
}

function update() {
    if (collision(0, 1)) {
        mergeTetromino();
        currentTetromino = getRandomTetromino();
        currentX = Math.floor(COLS / 2) - 1;
        currentY = 0;
        if (collision(0, 0)) {
            clearInterval(interval);
            alert('Game Over!');
            return;
        }
    } else {
        currentY++;
    }
    drawBoard();
    drawTetromino();
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowLeft' && !collision(-1, 0)) {
        currentX--;
    }
    if (event.code === 'ArrowRight' && !collision(1, 0)) {
        currentX++;
    }
    if (event.code === 'ArrowDown') {
        update();
    }
    if (event.code === 'ArrowUp') {
        const temp = currentTetromino.shape;
        currentTetromino.shape = rotate(currentTetromino.shape);
        if (collision(0, 0)) {
            currentTetromino.shape = temp;
        }
    }
    drawBoard();
    drawTetromino();
});

function rotate(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
}

interval = setInterval(update, 500);
