const sciencePlans = [
  {
    id: 'science-lab',
    title: 'Sci-Fi Lab Booster',
    price: '$89',
    theme: 'science',
    summary: 'Core scientific inquiry and lab confidence building for students ages 7-12.',
    features: ['Lab notebook routines', 'Observation and evidence', 'STEM confidence building', 'Weekly mission review'],
    details: {
      focus: 'Science inquiry and application',
      contact: '2 sessions a week',
      policy: 'Cash payment after consultation',
      goals: ['Build confidence in experiments', 'Strengthen science vocabulary', 'Track lab-skills progress']
    }
  },
  {
    id: 'science-physics',
    title: 'Orbital Physics Track',
    price: '$109',
    theme: 'science',
    summary: 'Physics concepts made approachable through guided problem solving and real-world examples.',
    features: ['Forces and motion', 'Data analysis', 'Graph reading', 'Concept review'],
    details: {
      focus: 'Physics and motion',
      contact: '2-3 sessions a week',
      policy: 'Parent updates after every module',
      goals: ['Learn motion and force concepts', 'Improve graph fluency', 'Build scientific reasoning']
    }
  },
  {
    id: 'science-bio',
    title: 'Bio-Engineering Growth',
    price: '$119',
    theme: 'science',
    summary: 'Life science support with structured review, concept maps, and project readiness.',
    features: ['Cells and systems', 'Diagram reading', 'Research support', 'Project tools'],
    details: {
      focus: 'Biology and life science',
      contact: '2 sessions a week',
      policy: 'Homework check-ins and feedback',
      goals: ['Improve retention', 'Build scientific writing', 'Boost test readiness']
    }
  },
  {
    id: 'science-chem',
    title: 'Mission Control Chemistry',
    price: '$129',
    theme: 'science',
    summary: 'A structured chemistry track for students who need more confidence in reactions and lab language.',
    features: ['Matter and reactions', 'Safety and measurement', 'Vocabulary support', 'Practice sets'],
    details: {
      focus: 'Chemistry foundations',
      contact: '2 sessions a week',
      policy: 'Cash-based tutoring plan with check-ins',
      goals: ['Understand chemistry basics', 'Improve lab communication', 'Prepare for assessments']
    }
  },
  {
    id: 'science-ib',
    title: 'Deep Space IB Prep',
    price: '$159',
    theme: 'science',
    summary: 'High-level reasoning and inquiry support designed for Moody IB science preparation.',
    features: ['IB-style problem solving', 'Scientific argument writing', 'Research prep', 'Priority support'],
    details: {
      focus: 'IB readiness and advanced reasoning',
      contact: '3 sessions a week',
      policy: 'Detailed parent progress updates',
      goals: ['Strengthen IB-style thinking', 'Improve written scientific reasoning', 'Prepare for interviews and assessments']
    }
  }
];

