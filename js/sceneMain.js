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

    //load spider - for tween
    this.load.spritesheet("spider", "images/spider.png", {
      frameWidth: 64,
      frameHeight: 64
    });
  }

  create() {
    //display background and set its left top corner in the browser's corner
    this.add.image(0, 0, "background").setOrigin(0, 0);

    //bottom floor
    const platforms = this.physics.add.staticGroup();
    for (let a=0; a<=1333; a+=200) {
      platforms.create(a+30, game.config.height-10, 'floor')
    }
    //additional platforms
    platforms.create(200, 560, 'floor');

    //play the sound
    this.music = this.sound.add('music');
    this.music.play();
    this.walkSound = this.sound.add('walk');

    //Listen to keys
    window.cursors = this.input.keyboard.createCursorKeys();

    //add sprite and make it available for game physics engine
    this.dracula = this.physics.add.sprite(0, game.config.height - 80, "dracula");
    //dracula won't come outside screen
    this.dracula.setCollideWorldBounds(true);

    //spider is a tween but must be added to physics for collision detection
    this.spider = this.physics.add.sprite(200, 600, "spider");
    const spiderWalk = this.anims.generateFrameNumbers("spider");

    //gravity has no effect on spider
    this.spider.body.setGravityY(-game.config.physics.arcade.gravity.y);
    
    this.physics.add.collider(this.dracula, platforms);

    //this detects when Dracula touches enemy (this.spider)
    // this.physics.add.overlap(this.dracula, this.spider, enemyTouched, null, this);
    this.physics.add.collider(this.dracula, this.spider, enemyTouched, null, this);

    const draculaWalk = this.anims.generateFrameNumbers("dracula"); //this generates frames from sprite sheet

    //add this after all the sprites, tweens and backgrounds have been loaded to scale to the screen
    // console.log(this.add.displayList)
    // const thisXratio = window.innerWidth/1920;
    // const thisYratio = window.innerHeight/1080;
    //this.add.displayList.list.forEach(el => {
     // console.log(el)
      // el.scaleX = thisXratio;
      // el.scaleY = thisYratio;
      // el.setDisplaySize(thisXratio, thisYratio);
    //})
    this.anims.create({
      key: "walk",
      frames: draculaWalk,
      frameRate: 10, //speed
      repeat: -1 //infinite movement
    });

    this.anims.create({
      key: "spiderWalk",
      frames: spiderWalk,
      frameRate: 6, //speed
      repeat: -1 //infinite movement
    });
    this.spider.play("spiderWalk");
    this.tweens.add({
      targets: this.spider,
      duration: 800,
      x: 200,
      y: game.config.height-40,
      yoyo: true,
      repeat: -1
    });

    //console.log(this.tweens, this.add.displayList)

    //method that runs when dracula touches enemies
    function enemyTouched(player, enemy) {
      //console.log(enemy)
      this.physics.pause();
      player.setTint(0xff0000);
      setTimeout(() => {
        player.clearTint()
        player.x = 0;
        player.y = game.config.height - 80;
        this.physics.resume();
      }, 1000)
      
    }
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
    if (cursors.space.isDown && this.dracula.body.touching.down) {
      this.dracula.setVelocityY(-400);
    }
  }
}