export const slidesHE = [
  // ── ACT 1 — THE PROBLEM (slides 1–7) ────────────────────────────────────────

  // 1. title
  {
    type: 'title',
    title: 'The Agentic SDLC',
    subtitle: 'פיתוח מונחה-ספסיפיקציות בסקאלה ארגונית',
    tagline: 'סוכנים מבצעים. בני אדם מנהלים.',
    presenter: 'אלי חונדיה ושרון שוורץ',
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

  // 4. eraAgentic
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

  // 5. contextPoisoning (מלכודת הדחיסה)
  {
    type: 'contextPoisoning',
    kicker: 'חלון הקשר · 98% מלא',
    title: 'מלכודת הדחיסה',
    subtitle: 'כשחלון ההקשר מתמלא, הסוכן מסכם את השיחה כדי להמשיך — ומוחק בשקט את ההחלטות שעליהן הוא נבנה.',
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
    verdict: {
      agentLine: 'Adding MongoDB for the activity feed — documents fit better here.',
      dagger: 'הוא לא מבולבל. הוא פשוט לא רואה מה אבד.',
    },
  },

  // 6. secondFeature (merged: The Reverse Engineering Tax + The Breaking Point)
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

  // ── ACT 2 — TURNING POINT (slides 8–9) ────────────────────────────────────────

  // 8. sddCostOfChaos
  {
    type: 'sddCostOfChaos',
    kicker: 'אבחנה',
    title: 'עלות היעדר ספסיפיקציות',
    reframe: {
      myth: 'ה-AI שכח הכל.',
      truth: 'אתה מעולם לא נתת לו זיכרון.',
    },
    findings: [
      { label: 'סשן #51 — מתחיל מחדש', cause: 'אין זיכרון מתמיד' },
      { label: 'תור 30 — ההקשר משחית', cause: 'אין עוגן חיצוני' },
      { label: 'סוכן B — מתחיל מאפס', cause: 'אין מסמך משותף' },
    ],
    crystal: {
      word: 'SPECIFICATION',
      definition: 'הזיכרון שמעולם לא נתת לו.',
    },
  },

  // 9. bridge
  {
    type: 'bridge',
    title: 'מה אם...',
    question: 'מה אם ה-SDLC עצמו נבנה מחדש עבור סוכנים?',
    points: [
      'מה אם אף סוכן לא יכול לכתוב קוד לפני שאדם אישר את הספסיפיקציה?',
      'מה אם כל שגיאת סוכן הפכה למגביל קבוע?',
      'מה אם מהירות היא תוצר של מבנה — לא קיצורי דרך?',
    ],
  },

  // 10. sddThreePillars — הצהרת SDD (הועבר לכאן מאקט 4; מגדיר את המערכת לפני כל שקפי המתודולוגיה)
  {
    type: 'sddThreePillars',
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

  // ── ACT 3 — THE AGENTIC SDLC METHODOLOGY (slides 11–15) ──────────────────────

  // 11. philosophy
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

  // 11. notVibeCoding
  {
    type: 'notVibeCoding',
    title: 'זה לא Vibe Coding',
    subtitle: 'הממשל הוא ההבדל',
    left: {
      label: 'Vibe Coding',
      accent: 'red',
      items: [
        'מפתח בודד שמנחה לפרוטוטיפ',
        'אין מסלול ביקורת',
        "החלטות מתאדות עם הצ'אט",
        'איכות = מזל',
      ],
    },
    right: {
      label: 'פיתוח AI מנוהל',
      accent: 'green',
      items: [
        'ספסיפיקציות, גדרות הגנה, מסלולי ביקורת',
        'נקודות ביקורת אנושיות בכל שער',
        'כל פלט ניתן לאיתור',
        'כל שגיאת סוכן הופכת למקרה בדיקה קבוע',
      ],
    },
    callout: 'ההבדל הוא אחריות.',
  },

  // 12. agentic5Acts — SCROLLABLE
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

  // 13. harness
  {
    type: 'harness',
    title: 'הנדסת גדרות ההגנה',
    subtitle: 'הגנה אוטומטית שמתחזקת עם כל שגיאת סוכן',
    loopSteps: [
      'סוכן פועל',
      'גדרות ההגנה בודקות',
      'שגיאה נתפסת',
      'מקודדת כבדיקה קבועה',
      'גדרות ההגנה גדלות',
    ],
    layers: [
      { icon: '✅', title: 'בדיקות (TDD נאכף)', description: 'אין מימוש ללא בדיקה כושלת. כל שגיאת סוכן הופכת למקרה בדיקה.', accent: 'green' },
      { icon: '🔍', title: 'Linters וניתוח סטטי', description: 'סגנון קוד, דפוסי אבטחה, אנטי-דפוסים נתפסים לפני מיזוג.', accent: 'blue' },
      { icon: '🔷', title: 'מערכות טיפוסים', description: 'טיפוסים מגבילים את מה שסוכנים יכולים לייצר — תופסים שגיאות לפני זמן ריצה.', accent: 'violet' },
      { icon: '⚖️', title: 'אילוצי חוקה', description: 'ערימה, אבטחה, גבולות ארכיטקטורה מוזרקים לכל הקשר סוכן.', accent: 'amber' },
    ],
    callout: 'כל שגיאת סוכן הופכת למקרה בדיקה קבוע. גדרות ההגנה רק הולכות ומתחזקות.',
  },

  // 14. sdlcRoles
  {
    type: 'sdlcRoles',
    title: 'תפקידים מחודשים',
    subtitle: 'אף אחד לא מוחלף. כולם מקודמים.',
    roles: [
      { icon: '🎯', oldRole: 'מנהל מוצר', newRole: 'בעל תוצאות', oneLiner: "בעל ה'מה'; מאשר spec.md", stage: 'שלבים 1, 6', accent: 'blue' },
      { icon: '🏛️', oldRole: 'ארכיטקט / ראש טכנולוגיה', newRole: 'בעל ממשל', oneLiner: 'מגדיר את גדרות ההגנה; חוקר את התכנית', stage: 'שלבים 1–3', accent: 'violet' },
      { icon: '🔬', oldRole: 'מפתח', newRole: 'מתאם פיתוח', oneLiner: 'סוקר PR של סוכנים, מקרי קצה, כותב גדרות הגנה', stage: 'שלבים 4–5', accent: 'teal' },
      { icon: '🤖', oldRole: 'לא קיים', newRole: 'כוח עבודה אוטונומי', oneLiner: 'מנסח את כל הארטיפקטים; מבצע משימות מוגבלות תחת גדרות', stage: 'שלבים 2–7', accent: 'cyan' },
      { icon: '🔭', oldRole: 'SRE / DevOps', newRole: 'שומר תשתיות חכמות', oneLiner: 'שומר על תשתית ריפוי עצמי וטלמטריה של סוכנים', stage: 'שלב 7', accent: 'emerald' },
      { icon: '🎨', oldRole: 'מעצב', newRole: 'מנהל יצירתי', oneLiner: "טעם אנושי, חוויה, מותג — מה ש-AI לא יכול לקודד", stage: 'שלבים 1–5', accent: 'amber' },
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

  // orchestrator
  {
    type: 'orchestrator',
    title: 'בני אדם מתזמנים. סוכנים מבצעים.',
    subtitle: 'אותן ספסיפיקציות. אותן גדרות הגנה. כל מודל.',
    providers: [
      { id: 'claude', name: 'Claude Code', icon: '🟣', accent: 'indigo', orchestratorModel: 'Opus 4.6', agentModel: 'Sonnet 4.6' },
      { id: 'copilot', name: 'GitHub Copilot', icon: '🔵', accent: 'blue', orchestratorModel: 'GPT 5.4', agentModel: 'GPT 5.2' },
      { id: 'gemini', name: 'Gemini', icon: '🟡', accent: 'amber', orchestratorModel: 'Gemini Ultra', agentModel: 'Gemini Pro' },
      { id: 'local', name: 'Continue (Local)', icon: '🟢', accent: 'green', orchestratorModel: 'GPT OSS 120B', agentModel: 'GPT OSS 7B' },
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
  },

  // ── ACT 5 — TOOLING & ADOPTION (slides 19–20) ────────────────────────────────

  // 19. tooling — SCROLLABLE · TABBED COMPARE · PIPELINE · MEMORY
  {
    type: 'tooling',
    scrollable: true,
    kicker: 'אקט 5 · הכלים',
    title: 'להפוך את זה לאמיתי',
    subtitle: 'המתודולוגיה, עם כלים — בחר מסגרת ספסיפיקציה, אכוף את גדרות ההגנה, וסגור את הלולאה מטיקט ל-PR.',
    scrollHint: 'גלול דרך שרשרת הכלים',
    intro: {
      roadmap: [
        { id: '1', label: 'מסגרות ספסיפיקציה', accent: 'teal' },
        { id: '2', label: 'גדרות הגנה', accent: 'violet' },
        { id: '3', label: 'טיקט → PR', accent: 'cyan' },
        { id: '4', label: 'זיכרון ארוך-טווח', accent: 'emerald' },
      ],
    },

    // ── PAGE 1 — SPEC FRAMEWORKS (4 tabs) ──
    specPage: {
      page: '1',
      accent: 'teal',
      label: 'מסגרות ספסיפיקציה',
      eyebrow: 'היכן האמת נכתבת.',
      dimensions: [
        'שער אישור ספסיפיקציה',
        'אכיפת TDD / גדרות הגנה',
        'סיכומי מחזורים / זיכרון',
        'סנכרון ALM וכלים (Jira/Confluence)',
        'אגנוסטי למודל',
        'רישיון / קוד פתוח',
      ],
      frameworks: [
        {
          id: 'spec-kit', glyph: '⚙️', name: 'Spec-Kit', short: 'Spec-Kit', role: 'עמוד השדרה', accent: 'teal',
          tagline: 'הספסיפיקציה במרכז; אין קוד עד שהספסיפיקציה מאושרת.',
          whatItIs: 'המסגרת הפתוחה של GitHub שמציבה ספסיפיקציה קריאת-מכונה במרכז זרימת העבודה ומתנה את המימוש באישור אנושי.',
          bullets: ['spec.md הוא החוזה', 'שער אישור אנושי לפני קוד', 'זרימת עבודה מבוססת-שלבים', 'קוד פתוח, ניטרלי לספק'],
          terminal: [
            { text: '$ specify init && specify spec --from PROJ-421', type: 'command' },
            { text: '✓ spec.md created — awaiting approval', type: 'success' },
            { text: '⛔ implementation blocked: spec.approved = false', type: 'error' },
          ],
          repo: 'github.com/github/spec-kit',
          cells: ['✓ שער אכוף', '~ מוסכמות', '✗', '~ דרך סקריפטים', '✓', '✓ OSS (MIT)'],
        },
        {
          id: 'openspec', glyph: '📐', name: 'OpenSpec', short: 'OpenSpec', role: 'זרימת הצעות', accent: 'teal',
          tagline: 'שינוי-כהצעה: כל דלתא היא ספסיפיקציה נסקרת.',
          whatItIs: 'גישה פתוחה מונחית-ספסיפיקציות שבה כל שינוי נכתב כהצעה ומאושר לפני ביצוע, תוך שמירת היסטוריית כוונות נסקרת.',
          bullets: ['שינוי = הצעה', 'היסטוריית ספסיפיקציות נסקרת', 'קליל, נטיב ל-repo', 'קוד פתוח, ללא מפתחות API'],
          terminal: [
            { text: '$ openspec propose "add waitlist"', type: 'command' },
            { text: '✓ proposal/waitlist.md → review', type: 'success' },
            { text: '✓ approved → ready to implement', type: 'success' },
          ],
          repo: 'openspec.dev',
          cells: ['✓ הצעה → אישור', '~ ברמת ספסיפיקציה', '~ היסטוריית שינויים', '~ דרך סקריפטים', '✓', '✓ OSS'],
        },
        {
          id: 'autospec', glyph: '🧬', name: 'AutoSpec', short: 'AutoSpec', role: 'המאחד', accent: 'teal', home: true,
          tagline: 'שער ספסיפיקציה + גדרות הגנה + זיכרון מחזורים + סנכרון ALM — מסגרת אחת.',
          whatItIs: 'המסגרת שהמצגת הזו עצמה בנויה בה. היא מאחדת את המשמעות: שער הספסיפיקציה, אכיפת TDD/גדרות הגנה, סיכומי מחזורים כזיכרון ארוך-טווח, ומיומנויות שמסנכרנות Jira/TFS ו-Confluence.',
          bullets: ['שער ספסיפיקציה + ספסים מבוססי-תפקיד', 'גדרות הגנה אכופות, לא מוצעות', 'סיכומי מחזורים = זיכרון עמיד', 'מיומנויות: Jira/TFS → ספסיפיקציה → PR', 'כל מודל (ניתוב FinOps)'],
          terminal: [
            { text: '$ autospec cycle start --from PROJ-421', type: 'command' },
            { text: '✓ spec.md gated · guardrails armed', type: 'success' },
            { text: '✓ cycle-12 summary will persist to docs/', type: 'success' },
          ],
          repo: 'github.com/Hundia/autospec',
          cells: ['✓ שער + תפקידים', '✓ גדרות מובנות', '✓ סיכומי מחזורים', '✓ Jira / TFS / Confluence', '✓ כל מודל', '✓ OSS (Hundia/autospec)'],
        },
        {
          id: 'diy', glyph: '✍️', name: 'Write Your Own Spec', short: 'DIY', role: 'הדרך העצמאית', accent: 'teal',
          tagline: 'אין מסגרת? קודד את המשמעת בעצמך.',
          whatItIs: 'אינך צריך מוצר — אתה צריך את המשמעות. constitution.md, תבנית ספסיפיקציה, שער אישור ב-CI וגדרות pre-commit משחזרים את רוב הערך.',
          bullets: ['constitution.md ככללים שלך', 'תבנית ספסיפיקציה + שער אישור PR', 'גדרות הגנה דרך CI / pre-commit', 'שליטה מלאה, תחזוקה מלאה'],
          terminal: [
            { text: '$ mkdir specs && touch constitution.md spec-template.md', type: 'command' },
            { text: '# CI: block merge unless spec.approved label', type: 'info' },
            { text: '# pre-commit: tests + lint + types = guardrails', type: 'info' },
          ],
          repo: 'your repo',
          cells: ['~ אתה מגדיר', '~ hooks עצמאיים', '~ בעצמך', '~ אתה מחבר', '✓', 'n/a — repo שלך'],
        },
      ],
    },

    // ── PAGE 2 — SUPERPOWERS / GUARDRAILS (2 tabs) ──
    guardPage: {
      page: '2',
      accent: 'violet',
      label: 'משמעת ביצוע',
      eyebrow: 'היכן האמת מוגנת.',
      thesis: 'גדרות ההגנה הן ההגנה.',
      dimensions: [
        'אין קוד לפני בדיקה כושלת',
        'אכיפה אוטומטית (לא המלצה)',
        'מתחבר ללולאת הסוכן',
        'מקודד כל תיקון כבדיקה',
        'עלות הקמה',
      ],
      frameworks: [
        {
          id: 'superpowers', glyph: '🦸', name: 'Superpowers', short: 'Superpowers', role: 'אכיפת גדרות הגנה', accent: 'violet',
          tagline: 'TDD קפדני לסוכנים — אין מימוש לפני שקיימת בדיקה כושלת.',
          whatItIs: 'שכבת משמעת-ביצוע שמנהלת את התנהגות הסוכן בזמן המימוש: אסור לסוכנים לכתוב קוד מימוש עד שקיימת בדיקה כושלת.',
          bullets: ['TDD קפדני, אכוף על הסוכן', 'חוסם מימוש ללא בדיקה אדומה', 'מתחבר ללולאת המחזור', 'הופך כל באג לבדיקה קבועה'],
          terminal: [
            { text: '$ superpowers cycle --task tasks.md#42', type: 'command' },
            { text: '⛔ No implementation without failing test', type: 'error' },
            { text: '✓ Test fails → OK to implement now', type: 'success' },
          ],
          repo: 'github.com/obra/superpowers',
          cells: ['✓ אכוף', '✓ חסימה קשיחה', '✓ hooks למחזור', '✓ בדיקות רגרסיה', '~ התקנה + הגדרה'],
        },
        {
          id: 'diy-guard', glyph: '🛠️', name: 'Write Your Own Guardrails', short: 'DIY', role: 'הדרך העצמאית', accent: 'violet',
          tagline: 'CI + pre-commit יכולים לאכוף את אותה משמעת שאתה בונה בעצמך.',
          whatItIs: 'שחזר את המשמעת עם כלים שכבר ברשותך: hooks של pre-commit, שער CI שנכשל על בדיקות חסרות, וחוזה פרומפט לסוכן שאוסר קוד לא-נבדק.',
          bullets: ['pre-commit: בדיקות + lint + types', 'שער CI נכשל על ירידת כיסוי', 'חוזה פרומפט: בדיקה אדומה תחילה', 'שליטה מלאה, אתה מתחזק'],
          terminal: [
            { text: '$ pre-commit install', type: 'command' },
            { text: '# CI: fail if new code lacks a failing-then-passing test', type: 'info' },
            { text: '✓ guardrails enforced in your pipeline', type: 'success' },
          ],
          repo: 'your repo',
          cells: ['~ אם תחבר', '~ דרך CI בלבד', '~ ידני', '~ אם ממושמע', '~ מאמץ עצמאי'],
        },
      ],
    },

    // ── PAGE 3 — TICKET → PR PIPELINE ──
    pipelinePage: {
      page: '3',
      accent: 'cyan',
      label: 'האינטגרציה המכרעת',
      eyebrow: 'היכן זה מתחבר לעבודה שאתה כבר עוקב אחריה.',
      headline: 'מיומנות אחת. טיקט → PR ממוזג.',
      source: { id: 'PROJ-421', title: 'הוסף רשימת המתנה להזמנות', status: 'בתהליך' },
      stages: [
        { n: '1', verb: 'משיכה', sub: 'דרישה → הקשר' },
        { n: '2', verb: 'ספסיפיקציה', sub: 'יצירת spec.md, המתנה לשער' },
        { n: '3', verb: 'ביצוע', sub: 'הסוכן מממש ב-worktree' },
        { n: '4', verb: 'בדיקה', sub: 'גדרות: TDD, lint, types' },
        { n: '5', verb: 'פתיחת PR', sub: 'ענף נדחף, Jira מעודכן' },
      ],
      terminal: [
        { text: '$ autospec skill run jira-to-pr --ticket PROJ-421', type: 'command' },
        { text: '→ pull       PROJ-421 "Add waitlist to bookings"', type: 'info' },
        { text: '→ spec       spec.md drafted · gate: approved ✓', type: 'info' },
        { text: '→ execute    agent implementing in worktree-a…', type: 'info' },
        { text: '→ test       12 passed · lint ✓ · types ✓', type: 'info' },
        { text: '→ pr         opened #318 → main · PROJ-421 → In Review ✓', type: 'info' },
        { text: '✓ ticket → merged PR, fully traceable', type: 'success' },
      ],
      callout: 'מיומנות אחת סוגרת את הלולאה — וכותבת את הסיכום שלה בחזרה לזיכרון.',
    },

    // ── PAGE 4 — LONG-TERM MEMORY ──
    memoryPage: {
      page: '4',
      accent: 'emerald',
      label: 'הזיכרון שמעולם לא נתת לו',
      eyebrow: 'היכן כל החלטה נזכרת.',
      headline: 'Confluence + docs/ = זיכרון ארוך-טווח.',
      syncBadge: 'Confluence ⇄ docs/',
      bullets: [
        'הסוכנים קוראים את זה לפני שהם כותבים — ארכיטקטורה, גדרות הגנה והחלטות עבר הופכים לאילוצים חיים.',
        'זה גדל בכל מחזור — כל סיכום מחזור מוסיף תיקיות חדשות ורשומות החלטה.',
        'שום דבר לא נגזר מחדש — הזיכרון שמעולם לא נתת לו, סוף סוף ניתן.',
      ],
      tree: [
        { name: 'docs/', depth: 0, icon: '📁' },
        { name: 'architecture/', depth: 1, icon: '📁', files: ['01-system.md', '02-decisions.md'] },
        { name: 'guardrails/', depth: 1, icon: '📁', files: ['01-tdd.md', '02-security.md'] },
        { name: 'flows/', depth: 1, icon: '📁', files: ['01-ticket-to-pr.md'] },
        { name: 'cycles/', depth: 1, icon: '📁', files: ['cycle-10/', 'cycle-11/', 'cycle-12/ ← new'] },
      ],
      treeFooter: '+סיכום מחזור אחד נכתב בחזרה, בכל לולאה',
      callout: 'הספסיפיקציה היא האמת, גדרות ההגנה הן ההגנה, והמסמכים הם הזיכרון — שום הקשר לא אובד.',
    },

    // ── CLOSING HANDOFF ──
    closing: 'אלה הכלים שהופכים את המתודולוגיה לאמיתית. הבא: איך לאמץ אותם — יסוד → הרחבה → אופטימיזציה.',
  },

  // 20. adoption — SCROLLABLE
  {
    type: 'adoption',
    scrollable: true,
    title: 'מפת דרכים לאימוץ',
    subtitle: 'שלושה שלבים של יתרון מצטבר',
    phases: [
      {
        number: '01',
        emoji: '🌱',
        name: 'יסודות',
        timeline: 'שבועות 1–6',
        win: 'הוכח שזה עובד — על צוות אחד, ללא כל סיכון',
        milestone: 'ה-PR הראשון שנוצר על ידי סוכן ממוזג ל-main — נסקר, ירוק, נשלח',
        accent: 'emerald',
        bullets: [
          'סנדבוקסים מבודדים, טלמטריה ושערי אבטחה — אפס השפעה על פרודקשן.',
          'פיילוט של Spec-Kit על צוות אחד, מוכן, עם פיצ\'ר מוגדר היטב.',
          'בנה את גדרות ההגנה: בדיקות, linters, טיפוסים — הגנה אוטומטית מהיום הראשון.',
          'הגדר גדרות סוכן: מה הסוכנים יכולים ולא יכולים לגעת בו.',
          '⚠ שריר ממשל: למד את הצוות ש-HITL הוא נקודת ביקורת חובה, לא חותמת גומי.',
        ],
      },
      {
        number: '02',
        emoji: '🔗',
        name: 'התרחבות',
        timeline: 'חודשים 2–5',
        win: 'כל צוות מרגיש את זה — סוכנים הופכים לחלק מזרימת העבודה',
        milestone: '80% מה-PR-ים נסקרים על ידי AI לפני שבן אדם פותח אותם',
        accent: 'blue',
        bullets: [
          'סקירת קוד AI לכל ה-PR-ים, בכל הארגון — מדוד שיעורי בריחת פגמים, תעד הצלחות.',
          'חבר Jira + Confluence כרכזי הקשר: ספסיפיקציות מסונכרנות אוטומטית, אפס דוחות סטטוס ידניים.',
          'מחזורי תיקון עצמי ראשונים רצים אוטומטית.',
          '⚠ אמן מפתחים ב-prompting, ניטור AI ואימות — שינוי המיומנות חשוב לא פחות משינוי הכלים.',
        ],
      },
      {
        number: '03',
        emoji: '🚀',
        name: 'אופטימיזציה',
        timeline: 'חודש 6+',
        win: 'תשואות מצטברות — המערכת מואצת ככל שמשתמשים בה יותר',
        milestone: 'צוותי חלוצים שולחים פיצ\'רים בשעות, לא שבועות — PwC 2026',
        accent: 'violet',
        bullets: [
          'קצב מחזורים מלא בכל הצוותים — פיצ\'רים מוגבלים מ-spec לשליחה בשעות.',
          'גדרות ההגנה רק הולכות ומתחזקות: כל שגיאה מקודדת, כל מקרה קצה מונצח כבדיקה.',
          'השקע מחדש את רווחי המהירות בבעיות קשות יותר — עבודה יצירתית שרק בני אדם יכולים לעשות.',
          'מדוד ופרסם ROI מצטבר: זמן מחזור, בריחת פגמים, שביעות רצון מפתחים.',
        ],
      },
    ],
    metricsTitle: 'מה למדוד',
    metrics: [
      {
        icon: '⚡',
        title: 'מהירות',
        accent: 'blue',
        items: ['זמן מחזור', 'זמן-לשוק', 'תדירות פריסה'],
      },
      {
        icon: '🛡',
        title: 'איכות',
        accent: 'green',
        items: ['שיעור בריחת פגמים', 'MTTR', 'כיסוי רגרסיה'],
      },
      {
        icon: '🔗',
        title: 'סקאלה',
        accent: 'violet',
        items: ['PR-ים של סוכנים לשבוע', '% כיסוי גדרות הגנה', 'יחס מחזורים מקבילים'],
      },
      {
        icon: '👥',
        title: 'אנשים',
        accent: 'amber',
        items: ['שביעות רצון מפתחים', 'זמן הכשרה', 'זמן סקירת HITL'],
      },
    ],
    closingQuote: 'הערך עובר מכתיבת קוד לאימות ואישור קוד. המיומנות המרכזית הופכת פחות לגבי תחביר ויותר לגבי כוונה.',
    closingSource: 'Amplify Partners',
  },

  // ── ACT 6 — CLOSE (slides 21–22) ──────────────────────────────────────────────

  // 21. closing
  {
    type: 'closing',
    title: 'התחל את המחזור הראשון שלך',
    install: 'git clone https://github.com/Hundia/autospec my-project',
    commands: [
      { cmd: 'בחר פיצ\'ר מוגבל לא-קריטי', desc: 'הפיילוט שלך' },
      { cmd: 'כתוב spec.md וקבל אישור', desc: 'השער קודם' },
      { cmd: 'תן ל-AI לבצע אותו תחת גדרות ההגנה', desc: 'TDD נאכף, אימות גדרות הגנה' },
      { cmd: '/cycle-close', desc: 'הסיכום הוא הזיכרון' },
    ],
    links: {
      github: 'github.com/Hundia/autospec',
      docs: 'hundia.github.io/autospec',
    },
    tagline: 'מכוונה להיגוי.',
  },

  // 22. finalTagline
  {
    type: 'finalTagline',
    title: 'The Agentic SDLC',
    tagline: 'הספסיפיקציה היא האמת. גדרות ההגנה הן המגן. האדם הוא השופט.',
  },
];
