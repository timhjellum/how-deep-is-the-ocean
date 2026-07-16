(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Marine snow generator ----
  document.querySelectorAll('.snow').forEach(function(container, zoneIndex){
    if(reduceMotion) return;
    var count = 14 + zoneIndex * 6;
    for(var i=0;i<count;i++){
      var s = document.createElement('span');
      var size = (Math.random()*2.4 + 0.6).toFixed(1);
      s.style.width = size+'px';
      s.style.height = size+'px';
      s.style.left = (Math.random()*100)+'%';
      s.style.opacity = (Math.random()*0.5+0.15).toFixed(2);
      var dur = (18 - zoneIndex*1.5) + Math.random()*10;
      s.style.animationDuration = dur+'s';
      s.style.animationDelay = (-Math.random()*dur)+'s';
      container.appendChild(s);
    }
  });

  // ---- Audio: synthesized sonar ping / ship horn / zone-click ----
  var soundOn = true;
  var audioCtx = null;
  var soundToggle = document.getElementById('sound-toggle');

  function ensureAudio(){
    if(!audioCtx){
      try{ audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }catch(e){ audioCtx = null; }
    } else if(audioCtx.state === 'suspended'){
      audioCtx.resume();
    }
  }
  ['pointerdown','touchstart','keydown'].forEach(function(evt){
    document.addEventListener(evt, ensureAudio, {passive:true});
  });
  window.addEventListener('scroll', ensureAudio, {passive:true, once:true});

  if(soundToggle){
    soundToggle.addEventListener('click', function(){
      soundOn = !soundOn;
      soundToggle.textContent = soundOn ? '🔊' : '🔇';
      soundToggle.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
      if(soundOn) ensureAudio();
    });
  }

  function playSonarPing(){
    if(!soundOn || !audioCtx) return;
    var now = audioCtx.currentTime;
    [0, 0.75].forEach(function(delay){
      var t = now + delay;
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1600, t);
      osc.frequency.exponentialRampToValueAtTime(820, t + 0.85);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.16, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 1.05);
    });
  }

  function playShipHorn(){
    if(!soundOn || !audioCtx) return;
    var now = audioCtx.currentTime;
    var osc1 = audioCtx.createOscillator();
    var osc2 = audioCtx.createOscillator();
    var filter = audioCtx.createBiquadFilter();
    var gain = audioCtx.createGain();
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(98, now);
    osc2.frequency.setValueAtTime(124, now);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.25);
    gain.gain.setValueAtTime(0.22, now + 1.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.1);
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain).connect(audioCtx.destination);
    osc1.start(now); osc2.start(now);
    osc1.stop(now + 2.2); osc2.stop(now + 2.2);
  }

  function playZoneClick(){
    if(!soundOn || !audioCtx) return;
    var now = audioCtx.currentTime;
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.06);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  function haptic(ms){
    if(navigator.vibrate){ navigator.vibrate(ms); }
  }

  // ---- Creature + landmark reveal on scroll ----
  var creatures = document.querySelectorAll('.creature, .landmark');
  var lastTriggered = {};
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('in');
        var id = e.target.id;
        var now = Date.now();
        if(id && (!lastTriggered[id] || now - lastTriggered[id] > 2500)){
          lastTriggered[id] = now;
          if(id === 'landmark-submarine'){ playSonarPing(); haptic([15,40,15]); }
          if(id === 'landmark-titanic'){ playShipHorn(); haptic(60); }
        }
      }
    });
  }, {threshold:0.4});
  creatures.forEach(function(c){ io.observe(c); });

  // ---- Mini-map: click to jump, scroll-spy to highlight ----
  var mmButtons = Array.from(document.querySelectorAll('#minimap button'));
  var mmZones = Array.from(document.querySelectorAll('.zone[data-mm]'));

  mmButtons.forEach(function(btn){
    btn.addEventListener('click', function(){
      var target = mmZones.find(function(z){ return z.dataset.mm === btn.dataset.target; });
      if(target){ target.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block:'start'}); }
    });
  });

  function updateMinimap(){
    var vh = window.innerHeight;
    var centerY = window.scrollY + vh*0.4;
    var activeMm = mmZones[0] ? mmZones[0].dataset.mm : null;
    mmZones.forEach(function(z){
      if(centerY >= z.offsetTop){ activeMm = z.dataset.mm; }
    });
    if(activeMm !== updateMinimap.current){
      if(updateMinimap.current !== undefined){
        playZoneClick();
        haptic(25);
      }
      updateMinimap.current = activeMm;
    }
    mmButtons.forEach(function(btn){
      btn.classList.toggle('active', btn.dataset.target === activeMm);
    });
  }

  // ---- Depth gauge ----
  var zones = Array.from(document.querySelectorAll('.zone'));
  var depthEl = document.getElementById('depth-m');
  var depthFtEl = document.getElementById('depth-ft');
  var zoneLabelEl = document.getElementById('zone-label');
  var atmEl = document.getElementById('atm-val');
  var marker = document.getElementById('marker');

  function lerp(a,b,t){ return a + (b-a)*t; }

  function update(){
    var vh = window.innerHeight;
    var scrollCenter = window.scrollY + vh*0.4;
    var current = null, progress = 0;

    for(var i=0;i<zones.length;i++){
      var z = zones[i];
      var top = z.offsetTop;
      var bottom = top + z.offsetHeight;
      if(scrollCenter >= top && scrollCenter <= bottom){
        current = z;
        progress = (scrollCenter - top) / (bottom - top);
        break;
      }
    }

    if(!current){
      if(scrollCenter < zones[0].offsetTop){
        depthEl.textContent = '0 m';
        depthFtEl.textContent = '0 ft';
        zoneLabelEl.textContent = 'Surface';
        atmEl.textContent = '1.0 atm';
        marker.style.top = '0%';
      } else {
        var last = zones[zones.length-1];
        depthEl.textContent = '10,935 m';
        depthFtEl.textContent = '35,876 ft';
        zoneLabelEl.textContent = last.dataset.zone.split('—')[0].trim();
        atmEl.textContent = '1,086 atm';
        marker.style.top = '100%';
      }
      return;
    }

    progress = Math.min(Math.max(progress,0),1);
    var min = parseFloat(current.dataset.min);
    var max = parseFloat(current.dataset.max);
    var atmMin = parseFloat(current.dataset.atmMin);
    var atmMax = parseFloat(current.dataset.atmMax);
    var depth = lerp(min, max, progress);
    var atm = lerp(atmMin, atmMax, progress);

    depthEl.textContent = Math.round(depth).toLocaleString() + ' m';
    depthFtEl.textContent = Math.round(depth*3.281).toLocaleString() + ' ft';
    zoneLabelEl.textContent = current.dataset.zone.split('—')[0].trim();
    atmEl.textContent = atm.toFixed(1) + ' atm';

    var overallMin = 0, overallMax = 10935;
    var overallProgress = (depth - overallMin)/(overallMax-overallMin);
    marker.style.top = (overallProgress*100).toFixed(2)+'%';
  }

  function updateAll(){ update(); updateMinimap(); }
  window.addEventListener('scroll', updateAll, {passive:true});
  window.addEventListener('resize', updateAll);
  updateAll();
})();