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
      { title: "פיצ'רים מלאים", description: 'מודולים שלמים בפרומפט אחד' },
      { title: 'כל המחסנית', description: 'Frontend + Backend + DB יחד' },
      { title: 'אוטונומי', description: 'AI מקבל החלטות מימוש' },
    ],
    danger: [
      { title: 'אין זיכרון', description: 'כל סשן מתחיל מאפס' },
      { title: 'סחיפת הקשר', description: 'שיחות ארוכות משחיתות החלטות' },
      { title: 'אפס תיעוד', description: "לוגי צ'אט אינם תיעוד" },
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
        { role: 'user', turn: 25, text: "שאילתת פיד הפעילות מאטה עם כל ה-joins. יש רעיונות?" },
        { role: 'ai', turn: 25, text: "לפיד הפעילות, MongoDB יהיה הרבה יותר מתאים — מסמכים ממפים בצורה טבעית לאירועים. אוסיף חיבור Mongo לאוסף הזה.", flag: 'drift' },
        { role: 'user', turn: 50, text: 'פיד הפעילות שבור. אני מקבל שגיאות אימות סכמה בכל כתיבה.' },
        { role: 'ai', turn: 50, text: 'אני רואה את הבעיה — מודלי Prisma שלך לא כוללים קשר activityFeed. אוסיף אותו ל-schema.prisma ואריץ migration.', flag: 'contradiction' },
        { role: 'user', turn: 100, text: 'עכשיו אני מקבל TypeError: Cannot read properties of undefined בכל קריאה לבסיס הנתונים.' },
        { role: 'ai', turn: 100, text: "הבעיה היא שהקליינט של Prisma לא מאותחל. תן לי להוסיף Mongoose גם לטבלאות הרלציוניות ולאחד הכל תחת ODM אחד.", flag: 'poisoned' },
        { role: 'user', turn: 100, text: "אתה פשוט לא מבין... אתה גרוע. אני לעולם לא משתמש בפיתוח אג'נטי שוב, בזבוז של הזמן שלי!", flag: 'frustrated' },
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
      items: ['הקשר AI פעיל', 'AI מכיר את כל המוסכמות', "מתקדמים מהר, שולחים פיצ'רים"],
    },
    daySixty: {
      title: 'יום 60',
      items: ["לוגי צ'אט נמחקו או מיושנים", 'אפס הקשר לסשנים חדשים', '"למה זה נבנה כך?"'],
    },
    cost: { hours: 40, label: 'שעות אבודות להנדסה לאחור ברבעון' },
  },

  // 7. breakingPoint
  {
    type: 'breakingPoint',
    title: 'נקודת השבירה',
    subtitle: 'ככל שאתה בונה מהר יותר, כך אתה מאבד מהר יותר',
    buildItems: ['6 סוכני AI', 'יותר מ-200 קבצים שנוצרו', "50 סשני צ'אט"],
    debtItems: ['0 מסמכים שנכתבו', '0 החלטות שתועדו', '0 מסירה אפשרית'],
    stats: [
      { value: '73%', label: 'מפרויקטי AI שננטשו תוך 6 חודשים' },
      { value: '40 שעות', label: 'הוצאו להבנת קוד מחדש ברבעון' },
      { value: '$0', label: "ערך לוגי הצ'אט לאחר סיום הסשן" },
    ],
    bottomLine: 'פיתוח אג\'נטי ללא ממשל הוא חוב טכני במהירות AI.',
  },

  // ── ACT 2 — TURNING POINT (slides 8–9) ────────────────────────────────────────

  // 8. sddCostOfChaos
  {
    type: 'sddCostOfChaos',
    title: 'עלות היעדר ספסיפיקציות',
    subtitle: 'AI אג\'נטי ללא ספסיפיקציות הוא נטל, לא נכס',
    columns: {
      left: {
        label: "עם שיחת צ'אט",
        color: 'red',
        items: [
          { icon: '💬', text: 'ההקשר מתדרדר אחרי תור 30' },
          { icon: '🔄', text: 'כל סשן מתחיל מאפס' },
          { icon: '❌', text: "החלטות אובדות כשהצ'אט נגמר" },
          { icon: '🚫', text: 'אף סוכן לא יכול להמשיך את עבודתך' },
        ],
      },
      right: {
        label: 'עם ספסיפיקציות',
        color: 'green',
        items: [
          { icon: '📐', text: 'החלטות שמורות ב-specs/' },
          { icon: '🔗', text: 'כל סשן יורש הקשר מלא' },
          { icon: '✅', text: 'בחירות שרדות לנצח ב-docs/' },
          { icon: '🤖', text: 'כל סוכן יכול להמשיך בצורה חלקה' },
        ],
      },
    },
    callout: 'ספסיפיקציות הן הזיכרון שה-AI לא קיבל מעולם.',
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

  // ── ACT 3 — THE AGENTIC SDLC METHODOLOGY (slides 10–14) ──────────────────────

  // 10. philosophy
  {
    type: 'philosophy',
    title: 'הפילוסופיה המרכזית',
    subtitle: 'חמש רעיונות שמשנות הכל',
    cards: [
      {
        icon: '🎯',
        title: 'בולטים, לא ספרינטים',
        description: 'בולט הוא מחזור פיצ\'ר תחום וניתן לבדיקה עצמאית — ספסיפיקציה מאושרת, ביצוע סוכנים, אימות סבכה. נמדד בשעות או ימים, לא שבועות. מהירות היא תוצר של מבנה.',
        accent: 'blue',
      },
      {
        icon: '👁',
        title: 'בני אדם כמתזמנים',
        description: 'מהנדסים עוברים ממבצעים (כותבי קוד) למתזמנים — מעצבי ספסיפיקציות, סוקרי פלט סוכנים, מתחזקי הסבכה.',
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
        title: 'הסבכה היא המגן',
        description: 'בדיקות, linters, טיפוסים, אילוצים שסוכנים לא יכולים להפר. כל שגיאת סוכן מקודדת כמקרה בדיקה קבוע.',
        accent: 'emerald',
      },
      {
        icon: '📄',
        title: 'הספסיפיקציה היא האמת',
        description: 'אין קוד לפני אישור הספסיפיקציה. הספסיפיקציה מנוהלת בגרסאות ומעודכנת לפני שינויי קוד. מסיים ריקבון ספסיפיקציות.',
        accent: 'amber',
      },
    ],
    quote: 'הספסיפיקציה היא האמת, הסבכה היא המגן, והאדם הוא השופט.',
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
      label: 'SDLC אג\'נטי עם ממשל',
      accent: 'green',
      items: [
        'ספסיפיקציות, סבכות, מסלולי ביקורת',
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
    closingCallout: 'גלה. יישר. תכנן. בצע. בדוק. זכור. נווט. שבע משמעות שמקמצות את השעון — מבלי לדלג על שלב אחד.',
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
          'אילוצים אלה מהווים את בסיס הסבכה — גבולות קשיחים מוזרקים לכל הקשר סוכן, הופכים הצעות לא-תואמות לבלתי-אפשריות מכנית.',
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
          'המשימות מנותקות לפי עיצוב — מאפשרות ביצוע מקבילי אג\'נטי מהרגע הראשון.',
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
          'ביצוע אג\'נטי מקבילי כאשר המשימות מנותקות — מספר סוכנים ב-worktrees מבודדים מטפלים בעבודה עצמאית בו-זמנית.',
          'כל מימוש מבוסס על קבצי Specs .md המוגדרים למשימה. אין יצירה חופשית.',
          'כל קוד שנוצר על ידי סוכן נסקר על ידי המפתח HITL לפני מיזוג — ללא יוצא מן הכלל.',
          'TDD מאכף: אין מימוש לפני בדיקה נכשלת. כל שגיאת סוכן הופכת לבדיקת harness קבועה — היא לא יכולה לחזור.',
        ],
        output: 'קוד ממוזג וסקור HITL',
      },
      {
        number: '5',
        name: 'בדיקות ואיכות',
        tagline: 'כל תרחיש Feature מאומת — ומאוחסן לצמיתות בסבכה.',
        stageRef: 'שלב 5',
        owners: ['ראש צוות QA'],
        hero: false,
        accent: 'cyan',
        bullets: [
          'ראש צוות QA מממש וגם מריץ בדיקות מערכת מבוססות תרחישים בקבצי Feature Specs .md.',
          'כל בדיקה חדשה מתווספת לרגרסיה — חבילת רגרסיה מלאה רצה על כל סגירת בולט.',
          'אף פיצ\'ר לא נחשב שנשלח עד שכל תרחישי Feature Spec עוברים והרגרסיה ירוקה.',
        ],
        output: 'חבילת בדיקות ירוקת-רגרסיה + תוצאות בדיקות מערכת',
      },
      {
        number: '6',
        name: 'סיכום פיתוח',
        tagline: 'הזיכרון שהופך כל בולט הבא למהיר יותר מקודמו.',
        stageRef: 'שלב 6',
        owners: ['מנהל מוצר (HITL)', 'ראש צוות פיתוח (HITL)', 'ראש צוות QA (HITL)'],
        hero: true,
        accent: 'teal',
        bullets: [
          'כל בולט נסגר עם סיכום פיתוח: מה נבנה, מה השתנה, מה הוחלט — כולל הנמקה מאחורי החלטות טכניות מרכזיות.',
          'הנמקה מוקלטת: מדוע גישה נבחרה, חלופות שנשקלו, אילוצים שהתקלו בהם.',
          'כל ראשי הצוות משתתפים כ-HITL: מנהל מוצר ← ראש צוות פיתוח ← ראש צוות QA — כל אחד מאמת את התחום שלו.',
          'הסוכן הבא קורא את הסיכום ויורש הקשר מלא תוך 30 שניות — כולל שרשרת ההחלטות. אפס הנדסה לאחור.',
        ],
        output: 'bolts/bolt-X/summary.md (עם לוג נמקה מוטמע)',
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
          'סטייה מכוונת ה-spec מפעילה התראות אוטומטיות או פותחת בולט תיקון עצמי אוטומטית.',
          'סוכני SRE מציפים אנומליות בצורה יזומה; GenAI כותב סיכומי אירועים הקשורים לסעיף ה-spec הרלוונטי.',
        ],
        output: 'מערכת עצמית-היגוי ומיושרת ל-Spec בפרודקשן',
      },
    ],
  },

  // 13. harness
  {
    type: 'harness',
    title: 'הנדסת הסבכה',
    subtitle: 'המגביל המכני שסוכנים לא יכולים להפר',
    loopSteps: [
      'סוכן פועל',
      'הסבכה בודקת',
      'שגיאה נתפסת',
      'מקודדת כבדיקה קבועה',
      'הסבכה גדלה',
    ],
    layers: [
      { icon: '✅', title: 'בדיקות (TDD נאכף)', description: 'אין מימוש ללא בדיקה כושלת. כל שגיאת סוכן הופכת למקרה בדיקה.', accent: 'green' },
      { icon: '🔍', title: 'Linters וניתוח סטטי', description: 'סגנון קוד, דפוסי אבטחה, אנטי-דפוסים נתפסים לפני מיזוג.', accent: 'blue' },
      { icon: '🔷', title: 'מערכות טיפוסים', description: 'טיפוסים מגבילים את מה שסוכנים יכולים לייצר — תופסים שגיאות לפני זמן ריצה.', accent: 'violet' },
      { icon: '⚖️', title: 'אילוצי חוקה', description: 'ערימה, אבטחה, גבולות ארכיטקטורה מוזרקים לכל הקשר סוכן.', accent: 'amber' },
    ],
    callout: 'כל שגיאת סוכן הופכת למקרה בדיקה קבוע. הסבכה רק הולכת ומחזיקה יותר.',
  },

  // 14. sdlcRoles
  {
    type: 'sdlcRoles',
    title: 'תפקידים מחודשים',
    subtitle: 'אף אחד לא מוחלף. כולם מקודמים.',
    roles: [
      { icon: '🎯', oldRole: 'מנהל מוצר', newRole: 'בעל תוצאות', oneLiner: "בעל ה'מה'; מאשר spec.md", stage: 'שלבים 1, 6', accent: 'blue' },
      { icon: '🏛️', oldRole: 'ארכיטקט / ראש טכנולוגיה', newRole: 'בעל ממשל', oneLiner: 'מגדיר את הסבכה; חוקר את התכנית', stage: 'שלבים 1–3', accent: 'violet' },
      { icon: '🔬', oldRole: 'מפתח', newRole: 'מתאם פיתוח', oneLiner: 'סוקר PR של סוכנים, מקרי קצה, כותב סבכה', stage: 'שלבים 4–5', accent: 'teal' },
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

  // ── ACT 4 — IMPLEMENTED WITH SPEC-DRIVEN DEVELOPMENT (slides 15–18) ─────────

  // 15. sddThreePillars
  {
    type: 'sddThreePillars',
    title: 'SDD: מערכת ההפעלה של ה-SDLC האג\'נטי',
    subtitle: 'המתודולוגיה פועלת על שלושה ארטיפקטים',
    pillars: [
      {
        number: '01',
        title: 'ספסיפיקציות כקוד',
        description: 'spec.md והחוקה חיים ב-git. פלט שלבים 1–2, קריא על ידי כל סוכן, מאושר על ידי בני אדם.',
        artifact: 'specs/*.md',
        icon: '📐',
        color: 'teal',
      },
      {
        number: '02',
        title: 'סיכומי בולטים',
        description: 'כל בולט נסגר עם סיכום: מה נבנה, מה השתנה, מה הוחלט. הסוכן הבא מתחיל עם הקשר מלא.',
        artifact: 'bolts/bolt-X/summary.md',
        icon: '📋',
        color: 'emerald',
      },
      {
        number: '03',
        title: 'תיעוד חי',
        description: 'מסמכים גדלים עם כל משימה; מסמכי החוקה והארכיטקטורה מגבילים סוכנים עתידיים.',
        artifact: 'docs/ (גדל בכל בולט)',
        icon: '📖',
        color: 'cyan',
      },
    ],
  },

  // 16. orchestrator
  {
    type: 'orchestrator',
    title: 'בני אדם מתזמנים. סוכנים מבצעים.',
    subtitle: 'אותן ספסיפיקציות. אותה סבכה. כל מודל.',
    providers: [
      { id: 'claude', name: 'Claude Code', icon: '🟣', accent: 'indigo', orchestratorModel: 'Opus 4.6', agentModel: 'Sonnet 4.6' },
      { id: 'copilot', name: 'GitHub Copilot', icon: '🔵', accent: 'blue', orchestratorModel: 'GPT 5.4', agentModel: 'GPT 5.2' },
      { id: 'gemini', name: 'Gemini', icon: '🟡', accent: 'amber', orchestratorModel: 'Gemini Ultra', agentModel: 'Gemini Pro' },
      { id: 'local', name: 'Continue (Local)', icon: '🟢', accent: 'green', orchestratorModel: 'GPT OSS 120B', agentModel: 'GPT OSS 7B' },
    ],
    orchestrator: {
      roleLabel: 'בעל ממשל',
      tasks: ['כותב ברחצי בולטים', 'מוליד סוכנים מקבילים', 'מסדר לפי גרף תלות', 'סוקר תוצאות וממזג'],
    },
    agents: [
      { roleLabel: 'סוכן א', task: 'כרטיסי Backend ב-worktree-a' },
      { roleLabel: 'סוכן ב', task: 'כרטיסי Frontend ב-worktree-b' },
      { roleLabel: 'סוכן ג', task: 'מסמכים ותצורה ב-worktree-c' },
    ],
    benefits: ['הקשר ראשי נקי', 'ביצוע מקבילי', 'עצי עבודה מבודדים'],
    callout: 'אותן ספסיפיקציות. אותה סבכה. כל מודל.',
  },

  // ── ACT 5 — TOOLING & ADOPTION (slides 19–20) ────────────────────────────────

  // 19. tooling
  {
    type: 'tooling',
    title: 'שרשרת הכלים',
    subtitle: 'כל כלי אוכף משמעת אחת',
    tools: [
      {
        icon: '⚙️',
        title: 'Spec-Kit',
        subtitle: 'עמוד השדרה של זרימת העבודה · github.com/github/spec-kit (2025, OSS)',
        description: 'מציב את הספסיפיקציה במרכז ההנדסה. סוכנים לא יכולים להתחיל לקודד עד שבני אדם מסמנים את הספסיפיקציה כמאושרת.',
        accent: 'teal',
        terminal: [
          { text: '$ spec-kit gen spec --from PROJ-421', type: 'command' },
          { text: '✓ spec.md נוצר — ממתין לאישור מנהל מוצר', type: 'success' },
          { text: '⛔ קידוד חסום עד: spec.approved = true', type: 'error' },
        ],
        valueTag: 'מסיים vibe coding — מאלץ כוונה מתועדת.',
      },
      {
        icon: '🦸',
        title: 'Superpowers',
        subtitle: 'משמעת הביצוע · אכיפת הסבכה',
        description: 'מכתיב את התנהגות הסוכן בזמן המימוש. TDD קפדני: אסור לסוכנים לכתוב קוד מימוש לפני שקיימת בדיקה כושלת.',
        accent: 'violet',
        terminal: [
          { text: '$ superpowers bolt --task tasks.md#42', type: 'command' },
          { text: '⛔ אין מימוש ללא בדיקה כושלת', type: 'error' },
          { text: '✓ בדיקה כושלת → OK למימוש כעת', type: 'success' },
        ],
        valueTag: 'אוכף הנדסת סבכה אוטומטית.',
      },
      {
        icon: '📋',
        title: 'Jira כרכז הקשר',
        subtitle: 'ALM · שכבת נראות',
        description: 'כש-spec.md או plan.md משתנים ב-repo, סוכנים מסנכרנים סטטוס ל-Epic ב-Jira אוטומטית — ללא דוחות סטטוס ידניים.',
        accent: 'blue',
        terminal: [
          { text: 'spec.md עודכן → סינכרון סוכן', type: 'command' },
          { text: '→ PROJ-421: סטטוס → "בתכנון"', type: 'info' },
          { text: '✓ בעלי עניין לא-טכניים מעודכנים', type: 'success' },
        ],
        valueTag: 'נראות ארגונית ללא תקורה ידנית.',
      },
      {
        icon: '📖',
        title: 'Confluence כזיכרון ארוך-טווח',
        subtitle: 'ALM · זיכרון ארוך-טווח',
        description: 'סוכנים קוראים מסמכי ארכיטקטורה כדי לשמור על תאימות הקוד — ידע ארגוני מצטבר מגביל את התנהגות הסוכנים.',
        accent: 'amber',
        terminal: [
          { text: 'agent context fetch --source confluence', type: 'command' },
          { text: '→ טוען: arch-decisions.md, security-standards.md', type: 'info' },
          { text: '✓ 14 אילוצים הוזרקו לסבכה', type: 'success' },
        ],
        valueTag: 'מקור אמת ב-repo, נראות ב-Confluence.',
      },
    ],
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
          'בנה את הסבכה: בדיקות, linters, טיפוסים — המגבילים המכניים הראשונים שלך.',
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
          'סוכני אובזרווביליות בפרודקשן; בולטי התיקון העצמי הראשונים רצים אוטומטית.',
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
          'קצב בולטים מלא בכל הצוותים — פיצ\'רים מוגבלים מ-spec לשליחה בשעות.',
          'הסבכה רק הולכת ומחזיקה יותר: כל שגיאה מקודדת, כל מקרה קצה מונצח כבדיקה.',
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
        items: ['זמן מחזור בולט', 'זמן-לשוק', 'תדירות פריסה'],
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
        items: ['PR-ים של סוכנים לשבוע', '% כיסוי harness', 'יחס בולטים מקבילים'],
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
    title: 'התחל את הבולט הראשון שלך',
    install: 'git clone https://github.com/Hundia/autospec my-project',
    commands: [
      { cmd: 'בחר פיצ\'ר מוגבל לא-קריטי', desc: 'הפיילוט שלך' },
      { cmd: 'כתוב spec.md וקבל אישור', desc: 'השער קודם' },
      { cmd: 'תן לסוכנים לממש אותו תחת הסבכה', desc: 'TDD נאכף, סנדבוקס' },
      { cmd: '/bolt-close', desc: 'הסיכום הוא הזיכרון' },
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
    tagline: 'הספסיפיקציה היא האמת. הסבכה היא המגן. האדם הוא השופט.',
  },
];
