/* ============================================================
   Hello at Work — domain routing
   Built by Hello Mental Health.

   What this does:
     A user types their work email. We look at the part after
     the "@", check it against APPROVED_DOMAINS, and forward
     them to their organization's portal.

     This is NOT real authentication. It's a directory lookup
     so partner-org staff land at the right place. Anyone can
     type any email — there is no password and no session check.

   How to add a partner organization later:
     Add a new entry to APPROVED_DOMAINS in the form
       'partner.org': 'https://their-portal.example.com/'
     The destination can be a relative path (same site) or a
     full URL (external site).
   ============================================================ */

(function () {
  'use strict';

  // --- Approved partner organizations and where to send them ---
  // Domains MUST be lowercase. Match is exact (no subdomain wildcarding).
  var APPROVED_DOMAINS = {
    'talberthouse.org': 'talberthouse/'
    // Add more partner orgs here as they come online, e.g.:
    // 'examplepartner.org': 'https://examplepartner-portal.example.com/'
  };

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('haw-form');
    var emailInput = document.getElementById('haw-email');
    var errorEl = document.getElementById('haw-error');
    var submitBtn = document.getElementById('haw-submit');

    if (!form || !emailInput || !errorEl) {
      // Markup missing; bail silently.
      return;
    }

    function showError(html) {
      errorEl.innerHTML = html;
      errorEl.classList.remove('is-hidden');
    }

    function clearError() {
      errorEl.innerHTML = '';
      errorEl.classList.add('is-hidden');
    }

    // Clear any error the moment the user starts editing again
    emailInput.addEventListener('input', clearError);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearError();

      var email = (emailInput.value || '').trim().toLowerCase();

      // 1. Format check
      if (!email) {
        showError('Please enter your work email.');
        emailInput.focus();
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('That doesn&rsquo;t look like a valid email address. Please double-check.');
        emailInput.focus();
        return;
      }

      // 2. Domain lookup
      var domain = email.split('@')[1];
      var destination = APPROVED_DOMAINS[domain];

      if (!destination) {
        showError(
          'We don&rsquo;t recognize <strong>' + escapeHtml(domain) + '</strong> yet &mdash; ' +
          'but we&rsquo;d love to. Hello at Work partners with organizations to bring ' +
          'their teams a thoughtfully curated mental-health resource library and ' +
          'trusted provider directory. If you&rsquo;d like to learn what that could ' +
          'look like for your team, reach out to ' +
          '<a href="mailto:welcome@hellomentalhealth.com">welcome@hellomentalhealth.com</a> ' +
          '&mdash; we&rsquo;d be glad to hear from you.'
        );
        emailInput.focus();
        emailInput.select();
        return;
      }

      // 3. Forward
      submitBtn.disabled = true;
      submitBtn.textContent = 'Taking you there…';
      setTimeout(function () {
        window.location.href = destination;
      }, 250);
    });
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
})();
