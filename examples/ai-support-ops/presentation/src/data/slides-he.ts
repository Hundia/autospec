export const slidesHE = [
  // ── ACT 1 — PROBLEM ──────────────────────────────────────────────────────────

  // 1. title
  {
    type: 'title',
    title: 'AutoSpec',
    subtitle: 'מדרישות לקוד עובד',
    tagline: 'תגרום ל-AI לחשוב לפני שהוא כותב קוד.',
    presenter: 'אלי חונדיה',
  },

  // 2. eraTraditional
  {
    type: 'eraTraditional',
    title: 'עידן הפיתוח המסורתי',
    subtitle: 'הפיתוח היה איטי אך צפוי',
    characteristics: [
      { icon: '⌨️', title: 'קידוד ידני', description: 'כל שורה נכתבת ביד' },
      { icon: '👥', title: 'סקירות קוד', description: 'שמירת איכות על ידי בני אדם' },
      { icon: '📖', title: 'תיעוד', description: 'קיים כי בני אדם כתבו אותו' },
      { icon: '🧠', title: 'זיכרון ארגוני', description: 'הידע נשמר אצל אנשים' },
    ],
    metrics: { speed: 'נמוכה', predictability: 'גבוהה', docs: 'מקיף', knowledge: 'שמור' },
  },

  // 3. eraAssistant
  {
    type: 'eraAssistant',
    title: 'עידן עוזר הקוד',
    subtitle: 'AI עזר לך להקליד מהר יותר, לא לחשוב טוב יותר',
    tools: ['GitHub Copilot', 'TabNine', 'Kite'],
    gains: [
      { title: 'מהירות הקלדה', description: 'השלמה אוטומטית מהירה פי 3' },
      { title: 'קוד שגרתי', description: 'קוד חוזר הוסר' },
    ],
    unchanged: [
      { title: 'החלטות עיצוב', description: 'עדיין לגמרי אנושיות' },
      { title: 'ארכיטקטורה', description: 'אין מעורבות AI' },
    ],
    decisionAuthority: 'אנושי',
  },

  // 4. eraAgentic
  {
    type: 'eraAgentic',
    title: 'עידן הסוכנים',
    subtitle: 'כוח מהפכני, אוטונומיה מסוכנת',
    tools: ['Claude Code', 'Cursor', 'Devin'],
    power: [
      { title: 'פיצ\'רים מלאים', description: 'מודולים שלמים בפרומפט אחד' },
      { title: 'כל המחסנית', description: 'Frontend + Backend + DB יחד' },
      { title: 'אוטונומי', description: 'AI מקבל החלטות מימוש' },
    ],
    danger: [
      { title: 'אין זיכרון', description: 'כל סשן מתחיל מאפס' },
      { title: 'סחיפת הקשר', description: 'שיחות ארוכות משחיתות החלטות' },
      { title: 'אפס תיעוד', description: 'לוגי צ\'אט אינם תיעוד' },
    ],
  },

  // 5. contextPoisoning
  {
    type: 'contextPoisoning',
    title: 'הרעלת הקשר',
    subtitle: 'שיחות ארוכות לא רק מאבדות הקשר — הן פוגמות בו באופן פעיל',
    stages: [
      { turn: 'תור 1', status: 'נקי', color: 'green', snippet: 'השתמש ב-PostgreSQL עם Prisma ORM', description: 'החלטות ראשוניות ברורות' },
      { turn: 'תור 25', status: 'סחיפה', color: 'yellow', snippet: 'בעצם, בואנו ננסה MongoDB כאן...', description: 'סתירה לבחירות קודמות' },
      { turn: 'תור 50', status: 'סתירה', color: 'orange', snippet: 'רגע, אנחנו משתמשים ב-Prisma נכון?', description: 'שכחה של מה שהוחלט' },
      { turn: 'תור 100', status: 'כאוס', color: 'red', snippet: 'TypeError: Cannot read undefined', description: 'שגיאות מצטברות מהקשר אבוד' },
    ],
    chat: {
      windowTitle: 'AI Agent — project/database',
      messages: [
        { role: 'user', turn: 1, text: 'הגדר את שכבת בסיס הנתונים. אנחנו רוצים PostgreSQL עם Prisma ORM לשאילתות type-safe.' },
        { role: 'ai', turn: 1, text: 'בחירה מצוינת. אגדיר PostgreSQL עם Prisma, אבנה את הסכמה ואייצר את הקליינט. יוצר schema.prisma...' },
        { role: 'user', turn: 25, text: 'שאילתת פید הפעילות מאטה עם כל ה-joins. יש רעיונות?' },
        { role: 'ai', turn: 25, text: 'לפיד הפעילות, MongoDB יהיה הרבה יותר מתאים — מסמכים ממפים בצורה טבעית לאירועים. אוסיף חיבור Mongo לאוסף הזה.', flag: 'drift' },
        { role: 'user', turn: 50, text: 'פיד הפעילות שבור. אני מקבל שגיאות אימות סכמה בכל כתיבה.' },
        { role: 'ai', turn: 50, text: 'אני רואה את הבעיה — מודלי Prisma שלך לא כוללים קשר activityFeed. אוסיף אותו ל-schema.prisma ואריץ migration.', flag: 'contradiction' },
        { role: 'user', turn: 100, text: 'עכשיו אני מקבל TypeError: Cannot read properties of undefined בכל קריאה לבסיס הנתונים.' },
        { role: 'ai', turn: 100, text: 'הבעיה היא שהקליינט של Prisma לא מאותחל. תן לי להוסיף Mongoose גם לטבלאות הרלציוניות ולאחד הכל תחת ODM אחד.', flag: 'poisoned' },
        { role: 'user', turn: 100, text: 'אתה פשוט לא מבין... אתה גרוע. אני לעולם לא משתמש בפיתוח אג\'נטי שוב, בזבוז של הזמן שלי!', flag: 'frustrated' },
      ],
    },
  },

  // 6. reverseTax
  {
    type: 'reverseTax',
    title: 'מס ההנדסה לאחור',
    subtitle: 'חודשיים לאחר מכן, אתה מבצע הנדסה לאחור על בסיס הקוד שלך',
    dayOne: {
      title: 'יום 1',
      items: ['הקשר AI פעיל', 'AI מכיר את כל המוסכמות', 'מתקדמים מהר, שולחים פיצ\'רים'],
    },
    daySixty: {
      title: 'יום 60',
      items: ['לוגי צ\'אט נמחקו או מיושנים', 'אפס הקשר לסשנים חדשים', '"למה זה נבנה כך?"'],
    },
    cost: { hours: 40, label: 'שעות אבודות להנדסה לאחור בכל רבעון' },
  },

  // 7. breakingPoint
  {
    type: 'breakingPoint',
    title: 'נקודת השבר',
    subtitle: 'ככל שתבנה מהר יותר, כך תאבד מהר יותר',
    buildItems: ['6 סוכני AI', '200+ קבצים שנוצרו', '50 סשני צ\'אט'],
    debtItems: ['0 מסמכים נכתבו', '0 החלטות תועדו', '0 מסירה אפשרית'],
    stats: [
      { value: '73%', label: 'מפרויקטי AI נזנחים תוך 6 חודשים' },
      { value: '40 שעות', label: 'מוצאות להבין מחדש קוד בכל רבעון' },
      { value: '$0', label: 'ערך לוגי צ\'אט לאחר סיום הסשן' },
    ],
    bottomLine: 'פיתוח אג\'נטי ללא מבנה הוא חוב טכני במהירות AI.',
  },

  // ── ACT 2 — TURNING POINT ────────────────────────────────────────────────────

  // 8. sddCostOfChaos
  {
    type: 'sddCostOfChaos',
    title: 'המחיר של בלי מפרטים',
    subtitle: 'AI אג\'נטי בלי מפרטים הוא נטל, לא נכס',
    columns: {
      left: {
        label: 'עם שיחה',
        color: 'red',
        items: [
          { icon: '💬', text: 'ההקשר מתדרדר אחרי תור 30' },
          { icon: '🔄', text: 'כל סשן מתחיל מאפס' },
          { icon: '❌', text: 'החלטות אובדות כשהצ\'אט נגמר' },
          { icon: '🚫', text: 'שום סוכן לא יכול להמשיך את העבודה שלך' },
        ],
      },
      right: {
        label: 'עם מפרטים',
        color: 'green',
        items: [
          { icon: '📐', text: 'החלטות שמורות ב-specs/' },
          { icon: '🔗', text: 'כל סשן יורש הקשר מלא' },
          { icon: '✅', text: 'בחירות שורדות לנצח ב-docs/' },
          { icon: '🤖', text: 'כל סוכן יכול להמשיך בצורה חלקה' },
        ],
      },
    },
    callout: 'מפרטים הם הזיכרון ש-AI מעולם לא קיבל.',
  },

  // 9. bridge
  {
    type: 'bridge',
    title: 'מה אם...',
    question: 'מה אם ל-AI היה כל ההקשר לפני שכתב שורת קוד אחת?',
    points: [
      'מה אם כל החלטה תועדה, לא רק הקוד?',
      'מה אם סשנים חדשים ירשו את כל הידע הקודם?',
      'מה אם סוכני AI עבדו ממפרטים, לא משיחות?',
    ],
  },

  // ── ACT 3 — BUILDING BLOCKS ──────────────────────────────────────────────────

  // 10. sddThreePillars — introduce SDD concepts one by one
  {
    type: 'sddThreePillars',
    title: 'אבני הבניין של SDD',
    subtitle: 'שלושה רעיונות פשוטים שפותרים את כל מה שראינו',
    pillars: [
      {
        number: '01',
        title: 'מפרטים כקוד',
        description: 'כל החלטה חיה בקובץ .md ב-specs/. לא בלוגי צ\'אט, לא בראש שלך — בקבצים עם version control שכל סוכן יכול לקרוא.',
        artifact: 'specs/*.md',
        icon: '📐',
        color: 'teal',
      },
      {
        number: '02',
        title: 'סיכומי ספרינט',
        description: 'כל ספרינט מסתיים בסיכום: מה נבנה, מה השתנה, מה הוחלט. הסוכן הבא ממשיך בדיוק מאיפה שהפסקת.',
        artifact: 'sprints/sprint-X/summary.md',
        icon: '📋',
        color: 'emerald',
      },
      {
        number: '03',
        title: 'דוקומנטציה חיה',
        description: 'הדוקומנטציה גדלה עם כל טיקט. ארכיטקטורה, APIs, תהליכים — תמיד עדכני, אף פעם לא מיושן. ידע מצטבר במקום לדעוך.',
        artifact: 'docs/ (גדל כל ספרינט)',
        icon: '📖',
        color: 'cyan',
      },
    ],
  },

  // 11. roles — different perspectives catch what a single viewpoint misses
  {
    type: 'roles',
    title: 'מודל 10 התפקידים',
    description: 'תפקידים הם נקודות מבט לכתיבת מפרטים',
    roles: [
      { num: '01', name: 'מנהל מוצר', focus: 'חזון, פרסונות, תהליכים', specFile: 'specs/01_product_manager.md' },
      { num: '02', name: 'ליד Backend', focus: 'APIs, אימות, שירותים', specFile: 'specs/02_backend_lead.md' },
      { num: '03', name: 'ליד Frontend', focus: 'קומפוננטות, עיצוב', specFile: 'specs/03_frontend_lead.md' },
      { num: '04', name: 'ארכיטקט DB', focus: 'סכמה, מיגרציות', specFile: 'specs/04_db_architect.md' },
      { num: '05', name: 'ליד QA', focus: 'אסטרטגיית בדיקות', specFile: 'specs/05_qa_lead.md' },
      { num: '06', name: 'ליד DevOps', focus: 'תשתיות, CI/CD', specFile: 'specs/06_devops_lead.md' },
      { num: '07', name: 'ליד שיווק', focus: 'Go-to-market', specFile: 'specs/07_marketing_lead.md' },
      { num: '08', name: 'ליד פיננסים', focus: 'תמחור, כלכלה', specFile: 'specs/08_finance_lead.md' },
      { num: '09', name: 'ליד עסקי', focus: 'אסטרטגיה, תחרות', specFile: 'specs/09_business_lead.md' },
      { num: '10', name: 'מעצב UI', focus: 'מסכים, wireframes', specFile: 'specs/10_ui_designer.md' },
    ],
    agentDistinction: {
      subtitle: 'תפקיד הוא תיאור תפקיד. סוכן הוא העובד. סוכן אחד יכול ללבוש כמה כובעים.',
      lanes: [
        { agent: 'Orchestrator', roles: ['מנהל מוצר', 'ליד עסקי'] },
        { agent: 'Agent A', roles: ['ליד Backend', 'ארכיטקט DB', 'ליד DevOps'] },
        { agent: 'Agent B', roles: ['ליד Frontend', 'ליד QA', 'מעצב UI'] },
      ],
    },
    insight: 'גם מפתחים יחידים נהנים מחשיבה בתפקידים.',
  },

  // 12. docsFolder — knowledge compounds over time
  {
    type: 'docsFolder',
    title: 'דוקומנטציה חיה',
    subtitle: 'ידע שמצטבר עם כל ספרינט',
    tree: [
      { name: 'docs/', type: 'folder', depth: 0 },
      { name: 'database/', type: 'folder', depth: 1, annotation: 'סכמה, ERD, קשרים' },
      { name: 'auth/', type: 'folder', depth: 1, annotation: 'JWT, guards, תפקידים' },
      { name: 'scheduling/', type: 'folder', depth: 1, annotation: 'שיעורים, קיבולת, תצוגות' },
      { name: 'bookings/', type: 'folder', depth: 1, annotation: 'מכונת מצבים, רשימת המתנה' },
      { name: 'frontend/', type: 'folder', depth: 1, annotation: 'נתיבים, stores, שירותים' },
      { name: 'telegram/', type: 'folder', depth: 1, annotation: 'בוט, GPT-4o, webhooks' },
      { name: 'README.md', type: 'file', depth: 1, annotation: 'מפת ניווט ראשית' },
    ],
    growth: [
      { sprint: 'ספרינט 0', docs: 8 },
      { sprint: 'ספרינט 3', docs: 28 },
      { sprint: 'ספרינט 6', docs: 62 },
      { sprint: 'ספרינט 10', docs: 100 },
    ],
    comparison: {
      without: 'הדוקומנטציה נרקבת אחרי יום אחד. סוכנים חדשים מבצעים הנדסה לאחור על הכל.',
      with: 'כל טיקט מעדכן docs/. סוכנים חדשים יורשים 100% מידע על הפרויקט.',
    },
  },

  // 13. qaTestingSlide — בדיקות E2E מונעות AI
  {
    type: 'qaTestingSlide',
    title: 'QA: בדיקות End-to-End מונעות AI',
    subtitle: 'הסוכן לא רק כותב קוד — הוא מאמת את העבודה שלו',
    workflow: [
      { step: '01', title: 'תכנן בדיקות', icon: '📋', description: 'הסוכן קורא מפרטים ומתכנן אסטרטגיית בדיקות', color: 'blue' },
      { step: '02', title: 'הגדר Mocks', icon: '🔧', description: 'הגדרת בסיס נתונים לבדיקות, API stubs, fixtures', color: 'violet' },
      { step: '03', title: 'הרץ Playwright', icon: '🎭', description: 'הרצת בדיקות E2E מול סביבת preprod', color: 'green' },
      { step: '04', title: 'תעד תוצאות', icon: '📝', description: 'עדכון סיכום ספרינט עם עקיבות pass/fail', color: 'teal' },
    ],
    terminal: {
      title: 'playwright — test suite',
      lines: [
        { text: '> npx playwright test --project=chromium', type: 'command' },
        { text: '  Running 23 tests using 3 workers', type: 'info' },
        { text: '  ✓ TC-01 Admin login with valid credentials (1.2s)', type: 'pass' },
        { text: '  ✓ TC-02 JWT refresh token rotation (0.8s)', type: 'pass' },
        { text: '  ✓ TC-03 Create class via API (0.5s)', type: 'pass' },
        { text: '  ✓ TC-07 Booking with credit deduction (1.1s)', type: 'pass' },
        { text: '  ✗ TC-12 Waitlist promotion on cancel (2.3s)', type: 'fail' },
        { text: '    → Expected: status "confirmed", Received: "waitlisted"', type: 'error' },
        { text: '  ✓ TC-18 Schedule page renders classes (1.8s)', type: 'pass' },
        { text: '  ✓ TC-21 My Bookings displays correctly (1.4s)', type: 'pass' },
        { text: '  22 passed, 1 failed (18.4s)', type: 'summary' },
      ],
    },
    providers: ['Claude Code', 'GitHub Copilot', 'Gemini', 'Continue'],
    callout: 'כל סוכן AI שיכול לקרוא מפרטים יכול להריץ את חבילת הבדיקות שלך. אגנוסטי לספק מעצם תכנונו.',
  },

  // 14. sprintMemorySlide — סיכומי ספרינט כזיכרון הרצה
  {
    type: 'sprintMemorySlide',
    title: 'זיכרון ספרינט: לעולם לא לאבד הקשר',
    subtitle: 'סיכומי ספרינט הם מסמך המסירה שמעולם לא היה קיים',
    summary: {
      command: '> /sprint-close',
      progress: 'סוגר ספרינט 11... מייצר סיכום...',
      result: '✓ sprints/sprint-11/summary.md נוצר',
      sections: [
        { label: 'Release Notes', color: 'blue', items: ['הוספת JWT auth עם refresh tokens', 'עמוד התחברות עם OTP', '3 API endpoints חדשים'] },
        { label: 'דוקומנטציה מקושרת', color: 'violet', items: ['docs/auth/01-architecture.md', 'docs/auth/02-jwt-flow.md', 'docs/frontend/03-login-page.md'] },
        { label: 'קבצים ששונו', color: 'green', items: ['+ src/auth/auth.service.ts', '+ src/auth/auth.guard.ts', '~ src/pages/Login.tsx', '... 12 נוספים'] },
        { label: 'Commit סגירה', color: 'amber', items: ['a3f7c21 feat(sprint-11): auth + login'] },
      ],
    },
    benefits: [
      { icon: '⚡', title: 'הקשר מיידי', description: 'הסוכן קורא סיכום → הקשר מלא ב-30 שניות' },
      { icon: '🔍', title: 'השוואת ספרינטים', description: 'השווה ספרינט 3 מול ספרינט 7 → ראה בדיוק מה השתנה' },
      { icon: '🚫', title: 'ללא קריאת קוד', description: 'הכל מקושר — אין צורך בהנדסה לאחור' },
      { icon: '🤝', title: 'מסירה מושלמת', description: 'כל סוכן, כל ספק, ממשיך מאיפה שעצרת' },
    ],
    callout: 'סיכום הספרינט הוא הזיכרון ש-AI מעולם לא קיבל.',
  },

  // ── ACT 4 — THE REVEAL ─────────────────────────────────────────────────────────

  // 15. solution — AutoSpec packages all the building blocks
  {
    type: 'solution',
    title: 'AutoSpec: ערכת הכלים שלך ל-SDD',
    subtitle: 'פרומפט אחד. עשרה מפרטים. אפס אובדן הקשר.',
    capabilities: [
      { number: '01', title: '10 מפרטים שנוצרו ב-AI', description: 'מסמך דרישות אחד מייצר 10 קבצי מפרט מבוססי תפקידים — מנהל מוצר, Backend, Frontend, DB, QA, DevOps ועוד.', artifact: '$ autospec init → specs/*.md', icon: '📐' },
      { number: '02', title: 'הרצת ספרינטים מתואמת', description: 'סוכן PM של Opus מתאם סוכני Sonnet שרצים ב-worktrees מקביליים. לכל סוכן הקשר מלא מהמפרטים.', artifact: 'Opus → [Agent A, B, C] → merge', icon: '🎯' },
      { number: '03', title: 'מערכת ידע חיה', description: 'כל משימה מעדכנת docs/, באקלוג וסיכומי ספרינט. הידע מצטבר עם כל ספרינט.', artifact: 'docs/ (100+ קבצים אחרי ספרינט 10)', icon: '📖' },
      { number: '04', title: 'סוקר ויזואלי (אפליקציית Viewer)', description: 'דשבורד שנוצר אוטומטית מאפשר לסקור ארכיטקטורה, באקלוג kanban, תהליכים ומסכי דמו ויזואלית — לפני כתיבת שורת קוד אחת. הסכם על העיצוב קודם.', artifact: 'viewer/ (React SPA)', icon: '👁️' },
    ],
    keyInsight: 'AutoSpec מממש SDD כדי שתפסיק לדון במתודולוגיה ותתחיל לשלוח.',
  },

  // 14. pipeline — the full end-to-end workflow
  {
    type: 'pipeline',
    scrollable: true,
    title: 'צינור העבודה המלא של AutoSpec',
    subtitle: 'מדרישות לקוד עובד — סקור הכל לפני שתבנה',
    pipelineCallout: 'המפתח שסוקר לפני שמקודד שולח מהר יותר מזה שמקודד לפני שחושב. סיכום הספרינט מבטיח שאף ידע לא הולך לאיבוד.',
    steps: [
      {
        number: '01',
        title: 'כתוב דרישות',
        subtitle: 'לכוד את החזון שלך במסמך SRS מובנה. כוונה אנושית מתועדת פעם אחת, מבוצעת פעמים רבות.',
        time: '1-2 שעות',
        output: 'requirements.md',
        hero: false,
        accentColor: 'blue',
      },
      {
        number: '02',
        title: 'הפק מפרטים',
        subtitle: 'פרומפט אחד מייצר 10 קבצי מפרט מבוססי תפקידים. מנהל מוצר, Backend, Frontend, DB, QA, DevOps, שיווק, פיננסים, עסקי, UI — כל אחד כותב מהתמחותו.',
        time: '5 דקות',
        output: 'specs/*.md (10 קבצים)',
        hero: false,
        accentColor: 'violet',
      },
      {
        number: '03',
        title: 'הפק דוקומנטציה',
        subtitle: 'דיאגרמות ארכיטקטורה, API endpoints, ERDs של בסיס הנתונים, תרשימי זרימה, wireframes — הכל נוצר מהמפרטים לפני שנכתבת שורת קוד אחת.',
        time: '10 דקות',
        output: 'docs/ (50+ קבצים)',
        hero: false,
        accentColor: 'emerald',
      },
      {
        number: '04',
        title: 'הפק כלים',
        subtitle: 'קבצי פקודה מותאמי סביבה שעובדים בכל IDE. הרצת ספרינטים, ניהול משימות, אימות QA — הכל מקודד ככלים לשימוש חוזר.',
        time: '2 דקות',
        output: '.claude/commands/ (10 כלים)',
        hero: false,
        accentColor: 'cyan',
      },
      {
        number: '05',
        title: 'בנה וסקור Viewer',
        subtitle: 'לפני כתיבת קוד, סקור הכל ויזואלית: ארכיטקטורה, באקלוג kanban, תהליכים, מסכי דמו. הסכם על העיצוב קודם — הפיתוח לא דורש פרשנות.',
        time: '5 דקות',
        output: 'אפליקציית Viewer (דשבורד חי)',
        hero: true,
        accentColor: 'amber',
      },
      {
        number: '06',
        title: 'תכנן והרץ ספרינטים',
        subtitle: 'Opus מתזמר כותב briefs לספרינט ומשגר סוכני Sonnet מקביליים ב-worktrees מבודדים. לכל סוכן הקשר מלא מהמפרטים — בלי הזיות, בלי סחיפה.',
        time: '2-4 שעות/ספרינט',
        output: 'פיצ\'רים עובדים + docs/',
        hero: false,
        accentColor: 'indigo',
      },
      {
        number: '07',
        title: 'QA + עדכונים חיים',
        subtitle: 'לולאת אימות: בנייה, בדיקה, תיקון, אימות. כל משימה מעדכנת docs/, באקלוג וסיכומי ספרינט. הידע מצטבר עם כל ספרינט.',
        time: '30 דקות',
        output: 'קוד מאומת + docs/ מעודכן',
        hero: false,
        accentColor: 'green',
      },
      {
        number: '08',
        title: 'סקירת משתמש',
        subtitle: 'בעל המוצר בודק את תוצרי הספרינט ב-preprod. הוא עובר על פיצ\'רים חדשים, מוודא שה-UX תואם לציפיות, ומאשר או מבקש שינויים. שיפוט אנושי לפני פרודקשן.',
        time: '1-2 שעות',
        output: 'אישור או בקשות שינוי',
        hero: false,
        accentColor: 'rose',
      },
      {
        number: '09',
        title: 'סגירת ספרינט וסיכום',
        subtitle: 'הרץ /sprint-close כדי לייצר סיכום ספרינט מקיף: release notes, דוקומנטציה מקושרת, קבצים ששונו, commit סגירה. זה הקסם — בפעם הבאה שסוכן יגע בקוד הזה, כל ההקשר נמצא כאן.',
        time: '5 דקות',
        output: 'sprints/sprint-X/summary.md',
        hero: true,
        accentColor: 'teal',
      },
    ],
  },

  // 15. orchestrator — how execution works with parallel agents
  {
    type: 'orchestrator',
    title: 'תבנית ה-Orchestrator',
    subtitle: 'אותה תבנית, כל ספק AI',
    providers: [
      { id: 'claude', name: 'Claude Code', icon: '🟣', accent: 'indigo', orchestratorModel: 'Opus 4.6', agentModel: 'Sonnet 4.6' },
      { id: 'copilot', name: 'GitHub Copilot', icon: '🔵', accent: 'blue', orchestratorModel: 'GPT 5.4', agentModel: 'GPT 5.2' },
      { id: 'gemini', name: 'Gemini', icon: '🟡', accent: 'amber', orchestratorModel: 'Gemini Ultra', agentModel: 'Gemini Pro' },
      { id: 'local', name: 'Continue (Local)', icon: '🟢', accent: 'green', orchestratorModel: 'GPT OSS 120B', agentModel: 'GPT OSS 7B' },
    ],
    orchestrator: {
      roleLabel: 'מנהל מוצר',
      tasks: ['כותב briefs לספרינט', 'משגר סוכנים מקביליים', 'מסדר לפי גרף תלויות', 'סוקר תוצאות ומאחד'],
    },
    agents: [
      { roleLabel: 'Agent A', task: 'טיקטים של Backend ב-worktree-a' },
      { roleLabel: 'Agent B', task: 'טיקטים של Frontend ב-worktree-b' },
      { roleLabel: 'Agent C', task: 'מסמכים והגדרות ב-worktree-c' },
    ],
    benefits: ['הקשר ראשי נקי', 'הרצה מקבילית', 'worktrees מבודדים'],
    callout: 'אותם specs. אותה תבנית. מודלים שונים.',
  },

  // ── ACT 5 — DEEP DIVES ─────────────────────────────────────────────────────────

  // 16. modelOptimization
  {
    type: 'modelOptimization',
    title: 'אופטימיזציית מודלים',
    subtitle: 'כשהמפרטים ברורים, אתה לא צריך את המודל הגדול ביותר',
    tiers: [
      { model: 'Haiku', share: '40%', tasks: 'מיגרציות, קונפיגורציה, CRUD', tier: 'cheapest', reason: 'המפרטים מסירים עמימות' },
      { model: 'Sonnet', share: '45%', tasks: 'שירותים, קומפוננטות, בדיקות', tier: 'balanced', reason: 'ה-brief מספק הקשר מלא' },
      { model: 'Opus', share: '15%', tasks: 'ארכיטקטורה, תכנון', tier: 'premium', reason: 'רק להחלטות אמיתיות' },
    ],
    insight: 'אין מקום לחשיבה עמוקה כי כל ההחלטות מוכנות מראש במפרטים.',
    comparison: {
      allOpus: '$47/ספרינט',
      optimized: '$19/ספרינט',
      savings: '~60% חיסכון',
    },
  },

  // ── ACT 6 — PROOF ────────────────────────────────────────────────────────────

  // 17. viewer
  {
    type: 'viewer',
    title: 'דשבורד Viewer חי',
    url: 'hundia.github.io/autospec/viewer',
    features: ['דפדפן מפרטים', 'באקלוג Kanban', 'דוקומנטציה חיה'],
    linkText: 'נסה אותו חי →',
  },

  // 18. example
  {
    type: 'example',
    title: 'דוגמה אמיתית: ShopFlow מסחר אלקטרוני',
    project: {
      name: 'ShopFlow',
      description: 'פלטפורמת מסחר אלקטרוני מלאה עם תשלומים, מלאי, הזמנות',
      stats: {
        specs: 10,
        tickets: 174,
        sprints: 7,
      },
    },
    timeline: [
      { phase: 'דרישות', duration: '3 שעות', output: 'מסמך SRS' },
      { phase: 'הפקת מפרטים', duration: '15 דק\'', output: '10 קבצי spec, 12000+ שורות' },
      { phase: 'ספרינט 0-1', duration: '6 שעות', output: 'אימות, DB, קטלוג מוצרים' },
      { phase: 'ספרינט 2-3', duration: '8 שעות', output: 'עגלה, תשלום, checkout' },
      { phase: 'סה"כ', duration: '~20 שעות', output: 'חנות מוכנה לפרודקשן' },
    ],
    features: [
      'הרשמה ופרופילי משתמשים',
      'קטלוג מוצרים עם חיפוש',
      'עגלת קניות ורשימת משאלות',
      'אינטגרציית תשלומי Stripe',
      'ניהול הזמנות ומעקב',
      'דשבורד אדמין',
    ],
  },

  // 19. results
  {
    type: 'results',
    title: 'תוצאות מוכחות',
    metrics: [
      { label: 'ספרינטים שהושלמו', value: '25+', icon: '🏃' },
      { label: 'משימות שבוצעו', value: '263', icon: '✅' },
      { label: 'זמן לפרודקשן', value: '12 ימים', icon: '⚡' },
      { label: 'כיסוי בדיקות', value: '70%+', icon: '🧪' },
      { label: 'חיסכון בעלויות', value: '~40%', icon: '💰' },
      { label: 'חיסכון מרובה סוכנים', value: '~45%', icon: '🤖' },
    ],
    testimonial: {
      quote: 'AutoSpec הפך את AI מכלי בלתי צפוי לשותף פיתוח אמין.',
      source: 'נבדק בקרב על אפליקציות בפרודקשן',
    },
  },

  // 20. demo
  {
    type: 'demo',
    title: 'הדגמה חיה',
    subtitle: 'ShopFlow מסחר אלקטרוני',
    steps: [
      '1. הצג קובץ requirements.md',
      '2. הרץ autospec init',
      '3. סקור את המפרטים שנוצרו',
      '4. הרץ ספרינט 0 עם AI',
      '5. הצג קטלוג מוצרים עובד',
    ],
    note: 'זמן הדגמה: ~5 דקות',
  },

  // ── ACT 7 — FUTURE ───────────────────────────────────────────────────────────

  // 21. futureWaterfall
  {
    type: 'futureWaterfall',
    title: 'העתיד: פיתוח Planning-First',
    subtitle: 'הקצאת זמן הפיתוח החדשה',
    insight: 'אנחנו חוזרים ל-waterfall — אבל חכם יותר. כשהמפרטים ברורים, סוכנים לא הוזים. כשסוכנים לא הוזים, אפשר להשתמש במודלים זולים יותר ולקבל את אותן תוצאות.',
    allocation: [
      { phase: 'תכנון ומפרטים', percentage: 40, color: 'blue', description: 'הבנה של מה לבנות היא ההשקעה הגדולה. הגדר נכון, סוכנים מבצעים נכון.' },
      { phase: 'פיתוח', percentage: 30, color: 'green', description: 'עם מפרטים ברורים, גם מודלים קטנים מספקים תוצאות ברמה גבוהה. ה"חתיכה הקטנה" של העתיד.' },
      { phase: 'בדיקות ואימות', percentage: 30, color: 'amber', description: 'סוכני QA מאמתים כל משימה. אימות אוטומטי מוודא ששום דבר לא יוצא שבור.' },
    ],
    callout: 'המפתח של העתיד מבלה יותר זמן בחשיבה מאשר בהקלדה. זה לא יותר איטי — זה יותר חכם.',
  },

  // 22. futureMonolith
  {
    type: 'futureMonolith',
    title: 'העתיד: רנסנס המונוליט',
    subtitle: 'למה סוכנים מעדיפים monorepos על microservices',
    comparison: {
      microservices: {
        label: 'Microservices',
        icon: '🔀',
        problems: [
          'הקשר מפוזר בין ריפוזיטוריז',
          'חוזי API יוצרים עמימות',
          'הסוכן חייב להסיק התנהגות מממשקים',
          'דיבוג בין שירותים הוא ניחוש',
        ],
      },
      monolith: {
        label: 'Monolith / Monorepo',
        icon: '🏛️',
        benefits: [
          'כל בסיס הקוד בחלון הקשר אחד',
          'קריאות פונקציה ישירות — בלי עמימות API',
          'הסוכן רואה את התהליך המלא מקצה לקצה',
          'רפקטורינג אטומי, לא מבוזר',
        ],
      },
    },
    callout: 'הפרדה הגיונית לצוותים אנושיים. לסוכנים עם חלון הקשר של 200K, מונוליט הוא כוח-על.',
  },

  // ── ACT 8 — CLOSE ────────────────────────────────────────────────────────────

  // 23. closing
  {
    type: 'closing',
    title: 'התחל היום',
    install: 'npm install -g autospec',
    commands: [
      { cmd: 'autospec init', desc: 'אתחל פרויקט חדש' },
      { cmd: 'autospec status', desc: 'צפה בהתקדמות הספרינט' },
      { cmd: 'autospec sprint 0', desc: 'הפק פרומפט לספרינט' },
    ],
    links: {
      github: 'github.com/Hundia/autospec',
      docs: 'autospec.dev/docs',
    },
    tagline: 'מדרישות לקוד עובד.',
  },

  // 24. finalTagline
  {
    type: 'finalTagline',
    title: 'AutoSpec',
    tagline: 'ה-AI חשב קודם. אחר כך הוא שלח.',
  },
];
