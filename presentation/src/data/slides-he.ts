export const slidesHE = [
  // 1. title
  {
    type: 'title',
    title: 'AutoSpec',
    subtitle: 'מדרישות לקוד עובד',
    tagline: 'פיתוח מונחה מפרטים עם AI',
    presenter: 'השם שלך',
    date: '2026',
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
  // 8. bridge
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
  // 9. solution
  {
    type: 'solution',
    title: 'פיתוח מונחה מפרטים',
    flow: [
      { step: 'דרישות', icon: '📋', description: 'כוונת האדם מתועדת פעם אחת' },
      { step: 'מפרטים', icon: '📐', description: '10 חוזים מבוססי תפקידים' },
      { step: 'באקלוג', icon: '📝', description: 'משימות מסודרות ומדורגות' },
      { step: 'הרצת AI', icon: '🤖', description: 'סוכנים עם הקשר מלא' },
      { step: 'קוד עובד', icon: '✅', description: 'נבדק, מתועד, מוכן לפרודקשן' },
    ],
    keyInsight: 'אל תניח ל-AI לחשוב. תן לו לבצע. המפרטים הם החשיבה.',
  },
  // 10. docsFolder
  {
    type: 'docsFolder',
    title: 'תיקיית docs/',
    subtitle: 'הזיכרון הארגוני שלך — לא תיעוד, ידע חי',
    tree: [
      { name: 'docs/', type: 'folder', depth: 0 },
      { name: 'auth/', type: 'folder', depth: 1, annotation: 'JWT, משמרים, middleware' },
      { name: 'database/', type: 'folder', depth: 1, annotation: 'סכמה, ERD, מיגרציות' },
      { name: 'frontend/', type: 'folder', depth: 1, annotation: 'ניתובים, חנויות, שירותים' },
      { name: 'scheduling/', type: 'folder', depth: 1, annotation: 'שיעורים, קיבולת, תצוגות' },
      { name: 'bookings/', type: 'folder', depth: 1, annotation: 'מכונת מצבים, רשימת המתנה' },
    ],
    growth: [
      { sprint: 'ספרינט 0', docs: 10 },
      { sprint: 'ספרינט 5', docs: 45 },
      { sprint: 'ספרינט 10', docs: 100 },
    ],
    comparison: {
      without: 'ידע בלוגי צ\'אט — אובד כשהסשן מסתיים',
      with: 'ידע במסמכים מנוהלי גרסאות — גדל לנצח',
    },
  },
  // 11. workflow
  {
    type: 'workflow',
    title: 'תהליך העבודה של AutoSpec',
    steps: [
      {
        number: '01',
        title: 'כתוב דרישות',
        description: 'צור מסמך SRS שמתאר מה אתה רוצה',
        time: '1-2 שעות',
        output: 'requirements.md',
      },
      {
        number: '02',
        title: 'הפק מפרטים',
        description: 'AutoSpec יוצר 10 מפרטים לפי תפקידים',
        time: '5 דקות',
        output: 'specs/*.md',
      },
      {
        number: '03',
        title: 'סקירה ושיפור',
        description: 'וודא שהמפרטים תואמים לחזון שלך',
        time: '30 דקות',
        output: 'מפרטים מאושרים',
      },
      {
        number: '04',
        title: 'הרץ ספרינטים',
        description: 'סוכני AI עובדים על המשימות בשיטתיות',
        time: '2-4 שעות/ספרינט',
        output: 'פיצ\'רים עובדים',
      },
    ],
  },
  // 12. roles
  {
    type: 'roles',
    title: 'מודל 10 התפקידים',
    description: 'כל פרויקט מפורט מ-10 נקודות מבט',
    roles: [
      { num: '01', name: 'מנהל מוצר', focus: 'חזון, פרסונות, תהליכים' },
      { num: '02', name: 'ליד Backend', focus: 'APIs, אימות, שירותים' },
      { num: '03', name: 'ליד Frontend', focus: 'קומפוננטות, עיצוב' },
      { num: '04', name: 'ארכיטקט DB', focus: 'סכמה, מיגרציות' },
      { num: '05', name: 'ליד QA', focus: 'אסטרטגיית בדיקות' },
      { num: '06', name: 'ליד DevOps', focus: 'תשתיות, CI/CD' },
      { num: '07', name: 'ליד שיווק', focus: 'Go-to-market' },
      { num: '08', name: 'ליד פיננסים', focus: 'תמחור, כלכלה' },
      { num: '09', name: 'ליד עסקי', focus: 'אסטרטגיה, תחרות' },
      { num: '10', name: 'מעצב UI', focus: 'מסכים, wireframes' },
    ],
    insight: 'גם מפתחים יחידים נהנים מחשיבה בתפקידים.',
  },
  // 13. sprintLifecycle
  {
    type: 'sprintLifecycle',
    title: 'מחזור חיי הספרינט',
    phases: [
      { icon: '📋', title: 'תכנון', description: 'הגדר משימות, הערך נקודות, שבץ סוכנים' },
      { icon: '📝', title: 'תיעוד', description: 'כתוב briefs עם הקשר מלא לסוכנים' },
      { icon: '⚙️', title: 'ביצוע', description: 'סוכנים מממשים משימות ב-worktrees מבודדים' },
      { icon: '🧪', title: 'QA', description: 'אמת כל משימה עם build + test + review' },
      { icon: '📊', title: 'סיכום', description: 'תעד תוצאות, דוקומנטציה, קבצים ששונו' },
    ],
    callout: 'כל ספרינט עובר את המחזור הזה. שום דבר לא יוצא בלי כל 5 השלבים.',
  },
  // 14. backlog
  {
    type: 'backlog',
    title: 'מערכת הבאקלוג',
    description: 'ניהול משימות מובנה עם תהליכי עבודה ברורים',
    statuses: [
      { status: 'todo', label: 'לביצוע', description: 'מוכן להתחלה', color: 'gray' },
      { status: 'in-progress', label: 'בעבודה', description: 'נמצא כעת בפיתוח', color: 'blue' },
      { status: 'qa-review', label: 'בדיקת QA', description: 'הקוד מוכן, צריך בדיקות', color: 'yellow' },
      { status: 'done', label: 'הושלם', description: 'נבדק ומוזג', color: 'green' },
      { status: 'blocked', label: 'חסום', description: 'ממתין לתלות', color: 'red' },
    ],
    ticketStructure: [
      'מזהה: מזהה ייחודי (למשל SF-042)',
      'כותרת: תיאור ברור וניתן לביצוע',
      'נקודות סיפור: הערכת מורכבות (1-8)',
      'תלויות: קישורים למשימות חוסמות',
      'קריטריונים לקבלה: הגדרת סיום',
    ],
    bugWorkflow: {
      title: 'ניהול באגים',
      steps: [
        'באגים מקבלים קידומת [BUG]',
        'דירוג חומרה: קריטי/גבוה/בינוני/נמוך',
        'באגים קריטיים חוסמים השלמת ספרינט',
        'באגים מקושרים למשימה המקורית',
      ],
    },
  },
  // 15. orchestrator
  {
    type: 'orchestrator',
    title: 'תבנית ה-Orchestrator',
    orchestrator: {
      name: 'Opus Orchestrator',
      tasks: ['כותב briefs לספרינט', 'משגר סוכנים מקביליים', 'סוקר תוצאות ומאחד'],
    },
    agents: [
      { name: 'Sonnet Agent A', task: 'משימות Backend ב-worktree-a' },
      { name: 'Sonnet Agent B', task: 'משימות Frontend ב-worktree-b' },
      { name: 'Sonnet Agent C', task: 'דוקומנטציה וקונפיגורציה ב-worktree-c' },
    ],
    benefits: ['הקשר ראשי נקי', 'ביצוע מקבילי', 'worktrees מבודדים'],
  },
  // 16. multiagent
  {
    type: 'multiagent',
    title: 'הרצה מרובת סוכנים',
    description: 'הכפל את המהירות עם סוכני AI מקביליים',
    agents: [
      {
        name: 'סוכן A',
        role: 'ליד Backend',
        tickets: ['1.1 - צור טבלת users', '1.2 - שירות אימות', '1.4 - User API'],
        color: 'blue',
      },
      {
        name: 'סוכן B',
        role: 'ליד Frontend',
        tickets: ['1.3 - טופס התחברות', '1.5 - דשבורד', '1.6 - דף פרופיל'],
        color: 'green',
      },
    ],
    benefits: [
      '~45% חיסכון בזמן',
      'גבולות ברורים מונעים קונפליקטים',
      'לכל סוכן הקשר ממוקד',
      'תלויות מנוהלות בבאקלוג',
    ],
  },
  // 17. qaMethodology
  {
    type: 'qaMethodology',
    title: 'מתודולוגיית QA',
    pyramid: [
      { level: 'E2E', percentage: '10%', description: 'בדיקות תהליך מלא' },
      { level: 'Integration', percentage: '30%', description: 'בדיקות API ושירותים' },
      { level: 'Unit / API', percentage: '60%', description: 'בדיקות פונקציות ו-endpoints' },
    ],
    bugProtocol: [
      'שחזר את תהליך המשתמש המדויק',
      'תקן את הקוד',
      'אמת בהרצה חוזרת של התהליך',
    ],
    callout: 'כל משימה מאומתת לפני Done. בלי יוצאים מן הכלל.',
  },
  // 18. sprintSummary
  {
    type: 'sprintSummary',
    title: 'סיכומי ספרינט',
    sections: [
      { icon: '✅', title: 'משימות שהושלמו', example: '5.1 שירות אימות ✅, 5.2 דף התחברות ✅' },
      { icon: '📄', title: 'דוקומנטציה שעודכנה', example: 'docs/auth/01-architecture.md, docs/frontend/routing.md' },
      { icon: '📁', title: 'קבצים ששונו', example: 'src/auth/auth.service.ts, src/pages/Login.tsx' },
      { icon: '🧪', title: 'תוצאות QA', example: 'API: 17/17 עובר, UI: 6/6 עובר' },
    ],
    callout: 'סוכנים עתידיים קוראים סיכומים כדי להבין מה נבנה.',
  },
  // 19. modelOptimization
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
  // 20. skillsEnvironments
  {
    type: 'skillsEnvironments',
    title: 'Skills וסביבות',
    skills: [
      '/plan-sprint',
      '/sprint-run',
      '/execute-ticket',
      '/sprint-status',
      '/qa-review',
    ],
    environments: [
      { name: 'Claude Code', support: 'Full' },
      { name: 'Copilot', support: 'Full' },
      { name: 'Cursor', support: 'Full' },
      { name: 'Windsurf', support: 'Partial' },
      { name: 'JetBrains', support: 'Partial' },
      { name: 'Aider', support: 'Basic' },
    ],
    callout: 'אותה מתודולוגיה, כל עוזר AI.',
  },
  // 21. viewer
  {
    type: 'viewer',
    title: 'דשבורד Viewer חי',
    url: 'hundia.github.io/autospec/viewer',
    features: ['דפדפן מפרטים', 'באקלוג Kanban', 'דוקומנטציה חיה'],
    linkText: 'נסה אותו חי →',
  },
  // 22. example
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
  // 23. results
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
  // 24. demo
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
  // 25. beforeAfter
  {
    type: 'beforeAfter',
    title: 'לפני ואחרי',
    subtitle: 'אותה צוות, אותם כלי AI. ההבדל היחיד: מבנה.',
    rows: [
      { aspect: 'הקשר', before: 'אובד בכל סשן', after: 'שמור לנצח ב-docs/' },
      { aspect: 'תיעוד', before: 'אין — רק לוגי צ\'אט', after: '100+ מסמכים חיים' },
      { aspect: 'קליטה', before: 'שבועות של הנדסה לאחור', after: 'קרא מפרטים, התחל לקודד' },
      { aspect: 'דיוק AI', before: 'מתדרדר במהלך השיחה', after: 'עקבי מהמפרט' },
      { aspect: 'עלות', before: '$47/ספרינט (כל Opus)', after: '$19/ספרינט (ניתוב מודלים)' },
      { aspect: 'מסירה', before: 'בלתי אפשרי בלי המפתח המקורי', after: 'כל אחד יכול לקרוא את המפרטים' },
    ],
  },
  // 26. closing
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
  // 27. finalTagline
  {
    type: 'finalTagline',
    title: 'AutoSpec',
    tagline: 'אל תניח ל-AI שלך לחשוב. תן לו לבצע.',
  },
];
