
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'goloscanvas', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('bubble', 'res/bubble.png');

}

let bubbles = [];
let scale = 0.1;

//function addBubble() {
    //let b = game.add.sprite(400 + (Math.random() * 40) - 20, 540, 'bubble');
    //game.physics.arcade.enable([b], Phaser.Physics.ARCADE);
    //b.myscale = scale;
    //b.scale.setTo(0.1);
    //b.body.setCircle(40);
    ////b.tint =  Math.random() * 0xffffff;
    //b.body.collideWorldBounds = true;
    //b.body.bounce.set(0.1, 0);
    //b.body.gravity.y = -1;
    //b.body.velocity.x = 0.02;
    //b.body.velocity.y = 0.02;
    //bubbles.push(b);
    //game.add.tween(b.body).to( { y: 0 }, 24*60*60, Phaser.Easing.Linear.None, true);
    //let tscale = Math.random(0.8) + 0.1;
    //game.add.tween(b.scale).to( { y: tscale, x : tscale }, 24*60*60, Phaser.Easing.Linear.None, true);
//}


function addBubble(content) {
    //console.log("create bubble from ", JSON.stringify(content));
    let b = new Bubble(game, content);
    bubbles.push(b);
}

var timerId = null;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#0072bc';
    //timerId = setInterval(addBubble, 3500);
}

function update () {
    for(let i = 0; i < bubbles.length; i++) {
        for(let j = i; j < bubbles.length; j++) {
            //console.log(JSON.stringify(bubbles[i].sprite));
            game.physics.arcade.collide(bubbles[i].sprite, bubbles[j].sprite, onCollide);
            
        }
    }
}

function onCollide(o1, o2) {
    o1.body.velocity.x = 0;
    o2.body.velocity.x = 0;
    if(o1.body.speed > o2.body.speed) {
        o2.body.velocity.y = -2;
    } else {
        o1.body.velocity.y = -2;
    }
}

function render () {

    for(b of bubbles) {
       // game.debug.body(b.sprite);
    }
}
