const density = document.getElementById('density');
const canvas = document.getElementById('canvas');
const start = document.getElementById('play')
const reset = document.getElementById('reset')
const ctx = canvas.getContext("2d");

const gridSize = 50;
// On ne change pas la taille du canvas
const canvasSize = 1000;

let cellsSize = canvasSize / gridSize;

density.value = 0.5

let drawGrid = [];
let updateGrid = [];

let mainLoop = null

function drawPixel(pixelsArray) {
    // On rafraichie le canvas
    ctx.clearRect(0,0,canvasSize,canvasSize);
    // La boucle i correspond au nombre de ligne , Cela correspond à la verticité.
    for (let i = 0; i < gridSize ; i++) {
        // la boucle j correspond au nombre de colonne, donc l'horizontalité.
        for (let j = 0; j < gridSize ; j++) {
            color = pixelsArray[i][j] ? "black" : "white"
            ctx.fillStyle = color;
            ctx.fillRect(i * cellsSize, j * cellsSize , cellsSize, cellsSize);
        }
    }
}

function initGrid(gridSize, density = 0.5) {
    for (let i = 0; i < gridSize; i++) {
        drawGrid[i] = [];
        updateGrid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            drawGrid[i][j] = getRandomBoolean(density)
            updateGrid[i][j] = null;
        }
    }
}

function getRandomBoolean(density){
    return Math.random() < density;
}

reset.addEventListener('click', function(){
    initGrid(gridSize, 0);
    drawPixel(drawGrid);
})

density.addEventListener('input', function() {
    let val = this.value;
    initGrid(gridSize, val);
    drawPixel(drawGrid);
})

// <!-- 1 - Une Cellule vivante meurt si elle a moins de deux voisines vivantes -->
// <!-- 2 - Une Cellule vivante survie si elle a deux ou trois voisine vivantes -->
// <!-- 3 - Une Cellule vivante meurt si elle a plus de trois voisine vivantes -->
// <!-- 4 - Une Cellule mort avec exactement 3 voisine devient une cellule vivante-->

function main() {
    mainLoop = setInterval( function(){
        for (let i = 0; i < gridSize ; i++) {
            for (let j = 0; j < gridSize ; j++) {
                // On vérifie l'état de la cellule ( vivante ou morte )
                let cellState = drawGrid[i][j];
                // Calculer le nombre de cellule vivante autour d'elle
                let neighboursNbrCellAlive = deadOrAliveNbr(i,j);
                // On va découvrir l'etat de la cellule grace aux nombre de cellule autour d'elle
                let isAlive = checkIsAlive(cellState, neighboursNbrCellAlive); 
                //console.log(`La cellule de position [${i}, ${j}] est dans un état ${isAlive}, avant elle était ${cellState} et avait ${neighboursNbrCellAlive} voisines Vivante`)                   
                // On ajoute l'etat de la cellule dans le tableau de mise a jour .
                updateGrid[i][j] = isAlive;
            }
        }
        // On change le tableau qui dessine par le tableau de mise à jour. 
        exchangeGrid();
        // Quand cela est fait on efface le tableau de mise à jour 
        // On dessine 
        drawPixel(drawGrid);
    }, 100);
}

function deadOrAliveNbr(x , y) {
    const nbCoordinate = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
    let count = 0;
    nbCoordinate.forEach(c => {
        count += getNbState(x + c[0],y + c[1])
    });
    return count;
}

function getNbState(x, y) {
    try {
        return drawGrid[x][y] ? 1 : 0;
    } catch {
        return 0;
    }
}

function checkIsAlive(cellState, nbrOfNeighboursIsAlive) {
    // Version NAIVE
    // if (cellState && nbrOfNeighboursIsAlive < 2) {
        //     return false;
    // }else if (cellState && (nbrOfNeighboursIsAlive === 2 || nbrOfNeighboursIsAlive === 3)) {
        //     return true;
        // }else if (cellState && nbrOfNeighboursIsAlive > 3){
            //     return false;
            // }
            // else if ( !cellState && nbrOfNeighboursIsAlive === 3){
                //     return true;
    // }
    //
    // Version Pro
    if ( !cellState && nbrOfNeighboursIsAlive === 3){
        return true;
    }else if ( cellState && nbrOfNeighboursIsAlive > 1 && nbrOfNeighboursIsAlive < 4 ) {
        return true
    }else {
        return false
    }
}

function exchangeGrid() {
    for (let i = 0; i < gridSize ; i++) {
        for (let j = 0; j < gridSize ; j++) {
            drawGrid[i][j] = updateGrid[i][j];
        }
    }
}
    canvas.addEventListener('click', function (e){
        let coordinate = getMouseCoordinates(e)
        drawGrid[coordinate[0]][coordinate[1]] = drawGrid[coordinate[0]][coordinate[1]] ? false : true;
        drawPixel(drawGrid);
    })
    
    canvas.addEventListener('mousemove', function (e){
        if (isMouseDown){
            let coordinate = getMouseCoordinates(e)
            drawGrid[coordinate[0]][coordinate[1]] = true;
            drawPixel(drawGrid);
        } 
    })
    
    // Quand on clique
    canvas.addEventListener('mousedown', function(){
        isMouseDown = true
    })
    // Quand on relâche le click
    canvas.addEventListener('mouseup', function(){
        isMouseDown = false
    })
    // Quand on quitte le champ d'action
    canvas.addEventListener('mouseout', function(){
        isMouseDown = false
    })


start.addEventListener('click', function() {
    if ( mainLoop != null) {
        clearInterval(mainLoop);
        mainLoop = null 
    }else{
        main()
    }
})

function getMouseCoordinates(event) {
    let limit = canvas.getBoundingClientRect(); 
        let posX = event.clientX - limit.left;
        let posY = event.clientY - limit.top;
        let pX = Math.floor(posX / cellsSize)
        let pY = Math.floor(posY / cellsSize)
        return [pX, pY];
}

initGrid(gridSize);

drawPixel(drawGrid);
