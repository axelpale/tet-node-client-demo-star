var loadpics = require('./loadpics');
var rad2deg = require('./rad2deg');
var autofullcanvas = require('./autofullcanvas');
var io = require('socket.io-client');
var screenfull = require('screenfull');

var socket = io.connect('http://localhost:8888');

(function defineFullscreenSwitch() {
  var ui = document.getElementById('ui');
  var button = document.createElement('input');
  var enterMsg = 'Enter Full Screen';
  var exitMsg = 'Exit Full Screen';
  button.id = 'fullscreen-switch';
  button.type = 'button';
  button.value = enterMsg;
  button.addEventListener('click', function () {
    if (screenfull.enabled) {
      if (screenfull.isFullscreen) {
        screenfull.exit();
        button.value = enterMsg;
      } else {
        screenfull.request();
        button.value = exitMsg;
      }
    }
  });

  ui.appendChild(button);
}());

(function drawTest() {
  var canvas, stage;

  canvas = document.getElementById('myCanvas');
  // Make canvas resize automatically
  autofullcanvas(canvas);

  stage = new createjs.Stage(canvas);
  createjs.Ticker.addEventListener('tick', function (ev) {
    stage.update(ev);
  });

  (function defineCrosshair() {
    var cross = new createjs.Shape();
    stage.addChild(cross);

    socket.on('gazeUpdate', function (frame) {
      var x = frame.raw.x;
      var y = frame.raw.y;
      var r = 2000;

      cross.graphics.clear();
      cross.graphics
        .setStrokeStyle(1)
        .beginStroke('grey')
        .mt(x, y - r).lt(x, y + r)
        .mt(x - r, y).lt(x + r, y)
        .endStroke();
    });
  }());

  loadpics(['/star/img/star.png'], function (err, images) {
    if (err) { console.error(err); return; }
    var img, container, bitmap;

    img = images[0];
    container = new createjs.Container();
	  stage.addChild(container);
    bitmap = new createjs.Bitmap(images[0]);
		container.addChild(bitmap);

    bitmap.regX = img.width / 2;
    bitmap.regY = img.height / 2;
    bitmap.x = 10;
    bitmap.y = 10;
    bitmap.scaleX = 0.25;
    bitmap.scaleY = 0.25;

    // Spin
    var cx, cy, r, angularSpeed;
    cx = function () { return canvas.width / 2; }; // px
    cy = function () { return canvas.height / 2; }; // px
    r = function () { return canvas.height / 3; }; // px
    orbitalAngularSpeed = 0.001; // rad/ms
    selfAngularSpeed = -0.002; // rad/ms

    createjs.Ticker.addEventListener('tick', function (ev) {
      var dt = ev.delta;
      var t = ev.runTime;

      bitmap.x = cx() + r() * Math.cos(orbitalAngularSpeed * t);
      bitmap.y = cy() + r() * Math.sin(orbitalAngularSpeed * t);
      bitmap.rotation = rad2deg(selfAngularSpeed * t);
    });
  });

}(createjs));
