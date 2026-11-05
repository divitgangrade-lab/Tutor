/*
 * pages/hubs.js — Science, Math, English and Moody IB.
 * Each room gets its own atmosphere, grade ladder, bundle calculator, and five
 * signature plans. All prices come from data.js; nothing is hard-coded twice.
 */
(function (global) {
  'use strict';

  var Pages = (global.MoodyPages = global.MoodyPages || {});
  var Data = global.MoodyData;
  var UI = global.MoodyUI;
  var esc = UI.esc;
  var money = UI.money;

  function hubNav(subjectId) {
    var items = [
      ['overview', 'Overview'],
      ['grades', 'Grade courses'],
      ['bundles', 'Bundles'],
      ['plans', 'Signature plans'],
      ['steps', 'Next steps']
    ];
    return (
      '<div class="hub-nav"><div class="container hub-nav-inner">' +
      '<span class="hub-nav-label">' +
      esc(Data.SUBJECTS[subjectId].name) +
      '</span>' +
      items
        .map(function (item) {
          return (
            '<button class="hub-nav-link" type="button" data-action="scroll" data-target="hub-' +
            item[0] +
            '">' +
            esc(item[1]) +
            '</button>'
          );
        })
        .join('') +
      '<button class="hub-nav-cart" type="button" data-action="open-cart">' +
      UI.icon('cart') +
      ' Cart</button>' +
      '</div></div>'
    );
  }

  function hero(subject) {
    return (
      '<section class="hub-hero">' +
      '<canvas class="atmosphere" data-atmosphere="' +
      subject.theme +
      '" aria-hidden="true"></canvas>' +
      '<div class="container hub-hero-inner">' +
      '<p class="breadcrumb"><a href="#/" data-action="goto" data-target="#/">Home</a> / ' +
      esc(subject.name) +
      '</p>' +
      '<div class="hub-hero-grid">' +
      '<div class="hub-hero-copy">' +
      '<p class="eyebrow">' +
      esc(subject.kicker) +
      ' · ' +
      esc(subject.code) +
      '</p>' +
      '<h1 class="hub-title">' +
      esc(subject.name) +
      '<span>' +
      esc(subject.tagline) +
      '</span></h1>' +
      '<p class="hub-lede">' +
      esc(subject.lede) +
      '</p>' +
      '<div class="hub-actions"><button class="btn btn-accent btn-lg" type="button" data-action="scroll" data-target="hub-grades">See every grade ' +
      UI.icon('arrow') +
      '</button><button class="btn btn-outline btn-lg" type="button" data-action="scroll" data-target="hub-plans">The five plans</button></div>' +
      '<ul class="hub-vibes">' +
      subject.vibes
        .map(function (vibe) {
          return '<li>' + esc(vibe) + '</li>';
        })
        .join('') +
      '</ul>' +
      '</div>' +
      '<div class="hub-sigil" aria-hidden="true">' +
      '<span class="sigil-ring sigil-ring-1"></span><span class="sigil-ring sigil-ring-2"></span><span class="sigil-ring sigil-ring-3"></span>' +
      '<span class="sigil-code">' +
      esc(subject.code) +
      '</span><span class="sigil-word">' +
      esc(subject.kicker.replace('The ', '')) +
      '</span>' +
      '</div>' +
      '</div>' +
      '<ul class="hub-facts">' +
      '<li><strong>1–8</strong><span>Grade courses</span></li>' +
      '<li><strong>' +
      money(subject.prices[0]) +
      '</strong><span>Single class, grade 1</span></li>' +
      '<li><strong>5</strong><span>Signature plans</span></li>' +
      '<li><strong>10–15%</strong><span>Bundle savings, capped</span></li>' +
      '</ul>' +
      '</div></section>'
    );
  }

  function overview(subject) {
    return (
      '<section class="section hub-section" id="hub-overview"><div class="container">' +
      UI.sectionHead(
        'The approach',
        'What we actually work on.',
        'Four strands run through every grade. The vocabulary gets harder; the habits stay the same.'
      ) +
      '<div class="strand-grid">' +
      subject.strands
        .map(function (strand, index) {
          return (
            '<article class="strand-card reveal" data-tilt><span class="strand-index">0' +
            (index + 1) +
            '</span><h3>' +
            esc(strand.title) +
            '</h3><p>' +
            esc(strand.body) +
            '</p></article>'
          );
        })
        .join('') +
      '</div>' +
      '</div></section>'
    );
  }

  function gradeCards(subject) {
    var courses = Data.COURSES.filter(function (course) {
      return course.subject === subject.id;
    });
    return courses
      .map(function (course) {
        return (
          '<article class="grade-card reveal">' +
          '<div class="grade-head"><span class="grade-label">Grade ' +
          String(course.grade).padStart(2, '0') +
          '</span><span class="grade-single">' +
          money(course.single) +
          '<em>/class</em></span></div>' +
          '<h3>' +
          esc(course.focus) +
          '</h3>' +
          '<p>' +
          esc(course.detail) +
          '</p>' +
          '<div class="grade-bundles"><span>Month <strong>' +
          money(course.month.price) +
          '</strong></span><span>Term <strong>' +
          money(course.term.price) +
          '</strong></span></div>' +
          '<div class="grade-actions">' +
          '<button class="btn btn-accent btn-sm" type="button" data-action="add-item" data-item="course:' +
          esc(subject.id) +
          ':' +
          course.grade +
          ':single">Single · ' +
          money(course.single) +
          '</button>' +
          '<button class="btn btn-quiet btn-sm" type="button" data-action="add-item" data-item="course:' +
          esc(subject.id) +
          ':' +
          course.grade +
          ':month">Month · ' +
          money(course.month.price) +
          '</button>' +
          '</div></article>'
        );
      })
      .join('');
  }

  function grades(subject) {
    return (
      '<section class="section hub-section" id="hub-grades"><div class="container">' +
      UI.sectionHead(
        'Grade courses',
        'A course for every grade.',
        'Single classes are 55 minutes, 1:1, and priced by grade. Add a month or a term when you want the rhythm held for you.'
      ) +
      '<div class="grade-grid">' +
      gradeCards(subject) +
      '</div>' +
      '<p class="fine-print">Grade pricing for ' +
      esc(subject.name) +
      ' starts at ' +
      money(subject.prices[0]) +
      ' for grade 1 and rises with the level of preparation. Bundle math is shown below — discounts are capped at 15%, so no bundle falls below 85% of the single-class value.</p>' +
      '</div></section>'
    );
  }

  function bundleCalc(subject, grade) {
    var course = Data.courseBy(subject.id, grade) || Data.courseBy(subject.id, 4);
    var month = course.month;
    var term = course.term;
    return (
      '<article class="bundle-card"><p class="bundle-tag">Pay as you go</p><h3>Single class</h3><p class="bundle-price">' +
      money(course.single) +
      '<span>one 55-minute class</span></p><p class="bundle-desc">Maximum flexibility. Book when you need it, no commitment.</p><ul class="bundle-list"><li>1:1 session</li><li>Feedback recap</li><li>No bundle discount</li></ul><button class="btn btn-quiet btn-block" type="button" data-action="add-item" data-item="course:' +
      esc(subject.id) +
      ':' +
      course.grade +
      ':single">Add single class</button></article>' +
      '<article class="bundle-card"><p class="bundle-tag">Save 10%</p><h3>' +
      esc(month.label) +
      '</h3><p class="bundle-price">' +
      money(month.price) +
      '<span>' +
      month.sessions +
      ' weekly classes</span></p><p class="bundle-was">' +
      money(month.full) +
      ' — you save ' +
      money(month.save) +
      '</p><p class="bundle-desc">One month of weekly rhythm. The most popular way to start.</p><ul class="bundle-list"><li>' +
      month.sessions +
      ' × 55-minute classes</li><li>Weekly parent recap</li><li>Homework reviewed</li></ul><button class="btn btn-accent btn-block" type="button" data-action="add-item" data-item="course:' +
      esc(subject.id) +
      ':' +
      course.grade +
      ':month">Add month bundle</button></article>' +
      '<article class="bundle-card is-featured"><p class="bundle-tag">Save 15%</p><h3>' +
      esc(term.label) +
      '</h3><p class="bundle-price">' +
      money(term.price) +
      '<span>' +
      term.sessions +
      ' classes</span></p><p class="bundle-was">' +
      money(term.full) +
      ' — you save ' +
      money(term.save) +
      '</p><p class="bundle-desc">A full term of momentum, mid-term and final reports included.</p><ul class="bundle-list"><li>' +
      term.sessions +
      ' × 55-minute classes</li><li>Mid-term and final report</li><li>Priority email support</li></ul><button class="btn btn-accent btn-block" type="button" data-action="add-item" data-item="course:' +
      esc(subject.id) +
      ':' +
      course.grade +
      ':term">Add term bundle</button></article>'
    );
  }

  function bundles(subject, grade) {
    return (
      '<section class="section hub-section" id="hub-bundles"><div class="container">' +
      UI.sectionHead(
        'Bundles',
        'The honest bundle math.',
        'Choose a grade to see the real numbers. Every bundle is calculated from the single-class rate with a hard discount cap — the teaching is never the thing that gets marked down.'
      ) +
      '<div class="bundle-shell reveal">' +
      '<div class="bundle-controls">' +
      '<p class="eyebrow">Bundle calculator</p>' +
      '<h3>Pick the grade.</h3>' +
      '<div class="bundle-chips">' +
      Data.GRADES.map(function (value) {
        return (
          '<button class="bundle-chip ' +
          (value === grade ? 'is-active' : '') +
          '" type="button" data-action="bundle-grade" data-subject="' +
          esc(subject.id) +
          '" data-grade="' +
          value +
          '" aria-pressed="' +
          (value === grade ? 'true' : 'false') +
          '">' +
          value +
          '</button>'
        );
      }).join('') +
      '</div>' +
      '<p class="bundle-note">' +
      UI.icon('cash') +
      '<span>A four-class month takes 10% off; an eight-class term takes 15% off. Both are capped, so every bundle stays above 85% of list.</span></p>' +
      '</div>' +
      '<div class="bundle-cards" id="bundle-calc">' +
      bundleCalc(subject, grade) +
      '</div>' +
      '</div></div></section>'
    );
  }

  function plans(subject) {
    var list = Data.plansFor(subject.id);
    return (
      '<section class="section hub-section" id="hub-plans"><div class="container">' +
      UI.sectionHead(
        'Signature plans',
        'Five ways into the work.',
        'Each plan has a defined rhythm, a written arc, and a clear finish line. Open any plan for the full specification before you add it.'
      ) +
      '<div class="plan-grid">' +
      list
        .map(function (plan) {
          return UI.planCard(plan);
        })
        .join('') +
      '</div></div></section>'
    );
  }

  function sessionStrip(subject) {
    var steps = [
      ['Warm-up', 'A short problem worth arguing about — no pressure, just thinking out loud.'],
      ['Diagnostic', 'Find the exact concept or habit that is blocking the next step.'],
      ['Deliberate work', 'One idea, practised properly, with feedback in the moment.'],
      ['Recap & handoff', 'A written note for the parent and a small, specific practice task.']
    ];
    return (
      '<section class="section session-section"><div class="container">' +
      UI.sectionHead('Inside a session', 'Fifty-five minutes, no filler.', 'The shape is deliberately boring. The work inside it is not.') +
      '<div class="session-strip">' +
      steps
        .map(function (step, index) {
          return (
            '<div class="session-step reveal"><span class="session-time">' +
            (index === 0 ? '0–10' : index === 1 ? '10–20' : index === 2 ? '20–45' : '45–55') +
            ' min</span><h3>' +
            esc(step[0]) +
            '</h3><p>' +
            esc(step[1]) +
            '</p></div>'
          );
        })
        .join('') +
      '</div></div></section>'
    );
  }

  function nextSteps(subject) {
    var items = [
      ['Choose a grade course', 'Start at this grade and move up when the work is genuinely mastered.', 'hub-grades'],
      ['Add a signature plan', 'Structure around the sessions: diagnostics, notebooks, reports, and an arc.', 'hub-plans'],
      ['Request the meeting', 'Tell us about your child and the times that work. The request opens a pre-filled Gmail draft.', ''],
      ['Meet, agree, begin', 'Confirm fit, agree a cash schedule, and open the portal for assignments and grades.', '']
    ];
    return (
      '<section class="section hub-section" id="hub-steps"><div class="container">' +
      UI.sectionHead('Next steps', 'Four steps. No checkout maze.', 'Nothing is charged online. The cart is a conversation starter.') +
      '<ol class="hub-step-list">' +
      items
        .map(function (item, index) {
          return (
            '<li class="hub-step reveal"><span class="hub-step-number">0' +
            (index + 1) +
            '</span><div><h3>' +
            esc(item[0]) +
            '</h3><p>' +
            esc(item[1]) +
            '</p></div>' +
            (item[2]
              ? '<button class="hub-step-go" type="button" data-action="scroll" data-target="' +
                item[2] +
                '" aria-label="Go to section">' +
                UI.icon('arrow') +
                '</button>'
              : '<a class="hub-step-go" href="#/request" data-action="goto" data-target="#/request" aria-label="Request a meeting">' +
                UI.icon('arrow') +
                '</a>') +
            '</li>'
          );
        })
        .join('') +
      '</ol></div></section>'
    );
  }

  function hubCta(subject) {
    return (
      '<section class="hub-cta"><div class="container hub-cta-inner reveal">' +
      '<p class="eyebrow">' +
      esc(subject.kicker) +
      '</p><h2>Start with the grade. Add structure only where it helps.</h2>' +
      '<div class="hub-cta-actions"><a class="btn btn-accent btn-lg" href="#/request" data-action="goto" data-target="#/request">Request a meeting ' +
      UI.icon('arrow') +
      '</a><button class="btn btn-outline btn-lg" type="button" data-action="open-cart">Open cart</button></div>' +
      '</div></section>'
    );
  }

  Pages.hub = function (subjectId, options) {
    var subject = Data.SUBJECTS[subjectId];
    if (!subject) return Pages.notFound();
    var grade = (options && options.grade) || 4;
    return UI.shell({
      theme: subject.theme,
      active: subjectId,
      html:
        hero(subject) +
        hubNav(subjectId) +
        overview(subject) +
        grades(subject) +
        bundles(subject, grade) +
        plans(subject) +
        sessionStrip(subject) +
        nextSteps(subject) +
        hubCta(subject)
    });
  };

  Pages.bundleCalc = function (subjectId, grade) {
    var subject = Data.SUBJECTS[subjectId];
    if (!subject) return '';
    return bundleCalc(subject, Number(grade) || 4);
  };

  /* ------------------------------------------------------------------ Moody IB */

  function ibHero() {
    return (
      '<section class="hub-hero ib-hero">' +
      '<canvas class="atmosphere" data-atmosphere="ib" aria-hidden="true"></canvas>' +
      '<div class="container hub-hero-inner">' +
      '<p class="breadcrumb"><a href="#/" data-action="goto" data-target="#/">Home</a> / Moody IB</p>' +
      '<div class="hub-hero-grid">' +
      '<div class="hub-hero-copy">' +
      '<p class="eyebrow">Admissions coaching · IB</p>' +
      '<h1 class="hub-title">Moody IB<span>A calmer, clearer path into the room.</span></h1>' +
      '<p class="hub-lede">' +
      esc(Data.IB.lede) +
      '</p>' +
      '<div class="hub-actions"><a class="btn btn-accent btn-lg" href="#/request" data-action="goto" data-target="#/request">Request a diagnostic ' +
      UI.icon('arrow') +
      '</a><button class="btn btn-outline btn-lg" type="button" data-action="scroll" data-target="hub-ib-plans">See the five plans</button></div>' +
      '<ul class="hub-vibes"><li>Application strategy</li><li>Essays & short answers</li><li>Interview presence</li></ul>' +
      '</div>' +
      '<div class="hub-sigil ib-sigil" aria-hidden="true"><span class="sigil-ring sigil-ring-1"></span><span class="sigil-ring sigil-ring-2"></span><span class="sigil-ring sigil-ring-3"></span><span class="sigil-crest">' +
      UI.icon('crest') +
      '</span><span class="sigil-word">Moody IB</span></div>' +
      '</div>' +
      '<ul class="hub-facts"><li><strong>5</strong><span>Coaching plans</span></li><li><strong>' +
      money(75) +
      '</strong><span>Starting diagnostic</span></li><li><strong>8</strong><span>Week application arc</span></li><li><strong>1:1</strong><span>Every session</span></li></ul>' +
      '</div></section>'
    );
  }

  function ibIntro() {
    return (
      '<section class="section hub-section" id="hub-overview"><div class="container">' +
      UI.sectionHead(
        'The approach',
        'The application is an argument. We help you make it well.',
        'Moody IB admission is not a lottery and it is not a performance. It is a case built from real evidence: what your child has done, what they can do next, and why this school is the right room for it.'
      ) +
      '<div class="ib-who">' +
      [
        ['The strong student with a thin file', 'Grades are there, but the activities and essays do not yet tell a coherent story. We build the through-line.'],
        ['The late starter', 'The deadline is close and the drafts are scattered. We prioritise ruthlessly and finish cleanly.'],
        ['The anxious interviewer', 'The writing is fine; the room is terrifying. We rehearse until the conversation feels familiar.']
      ]
        .map(function (item, index) {
          return (
            '<article class="ib-who-card reveal"><span>0' +
            (index + 1) +
            '</span><h3>' +
            esc(item[0]) +
            '</h3><p>' +
            esc(item[1]) +
            '</p></article>'
          );
        })
        .join('') +
      '</div></div></section>'
    );
  }

  function ibTimeline() {
    return (
      '<section class="section ib-timeline-section"><div class="container">' +
      UI.sectionHead('The eight-week arc', 'A timeline you can actually hold.', 'Plans flex around the real deadline, but the sequence rarely changes.') +
      '<div class="ib-timeline">' +
      Data.IB.timeline
        .map(function (step, index) {
          return (
            '<div class="ib-timeline-step reveal"><span class="ib-when">' +
            esc(step.when) +
            '</span><span class="ib-dot"></span><h3>' +
            esc(step.title) +
            '</h3><p>' +
            esc(step.body) +
            '</p><span class="ib-order">0' +
            (index + 1) +
            '</span></div>'
          );
        })
        .join('') +
      '</div></div></section>'
    );
  }

  function ibPlans() {
    return (
      '<section class="section hub-section" id="hub-ib-plans"><div class="container">' +
      UI.sectionHead('The five plans', 'Choose the amount of holding you need.', 'Start with the diagnostic if you are unsure. The other plans assume you already know the target and the deadline.') +
      '<div class="plan-grid">' +
      Data.plansFor('ib')
        .map(function (plan) {
          return UI.planCard(plan);
        })
        .join('') +
      '</div></div></section>'
    );
  }

  function ibReview() {
    return (
      '<section class="section ib-review-section"><div class="container ib-review-grid">' +
      '<div class="ib-review-copy reveal"><p class="eyebrow">What we review</p><h2 class="section-title">Every piece, in one place.</h2><p class="section-lede">Bring the whole file. We will read it the way an admissions committee reads it: quickly, skeptically, and looking for a reason to remember you.</p><a class="btn btn-accent" href="#/request" data-action="goto" data-target="#/request">Start with a diagnostic ' +
      UI.icon('arrow') +
      '</a></div>' +
      '<ul class="ib-checklist reveal">' +
      ['Personal statement and short answers', 'Activities list and evidence', 'Grades and academic trajectory', 'Teacher recommendations and fit', 'Interview presence and follow-up', 'Submission checklist and timing']
        .map(function (item) {
          return '<li>' + UI.icon('check') + '<span>' + esc(item) + '</span></li>';
        })
        .join('') +
      '</ul></div></section>'
    );
  }

  function ibSteps() {
    return (
      '<section class="section hub-section"><div class="container">' +
      UI.sectionHead('Next steps', 'From first conversation to submission.', 'No online payment at any point. The cart starts a meeting; the meeting decides the plan.') +
      '<ol class="hub-step-list">' +
      [
        ['Request the diagnostic', 'A 60-minute conversation with the student and, if they wish, a parent.'],
        ['Receive the readiness report', 'A written snapshot within 24 hours: strengths, gaps, timing, and the eight-week plan.'],
        ['Choose the coaching plan', 'Application Studio, Interview Intensive, Subject Readiness, or the full Candidate Sprint.'],
        ['Meet, agree, begin', 'Confirm the schedule and the cash payment plan in person. Then the work starts.']
      ]
        .map(function (item, index) {
          return (
            '<li class="hub-step reveal"><span class="hub-step-number">0' +
            (index + 1) +
            '</span><div><h3>' +
            esc(item[0]) +
            '</h3><p>' +
            esc(item[1]) +
            '</p></div>' +
            (index === 0
              ? '<a class="hub-step-go" href="#/request" data-action="goto" data-target="#/request" aria-label="Request the diagnostic">' +
                UI.icon('arrow') +
                '</a>'
              : '') +
            '</li>'
          );
        })
        .join('') +
      '</ol></div></section>'
    );
  }

  function ibSpecialty() {
    return (
      '<section class="section"><div class="container"><div class="policy-note reveal">' +
      '<div class="policy-icon">' +
      UI.icon('book') +
      '</div><div><h3>Only need a second set of eyes?</h3><p>The Specialty Center offers a stand-alone IB Application Review and Essay Review — no coaching plan required.</p></div>' +
      '<a class="btn btn-quiet" href="#/specialty" data-action="goto" data-target="#/specialty">Open Specialty Center</a>' +
      '</div></div></section>'
    );
  }

  Pages.ib = function () {
    return UI.shell({
      theme: 'ib',
      active: 'ib',
      html:
        ibHero() +
        ibIntro() +
        ibTimeline() +
        ibPlans() +
        ibReview() +
        ibSteps() +
        ibSpecialty() +
        '<section class="hub-cta"><div class="container hub-cta-inner reveal"><p class="eyebrow">Moody IB</p><h2>The application is a conversation. Start having it earlier.</h2><div class="hub-cta-actions"><a class="btn btn-accent btn-lg" href="#/request" data-action="goto" data-target="#/request">Request a meeting ' +
        UI.icon('arrow') +
        '</a><a class="btn btn-outline btn-lg" href="#/specialty" data-action="goto" data-target="#/specialty">See application review</a></div></div></section>'
    });
  };
})(window);
