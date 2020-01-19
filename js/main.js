var game;
window.onload=function()
{
	var config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: 'phaser-game',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y:300 },
                debug: false
            }
        },
        scene: [SceneMain]
    };
    game = new Phaser.Game(config);
}