const mathPlans = [
  {
    id: 'math-fundamentals',
    title: 'CodeBreaker Fundamentals',
    price: '$79',
    theme: 'math',
    summary: 'Math confidence for younger learners through concept-building and hands-on problem solving.',
    features: ['Number sense', 'Fluency practice', 'Word problems', 'Confidence building'],
    details: {
      focus: 'Foundational math fluency',
      contact: '2 sessions a week',
      policy: 'Pay after consultation',
      goals: ['Strengthen number sense', 'Build consistency', 'Reduce math anxiety']
    }
  },
  {
    id: 'math-core',
    title: 'Matrix Core Track',
    price: '$99',
    theme: 'math',
    summary: 'Core concepts for grades 4-5: fractions, operations, and multi-step reasoning.',
    features: ['Fractions and decimals', 'Operations review', 'Geometry basics', 'Timed drills'],
    details: {
      focus: 'Grades 4-5 math mastery',
      contact: '2 sessions a week',
      policy: 'Practice packets and review notes',
      goals: ['Improve accuracy', 'Increase speed', 'Prepare for tests']
    }
  },
  {
    id: 'math-algebra',
    title: 'Algebra Signal Lab',
    price: '$119',
    theme: 'math',
    summary: 'Structured support for equations, patterns, and early algebra skills.',
    features: ['Variables and equations', 'Function patterns', 'Word problems', 'Logic puzzles'],
    details: {
      focus: 'Algebra readiness',
      contact: '2 sessions a week',
      policy: 'Homework review after each session',
      goals: ['Build algebra confidence', 'Learn patterns and structure', 'Prepare for middle school math']
    }
  },
  {
    id: 'math-geometry',
    title: 'Geometry Decryption',
    price: '$129',
    theme: 'math',
    summary: 'Focused guidance for geometry, measurement, and visual reasoning.',
    features: ['Angles and shapes', 'Area and perimeter', 'Coordinate graphing', 'Proof reasoning'],
    details: {
      focus: 'Geometry and spatial reasoning',
      contact: '2-3 sessions a week',
      policy: 'Monthly mastery check and brief recap',
      goals: ['Increase visual reasoning', 'Tackle complex diagrams', 'Build problem-solving confidence']
    }
  },
  {
    id: 'math-ib',
    title: 'IB Logic Matrix',
    price: '$159',
    theme: 'math',
    summary: 'Advanced reasoning and high-order math coaching for students heading toward Moody IB readiness.',
    features: ['IB-style reasoning', 'Challenge tasks', 'Abstract thinking', 'Parent progress review'],
    details: {
      focus: 'Advanced middle school and IB prep',
      contact: '3 sessions a week',
      policy: 'Priority support and weekly review',
      goals: ['Strengthen abstract reasoning', 'Prepare for advanced assessments', 'Build long-term confidence']
    }
  }
];

const englishPlans = [
  {
    id: 'english-reading',
    title: 'Royal Reading Quest',
    price: '$75',
    theme: 'english',
    summary: 'Reading, comprehension, and storytelling support for younger students developing literacy confidence.',
    features: ['Fluency practice', 'Story retell', 'Vocabulary enrichment', 'Comprehension routines'],
    details: {
      focus: 'Reading and literacy foundations',
      contact: '2 sessions a week',
      policy: 'Reading log and parent recap weekly',
      goals: ['Increase fluency', 'Boost comprehension', 'Build reading joy']
    }
  },
  {
    id: 'english-grammar',
    title: 'Fairytale Grammar Keep',
    price: '$95',
    theme: 'english',
    summary: 'Grammar and writing growth through narrative structure, sentence craft, and revision routines.',
    features: ['Grammar mastery', 'Sentence structure', 'Narrative writing', 'Editing practice'],
    details: {
      focus: 'Grammar and writing fundamentals',
      contact: '2 sessions a week',
      policy: 'Draft feedback and revision goals',
      goals: ['Improve grammar usage', 'Write with clarity', 'Increase editing confidence']
    }
  },
  {
    id: 'english-lit',
    title: 'Sonnet & Story Hall',
    price: '$109',
    theme: 'english',
    summary: 'Literature and writing coaching built for deeper analysis and creative expression.',
    features: ['Close reading', 'Essay structure', 'Creative voice', 'Theme analysis'],
    details: {
      focus: 'Literature and expressive writing',
      contact: '2 sessions a week',
      policy: 'Portfolio feedback and guided revision',
      goals: ['Improve literary analysis', 'Build writing confidence', 'Develop stronger voice']
    }
  },
  {
    id: 'english-debate',
    title: 'Castle Debate Guild',
    price: '$119',
    theme: 'english',
    summary: 'Argument, presentation, and persuasive communication support for growing middle school learners.',
    features: ['Debate prep', 'Argument structure', 'Speech pacing', 'Evidence-based speaking'],
    details: {
      focus: 'Public speaking and persuasive writing',
      contact: '2 sessions a week',
      policy: 'Monthly showcase and feedback',
      goals: ['Build oral confidence', 'Strengthen claims and evidence', 'Improve speaking flow']
    }
  },
  {
    id: 'english-ib',
    title: 'Royal IB Literary Crown',
    price: '$149',
    theme: 'english',
    summary: 'Advanced literary coaching focused on rigorous analysis, style, and IB-level writing readiness.',
    features: ['IB essay planning', 'Text-based analysis', 'Comparative writing', 'Priority feedback'],
    details: {
      focus: 'Advanced literature and IB readiness',
      contact: '3 sessions a week',
      policy: 'Weekly progress reports and family updates',
      goals: ['Train for IB writing', 'Strengthen analysis', 'Prepare for admissions and assessments']
    }
  }
];

