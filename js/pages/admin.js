/*
 * pages/admin.js — the instructor-only console.
 * Every mutation is also checked in store.js; hiding the UI is not the guard.
 */
(function (global) {
  'use strict';

  var Pages = (global.MoodyPages = global.MoodyPages || {});
  var Store = global.MoodyStore;
  var UI = global.MoodyUI;
  var esc = UI.esc;
  var money = UI.money;

  var SUBJECTS = [
    ['science', 'Science'],
    ['math', 'Math'],
    ['english', 'English'],
    ['ib', 'Moody IB']
  ];

  var TABS = [
    ['overview', 'Overview'],
    ['students', 'Students'],
    ['assignments', 'Assignments'],
    ['gradebook', 'Gradebook'],
    ['requests', 'Meeting requests']
  ];

  function instructorLogin(state) {
    var error = state && state.loginError;
    return UI.shell({
      theme: 'neutral',
      active: '',
      html:
        '<section class="admin-login"><div class="container admin-login-grid">' +
        '<div class="admin-login-copy reveal">' +
        '<p class="eyebrow">Restricted access</p>' +
        '<h1 class="admin-login-title">The instructor console.</h1>' +
        '<p class="admin-login-lede">Grade work, create assignments, manage students, and read meeting requests. This console is not linked from the family side of the site.</p>' +
        '<ul class="admin-login-list">' +
        '<li>' + UI.icon('lock') + '<span>Username, password, and a separate secret word are all required.</span></li>' +
        '<li>' + UI.icon('user') + '<span>Family accounts cannot open this console.</span></li>' +
        '<li>' + UI.icon('clock') + '<span>Five failed attempts lock the form for sixty seconds.</span></li>' +
        '</ul>' +
        '<div class="admin-warning">' + UI.icon('lock') + '<p><strong>This is a client-side demo.</strong> The credentials below are visible in the source. For real student data, put authentication and records behind a server.</p></div>' +
        '</div>' +
        '<div class="login-card reveal">' +
        '<p class="eyebrow">Instructor sign-in</p>' +
        '<h2 class="login-title">Unlock the console</h2>' +
        (error ? '<div class="form-error" role="alert">' + UI.icon('close') + '<span>' + esc(error) + '</span></div>' : '') +
        '<form data-form="instructor-login" novalidate>' +
        '<div class="field"><label for="admin-user">Username</label><input id="admin-user" name="username" type="text" autocomplete="username" maxlength="60" required placeholder="TEST" /></div>' +
        '<div class="field"><label for="admin-pass">Password</label><input id="admin-pass" name="password" type="password" autocomplete="current-password" maxlength="80" required placeholder="TEST" /></div>' +
        '<div class="field"><label for="admin-secret">Secret word</label><input id="admin-secret" name="secret" type="password" autocomplete="off" maxlength="80" required placeholder="TEST" /><span class="field-hint">The secret word is the third lock. It is never shown in the interface.</span></div>' +
        '<button class="btn btn-ink btn-block btn-lg" type="submit">Unlock console ' + UI.icon('lock') + '</button>' +
        '</form>' +
        '<p class="login-secure">' + UI.icon('user') + '<span>Demo values: TEST / TEST / TEST. Change them in store.js before deployment.</span></p>' +
        '<a class="text-link" href="#/" data-action="goto" data-target="#/">Back to the public site ' + UI.icon('arrow') + '</a>' +
        '</div></div></section>'
    });
  }

  function tabBar(active) {
    return (
      '<div class="admin-tabs" role="tablist" aria-label="Instructor sections">' +
      TABS.map(function (tab) {
        return (
          '<button class="admin-tab ' +
          (active === tab[0] ? 'is-active' : '') +
          '" type="button" role="tab" aria-selected="' +
          (active === tab[0]) +
          '" data-action="admin-tab" data-tab="' +
          tab[0] +
          '">' +
          esc(tab[1]) +
          '</button>'
        );
      }).join('') +
      '</div>'
    );
  }

  function statsRow() {
    var students = Store.students();
    var averages = students
      .map(function (student) { return Store.overallFor(student.id); })
      .filter(function (value) { return typeof value === 'number'; });
    var average = averages.length
      ? Math.round(averages.reduce(function (sum, value) { return sum + value; }, 0) / averages.length)
      : null;
    var awaiting = Store.assignments().filter(function (assignment) {
      return assignment.status === 'submitted';
    }).length;
    var openRequests = Store.requests().filter(function (request) {
      return request.status !== 'closed';
    });
    var pipeline = openRequests.reduce(function (sum, request) { return sum + (request.total || 0); }, 0);
    return (
      '<div class="stat-grid admin-stats">' +
      '<article class="stat-card"><p class="eyebrow">Students</p><strong class="stat-value">' +
      students.length +
      '</strong><span class="stat-note">Across all families</span></article>' +
      '<article class="stat-card"><p class="eyebrow">Cohort average</p><strong class="stat-value">' +
      (average === null ? '—' : average + '%') +
      '</strong><span class="stat-note">Graded work only</span></article>' +
      '<article class="stat-card"><p class="eyebrow">Awaiting grading</p><strong class="stat-value">' +
      awaiting +
      '</strong><span class="stat-note">Submitted, not scored</span></article>' +
      '<article class="stat-card"><p class="eyebrow">Cash pipeline</p><strong class="stat-value">' +
      money(pipeline) +
      '</strong><span class="stat-note">' +
      openRequests.length +
      ' open request' +
      (openRequests.length === 1 ? '' : 's') +
      '</span></article>' +
      '</div>'
    );
  }

  function overview() {
    var awaiting = Store.assignments()
      .filter(function (assignment) { return assignment.status === 'submitted'; })
      .slice(0, 4);
    var requests = Store.requests().slice(0, 3);
    return (
      statsRow() +
      '<div class="admin-grid-2">' +
      '<section class="panel"><div class="panel-head"><div><p class="eyebrow">Queue</p><h2>Awaiting grading</h2></div><button class="text-link" type="button" data-action="admin-tab" data-tab="gradebook">Open gradebook ' + UI.icon('arrow') + '</button></div>' +
      (awaiting.length
        ? '<ul class="admin-list">' + awaiting.map(function (assignment) {
            var student = Store.studentById(assignment.studentId);
            return '<li><div><p>' + esc(assignment.title) + '</p><span>' + esc(student ? student.name : 'Student') + ' · ' + esc(UI.subjectName(assignment.subject)) + '</span></div><span class="pill pill-warn">Submitted</span></li>';
          }).join('') + '</ul>'
        : '<p class="muted-copy">Nothing waiting. The queue is clear.</p>') +
      '</section>' +
      '<section class="panel"><div class="panel-head"><div><p class="eyebrow">Inbox</p><h2>New meeting requests</h2></div><button class="text-link" type="button" data-action="admin-tab" data-tab="requests">All requests ' + UI.icon('arrow') + '</button></div>' +
      (requests.length
        ? '<ul class="admin-list">' + requests.map(function (request) {
            return '<li><div><p>' + esc(request.name) + ' · Grade ' + request.grade + '</p><span>' + esc(request.plans.join(' · ')) + '</span></div><strong>' + money(request.total) + '</strong></li>';
          }).join('') + '</ul>'
        : '<p class="muted-copy">No requests yet. They arrive here after a family sends one.</p>') +
      '</section>' +
      '</div>' +
      '<section class="panel"><div class="panel-head"><div><p class="eyebrow">Shortcuts</p><h2>What needs doing</h2></div></div><div class="admin-shortcuts">' +
      '<button class="shortcut" type="button" data-action="admin-tab" data-tab="assignments">' + UI.icon('plus') + '<span>Create an assignment</span></button>' +
      '<button class="shortcut" type="button" data-action="open-student-form">' + UI.icon('user') + '<span>Add a student</span></button>' +
      '<button class="shortcut" type="button" data-action="admin-tab" data-tab="gradebook">' + UI.icon('check') + '<span>Grade a submission</span></button>' +
      '<button class="shortcut" type="button" data-action="admin-tab" data-tab="requests">' + UI.icon('mail') + '<span>Read requests</span></button>' +
      '</div></section>' +
      '<section class="panel danger-panel"><div class="panel-head"><div><p class="eyebrow">Demo controls</p><h2>Reset the workspace</h2></div></div><p class="muted-copy">Restores the seeded students, assignments, and requests, and clears every session. Use this after testing the portals.</p><button class="btn btn-danger btn-sm" type="button" data-action="reset-demo">Reset demo data</button></section>'
    );
  }

  function studentsTab() {
    var students = Store.students();
    return (
      '<div class="admin-section-head"><div><p class="eyebrow">Roster</p><h2>Students</h2><p class="muted-copy">Add a student, change a grade or plan, and open their record from here.</p></div><button class="btn btn-accent" type="button" data-action="open-student-form">' + UI.icon('plus') + ' Add student</button></div>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr><th>Student</th><th>Grade</th><th>Family</th><th>Plan</th><th>Average</th><th>Open work</th><th></th></tr></thead><tbody>' +
      students.map(function (student) {
        var average = Store.overallFor(student.id);
        var open = Store.assignmentsFor(student.id).filter(function (assignment) { return assignment.status !== 'graded'; }).length;
        return '<tr><td><strong>' + esc(student.name) + '</strong><span class="cell-sub">' + esc(student.guardian) + '</span></td><td>' + student.grade + '</td><td>' + esc(student.family) + '</td><td>' + esc(student.plan) + '</td><td>' + (average === null ? '—' : average + '%') + '</td><td>' + open + '</td><td><button class="icon-btn" type="button" data-action="edit-student" data-id="' + esc(student.id) + '" aria-label="Edit ' + esc(student.name) + '">' + UI.icon('edit') + '</button></td></tr>';
      }).join('') +
      '</tbody></table></div>'
    );
  }

  function assignmentForm(students) {
    return (
      '<form class="panel assignment-form" data-form="assignment-form" novalidate><div class="panel-head"><div><p class="eyebrow">New work</p><h2>Create an assignment</h2></div></div>' +
      '<div class="field"><label for="asg-student">Student</label><select id="asg-student" name="studentId" required>' +
      students.map(function (student) {
        return '<option value="' + esc(student.id) + '">' + esc(student.name) + ' · Grade ' + student.grade + '</option>';
      }).join('') +
      '</select></div>' +
      '<div class="form-grid"><div class="field"><label for="asg-subject">Subject</label><select id="asg-subject" name="subject">' +
      SUBJECTS.map(function (subject) { return '<option value="' + subject[0] + '">' + subject[1] + '</option>'; }).join('') +
      '</select></div><div class="field"><label for="asg-points">Points</label><input id="asg-points" name="points" type="number" min="1" max="100" value="20" required /></div></div>' +
      '<div class="field"><label for="asg-title">Title</label><input id="asg-title" name="title" type="text" maxlength="110" required placeholder="Mission 05 — Variables and controls" /></div>' +
      '<div class="field"><label for="asg-due">Due date</label><input id="asg-due" name="due" type="date" required value="' + new Date().toISOString().slice(0, 10) + '" /></div>' +
      '<div class="field"><label for="asg-instructions">Instructions</label><textarea id="asg-instructions" name="instructions" rows="5" maxlength="2000" placeholder="What should the student produce? Include the success criteria."></textarea></div>' +
      '<button class="btn btn-ink btn-block" type="submit">' + UI.icon('plus') + ' Assign to student</button>' +
      '<p class="panel-note">' + UI.icon('user') + '<span>The assignment appears in the student view immediately.</span></p>' +
      '</form>'
    );
  }

  function assignmentList() {
    var assignments = Store.assignments().slice().sort(function (a, b) {
      return String(b.createdAt).localeCompare(String(a.createdAt));
    });
    return (
      '<section class="panel admin-wide"><div class="panel-head"><div><p class="eyebrow">All work</p><h2>Assignments</h2></div><span class="pill pill-neutral">' + assignments.length + ' total</span></div>' +
      '<div class="assignment-admin-list">' +
      assignments.map(function (assignment) {
        var student = Store.studentById(assignment.studentId);
        return '<div class="admin-assignment"><div class="admin-assignment-main"><div class="admin-assignment-top"><span class="subject-chip subject-' + esc(assignment.subject) + '">' + esc(UI.subjectName(assignment.subject)) + '</span><span class="status-pill status-' + esc(assignment.status) + '">' + esc(assignment.status) + '</span><span class="cell-sub">Due ' + UI.date(assignment.due) + '</span></div><h3>' + esc(assignment.title) + '</h3><p class="cell-sub">' + esc(student ? student.name : 'Unknown student') + ' · ' + assignment.points + ' points</p></div><div class="admin-assignment-actions"><button class="btn btn-quiet btn-sm" type="button" data-action="edit-assignment" data-id="' + esc(assignment.id) + '">Edit</button><button class="icon-btn danger" type="button" data-action="delete-assignment" data-id="' + esc(assignment.id) + '" aria-label="Delete assignment">' + UI.icon('trash') + '</button></div></div>';
      }).join('') +
      '</div></section>'
    );
  }

  function assignmentsTab() {
    var students = Store.students();
    return (
      '<div class="admin-section-head"><div><p class="eyebrow">Coursework</p><h2>Assignments</h2><p class="muted-copy">Create work for a student, edit the brief, or delete it. Grades are entered in the gradebook.</p></div></div>' +
      '<div class="admin-grid-assign">' + assignmentForm(students) + assignmentList() + '</div>'
    );
  }

  function gradebookTab() {
    var submitted = Store.assignments().filter(function (assignment) {
      return assignment.status === 'submitted';
    });
    var graded = Store.assignments()
      .filter(function (assignment) { return assignment.status === 'graded'; })
      .sort(function (a, b) { return String(b.submittedAt).localeCompare(String(a.submittedAt)); })
      .slice(0, 10);
    return (
      '<div class="admin-section-head"><div><p class="eyebrow">Assessment</p><h2>Gradebook</h2><p class="muted-copy">Score submitted work and leave a note the family will see. Scores are clamped to the assignment points.</p></div></div>' +
      '<section class="panel"><div class="panel-head"><div><p class="eyebrow">Queue</p><h2>Waiting for a grade</h2></div><span class="pill pill-warn">' + submitted.length + '</span></div>' +
      (submitted.length
        ? submitted.map(function (assignment) {
            var student = Store.studentById(assignment.studentId);
            return '<form class="grade-form" data-form="grade-form" novalidate><input type="hidden" name="id" value="' + esc(assignment.id) + '" /><div class="grade-form-head"><div><span class="subject-chip subject-' + esc(assignment.subject) + '">' + esc(UI.subjectName(assignment.subject)) + '</span><h3>' + esc(assignment.title) + '</h3><p class="cell-sub">' + esc(student ? student.name : 'Student') + ' · ' + assignment.points + ' points · submitted ' + UI.shortDate(assignment.submittedAt) + '</p></div></div><div class="submission-preview"><span>Submission</span><p>' + esc(assignment.submission) + '</p></div><div class="grade-form-row"><div class="field"><label>Score (0–' + assignment.points + ')</label><input name="score" type="number" min="0" max="' + assignment.points + '" required placeholder="—" /></div><div class="field grow"><label>Feedback</label><textarea name="feedback" rows="2" maxlength="1500" placeholder="What worked, and one specific next step."></textarea></div><button class="btn btn-accent" type="submit">Save grade</button></div></form>';
          }).join('')
        : '<p class="muted-copy">No submissions waiting. Graded work appears below.</p>') +
      '</section>' +
      '<section class="panel"><div class="panel-head"><div><p class="eyebrow">History</p><h2>Recently graded</h2></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Student</th><th>Assignment</th><th>Subject</th><th>Score</th><th>Feedback</th></tr></thead><tbody>' +
      (graded.length
        ? graded.map(function (assignment) {
            var student = Store.studentById(assignment.studentId);
            return '<tr><td>' + esc(student ? student.name : '—') + '</td><td>' + esc(assignment.title) + '</td><td>' + esc(UI.subjectName(assignment.subject)) + '</td><td><strong>' + assignment.score + '/' + assignment.points + '</strong></td><td class="cell-feedback">' + esc(assignment.feedback || '—') + '</td></tr>';
          }).join('')
        : '<tr><td colspan="5">Nothing graded yet.</td></tr>') +
      '</tbody></table></div></section>'
    );
  }

  function requestsTab() {
    var requests = Store.requests();
    return (
      '<div class="admin-section-head"><div><p class="eyebrow">Inbox</p><h2>Meeting requests</h2><p class="muted-copy">Requests created by the cart flow are stored in this browser. In production these would arrive by email or a database.</p></div></div>' +
      (requests.length
        ? '<div class="request-grid">' + requests.map(function (request) {
            return '<article class="request-card"><div class="request-head"><div><span class="pill pill-' + (request.status === 'new' ? 'warn' : 'neutral') + '">' + esc(request.status) + '</span>' + (request.demo ? '<span class="pill pill-neutral">demo</span>' : '') + '</div><span class="cell-sub">' + UI.timeAgo(request.createdAt) + '</span></div><h3>' + esc(request.name) + '</h3><p class="request-sub">' + esc(request.student) + ' · Grade ' + request.grade + ' · ' + money(request.total) + ' estimated</p><ul class="request-plans">' + request.plans.map(function (plan) { return '<li>' + esc(plan) + '</li>'; }).join('') + '</ul><p class="request-meta"><strong>Times</strong> ' + esc((request.days && request.days.length ? request.days.join(', ') : 'Flexible') + ' · ' + (request.window || 'Flexible window') + ' · ' + (request.start || 'Flexible start')) + '</p>' + (request.notes ? '<p class="request-notes">' + esc(request.notes) + '</p>' : '') + '<div class="request-contact"><a href="mailto:' + esc(request.email) + '">' + esc(request.email) + '</a><span>' + esc(request.phone) + '</span></div><div class="request-actions"><select class="status-select" data-action="request-status" data-id="' + esc(request.id) + '" aria-label="Request status">' + ['new', 'contacted', 'booked', 'closed'].map(function (status) { return '<option value="' + status + '"' + (request.status === status ? ' selected' : '') + '>' + status + '</option>'; }).join('') + '</select><button class="btn btn-quiet btn-sm" type="button" data-action="copy-request-email" data-id="' + esc(request.id) + '">' + UI.icon('copy') + ' Copy email</button><button class="btn btn-accent btn-sm" type="button" data-action="reply-request" data-id="' + esc(request.id) + '">' + UI.icon('mail') + ' Reply in Gmail</button></div></article>';
          }).join('') + '</div>'
        : '<div class="panel">' + UI.emptyState('No requests yet', 'When a family sends a meeting request, it lands here with their cart and preferred times.') + '</div>')
    );
  }

  Pages.instructorLogin = instructorLogin;

  Pages.admin = function (state) {
    var active = (state && state.adminTab) || 'overview';
    var content =
      active === 'students' ? studentsTab() :
      active === 'assignments' ? assignmentsTab() :
      active === 'gradebook' ? gradebookTab() :
      active === 'requests' ? requestsTab() :
      overview();
    return UI.shell({
      theme: 'neutral',
      active: '',
      html:
        '<section class="admin-head"><div class="container admin-head-inner"><div><p class="eyebrow">Instructor console</p><h1 class="admin-title">Good morning.</h1><p class="admin-sub">' + Store.students().length + ' students · ' + Store.requests().filter(function (request) { return request.status === 'new'; }).length + ' new requests · signed in as the instructor</p></div><div class="admin-head-actions"><a class="btn btn-quiet btn-sm" href="#/" data-action="goto" data-target="#/">View public site</a><button class="btn btn-ink btn-sm" type="button" data-action="logout-instructor">' + UI.icon('lock') + ' Lock console</button></div></div></section>' +
        '<section class="section admin-body"><div class="container">' +
        tabBar(active) +
        '<div class="admin-content">' + content + '</div>' +
        '</div></section>'
    });
  };

  Pages.studentForm = function (student) {
    var editing = Boolean(student);
    return (
      '<form data-form="student-form" novalidate>' +
      (editing ? '<input type="hidden" name="id" value="' + esc(student.id) + '" />' : '') +
      '<div class="field"><label for="st-name">Student name</label><input id="st-name" name="name" type="text" maxlength="80" required value="' + esc(editing ? student.name : '') + '" placeholder="Ava Smith" /></div>' +
      '<div class="form-grid"><div class="field"><label for="st-grade">Grade</label><select id="st-grade" name="grade" required>' + [1, 2, 3, 4, 5, 6, 7, 8].map(function (grade) {
        return '<option value="' + grade + '"' + (editing && student.grade === grade ? ' selected' : '') + '>Grade ' + grade + '</option>';
      }).join('') + '</select></div><div class="field"><label for="st-family">Family</label><input id="st-family" name="family" type="text" maxlength="60" value="' + esc(editing ? student.family : 'Smith') + '" /></div></div>' +
      '<div class="field"><label for="st-plan">Active plan</label><input id="st-plan" name="plan" type="text" maxlength="90" value="' + esc(editing ? student.plan : '') + '" placeholder="Mission Month · Science" /></div>' +
      '<div class="form-grid"><div class="field"><label for="st-guardian">Guardian</label><input id="st-guardian" name="guardian" type="text" maxlength="80" value="' + esc(editing ? student.guardian : '') + '" /></div><div class="field"><label for="st-email">Guardian email</label><input id="st-email" name="email" type="email" maxlength="120" value="' + esc(editing ? student.email : '') + '" /></div></div>' +
      '<div class="modal-actions"><button class="btn btn-quiet" type="button" data-action="close-overlay">Cancel</button><button class="btn btn-accent" type="submit">' + (editing ? 'Save changes' : 'Add student') + '</button></div>' +
      '</form>'
    );
  };

  Pages.assignmentForm = function (assignment) {
    if (!assignment) return '';
    var students = Store.students();
    return (
      '<form data-form="edit-assignment" novalidate><input type="hidden" name="id" value="' + esc(assignment.id) + '" />' +
      '<div class="field"><label for="ea-student">Student</label><select id="ea-student" disabled>' + students.map(function (student) {
        return '<option' + (student.id === assignment.studentId ? ' selected' : '') + '>' + esc(student.name) + '</option>';
      }).join('') + '</select><span class="field-hint">Reassigning work is intentionally not supported; create a new assignment instead.</span></div>' +
      '<div class="form-grid"><div class="field"><label for="ea-subject">Subject</label><select id="ea-subject" name="subject">' + SUBJECTS.map(function (subject) {
        return '<option value="' + subject[0] + '"' + (assignment.subject === subject[0] ? ' selected' : '') + '>' + subject[1] + '</option>';
      }).join('') + '</select></div><div class="field"><label for="ea-points">Points</label><input id="ea-points" name="points" type="number" min="1" max="100" value="' + assignment.points + '" required /></div></div>' +
      '<div class="field"><label for="ea-title">Title</label><input id="ea-title" name="title" type="text" maxlength="110" required value="' + esc(assignment.title) + '" /></div>' +
      '<div class="field"><label for="ea-due">Due date</label><input id="ea-due" name="due" type="date" required value="' + esc(assignment.due) + '" /></div>' +
      '<div class="field"><label for="ea-instructions">Instructions</label><textarea id="ea-instructions" name="instructions" rows="5" maxlength="2000">' + esc(assignment.instructions) + '</textarea></div>' +
      '<div class="modal-actions"><button class="btn btn-quiet" type="button" data-action="close-overlay">Cancel</button><button class="btn btn-accent" type="submit">Save changes</button></div></form>'
    );
  };
})(window);
