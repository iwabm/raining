var zone, city,country,song,video;
var weatherURL,cityURL,songURL,youtubeURL;

var lon = getRandomInt2(15, 120);
var lon2 = lon+5;
zone = lon+',35,'+lon2+',40,10'
weatherURL = 'https://api.openweathermap.org/data/2.5/box/city?bbox=' + zone + '&appid=f6748bf5cbca6df7965ee552869cc300';
// $.fakeLoader();

const getParam = url => {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.responseType = 'json'
    req.open('GET', url, true)
    req.setRequestHeader('Accept', 'application/json')
    req.addEventListener('load', (e) => {
      if (req.status === 200) {
        resolve(req.response)
      } else {
        reject(req.statusText)
      }
    })
    req.send()
  })
};

const playyoutube = video => {
  return new Promise((resolve, reject) => {
    console.log(video)
    var url = '<iframe id="ytplayer" width="560" height="315" src="http://www.youtube.com/embed/' + video + '" frameborder="0" allow="autoplay;picture-in-picture" allowfullscreen></iframe>'
  // console.log(url)
    document.getElementById("player").innerHTML = url;
    if(video != null){
      resolve(console.log("success"))
    } else {
      reject(console.log("err"))
    }
  })
};

function search(){
  document.getElementById("btn-real").disabled = true;
  document.getElementById("btn-real").style.color = 'rgba(52, 52, 252, 0.95)';
  fadeIn(document.getElementById("loader"), 1000);
  document.getElementById("loader").style.display = 'block';
  fadeIn(document.getElementById("loading_text"), 2000);
  document.getElementById("loading_text").style.display = 'block';
  document.getElementById("info").style.display = 'none';
  document.getElementById("about").style.display = 'none';
  document.getElementById("player").style.display = 'none';
  if(document.getElementById("ytplayer")){
    var x = document.getElementById("ytplayer");
    x.remove(x.selectedIndex);
  }
  sleep(4000).then(function(){
    document.getElementById("loader").style.display = 'none';
    document.getElementById("loading_text").style.display = 'none';
    fadeIn(document.getElementById("info"), 1000);
    document.getElementById("info").style.display = 'block';
    sleep(2000).then(function(){
      fadeIn(document.getElementById("player"), 500);
      document.getElementById("player").style.display = 'block';
      document.getElementById("btn-real").disabled = false;
      document.getElementById("btn-real").style.color = 'rgba(152, 152, 152, 0.43)';
    });
  });

  getParam(weatherURL)
  .then(res => {
    // console.log(res)
    var weather = [];
    var city = [];
    var random_city;
    var j = 0;
    for(var i=0;i<res.list.length;i++){
      weather[i] = res.list[i].weather[0].main;
      if(weather[i]=="Rain"){
        city[j] = res.list[i].name;
        j++;
      }
    }
    random_city = city[getRandomInt(city.length)]
    console.log(random_city)
    var html = '<span>' + random_city + '</span>'
    document.getElementById("info").innerHTML = html;
    cityURL = "http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=5&offset=0&namePrefix="+ random_city;
    return getParam(cityURL)
  })
  .then(res => {
    // console.log(res)
    if(res.data.length != 0){
      country = res.data[0].country
    } else {
      console.log("cannot get Country")
      html = '<span> is raining now, but we cannot specify the country name. Please try again.</span>';
      document.getElementById("info").insertAdjacentHTML("beforeend", html);
      document.getElementById("btn-real").disabled = false;
      return console.log("err1")
    }

    if(country == "People's Republic of China"){
      country = "China";
    } else if(country == "South Korea"){
      country = "Korea, Republic of";
    } else if(country == "United States of America"){
      country = "United States";
    }

    var html = '<span>, ' + country + ' is raining now.</span>'
    document.getElementById("info").insertAdjacentHTML('beforeend', html);

    songURL = "http://ws.audioscrobbler.com/2.0/?method=geo.getTopTracks&country="+country+"&api_key=f9cb39ef274c20dc022d3c7f20a708a8&format=json&limit=10";
    console.log(country)
    return getParam(songURL)
  })
  .then(res => {
    console.log(res)
    if(res['error'] == 6){
      console.log("cannot get Popular song")
      html = '<span><br>But we cannot specify the popular song of this country. Please try again.</span>';
      document.getElementById("info").insertAdjacentHTML("beforeend", html);
      document.getElementById("btn-real").disabled = false;
      return console.log("err2")
    }
    song = res.tracks.track[getRandomInt(10)].name
    console.log(song)
    youtubeURL = "https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&q=" + song + "&key=AIzaSyCnS5dJOFnDtIibR_lJxCGplkQZ1VIcqLs";
    return getParam(youtubeURL)
  })
  .then(res => {
    // console.log(res)
    video = res.items[0].id.videoId
    var html = '<br><span>Here is a latest popular song in this country.</span>';
    document.getElementById("info").insertAdjacentHTML('beforeend', html);
    // console.log(video)
    return playyoutube(video)
  })
  .catch(err => {
    console.log("cannot get Country")
    document.getElementById("btn-real").disabled = false;
    // var html = '<span>Sorry, we cannot load the data. Please try again.</span>'
    // document.getElementById("info").insertAdjacentHTML('beforeend', html);
    console.log("err")
  });
}

