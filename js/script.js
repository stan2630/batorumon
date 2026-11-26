import {loadImage,pointRect, getRandomInt, polyCircle, lineCircle, linePoint, pointCircle, drawPixelText, vec2,capitilize } from "./globals.js";
import {cardData} from "./cards.js"
const canvas = document.getElementById('canvas');

export const ctx = canvas.getContext('2d');
// let scalingFactor = 2;
// canvas.width =720 * scalingFactor;
// canvas.height = 1280 * scalingFactor;
// ctx.scale(scalingFactor, scalingFactor);

canvas.width =2080 
canvas.height = 3000;

// let width = canvas.width / scalingFactor
let width = canvas.width
let height = canvas.height
const halfWidth = width / 2;
const halfHeight = height / 2;
// ctx.imageSmoothingEnabled= true

let CLICKING = false
let mouseCoords = vec2()

const cardSize = {"w":250,"h":450}

let energyImage = loadImage("./img/energy.png")
class Box {
    constructor(x,y,w=cardSize.w,h=cardSize.h,draggable=false) {
        this.x=x
        this.y=y
        this.w=w
        this.h=h
        this.clicked=false
        this.draggable=draggable
        this.beforeClick = vec2()
        this.card = false
    }
    update() {
        // console.log("YOU'RE DRAGGING IT" +this.draggable)
        // console.log("IS CLICKING?" + CLICKING)
        // console.log("IS in border?" + pointRect(mouseCoords.x,mouseCoords.y,this.x,this.y,this.w,this.h))
        if (!CLICKING) {
            this.clicked = false;
        }

        if (this.draggable && CLICKING && !this.clicked && pointRect(mouseCoords.x, mouseCoords.y, this.x, this.y, this.w, this.h)) {
            this.clicked = true;

            this.beforeClick.x = mouseCoords.x - this.x;
            this.beforeClick.y = mouseCoords.y - this.y;
        }

        if (this.clicked) {
            this.x = mouseCoords.x - this.beforeClick.x;
            this.y = mouseCoords.y - this.beforeClick.y;
        }
    }

    draw() {
        if (!this.clicked) {
            ctx.fillStyle="#d0c4c4"
        } else {
            ctx.fillStyle="#e66a6a"
        }
        ctx.lineWidth=4
        ctx.fillRect(this.x,this.y,this.w,this.h);
        ctx.strokeRect(this.x,this.y,this.w,this.h);
    }
}
let hillSize = 0.077
let hillLength = 0.006
let hillPading = 0.18
let middle = 0.5
let holders = [new Box( halfWidth-(cardSize.w/2),
                    height*(middle + hillSize)-(cardSize.h/2)),
                new Box(width*(middle - hillPading) - (cardSize.w/2),
                        height*(hillLength + middle + hillSize) - (cardSize.h/2)),
                new Box(width*(middle + hillPading)- (cardSize.w/2),
                        height*(hillLength + middle + hillSize) -(cardSize.h/2))];
let holders2 = [new Box(halfWidth-(cardSize.w/2),
                    height*(middle - hillSize)-(cardSize.h/2)),
                new Box(width*(middle - hillPading) - (cardSize.w/2),
                        height*(-hillLength + middle - hillSize) - (cardSize.h/2)),
                new Box(width*(middle + hillPading)- (cardSize.w/2),
                        height*(-hillLength + middle - hillSize)-(cardSize.h/2))];
function getMiddle(x,w=cardSize.w) {
    return x + w/2
}

class EnergyCard {
    constructor(x, y, radius = 50) {
        this.x = x;
        this.y = y;
        this.radius = radius;

        this.clicked = false;
        this.beforeClick = vec2();

        this.color = "#eeeeee";
        this.dragColor = "#e66a6a";
        this.overlapping = false;
    }

