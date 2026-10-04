/* Travel globe. City assignments come from travel-albums.js captions and docs/india-media-update.md. */
(() => {
  'use strict';
  const sourceURL = document.currentScript.src;
  const asset = name => new URL(`vendor/travel-globe/${name}`, sourceURL).href;
  const mediaURL = path => new URL(path, sourceURL).href;
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function init() {
    const root = document.getElementById('travel-globe-section');
    if (!root || root.dataset.globeMounted) return;
    root.dataset.globeMounted = 'true';
    const albums = window.TRAVEL_ALBUMS || [];
    const album = id => albums.find(a => a.id === id);
    if (!albums.length) { root.textContent = 'Travel journals are temporarily unavailable.'; return; }
    const india = album('india');
    const places = [
      { id:'delhi', title:'Delhi', country:'India', lat:28.6139, lng:77.209, album:india, media:india.media.filter(m => m.caption.startsWith('Delhi')), film:india.film },
      { id:'agra', title:'Agra', country:'India', lat:27.1767, lng:78.0081, album:india, media:india.media.filter(m => m.caption.startsWith('Agra')) },
      { id:'jaipur', title:'Jaipur', country:'India', lat:26.9124, lng:75.7873, album:india, media:india.media.filter(m => m.caption.startsWith('Jaipur')) },
      { id:'tokyo', title:'Tokyo', country:'Japan', lat:35.6762, lng:139.6503, album:album('japan'), media:album('japan').media.filter(m => m.src.includes('tokyo-river')) },
      { id:'austin', title:'Austin', country:'United States', lat:30.2672, lng:-97.7431, album:album('austin'), media:album('austin').media },
      { id:'san-francisco', title:'San Francisco', country:'United States', lat:37.7749, lng:-122.4194, album:album('california'), media:album('california').media.filter(m => m.src.includes('waterfront')) }
    ];
    const collections = albums.map(a => ({id:`album-${a.id}`, title:a.title, country:'Photo journal', album:a, media:a.media, film:a.film}));
    const heading = el('div','tg-heading');
    heading.append(el('p','tg-eyebrow','A few places I’ve been'),el('h2','','Around the world, camera in hand.'),el('p','tg-intro','Pick a place. Explore the photographs and films that came home with me.'));
    root.append(heading);
    const layout = el('div','tg-layout'), mapPanel = el('div','tg-map-panel'), stage = el('div','tg-stage');
    const canvas = el('div','tg-canvas');
    canvas.setAttribute('aria-label','Interactive Earth globe. Drag to rotate; use the location buttons below for keyboard navigation.');
    const status = el('p','tg-status','Loading the globe…'); status.setAttribute('role','status');
    stage.append(canvas,status);
    const tools = el('div','tg-map-tools'); tools.setAttribute('aria-label','Globe controls');
    const zoomIn = el('button','','+'), zoomOut = el('button','','−'), reset = el('button','tg-reset','Reset view');
    zoomIn.setAttribute('aria-label','Zoom in'); zoomOut.setAttribute('aria-label','Zoom out');
    [zoomIn,zoomOut,reset].forEach(b => {b.type='button'; b.disabled=true; tools.append(b);});
    stage.append(tools);
    mapPanel.append(stage,el('p','tg-map-hint','Drag to explore · scroll or pinch to zoom · select a red pin'));
    const locations = el('div','tg-locations'); locations.setAttribute('role','group'); locations.setAttribute('aria-label','Explore a city');
    const cityButtons = new Map(), allButtons = new Map(), pinButtons = new Map();
    places.forEach(p => { const b=el('button','tg-place',p.title); b.type='button'; b.addEventListener('click',()=>select(p)); locations.append(b); cityButtons.set(p.id,b); allButtons.set(p.id,b); });
    mapPanel.append(locations);
    const gallery = el('div','tg-gallery'); gallery.setAttribute('aria-label','Selected travel media');
    layout.append(mapPanel,gallery); root.append(layout);
    const journals = el('div','tg-journals'); journals.append(el('p','tg-eyebrow','Or browse a whole trip'));
    const journalList = el('div','tg-journal-list'); journalList.setAttribute('role','group'); journalList.setAttribute('aria-label','Travel photo journals');
    collections.forEach(p => {const b=el('button','tg-journal',p.title); b.type='button'; b.addEventListener('click',()=>select(p)); allButtons.set(p.id,b); journalList.append(b);});
    journals.append(journalList); root.append(journals);
    let globe, selected=places[0], activeIndex=0, items=[], ready=false, inView=false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function pauseMedia() {gallery.querySelectorAll('video').forEach(v=>v.pause());}
    function renderMedia(index) {
      pauseMedia(); activeIndex=index;
      const viewer=gallery.querySelector('.tg-viewer'), caption=gallery.querySelector('.tg-caption');
      viewer.replaceChildren(); const item=items[index];
      if (item.type==='video') {
        const video=el('video','tg-full-media'); video.controls=true; video.playsInline=true; video.preload='none'; video.src=mediaURL(item.src); video.poster=mediaURL(item.poster); video.setAttribute('aria-label',item.title); viewer.append(video);
      } else {
        const img=el('img','tg-full-media'); img.src=mediaURL(item.src); img.alt=item.alt; img.width=item.width; img.height=item.height; img.decoding='async'; viewer.append(img);
      }
      caption.textContent=item.caption || item.title;
      gallery.querySelectorAll('.tg-thumb').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
      gallery.querySelector('.tg-count').textContent=`${index+1} / ${items.length}`;
    }
    function select(place) {
      pauseMedia(); selected=place; activeIndex=0;
      allButtons.forEach((b,id)=>b.setAttribute('aria-pressed',String(id===place.id)));
      pinButtons.forEach((b,id)=>b.setAttribute('aria-pressed',String(id===place.id)));
      items=[...(place.film?[{...place.film,type:'video'}]:[]),...place.media];
      gallery.replaceChildren();
      const top=el('div','tg-gallery-top'), title=el('div');
      title.append(el('p','tg-eyebrow',`${place.country} · ${place.album.year}`),el('h3','',place.title));
      top.append(title,el('span','tg-count')); gallery.append(top);
      const viewer=el('div','tg-viewer'); gallery.append(viewer);
      const caption=el('p','tg-caption'); caption.setAttribute('aria-live','polite'); gallery.append(caption);
      const strip=el('div','tg-thumbnails'); strip.setAttribute('role','group'); strip.setAttribute('aria-label',`${place.title} photographs and films`);
      items.forEach((item,i)=>{const b=el('button','tg-thumb'); b.type='button'; b.setAttribute('aria-label',item.type==='video'?`View film: ${item.title}`:`View photograph: ${item.caption}`); const img=el('img'); img.src=mediaURL(item.poster || item.src.replace('.webp','-640.webp')); img.alt=''; img.loading='lazy'; b.append(img); if(item.type==='video') b.append(el('span','tg-play','▶')); b.addEventListener('click',()=>renderMedia(i)); strip.append(b);});
      gallery.append(strip); renderMedia(0);
      if(globe && Number.isFinite(place.lat)) {globe.pointOfView({lat:place.lat,lng:place.lng,altitude:1.25},reduced?0:900); globe.pointRadius(p=>p.id === place.id ? .8 : .4);}
    }
    select(selected);
    function fail() {status.hidden=false; status.textContent='The 3D globe isn’t available here. Choose any city or trip below to explore.'; root.classList.add('tg-fallback'); [zoomIn,zoomOut,reset].forEach(b=>b.disabled=true);}
    async function start() {
      try {
        await new Promise((resolve,reject)=>{if(window.Globe){resolve();return;} const s=document.createElement('script');s.src=asset('globe.gl-2.45.0.min.js');s.onload=resolve;s.onerror=reject;document.head.append(s);});
        await new Promise((resolve,reject)=>{const texture=new Image();texture.onload=resolve;texture.onerror=reject;texture.src=asset('earth-blue-marble.jpg');});
        globe = new window.Globe(canvas,{animateIn:false,rendererConfig:{antialias:true,alpha:true}})
          .width(stage.clientWidth).height(stage.clientHeight).backgroundColor('rgba(0,0,0,0)')
          .globeImageUrl(asset('earth-blue-marble.jpg')).atmosphereColor('#82a9c4').atmosphereAltitude(.13)
          .pointsData(places).pointColor(()=> '#ff5e60').pointAltitude(.015).pointRadius(p=>p.id === selected.id ? .8 : .4).pointResolution(20)
          .pointsTransitionDuration(0).pointLabel(p=>`${p.title}, ${p.country}`).onPointClick(p=>select(p))
          .onPointHover(p=>{canvas.style.cursor=p?'pointer':'grab';})
          .htmlElementsData(places).htmlAltitude(.018).htmlElement(p=>{const b=el('button','tg-pin');b.type='button';b.title=`${p.title}, ${p.country}`;b.setAttribute('aria-label',`Explore ${p.title}, ${p.country}`);b.setAttribute('aria-pressed',String(p.id===selected.id));b.addEventListener('click',event=>{event.stopPropagation();select(p);});pinButtons.set(p.id,b);return b;})
          .onGlobeReady(()=>{globe.pointOfView({lat:Number.isFinite(selected.lat)?selected.lat:28.6139,lng:Number.isFinite(selected.lng)?selected.lng:77.209,altitude:1.35},0);ready=true;status.hidden=true;[zoomIn,zoomOut,reset].forEach(b=>b.disabled=false);if(!inView || document.hidden) globe.pauseAnimation();});
        globe.renderer().setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
        const controls=globe.controls(); controls.autoRotate=false; controls.enablePan=false; controls.minDistance=125; controls.maxDistance=650;
        globe.pointOfView({lat:28.6139,lng:77.209,altitude:1.35},0);
        if(selected.id!=='delhi' && Number.isFinite(selected.lat)) globe.pointOfView({lat:selected.lat,lng:selected.lng,altitude:1.25},0);
        const resize = new ResizeObserver(()=>{if(stage.clientWidth)globe.width(stage.clientWidth).height(stage.clientHeight);}); resize.observe(stage);
        canvas.querySelector('canvas').addEventListener('webglcontextlost',e=>{e.preventDefault();fail();});
        zoomIn.onclick=()=>zoom(.75); zoomOut.onclick=()=>zoom(1.25);
        reset.onclick=()=>globe.pointOfView({lat:28.6139,lng:77.209,altitude:1.35},reduced?0:650);
      } catch(error) {fail();console.warn('Travel globe unavailable:',error);}
    }
    function zoom(factor){if(globe){const p=globe.pointOfView();globe.pointOfView({...p,altitude:Math.max(.3,Math.min(4.5,p.altitude*factor))},reduced?0:250);}}
    let started=false;
    const visibility=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView&&!started){started=true;start();}if(globe&&ready){if(inView&&!document.hidden)globe.resumeAnimation();else globe.pauseAnimation();}if(!inView)pauseMedia();},{rootMargin:'120px'}); visibility.observe(root);
    document.addEventListener('visibilitychange',()=>{if(globe&&ready){if(document.hidden||!inView)globe.pauseAnimation();else globe.resumeAnimation();}if(document.hidden)pauseMedia();});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
