namespace Sokoban {

	export class Preloader extends Phaser.State {

		preloadBar: Phaser.Sprite;
		background: Phaser.Sprite;
		ready: boolean = false;

		preload() {
            this.load.spritesheet('tiles', 'assets/tiles.png', 40, 40, 7);
		}

		create() {
            var level = [[1,1,1,1,1,1,1,1],
                         [1,0,0,1,1,1,1,1],
                         [1,0,0,1,1,1,1,1],
                         [1,0,0,0,0,0,0,1],
                         [1,1,4,2,1,3,0,1],
                         [1,0,0,0,1,0,0,1],
                         [1,0,0,0,1,1,1,1],
                         [1,1,1,1,1,1,1,1]];

            var newLevel = [
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,1],
                [1,0,1,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
                [1,0,1,2,2,2,1,0,3,3,3,3,3,3,3,3,0,1,0,1,0,0,1],
                [1,0,1,2,2,3,0,0,3,0,0,0,0,0,0,3,1,2,0,3,0,0,1],
                [1,0,1,0,0,0,1,0,0,0,3,3,3,3,3,3,2,1,0,1,0,0,1],
                [1,0,1,2,2,2,1,0,1,0,2,2,2,2,2,1,0,0,0,2,1,1,1],
                [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,0,0,1],
                [1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
            ];

            var simpleLevel = [
                [1,1,1,1,1,1,1],
                [1,2,0,3,0,2,1],
                [1,0,3,4,3,0,1],
                [1,2,0,3,0,2,1],
                [1,1,1,1,1,1,1]
            ];

            let level4String = "#######|#.   .#|# $@$ #|# ### #|# $ $ #|#.   .#|#######";

			this.game.state.start('Level', true, false, level4String);
		}
	}
}