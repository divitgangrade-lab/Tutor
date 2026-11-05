/*
 * store.js — all mutable state, guarded by small pure functions.
 *
 * Demo credentials live here because this build ships without a backend. That
 * means a determined visitor can read them: client-side auth is a presentation
 * boundary, not real security. See README.md for the production path.
 */
(function (global) {
  'use strict';

  var Data = global.MoodyData;
  var Safe = global.MoodySecurity;

  var DATA_KEY = 'moodyAcademy.data.v2';
  var SESSION_KEY = 'moodyAcademy.sessions.v2';
  var SESSION_TTL = 45 * 60 * 1000; /* 45 minutes of idle time */
  var MAX_QTY = 10;
  var MAX_ATTEMPTS = 5;
  var LOCK_MS = 60 * 1000;

  /* Demo-only credentials. Replace with server-side auth before real use. */
  var CREDENTIALS = {
    family: { username: 'TEST', password: 'TEST' },
    instructor: { username: 'TEST', password: 'TEST', secret: 'TEST' }
  };

  var SUBJECT_KEYS = ['science', 'math', 'english', 'ib'];

  var listeners = [];
  var attempts = {
    family: { count: 0, lockUntil: 0 },
    instructor: { count: 0, lockUntil: 0 }
  };

  function seedStudents() {
    return [
      {
        id: 'stu-ava',
        name: 'Ava Smith',
        grade: 6,
        familyId: 'fam-smith',
        family: 'Smith',
        guardian: 'Jordan Smith',
        email: 'jordan.smith@example.com',
        subjects: ['science', 'math', 'english'],
        plan: 'Orbital Semester · Science',
        joined: '2026-09-08',
        attendance: { present: 19, late: 1, absent: 0 }
      },
      {
        id: 'stu-noah',
        name: 'Noah Smith',
        grade: 3,
        familyId: 'fam-smith',
        family: 'Smith',
        guardian: 'Jordan Smith',
        email: 'jordan.smith@example.com',
        subjects: ['science', 'math', 'english'],
        plan: 'Mission Month · Science',
        joined: '2026-09-08',
        attendance: { present: 17, late: 1, absent: 2 }
      },
      {
        id: 'stu-liam',
        name: 'Liam Chen',
        grade: 5,
        familyId: 'fam-chen',
        family: 'Chen',
        guardian: 'Mei Chen',
        email: 'mei.chen@example.com',
        subjects: ['math', 'science'],
        plan: 'Matrix Month · Math',
        joined: '2026-10-06',
        attendance: { present: 6, late: 0, absent: 1 }
      },
      {
        id: 'stu-nora',
        name: 'Nora Patel',
        grade: 8,
        familyId: 'fam-patel',
        family: 'Patel',
        guardian: 'Anika Patel',
        email: 'anika.patel@example.com',
        subjects: ['english', 'ib'],
        plan: 'Candidate Sprint · Moody IB',
        joined: '2026-09-21',
        attendance: { present: 8, late: 1, absent: 0 }
      }
    ];
  }

  function seedAssignments() {
    return [
      {
        id: 'asg-ava-sci-4',
        studentId: 'stu-ava',
        subject: 'science',
        title: 'Mission 04 — Defend your conclusion',
        instructions:
          'Write the conclusion for the pendulum mission. State the claim, cite two pieces of data from your notebook, and explain one source of error.',
        due: '2026-11-12',
        points: 20,
        status: 'assigned',
        score: null,
        feedback: '',
        submission: '',
        submittedAt: null,
        createdAt: '2026-11-04'
      },
      {
        id: 'asg-ava-math-3',
        studentId: 'stu-ava',
        subject: 'math',
        title: 'Matrix Drill: fractions to decimals',
        instructions: 'Complete the twelve conversions and explain the pattern for thirds and sixths.',
        due: '2026-11-08',
        points: 15,
        status: 'submitted',
        score: null,
        feedback: '',
        submission:
          'I converted each fraction by dividing numerator by denominator. For thirds I noticed the decimal repeats 3, and for sixths it repeats 6 after the first digit. My answer for 5/6 is 0.8333…',
        submittedAt: '2026-11-04',
        createdAt: '2026-11-02'
      },
      {
        id: 'asg-ava-eng-2',
        studentId: 'stu-ava',
        subject: 'english',
        title: 'Castle Paragraph: claim + evidence',
        instructions:
          'Write one paragraph arguing which character holds the most power. Use two quotations and explain each one.',
        due: '2026-11-06',
        points: 20,
        status: 'graded',
        score: 18,
        feedback:
          'Strong claim and clean evidence. Next time, tie the second quotation back to the word “power” explicitly — one more sentence earns full marks.',
        submission: 'Claim, evidence, and reasoning paragraph submitted in class.',
        submittedAt: '2026-10-31',
        createdAt: '2026-10-28'
      },
      {
        id: 'asg-ava-sci-3',
        studentId: 'stu-ava',
        subject: 'science',
        title: 'Lab Notebook Check — Mission 03',
        instructions: 'Photograph three notebook pages: question, data table, and conclusion.',
        due: '2026-10-30',
        points: 20,
        status: 'graded',
        score: 19,
        feedback: 'Excellent table. Add units to the time column next time.',
        submission: 'Notebook pages uploaded during the session.',
        submittedAt: '2026-10-29',
        createdAt: '2026-10-26'
      },
      {
        id: 'asg-ava-math-2',
        studentId: 'stu-ava',
        subject: 'math',
        title: 'Error Autopsy: fraction addition',
        instructions: 'Pick two problems you missed and write what went wrong at each step.',
        due: '2026-10-24',
        points: 15,
        status: 'graded',
        score: 13,
        feedback: 'Good honesty. Be specific about the moment the denominator stopped matching.',
        submission: 'Error log completed.',
        submittedAt: '2026-10-23',
        createdAt: '2026-10-21'
      },
      {
        id: 'asg-ava-eng-3',
        studentId: 'stu-ava',
        subject: 'english',
        title: 'Story Map: The Lantern Keeper',
        instructions:
          'Map the rising action in five beats, then write two sentences about what the lantern symbolizes.',
        due: '2026-11-14',
        points: 20,
        status: 'assigned',
        score: null,
        feedback: '',
        submission: '',
        submittedAt: null,
        createdAt: '2026-11-05'
      },
      {
        id: 'asg-noah-sci-1',
        studentId: 'stu-noah',
        subject: 'science',
        title: 'Backyard Observation Log',
        instructions: 'Observe one living thing for five minutes. Draw it and write three adjectives.',
        due: '2026-11-10',
        points: 10,
        status: 'assigned',
        score: null,
        feedback: '',
        submission: '',
        submittedAt: null,
        createdAt: '2026-11-04'
      },
      {
        id: 'asg-noah-math-1',
        studentId: 'stu-noah',
        subject: 'math',
        title: 'Array City build',
        instructions: 'Build three arrays with household objects and write the multiplication sentence for each.',
        due: '2026-11-07',
        points: 10,
        status: 'submitted',
        score: null,
        feedback: '',
        submission: 'I built 3×4 with Lego, 5×2 with buttons, and 2×6 with pencils. I took photos.',
        submittedAt: '2026-11-05',
        createdAt: '2026-11-03'
      },
      {
        id: 'asg-noah-eng-1',
        studentId: 'stu-noah',
        subject: 'english',
        title: 'Story Map: The Paper Dragon',
        instructions: 'Draw the beginning, middle, and end. Write one sentence for each.',
        due: '2026-10-31',
        points: 10,
        status: 'graded',
        score: 10,
        feedback: 'Beautiful drawings and complete sentences. Watch capital letters at the start.',
        submission: 'Story map photographed and sent.',
        submittedAt: '2026-10-30',
        createdAt: '2026-10-28'
      },
      {
        id: 'asg-noah-math-2',
        studentId: 'stu-noah',
        subject: 'math',
        title: 'Times-table relay',
        instructions: 'Two minutes of 2s, 5s, and 10s. Record your score.',
        due: '2026-10-23',
        points: 10,
        status: 'graded',
        score: 9,
        feedback: 'Fast and accurate. Practise 7×3 and 8×3 this week.',
        submission: 'Score: 27 correct in two minutes.',
        submittedAt: '2026-10-22',
        createdAt: '2026-10-20'
      },
      {
        id: 'asg-liam-sci-1',
        studentId: 'stu-liam',
        subject: 'science',
        title: 'Circuit diagram practice',
        instructions: 'Draw a series circuit and a parallel circuit. Label the switch and the battery.',
        due: '2026-11-09',
        points: 15,
        status: 'submitted',
        score: null,
        feedback: '',
        submission: 'Two diagrams uploaded. The parallel one has a note about the extra wire.',
        submittedAt: '2026-11-05',
        createdAt: '2026-11-03'
      },
      {
        id: 'asg-liam-math-1',
        studentId: 'stu-liam',
        subject: 'math',
        title: 'Fraction equivalence set',
        instructions: 'Show two different ways to prove that 2/4 = 1/2.',
        due: '2026-11-09',
        points: 12,
        status: 'assigned',
        score: null,
        feedback: '',
        submission: '',
        submittedAt: null,
        createdAt: '2026-11-04'
      },
      {
        id: 'asg-nora-eng-1',
        studentId: 'stu-nora',
        subject: 'english',
        title: 'Comparative thesis draft',
        instructions: 'Draft a thesis comparing the two texts. One sentence, precise verbs, no plot summary.',
        due: '2026-11-08',
        points: 25,
        status: 'submitted',
        score: null,
        feedback: '',
        submission:
          'Both texts present memory as a form of resistance, but while one treats forgetting as loss, the other treats it as a necessary mercy.',
        submittedAt: '2026-11-05',
        createdAt: '2026-11-01'
      },
      {
        id: 'asg-nora-ib-1',
        studentId: 'stu-nora',
        subject: 'ib',
        title: 'Mock interview reflection',
        instructions: 'Write 150 words on what felt strongest and what you want to practise next.',
        due: '2026-10-30',
        points: 25,
        status: 'graded',
        score: 22,
        feedback:
          'Honest and specific. Your example about the robotics club is strong — use it earlier in the answer.',
        submission: 'Reflection submitted in the application workbook.',
        submittedAt: '2026-10-29',
        createdAt: '2026-10-26'
      },
      {
        id: 'asg-nora-sci-1',
        studentId: 'stu-nora',
        subject: 'science',
        title: 'IA research question',
        instructions: 'Write a research question, your independent variable, and the data you will collect.',
        due: '2026-11-15',
        points: 20,
        status: 'assigned',
        score: null,
        feedback: '',
        submission: '',
        submittedAt: null,
        createdAt: '2026-11-05'
      }
    ];
  }

  function seedInvoices() {
    return [
      {
        id: 'inv-1',
        familyId: 'fam-smith',
        label: 'October · Mission Month — Noah',
        amount: 128,
        due: '2026-10-02',
        status: 'paid',
        method: 'Cash in person'
      },
      {
        id: 'inv-2',
        familyId: 'fam-smith',
        label: 'October · Matrix Month — Ava',
        amount: 128,
        due: '2026-10-02',
        status: 'paid',
        method: 'Cash in person'
      },
      {
        id: 'inv-3',
        familyId: 'fam-smith',
        label: 'November · Orbital Semester — Ava',
        amount: 236,
        due: '2026-11-08',
        status: 'due',
        method: 'Cash in person'
      }
    ];
  }

  function seedRequests() {
    return [
      {
        id: 'req-demo',
        name: 'Sample parent (demo)',
        email: 'sample.parent@example.com',
        phone: '(804) 555-0117',
        student: 'Maya',
        grade: 5,
        plans: ['Grade 5 Math — Month bundle · $123'],
        total: 123,
        days: ['Tuesday', 'Thursday'],
        window: '4–6pm',
        start: 'This week',
        notes: 'Maya is strong at procedures but freezes on word problems.',
        status: 'new',
        createdAt: '2026-11-04T18:20:00.000Z',
        demo: true
      }
    ];
  }

  function seedData() {
    return {
      version: 2,
      cart: [],
      students: seedStudents(),
      assignments: seedAssignments(),
      invoices: seedInvoices(),
      requests: seedRequests()
    };
  }

  var state = loadData();

  function loadData() {
    var stored = Safe.readJSON(global.localStorage, DATA_KEY);
    if (!stored || stored.version !== 2 || !Array.isArray(stored.students)) {
      var fresh = seedData();
      Safe.writeJSON(global.localStorage, DATA_KEY, fresh);
      return fresh;
    }
    return {
      version: 2,
      cart: Array.isArray(stored.cart) ? stored.cart.filter(validCartLine) : [],
      students: stored.students,
      assignments: Array.isArray(stored.assignments) ? stored.assignments : [],
      invoices: Array.isArray(stored.invoices) ? stored.invoices : [],
      requests: Array.isArray(stored.requests) ? stored.requests : []
    };
  }

  function validCartLine(line) {
    return (
      line &&
      typeof line.key === 'string' &&
      typeof line.title === 'string' &&
      typeof line.price === 'number' &&
      typeof line.qty === 'number'
    );
  }

  function persist() {
    Safe.writeJSON(global.localStorage, DATA_KEY, state);
  }

  function subscribe(listener) {
    if (typeof listener === 'function') listeners.push(listener);
    return function unsubscribe() {
      listeners = listeners.filter(function (entry) {
        return entry !== listener;
      });
    };
  }

  function emit(type) {
    listeners.forEach(function (listener) {
      try {
        listener(type);
      } catch (error) {
        console.warn('State listener failed', error);
      }
    });
  }

  /* ------------------------------------------------------------------ Cart */

  function cart() {
    return state.cart.slice();
  }

  function addItem(code, quantity) {
    var item = Data.resolveItem(code);
    if (!item) return null;
    var qty = Safe.clamp(quantity || 1, 1, MAX_QTY);
    var existing = state.cart.filter(function (line) {
      return line.key === item.key;
    })[0];
    if (existing) {
      existing.qty = Safe.clamp(existing.qty + qty, 1, MAX_QTY);
    } else {
      state.cart.push({
        key: item.key,
        kind: item.kind,
        title: item.title,
        subtitle: item.subtitle,
        price: item.price,
        subject: item.subject,
        meta: item.meta,
        qty: qty
      });
    }
    persist();
    emit('cart');
    return item;
  }

  function setQty(key, quantity) {
    var line = state.cart.filter(function (item) {
      return item.key === key;
    })[0];
    if (!line) return;
    line.qty = Safe.clamp(quantity, 1, MAX_QTY);
    persist();
    emit('cart');
  }

  function removeItem(key) {
    state.cart = state.cart.filter(function (item) {
      return item.key !== key;
    });
    persist();
    emit('cart');
  }

  function clearCart() {
    state.cart = [];
    persist();
    emit('cart');
  }

  function cartTotal() {
    return state.cart.reduce(function (sum, line) {
      return sum + line.price * line.qty;
    }, 0);
  }

  function cartCount() {
    return state.cart.reduce(function (sum, line) {
      return sum + line.qty;
    }, 0);
  }

  /* -------------------------------------------------------------- Students */

  function students() {
    return state.students.slice();
  }

  function studentById(id) {
    return (
      state.students.filter(function (student) {
        return student.id === id;
      })[0] || null
    );
  }

  function familyStudents(familyId) {
    return state.students.filter(function (student) {
      return student.familyId === familyId;
    });
  }

  function addStudent(input) {
    if (!isInstructor()) return { ok: false, error: 'Instructor access required.' };
    var name = Safe.text(input && input.name, 80);
    var grade = Number(input && input.grade);
    var family = Safe.text(input && input.family, 60) || 'Independent';
    var guardian = Safe.text(input && input.guardian, 80);
    var email = Safe.text(input && input.email, 120);
    if (!name) return { ok: false, error: 'A student name is required.' };
    if (!Safe.isGrade(grade)) return { ok: false, error: 'Choose a grade from 1 to 8.' };
    if (email && !Safe.isEmail(email)) return { ok: false, error: 'That email address looks incomplete.' };
    var student = {
      id: Safe.uid('stu'),
      name: name,
      grade: grade,
      familyId: family.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      family: family,
      guardian: guardian || '—',
      email: email,
      subjects: ['science', 'math', 'english'],
      plan: 'No active plan',
      joined: new Date().toISOString().slice(0, 10),
      attendance: { present: 0, late: 0, absent: 0 }
    };
    state.students.push(student);
    persist();
    emit('students');
    return { ok: true, student: student };
  }

  function updateStudent(id, patch) {
    if (!isInstructor()) return { ok: false, error: 'Instructor access required.' };
    var student = studentById(id);
    if (!student) return { ok: false, error: 'Student not found.' };
    if (patch && patch.name !== undefined) {
      var name = Safe.text(patch.name, 80);
      if (!name) return { ok: false, error: 'A student name is required.' };
      student.name = name;
    }
    if (patch && patch.grade !== undefined) {
      if (!Safe.isGrade(patch.grade)) return { ok: false, error: 'Choose a grade from 1 to 8.' };
      student.grade = Number(patch.grade);
    }
    if (patch && patch.family !== undefined) student.family = Safe.text(patch.family, 60);
    if (patch && patch.plan !== undefined) student.plan = Safe.text(patch.plan, 90);
    if (patch && patch.guardian !== undefined) student.guardian = Safe.text(patch.guardian, 80);
    if (patch && patch.email !== undefined) {
      var email = Safe.text(patch.email, 120);
      if (email && !Safe.isEmail(email)) return { ok: false, error: 'That email address looks incomplete.' };
      student.email = email;
    }
    persist();
    emit('students');
    return { ok: true, student: student };
  }

  /* ----------------------------------------------------------- Assignments */

  function assignments() {
    return state.assignments.slice();
  }

  function assignmentsFor(studentId) {
    return state.assignments
      .filter(function (assignment) {
        return assignment.studentId === studentId;
      })
      .sort(function (a, b) {
        return String(a.due).localeCompare(String(b.due));
      });
  }

  function assignmentById(id) {
    return (
      state.assignments.filter(function (assignment) {
        return assignment.id === id;
      })[0] || null
    );
  }

  function addAssignment(input) {
    if (!isInstructor()) return { ok: false, error: 'Instructor access required.' };
    var student = studentById(input && input.studentId);
    if (!student) return { ok: false, error: 'Choose a student.' };
    var title = Safe.text(input.title, 110);
    if (!title) return { ok: false, error: 'Give the assignment a title.' };
    var subject = SUBJECT_KEYS.indexOf(input.subject) >= 0 ? input.subject : 'science';
    var points = Safe.clamp(input.points || 20, 1, 100);
    var due = Safe.text(input.due, 20);
    var assignment = {
      id: Safe.uid('asg'),
      studentId: student.id,
      subject: subject,
      title: title,
      instructions: Safe.multiline(input.instructions, 2000),
      due: due || new Date().toISOString().slice(0, 10),
      points: Math.round(points),
      status: 'assigned',
      score: null,
      feedback: '',
      submission: '',
      submittedAt: null,
      createdAt: new Date().toISOString()
    };
    state.assignments.push(assignment);
    persist();
    emit('assignments');
    return { ok: true, assignment: assignment };
  }

  function updateAssignment(id, patch) {
    if (!isInstructor()) return { ok: false, error: 'Instructor access required.' };
    var assignment = assignmentById(id);
    if (!assignment) return { ok: false, error: 'Assignment not found.' };
    if (patch && patch.title !== undefined) {
      var title = Safe.text(patch.title, 110);
      if (!title) return { ok: false, error: 'Give the assignment a title.' };
      assignment.title = title;
    }
    if (patch && patch.instructions !== undefined) {
      assignment.instructions = Safe.multiline(patch.instructions, 2000);
    }
    if (patch && patch.due !== undefined) assignment.due = Safe.text(patch.due, 20);
    if (patch && patch.points !== undefined) {
      assignment.points = Math.round(Safe.clamp(patch.points, 1, 100));
      if (assignment.score !== null) {
        assignment.score = Math.min(assignment.score, assignment.points);
      }
    }
    if (patch && patch.subject !== undefined && SUBJECT_KEYS.indexOf(patch.subject) >= 0) {
      assignment.subject = patch.subject;
    }
    persist();
    emit('assignments');
    return { ok: true, assignment: assignment };
  }

  function deleteAssignment(id) {
    if (!isInstructor()) return;
    state.assignments = state.assignments.filter(function (assignment) {
      return assignment.id !== id;
    });
    persist();
    emit('assignments');
  }

  function submitAssignment(id, text) {
    if (!isFamily()) return { ok: false, error: 'Family sign-in required.' };
    var assignment = assignmentById(id);
    if (!assignment) return { ok: false, error: 'Assignment not found.' };
    if (assignment.status === 'graded') return { ok: false, error: 'This assignment is already graded.' };
    var body = Safe.multiline(text, 5000);
    if (body.length < 2) return { ok: false, error: 'Add your work before submitting.' };
    assignment.submission = body;
    assignment.status = 'submitted';
    assignment.submittedAt = new Date().toISOString();
    persist();
    emit('assignments');
    return { ok: true, assignment: assignment };
  }

  function gradeAssignment(id, score, feedback) {
    if (!isInstructor()) return { ok: false, error: 'Instructor access required.' };
    var assignment = assignmentById(id);
    if (!assignment) return { ok: false, error: 'Assignment not found.' };
    var numeric = Number(score);
    if (!isFinite(numeric)) return { ok: false, error: 'Enter a numeric score.' };
    assignment.score = Math.round(Safe.clamp(numeric, 0, assignment.points));
    assignment.feedback = Safe.multiline(feedback, 1500);
    assignment.status = 'graded';
    persist();
    emit('assignments');
    return { ok: true, assignment: assignment };
  }

  function averagesFor(studentId) {
    var result = {};
    SUBJECT_KEYS.forEach(function (subject) {
      var graded = state.assignments.filter(function (assignment) {
        return (
          assignment.studentId === studentId &&
          assignment.subject === subject &&
          assignment.status === 'graded' &&
          typeof assignment.score === 'number'
        );
      });
      if (!graded.length) {
        result[subject] = null;
        return;
      }
      var ratio =
        graded.reduce(function (sum, assignment) {
          return sum + assignment.score / assignment.points;
        }, 0) / graded.length;
      result[subject] = Math.round(ratio * 100);
    });
    return result;
  }

  function overallFor(studentId) {
    var averages = averagesFor(studentId);
    var values = SUBJECT_KEYS.map(function (key) {
      return averages[key];
    }).filter(function (value) {
      return typeof value === 'number';
    });
    if (!values.length) return null;
    return Math.round(
      values.reduce(function (sum, value) {
        return sum + value;
      }, 0) / values.length
    );
  }

  function attendanceRate(student) {
    if (!student || !student.attendance) return null;
    var present = student.attendance.present || 0;
    var late = student.attendance.late || 0;
    var absent = student.attendance.absent || 0;
    var total = present + late + absent;
    if (!total) return null;
    return Math.round(((present + late) / total) * 100);
  }

  /* -------------------------------------------------------------- Requests */

  function requests() {
    return state.requests.slice().sort(function (a, b) {
      return String(b.createdAt).localeCompare(String(a.createdAt));
    });
  }

  function addRequest(input) {
    var request = {
      id: Safe.uid('req'),
      name: Safe.text(input.name, 90),
      email: Safe.text(input.email, 140),
      phone: Safe.text(input.phone, 30),
      student: Safe.text(input.student, 80),
      grade: Number(input.grade),
      plans: Array.isArray(input.plans)
        ? input.plans.map(function (plan) {
            return Safe.text(plan, 180);
          })
        : [],
      total: Number(input.total) || 0,
      days: Array.isArray(input.days)
        ? input.days.map(function (day) {
            return Safe.text(day, 20);
          })
        : [],
      window: Safe.text(input.window, 40),
      start: Safe.text(input.start, 40),
      notes: Safe.multiline(input.notes, 1200),
      status: 'new',
      createdAt: new Date().toISOString()
    };
    state.requests.push(request);
    persist();
    emit('requests');
    return request;
  }

  function updateRequestStatus(id, status) {
    var allowed = ['new', 'contacted', 'booked', 'closed'];
    var request = state.requests.filter(function (entry) {
      return entry.id === id;
    })[0];
    if (!request || allowed.indexOf(status) < 0) return false;
    request.status = status;
    persist();
    emit('requests');
    return true;
  }

  function invoicesFor(familyId) {
    return state.invoices.filter(function (invoice) {
      return invoice.familyId === familyId;
    });
  }

  /* ------------------------------------------------------------------ Auth */

  function readSessions() {
    var stored = Safe.readJSON(global.sessionStorage, SESSION_KEY);
    return stored && typeof stored === 'object' ? stored : {};
  }

  function writeSessions(sessions) {
    Safe.writeJSON(global.sessionStorage, SESSION_KEY, sessions);
  }

  function session(role) {
    var sessions = readSessions();
    var entry = sessions[role];
    if (!entry || typeof entry.at !== 'number') return null;
    if (Date.now() - entry.at > SESSION_TTL) {
      delete sessions[role];
      writeSessions(sessions);
      return null;
    }
    entry.at = Date.now();
    sessions[role] = entry;
    writeSessions(sessions);
    return entry;
  }

  function lockRemaining(role) {
    var record = attempts[role];
    if (!record) return 0;
    var remaining = record.lockUntil - Date.now();
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
  }

  function recordFailure(role) {
    var record = attempts[role];
    if (!record) return;
    record.count += 1;
    if (record.count >= MAX_ATTEMPTS) {
      record.count = 0;
      record.lockUntil = Date.now() + LOCK_MS;
    }
  }

  function resetFailures(role) {
    if (!attempts[role]) return;
    attempts[role].count = 0;
    attempts[role].lockUntil = 0;
  }

  function loginFamily(username, password) {
    var locked = lockRemaining('family');
    if (locked) {
      return { ok: false, error: 'Too many attempts. Try again in ' + locked + ' seconds.' };
    }
    var ok =
      Safe.safeEqual(username, CREDENTIALS.family.username) &&
      Safe.safeEqual(password, CREDENTIALS.family.password);
    if (!ok) {
      recordFailure('family');
      return { ok: false, error: 'Those credentials do not match. Use TEST / TEST in this demo.' };
    }
    resetFailures('family');
    var sessions = readSessions();
    sessions.family = { username: CREDENTIALS.family.username, at: Date.now() };
    writeSessions(sessions);
    return { ok: true };
  }

  function loginInstructor(username, password, secret) {
    var locked = lockRemaining('instructor');
    if (locked) {
      return { ok: false, error: 'Too many attempts. Try again in ' + locked + ' seconds.' };
    }
    var ok =
      Safe.safeEqual(username, CREDENTIALS.instructor.username) &&
      Safe.safeEqual(password, CREDENTIALS.instructor.password) &&
      Safe.safeEqual(secret, CREDENTIALS.instructor.secret);
    if (!ok) {
      recordFailure('instructor');
      return {
        ok: false,
        error: 'Username, password, and secret word must all match. Demo values are TEST.'
      };
    }
    resetFailures('instructor');
    var sessions = readSessions();
    sessions.instructor = { username: CREDENTIALS.instructor.username, at: Date.now() };
    writeSessions(sessions);
    return { ok: true };
  }

  function logout(role) {
    var sessions = readSessions();
    delete sessions[role];
    writeSessions(sessions);
  }

  function isFamily() {
    return Boolean(session('family'));
  }

  function isInstructor() {
    return Boolean(session('instructor'));
  }

  /* ----------------------------------------------------------------- Reset */

  function resetDemo() {
    state = seedData();
    persist();
    Safe.remove(global.sessionStorage, SESSION_KEY);
    emit('reset');
  }

  global.MoodyStore = {
    subscribe: subscribe,
    cart: cart,
    addItem: addItem,
    setQty: setQty,
    removeItem: removeItem,
    clearCart: clearCart,
    cartTotal: cartTotal,
    cartCount: cartCount,
    students: students,
    studentById: studentById,
    familyStudents: familyStudents,
    addStudent: addStudent,
    updateStudent: updateStudent,
    assignments: assignments,
    assignmentsFor: assignmentsFor,
    assignmentById: assignmentById,
    addAssignment: addAssignment,
    updateAssignment: updateAssignment,
    deleteAssignment: deleteAssignment,
    submitAssignment: submitAssignment,
    gradeAssignment: gradeAssignment,
    averagesFor: averagesFor,
    overallFor: overallFor,
    attendanceRate: attendanceRate,
    requests: requests,
    addRequest: addRequest,
    updateRequestStatus: updateRequestStatus,
    invoicesFor: invoicesFor,
    loginFamily: loginFamily,
    loginInstructor: loginInstructor,
    logout: logout,
    isFamily: isFamily,
    isInstructor: isInstructor,
    resetDemo: resetDemo
  };
})(window);