const specialtyServices = [
  {
    id: 'application-review',
    title: 'IB Application Review',
    price: '$60',
    description: 'Personalized review of application readiness, goals, and writing strengths for Moody IB families.',
    features: ['Application planning', 'Essay review', 'Strength assessment', 'Next-step roadmap']
  },
  {
    id: 'study-session',
    title: 'Study Session + Strategy Plan',
    price: '$45',
    description: 'A focused tutoring session designed to identify gaps and create a practical study plan.',
    features: ['Skill diagnosis', 'Action plan', 'Study system', 'Parent summary']
  },
  {
    id: 'essay-support',
    title: 'Essay and Writing Review',
    price: '$55',
    description: 'Support for polished writing, revision, and persuasive communication for IB-style tasks.',
    features: ['Writing review', 'Revision coaching', 'Goal planning', 'Feedback notes']
  }
];

const defaultUser = {
  username: 'TEST',
  password: 'TEST',
  familyName: 'Smith Family',
  studentName: 'Ava Smith',
  targetProgram: 'George H. Moody IB'
};

const state = {
  route: window.location.hash || '#/',
  cart: [],
  activePortalView: 'family',
  loggedIn: false,
  adminUnlocked: false
};

function saveState() {
  localStorage.setItem('moody-academy-state', JSON.stringify({
    cart: state.cart,
    activePortalView: state.activePortalView,
    loggedIn: state.loggedIn,
    adminUnlocked: state.adminUnlocked
  }));
}

function loadState() {
  try {
    const existing = JSON.parse(localStorage.getItem('moody-academy-state') || '{}');
    if (existing.cart) state.cart = existing.cart;
    if (existing.activePortalView) state.activePortalView = existing.activePortalView;
    if (existing.loggedIn) state.loggedIn = true;
    if (existing.adminUnlocked) state.adminUnlocked = true;
  } catch (error) {
    console.warn('Could not restore saved state:', error);
  }
}

function addToCart(plan) {
  const existing = state.cart.find((item) => item.id === plan.id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ ...plan, qty: 1 });
  }
  saveState();
  render();
}

function removeFromCart(planId) {
  state.cart = state.cart.filter((item) => item.id !== planId);
  saveState();
  render();
}

function cartTotal() {
  return state.cart.reduce((sum, item) => sum + Number(String(item.price).replace(/[^\d.]/g, '')) * item.qty, 0);
}

function createMailtoFromCart() {
  if (!state.cart.length) {
    alert('Please add at least one tutoring plan before sending the inquiry.');
    return;
  }

  const lines = state.cart.map((item) => `- ${item.title} (${item.price}) x ${item.qty}`).join('\n');
  const body = encodeURIComponent(
    `Hello,\n\nThis family is interested in the following tutoring plan(s):\n${lines}\n\nThey are planning a meeting and will pay in cash after the consultation.\nPlease reach out to confirm the best time to meet.\n\nThank you.\n${defaultUser.familyName}`
  );

  const subject = encodeURIComponent('Tutoring inquiry and cash payment plan');
  window.location.href = `mailto:moodytutor@gmail.com?subject=${subject}&body=${body}`;
}

function render() {
  const app = document.getElementById('app');
  const route = state.route;

  if (route === '#/science') {
    app.innerHTML = renderHub('Science', 'science', sciencePlans);
    return;
  }

  if (route === '#/math') {
    app.innerHTML = renderHub('Math', 'math', mathPlans);
    return;
  }

  if (route === '#/english') {
    app.innerHTML = renderHub('English', 'english', englishPlans);
    return;
  }

  if (route === '#/specialty') {
    app.innerHTML = renderSpecialtyCenter();
    return;
  }

  if (route === '#/portal') {
    app.innerHTML = renderPortal();
    return;
  }

  if (route === '#/admin') {
    app.innerHTML = renderAdmin();
    return;
  }

  app.innerHTML = renderHome();
}

