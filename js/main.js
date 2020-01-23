var game;
window.onload=function()
{
	var config = {
        type: Phaser.AUTO,
        width: 1333,
        height: 768,
        parent: 'phaser-game',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 1000 },
                debug: false

            }
        },
        scene: [SceneMain]
    };
    game = new Phaser.Game(config);
}