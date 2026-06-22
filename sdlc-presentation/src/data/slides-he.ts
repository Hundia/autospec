export const slidesHE = [
  // ── ACT 1 — THE PROBLEM ──────────────────────────────────────────────────────

  // 1. title
  {
    type: 'title',
    title: 'The Agentic SDLC',
    subtitle: 'פיתוח מונחה-ספסיפיקציות בסקאלה ארגונית',
    tagline: 'סוכנים מבצעים. בני אדם מנהלים.',
    presenter: 'מאת אלי חונדיה ושרון שוורץ',
  },

  // 2. paradigmShift — the reframe: AI is not a tool you adopt
  {
    type: 'paradigmShift',
    struckPhrase: 'AI Adoption',
    truth: 'בעיניי זה לא כלי שמטמיעים — זה שינוי באופן שבו העבודה עצמה מתבצעת.',
    dimensionsLead: 'מה באמת משתנה',
    dimensions: {
      knowledge: { label: 'איך ידע נוצר', detail: 'הבנה נוצרת בדיאלוג עם המכונה, לא רק נשלפת מאנשים.' },
      work: { label: 'איך עבודה מתבצעת', detail: 'יחידת המאמץ עוברת מכתיבת קוד להגדרת כוונה והכוונת התוצאה.' },
      responsibility: { label: 'איך אחריות מתחלקת', detail: 'האחריות מתחלקת מחדש בין המהנדס לסוכן — אף אחד לא מחזיק בה לבד.' },
      engineers: { label: 'איך מהנדסים מבינים את המקצוע', detail: 'המקצוע מגדיר את עצמו מחדש — ממחבר כל שורה לאדריכל של כוונה.' },
    },
  },

  // 3. eraTraditional
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

  // 4. eraAssistant
  {
    type: 'eraAssistant',
    title: 'עידן עוזר הקוד',
    subtitle: 'AI עזר לך להקליד מהר יותר, לא לחשוב טוב יותר',
    tools: ['GitHub Copilot', 'TabNine'],
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

  // 5. eraAgentic
  {
    type: 'eraAgentic',
    title: 'עידן הנדסת הפרומפטים',
    subtitle: 'כוח מהפכני, אוטונומיה מסוכנת',
    tools: ['Claude Code', 'Cursor', 'Devin'],
    power: [
      { title: "פיצ'רים מלאים", description: 'מודולים שלמים בפרומפט אחד' },
      { title: 'כל המחסנית', description: 'Frontend + Backend + DB יחד' },
      { title: 'אוטונומי', description: 'AI מקבל החלטות מימוש' },
    ],
    danger: [
      { title: 'מלכודת הדחיסה', description: 'כשחלון ההקשר מתמלא, הסוכן דוחס את השיחה לתקציר חסר — האילוצים המקוריים נעלמים והוא ממשיך לבנות, בטוח בעצמו וטועה' },
      { title: 'מס ההנדסה לאחור', description: 'כל סשן מאפס לאפס — אתה משלם את עלות הגילוי המחדש המלאה לפני כל פיצ\'ר חדש' },
      { title: 'נקודת השבירה', description: 'אין תיעוד פירושו אין רציפות — צוותים פוגעים בקיר בלתי נראה בפיצ\'ר השני' },
    ],
  },

  // 6. contextPoisoning (מלכודת הדחיסה) — שקופית נגללת
  {
    type: 'contextPoisoning',
    scrollable: true,
    kicker: 'בעיה שמסתתרת בתוך כוונות טובות',
    title: 'מלכודת הדחיסה',
    hook: 'המלכודת היא שדווקא היסודיות היא זו שהורגת אותך.',
    scrollHint: 'גלול וצפה בחלון מתמלא',
    // ── Beat 1 — the instinct ──
    instinctKicker: 'האינסטינקט',
    instinctTitle: 'אתה עושה את הדבר האחראי — אתה נותן לו הכול.',
    instinctLead: 'עוד לפני שהסוכן כותב שורה, אתה מוסר לו את כל ההקשר: ה-PRD המלא, מסמך התכנון, ה-API reference, סיכומי הפגישות. המהלך האחראי. זו המלכודת.',
    bigDocs: [
      { icon: 'BookOpen', name: 'ה-PRD המלא של המוצר', weight: '82 pages · ~61k tokens', fill: 90 },
      { icon: 'FileText', name: 'מסמך הארכיטקטורה והתכנון', weight: '40 pages · ~30k tokens', fill: 55 },
      { icon: 'Code2', name: 'ה-API reference המלא', weight: 'every endpoint · ~45k tokens', fill: 72 },
      { icon: 'ClipboardList', name: 'חצי שנה של סיכומי פגישות', weight: 'pasted in full · ~28k tokens', fill: 48 },
      { icon: 'MessageSquare', name: 'שלושה Slack threads מיוצאים', weight: '"ליתר ביטחון" · ~22k tokens', fill: 38 },
      { icon: 'FileStack', name: 'ה-codebase הישן, נשפך פנימה', weight: 'all of it · ~70k tokens', fill: 95 },
    ],
    instinctReframe: 'שום דבר מזה אינו רשלני. כל אחד מאלה הוא הדבר המסור והנכון לעשות.',
    // ── Beat 2 — the window fills ──
    windowKicker: 'החלון מתמלא',
    windowTitle: 'חלון ההקשר הוא תקציב — ואתה בזבזת אותו עוד לפני שהעבודה התחילה.',
    windowLead: 'הוא סופי. כל מסמך שאתה מדביק תופס נתח. המד מטפס מעבר לקו הסכנה עוד לפני שניתנה הוראה מועילה אחת.',
    budgetLabel: 'תקציב חלון ההקשר',
    fillStages: [
      { label: 'PRD הודבק', detail: 'מסמך ענק אחד, מראש', fill: 20 },
      { label: '+ design + API', detail: 'כמה מסמכים גדולים נערמים', fill: 60 },
      { label: '+ notes + code', detail: 'לא נשאר מקום לחשוב', fill: 98 },
    ],
    wallLabel: '98% מלא — לפני כל עבודה אמיתית',
    onRampsLead: '→ דרכי גישה רבות, קיר אחד',
    onRamps: [
      { label: 'מסמך ענק אחד, מראש', note: 'ממלא את החלון לפני שכתבת שורה' },
      { label: 'כמה מסמכים גדולים לאורך איטרציות', note: 'נערמים כמו שיחה ארוכה' },
      { label: 'פנייה חדה סמוך לגבול', note: 'מטה חלון כמעט-מלא אל מעבר לקצה' },
    ],
    // ── Beat 3 — the result (compaction) ──
    resultKicker: 'התוצאה',
    resultTitle: 'רק עכשיו AUTO-COMPACT נכנס לפעולה — והדחיסה אובדת מידע.',
    fullContext: {
      label: 'הקשר מלא',
      cards: [
        { text: 'Use PostgreSQL + Prisma ORM', dropped: true },
        { text: 'No NoSQL — relational integrity required', dropped: true },
        { text: 'Type-safe queries only', dropped: false },
        { text: 'Activity feed = a Postgres table', dropped: false },
      ],
    },
    compaction: {
      operation: '⚡ AUTO-COMPACT',
      caption: 'ההקשר סוכם →',
      droppedTag: 'נשמט בתקציר',
    },
    lossySummary: {
      label: 'תקציר חסר',
      retained: '~40% נשמר',
      text: 'Building a database layer. Activity feed needs flexible documents.',
    },
    casualtyNote: 'האילוצים היסודיים הם הנפגעים — נשמטים ראשונים, ולעולם לא משוחזרים.',
    // ── Beat 4 — the dagger ──
    verdict: {
      agentLine: 'Adding MongoDB for the activity feed — documents fit better here.',
      dagger: 'הוא לא מבולבל. הוא פשוט לא רואה מה אבד.',
      reframe: 'אותה יסודיות שהייתה אמורה להגן על העבודה היא בדיוק זו שפוצצה אותה.',
    },
  },

  // 7. secondFeature (merged: The Reverse Engineering Tax + The Breaking Point)
  {
    type: 'secondFeature',
    scrollable: true,
    kicker: 'סשן אחד משחית. כל סשן שוכח.',
    title: 'הפיצ\'ר השני',
    subtitle: 'הפיצ\'ר הראשון חינם. השני הוא המקום שבו פרויקטי AI מתים.',
    scrollHint: 'גלול — זה נהיה גרוע יותר',
    chapters: [
      { number: '01', name: 'מס ההנדסה לאחור', accent: 'amber' },
      { number: '02', name: 'נקודת השבירה', accent: 'red' },
    ],
    chapter1: {
      label: 'מס ההנדסה לאחור',
      headline: 'יום 60. המוצר עובד. אתה רוצה פיצ\'ר +1.',
      setup: [
        'המוצר שבנית ב-AI רץ בפרודקשן. שישה פיצ\'רים, אפס תקלות.',
        'סשני הצ\'אט שבנו אותו נעלמו. תיעוד מעולם לא נכתב.',
        'אתה פותח סשן חדש: "הוסף את זרימת התשלום." אמור להיות פשוט.',
      ],
      terminal: {
        windowTitle: 'ai-agent — session #51 — day 60',
        lines: [
          { kind: 'you', time: '09:02', text: 'הוסף זרימת תשלום עם Stripe. ה-checkout כבר קיים.' },
          { kind: 'agent', time: '09:02', text: 'אין לי שום הקשר לפרויקט הזה. 214 קבצים. אין README. אין ספסיפיקציות. אין תיעוד של אף החלטה. לפני שאכתוב קוד, אני צריך תשובות.' },
          { kind: 'agent', time: '09:03', text: 'איפה ה-checkout ממומש? איזו שכבת נתונים היא הקנונית? יש גבול שירות לטרנזקציות?' },
          { kind: 'you', time: '09:04', text: 'אני לא זוכר. הכל הוחלט בצ\'אט. הסשנים נעלמו.' },
          { kind: 'agent', time: '09:05', text: 'הבנתי. מתחיל גילוי.' },
          { kind: 'cmd', text: 'grep -r "checkout" src/', result: '→ 47 התאמות ב-12 קבצים' },
          { kind: 'cmd', text: 'cat src/services/order.ts', result: '→ 612 שורות, אפס הערות' },
          { kind: 'cmd', text: 'find . -name "*.md"', result: '→ 0 תוצאות' },
          { kind: 'sys', time: '11:30', text: '2.5 שעות חלפו · קוד פיצ\'ר שנכתב: 0', tone: 'warn' },
          { kind: 'agent', time: '14:15', text: 'מצאתי שלוש תבניות state שונות. איזו מהן מכוונת?' },
          { kind: 'you', time: '14:16', text: '...' },
          { kind: 'sys', time: '17:40', text: '8 שעות חלפו · עדיין מהנדס לאחור · הפיצ\'ר לא התחיל', tone: 'fail' },
        ],
      },
      meter: { to: 16, unit: 'שעות', caption: 'משולמות בגילוי מחדש — לפני שנכתבת שורת קוד חדשה אחת' },
      invoice: {
        title: 'חשבונית — מס ההנדסה לאחור',
        items: [
          { hours: '4–8ש', label: 'קריאה מחדש של כל קובץ כדי להבין מה נבנה' },
          { hours: '2–4ש', label: 'הנדסה לאחור של החלטות שנעשו בצ\'אטים מתים' },
          { hours: '2–4ש', label: 'מציאת נקודות הרחבה שלא ישברו את הפרודקשן' },
        ],
        total: { hours: '8–16ש', label: 'לתשלום לפני שפיצ\'ר +1 מתחיל' },
      },
      callout: { stat: '73%', text: 'מפרויקטי AI ננטשים. לא כי הפיצ\'ר הראשון נכשל — כי הפיצ\'ר השני הפך לבלתי משתלם.' },
    },
    chapter2: {
      label: 'נקודת השבירה',
      headline: 'עכשיו תכפיל בכל הצוות שלך.',
      build: [
        { value: '6', label: 'סוכני AI' },
        { value: '200+', label: 'קבצים שנוצרו' },
        { value: '50', label: 'סשני צ\'אט' },
      ],
      debt: [
        { value: '0', label: 'מסמכים שנכתבו' },
        { value: '0', label: 'החלטות שתועדו' },
        { value: '0', label: 'מסירה אפשרית' },
      ],
      graveyard: { count: 50, youAreHereLabel: 'אתה כאן', stamp: 'GONE' },
      stats: [
        { value: '73%', label: 'מפרויקטי AI שננטשו תוך 6 חודשים' },
        { value: '40 שעות', label: 'הבנת קוד מחדש, כל רבעון' },
        { value: '$0', label: 'ערך של לוג צ\'אט אחרי שהסשן נגמר' },
      ],
      bottomLine: 'פיתוח מבוסס AI ללא ממשל הוא חוב טכני במהירות AI.',
    },
  },

  // ── ACT 2 — TURNING POINT ─────────────────────────────────────────────────────

  // 8. bridge
  {
    type: 'bridge',
    title: 'מה אם...',
    question: 'ה-SDLC עצמו נבנה מחדש עבור סוכנים.',
    points: [
      'מה אם אף סוכן לא יכול לכתוב קוד לפני שאדם אישר את הספסיפיקציה?',
      'מה אם כל שגיאת סוכן הפכה למגביל קבוע?',
      'מה אם מהירות היא תוצר של מבנה — לא קיצורי דרך?',
    ],
  },

  // 9. sddThreePillars — HIDDEN (kept in file, filtered out of the deck via `hidden`)
  {
    type: 'sddThreePillars',
    hidden: true,
    kicker: 'פיתוח מונחה-ספסיפיקציות · מה זה',
    title: 'מערכת ההפעלה של פיתוח אג\'נטי',
    definition: 'מתודולוגיה שבה הספסיפיקציה אף פעם לא אופציונלית, כל החלטה ניתנת למעקב, וכל סוכן פועל בתוך גבולות שאושרו על ידי בני אדם.',
    pillars: [
      {
        number: '01',
        icon: '📐',
        title: 'ספסיפיקציות כקוד',
        description: 'spec.md וחוקה חיים ב-git. מאושר על ידי בני אדם לפני שסוכן כלשהו פועל. מקור האמת היחיד שכל שלב קורא.',
        artifact: 'specs/*.md  ·  constitution.md',
        color: 'teal',
      },
      {
        number: '02',
        icon: '📋',
        title: 'סיכומי מחזורים',
        description: 'כל מחזור נסגר עם סיכום: מה נבנה, מה השתנה, מה הוחלט — כולל ההיגיון. אין הקשר שאבוד אי פעם.',
        artifact: 'cycles/cycle-X/summary.md',
        color: 'emerald',
      },
      {
        number: '03',
        icon: '📖',
        title: 'תיעוד חי',
        description: 'מסמכים וגדרות הגנה גדלים עם כל מחזור. החוקה מגבילה כל סוכן עתידי — אוטומטית.',
        artifact: 'docs/  ·  guardrails/',
        color: 'cyan',
      },
    ],
    thesis: [
      { text: 'הספסיפיקציה היא האמת', color: 'amber' },
      { text: 'גדרות ההגנה הן ההגנה', color: 'emerald' },
      { text: 'האדם הוא השופט', color: 'blue' },
    ],
  },

  // ── ACT 3 — THE AGENTIC SDLC METHODOLOGY ─────────────────────────────────────

  // 10. philosophy
  {
    type: 'philosophy',
    title: 'הפילוסופיה המרכזית',
    subtitle: 'חמש רעיונות שמשנות הכל',
    cards: [
      {
        icon: '🎯',
        title: 'מחזורים, לא ספרינטים',
        description: 'מחזור הוא יחידת מסירה תחומה וניתנת לבדיקה עצמאית — ספסיפיקציה מאושרת, ביצוע AI, אימות גדרות הגנה. נמדד בשעות או ימים, לא שבועות. מהירות היא תוצר של מבנה.',
        accent: 'blue',
      },
      {
        icon: '👁',
        title: 'בני אדם כמתזמנים',
        description: 'מהנדסים עוברים ממבצעים (כותבי קוד) למתזמנים — מעצבי ספסיפיקציות, סוקרי פלט סוכנים, מתחזקי גדרות ההגנה.',
        accent: 'violet',
      },
      {
        icon: '✍️',
        title: 'מנהלים ומסקרים',
        description: 'ללא ממשל חזק, HITL הופך לאישור גומי. ביצוע אג\'נטי + ספסיפיקציות מובנות + ממשל נאכף — זה מה שמפריד פיקוח אמיתי מהצגה.',
        accent: 'teal',
      },
      {
        icon: '🛡',
        title: 'גדרות ההגנה לא ניתנות לעקיפה',
        description: 'בדיקות, linters, טיפוסים, אילוצים שסוכנים לא יכולים להפר. כל שגיאת סוכן הופכת לבדיקת הגנה קבועה — היא לא יכולה לחזור. גדרות ההגנה רק הולכות ומתחזקות.',
        accent: 'emerald',
      },
      {
        icon: '📄',
        title: 'הספסיפיקציה היא האמת',
        description: 'אין קוד לפני אישור הספסיפיקציה. הספסיפיקציה מנוהלת בגרסאות ומעודכנת לפני שינויי קוד. מסיים ריקבון ספסיפיקציות.',
        accent: 'amber',
      },
    ],
    quote: 'הספסיפיקציה היא האמת. גדרות ההגנה הן המגן. האדם הוא השופט.',
  },

  // 11. agentic5Acts — SCROLLABLE
  {
    type: 'agentic5Acts',
    scrollable: true,
    title: 'The Agentic SDLC',
    subtitle: 'שבעה שלבים. לולאה אחת שלמה. אף הקשר לא אובד.',
    closingCallout: 'גלה. יישר. תכנן. בצע. בדוק. זכור. נווט. שבעה שלבים שמכווצים את השעון — מבלי לדלג על שלב אחד.',
    keyInsight: {
      headline: 'התובנה המרכזית: דחוס, אל תדלג',
      body: 'ה-SDLC הליניארי המסורתי קורס — לא מבוטל. ה-AI ממזג דרישות, עיצוב ופיתוח ללולאת "עיצוב וניסוי" דחוסה ואיטרטיבית. צוותים רב-תחומיים עוברים מרעיון לפרוטוטיפ פונקציונלי בימים או שעות. המשמעת של כל שלב עדיין חשובה; רק השעון משתנה.',
    },
    phases: [
      {
        number: '1',
        name: 'דרישות, כוונה וגילוי',
        tagline: 'לפני שסוכן אחד זז — האמת כבר כתובה ומאושרת.',
        stageRef: 'שלב 1',
        owners: ['מנהל מוצר'],
        hero: false,
        accent: 'blue',
        bullets: [
          'GenAI מזקק קלטים לא מובנים — שיחות, כרטיסי Jira, ראיונות — למסמך דרישות או spec.md בנאמנות גבוהה. בעיה בלבד; אין מימוש.',
          'מנהל המוצר מאשר לפני שאף סוכן רשאי להמשיך. נגד ריקבון מפרט: spec.md מנוהל בגרסאות ומתעדכן לפני שינויי קוד.',
          'הפלט הוא מסמך הדרישות או ה-Spec הממשי — מקור האמת היחיד שכל שלב מאוחר יותר קורא.',
        ],
        output: 'מסמך דרישות או spec.md',
      },
      {
        number: '2',
        name: 'יישור פרויקט ואילוצים',
        tagline: 'חוקי הפרויקט — לפני שכל סוכן יכול לפעול.',
        stageRef: 'שלב 2',
        owners: ['ארכיטקט', 'מהנדס מערכת תוכנה'],
        hero: false,
        accent: 'violet',
        bullets: [
          'חוקי הפרויקט מקודדים כקבצי Instructions & Skills: תבניות ארכיטקטורה, מוסכמות עיצוב, תקני אבטחה.',
          'אילוצים אלה מהווים את בסיס גדרות ההגנה — גבולות קשיחים מוזרקים לכל הקשר סוכן, הופכים הצעות לא-תואמות לבלתי-אפשריות מכנית.',
          'הארכיטקט ומהנדס המערכת מאשרים: כל סוכן עתידי יורש גבולות אלה אוטומטית.',
        ],
        output: 'constitution.md + קבצי Instructions & Skills',
      },
      {
        number: '3',
        name: 'עיצוב ותכנון',
        tagline: 'מפת הדרכים שהסוכנים לא יכולים לסטות ממנה.',
        stageRef: 'שלב 3',
        owners: ['ארכיטקט', 'ראש צוות פיתוח', 'ראש צוות QA (אופציונלי)'],
        hero: false,
        accent: 'emerald',
        bullets: [
          'שיחה איטרטיבית עם סוכן תכנון מייצרת plan.md ו-tasks.md גרגריים.',
          'המשימות מנותקות לפי עיצוב — מאפשרות ביצוע מקבילי מבוסס AI מהרגע הראשון.',
          'סוכן מתזמן מקצה משימות עצמאיות למספר סוכנים מתמחים בו-זמנית.',
          'מהנדסים בכירים חוקרים את התכנית, לא כותבים אותה — מתמקדים באילוצי מורשת, אבטחה, רדיוס פגיעה.',
          'ראש צוות QA מעצב ארכיטקטורת הבדיקות מראש: יכולת בדיקה אפויה לתוך התכנית לפני שנכתבת שורה אחת.',
        ],
        output: 'plan.md + tasks.md (ניתנים לבדיקה, מקבילים לפי עיצוב)',
      },
      {
        number: '4',
        name: 'ביצוע',
        tagline: 'סוכנים מבצעים בשעות תחת מחסומים מכניים.',
        stageRef: 'שלב 4',
        owners: ['מפתח (HITL)'],
        hero: true,
        accent: 'indigo',
        bullets: [
          'ביצוע AI מקבילי כאשר המשימות מנותקות — מספר סוכנים ב-worktrees מבודדים מטפלים בעבודה עצמאית בו-זמנית.',
          'כל מימוש מבוסס על קבצי Specs .md המוגדרים למשימה. אין יצירה חופשית.',
          'כל קוד שנוצר על ידי סוכן נסקר על ידי המפתח HITL לפני מיזוג — ללא יוצא מן הכלל.',
          'TDD מאכף: אין מימוש לפני בדיקה נכשלת. כל שגיאת סוכן הופכת לבדיקת הגנה קבועה — היא לא יכולה לחזור.',
        ],
        output: 'קוד ממוזג וסקור HITL',
      },
      {
        number: '5',
        name: 'בדיקות ואיכות',
        tagline: 'כל תרחיש Feature מאומת — ומאוחסן לצמיתות בגדרות ההגנה.',
        stageRef: 'שלב 5',
        owners: ['ראש צוות QA'],
        hero: false,
        accent: 'cyan',
        bullets: [
          'ראש צוות QA מממש וגם מריץ בדיקות מערכת מבוססות תרחישים בקבצי Feature Specs .md.',
          'כל בדיקה חדשה מתווספת לרגרסיה — חבילת רגרסיה מלאה רצה על כל סגירת מחזור.',
          'אף פיצ\'ר לא נחשב שנשלח עד שכל תרחישי Feature Spec עוברים והרגרסיה ירוקה.',
        ],
        output: 'חבילת בדיקות ירוקת-רגרסיה + תוצאות בדיקות מערכת',
      },
      {
        number: '6',
        name: 'סיכום פיתוח',
        tagline: 'הזיכרון שהופך כל מחזור הבא למהיר יותר מקודמו.',
        stageRef: 'שלב 6',
        owners: ['מנהל מוצר (HITL)', 'ראש צוות פיתוח (HITL)', 'ראש צוות QA (HITL)'],
        hero: true,
        accent: 'teal',
        bullets: [
          'כל מחזור נסגר עם סיכום פיתוח: מה נבנה, מה השתנה, מה הוחלט — כולל הנמקה מאחורי החלטות טכניות מרכזיות.',
          'הנמקה מוקלטת: מדוע גישה נבחרה, חלופות שנשקלו, אילוצים שהתקלו בהם.',
          'כל ראשי הצוות משתתפים כ-HITL: מנהל מוצר ← ראש צוות פיתוח ← ראש צוות QA — כל אחד מאמת את התחום שלו.',
          'הסוכן הבא קורא את הסיכום ויורש הקשר מלא תוך 30 שניות — כולל שרשרת ההחלטות. אפס הנדסה לאחור.',
        ],
        output: 'cycles/cycle-X/summary.md (עם לוג נמקה מוטמע)',
      },
      {
        number: '7',
        name: 'אובזרווביליות ותיקון עצמי',
        tagline: 'המערכת שמתקנת את עצמה בחזרה ל-Spec.',
        stageRef: 'שלב 7',
        owners: ['SRE / DevOps'],
        hero: false,
        accent: 'orange',
        bullets: [
          'סוכני אובזרווביליות מנטרים טלמטריה בזמן-אמת — מדדים ולוגים — מול ההתנהגות המיועדת של ה-spec.',
          'אימות תרחישים בזמן-אמת: התנהגות הסוכן מאומתת מול דרישות Feature ב-Specs .md.',
          'סטייה מכוונת ה-spec מפעילה התראות אוטומטיות או פותחת מחזור תיקון עצמי אוטומטית.',
          'סוכני SRE מציפים אנומליות בצורה יזומה; GenAI כותב סיכומי אירועים הקשורים לסעיף ה-spec הרלוונטי.',
        ],
        output: 'מערכת עצמית-היגוי ומיושרת ל-Spec בפרודקשן',
      },
    ],
  },

  // 12. notVibeCoding
  {
    type: 'notVibeCoding',
    title: 'למה שראיתם זה עתה יש שם',
    subtitle: 'משמעת עם חוקים, חוזים ואחריותיות — לפי תכנון.',
    definitionLead: 'הפרקטיקה',
    definitionTerm: 'Governed Agentic Development',
    pillars: [
      {
        key: 'teal',
        icon: 'spec',
        ordinal: '01',
        label: 'הספסיפיקציה היא החוזה',
        detail: 'אין קוד לפני אישור הספסיפיקציה. מקור האמת היחיד שכל סוכן קורא.',
      },
      {
        key: 'emerald',
        icon: 'guardrails',
        ordinal: '02',
        label: 'גדרות ההגנה הן החוק',
        detail: 'בדיקות, טיפוסים, linters ואילוצים שסוכנים לא יכולים לעקוף. כל שגיאה הופכת לבדיקה קבועה.',
      },
      {
        key: 'blue',
        icon: 'human',
        ordinal: '03',
        label: 'האדם הוא השופט',
        detail: 'נקודות ביקורת אנושיות בכל שער. פיקוח אמיתי, לא אישור גומי.',
      },
      {
        key: 'violet',
        icon: 'trail',
        ordinal: '04',
        label: 'כל מהלך מתועד',
        detail: "החלטות, ספסיפיקציות ופלטים מנוהלים בגרסאות וניתנים לאיתור. שום דבר לא מתאדה עם הצ'אט.",
      },
    ],
    verdict: 'אז כשקוראים לזה Vibe Coding — זה לא. זה זה.',
  },

  // 13. harness — HIDDEN (repetitive with The Agentic SDLC)
  {
    type: 'harness',
    hidden: true,
    scrollable: true,
    kicker: 'מערכה 3 · צינור ביצוע',
    heroTitle: 'The Execution Pipeline',
    heroSubtitle: 'מתודולוגיה להפעלת סוכני AI עם שליטה. כל משימה זורמת דרך צינור מובנה — ספסיפיקציות מזינות אותו, שערים אוכפים אותו, בני אדם מנהלים אותו.',
    scrollHint: 'גללו לראות ארבעה שערי צינור דרך מקרים אמיתיים',
    introKicker: 'המתודולוגיה',
    introHeading: 'Spec נכנס. פלט מאומת יוצא.',
    introBody: 'כל משימת סוכן נכנסת לצינור מובנה: מתחילה מ-spec, מבצעת תחת תקציר ממוקד, ועוברת דרך שערים אוטומטיים לפני שאיזשהו פלט נוחת ב-codebase. השערים לא מאטים את הסוכן — הם הופכים כל פלט לאמין. הנה ארבעה מאותם שערים דרך משהו שהסוכן באמת ניסה לעשות.',
    casesKicker: 'ארבעה שערי צינור · ארבעה מקרים אמיתיים',
    cases: [
      { iconKey: 'Boxes', accent: 'blue', kicker: 'Gate 01 · Tech Stack', name: 'אכיפת ה-Tech Stack', attemptLabel: 'הסוכן ניסה', scenario: 'באמצע משימה הסוכן מחליט שיהיה לו קל יותר למשוך ספריית גרפים חדשה לגמרי — ועוד framework נוסף בדרך.', attemptCode: '$ npm install some-random-charts vue\n+ added 2 frameworks outside the approved stack', verdict: 'BLOCKED', responseLabel: 'תגובת ה-Guardrail', response: 'שער ה-dependencies משווה כל התקנה מול ה-stack המאושר ופוסל כל דבר שמחוצה לו. הסוכן חייב לפתור את הבעיה עם מה שכבר קיים בפרויקט.', ruleLabel: 'החוק שנאכף', rule: 'Approved stack only: React + TypeScript + Postgres' },
      { iconKey: 'ScrollText', accent: 'violet', kicker: 'Gate 02 · Conventions', name: 'מוסכמות כתיבת קוד', attemptLabel: 'הסוכן ניסה', scenario: 'הסוכן כותב קוד שעובד — אבל בסגנון משלו: שמות ב-snake_case, הזחה של 2 רווחים, בלי נקודה-פסיק — שום דבר כמו שאר ה-repo.', attemptCode: 'const user_data = fetch_user( id )\n  return user_data', verdict: 'BLOCKED', responseLabel: 'תגובת ה-Guardrail', response: 'lint + format רצים על כל שינוי. הקוד נכתב מחדש אוטומטית לסגנון הפרויקט, וכל מה שה-formatter לא מצליח לתקן נכשל בבדיקה עד שהסוכן מיישר קו עם המוסכמות.', ruleLabel: 'החוק שנאכף', rule: 'ESLint + Prettier: project style or no merge' },
      { iconKey: 'Lock', accent: 'cyan', kicker: 'Gate 03 · Security', name: 'אבטחה', attemptLabel: 'הסוכן ניסה', scenario: 'כדי "פשוט שזה יעבוד", הסוכן מטמיע API key קשיח בקוד ובונה שאילתת SQL על ידי הדבקת קלט המשתמש ישירות לתוך המחרוזת.', attemptCode: "const KEY = 'sk_live_9f3a...'\ndb.query('SELECT * FROM users WHERE id=' + req.id)", verdict: 'BLOCKED', responseLabel: 'תגובת ה-Guardrail', response: 'secret scanning תופס את ה-key הקשיח ו-SAST מסמן את השאילתה הפגיעה ל-injection. ה-commit נחסם עוד לפני שהוא מגיע ל-branch.', ruleLabel: 'החוק שנאכף', rule: 'No secrets in code · parameterized queries only' },
      { iconKey: 'Layers', accent: 'emerald', kicker: 'Gate 04 · Architecture', name: 'ארכיטקטורה', attemptLabel: 'הסוכן ניסה', scenario: 'בקיצור דרך, הסוכן פונה ל-DB ישירות מתוך קומפוננטת UI במקום לעבור דרך שכבת ה-service.', attemptCode: "// components/UserCard.tsx\nimport { db } from '../db'\nconst rows = await db.query('SELECT ...')", verdict: 'BLOCKED', responseLabel: 'תגובת ה-Guardrail', response: 'חוק גבולות הארכיטקטורה מזהה ששכבת ה-UI מדלגת מעל שכבת ה-service ופונה ישירות ל-DB, ופוסל זאת. הקריאה חייבת לחזור ולעבור דרך השכבות המוגדרות.', ruleLabel: 'החוק שנאכף', rule: 'UI → Service → DB · no layer skipping' },
    ],
    loopKicker: 'וזה מצטבר',
    loopHeading: 'הצינור רק הולך ומתחזק.',
    loopBody: 'וזה החלק ששובר את המשחק: כל טעות שהסוכן עושה לא רק נחסמת — היא נתפסת ומקודדת חזרה לצינור כחוק קבוע. הצינור אף פעם לא מתכווץ. הוא גדל עם כל טעות שהוא ראה אי-פעם.',
    loopSteps: ['הסוכן מבצע', 'השער תופס את הטעות', 'הטעות מקודדת כחוק קבוע', 'הצינור גדל'],
    loopBackNote: 'כל טעות הופכת את הריצה הבאה לבטוחה יותר',
    callout: 'כל טעות של סוכן הופכת לשער קבוע. בני אדם לעולם לא צריכים לתפוס את אותה טעות פעמיים — הצינור רק הולך ומתחזק.',
  },

  // 14. sdlcRoles
  {
    type: 'sdlcRoles',
    title: 'תפקידים מחודשים',
    subtitle: 'אף אחד לא מוחלף. כולם מקודמים.',
    roles: [
      { icon: '🎯', oldRole: 'מנהל מוצר', newRole: 'בעל תוצאות', oneLiner: "בעל ה'מה' — כותב דרישות, מאשר spec.md, חותם על כל מחזור", stage: 'שלבים 1, 6', accent: 'blue' },
      { icon: '🏛️', oldRole: 'ארכיטקט / ראש טכנולוגיה', newRole: 'בעל ממשל', oneLiner: 'מגדיר ארכיטקטורה, אילוצים ושערי צינור; חותם על constitution.md לפני שסוכן מתחיל', stage: 'שלבים 1–3', accent: 'violet' },
      { icon: '🔬', oldRole: 'מפתח', newRole: 'מתאם פיתוח', oneLiner: 'מוביל סוכנים, כותב תקצירי sprint, סוקר כל PR — בעל איכות הפלט, לא כתיבת הקוד', stage: 'שלב 4', accent: 'teal' },
      { icon: '🧪', oldRole: 'ליד QA', newRole: 'מתאם QA', oneLiner: 'מעצב ארכיטקטורת בדיקות מראש, מריץ בדיקות מול Feature Specs, בעל רשת ה-regression', stage: 'שלב 5', accent: 'cyan' },
      { icon: '🤖', oldRole: 'לא קיים', newRole: 'סוכן AI', oneLiner: 'מבצע את כל עבודת הפיתוח — קוד, בדיקות, תיעוד — בתוך האילוצים שהגדיר בעל הממשל', stage: 'שלבים 2–7', accent: 'indigo' },
      { icon: '🔭', oldRole: 'SRE / DevOps', newRole: 'ליד תצפיתיות', oneLiner: 'עוקב אחר ייצור מול כוונת ה-spec; מפעיל מחזורי תיקון עצמי כשמערכות סוטות', stage: 'שלב 7', accent: 'emerald' },
    ],
    coreShiftTitle: 'השינוי המרכזי',
    coreShift: [
      { type: 'check', text: 'הערך עובר מכתיבת קוד לאימות ואישור פלט סוכנים.' },
      { type: 'check', text: 'המיומנות המרכזית הופכת לכוונה — הגדר מה התוכנה צריכה לעשות, אמת שהיא עושה זאת.' },
      { type: 'check', text: 'מוקד ההכשרה עובר להבנת הבעיה (לא תחביר), ניטור מערכות AI וטכניקות אימות.' },
      { type: 'warn', text: 'HITL הוא נקודת ביקורת חובה, לא חותמת גומי.' },
    ],
  },

  // ── ACT 4 — IMPLEMENTED WITH SPEC-DRIVEN DEVELOPMENT ─────────────────────────

  // 15. orchestrator
  {
    type: 'orchestrator',
    scrollable: true,
    kicker: 'אקט 4 · הדפוס',
    title: 'בני אדם מתזמנים. סוכנים מבצעים.',
    subtitle: 'תזמור הוא לא רק ביצוע מקבילי — זו ארכיטקטורת הקשר.',
    providers: [
      { id: 'copilot', name: 'GitHub Copilot', icon: '🔵', accent: 'blue', orchestratorModel: 'GPT 5.4', agentModel: 'GPT 5.2' },
      { id: 'cline', name: 'Cline', icon: '🤖', accent: 'indigo', orchestratorModel: 'Claude / GPT-5', agentModel: 'BYO model' },
      { id: 'continue', name: 'Continue (Local)', icon: '🟢', accent: 'green', orchestratorModel: 'GPT OSS 120B', agentModel: 'GPT OSS 7B' },
    ],
    orchestrator: {
      roleLabel: 'בעל ממשל',
      tasks: ['כותב תקצירי מחזורים', 'מוליד סוכנים מקבילים', 'מסדר לפי גרף תלות', 'סוקר תוצאות וממזג'],
    },
    agents: [
      { roleLabel: 'סוכן א', task: 'כרטיסי Backend ב-worktree-a' },
      { roleLabel: 'סוכן ב', task: 'כרטיסי Frontend ב-worktree-b' },
      { roleLabel: 'סוכן ג', task: 'מסמכים ותצורה ב-worktree-c' },
    ],
    benefits: ['הקשר ראשי נקי', 'ביצוע מקבילי', 'עצי עבודה מבודדים'],
    callout: 'אותן ספסיפיקציות. אותן גדרות הגנה. כל מודל.',
    withoutBeat: {
      kicker: 'פעימה 1 · ללא תזמור',
      title: 'ללא תזמור, כל משימה עולה בהקשר.',
      body: 'כשאין הפרדה בין תכנון לביצוע, ההקשר הראשי עושה הכול: מתכנן, מבצע, סוקר, מאבחן. הוא מתמלא מהר. ה-Compaction נכנס לפעולה. הפרויקט מאבד את הזיכרון שלו.',
      trapReference: 'זכור שקופית 5 — מלכודת הדחיסה',
      contextSteps: [
        'Feature 1 תוכנן ובוצע בהקשר הראשי — הקשר ב-30%',
        'איבחון באגים ותיקון באותו הקשר — הקשר ב-55%',
        'Feature 2 החל — הקשר ב-75%, המודל מסכם בשקט',
        'סקירה ואיבחון — הקשר דוחס, החלטות מוקדמות אבדו',
        'Feature 3: ה-AI כבר לא זוכר את החלטות הארכיטקטורה המקוריות',
        'הפיצ׳ר השני הוא המקום שבו רוב פרויקטי ה-AI מתים.',
      ],
    },
    withBeat: {
      kicker: 'פעימה 2 · עם תזמור',
      title: 'עם תזמור, הסוכנים נושאים בנטל.',
      body: 'המתזמן מחזיק את התמונה הכוללת: חזון, ספסיפיקציות, סדר תלויות, גדרות הגנה. כל סוכן מקבל תקציר ממוקד ומבצע בחלון הקשר מבודד משלו. ההקשר הראשי כמעט לא זז.',
      agentLabels: ['סוכן א', 'סוכן ב', 'סוכן ג'],
      agentTasks: [
        'כרטיסי Backend\nworktree-a',
        'כרטיסי Frontend\nworktree-b',
        'מסמכים ותצורה\nworktree-c',
      ],
    },
    handoffBeat: {
      kicker: 'פעימה 3 · תקציר המסירה',
      title: 'הסוכן מקבל בדיוק מה שהוא צריך — לא יותר.',
      body: 'המתזמן לא מעביר את כל היסטוריית השיחה. הוא כותב תקציר ממוקד: הספסיפיקציה הרלוונטית, רשימת הכרטיסים, קריטריוני קבלה, וגדרות ההגנה. הסוכן מתחיל רענן עם הקשר ממוקד.',
      briefItems: [
        'ספסיפיקציה רלוונטית (מוגבלת לסט הכרטיסים הזה)',
        'רשימת כרטיסים עם קריטריוני קבלה',
        'גדרות הגנה ותקני קוד',
        'הפניות לתלויות (חוזי API, סכמה)',
      ],
      notIncluded: 'לא כלול: היסטוריית השיחה המלאה, פיצ׳רים קודמים, דיוני תכנון, או כל הקשר מחוץ לנתיב של הסוכן הזה.\n\nזה מכוון — הבידוד הוא המנגנון.',
    },
    payoffBeat: {
      kicker: 'פעימה 4 · התמורה',
      title: 'ההקשר הראשי שלך נשאר קוהרנטי לכל אורך הפרויקט.',
      body: 'לא רק הפיצ׳ר הראשון. לא רק ספרינט אחד. המתזמן מחזיק את התמונה המלאה — ארכיטקטורה, החלטות, תלויות — כי מעולם לא שרף את הזיכרון שלו על משימות ביצוע.',
      callbackQuote: 'הפיצ׳ר השני הוא המקום שבו פרויקטי ה-AI הולכים למות.',
      resolution: 'עם תזמור, אין קיר פיצ׳ר שני. הסוכנים נושאים בעלות ההקשר של הביצוע. ההקשר הראשי נשאר ארוך, קוהרנטי, ובשליטה — לכל משך הפרויקט.',
      providerLine: 'אותן ספסיפיקציות. אותן גדרות הגנה. כל מודל.',
    },
  },

  // 16. specRot — capstone של אקט המתודולוגיה: לקרוא לאויב בשמו, ולהראות שהוא מובס מעצם הבנייה
  {
    type: 'specRot',
    scrollable: true,
    kicker: 'אקט 4 · אבן הראשה',
    enemyLabel: 'SPEC ROT',
    enemySub: 'a.k.a. doc drift · design drift · בן הדוד של code rot',
    definition: 'הספסיפיקציה והמימוש נסחפים לאט בלי סנכרון. הקוד ממשיך להשתנות; הספסיפיקציה לא. סנטימטר אחר סנטימטר היא הופכת ממדויקת, למטעה, לחסרת אמון, לנטושה.',
    decayTitle: 'איך מקור אמת אחד גוסס בשקט',
    specTrackLabel: 'spec.md',
    codeTrackLabel: 'the code',
    stages: [
      { commits: '+0 commits', label: 'נולדה מהימנה — מקור האמת היחיד', trust: 100 },
      { commits: '+12 commits', label: 'תיקון נשלח בצ׳אט, מעולם לא נכתב בחזרה', trust: 70 },
      { commits: '+31 commits', label: 'כעת מטעה — אנשים קוראים את הקוד במקום', trust: 35 },
      { commits: '+47 commits', label: 'נטושה — סוכן שמוזן בה בונה את הדבר הלא נכון', trust: 10 },
    ],
    staleStamp: 'last updated · 47 commits ago',
    verdict: 'ספסיפיקציה שנרקבה גרועה מהיעדר ספסיפיקציה.',
    verdictSub: 'היא לא רק משתתקת — היא מטעה באופן פעיל, ומחזירה את מס ההנדסה לאחור.',
    cureKicker: 'התפנית',
    cureTitle: 'SDD הופך ריקבון לבלתי אפשרי מעצם הבנייה',
    gates: [
      { icon: 'FileCheck', title: 'שער ספסיפיקציה-תחילה', detail: 'הספסיפיקציה מתעדכנת לפני שהקוד משתנה — לעולם לא אחרי.' },
      { icon: 'GitMerge', title: 'אין ספסיפיקציה, אין מיזוג', detail: 'קוד לא יכול להיכנס בלי ספסיפיקציה מאושרת ועדכנית.' },
      { icon: 'RefreshCw', title: 'סיכומי מחזור', detail: 'כל מחזור נסגר בכתיבת הספסיפיקציה בחזרה לחיים.' },
      { icon: 'ShieldCheck', title: 'גדרות ההגנה אוכפות זאת', detail: 'סחיפה נתפסת מכנית, לא מתוך רצון טוב.' },
    ],
    lockedLabel: 'spec ⟷ code · locked',
    payoff: 'הספסיפיקציה לא יכולה להתיישן בשקט. האמת נשארת האמת.',
  },

  // ── ACT 5 — TOOLING ──────────────────────────────────────────────────────────

  // 17. tooling — SCROLLABLE · Make It Real (simplified)
  {
    type: 'tooling',
    scrollable: true,
    kicker: 'אקט 5 · הכלים',
    title: 'להפוך את זה לאמיתי',
    subtitle: 'המתודולוגיה, עם כלים — בחר מסגרת ספסיפיקציה, אכוף את גדרות ההגנה, ותן ל-Docs לצד ה-Specs להפוך לזיכרון החי של הפרויקט.',
    scrollHint: 'גלול דרך שרשרת הכלים',
    intro: { roadmap: [ { id: '1', label: 'מסגרות ספסיפיקציה', accent: 'teal' }, { id: '2', label: 'גדרות הגנה', accent: 'violet' }, { id: '3', label: 'זיכרון חי', accent: 'emerald' } ] },
    specPage: {
      page: '1', accent: 'teal', label: 'מסגרות ספסיפיקציה', eyebrow: 'היכן האמת נכתבת.',
      dimensions: [ 'שער אישור ספסיפיקציה', 'אכיפת TDD / גדרות הגנה', 'סיכומי מחזורים / זיכרון', 'סנכרון ALM וכלים (Jira / TFS)', 'אגנוסטי למודל', 'רישיון / קוד פתוח' ],
      frameworks: [
        { id: 'spec-kit', glyph: '⚙️', name: 'Spec-Kit', short: 'Spec-Kit', role: 'עמוד השדרה', accent: 'teal', tagline: 'הספסיפיקציה במרכז; אין קוד עד שהספסיפיקציה מאושרת.', whatItIs: 'המסגרת הפתוחה של GitHub שמציבה ספסיפיקציה קריאת-מכונה במרכז זרימת העבודה ומתנה את המימוש באישור אנושי.', bullets: ['spec.md הוא החוזה', 'שער אישור אנושי לפני קוד', 'זרימת עבודה מבוססת-שלבים', 'קוד פתוח, ניטרלי לספק'], terminal: [ { text: '$ specify init && specify spec --from PROJ-421', type: 'command' }, { text: '✓ spec.md created — awaiting approval', type: 'success' }, { text: '⛔ implementation blocked: spec.approved = false', type: 'error' } ], repo: 'github.com/github/spec-kit', cells: ['✓ שער אכוף', '~ מוסכמות', '✗', '~ דרך סקריפטים', '✓', '✓ OSS (MIT)'] },
        { id: 'openspec', glyph: '📐', name: 'OpenSpec', short: 'OpenSpec', role: 'זרימת הצעות', accent: 'teal', tagline: 'שינוי-כהצעה: כל דלתא היא ספסיפיקציה נסקרת.', whatItIs: 'גישה פתוחה מונחית-ספסיפיקציות שבה כל שינוי נכתב כהצעה ומאושר לפני ביצוע, תוך שמירת היסטוריית כוונות נסקרת.', bullets: ['שינוי = הצעה', 'היסטוריית ספסיפיקציות נסקרת', 'קליל, נטיב ל-repo', 'קוד פתוח, ללא מפתחות API'], terminal: [ { text: '$ openspec propose "add waitlist"', type: 'command' }, { text: '✓ proposal/waitlist.md → review', type: 'success' }, { text: '✓ approved → ready to implement', type: 'success' } ], repo: 'openspec.dev', cells: ['✓ הצעה → אישור', '~ ברמת ספסיפיקציה', '~ היסטוריית שינויים', '~ דרך סקריפטים', '✓', '✓ OSS'] },
        { id: 'autospec', glyph: '🧬', name: 'AutoSpec', short: 'AutoSpec', role: 'המאחד', accent: 'teal', home: true, tagline: 'שער ספסיפיקציה + גדרות הגנה + זיכרון חי + סנכרון ALM — מסגרת אחת.', whatItIs: 'המסגרת שהמצגת הזו עצמה בנויה בה. היא מאחדת את המשמעות: שער הספסיפיקציה, אכיפת TDD/גדרות הגנה, ו-Docs הנשמרים לצד ה-Specs כזיכרון חי ארוך-טווח, עם מיומנויות שמסנכרנות Jira / TFS.', bullets: ['שער ספסיפיקציה + ספסים מבוססי-תפקיד', 'גדרות הגנה אכופות, לא מוצעות', 'Docs ⇄ Specs = זיכרון עמיד', 'מיומנויות: Jira/TFS → ספסיפיקציה → PR', 'כל מודל (ניתוב FinOps)'], terminal: [ { text: '$ autospec cycle start --from PROJ-421', type: 'command' }, { text: '✓ spec.md gated · guardrails armed', type: 'success' }, { text: '✓ cycle-12 summary will persist to docs/', type: 'success' } ], repo: 'github.com/Hundia/autospec', cells: ['✓ שער + תפקידים', '✓ גדרות מובנות', '✓ זיכרון Docs ⇄ Specs', '✓ Jira / TFS', '✓ כל מודל', '✓ OSS (Hundia/autospec)'] },
        { id: 'diy', glyph: '✍️', name: 'Write Your Own Spec', short: 'DIY', role: 'הדרך העצמאית', accent: 'teal', tagline: 'אין מסגרת? קודד את המשמעת בעצמך.', whatItIs: 'אינך צריך מוצר — אתה צריך את המשמעות. constitution.md, תבנית ספסיפיקציה, שער אישור ב-CI וגדרות pre-commit משחזרים את רוב הערך.', bullets: ['constitution.md ככללים שלך', 'תבנית ספסיפיקציה + שער אישור PR', 'גדרות הגנה דרך CI / pre-commit', 'שליטה מלאה, תחזוקה מלאה'], terminal: [ { text: '$ mkdir specs && touch constitution.md spec-template.md', type: 'command' }, { text: '# CI: block merge unless spec.approved label', type: 'info' }, { text: '# pre-commit: tests + lint + types = guardrails', type: 'info' } ], repo: 'your repo', cells: ['~ אתה מגדיר', '~ hooks עצמאיים', '~ בעצמך', '~ אתה מחבר', '✓', 'n/a — repo שלך'] },
      ],
    },
    guardPage: {
      page: '2', accent: 'violet', label: 'משמעת ביצוע', eyebrow: 'היכן האמת מוגנת.', thesis: 'גדרות ההגנה הן ההגנה.',
      dimensions: [ 'אין קוד לפני בדיקה כושלת', 'אכיפה אוטומטית (לא המלצה)', 'מתחבר ללולאת הסוכן', 'מקודד כל תיקון כבדיקה', 'עלות הקמה' ],
      frameworks: [
        { id: 'superpowers', glyph: '🦸', name: 'Superpowers', short: 'Superpowers', role: 'אכיפת גדרות הגנה', accent: 'violet', tagline: 'TDD קפדני לסוכנים — אין מימוש לפני שקיימת בדיקה כושלת.', whatItIs: 'שכבת משמעת-ביצוע שמנהלת את התנהגות הסוכן בזמן המימוש: אסור לסוכנים לכתוב קוד מימוש עד שקיימת בדיקה כושלת.', bullets: ['TDD קפדני, אכוף על הסוכן', 'חוסם מימוש ללא בדיקה אדומה', 'מתחבר ללולאת המחזור', 'הופך כל באג לבדיקה קבועה'], terminal: [ { text: '$ superpowers cycle --task tasks.md#42', type: 'command' }, { text: '⛔ No implementation without failing test', type: 'error' }, { text: '✓ Test fails → OK to implement now', type: 'success' } ], repo: 'github.com/obra/superpowers', cells: ['✓ אכוף', '✓ חסימה קשיחה', '✓ hooks למחזור', '✓ בדיקות רגרסיה', '~ התקנה + הגדרה'] },
        { id: 'diy-guard', glyph: '🛠️', name: 'Write Your Own Guardrails', short: 'DIY', role: 'הדרך העצמאית', accent: 'violet', tagline: 'CI + pre-commit יכולים לאכוף את אותה משמעת שאתה בונה בעצמך.', whatItIs: 'שחזר את המשמעת עם כלים שכבר ברשותך: hooks של pre-commit, שער CI שנכשל על בדיקות חסרות, וחוזה פרומפט לסוכן שאוסר קוד לא-נבדק.', bullets: ['pre-commit: בדיקות + lint + types', 'שער CI נכשל על ירידת כיסוי', 'חוזה פרומפט: בדיקה אדומה תחילה', 'שליטה מלאה, אתה מתחזק'], terminal: [ { text: '$ pre-commit install', type: 'command' }, { text: '# CI: fail if new code lacks a failing-then-passing test', type: 'info' }, { text: '✓ guardrails enforced in your pipeline', type: 'success' } ], repo: 'your repo', cells: ['~ אם תחבר', '~ דרך CI בלבד', '~ ידני', '~ אם ממושמע', '~ מאמץ עצמאי'] },
      ],
    },
    memoryPage: {
      page: '3', accent: 'emerald', label: 'הזיכרון החי', eyebrow: 'היכן כל החלטה נזכרת.', headline: 'Docs לצד Specs = זיכרון חי.', syncBadge: 'specs/ ⇄ docs/', specHeading: 'Specs', docHeading: 'Docs',
      mappings: [ { spec: 'specs/02-architect.md', doc: 'docs/architecture/', relation: 'מגדיר' }, { spec: 'specs/05-security.md', doc: 'docs/guardrails/', relation: 'אוכף' }, { spec: 'specs/07-flows.md', doc: 'docs/flows/', relation: 'מתאר' }, { spec: 'specs/backlog.md', doc: 'docs/cycles/cycle-12.md', relation: 'מתעד' } ],
      callout: 'הספסיפיקציה היא האמת, גדרות ההגנה הן ההגנה — ו-Docs הממופים ל-Specs הם הזיכרון החי. שום הקשר לא אובד.',
    },
    closing: 'אלה הכלים שהופכים את המתודולוגיה לאמיתית. הבא: איך לאמץ אותם — יסוד → הרחבה → אופטימיזציה.',
  },

  // 18. openSpec — SCROLLABLE · merged
  {
    type: 'openSpec',
    variant: 'unified',
    scrollable: true,
    kicker: 'הכלי שמאחורי הדמו',
    heroTitle: 'OpenSpec',
    heroSubtitle: 'יישור בין בני אדם ל-AI על מה לבנות לפני קוד — version control לכוונה.',
    scrollHint: 'רואים את הלולאה, ואז spec אמיתי',
    loopKicker: 'לולאה אחת רגועה',
    loopHeading: 'Propose → Apply → Archive',
    loopBody: 'כל שינוי זורם דרך אותם שלושה שלבים. מציעים את הכוונה, מיישמים את המשימות, מארכבים כמקור האמת החדש.',
    loopSteps: [
      { iconKey: 'FilePlus2', label: 'Propose', command: '/opsx:propose add-mfl-telemetry', note: 'יוצר את תיקיית השינוי', accent: 'teal' },
      { iconKey: 'Workflow', label: 'Apply', command: '/opsx:apply', note: 'מיישם את המשימות', accent: 'violet' },
      { iconKey: 'CheckCircle2', label: 'Archive', command: '/opsx:archive', note: 'הופך למקור האמת', accent: 'emerald' },
    ],
    loopBackNote: 'האמת המארכבת מזינה את השינוי הבא — brownfield-first, 1 → n',
    folderLabel: 'openspec/changes/add-mfl-telemetry/',
    reqKicker: 'REQ-MFL-001',
    reqHeading: 'איך spec אמיתי נראה',
    reqBody: 'spec נפתח בדרישה שכל אחד יכול לקרוא — בלי ז׳רגון, בלי עמימות לגבי מה נחשב הצלחה.',
    requirementBlock: `Requirement: MFL Telemetry Status

Each drone subsystem — camera, rotors, INS,
IMU, GPS, comms — MUST report its health as
OK / DEGRADED / FAIL on every telemetry cycle.`,
    scenarioBody: 'ההתנהגות מגיעה כתרחישים בשפה תנאית פשוטה. בני אדם קוראים אותם כמשפטים; הסוכן קורא אותם כבדיקות.',
    scenarioBlock: `Scenario: Healthy subsystem
  WHEN the camera responds within the cycle
  THEN the MFL reports camera = OK

Scenario: Missed heartbeat
  WHEN the GPS misses its heartbeat
  THEN the MFL reports gps = FAIL`,
  },

  // 19. demoIntro
  {
    type: 'demoIntro',
    scrollable: true,

    // HERO
    kicker: 'REQ-MFL-001 · LIVE DEMO',
    heroTitle: 'Game Of Drones',
    heroSubtitle: 'מטיקט Jira ועד PR מבוקר — עם SDD.',
    heroTag: 'Ground Station · Drone Telemetry Platform',
    scrollHint: 'עקבו אחרי הדרישה — מהגשת הטיקט ועד PR שנשלח',

    // Beat 1 — The Project
    projectKicker: 'הפרויקט',
    projectTitle: 'פלטפורמת טלמטריה לרחפן',
    projectBody:
      'רחפן בשמים. צוות קרקע. קישור רדיו אחד שמוביל את כל מה שצריך לשמור על הטיסה בטוחה. כל מערכת משנה — מנוהלת בנפרד, קריטית לכשירות הטיסה.',
    droneModules: [
      { iconKey: 'Cpu',      label: 'Main Computer', subLabel: 'מעבד משימה' },
      { iconKey: 'Camera',   label: 'Camera',        subLabel: 'עומס אופטי' },
      { iconKey: 'Wind',     label: 'Rotors',        subLabel: 'מערכת הנעה' },
      { iconKey: 'Compass',  label: 'INS',           subLabel: 'ניווט אינרציאלי' },
      { iconKey: 'Activity', label: 'IMU',           subLabel: 'חישת תנועה' },
      { iconKey: 'MapPin',   label: 'GPS',           subLabel: 'מיקום גאוגרפי' },
      { iconKey: 'Radio',    label: 'Comms',         subLabel: 'קישור נתונים' },
    ],
    droneImageUrl: '/drone-anatomy.png',

    // Beat 2 — ICD / Communication
    commsKicker: 'ה-ICD',
    commsTitle: 'סוגי הודעות מחמירים — ללא תקשורת חופשית',
    commsBody:
      'כל הנתונים זורמים דרך מסמך בקרת ממשק (ICD): רק סוגי הודעות מוגדרים מראש מותרים. שתי הודעות פועלות היום. שלישית נחתה על לוח ה-sprint — והיא נוגעת בכל מערכת משנה ברחפן.',
    currentMessages: [
      { type: 'NAV',    accentKey: 'blue',  desc: 'מיקום גאוגרפי — קו רוחב / אורך / גובה / כיוון' },
      { type: 'STATUS', accentKey: 'teal',  desc: 'רמת סוללה · זמן טיסה · זמן פעולה' },
    ],
    newMessage: {
      type: 'MFL',
      accentKey: 'amber',
      desc: 'Module Functionality Log — בריאות תפעולית לכל מערכת משנה',
    },
    commsImageUrl: '/drone-comms.png',

    // Beat 3 — Requirement
    demandKicker: 'הדרישה',
    demandTitle: 'REQ-MFL-001',
    demandBody:
      'מפעילים צריכים להעריך כשירות טיסה בזמן אמת ולהגיב לפגיעה במהלך הטיסה. כל מערכת משנה חייבת לדווח על מצבה התפעולי — OK, DEGRADED, או FAIL — בכל מחזור טלמטריה.',
    mflModules: [
      { id: 'camera', label: 'Camera' },
      { id: 'rotors', label: 'Rotors' },
      { id: 'ins',    label: 'INS' },
      { id: 'imu',    label: 'IMU' },
      { id: 'gps',    label: 'GPS' },
      { id: 'comms',  label: 'Comms' },
    ],
    mflPayloadSample: `{
  "type": "MFL",
  "timestamp": "2026-06-19T14:32:11Z",
  "modules": {
    "camera": "OK",
    "rotors": "OK",
    "ins":    "OK",
    "imu":    "DEGRADED",
    "gps":    "OK",
    "comms":  "FAIL"
  }
}`,
    scope: ['Backend', 'Frontend', 'Simulator'],

    // Beat 4 — Workflow
    workflowKicker: 'צינור ה-SDD',
    workflowTitle: 'שישה שלבים. Spec אחד. ללא כאוס.',
    workflowSteps: [
      {
        num: '01',
        label: 'Pull Jira Ticket',
        detail: 'ה-Agent שולף את REQ-MFL-001 דרך API key',
        icon: 'ClipboardList',
        accent: 'blue',
      },
      {
        num: '02',
        label: 'Create Spec',
        detail: 'OpenSpec מייצר spec חי מהדרישה',
        icon: 'FileText',
        accent: 'violet',
      },
      {
        num: '03',
        label: 'Generate Code',
        detail: 'ה-Agent מממש backend · frontend · simulator',
        icon: 'Code2',
        accent: 'indigo',
      },
      {
        num: '04',
        label: 'HITL Review',
        detail: 'Human-in-the-Loop review עוצר את הצינור לאישור אנושי',
        icon: 'UserCheck',
        accent: 'teal',
      },
      {
        num: '05',
        label: 'Generate QA Tests',
        detail: 'ה-Agent מייצר בדיקות E2E מה-spec',
        icon: 'FlaskConical',
        accent: 'emerald',
      },
      {
        num: '06',
        label: 'PR + AI Review',
        detail: 'AWS Bedrock Agent מסכם עבור המפתח ומנהל הצוות',
        icon: 'GitPullRequest',
        accent: 'cyan',
      },
    ],

    // Beat 5 — Handoff
    handoffKicker: 'הבמה שלכם',
    handoffTitle: 'הבמה היא שלכם.',
    handoffBody:
      'אתם מכירים את הכללים. REQ-MFL-001 נכנסה לצינור. צפו ב-SDD סוגרת אותה.',
    handoffCallout: 'REQ-MFL-001 · Drone Telemetry Platform',
  },

  // 20. finalTagline
  {
    type: 'finalTagline',
    title: 'The Agentic SDLC',
    tagline: 'הספסיפיקציה היא האמת. גדרות ההגנה הן המגן. האדם הוא השופט.',
  },

  // ── CLOSE — finishing slides (returned to after the demos) ──────────────────────

  // 21. adoption — SCROLLABLE · VISUAL JOURNEY
  {
    type: 'adoption',
    scrollable: true,
    title: 'מסע האימוץ שלך ל-SDD',
    subtitle: 'מ-repo ניסויי למהירות צוות מצטברת — תוך 60 יום',
    phases: [
      {
        number: '01',
        name: 'יסודות ורווחים מהירים',
        timeline: 'שבוע 1–2',
        claim: 'אתה מכין את ה-AI co-pilot שלך לעבודה אמיתית.',
        color: 'emerald',
        capabilities: [
          { icon: 'Wrench', label: 'הגדרת כלי SDD', toolingLink: true },
          { icon: 'Zap', label: 'Superpowers פעיל' },
          { icon: 'Brain', label: 'זיכרון ארוך-טווח', toolBadge: 'confluence' },
          { icon: 'FileCheck', label: 'Spec לפני קוד' },
          { icon: 'ShieldCheck', label: 'רשת QA רגרסיה', toolBadge: 'playwright' },
        ],
        terminalLines: [
          '✓ SDD tool installed on pilot repo',
          '✓ Superpowers active — 12 guardrail rules',
          '✓ docs/ seeded — architecture memory live',
          '✓ QA baseline: 0 → first spec committed',
          '→ AI co-pilot ready for real work',
        ],
        vignette: 'cockpit',
        milestone: 'ה-PR הראשון שנוצר על ידי AI שתואם בפועל את ה-spec',
      },
      {
        number: '02',
        name: 'הרחבה ואינטגרציה',
        timeline: 'שבוע 3–6',
        claim: 'אתה פורס את ה-co-pilot על כל הצוות.',
        color: 'blue',
        capabilities: [
          { icon: 'Users', label: 'כל הצוות על הסיפון' },
          { icon: 'Tag', label: 'צינור טיקט → Spec', toolBadge: 'jira' },
          { icon: 'GitBranch', label: 'שערי CI/CD Spec', toolBadge: 'github' },
          { icon: 'Calendar', label: 'מחזוריות סקירה' },
          { icon: 'BarChart2', label: 'מעקב שיעור פגמים' },
        ],
        vignette: 'teamTopology',
        milestone: 'ספרינט שבו AI סוגר 30%+ מהטיקטים באופן עצמאי',
      },
      {
        number: '03',
        name: 'אופטימיזציה והצטברות',
        timeline: 'חודש 2–3',
        claim: 'המערכת לומדת והרווחים מצטברים.',
        color: 'violet',
        capabilities: [
          { icon: 'Search', label: 'ביקורות Retrospec' },
          { icon: 'Sliders', label: 'כיוון גדרות הגנה' },
          { icon: 'BookOpen', label: 'זיכרון ארכיטקטורה', toolBadge: 'confluence' },
          { icon: 'TrendingUp', label: 'מעקב מהירות' },
          { icon: 'RefreshCw', label: 'בדיקת בריאות רבעונית' },
        ],
        vignette: 'compoundChart',
        milestone: 'docs-as-memory: הארכיטקטורה לעולם לא צריכה להיות מוסברת מחדש',
      },
    ],
    metrics: [
      { icon: '📈', value: '3×', label: 'ROI עד חודש 2', color: 'emerald' },
      { icon: '⚡', value: '60%', label: 'PR ראשון מהיר יותר', color: 'teal' },
      { icon: '🛡️', value: '40%', label: 'פחות פגמים', color: 'blue' },
      { icon: '🤝', value: '100%', label: 'כל הצוות על SDD', color: 'violet' },
    ],
    closingQuote: 'המהירות מצטברת. הכאוס לא.',
  },

  // 22. closing — נקודת השיגור שלך (the final slide)
  {
    type: 'closing',
    title: 'נקודת השיגור שלך',
    subtitle: 'כל מה שעברנו עליו — סמנו, ואז צאו לבנות.',
    categories: [
      {
        label: 'מסגרות ספסיפיקציה',
        accent: 'emerald',
        icon: 'Compass',
        links: [
          { name: 'GitHub Spec Kit', url: 'https://github.com/github/spec-kit', note: 'Spec → Plan → Tasks → Implement' },
          { name: 'OpenSpec', url: 'https://github.com/Fission-AI/OpenSpec', note: 'תהליך spec-driven קליל' },
          { name: 'AutoSpec', url: 'https://github.com/Hundia/autospec', note: 'This framework' },
        ],
      },
      {
        label: 'כלים אג\'נטיים ו-CLI',
        accent: 'blue',
        icon: 'Terminal',
        links: [
          { name: 'GitHub Copilot', url: 'https://github.com/features/copilot', note: 'שותף תכנות AI' },
          { name: 'Copilot CLI', url: 'https://github.com/github/copilot-cli', note: 'Copilot בטרמינל שלכם' },
          { name: 'Superpowers', url: 'https://github.com/obra/superpowers', note: 'מתודולוגיית skills אג\'נטית' },
        ],
      },
      {
        label: 'Skills ומדריכים',
        accent: 'cyan',
        icon: 'Sparkles',
        links: [
          { name: 'Spec Kit Docs', url: 'https://github.github.com/spec-kit/', note: 'מדריך התחלה' },
          { name: 'Spec-Driven w/ AI', url: 'https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/', note: 'מאמר הפתיחה ב-GitHub Blog' },
        ],
      },
      {
        label: 'אקוסיסטם AutoSpec',
        accent: 'violet',
        icon: 'Rocket',
        links: [
          { name: 'AutoSpec Docs', url: 'https://hundia.github.io/autospec', note: 'מתודולוגיה ומדריכים' },
          { name: 'AutoDeck', url: 'https://github.com/Hundia/AutoDeck', note: 'המצגת הזו, בקוד פתוח' },
          { name: 'EasyDeck', url: 'https://github.com/Hundia/EasyDeck', note: 'Deck builder' },
        ],
      },
    ],
    tagline: 'מכוונה להיגוי.',
  },
];
