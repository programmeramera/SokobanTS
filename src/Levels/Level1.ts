module Sokoban {

    const EMPTY = 0;
    const WALL = 1;
    const SPOT = 2;
    const CRATE = 3;
    const PLAYER = 4;

    class Level extends Phaser.State {

        level: number[][];
        player: Player;
        playerMoving: Boolean;
        tileSize: number = 40;
        //undoArray: number[][][];
        crates: Phaser.Sprite[][];
        // Variables used to create groups. The fist group is called fixedGroup, it will contain
        // all non-moveable elements (everything but crates and player).
        // Then we add movingGroup which will contain moveable elements (crates and player)
        fixedGroup;
        movingGroup;

        create() {
            //this.undoArray = [];
            this.drawLevel();
        }

        // a tile is walkable when it's an empty tile or a spot tile
        isWalkable(posX: number, posY: number) {
		    return this.level[posY][posX] == EMPTY || this.level[posY][posX] == SPOT;
        }

        // a tile is a crate when it's a... guess what? crate, or it's a crate on its spot
        isCrate(posX: number, posY: number){
            return this.level[posY][posX] == CRATE || this.level[posY][posX] == CRATE+SPOT;	
        }

             // function to move the player
        move(deltaX: number, deltaY: number){
            // if destination tile is walkable...
            if(this.isWalkable(this.player.posX+deltaX,this.player.posY+deltaY)){
                // push current situation in the undo array
                //this.undoArray.push(this.copyArray(this.level));
                this.movePlayer(deltaX,deltaY);
                return;
            }
            // if the destination tile is a crate... 
            if(this.isCrate(this.player.posX + deltaX, this.player.posY + deltaY)){
                // ...if  after the create there's a walkable tils...
                if(this.isWalkable(this.player.posX + 2 * deltaX, this.player.posY + 2 * deltaY)) {
                    // push current situation in the undo array
                    //this.undoArray.push(this.copyArray(this.level));
                    // move the crate
                    this.moveCrate(deltaX,deltaY);			  
                    // move the player	
                    this.movePlayer(deltaX,deltaY);
                }
            }
        }

      	// function to move the crate
        moveCrate(deltaX: number,deltaY: number) {
            // moving with a 1/10s tween
            var crateTween = this.game.add.tween(this.crates[this.player.posY + deltaY][this.player.posX + deltaX]);
            crateTween.to({
                x: this.crates[this.player.posY + deltaY][this.player.posX + deltaX].x + deltaX * this.tileSize,
                y: this.crates[this.player.posY + deltaY][this.player.posX + deltaX].y + deltaY * this.tileSize,
            }, 100, Phaser.Easing.Linear.None,true);
            // updating crates array   
            this.crates[this.player.posY + 2 * deltaY][this.player.posX + 2 * deltaX] = this.crates[this.player.posY + deltaY][this.player.posX + deltaX];
            this.crates[this.player.posY + deltaY][this.player.posX + deltaX] = null;
            // updating crate old position in level array  
            this.level[this.player.posY + deltaY][this.player.posX + deltaX] -= CRATE;
            // updating crate new position in level array  
            this.level[this.player.posY + 2 * deltaY][this.player.posX + 2 * deltaX] += CRATE;
            // changing crate frame accordingly  
            this.crates[this.player.posY + 2 * deltaY][this.player.posX + 2 * deltaX].frame = this.level[this.player.posY + 2 * deltaY][this.player.posX + 2 * deltaX];
        }
        
        // need a recursive function to copy arrays, no need to reinvent the wheel so I got it here
        // http://stackoverflow.com/questions/10941695/copy-an-arbitrary-n-dimensional-array-in-javascript 
        copyArray(a){
            var newArray = a.slice(0);
                for(var i = newArray.length; i>0; i--){
                if(newArray[i] instanceof Array){
                    newArray[i] = this.copyArray(newArray[i]);	
                }
            }
            return newArray;
        }

        update() {
            if(!this.playerMoving) {   
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                    this.move(-1,0);                
                } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                    this.move(1,0);                
                } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                    this.move(0,1);                
                } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                    this.move(0,-1);                
                } 
                // else if(this.game.input.keyboard.isDown(Phaser.Keyboard.Z)){
                //     // if there's something to undo...
                //     if(this.undoArray.length > 0){
                //         // then undo! and remove the latest move from undoArray
                //         var undoLevel = this.undoArray.pop();
                //         this.fixedGroup.destroy();
                //         this.movingGroup.destroy();
                //         this.level = [];
                //         this.level = this.copyArray(undoLevel);
                //         this.drawLevel();
                //     }
                // }
            }
        }

        // function to move the player
        movePlayer(deltaX: number,deltaY: number){
            // now the player is moving
            this.playerMoving = true;
            // moving with a 1/10s tween
            var playerTween = this.game.add.tween(this.player);
            playerTween.to({
                x:this.player.x + deltaX * this.tileSize,
                y:this.player.y + deltaY * this.tileSize
            }, 100, Phaser.Easing.Linear.None,true);
            // setting a tween callback 
            playerTween.onComplete.add(function(){
                // now the player is not moving anymore
                this.playerMoving = false;
            }, this);
            // updating player old position in level array   
            this.level[this.player. posY][this.player.posX] - PLAYER;  
            // updating player custom posX and posY attributes
            this.player.posX+=deltaX;
            this.player.posY+=deltaY;
            // updating player new position in level array 
            this.level[this.player.posY][this.player.posX] += PLAYER;  
            // changing player frame accordingly  
            this.player.frame = this.level[this.player.posY][this.player.posX];
        }

        drawLevel(){  
            // empty crates array. Don't use crates = [] or it could mess with pointers
            this.crates = [];     
            // adding the two groups to the game
            this.fixedGroup = this.game.add.group();
            this.movingGroup = this.game.add.group();
            // variable used for tile creation
            var tile;
            // looping trough all level rows
            for(var i=0;i<this.level.length;i++){
                // creation of 2nd dimension of crates array
                this.crates[i]= [];
                 // looping through all level columns
                for(var j=0;j<this.level[i].length;j++){
                    // by default, there are no crates at current level position, so we set to null its
                    // array entry
                    this.crates[i][j] = null;
                    // what do we have at row j, col i?
                    switch(this.level[i][j]){
                        case PLAYER:
                        case PLAYER+SPOT:
                            // player creation
                            this.player = new Player(this.game, 40*j, 40*i);
                            // assigning the player the proper frame
                            this.player.frame = this.level[i][j];
                            // creation of two custom attributes to store player x and y position
                            this.player.posX = j;
                            this.player.posY = i;
                            // adding the player to movingGroup
                            this.movingGroup.add(this.player);
                            // since the player is on the floor, I am also creating the floor tile
                            tile = this.game.add.sprite(40*j,40*i,"tiles");
                            tile.frame = this.level[i][j]-PLAYER;
                            // floor does not move so I am adding it to fixedGroup
                            this.fixedGroup.add(tile);
                            break;
                        case CRATE:
                        case CRATE+SPOT:
                            // crate creation, both as a sprite and as a crates array item
                            this.crates[i][j] = this.game.add.sprite(40*j,40*i,"tiles");
                            // assigning the crate the proper frame
                            this.crates[i][j].frame = this.level[i][j];
                            // adding the crate to movingGroup
                            this.movingGroup.add(this.crates[i][j]);
                            // since the create is on the floor, I am also creating the floor tile
                            tile = this.game.add.sprite(40*j,40*i,"tiles");
                            tile.frame = this.level[i][j]-CRATE;
                            // floor does not move so I am adding it to fixedGroup
                            this.fixedGroup.add(tile);                              
                            break;
                        default:
                            // creation of a simple tile
                            tile = this.game.add.sprite(40*j,40*i,"tiles");
                            tile.frame = this.level[i][j];
                            this.fixedGroup.add(tile);
                        }
                    }
                }
            }
        }

	export class Level1 extends Level {    
        // background: Phaser.Sprite;
        // music: Phaser.Sound;
        
        create() {
            //this.player = new Player(this.game, 130, 284);
        
            this.level = [[1,1,1,1,1,1,1,1],
                          [1,0,0,1,1,1,1,1],
                          [1,0,0,1,1,1,1,1],
                          [1,0,0,0,0,0,0,1],
                          [1,1,4,2,1,3,0,1],
                          [1,0,0,0,1,0,0,1],
                          [1,0,0,0,1,1,1,1],
                          [1,1,1,1,1,1,1,1]];

            this.drawLevel();
        }
    }
}