/* ============================================================
   Hello at Work — domain routing
   Built by Hello Mental Health.

   What this does:
     A user types their work email. We look at the part after
     the "@", check it against APPROVED_DOMAINS, and forward
     them to their organization's portal — unless that portal
     is flagged `comingSoon: true`, in which case we show a
     friendly "almost ready" notice instead.

     This is NOT real authentication. It's a directory lookup
     so partner-org staff land at the right place. Anyone can
     type any email — there is no password and no session check.

   How to add a partner organization later:
     Add a new entry to APPROVED_DOMAINS like:
       'partner.org': {
         destination: 'https://their-portal.example.com/',
         portalName: 'Partner Org staff resource library',
         comingSoon: false
       }

   How to launch a portal that's currently flagged comingSoon:
     Flip its `comingSoon` value to `false`. That's it — one
     line change. Domain-based routing resumes immediately.

   How to preview a comingSoon portal before launch:
     Add the previewer's email to PREVIEW_EMAILS below.
     Those specific emails always bypass the comingSoon block.
   ============================================================ */

(function () {
  'use strict';

  // --- Approved partner organizations and where to send them ---
  // Domains MUST be lowercase. Match is exact (no subdomain wildcarding).
  // Each entry is an object so we can attach status flags.
  var APPROVED_DOMAINS = {
    'talberthouse.org': {
      destination: 'talberthouse/',
      portalName: 'Talbert House staff resource library',
      comingSoon: true   // flip to false when ready to go live
    }
    // Add more partner orgs here as they come online, e.g.:
    // 'examplepartner.org': {
    //   destination: 'https://examplepartner-portal.example.com/',
    //   portalName: 'Example Partner staff resource library',
    //   comingSoon: false
    // }
  };

  // --- Preview emails — bypass any comingSoon block ---
  // Specific email addresses that should always be routed to their
  // mapped destination, regardless of whether that portal is flagged
  // `comingSoon: true`. Used so the team can verify the live deployed
  // experience before public launch. Lowercase match, exact email.
  var PREVIEW_EMAILS = {
    'bailey@hellomentalhealth.com':  'talberthouse/',
    'welcome@hellomentalhealth.com': 'talberthouse/'
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

      // 2. Preview-email check — these always bypass any comingSoon
      //    block, so the team can verify the deployed experience
      //    before public launch.
      var previewDestination = PREVIEW_EMAILS[email];
      if (previewDestination) {
        forwardTo(previewDestination);
        return;
      }

      // 3. Domain lookup
      var domain = email.split('@')[1];
      var match = APPROVED_DOMAINS[domain];

      if (!match) {
        showError(
          '<p>We don&rsquo;t recognize <strong>' + escapeHtml(domain) + '</strong> yet ' +
          '&mdash; but we&rsquo;d love to.</p>' +
          '<p>Hello at Work brings a thoughtfully curated mental-health resource library ' +
          'and trusted provider directory to organizations that want to support their teams.</p>' +
          '<p>Curious what that could look like for yours? Reach out to ' +
          '<a href="mailto:welcome@hellomentalhealth.com">welcome@hellomentalhealth.com</a> ' +
          '&mdash; we&rsquo;d be glad to hear from you.</p>'
        );
        emailInput.focus();
        emailInput.select();
        return;
      }

      // 4. Coming-soon check — recognized domain, but the portal
      //    isn't live yet. Show a friendly "almost ready" notice
      //    rather than redirecting to a half-finished destination.
      if (match.comingSoon) {
        showError(
          '<p>The <strong>' + escapeHtml(match.portalName) + '</strong> is almost ready ' +
          '&mdash; we&rsquo;re putting the finishing touches on it now.</p>' +
          '<p>Your HR team will let you know the moment it&rsquo;s live.</p>' +
          '<p>Questions in the meantime? Reach out to ' +
          '<a href="mailto:welcome@hellomentalhealth.com">welcome@hellomentalhealth.com</a>.</p>'
        );
        emailInput.focus();
        emailInput.select();
        return;
      }

      // 5. Forward
      forwardTo(match.destination);
    });

    // Shared redirect helper. Disables the button and gives the user
    // a moment of "we heard you" feedback before navigating away.
    function forwardTo(destination) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Taking you there…';
      setTimeout(function () {
        window.location.href = destination;
      }, 250);
    }
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
})();
