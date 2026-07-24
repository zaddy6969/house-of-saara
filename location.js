(()=>{
  const styleHref='location.css';
  if(!document.querySelector(`link[href="${styleHref}"]`)){
    const style=document.createElement('link');
    style.rel='stylesheet';
    style.href=styleHref;
    document.head.appendChild(style);
  }

  const nav=document.querySelector('[data-nav]');
  const navCta=nav?.querySelector('.nav-cta');
  if(nav&&navCta&&!nav.querySelector('.header-location-switch')){
    const selector=document.createElement('div');
    selector.className='header-location-switch';
    selector.setAttribute('role','group');
    selector.setAttribute('aria-label','Choose service location');
    selector.innerHTML=`
      <span class="header-location-title">Location</span>
      <div class="header-location-options">
        <button type="button" data-location="Bangalore" aria-pressed="true">BANGALORE</button>
        <button type="button" data-location="Lonavala" aria-pressed="false">LONAVALA</button>
      </div>`;
    nav.insertBefore(selector,navCta);
  }

  const heroEyebrow=document.querySelector('.hero .eyebrow.light');
  if(heroEyebrow)heroEyebrow.dataset.locationEyebrow='';

  const form=document.querySelector('#event-form');
  if(form&&!form.querySelector('[data-house-location-input]')){
    const selectedHouse=document.createElement('div');
    selectedHouse.className='selected-house';
    selectedHouse.innerHTML=`
      <div class="selected-house-copy">
        <span>Preferred House</span>
        <strong data-location-current>Bangalore</strong>
      </div>
      <button type="button" data-location-jump>Change location</button>
      <input type="hidden" name="houseLocation" value="Bangalore" data-house-location-input>`;
    form.insertAdjacentElement('afterbegin',selectedHouse);
  }

  const footerLocation=document.querySelector('.footer-bottom span:first-child');
  if(footerLocation)footerLocation.dataset.locationFooter='';

  const locations={
    Bangalore:{eyebrow:'BANGALORE · DESTINATION EVENTS',footer:'Serving Bangalore and destination events'},
    Lonavala:{eyebrow:'LONAVALA · DESTINATION EVENTS',footer:'Serving Lonavala and destination events'}
  };

  const metaDescription=document.querySelector('meta[name="description"]');
  if(metaDescription){
    metaDescription.content=metaDescription.content.replace(/Lavelam/gi,'Lonavala');
  }

  const locationButtons=[...document.querySelectorAll('[data-location]')];
  const currentLabels=[...document.querySelectorAll('[data-location-current]')];
  const eyebrow=document.querySelector('[data-location-eyebrow]');
  const footer=document.querySelector('[data-location-footer]');
  const hiddenInput=document.querySelector('[data-house-location-input]');
  const headerSelector=document.querySelector('.header-location-switch');
  let selectedLocation='Bangalore';

  try{
    const saved=localStorage.getItem('houseOfSaraLocation');
    if(saved==='Lavelam')selectedLocation='Lonavala';
    else if(saved&&locations[saved])selectedLocation=saved;
  }catch{}

  function animateLabel(element){
    element.classList.remove('location-change');
    void element.offsetWidth;
    element.classList.add('location-change');
  }

  function applyLocation(location,persist=true){
    if(!locations[location])return;
    selectedLocation=location;
    locationButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.location===location)));
    currentLabels.forEach(label=>{
      label.textContent=location;
      animateLabel(label);
    });
    if(eyebrow){
      eyebrow.textContent=locations[location].eyebrow;
      animateLabel(eyebrow);
    }
    if(footer){
      footer.textContent=locations[location].footer;
      animateLabel(footer);
    }
    if(hiddenInput)hiddenInput.value=location;
    document.documentElement.dataset.houseLocation=location.toLowerCase();
    if(persist){
      try{localStorage.setItem('houseOfSaraLocation',location)}catch{}
    }
  }

  locationButtons.forEach(button=>button.addEventListener('click',()=>applyLocation(button.dataset.location)));

  document.querySelectorAll('[data-location-jump]').forEach(button=>button.addEventListener('click',()=>{
    document.body.classList.remove('nav-open');
    document.querySelector('[data-menu-toggle]')?.setAttribute('aria-expanded','false');
    headerSelector?.scrollIntoView({behavior:'smooth',block:'start'});
    window.setTimeout(()=>document.querySelector(`[data-location="${selectedLocation}"]`)?.focus(),450);
  }));

  form?.addEventListener('submit',()=>{
    const output=document.querySelector('#brief-output');
    if(!output?.textContent)return;
    const lines=output.textContent.split('\n');
    const existingIndex=lines.findIndex(line=>line.startsWith('Preferred House:'));
    if(existingIndex>=0)lines.splice(existingIndex,1);
    const occasionIndex=lines.findIndex(line=>line.startsWith('Occasion:'));
    lines.splice(occasionIndex>=0?occasionIndex+1:2,0,`Preferred House: ${selectedLocation}`);
    output.textContent=lines.join('\n');
  });

  applyLocation(selectedLocation,false);
})();
