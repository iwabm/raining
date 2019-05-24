var song;
var state = false;

function preload() {
  var context = new AudioContext();
  soundFormats('ogg', 'mp3');
  song = loadSound('sound/rain_road.mp3');
}

function setup() {

}

function sound_change() {
  // console.log(song.isPlaying());
  // var state = song.isPlaying();
  if ( state == true ) { // .isPlaying() returns a boolean
    document.getElementById("btn-sound").style.color = 'rgba(152, 152, 152, 0.43)';
    song.pause(); // .play() will resume from .pause() position
    // background(255,0,0);
    state = false;
  } else {
    document.getElementById("btn-sound").style.color = 'rgba(52, 252, 52, 0.95)';
    song.loop();
    state = true;
    // background(0,255,0);
  }
}
