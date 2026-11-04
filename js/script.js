
// LittleCare — mobile nav, reveal, service filter, vaccine checker, booking, contact
document.addEventListener('DOMContentLoaded', function(){
  var hb = document.getElementById('hamburger'), nav = document.getElementById('nav');
  if (hb && nav) hb.addEventListener('click', function(){ nav.classList.toggle('open'); });
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('vis'); io.unobserve(e.target); } });
  }, {threshold: 0.12});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  var filters = document.querySelectorAll('#svcFilters button');
  filters.forEach(function(btn){
    btn.addEventListener('click', function(){
      filters.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-f');
      document.querySelectorAll('#svcGrid .svc-card').forEach(function(card){
        var ages = (card.getAttribute('data-age') || '').split(' ');
        card.style.display = (f === 'all' || ages.indexOf(f) !== -1) ? '' : 'none';
      });
    });
  });

  // Vaccine due-date checker (Pakistan routine EPI ages, in days)
  var SCHEDULE = [
    {age: 0,   label: 'At birth',  v: 'BCG, OPV-0'},
    {age: 42,  label: '6 weeks',   v: 'OPV-1, Pentavalent-1, PCV-1, Rotavirus-1'},
    {age: 70,  label: '10 weeks',  v: 'OPV-2, Pentavalent-2, PCV-2, Rotavirus-2'},
    {age: 98,  label: '14 weeks',  v: 'OPV-3, Pentavalent-3, PCV-3, Rotavirus-3'},
    {age: 274, label: '9 months',  v: 'Measles-1, Typhoid (TCV)'},
    {age: 456, label: '15 months', v: 'Measles-2'},
    {age: 1460,label: '4-5 years', v: 'DTaP / Td booster, OPV booster'}
  ];
  var vf = document.getElementById('vaxForm');
  if (vf) vf.addEventListener('submit', function(ev){
    ev.preventDefault();
    var dob = new Date(document.getElementById('dob').value);
    if (isNaN(dob)) return;
    var ageDays = Math.floor((Date.now() - dob.getTime()) / 86400000);
    var next = null, passed = [];
    SCHEDULE.forEach(function(s){
      if (ageDays >= s.age - 3) passed.push(s); else if (!next) next = s;
    });
    var out = document.getElementById('vaxResult');
    if (!next) {
      out.innerHTML = '<div class="due"><b>All routine childhood doses are complete!</b><br>Your child has passed every scheduled age. Keep the vaccination card safe, and ask at the next visit about any booster your doctor recommends.</div>';
    } else {
      var dueDate = new Date(dob.getTime() + next.age * 86400000);
      var ds = dueDate.toLocaleDateString('en-GB', {day:'numeric', month:'long', year:'numeric'});
      out.innerHTML = '<div class="due"><b>Next due: ' + next.label + ' — ' + next.v + '</b><br>Due around ' + ds + '. ' +
        (passed.length ? 'Already covered ages: ' + passed.map(function(s){ return s.label; }).join(', ') + '.' : 'This is the first scheduled visit.') +
        '<br><br><a class="btn btn-teal" href="booking.html?service=Vaccination">Book this vaccination &rarr;</a></div>';
    }
  });

  // Booking: prefill service from query string, generate reference + WhatsApp link
  var params = new URLSearchParams(window.location.search);
  var svc = params.get('service');
  var sel = document.getElementById('service');
  if (svc && sel) {
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].text.replace(/&/g, '&') === svc || sel.options[i].value === svc) sel.selectedIndex = i;
    }
    if (sel.selectedIndex === 0) {
      var opt = document.createElement('option'); opt.text = svc; opt.selected = true; sel.appendChild(opt);
    }
  }
  var bf = document.getElementById('bookForm');
  if (bf) bf.addEventListener('submit', function(ev){
    ev.preventDefault();
    var ref = 'LC-' + Math.floor(100000 + Math.random() * 900000);
    var msg = 'Hello LittleCare! I would like to book: ' + sel.value +
      ' for ' + document.getElementById('childName').value +
      ' (' + document.getElementById('childAge').value + ')' +
      ' on ' + document.getElementById('day').value +
      ' at ' + document.getElementById('slot').value +
      '. Language: ' + document.getElementById('lang').value +
      '. Reference: ' + ref;
    document.getElementById('bookResult').innerHTML =
      '<div class="ok"><h3>Booking ready!</h3><p>Your reference is <b>' + ref + '</b>.</p>' +
      '<p>Tap below to send it to the clinic on WhatsApp and confirm your visit.</p>' +
      '<p><a class="btn btn-teal" href="https://wa.me/923001234567?text=' + encodeURIComponent(msg) + '">Confirm on WhatsApp &rarr;</a></p></div>';
    document.getElementById('bookResult').scrollIntoView({behavior: 'smooth'});
  });

  var cf = document.getElementById('contactForm');
  if (cf) cf.addEventListener('submit', function(ev){
    ev.preventDefault();
    document.getElementById('contactResult').textContent = 'Thank you! Your message has been noted — the clinic replies on WhatsApp during clinic hours.';
    cf.reset();
  });
});
