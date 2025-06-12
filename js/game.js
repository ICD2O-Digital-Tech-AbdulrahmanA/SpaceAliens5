// This file is part of the  project
// Copyright (C) 2025 
// Made by Abdul
// this is the phaser 3 configuration file

/* global Phaser */

// import all game scenes
import SplashScene from './splashScene.js';
import TitleScene from './titleScene.js';
import MenuScene from './menuScene.js';
import GameScene from './gameScene.js';

// create new instances of each scene
const splashScene = new SplashScene();
const titleScene = new TitleScene();
const menuScene = new MenuScene();
const gameScene = new GameScene()

// main game configuration object
const config = {
    type: Phaser.AUTO,  // let phaser decide whether to use webgl or canvas
    width: 1920,        // game width in pixels
    height: 1080,       // game height in pixels
    physics: {
        default: 'arcade',    // using arcade physics system
        arcade: {
            debug: false      // disable physics debug mode
        }
    },
    backgroundColor: 0xffffff,    // white background color
    scale: {
        mode: Phaser.Scale.FIT,         // scale game to fit the window
        autoCenter: Phaser.Scale.CENTER_BOTH,    // center the game canvas
    },
}

// initialize the phaser game instance
const game = new Phaser.Game(config);

// add all scenes to the game
game.scene.add('splashScene', splashScene);
game.scene.add('titleScene', titleScene);
game.scene.add('menuScene', menuScene);
game.scene.add('gameScene', gameScene);

// start with the splash scene
game.scene.start('splashScene');
