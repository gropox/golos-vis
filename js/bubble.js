

let maxRShares = 0;

class Bubble {
    constructor (game, content) {
        this.game = game;
        this.sprite = null;
        this.content = content;
        this.createBubble();
        this.tween = null;
        this.valid = true;
        this.rshares = 0;
    }
    
    get link() {
        return this.content.author + "/" + this.content.permlink;
    }
    
    createBubble() {
        this.sprite = game.add.sprite(400 + (Math.random() * 40) - 20, 540, 'bubble');
        this.game.physics.arcade.enable([this.sprite], Phaser.Physics.ARCADE);

        this.sprite.scale.setTo(0.1, 0.1);
        this.sprite.body.setCircle(40);
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.bounce.set(1, 0.1);
        this.sprite.body.gravity.y = -2;
        this.sprite.body.gravity.x = 0.0;
        this.sprite.body.velocity.y = -2;
        
        let currentTime = Date.parse(this.content.created);
        
        this.tween = game.add.tween(this.sprite.body).to( { y: 40 }, this.duration(currentTime), Phaser.Easing.Linear.None, true);
        
        this.update(this.content, currentTime);
    }

    duration(currentTime) {
        const VERYLONG = 10000000;
        const target = Date.parse(this.content.cashout_time);
        if(target < currentTime) {
            this.valid = false;
            return VERYLONG;
        }
        
        return 20000;
    }
    
    updateRShares() {
        this.rshares = 0;
        for(let vote of this.content.active_votes) {
            this.rshares += vote.rshares;
        }
        if(maxRShares < this.rshares) {
            maxRShares = this.rshares;
        }
        rescale();
    }
    
    updateSize() {
        
    }
    
    rescale() {
        let scale = 0.1 + 0.9 * this.rshares / maxRShares;
        this.sprite.setTo(scale);
    }
    
    update(content, currentTime) {
        this.content = content;
        //this.tween.updateTweenData("duration", this.duration(currentTime));
        this.updateSize();
    }
}


