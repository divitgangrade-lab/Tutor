/*
 * app.js — hash router, delegated events, and form handlers.
 * No framework, no build step. Every route renders through Pages.* and every
 * interaction routes through a small allowlist of actions.
 */
(function (global) {
  'use strict';

  var Data = global.MoodyData;
  var Store = global.MoodyStore;
  var UI = global.MoodyUI;
  var Safe = global.MoodySecurity;
  var Pages = global.MoodyPages;
  var esc = Safe.esc;

  var app = document.getElementById('app');

  var state = {
    route: '',
    finder: { subject: null, grade: null, goal: null },
    bundle: { science: 4, math: 4, english: 4 },
    portal: { childId: null, view: 'parent' },
    adminTab: 'overview',
    checkout: { step: 1, draft: {} },
    sent: null,
    loginError: '',
    adminError: ''
  };

  var TITLES = {
    '': 'Moody & Co. Academy — Grades 1–8 & Moody IB Tutoring',
    science: 'Science · The Sci-Fi Lab — Moody & Co.',
    math: 'Math · The Matrix Room — Moody & Co.',
    english: 'English · The Story Hall — Moody & Co.',
    ib: 'Moody IB coaching — Moody & Co.',
    specialty: 'Specialty Center — Moody & Co.',
    request: 'Request a meeting — Moody & Co.',
    login: 'Family & student sign-in — Moody & Co.',
    portal: 'Family portal — Moody & Co.',
    instructor: 'Instructor console — Moody & Co.'
  };

  function parseRoute() {
    var raw = global.location.hash || '#/';
    return raw.replace(/^#\/?/, '').split('?')[0].toLowerCase();
  }

  function navigate(target) {
    UI.closeOverlay();
    closeMenu();
    if (global.location.hash === target) {
      renderRoute();
      return;
    }
    global.location.hash = target;
  }

  function closeMenu() {
    var nav = document.getElementById('mobile-nav');
    var button = document.querySelector('[data-action="toggle-menu"]');
    if (nav) nav.hidden = true;
    if (button) button.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  function viewFor(route) {
    switch (route) {
      case '':
        return Pages.home(state.finder);
      case 'science':
        return Pages.hub('science', { grade: state.bundle.science });
      case 'math':
        return Pages.hub('math', { grade: state.bundle.math });
      case 'english':
        return Pages.hub('english', { grade: state.bundle.english });
      case 'ib':
        return Pages.ib();
      case 'specialty':
        return Pages.specialty();
      case 'request':
        return state.sent ? Pages.requestSent(state.sent) : Pages.checkout(state.checkout);
      case 'login':
        return Store.isFamily() ? Pages.signedIn() : Pages.login({ loginError: state.loginError });
      case 'portal':
        return Store.isFamily() ? Pages.portal(state.portal) : Pages.login({ loginError: state.loginError });
      case 'instructor':
        return Store.isInstructor()
          ? Pages.admin({ adminTab: state.adminTab })
          : Pages.instructorLogin({ loginError: state.adminError });
      default:
        return Pages.notFound();
    }
  }

  function renderRoute() {
    var route = parseRoute();
    var changed = route !== state.route;
    state.route = route;
    var html;
    try {
      html = viewFor(route);
    } catch (error) {
      console.error('Render failed', error);
      html =
        '<div class="page theme-neutral"><main id="main"><section class="notfound"><div class="container"><p class="eyebrow">Something went wrong</p><h1 class="page-title">The page could not be drawn.</h1><p class="page-lede">Reload the page. If it keeps happening, open the browser console and share the error.</p><a class="btn btn-ink" href="#/">Back home</a></div></section></main></div>';
    }
    app.innerHTML = html;
    UI.initPage();
    UI.updateCartBadges();
    document.title = TITLES[route] || 'Moody & Co. Academy';
    if (changed) {
      global.scrollTo(0, 0);
    }
  }

  /* ------------------------------------------------------------- Interaction */

  function readForm(form) {
    return new FormData(form);
  }

  function field(fd, name, max) {
    return Safe.text(fd.get(name), max || 200);
  }

  function checkoutDraft(fd) {
    var grade = Number(fd.get('grade'));
    return {
      name: field(fd, 'name', 90),
      email: field(fd, 'email', 140),
      phone: field(fd, 'phone', 30),
      student: field(fd, 'student', 80),
      grade: Safe.isGrade(grade) ? grade : '',
      days: fd.getAll('days').map(function (day) { return Safe.text(day, 20); }),
      window: field(fd, 'window', 40),
      start: field(fd, 'start', 40),
      notes: Safe.multiline(fd.get('notes'), 1200)
    };
  }

  function validateDetails(draft) {
    if (!draft.name || draft.name.length < 2) return 'Add the parent or guardian name.';
    if (!Safe.isEmail(draft.email)) return 'Enter a valid email address.';
    if (!Safe.isPhone(draft.phone)) return 'Enter a phone number the instructor can reach.';
    if (!draft.student) return 'Add the student name.';
    if (!Safe.isGrade(draft.grade)) return 'Choose the student grade.';
    return '';
  }

  function validateStep(step) {
    var form = document.querySelector('[data-form="checkout"]');
    if (!form) return false;
    var section = form.querySelector('[data-step="' + step + '"]');
    if (!section) return false;
    var fields = Array.prototype.slice.call(section.querySelectorAll('input, select, textarea'));
    for (var index = 0; index < fields.length; index += 1) {
      if (!fields[index].checkValidity()) {
        fields[index].reportValidity();
        return false;
      }
    }
    return true;
  }

  function scrollToCheckout() {
    var node = document.querySelector('.checkout-card');
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function updateFinder() {
    var panel = document.getElementById('finder-panel');
    if (panel) panel.innerHTML = Pages.finderPanel(state.finder);
  }

  function buildEmail(draft, cart, total) {
    var planLines = cart
      .map(function (line) {
        return '- ' + line.title + ' × ' + line.qty + ' — ' + Safe.money(line.price * line.qty);
      })
      .join('\n');
    var body =
      'Hello,\n\n' +
      'A family is planning a meeting and will pay in cash.\n\n' +
      'Parent: ' + draft.name + '\n' +
      'Student: ' + draft.student + ' (Grade ' + draft.grade + ')\n' +
      'Email: ' + draft.email + '\n' +
      'Phone: ' + draft.phone + '\n\n' +
      'Plans requested:\n' + planLines + '\n\n' +
      'Estimated total: ' + Safe.money(total) + ' (cash in person)\n' +
      'Preferred days: ' + (draft.days.length ? draft.days.join(', ') : 'Flexible') + '\n' +
      'Time window: ' + (draft.window || 'Flexible') + '\n' +
      'Preferred start: ' + (draft.start || 'Flexible') + '\n' +
      (draft.notes ? '\nNotes:\n' + draft.notes + '\n' : '') +
      '\nThis is a meeting request only. No online payment has been made.\n\n' +
      'Thank you.';
    var subject = 'Meeting request — ' + draft.student + ', Grade ' + draft.grade;
    return {
      body: body,
      subject: subject,
      gmailUrl:
        'https://mail.google.com/mail/?view=cm&fs=1&to=' +
        encodeURIComponent(Data.SITE.email) +
        '&su=' +
        encodeURIComponent(subject) +
        '&body=' +
        encodeURIComponent(body),
      mailto:
        'mailto:' +
        Data.SITE.email +
        '?subject=' +
        encodeURIComponent(subject) +
        '&body=' +
        encodeURIComponent(body)
    };
  }

  function onClick(event) {
    var actionNode = event.target.closest('[data-action]');
    if (!actionNode) return;
    var action = actionNode.getAttribute('data-action');

    if (action === 'goto') {
      event.preventDefault();
      navigate(actionNode.getAttribute('data-target'));
      return;
    }

    if (action === 'scroll') {
      event.preventDefault();
      closeMenu();
      UI.scrollToId(actionNode.getAttribute('data-target'));
      return;
    }

    if (action === 'toggle-menu') {
      event.preventDefault();
      var nav = document.getElementById('mobile-nav');
      if (!nav) return;
      var open = nav.hidden;
      nav.hidden = !open;
      actionNode.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-open', open);
      return;
    }

    if (action === 'close-overlay') {
      event.preventDefault();
      UI.closeOverlay();
      return;
    }

    if (action === 'open-cart') {
      event.preventDefault();
      UI.openCart();
      return;
    }

    if (action === 'add-item') {
      event.preventDefault();
      var code = actionNode.getAttribute('data-item');
      var item = Store.addItem(code);
      if (!item) {
        UI.toast('That plan could not be found.', 'error');
        return;
      }
      UI.openCart();
      UI.toast(item.title + ' added to the cart.');
      return;
    }

    if (action === 'open-plan') {
      event.preventDefault();
      UI.openPlan(actionNode.getAttribute('data-plan'));
      return;
    }

    if (action === 'cart-inc' || action === 'cart-dec' || action === 'cart-remove') {
      event.preventDefault();
      var key = actionNode.getAttribute('data-key');
      var line = Store.cart().filter(function (entry) { return entry.key === key; })[0];
      if (!line) return;
      if (action === 'cart-remove') {
        Store.removeItem(key);
        UI.toast('Removed from the cart.');
      } else {
        Store.setQty(key, line.qty + (action === 'cart-inc' ? 1 : -1));
      }
      UI.refreshCart();
      if (state.route === 'request' && !state.sent) renderRoute();
      return;
    }

    if (action === 'clear-cart') {
      event.preventDefault();
      Store.clearCart();
      UI.refreshCart();
      UI.toast('Cart cleared.');
      if (state.route === 'request' && !state.sent) renderRoute();
      return;
    }

    if (action === 'finder-pick') {
      event.preventDefault();
      var pickKey = actionNode.getAttribute('data-key');
      var value = actionNode.getAttribute('data-value');
      if (pickKey === 'subject') {
        state.finder = { subject: value, grade: null, goal: null };
      } else if (pickKey === 'grade') {
        state.finder.grade = Number(value);
        state.finder.goal = null;
      } else if (pickKey === 'goal') {
        state.finder.goal = value;
      }
      updateFinder();
      return;
    }

    if (action === 'finder-back') {
      event.preventDefault();
      if (state.finder.goal) state.finder.goal = null;
      else if (state.finder.grade) {
        state.finder.grade = null;
        state.finder.goal = null;
      } else state.finder.subject = null;
      updateFinder();
      return;
    }

    if (action === 'finder-reset') {
      event.preventDefault();
      state.finder = { subject: null, grade: null, goal: null };
      updateFinder();
      return;
    }

    if (action === 'bundle-grade') {
      event.preventDefault();
      var subject = actionNode.getAttribute('data-subject');
      var grade = Number(actionNode.getAttribute('data-grade'));
      if (!Data.SUBJECTS[subject]) return;
      state.bundle[subject] = grade;
      var target = document.getElementById('bundle-calc');
      if (target) target.innerHTML = Pages.bundleCalc(subject, grade);
      document.querySelectorAll('.bundle-chip').forEach(function (chip) {
        var active = chip.getAttribute('data-subject') === subject && Number(chip.getAttribute('data-grade')) === grade;
        chip.classList.toggle('is-active', active);
        chip.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      return;
    }

    if (action === 'checkout-next') {
      event.preventDefault();
      var form = document.querySelector('[data-form="checkout"]');
      if (!form) return;
      var step = state.checkout.step;
      if (!validateStep(step)) return;
      var draft = Object.assign({}, state.checkout.draft, checkoutDraft(readForm(form)));
      if (step === 1) {
        var error = validateDetails(draft);
        if (error) {
          UI.toast(error, 'error');
          return;
        }
      }
      state.checkout = { step: Math.min(3, step + 1), draft: draft };
      renderRoute();
      scrollToCheckout();
      return;
    }

    if (action === 'checkout-back') {
      event.preventDefault();
      var backForm = document.querySelector('[data-form="checkout"]');
      var backDraft = backForm
        ? Object.assign({}, state.checkout.draft, checkoutDraft(readForm(backForm)))
        : state.checkout.draft;
      state.checkout = { step: Math.max(1, state.checkout.step - 1), draft: backDraft };
      renderRoute();
      scrollToCheckout();
      return;
    }

    if (action === 'portal-view') {
      event.preventDefault();
      state.portal.view = actionNode.getAttribute('data-view') === 'student' ? 'student' : 'parent';
      renderRoute();
      return;
    }

    if (action === 'portal-child') {
      event.preventDefault();
      state.portal.childId = actionNode.getAttribute('data-id');
      renderRoute();
      return;
    }

    if (action === 'logout-family') {
      event.preventDefault();
      Store.logout('family');
      UI.toast('Signed out of the family portal.');
      navigate('#/');
      return;
    }

    if (action === 'logout-instructor') {
      event.preventDefault();
      Store.logout('instructor');
      UI.toast('Instructor console locked.');
      navigate('#/instructor');
      return;
    }

    if (action === 'open-submit') {
      event.preventDefault();
      if (!Store.isFamily()) return;
      var assignment = Store.assignmentById(actionNode.getAttribute('data-id'));
      if (!assignment) return;
      UI.modal({
        kicker: assignment.points + ' points · due ' + UI.date(assignment.due),
        title: 'Submit your work',
        wide: true,
        body: Pages.submitForm(assignment)
      });
      return;
    }

    if (action === 'admin-tab') {
      event.preventDefault();
      if (!Store.isInstructor()) return;
      state.adminTab = actionNode.getAttribute('data-tab');
      renderRoute();
      return;
    }

    if (action === 'open-student-form') {
      event.preventDefault();
      if (!Store.isInstructor()) return;
      UI.modal({ kicker: 'Roster', title: 'Add a student', body: Pages.studentForm(null) });
      return;
    }

    if (action === 'edit-student') {
      event.preventDefault();
      if (!Store.isInstructor()) return;
      var student = Store.studentById(actionNode.getAttribute('data-id'));
      if (student) UI.modal({ kicker: 'Roster', title: 'Edit student', body: Pages.studentForm(student) });
      return;
    }

    if (action === 'edit-assignment') {
      event.preventDefault();
      if (!Store.isInstructor()) return;
      var editable = Store.assignmentById(actionNode.getAttribute('data-id'));
      if (editable) UI.modal({ kicker: 'Edit work', title: editable.title, wide: true, body: Pages.assignmentForm(editable) });
      return;
    }

    if (action === 'delete-assignment') {
      event.preventDefault();
      if (!Store.isInstructor()) return;
      var deleteId = actionNode.getAttribute('data-id');
      UI.confirmDialog({
        title: 'Delete this assignment?',
        body: 'The assignment and any submission attached to it will be removed. This cannot be undone.',
        confirm: 'Delete'
      }).then(function (confirmed) {
        if (!confirmed) return;
        Store.deleteAssignment(deleteId);
        UI.toast('Assignment deleted.');
        renderRoute();
      });
      return;
    }

    if (action === 'copy-request-email') {
      event.preventDefault();
      if (!Store.isInstructor()) return;
      var request = Store.requests().filter(function (entry) {
        return entry.id === actionNode.getAttribute('data-id');
      })[0];
      if (!request) return;
      Safe.copy(request.email).then(function (ok) {
        UI.toast(ok ? 'Email address copied.' : 'Could not copy the address.', ok ? 'info' : 'error');
      });
      return;
    }

    if (action === 'reply-request') {
      event.preventDefault();
      if (!Store.isInstructor()) return;
      var replyTo = Store.requests().filter(function (entry) {
        return entry.id === actionNode.getAttribute('data-id');
      })[0];
      if (!replyTo) return;
      var subject = 'Re: your Moody & Co. meeting request';
      var body = 'Hi ' + replyTo.name + ',\n\nThank you for the request. I can meet to discuss ' + (replyTo.plans[0] || 'the plan') + '.\n\nWould one of these windows work?\n\nBest,\nMoody & Co. Academy';
      global.open(
        'https://mail.google.com/mail/?view=cm&fs=1&to=' +
          encodeURIComponent(replyTo.email) +
          '&su=' +
          encodeURIComponent(subject) +
          '&body=' +
          encodeURIComponent(body),
        '_blank',
        'noopener,noreferrer'
      );
      return;
    }

    if (action === 'reset-demo') {
      event.preventDefault();
      UI.confirmDialog({
        title: 'Reset all demo data?',
        body: 'Students, assignments, requests, cart lines, and sessions return to the seeded state.',
        confirm: 'Reset everything'
      }).then(function (confirmed) {
        if (!confirmed) return;
        Store.resetDemo();
        state.finder = { subject: null, grade: null, goal: null };
        state.bundle = { science: 4, math: 4, english: 4 };
        state.portal = { childId: null, view: 'parent' };
        state.adminTab = 'overview';
        state.checkout = { step: 1, draft: {} };
        state.sent = null;
        state.loginError = '';
        state.adminError = '';
        UI.toast('Demo data reset.');
        navigate('#/');
      });
      return;
    }

    if (action === 'open-sent-gmail') {
      event.preventDefault();
      if (state.sent) global.open(state.sent.gmailUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (action === 'copy-sent-email') {
      event.preventDefault();
      if (!state.sent) return;
      Safe.copy(state.sent.body).then(function (ok) {
        UI.toast(ok ? 'Email copied to the clipboard.' : 'Could not copy the email.', ok ? 'info' : 'error');
      });
      return;
    }

    if (action === 'download-sent-email') {
      event.preventDefault();
      if (!state.sent) return;
      var saved = Safe.download('moody-meeting-request.txt', state.sent.body);
      UI.toast(saved ? 'Request downloaded as a text file.' : 'Could not create the file.', saved ? 'info' : 'error');
      return;
    }

    if (action === 'new-request') {
      event.preventDefault();
      state.sent = null;
      state.checkout = { step: 1, draft: {} };
      navigate('#/request');
    }
  }

  /* ------------------------------------------------------------------ Submit */

  function onSubmit(event) {
    var form = event.target;
    if (!form || !form.getAttribute) return;
    var name = form.getAttribute('data-form');
    if (!name) return;

    if (name === 'family-login') {
      event.preventDefault();
      var familyData = readForm(form);
      var familyResult = Store.loginFamily(field(familyData, 'username', 60), String(familyData.get('password') || ''));
      if (!familyResult.ok) {
        state.loginError = familyResult.error;
        renderRoute();
        return;
      }
      state.loginError = '';
      UI.toast('Welcome back.');
      navigate('#/portal');
      return;
    }

    if (name === 'instructor-login') {
      event.preventDefault();
      var adminData = readForm(form);
      var adminResult = Store.loginInstructor(
        field(adminData, 'username', 60),
        String(adminData.get('password') || ''),
        String(adminData.get('secret') || '')
      );
      if (!adminResult.ok) {
        state.adminError = adminResult.error;
        renderRoute();
        return;
      }
      state.adminError = '';
      state.adminTab = 'overview';
      UI.toast('Console unlocked.');
      navigate('#/instructor');
      return;
    }

    if (name === 'checkout') {
      event.preventDefault();
      var cart = Store.cart();
      if (!cart.length) {
        UI.toast('The cart is empty.', 'error');
        return;
      }
      if (!validateStep(3)) return;
      var checkoutData = readForm(form);
      if (!checkoutData.get('ack')) {
        UI.toast('Please confirm the cash payment note.', 'error');
        return;
      }
      var finalDraft = Object.assign({}, state.checkout.draft, checkoutDraft(checkoutData));
      var detailError = validateDetails(finalDraft);
      if (detailError) {
        state.checkout = { step: 1, draft: finalDraft };
        renderRoute();
        scrollToCheckout();
        UI.toast(detailError, 'error');
        return;
      }
      var total = Store.cartTotal();
      var email = buildEmail(finalDraft, cart, total);
      var request = Store.addRequest({
        name: finalDraft.name,
        email: finalDraft.email,
        phone: finalDraft.phone,
        student: finalDraft.student,
        grade: finalDraft.grade,
        plans: cart.map(function (line) {
          return line.title + ' × ' + line.qty + ' · ' + Safe.money(line.price * line.qty);
        }),
        total: total,
        days: finalDraft.days,
        window: finalDraft.window,
        start: finalDraft.start,
        notes: finalDraft.notes
      });
      state.sent = {
        id: request.id,
        name: finalDraft.name,
        student: finalDraft.student,
        grade: finalDraft.grade,
        total: total,
        email: finalDraft.email,
        gmailUrl: email.gmailUrl,
        mailto: email.mailto,
        body: email.body
      };
      Store.clearCart();
      state.checkout = { step: 1, draft: {} };
      renderRoute();
      global.scrollTo(0, 0);
      var opened = global.open(email.gmailUrl, '_blank', 'noopener,noreferrer');
      if (!opened) UI.toast('The Gmail draft was blocked. Use the buttons on this page.', 'error');
      return;
    }

    if (name === 'submit-assignment') {
      event.preventDefault();
      if (!Store.isFamily()) return;
      var submitData = readForm(form);
      var result = Store.submitAssignment(
        String(submitData.get('id') || ''),
        String(submitData.get('text') || '')
      );
      if (!result.ok) {
        UI.toast(result.error, 'error');
        return;
      }
      UI.closeOverlay();
      UI.toast('Work submitted. Your instructor will see it in the gradebook.');
      renderRoute();
      return;
    }

    if (name === 'student-form') {
      event.preventDefault();
      if (!Store.isInstructor()) return;
      var studentData = readForm(form);
      var id = String(studentData.get('id') || '');
      var payload = {
        name: field(studentData, 'name', 80),
        grade: Number(studentData.get('grade')),
        family: field(studentData, 'family', 60),
        plan: field(studentData, 'plan', 90),
        guardian: field(studentData, 'guardian', 80),
        email: field(studentData, 'email', 120)
      };
      var saved = id ? Store.updateStudent(id, payload) : Store.addStudent(payload);
      if (!saved.ok) {
        UI.toast(saved.error, 'error');
        return;
      }
      UI.closeOverlay();
      UI.toast(id ? 'Student updated.' : 'Student added.');
      state.adminTab = 'students';
      renderRoute();
      return;
    }

    if (name === 'assignment-form') {
      event.preventDefault();
      if (!Store.isInstructor()) return;
      var assignmentData = readForm(form);
      var created = Store.addAssignment({
        studentId: String(assignmentData.get('studentId') || ''),
        subject: String(assignmentData.get('subject') || 'science'),
        title: field(assignmentData, 'title', 110),
        due: field(assignmentData, 'due', 20),
        points: Number(assignmentData.get('points')),
        instructions: Safe.multiline(assignmentData.get('instructions'), 2000)
      });
      if (!created.ok) {
        UI.toast(created.error, 'error');
        return;
      }
      UI.toast('Assignment created and published to the student.');
      state.adminTab = 'assignments';
      renderRoute();
      return;
    }

    if (name === 'edit-assignment') {
      event.preventDefault();
      if (!Store.isInstructor()) return;
      var editData = readForm(form);
      var edited = Store.updateAssignment(String(editData.get('id') || ''), {
        title: field(editData, 'title', 110),
        subject: String(editData.get('subject') || 'science'),
        due: field(editData, 'due', 20),
        points: Number(editData.get('points')),
        instructions: Safe.multiline(editData.get('instructions'), 2000)
      });
      if (!edited.ok) {
        UI.toast(edited.error, 'error');
        return;
      }
      UI.closeOverlay();
      UI.toast('Assignment updated.');
      renderRoute();
      return;
    }

    if (name === 'grade-form') {
      event.preventDefault();
      if (!Store.isInstructor()) return;
      var gradeData = readForm(form);
      var graded = Store.gradeAssignment(
        String(gradeData.get('id') || ''),
        Number(gradeData.get('score')),
        Safe.multiline(gradeData.get('feedback'), 1500)
      );
      if (!graded.ok) {
        UI.toast(graded.error, 'error');
        return;
      }
      UI.toast('Grade saved. The family can see the feedback.');
      renderRoute();
    }
  }

  function onChange(event) {
    var select = event.target;
    if (!select.getAttribute) return;
    if (select.getAttribute('data-action') === 'request-status') {
      if (!Store.isInstructor()) return;
      var updated = Store.updateRequestStatus(select.getAttribute('data-id'), select.value);
      if (updated) {
        UI.toast('Request marked ' + select.value + '.');
        renderRoute();
      }
    }
  }

  document.addEventListener('click', onClick);
  document.addEventListener('submit', onSubmit);
  document.addEventListener('change', onChange);
  global.addEventListener('hashchange', renderRoute);
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenu();
  });

  Store.subscribe(function (type) {
    UI.updateCartBadges();
    if (type === 'cart' && state.route === 'request' && !state.sent) {
      renderRoute();
    }
  });

  renderRoute();
})(window);