    update() {
        if (this.clicked && CLICKING) {
            this.x = mouseCoords.x;
            this.y = mouseCoords.y;
        }

        this.overlapping = -1;

        for (let i = 0; i < cards.length; i++) {
            let closestX = Math.max(cards[i].x, Math.min(this.x, cards[i].x + cards[i].w));
            let closestY = Math.max(cards[i].y, Math.min(this.y, cards[i].y + cards[i].h));

            let distance = Math.sqrt(
                (this.x - closestX) ** 2 +
                (this.y - closestY) ** 2
            );

            if (distance <= this.radius) {
                this.overlapping = i;
                break;
            }
        }

        if (!CLICKING && this.clicked) {
            if (this.overlapping !== -1) {
                return cards[this.overlapping];
            }

            this.clicked = false;
        }

        if (CLICKING && !this.clicked) {
            let distance = Math.sqrt(
                (mouseCoords.x - this.x) ** 2 +
                (mouseCoords.y - this.y) ** 2
            );

            if (distance <= this.radius) {
                this.clicked = true;
            }
        }

        return null;
    }
    draw() {
        ctx.beginPath();

        if (this.overlapping) {
            ctx.fillStyle = "orange";
        } else if (this.clicked) {
            ctx.fillStyle = this.dragColor;
        } else {
            ctx.fillStyle = this.color;
        }
        ctx.fillStyle="#cbdbfc"
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 5;
        ctx.strokeStyle = "black";
        ctx.stroke();
    }
}
let energyHolderX = width*0.9
let energyHolderY =  height*0.75
let energyCards = [new EnergyCard(energyHolderX,energyHolderY,50)]
let benchLineStart = height* 0.845
let benchLineEnd = height*0.666
class Card extends Box {
    constructor(x,y,data,draggable=true,w=cardSize.w,h=cardSize.h) {
        super(x,y,w,h,draggable);
        // console.log(data)
        if (data.type == "psychic") {
            this.color = "#dd73d1"
            this.imgColor = "#c45bb8"
        } else if (data.type == "fighter") {
            this.color ="#e8a776"
            this.imgColor = "#eb8d44"
        }
        this.name = data.name
        this.img = loadImage(`./img/${data.name}.png`)
        this.height = height * (1-0.15)
        this.location = "hand"
        this.moves = data.moves
        this.health = data.health
        this.healthMax = this.health
        this.energies = 0
    }
    update() {
        if (!CLICKING) {
            this.clicked = false;
        }

        let amountClicked = 0;
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].clicked) {
                amountClicked++;
            }
        }

        if (this.draggable && CLICKING && !this.clicked && !energyCards[0].clicked && amountClicked <= 0 &&
            pointRect(mouseCoords.x, mouseCoords.y,this.x,this.y,this.w,this.h)) {
            this.clicked = true;
            this.beforeClick.x = mouseCoords.x - this.x;
            this.beforeClick.y = mouseCoords.y - this.y;
        }

        if (this.clicked) {
            this.x = mouseCoords.x - this.beforeClick.x;
            this.y = mouseCoords.y - this.beforeClick.y;
        }

        if (!CLICKING && (this.location === "hand" || this.location == "bench")) {
            let holder = -1;
            let least = 10000;

            for (let i = 0; i < holders.length; i++) {
                const distance = Math.hypot(
                    getMiddle(this.x) - getMiddle(holders[i].x),
                    getMiddle(this.y) - getMiddle(holders[i].y)
                );

                if (distance < least) {
                    least = distance;
                    holder = i;
                }
            }

            if (holder !== -1 && least < 150 && holders[holder].card == false) {
                this.x = holders[holder].x;
                this.y = holders[holder].y;
                this.draggable = false;
                this.location = "holder";
                this.clicked = false;
                holders[holder].card = this
            }

            if (this.y > benchLineEnd-100 && this.y < benchLineStart) {
                this.location = "bench"
                this.height = benchLineEnd + 50
                // console.log(this.location)
                this.clicked = false
                // this.draggable = false
            }
        }
    }

    draw() {
        if (!this.clicked) {
            ctx.fillStyle=this.color
        } else {
            ctx.fillStyle="#e66a6a"
        }
        // Card Perimeter
        ctx.lineWidth=4
        ctx.fillRect(this.x,this.y,this.w,this.h);
        ctx.strokeRect(this.x,this.y,this.w,this.h);
        // Name
        ctx.fillStyle="black"
        ctx.font = "48px arial";
        ctx.fillText(capitilize(this.name), this.x+5, this.y+43);
        // Health
        ctx.font ="43px arial"
        ctx.fillText(this.health,this.x+190,this.y+40)
        ctx.lineWidth = 10
        ctx.beginPath(); 
        let healthbarHeight=45
        let healthbarStart = 180
        let healthbarEnd = 240
        let healthbarSize = healthbarEnd - healthbarStart
        ctx.moveTo(this.x+healthbarEnd, this.y+healthbarHeight);
        ctx.lineTo(this.x+healthbarStart, this.y+healthbarHeight);
        ctx.stroke();
        ctx.beginPath(); 
        ctx.lineWidth =5
        ctx.strokeStyle = "#27cb5b"
        let healthgap=3
        ctx.moveTo(this.x+healthbarStart+healthgap, this.y+healthbarHeight);
        // this.health = 30
        ctx.lineTo(this.x+healthbarStart+healthbarSize*(this.health/this.healthMax)-healthgap, this.y+healthbarHeight);
        ctx.stroke();
        // Img box
        let imgBox = {"w":this.w-10,"h":this.h-280,
                      "x":this.x+5, "y":this.y+55}
        ctx.fillStyle =this.imgColor
        ctx.fillRect(imgBox.x,imgBox.y,imgBox.w,imgBox.h);
        ctx.lineWidth=3
        ctx.strokeStyle="white"
        ctx.strokeRect(imgBox.x,imgBox.y,imgBox.w,imgBox.h);
        ctx.strokeStyle="black"
        ctx.drawImage(this.img,
            imgBox.x+(imgBox.w-this.img.width)/2,
            imgBox.y+(imgBox.h-this.img.height)/2)
        // MOVES
        let moveheight = imgBox.h+100
        let energysize = 35
        let fontsize = 35
        for (let i = 0; i < this.moves.length; i++) {
            for (let index = 0; index < this.moves[i].cost;index++) {
                ctx.drawImage(energyImage,this.x+energysize*index,this.y+moveheight-40+fontsize*i+10)
            }
            ctx.fillStyle="black"
            ctx.font = `${fontsize}px arial`;
            ctx.fillText(this.moves[i].name, this.x+110, this.y+moveheight+fontsize*i);
            ctx.fillText(this.moves[i].damage, this.x+205, this.y+moveheight+fontsize*i);
        }
        // Energies
        // console.log(this.energies)
        ctx.fillText("Energy:",this.x,this.y+this.h*0.9)
        for (let i = 0; i < this.energies;i++) {
            ctx.drawImage(energyImage,this.x+132 +energysize*i, this.y+this.h*0.83)
        }
    }
}

