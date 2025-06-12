/* global phaser */
// game scene that handles the main gameplay
// created by: abdul
// created on: may 2025

class GameScene extends Phaser.Scene {
    // constructor sets up initial game properties
    constructor() {
        super({ key: 'gameScene' })

        // initialize game objects as null
        this.background = null
        this.ship = null
        
        // game state flags
        this.fireMissile = false
        this.isGameOver = false
        this.score = 0
        
        // text style settings
        this.scoreText = null
        this.scoreTextStyle = { font: '65px Arial', fill: '#ffffff', align: 'center' }
        this.gameOverText = null
        this.gameOverTextStyle = { font: '65px Arial', fill: '#ff0000', align: 'center' }

        // power up tracking
        this.powerUpSpawned = false
        this.powerUp2Spawned = false
        this.hasShield = false
        this.hasMissileBuff = false
        this.currentAlienCount = 0
    }

    // set background color for the scene
    init(data) {
        this.cameras.main.setBackgroundColor("AEA04B")
    }

    // load all game assets
    preload() {
        console.log('Game Scene')

        // load images
        this.load.image('starBackground', 'assets/starBackground.png')
        this.load.image('ship', 'assets/spaceShip.png')
        this.load.image('missile', 'assets/missile.png')
        this.load.image('alien', 'assets/alien.png')
        this.load.image('explosion', 'assets/explosion.png')
        this.load.image('powerUp', 'assets/powerUp.png')
        this.load.image('powerUp2', 'assets/powerUp2.png')
        this.load.image('shield', 'assets/shield.png')

        // load sound effects
        this.load.audio('laser', 'assets/laser1.wav')
        this.load.audio('explosion', 'assets/barrelExploding.wav')
        this.load.audio('bomb', 'assets/bomb.wav')
    }

    // create game objects and set up collisions
    create(data) {
        // reset game state
        this.fireMissile = false
        this.isGameOver = false
        this.score = 0

        // create game objects
        this.background = this.add.image(0, 0, 'starBackground').setScale(2.0)
        this.background.setOrigin(0, 0)
        this.scoreText = this.add.text(10, 10, 'Score: ' + this.score.toString(), this.scoreTextStyle)
        
        // create player ship and groups
        this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, 'ship')
        this.missileGroup = this.physics.add.group()
        this.alienGroup = this.add.group()
        this.powerUpGroup = this.physics.add.group()
        this.powerUp2Group = this.physics.add.group()
        
        // create first alien and shield
        this.createAlien()
        this.shield = this.add.image(this.ship.x, this.ship.y, 'shield').setScale(0.12)
        this.shield.setVisible(false)

        // handle missile hitting alien
        this.physics.add.overlap(this.missileGroup, this.alienGroup, function (missileCollide, alienCollide) {
            // create explosion effect
            const explosion = this.add.sprite(alienCollide.x, alienCollide.y, 'explosion')
                                .setScale(0.2)
            
            // remove explosion after delay
            this.time.delayedCall(100, function() {
                explosion.destroy()
            }, [], this)
            
            // update game state
            alienCollide.destroy()
            this.currentAlienCount--
            missileCollide.destroy()
            this.score = this.score + 1
            this.scoreText.setText('Score: ' + this.score.toString())
            this.sound.play('explosion')

            // spawn power ups at certain scores
            if (this.score === 15 || this.score === 30 || this.score === 45 || 
                this.score === 60 || this.score === 75 || this.score === 90 || 
                this.score === 105 && !this.powerUpSpawned) {
                const powerUp = this.physics.add.sprite(
                    Phaser.Math.Between(100, 1820),
                    Phaser.Math.Between(100, 900),
                    'powerUp'
                )
                this.powerUpGroup.add(powerUp)
                this.powerUpSpawned = true
            }

            // spawn second power up at score 50
            if (this.score === 50 && !this.powerUp2Spawned) {
                const powerUp2 = this.physics.add.sprite(
                    Phaser.Math.Between(100, 1820),
                    Phaser.Math.Between(100, 900),
                    'powerUp2'
                ).setScale(0.5)
                this.powerUp2Group.add(powerUp2)
                this.powerUp2Spawned = true
            }

            // spawn new aliens
            this.createAlien()
            this.createAlien()
        }.bind(this))

