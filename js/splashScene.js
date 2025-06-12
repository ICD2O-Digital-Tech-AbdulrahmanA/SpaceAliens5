/* global phaser */
// Created by: abdul
// Created on: May 2025
// This is the splash scene for the game

/**
 * this class handles the splash screen that appears when the game starts
 */
class SplashScene extends Phaser.Scene {
    constructor() {
        super({ key: 'splashScene' });
    }
  
    init (data) {
        // set the initial white background color
        this.cameras.main.setBackgroundColor("ffffff");
    }
  
    preload() {
        // log scene entry and load the splash screen image
        console.log('Splash Scene')
        this.load.image('splashSceneBackground', './assets/splashSceneImage.png');
    }
  
    create(data) {
        // create and position the splash image at the center of screen
        this.splashSceneBackgroundImage = this.add.sprite(0, 0, 'splashSceneBackground')
        this.splashSceneBackgroundImage.x = 1920 / 2
        this.splashSceneBackgroundImage.y = 1080 / 2
    }
  
    update(time, delta) {
        // automatically switch to title scene after 3 seconds
        if (time > 3000) {
            this.scene.switch('titleScene');
        }
    }
}

export default SplashScene