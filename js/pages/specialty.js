/*
 * pages/specialty.js — the neutral Specialty Center: focused services that are
 * not part of a weekly plan.
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
      '<section class="page-hero specialty-hero">' +
      '<canvas class="atmosphere" data-atmosphere="grid" aria-hidden="true"></canvas>' +
      '<div class="container page-hero-inner">' +
      '<p class="breadcrumb"><a href="#/" data-action="goto" data-target="#/">Home</a> / Specialty Center</p>' +
      '<p class="eyebrow">Specialty Center</p>' +
      '<h1 class="page-title">Focused help, without the weekly commitment.</h1>' +
      '<p class="page-lede">A review, an audit, a mock interview, a study system. These services exist for the moments when a full plan is more than you need — and one careful pass is exactly enough.</p>' +
      '<div class="page-actions"><button class="btn btn-ink" type="button" data-action="scroll" data-target="services">See the services ' +
      UI.icon('arrow') +
      '</button><a class="btn btn-quiet" href="#/request" data-action="goto" data-target="#/request">Request a meeting</a></div>' +
      '</div></section>'
    );
  }

  function services() {
    return (
      '<section class="section" id="services"><div class="container">' +
      UI.sectionHead(
        'The services',
        'Six ways to get unstuck.',
        'Add any service to the cart and request a time. Prices are flat, payment is cash in person, and every service includes a short written summary.'
      ) +
      '<div class="svc-grid">' +
      Data.SPECIALTY.map(function (service, index) {
        return (
          '<article class="svc-card reveal" data-tilt>' +
          '<div class="svc-top"><span class="svc-index">0' +
          (index + 1) +
          '</span><span class="svc-price">' +
          (service.price === 0 ? 'Free' : money(service.price)) +
          '</span></div>' +
          '<h3>' +
          esc(service.title) +
          '</h3>' +
          '<p class="svc-unit">' +
          esc(service.unit) +
          '</p>' +
          '<p class="svc-summary">' +
          esc(service.summary) +
          '</p>' +
          '<ul class="tick-list">' +
          service.includes
            .map(function (item) {
              return '<li>' + UI.icon('check') + '<span>' + esc(item) + '</span></li>';
            })
            .join('') +
          '</ul>' +
          '<p class="svc-meta"><strong>Best for</strong> ' +
          esc(service.bestFor) +
          '</p>' +
          '<p class="svc-meta"><strong>Turnaround</strong> ' +
          esc(service.turnaround) +
          '</p>' +
          '<div class="svc-actions">' +
          (service.price === 0
            ? '<a class="btn btn-quiet btn-sm" href="#/request" data-action="goto" data-target="#/request">Request the call</a>'
            : '<button class="btn btn-accent btn-sm" type="button" data-action="add-item" data-item="service:' +
              esc(service.id) +
              '">Add to cart · ' +
              money(service.price) +
              '</button>') +
          '<a class="text-link" href="#/request" data-action="goto" data-target="#/request">Ask first</a>' +
          '</div>' +
          '</article>'
        );
      }).join('') +
      '</div></div></section>'
    );
  }

  function process() {
    var steps = [
      {
        title: 'Send the work',
        body: 'After the meeting, share the essay, application, report cards, or question list. Everything stays between us.'
      },
      {
        title: 'Get the review',
        body: 'A written pass with margin notes, a priority list, and a short call if the service includes one.'
      },
      {
        title: 'Decide what is next',
        body: 'Sometimes it is a weekly plan. Sometimes it is one fix and a good luck. Both are honest outcomes.'
      }
    ];
    return (
      '<section class="section process-section"><div class="container">' +
      UI.sectionHead('How it works', 'Small, contained, useful.', 'No subscription trap. No automatic renewal.') +
      '<div class="process-grid">' +
      steps
        .map(function (step, index) {
          return (
            '<div class="process-step reveal"><span>0' +
            (index + 1) +
            '</span><h3>' +
            esc(step.title) +
            '</h3><p>' +
            esc(step.body) +
            '</p></div>'
          );
        })
        .join('') +
      '</div></div></section>'
    );
  }

  function note() {
    return (
      '<section class="section"><div class="container"><div class="policy-note reveal">' +
      '<div class="policy-icon">' +
      UI.icon('cash') +
      '</div><div><h3>No online payment. Ever.</h3><p>Adding a service to the cart only starts a conversation. You will meet first, agree on scope and timing, and pay cash in person. Nothing is charged by this website.</p></div>' +
      '<a class="btn btn-ink" href="#/request" data-action="goto" data-target="#/request">Request a meeting</a>' +
      '</div></div></section>'
    );
  }

  Pages.specialty = function () {
    return UI.shell({
      theme: 'neutral',
      active: 'specialty',
      html: hero() + services() + process() + note()
    });
  };
})(window);
