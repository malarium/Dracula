class SceneMain extends Phaser.Scene {
  constructor() {
    super("SceneMain");
  }
  preload() {
    //load background
    this.load.image("background", "images/wall.jpg");

    //load platforms
    this.load.image('floor', 'images/floor.png');

    //load sounds
    this.load.audio("walk", "sounds/walk.mp3");
    this.load.audio("music", "sounds/music2.mp3");

    //load our images
    this.load.spritesheet("dracula", "images/DracSlim.png", {
      frameWidth: 36,
      frameHeight: 56
    });
  }

  create() {
    //display background and set its left top corner in the browser's corner
    this.add.image(0, 0, "background").setOrigin(0, 0);

    const platforms = this.physics.add.staticGroup();
    for (let a=0; a<=1333; a+=200) {
      platforms.create(a+30, game.config.height-10, 'floor')
    }
    // platforms.create(100, game.config.height-40, 'floor');
    // platforms.create(50, 250, 'floor');
    // platforms.create(750, 220, 'floor');
    // platforms.create(300, game.config.height-40, 'floor');
    // platforms.create(500, game.config.height-63, 'floor');
    // platforms.create(700, game.config.height-86, 'floor');




    //play the sound
    this.music = this.sound.add('music');
    this.music.play();
    this.walkSound = this.sound.add('walk');

    //Listen to keys
    window.cursors = this.input.keyboard.createCursorKeys();

    //set main camera
    const camera = this.cameras.main;
    //set background color with camera
    camera.setBackgroundColor("rgba(240, 125, 255, 1)");

    //add sprite and make it available for game physics engine
    this.dracula = this.physics.add.sprite(0, 0, "dracula");
    this.dracula.setBounce(.1);
    //dracula won't come outside screen
    this.dracula.setCollideWorldBounds(true);
    
    
    // this.dracula.body.setGravityY(1000);
    this.physics.add.collider(this.dracula, platforms);

    const draculaWalk = this.anims.generateFrameNumbers("dracula"); //this generates frames from sprite sheet

    //add this after all the sprites, tweens and backgrounds have been loaded to scale to the screen
    // console.log(this.add.displayList)
    // const thisXratio = window.innerWidth/1920;
    // const thisYratio = window.innerHeight/1080;
    // this.add.displayList.list.forEach(el => {
    //   el.scaleX = thisXratio;
    //   el.scaleY = thisYratio;
    //   // el.setDisplaySize(thisXratio, thisYratio);
    // })

    this.anims.create({
      key: "walk",
      frames: draculaWalk,
      frameRate: 10, //speed
      repeat: -1 //infinite movement
    });
  }
    

  update() {
    if(!this.music.isPlaying) {
      this.music.play();
    }

    if (cursors.right.isDown || cursors.left.isDown) {
      if(!this.walkSound.isPlaying) {
        this.walkSound.play();
      } 
      if(cursors.right.isDown) {
          this.dracula.flipX ? this.dracula.flipX = false : null;
          this.dracula.anims.play("walk", true);
          // this.dracula.body.x += 3;
          this.dracula.setVelocityX(150);

        } else {
          this.dracula.flipX ? null : this.dracula.flipX = true;
          this.dracula.anims.play("walk", true);
          // this.dracula.body.x -= 3;
          this.dracula.setVelocityX(-150);
        }
    } else {
      this.walkSound.stop();
      this.dracula.anims.stop("walk", true);
      this.dracula.setVelocityX(0);
    }
    console.log()
    if (cursors.space.isDown && this.dracula.body.touching.down) {
      this.dracula.setVelocityY(-400);
    }
  }
}