/*
 * pages/portal.js — shared family/student login and the two portal views.
 * The student signs in with the family login and switches views; grades and
 * assignments are never rendered outside an authenticated session.
 */
(function (global) {
  'use strict';

  var Pages = (global.MoodyPages = global.MoodyPages || {});
  var Data = global.MoodyData;
  var Store = global.MoodyStore;
  var UI = global.MoodyUI;
  var esc = UI.esc;
  var money = UI.money;

  var FAMILY_ID = 'fam-smith';
  var SUBJECTS = ['science', 'math', 'english', 'ib'];

  function login(state) {
    var error = state && state.loginError;
    return UI.shell({
      theme: 'neutral',
      active: '',
      html:
        '<section class="login-page"><div class="container login-grid">' +
        '<aside class="login-art">' +
        '<canvas class="atmosphere" data-atmosphere="ib" aria-hidden="true"></canvas>' +
        '<div class="login-art-inner">' +
        '<p class="eyebrow">Family &amp; student access</p>' +
        '<h2>One login.<br />Two views.<br /><em>No surprises.</em></h2>' +
        '<ul class="login-art-list">' +
        '<li>' + UI.icon('check') + '<span>Parents see grades, feedback, attendance, and cash invoices.</span></li>' +
        '<li>' + UI.icon('check') + '<span>Students see assigned work, submit it, and read feedback.</span></li>' +
        '<li>' + UI.icon('lock') + '<span>Nothing is visible until the family signs in.</span></li>' +
        '</ul>' +
        '<p class="login-art-note">The instructor console is separate and requires a username, password, and secret word.</p>' +
        '</div></aside>' +
        '<div class="login-panel"><div class="login-card reveal">' +
        '<p class="eyebrow">Welcome back</p>' +
        '<h1 class="login-title">Family &amp; student sign-in</h1>' +
        '<p class="login-lede">Use the same family credentials for both views. Parent view is the default; switch to Student view once you are inside.</p>' +
        (error ? '<div class="form-error" role="alert">' + UI.icon('close') + '<span>' + esc(error) + '</span></div>' : '') +
        '<form data-form="family-login" novalidate>' +
        '<div class="field"><label for="login-user">Username</label><input id="login-user" name="username" type="text" autocomplete="username" maxlength="60" required placeholder="TEST" /></div>' +
        '<div class="field"><label for="login-pass">Password</label><input id="login-pass" name="password" type="password" autocomplete="current-password" maxlength="80" required placeholder="TEST" /></div>' +
        '<button class="btn btn-ink btn-block btn-lg" type="submit">Sign in ' + UI.icon('arrow') + '</button>' +
        '</form>' +
        '<div class="demo-note"><span>Demo access</span><strong>TEST / TEST</strong><p>These credentials exist for testing only. Replace them and add a server-side session before real use.</p></div>' +
        '<p class="login-secure">' + UI.icon('lock') + '<span>Sessions expire after 45 minutes of inactivity.</span></p>' +
        '</div></div>' +
        '</div></section>'
    });
  }

  function signedInNotice() {
    /* Rendered by the router when a signed-in family opens the login route. */
    return UI.shell({
      theme: 'neutral',
      active: '',
      html:
        '<section class="page-hero compact"><div class="container page-hero-inner">' +
        '<p class="eyebrow">Already signed in</p>' +
        '<h1 class="page-title">You are already inside.</h1>' +
        '<p class="page-lede">Open the family portal to continue, or sign out to use a different account.</p>' +
        '<div class="page-actions"><a class="btn btn-ink" href="#/portal" data-action="goto" data-target="#/portal">Open the portal</a><button class="btn btn-quiet" type="button" data-action="logout-family">Sign out</button></div>' +
        '</div></section>'
    });
  }

  function childChips(children, activeId) {
    return (
      '<div class="child-row"><span class="child-row-label">Viewing</span>' +
      children
        .map(function (child) {
          return (
            '<button class="child-chip ' +
            (child.id === activeId ? 'is-active' : '') +
            '" type="button" data-action="portal-child" data-id="' +
            esc(child.id) +
            '" aria-pressed="' +
            (child.id === activeId ? 'true' : 'false') +
            '"><span class="child-initials">' +
            esc(
              child.name
                .split(' ')
                .map(function (part) { return part.charAt(0); })
                .join('')
            ) +
            '</span><span><strong>' +
            esc(child.name) +
            '</strong><em>Grade ' +
            child.grade +
            '</em></span></button>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function subjectRows(child) {
    var averages = Store.averagesFor(child.id);
    var rows = SUBJECTS.filter(function (subject) {
      return averages[subject] !== null && averages[subject] !== undefined;
    });
    if (!rows.length) {
      return UI.emptyState('No grades yet', 'Graded work will appear here after the first feedback pass.');
    }
    return (
      '<div class="grade-rows">' +
      rows
        .map(function (subject) {
          var value = averages[subject];
          return (
            '<div class="grade-row-item"><div class="grade-row-head"><span>' +
            esc(UI.subjectName(subject)) +
            '</span><strong>' +
            value +
            '%</strong></div>' +
            UI.progressBar(value, UI.subjectName(subject) + ' average') +
            '</div>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function feedbackList(child) {
    var graded = Store.assignmentsFor(child.id)
      .filter(function (assignment) {
        return assignment.status === 'graded' && assignment.feedback;
      })
      .sort(function (a, b) {
        return String(b.submittedAt).localeCompare(String(a.submittedAt));
      })
      .slice(0, 4);
    if (!graded.length) return '<p class="muted-copy">Feedback notes will appear here.</p>';
    return (
      '<ul class="feedback-list">' +
      graded
        .map(function (assignment) {
          return (
            '<li><div class="feedback-head"><span class="subject-chip subject-' +
            esc(assignment.subject) +
            '">' +
            esc(UI.subjectName(assignment.subject)) +
            '</span><span class="feedback-score">' +
            assignment.score +
            '/' +
            assignment.points +
            '</span></div><p class="feedback-title">' +
            esc(assignment.title) +
            '</p><p class="feedback-body">' +
            esc(assignment.feedback) +
            '</p></li>'
          );
        })
        .join('') +
      '</ul>'
    );
  }

  function invoicePanel(child) {
    var invoices = Store.invoicesFor(FAMILY_ID);
    if (!invoices.length) return '<p class="muted-copy">No invoices on file.</p>';
    return (
      '<ul class="invoice-list">' +
      invoices
        .map(function (invoice) {
          return (
            '<li><div><p>' +
            esc(invoice.label) +
            '</p><span>' +
            UI.date(invoice.due) +
            ' · ' +
            esc(invoice.method) +
            '</span></div><div class="invoice-right"><strong>' +
            money(invoice.amount) +
            '</strong><span class="pill pill-' +
            (invoice.status === 'paid' ? 'good' : 'warn') +
            '">' +
            esc(invoice.status === 'paid' ? 'Paid' : 'Due') +
            '</span></div></li>'
          );
        })
        .join('') +
      '</ul>'
    );
  }

  function parentView(child, children) {
    var overall = Store.overallFor(child.id);
    var attendance = Store.attendanceRate(child);
    var dueInvoice = Store.invoicesFor(FAMILY_ID).filter(function (invoice) {
      return invoice.status !== 'paid';
    })[0];
    var pending = Store.assignmentsFor(child.id).filter(function (assignment) {
      return assignment.status !== 'graded';
    }).length;

    return (
      childChips(children, child.id) +
      '<div class="stat-grid">' +
      '<article class="stat-card"><p class="eyebrow">Overall average</p><strong class="stat-value">' +
      (overall === null ? '—' : overall + '%') +
      '</strong><span class="stat-note">Across graded work</span></article>' +
      '<article class="stat-card"><p class="eyebrow">Attendance</p><strong class="stat-value">' +
      (attendance === null ? '—' : attendance + '%') +
      '</strong><span class="stat-note">' +
      child.attendance.present +
      ' present · ' +
      child.attendance.late +
      ' late · ' +
      child.attendance.absent +
      ' absent</span></article>' +
      '<article class="stat-card"><p class="eyebrow">Open work</p><strong class="stat-value">' +
      pending +
      '</strong><span class="stat-note">Assignments not yet graded</span></article>' +
      '<article class="stat-card"><p class="eyebrow">Next cash payment</p><strong class="stat-value">' +
      (dueInvoice ? money(dueInvoice.amount) : '—') +
      '</strong><span class="stat-note">' +
      (dueInvoice ? 'Due ' + UI.date(dueInvoice.due) : 'Nothing outstanding') +
      '</span></article>' +
      '</div>' +
      '<div class="portal-grid">' +
      '<section class="panel panel-main"><div class="panel-head"><div><p class="eyebrow">Progress</p><h2>Grades by subject</h2></div><span class="plan-chip">' +
      esc(child.plan) +
      '</span></div>' +
      subjectRows(child) +
      '<div class="panel-sub"><h3>Recent feedback</h3>' +
      feedbackList(child) +
      '</div></section>' +
      '<div class="portal-side">' +
      '<section class="panel"><div class="panel-head"><div><p class="eyebrow">Cash account</p><h2>Invoices</h2></div></div>' +
      invoicePanel(child) +
      '<p class="panel-note">' +
      UI.icon('cash') +
      '<span>Cash in person after each consultation or at the start of a bundle.</span></p></section>' +
      '<section class="panel panel-accent"><p class="eyebrow">Need to talk?</p><h2>Request another meeting.</h2><p>Ask about a plan change, a new subject, or the next term.</p><a class="btn btn-ink btn-block" href="#/request" data-action="goto" data-target="#/request">Request a meeting ' +
      UI.icon('arrow') +
      '</a></section>' +
      '</div></div>' +
      '<p class="portal-foot-note">' +
      UI.icon('lock') +
      '<span>Signed in as the Smith family. The student uses this same login and switches to Student view.</span></p>'
    );
  }

  function statusLabel(status) {
    if (status === 'assigned') return 'Assigned';
    if (status === 'submitted') return 'Submitted';
    if (status === 'graded') return 'Graded';
    return status;
  }

  function assignmentCard(assignment) {
    var action = '';
    if (assignment.status === 'assigned') {
      action =
        '<button class="btn btn-accent btn-sm" type="button" data-action="open-submit" data-id="' +
        esc(assignment.id) +
        '">Submit work</button>';
    } else if (assignment.status === 'submitted') {
      action =
        '<button class="btn btn-quiet btn-sm" type="button" data-action="open-submit" data-id="' +
        esc(assignment.id) +
        '">Update submission</button>';
    }
    return (
      '<article class="assignment-card status-' +
      esc(assignment.status) +
      '">' +
      '<div class="assignment-top"><span class="subject-chip subject-' +
      esc(assignment.subject) +
      '">' +
      esc(UI.subjectName(assignment.subject)) +
      '</span><span class="status-pill status-' +
      esc(assignment.status) +
      '">' +
      esc(statusLabel(assignment.status)) +
      '</span></div>' +
      '<h3>' +
      esc(assignment.title) +
      '</h3>' +
      '<p class="assignment-meta">Due ' +
      UI.date(assignment.due) +
      ' · ' +
      assignment.points +
      ' points' +
      (assignment.status === 'graded' ? ' · scored ' + assignment.score : '') +
      '</p>' +
      '<p class="assignment-instructions">' +
      esc(assignment.instructions) +
      '</p>' +
      (assignment.status === 'submitted'
        ? '<div class="submission-preview"><span>Your submission</span><p>' + esc(assignment.submission) + '</p></div>'
        : '') +
      (assignment.status === 'graded'
        ? '<div class="graded-box"><div class="graded-score">' +
          assignment.score +
          '<span>/' +
          assignment.points +
          '</span></div><div><span>Instructor feedback</span><p>' +
          esc(assignment.feedback || 'No written feedback.') +
          '</p></div></div>'
        : '') +
      (action ? '<div class="assignment-actions">' + action + '</div>' : '') +
      '</article>'
    );
  }

  function studentView(child, children) {
    var list = Store.assignmentsFor(child.id);
    var graded = list.filter(function (assignment) {
      return assignment.status === 'graded';
    });
    var earned = graded.reduce(function (sum, assignment) {
      return sum + (assignment.score || 0);
    }, 0);
    var possible = graded.reduce(function (sum, assignment) {
      return sum + assignment.points;
    }, 0);
    var open = list.filter(function (assignment) {
      return assignment.status !== 'graded';
    }).length;

    return (
      childChips(children, child.id) +
      '<div class="student-hero">' +
      '<div class="student-identity"><span class="student-avatar">' +
      esc(
        child.name
          .split(' ')
          .map(function (part) { return part.charAt(0); })
          .join('')
      ) +
      '</span><div><p class="eyebrow">Student view</p><h1>Hi, ' +
      esc(child.name.split(' ')[0]) +
      '.</h1><p>' +
      esc(child.plan) +
      ' · Grade ' +
      child.grade +
      '</p></div></div>' +
      '<div class="student-points"><span>Points earned</span><strong>' +
      earned +
      '<em>/' +
      possible +
      '</em></strong><span>' +
      open +
      ' open assignment' +
      (open === 1 ? '' : 's') +
      '</span></div>' +
      '</div>' +
      '<div class="assignment-list">' +
      (list.length
        ? list.map(assignmentCard).join('')
        : UI.emptyState('No assignments yet', 'New work will appear here as soon as the instructor assigns it.')) +
      '</div>' +
      '<div class="student-help"><div><h3>Stuck on something?</h3><p>Bring it to the next session, or ask a parent to request a meeting.</p></div><a class="btn btn-quiet" href="#/request" data-action="goto" data-target="#/request">Request a meeting</a></div>'
    );
  }

  Pages.login = login;
  Pages.signedIn = signedInNotice;

  Pages.portal = function (state) {
    var children = Store.familyStudents(FAMILY_ID);
    if (!children.length) {
      return UI.shell({
        theme: 'neutral',
        active: '',
        html: '<section class="page-hero compact"><div class="container"><h1 class="page-title">No students on this account.</h1><p class="page-lede">Ask the instructor to add a student to the family.</p></div></section>'
      });
    }
    var requested = state && state.childId;
    var child = children.filter(function (entry) { return entry.id === requested; })[0] || children[0];
    var view = state && state.view === 'student' ? 'student' : 'parent';
    return UI.shell({
      theme: 'neutral',
      active: '',
      html:
        '<section class="portal-head"><div class="container portal-head-inner">' +
        '<div><p class="eyebrow">Family portal</p><h1 class="portal-title">The Smith family</h1><p class="portal-sub">Parent and student share one login. Choose the view you need.</p></div>' +
        '<div class="portal-tools"><div class="segmented" role="tablist" aria-label="Portal view">' +
        '<button class="segmented-btn ' +
        (view === 'parent' ? 'is-active' : '') +
        '" type="button" role="tab" aria-selected="' +
        (view === 'parent') +
        '" data-action="portal-view" data-view="parent">Parent view</button>' +
        '<button class="segmented-btn ' +
        (view === 'student' ? 'is-active' : '') +
        '" type="button" role="tab" aria-selected="' +
        (view === 'student') +
        '" data-action="portal-view" data-view="student">Student view</button>' +
        '</div><button class="btn btn-quiet btn-sm" type="button" data-action="logout-family">' +
        UI.icon('logout') +
        ' Sign out</button></div>' +
        '</div></section>' +
        '<section class="section portal-body"><div class="container">' +
        (view === 'parent' ? parentView(child, children) : studentView(child, children)) +
        '</div></section>'
    });
  };

  Pages.submitForm = function (assignment) {
    return (
      '<form data-form="submit-assignment" novalidate>' +
      '<input type="hidden" name="id" value="' +
      esc(assignment.id) +
      '" />' +
      '<div class="submit-brief"><p class="eyebrow">' +
      esc(UI.subjectName(assignment.subject)) +
      ' · ' +
      assignment.points +
      ' points</p><h3>' +
      esc(assignment.title) +
      '</h3><p>' +
      esc(assignment.instructions) +
      '</p><p class="submit-due">Due ' +
      UI.date(assignment.due) +
      '</p></div>' +
      '<div class="field"><label for="submission-text">Your work</label><textarea id="submission-text" name="text" rows="7" maxlength="5000" required placeholder="Write your answer here, or paste the link to your document.">' +
      esc(assignment.submission || '') +
      '</textarea></div>' +
      '<div class="modal-actions"><button class="btn btn-quiet" type="button" data-action="close-overlay">Cancel</button><button class="btn btn-accent" type="submit">' +
      (assignment.status === 'submitted' ? 'Update submission' : 'Submit work') +
      '</button></div>' +
      '</form>'
    );
  };
})(window);