function renderHome() {
  return `
    ${renderHeader()}
    <main class="school-shell">
      <section class="hero-banner">
        <div class="hero-overlay"></div>
        <div class="hero-inner">
          <div class="hero-brand">
            <div class="crest">M</div>
            <div>
              <div class="mini-label">George H. Moody</div>
              <h1>Middle School IB & Academic Support</h1>
            </div>
          </div>
          <nav class="quick-links">
            <a href="#/portal">Quick Access for Families</a>
            <a href="#/science">Science Resources</a>
            <a href="#/portal">Family & Student Resources</a>
            <a href="#/specialty">Specialty Center</a>
            <a href="#/admin">Instructor Access</a>
          </nav>
        </div>
      </section>

      <section class="home-content">
        <div class="feature-strip">
          <div class="feature-card neutral-card">
            <span class="label">Moody IB</span>
            <strong>Admissions readiness</strong>
            <p>Strategic support for applicants preparing for George H. Moody’s challenging academic environment.</p>
          </div>
          <div class="feature-card neutral-card">
            <span class="label">K-8 Support</span>
            <strong>English, Math, Science</strong>
            <p>Tailored tutoring to build confidence, consistency, and stronger academic habits across all major subjects.</p>
          </div>
          <div class="feature-card neutral-card">
            <span class="label">Family-first</span>
            <strong>Clear communication</strong>
            <p>Parents receive updates, student progress notes, and a transparent path toward measurable growth.</p>
          </div>
        </div>

        <div class="hub-preview-grid">
          <article class="theme-card science-card">
            <div class="card-topline">Science</div>
            <h3>Sci-Fi Lab Booster</h3>
            <p>Inquiry-based science coaching, labs, and foundational confidence for future-ready learners.</p>
            <button class="primary-btn" data-action="goto" data-target="#/science">Explore Science</button>
          </article>

          <article class="theme-card math-card">
            <div class="card-topline">Math</div>
            <h3>Matrix Core Track</h3>
            <p>From number sense to algebra and geometry, the plan builds accuracy, speed, and problem-solving.</p>
            <button class="primary-btn" data-action="goto" data-target="#/math">Explore Math</button>
          </article>

          <article class="theme-card english-card">
            <div class="card-topline">English</div>
            <h3>Royal Reading Quest</h3>
            <p>Literacy, writing, debate, and literary analysis with a fairytale-inspired framework.</p>
            <button class="primary-btn" data-action="goto" data-target="#/english">Explore English</button>
          </article>
        </div>

        <section class="next-steps">
          <div class="section-head">
            <h2>Next steps</h2>
          </div>
          <div class="steps-grid">
            <div class="step-box">
              <span>01</span>
              <h3>Choose a hub</h3>
              <p>Review the right science, math, or English pathway for your learner.</p>
            </div>
            <div class="step-box">
              <span>02</span>
              <h3>Meet and confirm</h3>
              <p>Schedule a parent-facing consult and confirm the plan that fits the child best.</p>
            </div>
            <div class="step-box">
              <span>03</span>
              <h3>Pay in cash</h3>
              <p>Proceed with a consultation and pay in cash after the meeting, without any online payment flow.</p>
            </div>
            <div class="step-box">
              <span>04</span>
              <h3>Begin learning</h3>
              <p>Access assignments, teacher feedback, and student progress through the guarded family portal.</p>
            </div>
          </div>
        </section>
      </section>
    </main>
  `;
}

function renderHeader() {
  return `
    <header class="topbar neutral-topbar">
      <div class="topbar-inner">
        <div class="top-left">
          <button class="chip" data-action="goto" data-target="#/">Home</button>
          <button class="chip" data-action="goto" data-target="#/science">Science</button>
          <button class="chip" data-action="goto" data-target="#/math">Math</button>
          <button class="chip" data-action="goto" data-target="#/english">English</button>
          <button class="chip" data-action="goto" data-target="#/specialty">Specialty Center</button>
        </div>
        <div class="top-right">
          <button class="chip" data-action="goto" data-target="#/portal">Family Portal</button>
          <button class="chip" data-action="goto" data-target="#/admin">Instructor</button>
        </div>
      </div>
    </header>
  `;
}

