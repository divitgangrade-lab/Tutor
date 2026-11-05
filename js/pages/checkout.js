/*
 * pages/checkout.js — the multi-step meeting request.
 * There is no payment step by design. The final action stores the request and
 * opens a pre-filled Gmail draft addressed to the instructor.
 */
(function (global) {
  'use strict';

  var Pages = (global.MoodyPages = global.MoodyPages || {});
  var Data = global.MoodyData;
  var Store = global.MoodyStore;
  var UI = global.MoodyUI;
  var esc = UI.esc;
  var money = UI.money;

  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'];
  var WINDOWS = ['3:00–4:30pm', '4:30–6:00pm', '6:00–7:30pm', 'Saturday morning', 'Flexible'];
  var STARTS = ['This week', 'Next week', 'Within the month', 'Flexible'];

  function stepper(step) {
    return (
      '<ol class="checkout-stepper">' +
      [
        ['Your family', 'Who is coming'],
        ['Meeting times', 'When works'],
        ['Review & send', 'No payment']
      ]
        .map(function (item, index) {
          var number = index + 1;
          return (
            '<li class="' +
            (step === number ? 'is-current ' : '') +
            (step > number ? 'is-done ' : '') +
            '"><span class="checkout-step-num">' +
            (step > number ? UI.icon('check') : number) +
            '</span><span class="checkout-step-label">' +
            esc(item[0]) +
            '<em>' +
            esc(item[1]) +
            '</em></span></li>'
          );
        })
        .join('') +
      '</ol>'
    );
  }

  function emptyCart() {
    return UI.shell({
      theme: 'neutral',
      active: '',
      html:
        '<section class="page-hero compact"><div class="container page-hero-inner">' +
        '<p class="breadcrumb"><a href="#/" data-action="goto" data-target="#/">Home</a> / Request a meeting</p>' +
        '<p class="eyebrow">Next step</p><h1 class="page-title">Your cart is empty.</h1>' +
        '<p class="page-lede">Choose a grade course or a signature plan first. Then come back here to request a time.</p>' +
        '<div class="page-actions"><a class="btn btn-ink" href="#/science" data-action="goto" data-target="#/science">Explore Science</a><a class="btn btn-quiet" href="#/math" data-action="goto" data-target="#/math">Explore Math</a><a class="btn btn-quiet" href="#/english" data-action="goto" data-target="#/english">Explore English</a><a class="btn btn-quiet" href="#/ib" data-action="goto" data-target="#/ib">Moody IB</a></div>' +
        '</div></section>'
    });
  }

  function summary() {
    var lines = Store.cart();
    return (
      '<aside class="summary-card reveal">' +
      '<p class="eyebrow">In the cart</p>' +
      '<h2 class="summary-title">Your plan</h2>' +
      '<ul class="summary-lines">' +
      lines
        .map(function (line) {
          return (
            '<li><div><p>' +
            esc(line.title) +
            '</p><span>' +
            esc(line.subtitle) +
            ' · qty ' +
            line.qty +
            '</span></div><strong>' +
            money(line.price * line.qty) +
            '</strong></li>'
          );
        })
        .join('') +
      '</ul>' +
      '<div class="summary-total"><span>Estimated total</span><strong>' +
      money(Store.cartTotal()) +
      '</strong></div>' +
      '<p class="summary-note">' +
      UI.icon('cash') +
      '<span>This is an estimate for the conversation. Nothing is charged online; payment is cash after the meeting.</span></p>' +
      '<div class="summary-next"><h3>What happens next</h3><ol><li>Your request opens a Gmail draft.</li><li>You press send — it lands in the instructor inbox.</li><li>You meet, agree on a plan, and pay cash in person.</li></ol></div>' +
      '<p class="summary-contact">Questions? <a href="mailto:' +
      esc(Data.SITE.email) +
      '">' +
      esc(Data.SITE.email) +
      '</a></p>' +
      '</aside>'
    );
  }

  function fields(draft) {
    return (
      '<div class="form-grid">' +
      '<div class="field"><label for="co-name">Parent or guardian name</label><input id="co-name" name="name" type="text" autocomplete="name" maxlength="90" required value="' +
      esc(draft.name || '') +
      '" placeholder="Jordan Smith" /></div>' +
      '<div class="field"><label for="co-email">Email</label><input id="co-email" name="email" type="email" autocomplete="email" maxlength="140" required value="' +
      esc(draft.email || '') +
      '" placeholder="you@example.com" /></div>' +
      '<div class="field"><label for="co-phone">Phone</label><input id="co-phone" name="phone" type="tel" autocomplete="tel" maxlength="24" required value="' +
      esc(draft.phone || '') +
      '" placeholder="(804) 555-0123" /></div>' +
      '<div class="field"><label for="co-student">Student name</label><input id="co-student" name="student" type="text" maxlength="80" required value="' +
      esc(draft.student || '') +
      '" placeholder="Ava" /></div>' +
      '<div class="field"><label for="co-grade">Grade</label><select id="co-grade" name="grade" required>' +
      '<option value="">Choose a grade</option>' +
      Data.GRADES.map(function (value) {
        return (
          '<option value="' +
          value +
          '"' +
          (String(draft.grade) === String(value) ? ' selected' : '') +
          '>Grade ' +
          value +
          '</option>'
        );
      }).join('') +
      '</select></div>' +
      '</div>'
    );
  }

  function stepOne(draft) {
    return (
      '<section class="checkout-step" data-step="1"' +
      (draft.step === 1 ? '' : ' hidden') +
      '>' +
      '<h2 class="checkout-step-title">Tell us who is coming.</h2>' +
      '<p class="checkout-step-lede">This is the information the instructor uses to prepare for the meeting — nothing is stored on a server.</p>' +
      fields(draft) +
      '<div class="checkout-actions"><button class="btn btn-ink" type="button" data-action="checkout-next">Continue ' +
      UI.icon('arrow') +
      '</button></div>' +
      '</section>'
    );
  }

  function stepTwo(draft) {
    return (
      '<section class="checkout-step" data-step="2"' +
      (draft.step === 2 ? '' : ' hidden') +
      '>' +
      '<h2 class="checkout-step-title">When could you meet?</h2>' +
      '<p class="checkout-step-lede">Pick the days and the window that usually work. We will confirm the exact time by email.</p>' +
      '<fieldset class="field-group"><legend>Preferred days</legend><div class="choice-row">' +
      DAYS.map(function (day) {
        var checked = draft.days && draft.days.indexOf(day) >= 0;
        return (
          '<label class="choice-chip"><input type="checkbox" name="days" value="' +
          esc(day) +
          '"' +
          (checked ? ' checked' : '') +
          ' /><span>' +
          esc(day) +
          '</span></label>'
        );
      }).join('') +
      '</div></fieldset>' +
      '<div class="form-grid">' +
      '<div class="field"><label for="co-window">Time window</label><select id="co-window" name="window"><option value="">Flexible</option>' +
      WINDOWS.map(function (item) {
        return (
          '<option value="' +
          esc(item) +
          '"' +
          (draft.window === item ? ' selected' : '') +
          '>' +
          esc(item) +
          '</option>'
        );
      }).join('') +
      '</select></div>' +
      '<div class="field"><label for="co-start">Preferred start</label><select id="co-start" name="start"><option value="">Flexible</option>' +
      STARTS.map(function (item) {
        return (
          '<option value="' +
          esc(item) +
          '"' +
          (draft.start === item ? ' selected' : '') +
          '>' +
          esc(item) +
          '</option>'
        );
      }).join('') +
      '</select></div>' +
      '</div>' +
      '<div class="field"><label for="co-notes">Anything we should know?</label><textarea id="co-notes" name="notes" rows="4" maxlength="1200" placeholder="Grade level, subject, what feels stuck, or any accommodations.">' +
      esc(draft.notes || '') +
      '</textarea></div>' +
      '<div class="checkout-actions"><button class="btn btn-quiet" type="button" data-action="checkout-back">Back</button><button class="btn btn-ink" type="button" data-action="checkout-next">Continue ' +
      UI.icon('arrow') +
      '</button></div>' +
      '</section>'
    );
  }

  function stepThree(draft) {
    var lines = Store.cart();
    return (
      '<section class="checkout-step" data-step="3"' +
      (draft.step === 3 ? '' : ' hidden') +
      '>' +
      '<h2 class="checkout-step-title">Review the request.</h2>' +
      '<p class="checkout-step-lede">Sending opens a Gmail draft. You still press send; nothing is charged and no account is created.</p>' +
      '<div class="review-grid">' +
      '<div><h3>Family</h3><p>' +
      esc(draft.name || '—') +
      '<br />' +
      esc(draft.email || '—') +
      '<br />' +
      esc(draft.phone || '—') +
      '</p></div>' +
      '<div><h3>Student</h3><p>' +
      esc(draft.student || '—') +
      '<br />Grade ' +
      esc(draft.grade || '—') +
      '</p></div>' +
      '<div><h3>Meeting</h3><p>' +
      (draft.days && draft.days.length ? esc(draft.days.join(', ')) : 'Flexible days') +
      '<br />' +
      esc(draft.window || 'Flexible window') +
      '<br />' +
      esc(draft.start || 'Flexible start') +
      '</p></div>' +
      '<div><h3>Plans</h3><p>' +
      (lines.length
        ? lines
            .map(function (line) {
              return esc(line.title) + ' × ' + line.qty;
            })
            .join('<br />')
        : '—') +
      '</p></div>' +
      '</div>' +
      (draft.notes
        ? '<div class="review-notes"><h3>Notes</h3><p>' + esc(draft.notes) + '</p></div>'
        : '') +
      '<label class="check-ack"><input type="checkbox" name="ack" required /><span>I understand this is a meeting request. Payment is cash in person after the consultation, and there is no online payment.</span></label>' +
      '<div class="checkout-actions"><button class="btn btn-quiet" type="button" data-action="checkout-back">Back</button><button class="btn btn-accent btn-lg" type="submit">Send request &amp; open Gmail ' +
      UI.icon('mail') +
      '</button></div>' +
      '<p class="checkout-fineprint">' +
      UI.icon('lock') +
      '<span>Your details stay in this browser until you send the email. This demo does not transmit data anywhere.</span></p>' +
      '</section>'
    );
  }

  Pages.checkout = function (state) {
    var cart = Store.cart();
    if (!cart.length) return emptyCart();
    var draft = (state && state.draft) || {};
    draft.step = (state && state.step) || 1;
    return UI.shell({
      theme: 'neutral',
      active: '',
      html:
        '<section class="checkout-hero"><div class="container">' +
        '<p class="breadcrumb"><a href="#/" data-action="goto" data-target="#/">Home</a> / Request a meeting</p>' +
        '<p class="eyebrow">The next step</p>' +
        '<h1 class="page-title">Request the meeting.<br /><em>Then pay in cash.</em></h1>' +
        '<p class="page-lede">Three steps and a pre-filled Gmail draft. No card fields, no online checkout, no automatic charge.</p>' +
        '</div></section>' +
        '<section class="section checkout-section"><div class="container checkout-grid">' +
        '<div class="checkout-card">' +
        stepper(draft.step) +
        '<form class="checkout-form" data-form="checkout" novalidate>' +
        stepOne(draft) +
        stepTwo(draft) +
        stepThree(draft) +
        '</form>' +
        '</div>' +
        summary() +
        '</div></section>'
    });
  };

  Pages.requestSent = function (sent) {
    return UI.shell({
      theme: 'neutral',
      active: '',
      html:
        '<section class="sent-hero"><div class="container">' +
        '<div class="sent-mark">' +
        UI.icon('check') +
        '</div>' +
        '<p class="eyebrow">Request prepared</p>' +
        '<h1 class="page-title">One press of send, and it is on its way.</h1>' +
        '<p class="page-lede">A Gmail draft should have opened in a new tab, addressed to ' +
        esc(Data.SITE.email) +
        '. If it did not, use the buttons below — the full request is ready.</p>' +
        '<div class="sent-actions">' +
        '<button class="btn btn-accent btn-lg" type="button" data-action="open-sent-gmail">' +
        UI.icon('mail') +
        ' Open Gmail draft</button>' +
        '<button class="btn btn-quiet" type="button" data-action="copy-sent-email">' +
        UI.icon('copy') +
        ' Copy the email</button>' +
        '<button class="btn btn-quiet" type="button" data-action="download-sent-email">' +
        UI.icon('download') +
        ' Download as text</button>' +
        '</div>' +
        '<div class="sent-summary"><div><span>For</span><strong>' +
        esc(sent.name) +
        '</strong></div><div><span>Student</span><strong>' +
        esc(sent.student) +
        ' · Grade ' +
        esc(sent.grade) +
        '</strong></div><div><span>Estimated total</span><strong>' +
        money(sent.total) +
        '</strong></div><div><span>Payment</span><strong>Cash in person</strong></div></div>' +
        '<div class="sent-note">' +
        UI.icon('cash') +
        '<p><strong>No payment has been taken.</strong> If you closed the Gmail tab, the draft is still available above. The instructor replies ' +
        esc(Data.SITE.responseWindow) +
        ' to confirm a time.</p></div>' +
        '<a class="text-link" href="#/" data-action="goto" data-target="#/">Return to the academy ' +
        UI.icon('arrow') +
        '</a>' +
        '</div></section>'
    });
  };

  Pages.notFound = function () {
    return UI.shell({
      theme: 'neutral',
      active: '',
      html:
        '<section class="notfound"><div class="container"><p class="eyebrow">404</p><h1 class="page-title">That room does not exist.</h1><p class="page-lede">The link may be old, or the page may have moved. Start again from the front door.</p><a class="btn btn-ink" href="#/" data-action="goto" data-target="#/">Back home</a></div></section>'
    });
  };
})(window);
