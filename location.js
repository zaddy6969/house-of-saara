(()=>{
  const styleHref='location.css';
  if(!document.querySelector(`link[href="${styleHref}"]`)){
    const style=document.createElement('link');
    style.rel='stylesheet';
    style.href=styleHref;
    document.head.appendChild(style);
  }

  const phone='918105812327';
  const email='houseofsara001@gmail.com';
  const genericMessage='Hello House of SARA, I would like to enquire about catering for an event.';
  const genericWhatsApp=`https://wa.me/${phone}?text=${encodeURIComponent(genericMessage)}`;
  const genericEmail=`mailto:${email}?subject=${encodeURIComponent('Catering enquiry — House of SARA')}&body=${encodeURIComponent(genericMessage)}`;

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

  const footerElement=document.querySelector('.site-footer');
  if(footerElement&&!footerElement.classList.contains('footer-refined')){
    footerElement.classList.add('footer-refined');
    footerElement.innerHTML=`
      <div class="footer-main">
        <div class="footer-about">
          <div class="footer-brand">
            <span class="brand-mark" aria-hidden="true">S</span>
            <div><strong>HOUSE OF SARA</strong><small>CURATED CATERING</small></div>
          </div>
          <p>Considered menus and gracious service for weddings, private celebrations and corporate gatherings.</p>
          <div class="footer-current-house">
            <span>Current House</span>
            <strong data-location-current>Bangalore</strong>
          </div>
        </div>

        <div class="footer-column">
          <p class="footer-label">Explore</p>
          <a href="#story">Our story</a>
          <a href="#occasions">Occasions</a>
          <a href="#menu">Menus</a>
          <a href="#process">Our process</a>
        </div>

        <div class="footer-column footer-enquire">
          <p class="footer-label">Reservations</p>
          <h3>Let us plan your table.</h3>
          <a class="footer-contact-link" href="${genericWhatsApp}" target="_blank" rel="noopener noreferrer">
            <span>WhatsApp</span><strong>8105812327</strong>
          </a>
          <a class="footer-contact-link" href="${genericEmail}">
            <span>Email</span><strong>${email}</strong>
          </a>
          <button class="footer-reserve-button" type="button" data-open-reservation>Start a reservation</button>
        </div>
      </div>
      <div class="footer-bottom">
        <span data-location-footer>Serving Bangalore and destination events</span>
        <span>© <span data-year>${new Date().getFullYear()}</span> House of SARA</span>
      </div>`;
  }

  const planner=document.querySelector('#planner');
  const plannerIntro=planner?.querySelector('.planner-intro');
  const briefCard=document.querySelector('#brief-card');
  let reservationDialog=document.querySelector('#reservation-dialog');

  if(planner&&plannerIntro&&form&&!reservationDialog){
    plannerIntro.classList.remove('reveal');
    form.classList.remove('reveal');

    reservationDialog=document.createElement('dialog');
    reservationDialog.className='reservation-dialog';
    reservationDialog.id='reservation-dialog';
    reservationDialog.setAttribute('aria-labelledby','planner-title');

    const shell=document.createElement('div');
    shell.className='reservation-shell';
    const closeButton=document.createElement('button');
    closeButton.type='button';
    closeButton.className='reservation-close';
    closeButton.dataset.closeReservation='';
    closeButton.setAttribute('aria-label','Close reservation form');
    closeButton.textContent='×';

    shell.append(plannerIntro,form);
    reservationDialog.append(closeButton,shell);
    document.body.appendChild(reservationDialog);
    if(briefCard)document.body.appendChild(briefCard);

    planner.className='reservation-cta-section';
    planner.innerHTML=`
      <div class="reservation-cta-copy">
        <p class="eyebrow">PLAN YOUR GATHERING</p>
        <h2>A memorable table begins with a few details.</h2>
        <p>Share your occasion, guest count and preferred House. We will prepare the enquiry for WhatsApp or email.</p>
      </div>
      <div class="reservation-cta-actions">
        <button class="button button-saffron" type="button" data-open-reservation>Make a reservation</button>
        <a class="text-link" href="${genericWhatsApp}" target="_blank" rel="noopener noreferrer">WhatsApp directly <span aria-hidden="true">↗</span></a>
      </div>`;
  }

  const locations={
    Bangalore:{eyebrow:'BANGALORE · DESTINATION EVENTS',footer:'Serving Bangalore and destination events'},
    Lonavala:{eyebrow:'LONAVALA · DESTINATION EVENTS',footer:'Serving Lonavala and destination events'}
  };

  const metaDescription=document.querySelector('meta[name="description"]');
  if(metaDescription)metaDescription.content=metaDescription.content.replace(/Lavelam/gi,'Lonavala');

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

  function openReservation(event){
    event?.preventDefault();
    document.body.classList.remove('nav-open');
    document.querySelector('[data-menu-toggle]')?.setAttribute('aria-expanded','false');
    if(!reservationDialog)return;
    if(!reservationDialog.open)reservationDialog.showModal();
    document.body.classList.add('dialog-open');
    window.setTimeout(()=>reservationDialog.querySelector('select,input,textarea,button')?.focus(),80);
  }

  function closeReservation(){
    if(reservationDialog?.open)reservationDialog.close();
  }

  document.querySelectorAll('a[href="#planner"],[data-open-reservation]').forEach(trigger=>trigger.addEventListener('click',openReservation));
  reservationDialog?.querySelector('[data-close-reservation]')?.addEventListener('click',closeReservation);
  reservationDialog?.addEventListener('click',event=>{
    if(event.target===reservationDialog)closeReservation();
  });
  reservationDialog?.addEventListener('close',()=>{
    if(briefCard&&!briefCard.hidden)document.body.classList.add('dialog-open');
    else document.body.classList.remove('dialog-open');
  });

  locationButtons.forEach(button=>button.addEventListener('click',()=>applyLocation(button.dataset.location)));

  document.querySelectorAll('[data-location-jump]').forEach(button=>button.addEventListener('click',()=>{
    closeReservation();
    document.body.classList.remove('nav-open');
    const menuToggle=document.querySelector('[data-menu-toggle]');
    menuToggle?.setAttribute('aria-expanded','false');
    if(window.matchMedia('(max-width:900px)').matches){
      document.body.classList.add('nav-open');
      menuToggle?.setAttribute('aria-expanded','true');
    }
    headerSelector?.scrollIntoView({behavior:'smooth',block:'start'});
    window.setTimeout(()=>document.querySelector(`[data-location="${selectedLocation}"]`)?.focus(),450);
  }));

  form?.addEventListener('submit',()=>{
    const output=document.querySelector('#brief-output');
    if(output?.textContent){
      const lines=output.textContent.split('\n');
      const existingIndex=lines.findIndex(line=>line.startsWith('Preferred House:'));
      if(existingIndex>=0)lines.splice(existingIndex,1);
      const occasionIndex=lines.findIndex(line=>line.startsWith('Occasion:'));
      lines.splice(occasionIndex>=0?occasionIndex+1:2,0,`Preferred House: ${selectedLocation}`);
      output.textContent=lines.join('\n');
    }
    window.setTimeout(closeReservation,40);
  });

  applyLocation(selectedLocation,false);
})();