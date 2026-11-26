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