function renderHub(title, theme, plans) {
  const cartItems = state.cart.length ? state.cart : [{ id: 'none', title: 'No plans added yet', price: '$0', qty: 1 }];

  return `
    ${renderHeader()}
    <main class="hub-shell ${theme}-theme">
      <section class="hub-topbar">
        <div>
          <div class="mini-label">${title} Academy</div>
          <h2>${title} hub</h2>
        </div>
        <button class="primary-btn" data-action="goto" data-target="#/portal">Open Portal</button>
      </section>

      <div class="hub-layout">
        <div class="hub-main">
          <div class="plan-grid">
            ${plans.map((plan) => `
              <article class="plan-card ${theme}-card">
                <div class="plan-topline">${title}</div>
                <div class="plan-price">${plan.price}</div>
                <h3>${plan.title}</h3>
                <p>${plan.summary}</p>
                <ul>
                  ${plan.features.map((feature) => `<li>${feature}</li>`).join('')}
                </ul>
                <div class="plan-actions">
                  <button class="primary-btn" data-action="add-cart" data-plan-id="${plan.id}">Add to cart</button>
                  <button class="secondary-btn" data-action="show-plan" data-plan-id="${plan.id}">Details</button>
                </div>
              </article>
            `).join('')}
          </div>
        </div>

        <aside class="cart-panel">
          <h3>Cart</h3>
          <div class="cart-items">
            ${cartItems.map((item) => `
              <div class="cart-item">
                <div>
                  <strong>${item.title}</strong>
                  <div class="cart-meta">${item.price} • qty ${item.qty || 1}</div>
                </div>
                ${item.id !== 'none' ? `<button class="mini-remove" data-action="remove-cart" data-plan-id="${item.id}">Remove</button>` : ''}
              </div>
            `).join('')}
          </div>
          <div class="checkout-row">
            <span>Subtotal</span>
            <strong>$${cartTotal().toFixed(2)}</strong>
          </div>
          <button class="primary-btn" style="width:100%;" data-action="checkout-cart">Request meeting + cash plan</button>
          <p class="cash-note">No online payment. Families confirm the plan in person and pay cash after the consultation.</p>
        </aside>
      </div>

      <section class="next-steps lighter-panel">
        <div class="section-head">
          <h2>Next steps</h2>
        </div>
        <div class="steps-grid">
          <div class="step-box"><span>01</span><h3>Choose</h3><p>Select the right program for your learner.</p></div>
          <div class="step-box"><span>02</span><h3>Meet</h3><p>Meet for a short consultation and confirm fit.</p></div>
          <div class="step-box"><span>03</span><h3>Pay</h3><p>Pay in cash after the meeting.</p></div>
          <div class="step-box"><span>04</span><h3>Begin</h3><p>Start assignments and student progress tracking through the portal.</p></div>
        </div>
      </section>
    </main>
  `;
}

function renderSpecialtyCenter() {
  return `
    ${renderHeader()}
    <main class="school-shell specialty-shell">
      <section class="section-head neutral-head">
        <h2>Specialty Center</h2>
      </section>
      <div class="specialty-grid">
        ${specialtyServices.map((item) => `
          <article class="specialty-card">
            <div class="card-topline">Service</div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <ul>
              ${item.features.map((feature) => `<li>${feature}</li>`).join('')}
            </ul>
            <div class="plan-actions">
              <span class="plan-price">${item.price}</span>
              <button class="primary-btn" data-action="add-cart-specialty" data-service-id="${item.id}">Add to cart</button>
            </div>
          </article>
        `).join('')}
      </div>
    </main>
  `;
}

function renderPortal() {
  if (!state.loggedIn) {
    return `
      ${renderHeader()}
      <main class="school-shell auth-shell">
        <div class="auth-card">
          <h2>Student & Family Portal</h2>
          <p>Secure access for student assignments, grades, and family updates.</p>
          <div class="portal-tabs">
            <button class="tab-btn ${state.activePortalView === 'family' ? 'active' : ''}" data-action="set-portal-view" data-view="family">Family Login</button>
            <button class="tab-btn ${state.activePortalView === 'student' ? 'active' : ''}" data-action="set-portal-view" data-view="student">Student Login</button>
          </div>
          <div id="loginNotice" class="notice hidden"></div>
          <form id="loginForm">
            <div class="field">
              <label>Username</label>
              <input name="username" value="TEST" required />
            </div>
            <div class="field">
              <label>Password</label>
              <input name="password" type="password" value="TEST" required />
            </div>
            <button class="primary-btn" type="submit" style="width:100%;">Enter Portal</button>
          </form>
        </div>
      </main>
    `;
  }

  const activeView = state.activePortalView === 'student' ? 'student' : 'family';

  return `
    ${renderHeader()}
    <main class="school-shell portal-shell">
      <section class="portal-header">
        <div>
          <div class="mini-label">Welcome</div>
          <h2>${defaultUser.familyName}</h2>
        </div>
        <div class="portal-actions">
          <div class="portal-tabs">
            <button class="tab-btn ${activeView === 'family' ? 'active' : ''}" data-action="set-portal-view" data-view="family">Family Overview</button>
            <button class="tab-btn ${activeView === 'student' ? 'active' : ''}" data-action="set-portal-view" data-view="student">Student Work</button>
          </div>
          <button class="secondary-btn" data-action="logout-user">Logout</button>
        </div>
      </section>

      ${activeView === 'family' ? renderFamilyView() : renderStudentView()}
    </main>
  `;
}