function about() {
  document.getElementById("loader").style.display = 'none';
  document.getElementById("info").style.display = 'none';
  fadeIn(document.getElementById("about"), 1000);
  document.getElementById("about").style.display = 'block';
  document.getElementById("player").style.display = 'none';
}

function sleep (time) {
  return new Promise(function (resolve, reject) {
    window.setTimeout(resolve, time);
  });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function getRandomInt2(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

var state = false;

function sound_change() {
  var x = document.getElementById("myAudio");
  if (state == false){
    document.getElementById("btn-sound").style.color = 'rgba(52, 252, 52, 0.95)';
    x.play();
    x.loop = true;
    state = true;
  } else {
    document.getElementById("btn-sound").style.color = 'rgba(152, 152, 152, 0.43)';
    x.pause();
    state = false;
  }
}

// Fade-In
var fadeIn = function(element, time, callback) {
    var fadeTime     = (time) ? time : 400,
        keyFrame     = 30,
        stepTime     = fadeTime / keyFrame,
        maxOpacity   = 1,
        stepOpacity  = maxOpacity / keyFrame,
        opacityValue = 0,
        sId          = '';

    if (!element) return;

    if (element.getAttribute('data-fade-stock-display') !== undefined &&
        element.getAttribute('data-fade-stock-display') !== null) {
        element.style.display = element.getAttribute('data-fade-stock-display');
    }

    var setOpacity = function(setNumber) {
        if ('opacity' in element.style) {
            element.style.opacity = setNumber;
        } else {
            element.style.filter = 'alpha(opacity=' + (setNumber * 100) + ')';

            if (navigator.userAgent.toLowerCase().match(/msie/) &&
                !window.opera && !element.currentStyle.hasLayout) {
                element.style.zoom = 1;
            }
        }
    };

    if (!callback || typeof callback !== 'function') {
        callback = function() {};
    }

    setOpacity(0);

    sId = setInterval(function() {
        opacityValue = Number((opacityValue + stepOpacity).toFixed(12));

        if (opacityValue > maxOpacity) {
            opacityValue = maxOpacity;
            clearInterval(sId);
        }

        setOpacity(opacityValue);

        if (opacityValue === maxOpacity) {
            callback();
        }
    }, stepTime);

    return element;
};

// Fade-Out
var fadeOut = function(element, time, callback) {
    var fadeTime     = (time) ? time : 400,
        keyFrame     = 30,
        stepTime     = fadeTime / keyFrame,
        minOpacity   = 0,
        stepOpacity  = 1 / keyFrame,
        opacityValue = 1,
        sId          = '';

    if (!element) return;

    element.setAttribute('data-fade-stock-display', element.style.display.replace('none', ''));

    var setOpacity = function(setNumber) {
        if ('opacity' in element.style) {
            element.style.opacity = setNumber;
        } else {
            element.style.filter = 'alpha(opacity=' + (setNumber * 100) + ')';

            if (navigator.userAgent.toLowerCase().match(/msie/) &&
                !window.opera && !element.currentStyle.hasLayout) {
                element.style.zoom = 1;
            }
        }
    };

    if (!callback || typeof callback !== 'function') {
        callback = function() {};
    }

    setOpacity(1);

    sId = setInterval(function() {
        opacityValue = Number((opacityValue - stepOpacity).toFixed(12));

        if (opacityValue < minOpacity) {
            opacityValue = minOpacity;
            element.style.display = 'none';
            clearInterval(sId);
        }

        setOpacity(opacityValue);

        if (opacityValue === minOpacity) {
            callback();
        }
    }, stepTime);

    return element;
};