let cards = []
let padding = 10
for (let i = 0; i < 7; i++) {
    let random = getRandomInt(1,2)
    let data = cardData.timerk
    if (random == 1) {
        data = cardData.timerk
    }else {
        data = cardData.catung
    }
    cards.push(new Card(i*(cardSize.w+padding),height*0.76,data))
}
// console.log(cardData)
let epicCard = new Card(halfWidth,halfHeight *0.3,cardData.timerk)
let epicCard2 = new Card (halfWidth*0.3,halfHeight*0.3,cardData.catung)


function gameUpdate() {
    // for (let i = 0; i < holders.length; i++) {
        //     holders[i].update()
        // }
        // for (let i = 0; i < holders2.length; i++) {
            //     holders2[i].update()
        // }
    // epicCard.update()
    // epicCard2.update()
    for (let i = energyCards.length - 1; i >= 0; i--) {
        let target = energyCards[i].update();

        if (target !== null) {
            target.energies++;
            energyCards.splice(i, 1);
        }
    }
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].location == "hand" && !cards[i].clicked) {
            let handCards = cards.filter(card => card.location == "hand");
            let length = (handCards.length * cardSize.w)
                    + ((handCards.length - 1) * padding);

            let handIndex = handCards.indexOf(cards[i]);

            cards[i].x = (width - length) / 2
                    + handIndex * (cardSize.w + padding);

            cards[i].y = cards[i].height;
        } else if (cards[i].location =="bench" && !cards[i].clicked) {
            let benchCards = cards.filter(card => card.location == "bench");
            let length = (benchCards.length * cardSize.w)
                    + ((benchCards.length - 1) * padding);

            let benchIndex = benchCards.indexOf(cards[i]);

            cards[i].x = (width - length) / 2
                    + benchIndex * (cardSize.w + padding);

            cards[i].y = cards[i].height;
            // console.log(cards[i].x)
            // console.log(cards[i].y)
        }

        cards[i].update();
    }
    
    // for ( let i = 0; i < cards.length; i++) {
    //     let length = (cards.length * cardSize.w) + ((cards.length - 1) * padding)
    //     // console.log(cards[i].location)
    //     if (cards[i].location == "hand") {
    //         cards[i].x = (width - length) /2 + i * (cardSize.w+padding)
    //         cards[i].y = cards[i].height
    //         cards[i].update()
    //     }
    // }
    // console.log(CLICKING)
}