        // handle ship colliding with aliens
        this.physics.add.collider(this.ship, this.alienGroup, function (shipCollide, alienCollide) {
            if (this.hasShield) {
                // shield blocks the hit
                const explosion = this.add.sprite(alienCollide.x, alienCollide.y, 'explosion').setScale(0.2)
                
                this.time.delayedCall(200, function() {
                    explosion.destroy()
                }, [], this)
                
                alienCollide.destroy()
                this.currentAlienCount--
                this.shield.setVisible(false)
                this.hasShield = false
                return
            }

            // game over when hit without shield
            this.sound.play('bomb')
            this.physics.pause()
            alienCollide.destroy()
            shipCollide.destroy()
            this.isGameOver = true
            this.gameOverText = this.add.text(1920 / 2, 1080 / 2, 'Game Over!\nClick to play again.', this.gameOverTextStyle).setOrigin(0.5)
            this.gameOverText.setInteractive({ useHandCursor: true })
            this.gameOverText.on('pointerdown', () => this.scene.start('gameScene'))
        }.bind(this))

        // handle power up collection
        this.physics.add.overlap(this.ship, this.powerUpGroup, this.collectPowerUp, null, this)
        this.physics.add.overlap(this.ship, this.powerUp2Group, this.collectPowerUp2, null, this)
    }

    // collect shield power up
    collectPowerUp(ship, powerUp) {
        powerUp.destroy()
        console.log('Power-up collected! Shield activated.')
        this.shield.setVisible(true)
        this.hasShield = true
    }

    // collect missile size power up
    collectPowerUp2(ship, powerUp2) {
        powerUp2.destroy()
        console.log('Power-up 2 collected! Permanent missile buff activated!')
        this.hasMissileBuff = true
    }

    // update game state each frame
    update(time, delta) {
        // stop updates if game is over
        if (this.isGameOver) {
            return
        }

        // handle keyboard input
        const keyLeftObj = this.input.keyboard.addKey('LEFT')
        const keyRightObj = this.input.keyboard.addKey('RIGHT')
        const keyUpObj = this.input.keyboard.addKey('UP')
        const keyDownObj = this.input.keyboard.addKey('DOWN')
        const keySpaceObj = this.input.keyboard.addKey('SPACE')

        // move ship up
        if (keyUpObj.isDown === true) {
            this.ship.y -= 15
            if (this.ship.y < 0) {
                this.ship.y = 1080
            }
        }

        // move ship down
        if (keyDownObj.isDown === true) {
            this.ship.y += 15
            if (this.ship.y > 1080) {
                this.ship.y = 0
            }
        }

        // move ship left
        if (keyLeftObj.isDown === true) {
            this.ship.x -= 15
            if (this.ship.x < 0) {
                this.ship.x = 1920
            }
        }
        
        // move ship right
        if (keyRightObj.isDown === true) {
            this.ship.x += 15
            if (this.ship.x > 1920) {
                this.ship.x = 0
            }
        }

        // fire missiles
        if (keySpaceObj.isDown === true && !this.isGameOver) {
            if (this.fireMissile === false) {
                this.fireMissile = true
                const aNewMissile = this.physics.add.sprite(this.ship.x, this.ship.y, 'missile')
                if (this.hasMissileBuff) {
                    aNewMissile.setScale(4.0)
                }
                this.missileGroup.add(aNewMissile)
                this.sound.play('laser')
            }
        }

        // reset missile fire state
        if (keySpaceObj.isUp === true) {
            this.fireMissile = false
        }

        // update missiles
        this.missileGroup.children.each(function (item) {
            item.y = item.y - 15
            if (item.y < 0) {
                item.destroy()
            }
        })

        // update shield position
        if (this.shield.visible) {
            this.shield.x = this.ship.x
            this.shield.y = this.ship.y
        }

        // wrap aliens at screen bottom
        this.alienGroup.children.each(function (alien) {
            if (alien.y > 1080) {
                alien.y = 0
            }
        }, this)
    }
}

export default GameScene
