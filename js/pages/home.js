/*
 * pages/home.js — the storefront: hero, the three rooms, plan finder,
 * next steps, Specialty teaser, FAQ, closing call to action.
 */
(function (global) {
  'use strict';

  var Pages = (global.MoodyPages = global.MoodyPages || {});
  var Data = global.MoodyData;
  var UI = global.MoodyUI;
  var esc = UI.esc;
  var money = UI.money;

  function hero() {
    return (
      '<section class="hero-home">' +
      '<canvas class="atmosphere" data-atmosphere="grid" aria-hidden="true"></canvas>' +
      '<div class="container hero-grid">' +
      '<div class="hero-copy">' +
      '<p class="eyebrow reveal">Grades 1–8 · George H. Moody IB preparation</p>' +
      '<h1 class="hero-title reveal">Small-room tutoring.<br /><em>Big-room</em> results.</h1>' +
      '<p class="hero-lede reveal">One instructor. English, Math, and Science for grades 1–8, plus a deliberate path into Moody IB. Transparent plans, deliberate practice, and payment that stays human: meet first, pay cash in person.</p>' +
      '<div class="hero-actions reveal">' +
      '<button class="btn btn-ink btn-lg" type="button" data-action="scroll" data-target="finder">Find your plan ' +
      UI.icon('arrow') +
      '</button>' +
      '<a class="btn btn-quiet btn-lg" href="#/request" data-action="goto" data-target="#/request">Request a meeting</a>' +
      '</div>' +
      '<ul class="hero-facts reveal">' +
      '<li><strong>1:1</strong><span>every session</span></li>' +
      '<li><strong>8</strong><span>grade levels</span></li>' +
      '<li><strong>5</strong><span>plans per room</span></li>' +
      '<li><strong>$0</strong><span>paid online</span></li>' +
      '</ul>' +
      '</div>' +
      '<div class="hero-stack reveal">' +
      '<a class="stack-card theme-scifi" href="#/science" data-action="goto" data-target="#/science">' +
      '<span class="stack-index">01</span><span class="stack-name">Science</span><span class="stack-tag">The Sci-Fi Lab</span><span class="stack-price">from $20 / class</span><span class="stack-arrow">' +
      UI.icon('arrow') +
      '</span></a>' +
      '<a class="stack-card theme-matrix" href="#/math" data-action="goto" data-target="#/math">' +
      '<span class="stack-index">02</span><span class="stack-name">Math</span><span class="stack-tag">The Matrix Room</span><span class="stack-price">from $20 / class</span><span class="stack-arrow">' +
      UI.icon('arrow') +
      '</span></a>' +
      '<a class="stack-card theme-story" href="#/english" data-action="goto" data-target="#/english">' +
      '<span class="stack-index">03</span><span class="stack-name">English</span><span class="stack-tag">The Story Hall</span><span class="stack-price">from $20 / class</span><span class="stack-arrow">' +
      UI.icon('arrow') +
      '</span></a>' +
      '<a class="stack-card stack-card-ib theme-ib" href="#/ib" data-action="goto" data-target="#/ib">' +
      '<span class="stack-index">04</span><span class="stack-name">Moody IB</span><span class="stack-tag">Admissions coaching</span><span class="stack-price">from $75</span><span class="stack-arrow">' +
      UI.icon('arrow') +
      '</span></a>' +
      '</div>' +
      '</div>' +
      '<div class="container hero-foot">' +
      '<span>Now booking November</span><span class="dot"></span><span>In person around Moody · online anywhere</span><span class="dot"></span><span>No online payment</span>' +
      '</div>' +
      '</section>'
    );
  }

  function marquee() {
    var items = ['Science', 'Math', 'English', 'Moody IB', 'Specialty Center', 'Grades 1–8', 'Cash after consultation'];
    var row = items
      .map(function (item) {
        return '<span>' + esc(item) + '</span><span class="marquee-sep">✦</span>';
      })
      .join('');
    return (
      '<div class="marquee" aria-hidden="true"><div class="marquee-track">' +
      row +
      row +
      '</div></div>'
    );
  }

  function rooms() {
    var cards = [
      {
        id: 'science',
        code: 'SCI',
        name: 'Science',
        theme: 'scifi',
        tag: 'The Sci-Fi Lab',
        line: 'Missions, lab notebooks, and evidence. Science becomes something your child does, not something they memorize.',
        strands: ['Inquiry', 'Lab craft', 'Data & evidence']
      },
      {
        id: 'math',
        code: 'MTH',
        name: 'Math',
        theme: 'matrix',
        tag: 'The Matrix Room',
        line: 'Patterns, proof, and deliberate practice. We rebuild the concept until the procedure finally makes sense.',
        strands: ['Number sense', 'Fluency', 'Problem decoding']
      },
      {
        id: 'english',
        code: 'ENG',
        name: 'English',
        theme: 'story',
        tag: 'The Story Hall',
        line: 'Close reading, sentence craft, and argument. Writing that sounds like your child — and earns the marks.',
        strands: ['Close reading', 'Sentence craft', 'Argument']
      }
    ];
    return (
      '<section class="section rooms">' +
      '<div class="container">' +
      UI.sectionHead(
        'The three rooms',
        'Three rooms. One standard.',
        'Each room has its own atmosphere, its own five signature plans, and a grade course for every level from 1 to 8. Pick the room that fits; the teaching stays exacting.'
      ) +
      '<div class="room-grid">' +
      cards
        .map(function (card) {
          var subject = Data.SUBJECTS[card.id];
          return (
            '<a class="room-card theme-' +
            card.theme +
            ' reveal" href="#/' +
            card.id +
            '" data-action="goto" data-target="#/' +
            card.id +
            '">' +
            '<div class="room-top"><span class="room-code">' +
            esc(card.code) +
            '</span><span class="room-go">' +
            UI.icon('arrow') +
            '</span></div>' +
            '<h3 class="room-name">' +
            esc(card.name) +
            '<em>' +
            esc(card.tag) +
            '</em></h3>' +
            '<p class="room-line">' +
            esc(card.line) +
            '</p>' +
            '<div class="room-strands">' +
            card.strands
              .map(function (strand) {
                return '<span>' + esc(strand) + '</span>';
              })
              .join('') +
            '</div>' +
            '<div class="room-foot"><span>8 grade courses</span><span>5 signature plans</span><span>from ' +
            money(subject.prices[0]) +
            '</span></div>' +
            '</a>'
          );
        })
        .join('') +
      '</div>' +
      '<a class="ib-band theme-ib reveal" href="#/ib" data-action="goto" data-target="#/ib">' +
      '<div class="ib-band-copy"><p class="eyebrow">The fourth room</p><h3>Moody IB, held calmly.</h3><p>Application strategy, essays, activities, and interview presence — a five-plan path from first diagnostic to submission day.</p></div>' +
      '<div class="ib-band-side"><span class="ib-seal">' +
      UI.icon('crest') +
      '</span><span>5 plans</span><span>from $75</span><span class="ib-band-go">' +
      UI.icon('arrow') +
      '</span></div>' +
      '</a>' +
      '</div></section>'
    );
  }

  function finderSection(state) {
    return (
      '<section class="section finder-section" id="finder">' +
      '<div class="container finder-shell">' +
      '<div class="finder-aside reveal">' +
      '<p class="eyebrow">The plan finder</p>' +
      '<h2 class="section-title">Twenty seconds to a sensible starting point.</h2>' +
      '<p class="section-lede">Answer three small questions. We will point you to the signature plan and the grade bundle that fit — no form wall, no sales call required.</p>' +
      '<ul class="finder-list">' +
      '<li><span>01</span>Choose the room</li>' +
      '<li><span>02</span>Choose the grade</li>' +
      '<li><span>03</span>Tell us the goal</li>' +
      '</ul>' +
      '</div>' +
      '<div class="finder-card reveal" id="finder-panel">' +
      finderPanel(state) +
      '</div>' +
      '</div></section>'
    );
  }

  function finderProgress(step) {
    return (
      '<div class="finder-progress" aria-hidden="true">' +
      [1, 2, 3]
        .map(function (index) {
          return '<span class="finder-dot ' + (step >= index ? 'is-on' : '') + '"></span>';
        })
        .join('') +
      '<span class="finder-count">Step ' +
      Math.min(step, 3) +
      ' of 3</span></div>'
    );
  }

  function finderPanel(state) {
    var finder = state || {};
    var subject = finder.subject;
    var grade = finder.grade;
    var goal = finder.goal;
    var step = !subject ? 1 : !grade ? 2 : subject !== 'ib' && !goal ? 3 : 4;

    if (step === 1) {
      var options = [
        { id: 'science', label: 'Science', tag: 'The Sci-Fi Lab', desc: 'Experiments, evidence, and lab notebooks.' },
        { id: 'math', label: 'Math', tag: 'The Matrix Room', desc: 'Patterns, fluency, and problem decoding.' },
        { id: 'english', label: 'English', tag: 'The Story Hall', desc: 'Close reading, writing, and argument.' },
        { id: 'ib', label: 'Moody IB', tag: 'Admissions coaching', desc: 'Essays, activities, interviews, readiness.' }
      ];
      return (
        finderProgress(1) +
        '<h3 class="finder-question">Which room is the right fit?</h3>' +
        '<div class="finder-options finder-options-subject">' +
        options
          .map(function (option) {
            return (
              '<button class="finder-option theme-' +
              (option.id === 'ib' ? 'ib' : Data.SUBJECTS[option.id].theme) +
              '" type="button" data-action="finder-pick" data-key="subject" data-value="' +
              option.id +
              '"><span class="finder-option-label">' +
              esc(option.label) +
              '</span><span class="finder-option-tag">' +
              esc(option.tag) +
              '</span><span class="finder-option-desc">' +
              esc(option.desc) +
              '</span></button>'
            );
          })
          .join('') +
        '</div>'
      );
    }

    if (step === 2) {
      var grades = subject === 'ib' ? [6, 7, 8] : Data.GRADES;
      return (
        finderProgress(2) +
        '<h3 class="finder-question">Which grade is your child in?</h3>' +
        '<p class="finder-hint">' +
        (subject === 'ib'
          ? 'Moody IB coaching is built for grades 6–8 applicants.'
          : 'Every grade has its own course, focus, and single-class price.') +
        '</p>' +
        '<div class="finder-options finder-options-grade">' +
        grades
          .map(function (value) {
            return (
              '<button class="finder-grade" type="button" data-action="finder-pick" data-key="grade" data-value="' +
              value +
              '"><span>Grade</span><strong>' +
              value +
              '</strong></button>'
            );
          })
          .join('') +
        '</div>' +
        '<button class="finder-back" type="button" data-action="finder-back">' +
        UI.icon('arrow') +
        ' Back</button>'
      );
    }

    if (step === 3) {
      return (
        finderProgress(3) +
        '<h3 class="finder-question">What are we aiming for this term?</h3>' +
        '<div class="finder-options finder-options-goal">' +
        Data.GOALS.map(function (option) {
          return (
            '<button class="finder-goal" type="button" data-action="finder-pick" data-key="goal" data-value="' +
            option.id +
            '"><strong>' +
            esc(option.label) +
            '</strong><span>' +
            esc(option.detail) +
            '</span></button>'
          );
        }).join('') +
        '</div>' +
        '<button class="finder-back" type="button" data-action="finder-back">' +
        UI.icon('arrow') +
        ' Back</button>'
      );
    }

    return finderResult(finder);
  }

  function finderResult(finder) {
    var subject = finder.subject;
    var grade = Number(finder.grade);
    var goal = finder.goal || 'keep-pace';
    var primary;
    var secondary;
    var copy;

    if (subject === 'ib') {
      primary = Data.planById(goal === 'accelerate' ? 'ib-candidate-sprint' : 'ib-application-studio');
      var ibDiagnostic = Data.planById('ib-applicant-diagnostic');
      secondary = {
        title: ibDiagnostic.title,
        subtitle: ibDiagnostic.subtitle + ' · ' + ibDiagnostic.unit,
        price: ibDiagnostic.price,
        code: 'plan:' + ibDiagnostic.id
      };
      copy =
        'Start with the application work, and use the diagnostic to confirm timing and fit. If you are early in the process, reverse the order.';
    } else {
      var subjectData = Data.SUBJECTS[subject];
      var plans = Data.plansFor(subject);
      if (goal === 'ib') primary = plans[plans.length - 1];
      else if (goal === 'accelerate') primary = plans.filter(function (plan) { return plan.sessions >= 8; })[0] || plans[2];
      else primary = plans.filter(function (plan) { return plan.featured; })[0] || plans[1];

      var course = Data.courseBy(subject, grade);
      var bundleKind = goal === 'accelerate' || goal === 'ib' ? 'term' : 'month';
      var bundle = bundleKind === 'month' ? course.month : course.term;
      secondary = {
        title: 'Grade ' + grade + ' ' + subjectData.name,
        subtitle: bundle.sessions + ' weekly classes · save ' + money(bundle.save),
        price: bundle.price,
        code: 'course:' + subject + ':' + grade + ':' + bundleKind
      };
      copy =
        'Pair the signature plan with the grade course for the strongest start: the plan gives structure, the grade course keeps the weekly work aligned to class.';
    }

    var primaryItem = {
      title: primary.title,
      subtitle: primary.subtitle + ' · ' + primary.unit,
      price: primary.price,
      code: 'plan:' + primary.id
    };

    return (
      '<div class="finder-result">' +
      '<div class="finder-result-head"><div><p class="eyebrow">Your best starting point</p><h3 class="finder-question">' +
      esc(primary.title) +
      '</h3><p class="finder-hint">' +
      esc(copy) +
      '</p></div><button class="finder-restart" type="button" data-action="finder-reset">Start over</button></div>' +
      '<div class="finder-result-grid">' +
      miniPlan(primaryItem, 'Signature plan') +
      miniPlan(secondary, 'Weekly rhythm') +
      '</div>' +
      '<div class="finder-result-actions">' +
      '<a class="btn btn-ink" href="#/' +
      (subject === 'ib' ? 'ib' : subject) +
      '" data-action="goto" data-target="#/' +
      (subject === 'ib' ? 'ib' : subject) +
      '">See the full room ' +
      UI.icon('arrow') +
      '</a>' +
      '<a class="btn btn-quiet" href="#/request" data-action="goto" data-target="#/request">Request a meeting</a>' +
      '</div>' +
      '</div>'
    );
  }

  function miniPlan(item, label) {
    return (
      '<article class="mini-plan">' +
      '<p class="eyebrow">' +
      esc(label) +
      '</p>' +
      '<h4>' +
      esc(item.title) +
      '</h4>' +
      '<p>' +
      esc(item.subtitle) +
      '</p>' +
      '<div class="mini-plan-foot"><strong>' +
      money(item.price) +
      '</strong><button class="btn btn-accent btn-sm" type="button" data-action="add-item" data-item="' +
      esc(item.code) +
      '">Add</button></div>' +
      '</article>'
    );
  }

  function nextSteps() {
    return (
      '<section class="section steps-section">' +
      '<div class="container">' +
      UI.sectionHead(
        'Next steps',
        'A short path from browsing to the first lesson.',
        'No checkout maze. No online payment. Four steps, all reversible until the meeting.'
      ) +
      '<div class="steps-grid">' +
      Data.STEPS.map(function (step, index) {
        return (
          '<details class="step-item reveal"' +
          (index === 0 ? ' open' : '') +
          '><summary><span class="step-number">0' +
          (index + 1) +
          '</span><span class="step-title">' +
          esc(step.title) +
          '</span><span class="step-plus">' +
          UI.icon('plus') +
          '</span></summary><p>' +
          esc(step.body) +
          '</p></details>'
        );
      }).join('') +
      '</div>' +
      '</div></section>'
    );
  }

  function specialtyTeaser() {
    return (
      '<section class="section specialty-teaser">' +
      '<div class="container teaser-grid">' +
      '<div class="teaser-copy reveal">' +
      '<p class="eyebrow">Specialty Center</p>' +
      '<h2 class="section-title">Sometimes the right help is one careful conversation.</h2>' +
      '<p class="section-lede">Application reviews, essay edits, study systems, academic audits — focused services for families who do not need a weekly plan, just the right set of eyes.</p>' +
      '<a class="btn btn-ink" href="#/specialty" data-action="goto" data-target="#/specialty">Open the Specialty Center ' +
      UI.icon('arrow') +
      '</a>' +
      '</div>' +
      '<ul class="teaser-list reveal">' +
      [
        ['Study Strategy Session', '$45'],
        ['IB Application Review', '$60'],
        ['Essay & Writing Review', '$55'],
        ['Academic Audit', '$40'],
        ['Parent Strategy Consult', 'Free']
      ]
        .map(function (item) {
          return '<li><span>' + esc(item[0]) + '</span><strong>' + esc(item[1]) + '</strong></li>';
        })
        .join('') +
      '</ul>' +
      '</div></section>'
    );
  }

  function faq() {
    return (
      '<section class="section faq-section">' +
      '<div class="container faq-grid">' +
      '<div class="faq-intro reveal"><p class="eyebrow">Straight answers</p><h2 class="section-title">The questions parents actually ask.</h2><p class="section-lede">If yours is not here, request a meeting and ask it directly.</p><a class="text-link" href="#/request" data-action="goto" data-target="#/request">Request a meeting ' +
      UI.icon('arrow') +
      '</a></div>' +
      '<div class="faq-list">' +
      Data.FAQ.map(function (entry, index) {
        return (
          '<details class="faq-item reveal"' +
          (index === 0 ? ' open' : '') +
          '><summary>' +
          esc(entry.q) +
          '<span class="faq-plus">' +
          UI.icon('plus') +
          '</span></summary><p>' +
          esc(entry.a) +
          '</p></details>'
        );
      }).join('') +
      '</div>' +
      '</div></section>'
    );
  }

  function closing() {
    return (
      '<section class="cta-band">' +
      '<canvas class="atmosphere" data-atmosphere="ib" aria-hidden="true"></canvas>' +
      '<div class="container cta-inner reveal">' +
      '<p class="eyebrow">The next step is a conversation</p>' +
      '<h2 class="cta-title">Build the plan. Then meet the person who teaches it.</h2>' +
      '<p class="cta-lede">Add what fits, request a time, and pay nothing until we have met. Cash after the consultation — always.</p>' +
      '<div class="cta-actions"><a class="btn btn-light btn-lg" href="#/request" data-action="goto" data-target="#/request">Request a meeting ' +
      UI.icon('arrow') +
      '</a><a class="btn btn-outline-light btn-lg" href="#/specialty" data-action="goto" data-target="#/specialty">Browse Specialty</a></div>' +
      '<p class="cta-foot">' +
      esc(Data.SITE.hours) +
      ' · ' +
      esc(Data.SITE.email) +
      '</p>' +
      '</div></section>'
    );
  }

  Pages.home = function (finderState) {
    return UI.shell({
      theme: 'neutral',
      active: '',
      html:
        hero() +
        marquee() +
        rooms() +
        finderSection(finderState) +
        nextSteps() +
        specialtyTeaser() +
        faq() +
        closing()
    });
  };

  Pages.finderPanel = finderPanel;
})(window);