function gameDraw() {
    ctx.beginPath();
    ctx.moveTo(0, benchLineStart);
    ctx.lineTo(width, benchLineStart);
    ctx.moveTo(0, benchLineEnd);
    ctx.lineTo(width,benchLineEnd);
    ctx.stroke();
    ctx.fillStyle = "gray"
    ctx.fillRect(width*0.18, (benchLineEnd+30), 5*(cardSize.w+padding)+35, cardSize.h+35);
    for (let i = 0; i < holders.length; i++) {
        holders[i].draw()
    }
    for (let i = 0; i < holders2.length; i++) {
        holders2[i].draw()
    }
    // epicCard.draw()
    // epicCard2.draw()
    for (let i = 0; i < cards.length;i++) {
        cards[i].draw()
    }

    // Energy Holder
    ctx.save()
    let energyHolderR = 100
    ctx.fillStyle="#eeeeee"
    ctx.beginPath();
    ctx.arc(energyHolderX,energyHolderY, 100, 0, 2 * Math.PI);
    ctx.fill()
    ctx.stroke();
    ctx.fillStyle="#eeeeee"
    ctx.lineWidth = 30
    ctx.strokeStyle="#bbbbbb"
    ctx.beginPath();
    ctx.arc(energyHolderX,energyHolderY, energyHolderR*0.6, 0, 2 * Math.PI);
    ctx.fill()
    ctx.stroke();
    ctx.restore()
    if (energyCards.length != 0) {
        energyCards[0].draw()
    }
}

let dt;
let lastTime = performance.now();
function gameLoop() {
    let now = performance.now();
    dt = (now - lastTime) / 1000;
    //console.log(now-lastTime)
    lastTime = now;
    if (dt > 0.05) {
        dt = 0.05;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    gameUpdate();
    gameDraw()
    window.requestAnimationFrame(gameLoop);
}

gameLoop();

document.addEventListener('pointermove', e => {
    mouseCoords = getMousePosition(canvas, e)
    // console.log(mouseCoords);
});

document.addEventListener('pointerup', e => {
    console.log(getMousePosition(canvas, e));
});

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = Math.floor((event.clientX - rect.left));
    let y = Math.floor((event.clientY - rect.top));
    return {x: x, y: y};
}

canvas.addEventListener('pointerdown', e => {
    CLICKING = true;
});

canvas.addEventListener('pointerup', e => {
    CLICKING = false;
});

canvas.addEventListener('pointerleave', e => {
    CLICKING = false;
});