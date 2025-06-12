/* global phaser */
// Created by: abdul
// Created on: May 2025
// This is the Title scene for the game

/**
 * this class handles the title screen with game name display
 */
class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'titleScene' });

        // initialize scene variables and text style configuration
        this.titleSceneBackgroundImage = null
        this.titleSceneText = null
        this.titleSceneTextStyle = { font: '200px Times', fill: '#fde4b9', align: 'center' }
    }
  
    init (data) {
        // set the initial background color for the title screen
        this.cameras.main.setBackgroundColor("AEA04B");
    }
  
    preload() {
        // log scene entry and load the title screen background
        console.log('Title Scene');
        this.load.image('titleSceneBackground', 'assets/aliens_screen_image.jpg')
    }
  
    create(data) {
        // add and scale the background image at screen center
        this.titleSceneBackgroundImage = this.add.sprite(0, 0, 'titleSceneBackground').setScale(2.75)
        this.titleSceneBackgroundImage.x = 1920 / 2
        this.titleSceneBackgroundImage.y = 1080 / 2

        // create and position the game title text
        this.titleSceneText = this.add.text(1920 / 2, (1080 / 2) + 350, 'Space Blasters', this.titleSceneTextStyle).setOrigin(0.5)
    }
  
    update(time, delta) { 
        // automatically switch to menu scene after 6 seconds
        if (time > 6000) {
            this.scene.switch('menuScene');
        }
    }
}

export default TitleScene

