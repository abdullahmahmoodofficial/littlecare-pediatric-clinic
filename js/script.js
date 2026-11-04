document.addEventListener('DOMContentLoaded', function() {
  var booking = document.getElementById('booking-form');
  if (booking) {
    booking.addEventListener('submit', function(event) {
      event.preventDefault();
      document.getElementById('booking-message').textContent = 'Thank you! Your appointment request has been received. We will confirm it shortly.';
    });
  }
  var contact = document.getElementById('contact-form');
  if (contact) {
    contact.addEventListener('submit', function(event) {
      event.preventDefault();
      document.getElementById('contact-message').textContent = 'Thank you for your message. We will reply soon.';
    });
  }
});
