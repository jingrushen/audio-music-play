var Tick = {
  countTicks: 360,
  tickLen: 15,
  PI: 360,
  padding: 50,
  maxRadius: 350,
  minRadius: 250,
  firstRender: true,
  worker: new Worker('js/worker.js'),
  init () {
    this.canvas = document.querySelector('.canvas')
    this.ctx = this.canvas.getContext('2d')
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.lineCanvas = document.querySelector('.linecanvas')
    this.lineCtx = this.lineCanvas.getContext('2d');
    this.rx = this.width / 2
    this.ry = this.height / 2
    this.radius = this.width / 3
    this.cacheCanvas = document.createElement('canvas');
    this.cacheCtx = this.cacheCanvas.getContext('2d');
    this.cacheCanvas.width = this.width;
    this.cacheCanvas.height = this.height;
    this.cacheCtx.lineWidth = 2;
    this.reset()
  },
  renderInnerCircle () {
    this.r = (this.width - this.padding * 2) / 3
    this.lineCtx.lineWidth = 1
    this.lineCtx.beginPath()
    this.lineCtx.strokeStyle = '#722423'
    this.lineCtx.arc(this.width / 2, this.height / 2, this.r, 0, 2 * Math.PI)
    this.lineCtx.stroke()
    this.lineCtx.closePath()
  },
  renderTick () {
    this.clear();
    this.ctx.drawImage(this.cacheCanvas, 0, 0, this.width, this.height);
  },
  renderTime (time) {
    let deg = time / this.duration * this.PI
    let a = Math.PI * deg / 180
    this.ctx.fillStyle = '#722423'
    this.ctx.beginPath()
    this.ctx.arc(this.rx + this.r * Math.cos(a), this.ry + this.r * Math.sin(a), 10, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.closePath()
    this.ctx.beginPath()
    this.ctx.strokeStyle = '#722423';
    this.ctx.lineWidth = 5
    this.ctx.arc(this.rx, this.ry, this.r, 0, a)
    this.ctx.stroke()
    this.ctx.closePath()
  },
  // 通过改变this.radius
  getTicksPostion () {
    let _t = this;
    this.worker.postMessage({
      currData: this.currData,
      countTicks: this.countTicks,
      maxRadius: this.maxRadius,
      minRadius: this.minRadius,
      rx: this.rx,
      ry: this.ry,
      tickLen: this.tickLen
    })

    let scale = findMax(this.currData) / 240 || 1
    if (scale > 1) {
      this.canvas.style.transform = `scale(${scale})`
      this.lineCanvas.style.transform = `scale(${scale})`
    } else {
      this.canvas.style.transform = `scale(1)`
      this.lineCanvas.style.transform = `scale(1)`
    }
    return new Promise((resolve, reject) => {
      _t.worker.onmessage = function (event) {
        resolve(event.data)
      }
    })
    // let ticks = []
    // let radius
    // let scale = findMax(this.currData) / 240 || 1
    // for (let i = 0, len = this.countTicks, angle = 0; i < len; i++) {
    //   radius = Math.max(Math.min(this.currData[i + 100] + 150, this.maxRadius), this.minRadius)
    //   let tick = {}
    //   tick.x1 = this.rx + radius * Math.cos(angle)
    //   tick.y1 = this.ry + radius * Math.sin(angle)
    //   tick.x2 = this.rx + (this.radius - this.tickLen) * Math.cos(angle)
    //   tick.y2 = this.ry + (this.radius - this.tickLen) * Math.sin(angle)
    //   ticks.push(tick)
    //   angle += Math.PI / 180
    //   if (scale > 1) {
    //     this.canvas.style.transform = `scale(${scale})`
    //     this.lineCanvas.style.transform = `scale(${scale})`
    //   } else {
    //     this.canvas.style.transform = `scale(1)`
    //     this.lineCanvas.style.transform = `scale(1)`
    //   }
    // }
    // return ticks
  },
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  },
  render () {
    if (this.firstRender) {
      this.duration = MusicPlayer.source.buffer.duration;
      this.perdeg = this.duration / this.PI
      this.firstRender = false;
    }
    this.cache()
  },
  reset () {
    this.currData = Array(2048).fill(0)
    this.clear()
    this.renderInnerCircle()
    this.cache()
  },
  cache () {
    let _t = this;
    _t.cacheCtx.clearRect(0, 0, _t.width, _t.height);
    this.getTicksPostion().then((data) => {
      let ticks = data;
      for (let i = 0, len = ticks.length; i < len; i++) {
        _t.cacheCtx.beginPath()
        let gradient = _t.cacheCtx.createLinearGradient(ticks[i].x1, ticks[i].y1, ticks[i].x2, ticks[i].y2)
        gradient.addColorStop(0, '#F5F5F5')
        gradient.addColorStop(0.4, '#ab8674')
        gradient.addColorStop(1, '#722423')
        _t.cacheCtx.strokeStyle = gradient
        _t.cacheCtx.moveTo(ticks[i].x1, ticks[i].y1)
        _t.cacheCtx.lineTo(ticks[i].x2, ticks[i].y2)
        _t.cacheCtx.stroke()
        _t.cacheCtx.closePath()
      }
      _t.renderTick()
      _t.renderTime(_t.Time);
    })
  }
}
var SONGS = [
  {
    artist: 'Michael',
    name: 'Stone Cold Funk',
    url: 'http://m10.music.126.net/20180615111927/1f7d0d15914ddf59b1f3c44fe3b8822a/ymusic/ed49/d613/d738/86559a80228670dcc0c89a3997fd836a.mp3'
  },
  {
    artist: 'GRANiDELiA',
    name: '极乐净土',
    url: 'http://m10.music.126.net/20180615110735/814dc0559e55fbd37806b7b387cd65fd/ymusic/db40/34e5/08d0/2b87dad647d73fe4250167be43baf514.mp3'
  },
  {
    artist: 'Audio Machine',
    name: 'Breath and Life',
    url: 'http://m10.music.126.net/20180615011439/fe628bf2199d8203641c5a7d4e501408/ymusic/18ba/7e9f/69fd/75f095ea5e4031ec40a8f7b16e39ba81.mp3'
  }
]
var MusicPlayer = {
  i: 1,
  currentSongIndex: 1,
  duration: 0,
  drawcaf: null,
  firstStart: true,
  hasGain: true,
  FADE_TIME: 10,
  initFlag: {
    disabled: false,    
    tip: document.querySelector('.tip-show'),
    show() {
      this.tip.innerHTML = '资源还在加载中，请等等~';
      Control.op.classList.add('disabled');
      this.tip.classList.remove('hide');
      this.tip.classList.add('show');
      this.disabled = true;
    },
    hide() {
      Control.op.classList.remove('disabled');
      this.tip.innerHTML = '资源加载成功，可以播放了~';
      this.disabled = false;
      setTimeout(() => {
        this.tip.classList.remove('show');
        this.tip.classList.add('hide');
      }, 1000);
    }
  },
  init () {
    this.initFlag.show()
    let _t = this;
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    this.ctx = new AudioContext()
    this.ctx.suspend && this.ctx.suspend();
    this.first = true;
    this.analyser = this.ctx.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.6;
    this.analyser.fftSize = 2048
    this.source = this.ctx.createBufferSource();
    this.loadMusic(this.currentSongIndex);
    this.gainNode = this.ctx.createGain();
    this.source.connect(this.gainNode);
    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
    if (this.firstStart) {
      this.event()
      Tick.init()
      Control.init()
      this.firstStart = false;
    }
  },
  initData() {
    Tick.currData = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(Tick.currData);
  },
  loadMusic (index) {
    let _t = this;
    let xhr = new XMLHttpRequest();
    let song = SONGS[index];
    xhr.open('GET', song.url, true);
    xhr.responseType = 'arraybuffer';
    this.ctx.source = null;
    xhr.onload = function () {
      _t.ctx.decodeAudioData(xhr.response, function (buffer) {
        _t.source.buffer = buffer;
        _t.initFlag.hide();
        _t.initInfo()
      })
    }
    xhr.onerror = function () {
      _t.next()
    }
    xhr.send()
  },
  event () {
    let _t = this;
    this.source.addEventListener('ended', function () {
      Control.next.click()
    })
  },
  play () {
    this.ctx.resume && this.ctx.resume();
    if (this.first) {
      this.source.start();
      this.first = false;
    }
    this.draw()
  },
  pause() {
    this.ctx.suspend();
    window.cancelAnimationFrame(this.drawcaf);
  },
  stop () {
    this.ctx.currentTime = 0;
    this.ctx.suspend();
  },
  mute () {
    this.hasGain = false;
    this.gainNode.gain.value = 0;
  },
  unmute () {
    this.hasGain = true;
    this.gainNode.gain.value = 1;
  },
  switchGain () {
    this.hasGain ? this.mute() : this.unmute()
  },
  restart () {
    this.first = true;
    Tick.firstRender = true;
    this.pause()
  },
  next () {
    this.i++;
    if (this.i >= SONGS.length) {
      this.i = 0
    }
    this.currentSongIndex = this.i;
  },
  prev (){
    this.i--;
    if (this.i <= -1) {
      this.i = SONGS.length - 1;
    }
    this.currentSongIndex = this.i;
  },
  selectSong (i) {
    this.currentSongIndex = i;
  },
  reset () {
    this.stop();
    this.restart();
    this.source = null;
    this.init();
  },
  draw () {
    this.initData();
    Tick.Time = this.ctx.currentTime;
    Control.update(Tick.Time);
    Tick.render();
    this.drawcaf = window.requestAnimationFrame(() => {
      this.draw()
    })
  },
  initInfo () {
    Control.artistName.innerHTML = SONGS[this.currentSongIndex].artist;
    Control.songName.innerHTML = SONGS[this.currentSongIndex].name;
    $(Control.songList).find('svg').removeClass('fa-spin');
    $(Control.songList).find('li').eq(this.currentSongIndex).addClass('playing-active').siblings().removeClass('playing-active')
    $(Control.songList).find('li').eq(this.currentSongIndex).find('svg').addClass('fa-spin');
  }
}
var Control = {
  container: document.querySelector('.container'),
  op: document.querySelector('.play-pause'),
  currTime: document.querySelector('.curr-time'),
  artistName: document.querySelector('.artist-name'),
  songName: document.querySelector('.song-name'),
  next: document.querySelector('.next'),
  prev: document.querySelector('.prev'),
  songList: document.querySelector('.song-list'),
  volume: document.querySelector('.volume'),
  init () {
    let _t = this
    this.op.addEventListener('click', function () {
      if (MusicPlayer.initFlag.disabled) {
        return;
      }
      _t.toggleClass('active')
    })
    this.next.addEventListener('click', function () {
      _t.nextSong()
    })
    this.prev.addEventListener('click', function () {
      _t.prevSong()
    })
    $(Control.songList).on('click', 'li', function () {
      let index = $(this).index()
      _t.shiftSong(index);
    })
    this.volume.addEventListener('click', function () {
      let show = $(this).find('.hide').siblings()
      $(this).find('.hide').removeClass('hide')
      show.addClass('hide')
      MusicPlayer.switchGain()
    })
  },
  toggleClass (classname) {
    if (hasClass(this.op, classname)) {
      this.op.classList.remove(classname)
      MusicPlayer.pause()
    } else {
      this.op.classList.add(classname)
      MusicPlayer.play()
    }
  },
  update(time) {
    this.currTime.innerHTML = formatTime(time)
  },
  reset () {
    this.currTime.innerHTML = '00:00'
    this.op.classList.remove('active')
  },
  nextSong () {
    MusicPlayer.next();
    MusicPlayer.reset();
    Tick.reset();
    this.reset();
  },
  prevSong () {
    MusicPlayer.prev();
    MusicPlayer.reset();
    Tick.reset();
    this.reset();
  },
  shiftSong (i) {
    MusicPlayer.selectSong(i)
    MusicPlayer.reset();
    Tick.reset();
    this.reset();
  }
}
var BackGround = {
  bg: document.querySelector('.bg-canvas'),
  init () {
    this.width = window.innerWidth,
    this.height = window.innerHeight,
    this.ctx = this.bg.getContext('2d'),
    this.bg.width = this.width
    this.bg.height = this.height
    let gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height)
    gradient.addColorStop(0, '#8d574e')
    gradient.addColorStop(1, 'rgba(110, 25, 14, 0.5)')
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.width, this.height)
    this.ctx.fill()
  }
}

function formatData(arr) {
  return arr.map((item) => {
    return item + 100
  })
}
function findMax(arr) {
  if (!arr.length) {
    return
  }
  return arr.reduce((a, b) => {
    return Math.max(a,b)
  })
}
function getRandom (min, max) {
  return Math.random() * (max - min) + min | 0
}
function hasClass (el, classname) {
  let classNames = el.className.split(/\s+/)
  return classNames.some((item) => {
    if (item === classname) {
      return true
    }
  })
}
function formatTime(time) {
  let s = parseInt(time) % 60 | 0
  let m = parseInt(time) / 60 | 0
  return `${addZero(m)}:${addZero(s)}`
}
function addZero(num) {
  if (num < 10) {
    num = '0' + num
  }
  return num;
}

MusicPlayer.init()
BackGround.init()