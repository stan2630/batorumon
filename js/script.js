import {loadImage,pointRect, getRandomInt, polyCircle, lineCircle, linePoint, pointCircle, drawPixelText, vec2 } from "./globals.js";
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

        if (this.draggable && CLICKING && !this.clicked && amountClicked <= 0 &&
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
    // update() {
    //     let holder = 0
    //     let least = Math.hypot(getMiddle(this.x)-getMiddle(holders[holder].x),getMiddle(this.y)-getMiddle(holders[holder].y))
    //     for (let i = 0; i < holders.length; i++) {
    //         let distance = Math.hypot(getMiddle(this.x)-getMiddle(holders[i].x),getMiddle(this.y)-getMiddle(holders[i].y))
    //         if (distance <= least) {
    //             least = distance
    //             holder = i
    //         }
    //         // console.log(least)
    //         // console.log(`${i}: ${Math.hypot(this.x-holders[i].x,this.y-holders[i].y)}`)
    //     }
    //     // console.log(holder)
    //     if (!this.clicked && least < 150) {
    //         console.log("HI")
    //         // console.log("HELLO")
    //         this.x = holders[holder].x
    //         this.y = holders[holder].y
    //         this.clicked = false
    //         this.draggable = false
    //         this.location = "holder"
    //     }
    //     // console.log(this.location)
    //     // console.log(holder)
    //     // console.log("YOU'RE DRAGGING IT" +this.draggable)
    //     // console.log("IS CLICKING?" + CLICKING)
    //     // console.log("IS in border?" + pointRect(mouseCoords.x,mouseCoords.y,this.x,this.y,this.w,this.h))
    //     if (!CLICKING) {
    //         this.clicked = false;
    //     }
    //     let amountClicked = 0
    //     for (let i = 0; i < cards.length; i++) {
    //         if (cards[i].clicked) {
    //             amountClicked++;
    //         }
    //     }
    //     // console.log(amountClicked)
    //     if (this.draggable && CLICKING && !this.clicked && amountClicked <= 0 && pointRect(mouseCoords.x, mouseCoords.y, this.x, this.y, this.w, this.h)) {
    //         this.clicked = true;

    //         this.beforeClick.x = mouseCoords.x - this.x;
    //         this.beforeClick.y = mouseCoords.y - this.y;
    //     }

    //     if (this.clicked) {
    //         this.x = mouseCoords.x - this.beforeClick.x;
    //         this.y = mouseCoords.y - this.beforeClick.y;
    //     }
    // }

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
        ctx.fillText(this.name, this.x+5, this.y+43);
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
    epicCard.draw()
    epicCard2.draw()
    for (let i = 0; i < cards.length;i++) {
        cards[i].draw()
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