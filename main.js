const canvas = document.getElementById('canvas');
const width = 1000
const height = 1000

const ctx = canvas.getContext("2d");

// setInterval( function(){

// }, 2000)

function drawPixel(pixelsArray) {
    // La boucle i correspond au nombre de ligne , Cela correspond à la verticité.
    for (let i = 0; i < height ; i++) {
        // la boucle j correspond au nombre de colonne, donc l'horizontalité.
        for (let j = 0; j < width ; j++) {
            if (pixelsArray[i * j]) {
                ctx.fillRect(j ,i ,1 ,1);
            }
        }
    }
}

function makeArray(width, height) {
    array = [];
    for (let i = 0; i < width * height; i++) {
        array.push(getRandomBoolean());
    }
    return array;
}

function getRandomBoolean(){
    return Math.random() < 0.5;
}

const density = document.getElementById('density')

const mkArray = makeArray(width, height);

drawPixel(mkArray);