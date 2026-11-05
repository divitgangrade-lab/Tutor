/*
 * data.js — the academy catalogue.
 *
 * Prices are intentionally simple integers. Grade courses use the single-class
 * ladder below; bundles are derived with a fixed, capped discount so a bundle can
 * never fall below 85% of list price.
 */
(function (global) {
  'use strict';

  var SITE = {
    name: 'Moody & Co. Academy',
    short: 'Moody & Co.',
    mark: 'M&C',
    email: 'moodytutor@gmail.com',
    tagline: 'Grades 1–8 · George H. Moody IB preparation',
    hours: 'Mon–Thu 3–8pm · Sat 9am–2pm',
    location: 'In-person around Moody · online anywhere',
    responseWindow: 'within one school day'
  };

  var GRADES = [1, 2, 3, 4, 5, 6, 7, 8];

  var BUNDLES = {
    month: {
      id: 'month',
      label: 'Month bundle',
      sessions: 4,
      discount: 0.1,
      blurb: 'Four weekly classes. Ten percent off the single-class rate.'
    },
    term: {
      id: 'term',
      label: 'Semester bundle',
      sessions: 8,
      discount: 0.15,
      blurb: 'Eight classes across the term. Fifteen percent off — the best rate we offer.'
    }
  };

  var SUBJECTS = {
    science: {
      id: 'science',
      name: 'Science',
      code: 'SCI',
      theme: 'scifi',
      kicker: 'The Sci-Fi Lab',
      tagline: 'Turn “I think” into “I tested it.”',
      lede:
        'A lab-shaped curriculum for grades 1–8: observe closely, record honestly, explain clearly. Every session ends with evidence your child can point to — a notebook page, a graph, a claim they can defend.',
      vibes: ['Missions', 'Experiments', 'Field notes'],
      prices: [20, 22, 25, 30, 34, 40, 45, 50],
      strands: [
        {
          title: 'Inquiry & method',
          body: 'Questions worth asking, variables worth controlling, tests that actually settle the argument.'
        },
        {
          title: 'Lab craft',
          body: 'Measurement, safety, diagrams, and a notebook habit that survives past the worksheet.'
        },
        {
          title: 'Data & evidence',
          body: 'Tables, graphs, averages, and the difference between a guess and a conclusion.'
        },
        {
          title: 'Explain like a scientist',
          body: 'Cause, effect, precision, and written answers that earn the marks.'
        }
      ],
      grades: [
        { focus: 'Senses, seasons & living things', detail: 'Observe the everyday world, sort what you find, and say why.' },
        { focus: 'Habitats, matter & simple machines', detail: 'Simple experiments with clear variables and honest notes.' },
        { focus: 'Life cycles, forces & earth materials', detail: 'Connect observations to a bigger system.' },
        { focus: 'Energy, ecosystems & circuits', detail: 'Build circuits, trace food webs, and explain change.' },
        { focus: 'Matter, astronomy & body systems', detail: 'Models, measurement, and systems thinking.' },
        { focus: 'Cells, waves & the scientific method', detail: 'Formal method, data tables, and evidence-based claims.' },
        { focus: 'Chemistry, genetics & data analysis', detail: 'Variables, ratios, graphs, and structured write-ups.' },
        { focus: 'Physics, chemistry & IB inquiry', detail: 'MYP-style criteria, IA habits, and independent investigation.' }
      ]
    },
    math: {
      id: 'math',
      name: 'Math',
      code: 'MTH',
      theme: 'matrix',
      kicker: 'The Matrix Room',
      tagline: 'See the pattern. Break the problem. Own the method.',
      lede:
        'Math tutoring that refuses to hide behind tricks. We rebuild the concept, practise the procedure, then decode real problems — until your child can explain the why, not just produce the answer.',
      vibes: ['Patterns', 'Proof', 'Deliberate practice'],
      prices: [20, 22, 25, 30, 34, 40, 45, 52],
      strands: [
        {
          title: 'Number sense',
          body: 'Place value, fractions, decimals, and mental math that makes later algebra feel obvious.'
        },
        {
          title: 'Procedural fluency',
          body: 'Accurate, efficient work — with the reasoning visible in the margin.'
        },
        {
          title: 'Problem decoding',
          body: 'Word problems translated into diagrams, equations, and a plan.'
        },
        {
          title: 'Reasoning & proof',
          body: 'Justify, generalize, and catch the error before the teacher does.'
        }
      ],
      grades: [
        { focus: 'Counting, addition & subtraction', detail: 'Concrete-to-pictorial number work with daily fluency.' },
        { focus: 'Place value & early multiplication', detail: 'Arrays, tens and ones, and mental math routines.' },
        { focus: 'Times tables & fractions', detail: 'Fact fluency plus the first real fraction reasoning.' },
        { focus: 'Multi-digit operations & decimals', detail: 'Long division, fraction equivalence, area and perimeter.' },
        { focus: 'Fraction operations & volume', detail: 'Unlike denominators, coordinate planes, and multi-step problems.' },
        { focus: 'Ratios, expressions & integers', detail: 'Pre-algebra language, negatives, and proportional reasoning.' },
        { focus: 'Equations & proportional reasoning', detail: 'Solve, graph, and explain linear relationships.' },
        { focus: 'Functions & Algebra I bridge', detail: 'Slope, exponents, Pythagoras, and high-school readiness.' }
      ]
    },
    english: {
      id: 'english',
      name: 'English',
      code: 'ENG',
      theme: 'story',
      kicker: 'The Story Hall',
      tagline: 'Read like a detective. Write like you mean it.',
      lede:
        'Literacy coaching with a storyteller’s soul and an examiner’s eye. We build fluency, sentence craft, and argument — then put them to work in essays, debates, and the kind of close reading that earns top marks.',
      vibes: ['Close reading', 'Story craft', 'Argument'],
      prices: [20, 22, 25, 30, 34, 40, 45, 50],
      strands: [
        {
          title: 'Reading closely',
          body: 'Annotation, inference, theme, and the evidence that actually supports a claim.'
        },
        {
          title: 'Sentence craft',
          body: 'Grammar in service of clarity: verbs, rhythm, punctuation, and control.'
        },
        {
          title: 'Structure & argument',
          body: 'Paragraph architecture, thesis writing, and revision that changes the reader.'
        },
        {
          title: 'Voice & revision',
          body: 'From first draft to final draft without losing the writer in the process.'
        }
      ],
      grades: [
        { focus: 'Phonics, sight words & listening', detail: 'Decoding, read-aloud confidence, and story talk.' },
        { focus: 'Fluency & sentence writing', detail: 'Read smoothly, retell clearly, write complete thoughts.' },
        { focus: 'Paragraphs & comprehension', detail: 'Main idea, evidence, and organized paragraphs.' },
        { focus: 'Grammar & figurative language', detail: 'Stronger sentences, imagery, and short essays.' },
        { focus: 'Text structure & research', detail: 'Compare texts, take notes, and build a claim.' },
        { focus: 'Literary analysis & argument', detail: 'Theme, evidence, and structured argument writing.' },
        { focus: 'Thesis writing & rhetoric', detail: 'Annotate, argue, and revise with intention.' },
        { focus: 'Close reading & IB readiness', detail: 'Comparative analysis, timed writing, and oral commentary.' }
      ]
    }
  };

  var IB = {
    id: 'ib',
    name: 'Moody IB',
    code: 'IB',
    theme: 'ib',
    kicker: 'The Moody IB Room',
    tagline: 'A calmer, clearer path into George H. Moody IB.',
    lede:
      'Application coaching for the whole candidate: the essays, the activities list, the interview, and the academic evidence that ties them together. Built for families who want the process to feel intentional rather than frantic.',
    vibes: ['Application strategy', 'Interview presence', 'Subject readiness'],
    strands: [
      { title: 'Positioning', body: 'Who your child is, what they have done, and why Moody is the right next room.' },
      { title: 'Essays & short answers', body: 'Specific, honest writing — drafted, questioned, and revised.' },
      { title: 'Activities & evidence', body: 'Turning scattered involvement into a coherent, credible story.' },
      { title: 'Interview presence', body: 'Warm, precise practice with real feedback — not a script.' }
    ],
    timeline: [
      { when: 'Now', title: 'Readiness diagnostic', body: 'A short conversation and a written snapshot of strengths, gaps, and timing.' },
      { when: 'Weeks 1–2', title: 'Positioning', body: 'Choose the through-line for the application and map the evidence.' },
      { when: 'Weeks 2–5', title: 'Draft & revise', body: 'Essays and short answers built in small, focused passes.' },
      { when: 'Weeks 5–7', title: 'Interview studio', body: 'Mock panels, follow-up questions, and presence coaching.' },
      { when: 'Week 8', title: 'Final review', body: 'Checklists, submission plan, and a calm handoff.' }
    ]
  };

  /* ---------------------------------------------------------------------------
   * Pricing helpers
   * ------------------------------------------------------------------------- */

  function singlePrice(subject, grade) {
    var entry = SUBJECTS[subject];
    if (!entry) return 0;
    var price = entry.prices[Number(grade) - 1];
    return typeof price === 'number' ? price : 0;
  }

  function bundleFor(subject, grade, kind) {
    var bundle = BUNDLES[kind];
    var single = singlePrice(subject, grade);
    if (!bundle || !single) return null;
    var full = single * bundle.sessions;
    var price = Math.ceil(full * (1 - bundle.discount));
    return {
      kind: kind,
      label: bundle.label,
      sessions: bundle.sessions,
      discount: bundle.discount,
      single: single,
      full: full,
      price: price,
      save: full - price
    };
  }

  /* ---------------------------------------------------------------------------
   * Grade courses
   * ------------------------------------------------------------------------- */

  var COURSES = [];
  Object.keys(SUBJECTS).forEach(function (subjectId) {
    var subject = SUBJECTS[subjectId];
    GRADES.forEach(function (grade) {
      var info = subject.grades[grade - 1];
      var month = bundleFor(subjectId, grade, 'month');
      var term = bundleFor(subjectId, grade, 'term');
      COURSES.push({
        key: subjectId + '-g' + grade,
        id: 'course-' + subjectId + '-' + grade,
        subject: subjectId,
        subjectName: subject.name,
        grade: grade,
        focus: info.focus,
        detail: info.detail,
        single: singlePrice(subjectId, grade),
        month: month,
        term: term
      });
    });
  });

  function courseBy(subject, grade) {
    return (
      COURSES.filter(function (course) {
        return course.subject === subject && course.grade === Number(grade);
      })[0] || null
    );
  }

  /* ---------------------------------------------------------------------------
   * Five signature plans per room
   * ------------------------------------------------------------------------- */

  var PLANS = [
    /* ------------------------------- Science ------------------------------- */
    {
      id: 'sci-first-contact',
      subject: 'science',
      title: 'First Contact',
      subtitle: 'Diagnostic single class',
      price: 35,
      sessions: 1,
      unit: 'one 55-minute session',
      badge: 'Start here',
      summary:
        'One high-signal session that maps exactly where your child is in science — and the three things worth fixing first.',
      includes: [
        '55-minute 1:1 session',
        'Skills diagnostic across the grade band',
        'Concept-gap map for parents',
        'A two-week practice menu'
      ],
      outcomes: [
        'Know the real starting point',
        'Leave with one clear next step',
        'A noticeably calmer learner'
      ],
      format: '1:1 · online or in-person',
      rhythm: 'One session, scheduled within the week',
      bestFor: 'New families, second opinions, quick check-ins',
      materials: 'Digital lab notebook + diagnostic sheet',
      assessment: 'Written recap within 24 hours',
      arc: [
        'Warm-up: a question worth arguing about',
        'Diagnostic: vocabulary, method, and reasoning',
        'Mini-lab: observe, record, explain',
        'Recap: the three things to fix first'
      ]
    },
    {
      id: 'sci-mission-month',
      subject: 'science',
      title: 'Mission Month',
      subtitle: 'Weekly science coaching',
      price: 128,
      sessions: 4,
      unit: 'four weekly sessions',
      featured: true,
      badge: 'Most booked',
      summary:
        'Four weekly missions that rebuild the habits behind good science: observe, record, explain, repeat.',
      includes: [
        '4 × 55-minute 1:1 sessions',
        'A personal lab-notebook system',
        'Weekly parent recap',
        'Homework reviewed every week',
        'Grade-aligned practice set'
      ],
      outcomes: [
        'A weekly rhythm that actually sticks',
        'Science vocabulary used out loud',
        'Lab write-ups with a clear structure'
      ],
      format: '1:1, or a sibling pair on request',
      rhythm: 'Weekly for four weeks',
      bestFor: 'Grades 1–8 building steady habits',
      materials: 'Lab notebook, printable mission cards',
      assessment: 'Weekly recap + end-of-month skills check',
      arc: [
        'Mission 01 — Observe like a scientist',
        'Mission 02 — Measure and record',
        'Mission 03 — Explain the pattern',
        'Mission 04 — Defend your conclusion'
      ]
    },
    {
      id: 'sci-orbital-term',
      subject: 'science',
      title: 'Orbital Semester',
      subtitle: 'Term-long science coaching',
      price: 236,
      sessions: 8,
      unit: 'eight sessions across the term',
      summary:
        'A full term of science coaching with a real investigation, two written reports, and a mastery map you can take to the next grade.',
      includes: [
        '8 × 55-minute 1:1 sessions',
        'Independent investigation coaching',
        'Mid-term and end-of-term reports',
        'Priority email support between sessions',
        'Parent debrief at the finish line'
      ],
      outcomes: [
        'A completed investigation worth showing',
        'Stronger written scientific reasoning',
        'A clear plan for the next term'
      ],
      format: '1:1 · online or in-person',
      rhythm: 'Weekly, with two flex weeks',
      bestFor: 'Families committed to a full-term rebuild',
      materials: 'Lab notebook, investigation planner',
      assessment: 'Two reports + final mastery map',
      arc: [
        'Diagnostic & mission brief',
        'Core concept rebuild',
        'Concept application lab',
        'Data and graph fluency',
        'Mini-investigation design',
        'Write-up clinic',
        'Mock assessment',
        'Parent debrief & next-term map'
      ]
    },
    {
      id: 'sci-lab-intensive',
      subject: 'science',
      title: 'Lab Intensive',
      subtitle: 'Experiment design sprint',
      price: 198,
      sessions: 6,
      unit: 'six sessions across three weeks',
      summary:
        'A fast, hands-on sprint for students who need to design, run, and explain their own experiment — not just follow a recipe.',
      includes: [
        '6 × 55-minute sessions across 3 weeks',
        'Experiment design coaching',
        'Data-collection templates',
        'Safety and measurement review',
        'A presented findings session'
      ],
      outcomes: [
        'A fair test your child designed',
        'Clean data and a readable graph',
        'Confidence presenting findings'
      ],
      format: '1:1, in-person preferred',
      rhythm: 'Twice weekly for three weeks',
      bestFor: 'Science fair, MYP inquiry, curious builders',
      materials: 'Household lab kit list + templates',
      assessment: 'Findings presentation + written conclusion',
      arc: [
        'Safety + question design',
        'Variables and controls',
        'Build the experiment',
        'Collect and log data',
        'Analyse and graph',
        'Present findings'
      ]
    },
    {
      id: 'sci-ib-bridge',
      subject: 'science',
      title: 'IB Science Bridge',
      subtitle: 'Moody IB readiness',
      price: 289,
      sessions: 8,
      unit: 'eight sessions',
      summary:
        'For strong students stepping into Moody IB science: MYP criteria, inquiry language, data analysis, and an oral defence.',
      includes: [
        '8 × 55-minute sessions',
        'MYP criteria walkthrough',
        'IA-style inquiry coaching',
        'Data-processing clinic',
        'Mock oral defence with feedback'
      ],
      outcomes: [
        'Comfort with MYP command terms',
        'A draft inquiry report',
        'Confidence defending a conclusion aloud'
      ],
      format: '1:1 · online or in-person',
      rhythm: 'Weekly, with one double session',
      bestFor: 'Grades 7–8 aiming at Moody IB',
      materials: 'Criteria pack + report template',
      assessment: 'Mock oral + written feedback',
      arc: [
        'Diagnostic against MYP criteria',
        'Inquiry and research question',
        'Method and variables',
        'Data processing',
        'Criteria B/C writing',
        'IA-style draft',
        'Mock oral defence',
        'Final review'
      ]
    },

    /* --------------------------------- Math -------------------------------- */
    {
      id: 'math-red-pill',
      subject: 'math',
      title: 'Red Pill',
      subtitle: 'Diagnostic single class',
      price: 35,
      sessions: 1,
      unit: 'one 55-minute session',
      badge: 'Start here',
      summary:
        'One focused session that finds the exact concept your child missed — and the shortest honest path back to confidence.',
      includes: [
        '55-minute 1:1 diagnostic',
        'Error-pattern analysis',
        'A one-page concept map',
        'Targeted practice set'
      ],
      outcomes: [
        'Name the real gap, not the symptom',
        'A practice plan that fits the week',
        'Less math anxiety, immediately'
      ],
      format: '1:1 · online or in-person',
      rhythm: 'One session',
      bestFor: 'New families and pre-test check-ins',
      materials: 'Diagnostic problem set',
      assessment: 'Written recap within 24 hours',
      arc: [
        'Warm-up: a problem with a trap',
        'Diagnostic across the grade band',
        'Error autopsy: why it went wrong',
        'The next three practice moves'
      ]
    },
    {
      id: 'math-matrix-month',
      subject: 'math',
      title: 'Matrix Month',
      subtitle: 'Weekly math coaching',
      price: 128,
      sessions: 4,
      unit: 'four weekly sessions',
      featured: true,
      badge: 'Most booked',
      summary:
        'Four weeks of deliberate practice: rebuild the concept, drill the procedure, then decode the word problems that hide it.',
      includes: [
        '4 × 55-minute 1:1 sessions',
        'Weekly drill deck',
        'Worked-example library',
        'Parent recap every week',
        'Homework reviewed line by line'
      ],
      outcomes: [
        'Faster, more accurate recall',
        'Visible reasoning in the margin',
        'Word problems approached without panic'
      ],
      format: '1:1, or a sibling pair on request',
      rhythm: 'Weekly for four weeks',
      bestFor: 'Grades 1–8 rebuilding fluency',
      materials: 'Drill deck + error log',
      assessment: 'Weekly mastery check',
      arc: [
        'Number sense reboot',
        'Procedure with proof',
        'Word-problem decoder',
        'Speed and accuracy check'
      ]
    },
    {
      id: 'math-neo-term',
      subject: 'math',
      title: 'Neo Semester',
      subtitle: 'Term-long math rebuild',
      price: 236,
      sessions: 8,
      unit: 'eight sessions across the term',
      summary:
        'A full-term rebuild for students who want the whole map: concepts, procedures, problem-solving, and a mastery report at the end.',
      includes: [
        '8 × 55-minute 1:1 sessions',
        'Mastery map by strand',
        'Timed practice sets',
        'Mid-term and final reports',
        'Priority email support'
      ],
      outcomes: [
        'A visible mastery map',
        'Comfort with multi-step problems',
        'A confident next-year starting point'
      ],
      format: '1:1 · online or in-person',
      rhythm: 'Weekly, with two flex weeks',
      bestFor: 'Families who want a durable rebuild',
      materials: 'Mastery map + practice archive',
      assessment: 'Two reports + final mastery map',
      arc: [
        'Diagnostic',
        'Concept rebuild',
        'Worked examples',
        'Deliberate practice',
        'Error autopsy',
        'Word problems',
        'Timed set',
        'Mastery map'
      ]
    },
    {
      id: 'math-algebra-uplink',
      subject: 'math',
      title: 'Algebra Uplink',
      subtitle: 'Pre-algebra sprint',
      price: 189,
      sessions: 6,
      unit: 'six sessions',
      summary:
        'A six-session bridge into algebra: variables, equations, functions, and the word problems that connect them.',
      includes: [
        '6 × 55-minute sessions',
        'Equation-solving workflow',
        'Graphing fundamentals',
        'Word-problem translation drills',
        'Checkpoint assessment'
      ],
      outcomes: [
        'Solve equations without guessing',
        'Read and draw a graph correctly',
        'Translate words into algebra'
      ],
      format: '1:1 · online or in-person',
      rhythm: 'Twice weekly for three weeks',
      bestFor: 'Grades 6–8 entering algebra',
      materials: 'Equation workflow card',
      assessment: 'Checkpoint test + feedback',
      arc: [
        'Variables and expressions',
        'Equations and balance',
        'Patterns and functions',
        'Word problems',
        'Graphing',
        'Checkpoint & next steps'
      ]
    },
    {
      id: 'math-ib-matrix',
      subject: 'math',
      title: 'IB Logic Matrix',
      subtitle: 'Moody IB readiness',
      price: 299,
      sessions: 8,
      unit: 'eight sessions',
      summary:
        'Advanced reasoning for future Moody IB students: multi-step problems, justification, inquiry tasks, and a timed mock paper.',
      includes: [
        '8 × 55-minute sessions',
        'MYP criteria walkthrough',
        'Abstract reasoning drills',
        'Justification-writing clinic',
        'Timed mock paper + review'
      ],
      outcomes: [
        'Comfort with unfamiliar problems',
        'Reasoning that earns method marks',
        'A clear IB-readiness verdict'
      ],
      format: '1:1 · online or in-person',
      rhythm: 'Weekly, with one double session',
      bestFor: 'Grades 7–8 aiming at Moody IB',
      materials: 'MYP criteria pack + problem archive',
      assessment: 'Timed mock + written report',
      arc: [
        'Diagnostic against MYP criteria',
        'Abstract reasoning',
        'Multi-step problems',
        'Justification writing',
        'Inquiry task',
        'Timed paper',
        'Error review',
        'Mock debrief'
      ]
    },

    /* -------------------------------- English ------------------------------ */
    {
      id: 'eng-once-upon',
      subject: 'english',
      title: 'Once Upon a Diagnostic',
      subtitle: 'Diagnostic single class',
      price: 35,
      sessions: 1,
      unit: 'one 55-minute session',
      badge: 'Start here',
      summary:
        'One warm, careful session that finds where reading or writing is snagging — and what to do about it first.',
      includes: [
        '55-minute 1:1 session',
        'Reading fluency and comprehension check',
        'A short writing sample',
        'Parent-friendly recap'
      ],
      outcomes: [
        'A clear picture of the gap',
        'One immediate reading or writing win',
        'A practice menu for the week'
      ],
      format: '1:1 · online or in-person',
      rhythm: 'One session',
      bestFor: 'New families and reluctant readers',
      materials: 'Levelled text + writing prompt',
      assessment: 'Written recap within 24 hours',
      arc: [
        'Read-aloud warm-up',
        'Comprehension conversation',
        'A short piece of writing',
        'The three next moves'
      ]
    },
    {
      id: 'eng-storyteller-month',
      subject: 'english',
      title: 'Storyteller’s Month',
      subtitle: 'Weekly English coaching',
      price: 128,
      sessions: 4,
      unit: 'four weekly sessions',
      featured: true,
      badge: 'Most booked',
      summary:
        'Four weeks of reading and writing craft: stronger sentences, sturdier stories, and a reading habit that feels good.',
      includes: [
        '4 × 55-minute 1:1 sessions',
        'Reading log and response journal',
        'Sentence-craft drills',
        'Weekly parent recap',
        'One polished piece of writing'
      ],
      outcomes: [
        'Longer, more confident reading',
        'Clearer paragraphs and sentences',
        'A finished piece worth sharing'
      ],
      format: '1:1, or a sibling pair on request',
      rhythm: 'Weekly for four weeks',
      bestFor: 'Grades 1–8 building literacy confidence',
      materials: 'Reading journal + writing notebook',
      assessment: 'Weekly recap + final piece',
      arc: [
        'Sentence craft',
        'Story structure',
        'Vocabulary and voice',
        'Read, respond, share'
      ]
    },
    {
      id: 'eng-knight-term',
      subject: 'english',
      title: 'Knight’s Semester',
      subtitle: 'Term-long literature coaching',
      price: 236,
      sessions: 8,
      unit: 'eight sessions across the term',
      summary:
        'A term of close reading and essay craft, ending with a portfolio and a writer who can revise without dread.',
      includes: [
        '8 × 55-minute 1:1 sessions',
        'Annotation and close-reading training',
        'Two essays with full revision',
        'Mid-term and final reports',
        'Priority email support'
      ],
      outcomes: [
        'Stronger literary analysis',
        'A revision process that works',
        'A portfolio of polished writing'
      ],
      format: '1:1 · online or in-person',
      rhythm: 'Weekly, with two flex weeks',
      bestFor: 'Grades 5–8 building essay confidence',
      materials: 'Annotation kit + essay planner',
      assessment: 'Two reports + writing portfolio',
      arc: [
        'Diagnostic',
        'Close reading',
        'Annotation practice',
        'Paragraph architecture',
        'Essay draft',
        'Revision clinic',
        'Presentation',
        'Portfolio review'
      ]
    },
    {
      id: 'eng-scribe-workshop',
      subject: 'english',
      title: 'Scribe’s Workshop',
      subtitle: 'Writing sprint',
      price: 179,
      sessions: 6,
      unit: 'six sessions',
      summary:
        'A focused writing workshop: generate ideas, build structure, sharpen sentences, and publish something real.',
      includes: [
        '6 × 55-minute sessions',
        'Idea-generation routines',
        'Structure and outline coaching',
        'Sentence-rhythm drills',
        'A final edited piece'
      ],
      outcomes: [
        'A writing process that reduces blank-page fear',
        'Stronger, more varied sentences',
        'One piece taken from idea to published'
      ],
      format: '1:1 · online or in-person',
      rhythm: 'Twice weekly for three weeks',
      bestFor: 'Grades 4–8 who can write but avoid it',
      materials: 'Writer’s notebook + revision checklist',
      assessment: 'Final piece + editor’s letter',
      arc: [
        'Generating ideas',
        'Structure',
        'Sentence rhythm',
        'Figurative language',
        'Revision',
        'Publish and reflect'
      ]
    },
    {
      id: 'eng-ib-crown',
      subject: 'english',
      title: 'IB Literature Crown',
      subtitle: 'Moody IB readiness',
      price: 289,
      sessions: 8,
      unit: 'eight sessions',
      summary:
        'For readers ready for Moody IB English: comparative analysis, timed essays, oral commentary, and the confidence to argue.',
      includes: [
        '8 × 55-minute sessions',
        'MYP criteria walkthrough',
        'Comparative thesis coaching',
        'Timed essay practice',
        'Oral commentary mock'
      ],
      outcomes: [
        'A repeatable essay structure',
        'Confident text-based argument',
        'A mock oral with real feedback'
      ],
      format: '1:1 · online or in-person',
      rhythm: 'Weekly, with one double session',
      bestFor: 'Grades 7–8 aiming at Moody IB',
      materials: 'Text pack + criteria guide',
      assessment: 'Timed essay + oral mock',
      arc: [
        'Criteria and command terms',
        'Close reading',
        'Comparative thesis',
        'Weaving evidence',
        'Timed essay',
        'Oral commentary',
        'Mock assessment',
        'Final review'
      ]
    },

    /* --------------------------------- IB ---------------------------------- */
    {
      id: 'ib-applicant-diagnostic',
      subject: 'ib',
      title: 'Applicant Diagnostic',
      subtitle: 'One-session readiness review',
      price: 75,
      sessions: 1,
      unit: 'one 60-minute session + report',
      badge: 'Start here',
      summary:
        'A candid, structured review of where the application stands today — strengths, gaps, timing, and the highest-leverage next move.',
      includes: [
        '60-minute 1:1 strategy session',
        'Written readiness report',
        'Activities and evidence audit',
        'Eight-week action plan'
      ],
      outcomes: [
        'Clarity on admissions fit and timing',
        'A prioritised to-do list',
        'A calmer family conversation'
      ],
      format: '1:1 · parent and student welcome',
      rhythm: 'One session',
      bestFor: 'Families starting the Moody IB conversation',
      materials: 'Readiness workbook',
      assessment: 'Written report within 24 hours',
      arc: [
        'Goals and timeline',
        'Academic evidence review',
        'Activities and essays snapshot',
        'The eight-week plan'
      ]
    },
    {
      id: 'ib-interview-intensive',
      subject: 'ib',
      title: 'Interview Intensive',
      subtitle: 'Two mock interviews',
      price: 120,
      sessions: 2,
      unit: 'two 45-minute mock interviews',
      summary:
        'Two realistic mock interviews with direct, kind feedback — so the real conversation feels like the second time, not the first.',
      includes: [
        '2 × 45-minute mock interviews',
        'Question bank and prep notes',
        'Recorded feedback summary',
        'Follow-up email support'
      ],
      outcomes: [
        'Natural, specific answers',
        'Better handling of follow-up questions',
        'Visible confidence in a room'
      ],
      format: '1:1 · online or in-person',
      rhythm: 'Two sessions, one week apart',
      bestFor: 'Candidates who freeze or ramble under pressure',
      materials: 'Interview question bank',
      assessment: 'Written feedback after each mock',
      arc: [
        'Mock one: warm-up and core questions',
        'Feedback and language coaching',
        'Mock two: panel and curveballs',
        'Final presence notes'
      ]
    },
    {
      id: 'ib-application-studio',
      subject: 'ib',
      title: 'Application Studio',
      subtitle: 'Essays, activities, short answers',
      price: 240,
      sessions: 4,
      unit: 'four working sessions',
      featured: true,
      badge: 'Most booked',
      summary:
        'Four working sessions that turn a scattered application into a coherent, specific, and genuinely likeable story.',
      includes: [
        '4 × 55-minute working sessions',
        'Positioning and through-line',
        'Essay drafts with line edits',
        'Activities list rebuild',
        'Final consistency review'
      ],
      outcomes: [
        'A clear application narrative',
        'Essays that sound like your child',
        'A tidy, complete activities list'
      ],
      format: '1:1 · student-led, parent check-in',
      rhythm: 'Weekly for four weeks',
      bestFor: 'Families mid-application',
      materials: 'Application workbook + edit tracker',
      assessment: 'Line-edited drafts + final review',
      arc: [
        'Positioning and evidence map',
        'Essay one: story and specificity',
        'Essay two: reflection and growth',
        'Activities and final consistency pass'
      ]
    },
    {
      id: 'ib-candidate-sprint',
      subject: 'ib',
      title: 'Candidate Sprint',
      subtitle: 'Full application coaching',
      price: 420,
      sessions: 8,
      unit: 'eight sessions + full review',
      summary:
        'The complete coaching arc: positioning, essays, activities, interview practice, and a final submission review with a calm handoff.',
      includes: [
        '8 × 55-minute sessions',
        'Full essay and short-answer coaching',
        'Two mock interviews',
        'Activities list rebuild',
        'Complete final application review',
        'Priority email support'
      ],
      outcomes: [
        'A finished, coherent application',
        'Interview experience before the real thing',
        'A family that knows exactly what happens next'
      ],
      format: '1:1 · online or in-person',
      rhythm: 'Weekly, with two flex weeks',
      bestFor: 'Families who want the whole process held',
      materials: 'Full application workbook',
      assessment: 'Written review at every milestone',
      arc: [
        'Diagnostic and positioning',
        'Evidence map',
        'Essay one',
        'Essay two',
        'Short answers',
        'Activities list',
        'Mock panel',
        'Final review and submission plan'
      ]
    },
    {
      id: 'ib-subject-readiness',
      subject: 'ib',
      title: 'IB Subject Readiness',
      subtitle: 'Six sessions in one subject',
      price: 300,
      sessions: 6,
      unit: 'six subject sessions',
      summary:
        'Six sessions in English, Math, or Science to make sure the academic evidence matches the ambition — with MYP-style tasks and feedback.',
      includes: [
        '6 × 55-minute subject sessions',
        'MYP criteria alignment',
        'Two assessed tasks',
        'Written subject-readiness note',
        'Parent debrief'
      ],
      outcomes: [
        'Evidence at the level Moody expects',
        'Comfort with MYP task language',
        'A clear subject verdict'
      ],
      format: '1:1 · online or in-person',
      rhythm: 'Twice weekly for three weeks',
      bestFor: 'Strong applicants with one thin subject',
      materials: 'Subject criteria pack',
      assessment: 'Two assessed tasks + report',
      arc: [
        'Diagnostic',
        'Concept rebuild',
        'MYP task practice',
        'Writing and justification',
        'Mock task',
        'Readiness plan'
      ]
    }
  ];

  function plansFor(subject) {
    return PLANS.filter(function (plan) {
      return plan.subject === subject;
    });
  }

  function planById(id) {
    return (
      PLANS.filter(function (plan) {
        return plan.id === id;
      })[0] || null
    );
  }

  /* ---------------------------------------------------------------------------
   * Specialty Center
   * ------------------------------------------------------------------------- */

  var SPECIALTY = [
    {
      id: 'study-strategy',
      title: 'Study Strategy Session',
      price: 45,
      unit: 'one 50-minute session',
      summary:
        'A focused working session that turns “I don’t know how to study” into a repeatable weekly system.',
      includes: [
        'Skills and habits diagnosis',
        'A written weekly study plan',
        'Focus and recall routines',
        'Parent summary'
      ],
      bestFor: 'Students who study hard but score below their effort',
      turnaround: 'Plan delivered the same day'
    },
    {
      id: 'application-review',
      title: 'IB Application Review',
      price: 60,
      unit: 'written review + 30-minute call',
      summary:
        'A line-by-line review of the application as it stands, with candid notes on strength, specificity, and fit.',
      includes: [
        'Full application read-through',
        'Margin notes on every essay',
        'Priority fix list',
        '30-minute family call'
      ],
      bestFor: 'Families who have drafts and need a second set of eyes',
      turnaround: 'Review within three school days'
    },
    {
      id: 'essay-review',
      title: 'Essay & Writing Review',
      price: 55,
      unit: 'one essay, fully edited',
      summary:
        'A serious edit — structure, evidence, sentence craft, and voice — with a short note explaining every major change.',
      includes: [
        'Structural feedback',
        'Line edits',
        'A model paragraph',
        'Revision checklist'
      ],
      bestFor: 'Application essays, IB tasks, and scholarship writing',
      turnaround: 'Within three school days'
    },
    {
      id: 'interview-coaching',
      title: 'Interview Coaching',
      price: 50,
      unit: 'one 45-minute session',
      summary:
        'A single mock interview for a specific deadline, with direct feedback and three things to fix before the real one.',
      includes: [
        'Realistic mock interview',
        'Immediate verbal feedback',
        'Three priority fixes',
        'Question bank'
      ],
      bestFor: 'Last-minute interview preparation',
      turnaround: 'Feedback the same day'
    },
    {
      id: 'academic-audit',
      title: 'Academic Audit',
      price: 40,
      unit: 'records review + written plan',
      summary:
        'Send the report cards, tests, and teacher notes. Receive a clear, honest picture of the academic story and what to strengthen.',
      includes: [
        'Records and grade review',
        'Trend analysis',
        'Written strengths and gaps memo',
        'Recommended term plan'
      ],
      bestFor: 'Families planning a subject or school transition',
      turnaround: 'Within three school days'
    },
    {
      id: 'parent-consult',
      title: 'Parent Strategy Consult',
      price: 0,
      unit: '20 minutes, no charge',
      summary:
        'A short conversation about fit, timing, and what support would actually help. No pressure, no invoice.',
      includes: [
        '20-minute call',
        'Honest fit assessment',
        'Next-step recommendation',
        'No obligation'
      ],
      bestFor: 'Families deciding whether tutoring is the right move',
      turnaround: 'Scheduled within one school day'
    }
  ];

  function serviceById(id) {
    return (
      SPECIALTY.filter(function (service) {
        return service.id === id;
      })[0] || null
    );
  }

  /* ---------------------------------------------------------------------------
   * Shared content
   * ------------------------------------------------------------------------- */

  var STEPS = [
    {
      title: 'Choose the room',
      body: 'Browse Science, Math, English, or Moody IB. Every plan opens into a full specification — format, rhythm, outcomes, and the session-by-session arc.'
    },
    {
      title: 'Build the cart',
      body: 'Add a grade course, a monthly bundle, or a signature plan. Bundles cap their discount at 15%, so the value is real without undervaluing the teaching.'
    },
    {
      title: 'Request the meeting',
      body: 'Tell us about your child and the times that work. The request opens a pre-filled Gmail draft to the instructor — nothing is charged online.'
    },
    {
      title: 'Meet, agree, begin',
      body: 'We meet in person or on a call, confirm fit, and agree on a cash payment schedule. Then the portal opens with assignments and progress.'
    }
  ];

  var FAQ = [
    {
      q: 'Is there any online payment?',
      a: 'No. You build a cart and request a meeting; the site opens a Gmail draft so the instructor knows who is coming and what they are interested in. Payment is cash, in person, after the consultation.'
    },
    {
      q: 'How do the bundles stay profitable?',
      a: 'Bundle discounts are capped at 15% and calculated from the single-class rate. A four-class month takes 10% off; an eight-class term takes 15% off. No bundle can fall below 85% of list price.'
    },
    {
      q: 'What is the difference between a grade course and a signature plan?',
      a: 'Grade courses are the per-grade single class or bundle — the simplest way to book steady support. Signature plans add structure around the sessions: diagnostics, notebooks, reports, and a defined arc.'
    },
    {
      q: 'Who can see grades and assignments?',
      a: 'Only a signed-in family or student, using the shared family login, and the instructor. The instructor console requires a username, password, and a separate secret word.'
    },
    {
      q: 'Do you teach online?',
      a: 'Yes. Sessions run in person around Moody or online with a shared notebook. Lab-intensive science sessions are preferably in person.'
    },
    {
      q: 'How do you handle Moody IB applications?',
      a: 'Start with the Applicant Diagnostic. It produces a written readiness report and an eight-week plan; from there families choose Interview Intensive, Application Studio, or the full Candidate Sprint.'
    }
  ];

  var GOALS = [
    { id: 'catch-up', label: 'Catch up', detail: 'Rebuild the missing foundation' },
    { id: 'keep-pace', label: 'Keep pace', detail: 'Stay steady through the school year' },
    { id: 'accelerate', label: 'Get ahead', detail: 'Stretch into the next level' },
    { id: 'ib', label: 'Moody IB', detail: 'Prepare for admission and MYP work' }
  ];

  /* ---------------------------------------------------------------------------
   * Cart item resolution
   * ------------------------------------------------------------------------- */

  function resolveItem(code) {
    var parts = String(code || '').split(':');
    if (parts[0] === 'plan') {
      var plan = planById(parts[1]);
      if (!plan) return null;
      var subject = plan.subject === 'ib' ? IB : SUBJECTS[plan.subject];
      return {
        key: 'plan:' + plan.id,
        kind: 'plan',
        title: plan.title,
        subtitle: subject.name + ' · ' + plan.unit,
        price: plan.price,
        subject: plan.subject,
        meta: { planId: plan.id, sessions: plan.sessions }
      };
    }

    if (parts[0] === 'course') {
      var subjectId = parts[1];
      var grade = Number(parts[2]);
      var mode = parts[3] || 'single';
      var course = courseBy(subjectId, grade);
      if (!course) return null;
      var label = SUBJECTS[subjectId].name + ' · Grade ' + grade;
      if (mode === 'single') {
        return {
          key: 'course:' + subjectId + ':' + grade + ':single',
          kind: 'course',
          title: 'Grade ' + grade + ' ' + SUBJECTS[subjectId].name + ' — single class',
          subtitle: label + ' · one 55-minute class',
          price: course.single,
          subject: subjectId,
          meta: { grade: grade, mode: 'single' }
        };
      }
      if (mode === 'month' || mode === 'term') {
        var bundle = mode === 'month' ? course.month : course.term;
        return {
          key: 'course:' + subjectId + ':' + grade + ':' + mode,
          kind: 'bundle',
          title: 'Grade ' + grade + ' ' + SUBJECTS[subjectId].name + ' — ' + bundle.label,
          subtitle: label + ' · ' + bundle.sessions + ' classes · save ' + bundle.save,
          price: bundle.price,
          subject: subjectId,
          meta: { grade: grade, mode: mode, sessions: bundle.sessions }
        };
      }
      return null;
    }

    if (parts[0] === 'service') {
      var service = serviceById(parts[1]);
      if (!service) return null;
      return {
        key: 'service:' + service.id,
        kind: 'specialty',
        title: service.title,
        subtitle: 'Specialty Center · ' + service.unit,
        price: service.price,
        subject: 'specialty',
        meta: { serviceId: service.id }
      };
    }

    return null;
  }

  global.MoodyData = {
    SITE: SITE,
    GRADES: GRADES,
    BUNDLES: BUNDLES,
    SUBJECTS: SUBJECTS,
    IB: IB,
    COURSES: COURSES,
    PLANS: PLANS,
    SPECIALTY: SPECIALTY,
    STEPS: STEPS,
    FAQ: FAQ,
    GOALS: GOALS,
    singlePrice: singlePrice,
    bundleFor: bundleFor,
    courseBy: courseBy,
    plansFor: plansFor,
    planById: planById,
    serviceById: serviceById,
    resolveItem: resolveItem
  };
})(window);