function renderFamilyView() {
  return `
    <div class="dashboard-grid">
      <div class="dash-card">
        <div class="mini-label">Academic summary</div>
        <div class="big-number">94%</div>
        <p>Current progress across the current tutoring plan.</p>
      </div>
      <div class="dash-card">
        <div class="mini-label">Active program</div>
        <div class="big-number">Moody IB Prep</div>
        <p>Target track: ${defaultUser.targetProgram}</p>
      </div>
      <div class="dash-card full-span">
        <div class="mini-label">Recent grades</div>
        <ul class="grade-list">
          <li><strong>Math:</strong> Matrix Vectors — 98/100</li>
          <li><strong>Science:</strong> Orbital Physics Lab — 92/100</li>
          <li><strong>English:</strong> Castle Argument — 95/100</li>
        </ul>
      </div>
    </div>
  `;
}

function renderStudentView() {
  return `
    <div class="assignment-table-wrap">
      <table class="assignment-table">
        <thead>
          <tr>
            <th>Assignment</th>
            <th>Due</th>
            <th>Status</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Deciphering the Digital Rain</td>
            <td>Tomorrow</td>
            <td>Submitted</td>
            <td>98</td>
          </tr>
          <tr>
            <td>Sub-Orbital Lab Reflection</td>
            <td>Friday</td>
            <td>In progress</td>
            <td>—</td>
          </tr>
          <tr>
            <td>Castle Debate Outline</td>
            <td>Monday</td>
            <td>Assigned</td>
            <td>—</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderAdmin() {
  if (!state.adminUnlocked) {
    return `
      ${renderHeader()}
      <main class="school-shell auth-shell">
        <div class="auth-card">
          <h2>Instructor Access</h2>
          <p>Restricted to the instructor only. Enter the master secret to continue.</p>
          <form id="adminForm">
            <div class="field">
              <label>Secret Word</label>
              <input type="password" id="adminSecret" placeholder="TEST" required />
            </div>
            <button class="primary-btn" type="submit" style="width:100%;">Unlock</button>
          </form>
        </div>
      </main>
    `;
  }

  return `
    ${renderHeader()}
    <main class="school-shell admin-shell">
      <section class="portal-header">
        <div>
          <div class="mini-label">Instructor</div>
          <h2>Control Panel</h2>
        </div>
        <button class="secondary-btn" data-action="logout-admin">Lock panel</button>
      </section>

      <div class="admin-grid">
        <div class="dash-card">
          <div class="mini-label">Students</div>
          <ul class="grade-list">
            <li>Ava Smith — 98</li>
            <li>Liam Chen — 92</li>
            <li>Nora Patel — 95</li>
          </ul>
        </div>
        <div class="dash-card">
          <div class="mini-label">Assignments</div>
          <ul class="grade-list">
            <li>Deciphering the Digital Rain</li>
            <li>Orbital Lab Reflection</li>
            <li>Castle Debate Outline</li>
          </ul>
        </div>
        <div class="dash-card">
          <div class="mini-label">New grades</div>
          <form id="gradeForm" class="grade-form">
            <div class="field">
              <label>Student</label>
              <input value="Ava Smith" />
            </div>
            <div class="field">
              <label>Grade</label>
              <input value="98" />
            </div>
            <button class="primary-btn" type="submit">Save grade</button>
          </form>
        </div>
      </div>
    </main>
  `;
}

function handleBodySubmit(event) {
  if (event.target.matches('#loginForm')) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const username = String(formData.get('username') || '').trim();
    const password = String(formData.get('password') || '').trim();

    if (username === defaultUser.username && password === defaultUser.password) {
      state.loggedIn = true;
      saveState();
      render();
      return;
    }

    const notice = document.getElementById('loginNotice');
    if (notice) {
      notice.textContent = 'Invalid credentials. Use TEST for username and password.';
      notice.classList.remove('hidden');
    }
    return;
  }

  if (event.target.matches('#adminForm')) {
    event.preventDefault();
    const secret = document.getElementById('adminSecret').value.trim();
    if (secret === 'TEST') {
      state.adminUnlocked = true;
      saveState();
      window.location.hash = '#/admin';
      return;
    }
    alert('Incorrect secret. Use TEST.');
    return;
  }

  if (event.target.matches('#gradeForm')) {
    event.preventDefault();
    alert('Grade saved successfully.');
  }
}

function handleBodyClick(event) {
  const actionNode = event.target.closest('[data-action]');
  if (!actionNode) return;

  const action = actionNode.dataset.action;

  if (action === 'goto') {
    window.location.hash = actionNode.dataset.target;
    return;
  }

  if (action === 'show-plan') {
    const planId = actionNode.dataset.planId;
    const allPlans = [...sciencePlans, ...mathPlans, ...englishPlans];
    const selectedPlan = allPlans.find((plan) => plan.id === planId);
    openPlanModal(selectedPlan);
    return;
  }

  if (action === 'add-cart') {
    const planId = actionNode.dataset.planId;
    const selectedPlan = [...sciencePlans, ...mathPlans, ...englishPlans].find((plan) => plan.id === planId);
    if (selectedPlan) addToCart(selectedPlan);
    return;
  }

  if (action === 'add-cart-specialty') {
    const serviceId = actionNode.dataset.serviceId;
    const selectedService = specialtyServices.find((item) => item.id === serviceId);
    if (selectedService) {
      addToCart({ ...selectedService, theme: 'specialty', id: selectedService.id, title: selectedService.title, price: selectedService.price, summary: selectedService.description, features: selectedService.features });
    }
    return;
  }

  if (action === 'remove-cart') {
    removeFromCart(actionNode.dataset.planId);
    return;
  }

  if (action === 'checkout-cart') {
    createMailtoFromCart();
    return;
  }

  if (action === 'set-portal-view') {
    state.activePortalView = actionNode.dataset.view;
    saveState();
    render();
    return;
  }

  if (action === 'logout-user') {
    state.loggedIn = false;
    saveState();
    render();
    return;
  }

  if (action === 'logout-admin') {
    state.adminUnlocked = false;
    saveState();
    render();
    return;
  }
}

function openPlanModal(plan) {
  if (!plan) return;
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-top">
        <div class="mini-label">${plan.title}</div>
        <button class="ghost-btn" data-action="close-modal">Close</button>
      </div>
      <div class="modal-body">
        <h3>${plan.price}</h3>
        <p>${plan.summary || plan.description}</p>
        <div class="detail-grid">
          <div>
            <h4>Focus</h4>
            <p>${plan.details.focus}</p>
          </div>
          <div>
            <h4>Weekly rhythm</h4>
            <p>${plan.details.contact}</p>
          </div>
          <div>
            <h4>Payment</h4>
            <p>${plan.details.policy}</p>
          </div>
          <div>
            <h4>Goals</h4>
            <ul>
              ${plan.details.goals.map((goal) => `<li>${goal}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="modal-actions">
          <button class="primary-btn" data-action="add-cart" data-plan-id="${plan.id}">Add to cart</button>
          <button class="secondary-btn" data-action="close-modal">Continue browsing</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener('click', (event) => {
    const target = event.target;
    if (target.matches('[data-action="close-modal"]') || target === modal) {
      modal.remove();
    }
  });
}

loadState();
document.body.addEventListener('click', handleBodyClick);
document.body.addEventListener('submit', handleBodySubmit);
window.addEventListener('hashchange', () => {
  state.route = window.location.hash || '#/';
  render();
});
render();
