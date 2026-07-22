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
  if(nav&&navCta&&!nav.querySelector('[data-location-jump]')){
    const headerLocation=document.createElement('button');
    headerLocation.className='header-location';
    headerLocation.type='button';
    headerLocation.dataset.locationJump='';
    headerLocation.innerHTML='<span class="header-location-label">Location</span><strong data-location-current>Bangalore</strong>';
    nav.insertBefore(headerLocation,navCta);
  }

  const heroIntro=document.querySelector('.hero-intro');
  if(heroIntro&&!document.querySelector('#location-selector')){
    const selector=document.createElement('div');
    selector.className='hero-location';
    selector.id='location-selector';
    selector.setAttribute('aria-label','Choose House of SARA location');
    selector.innerHTML=`
      <div class="hero-location-copy">
        <span>Choose your House</span>
        <strong data-location-current>Bangalore</strong>
      </div>
      <div class="location-options" role="group" aria-label="Locations">
        <button type="button" data-location="Bangalore" aria-pressed="true">Bangalore</button>
        <button type="button" data-location="Lavelam" aria-pressed="false">Lavelam</button>
      </div>`;
    heroIntro.insertAdjacentElement('afterend',selector);
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
    Lavelam:{eyebrow:'LAVELAM · DESTINATION EVENTS',footer:'Serving Lavelam and destination events'}
  };
  const locationButtons=[...document.querySelectorAll('[data-location]')];
  const currentLabels=[...document.querySelectorAll('[data-location-current]')];
  const eyebrow=document.querySelector('[data-location-eyebrow]');
  const footer=document.querySelector('[data-location-footer]');
  const hiddenInput=document.querySelector('[data-house-location-input]');
  const selector=document.querySelector('#location-selector');
  let selectedLocation='Bangalore';

  try{
    const saved=localStorage.getItem('houseOfSaraLocation');
    if(saved&&locations[saved])selectedLocation=saved;
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
    selector?.scrollIntoView({behavior:'smooth',block:'center'});
    window.setTimeout(()=>document.querySelector(`[data-location="${selectedLocation}"]`)?.focus(),550);
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
