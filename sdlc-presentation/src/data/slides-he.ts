export const slidesHE = [
  // ── ACT 1 — THE PROBLEM (slides 1–7) ────────────────────────────────────────

  // 1. title
  {
    type: 'title',
    title: 'The Agentic SDLC',
    subtitle: 'פיתוח מונחה-ספסיפיקציות בסקאלה ארגונית',
    tagline: 'סוכנים מבצעים. בני אדם מנהלים.',
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
    subtitle: 'חמש מעשות. לולאה אחת שלמה. אף הקשר לא אובד.',
    closingCallout: 'הצוות שמנהל לפני שמפתח שולח מהר יותר. כל בולט נסגר עם זיכרון — וכל זיכרון הופך את הבולט הבא למהיר יותר.',
    acts: [
      {
        number: 'I',
        name: 'SPECIFY',
        tagline: 'לפני שנכתבת שורת קוד אחת — האמת כבר כתובה.',
        stageRef: 'שלבים 1–2',
        owners: ['בעל המוצר', 'ארכיטקט'],
        hero: false,
        accent: 'blue',
        bullets: [
          'spec.md מגדיר את הבעיה בלבד — לא את המימוש. GenAI הופך קלטים לא מובנים לדרישות ברורות ומאושרות.',
          'constitution.md נועל את ה-stack הטכנולוגי, פרוטוקולי האבטחה וסטנדרטי הארכיטקטורה — החוקים שהסוכנים לא יכולים לשבור.',
          'אף סוכן לא רשאי להתחיל מימוש לפני שבעל המוצר אישר רשמית את ה-spec.',
          'נגד ריקבון מפרט: spec.md נשמר בגרסאות ומתעדכן לפני שינויי קוד. מחסל סחף הקשר מהמקור.',
        ],
        output: 'spec.md + constitution.md',
      },
      {
        number: 'II',
        name: 'ARCHITECT',
        tagline: 'מפת הדרכים שהסוכנים לא יכולים לסטות ממנה.',
        stageRef: 'שלב 3',
        owners: ['ארכיטקט', 'ראש צוות פיתוח'],
        hero: false,
        accent: 'emerald',
        bullets: [
          'סוכנים מייצרים plan.md (אסטרטגיה טכנית) ו-tasks.md (יחידות עדינות ובדיקות עצמאיות).',
          'מהנדסים בכירים חוקרים את התוכנית — לא כותבים אותה — עם מיקוד על אילוצי מורשת, אבטחה, רדיוס נפיצה.',
          'ראש הצוות מאשר את מפת המימוש לפני שרץ כל קוד.',
          'כל משימה בדיקה עצמאית — זה מה שהופך בולטים לאפשריים: שעות, לא שבועות.',
        ],
        output: 'plan.md + tasks.md',
      },
      {
        number: 'III',
        name: 'BOLT',
        tagline: 'סוכנים מבצעים בשעות תחת מחסומים מכניים.',
        stageRef: 'שלבים 4–5',
        owners: ['מפתח (HITL)', 'מפתח QA (HITL)'],
        hero: true,
        accent: 'indigo',
        bullets: [
          'TDD מאכף: אין מימוש לפני שקיים בדיקה נכשלת. סוכנים רצים ב-worktrees מבודדים ומאובטחים.',
          'כל שגיאת סוכן מקודדת כבדיקת harness קבועה — היא לא יכולה לחזור.',
          'מפתח = מנצח איכות: סוקר PR-ים של סוכנים, שומר על ה-harness, מגן על מקרי קצה.',
          'סוכני QA בונים חבילות E2E מיושרות לקריטריוני הקבלה של ה-spec. סקירת AI מניעה 38.7% מהתיקונים האמיתיים.',
          'ביצוע מקבילי: משימות עצמאיות רצות בו-זמנית ב-worktrees מבודדים.',
        ],
        output: 'קוד ממוזג, נבדק ומאומת',
      },
      {
        number: 'IV',
        name: 'REMEMBER',
        tagline: 'הזיכרון שהופך כל בולט הבא למהיר יותר מקודמו.',
        stageRef: 'שלב 6',
        owners: ['בעל המוצר (HITL)', 'ראש צוות פיתוח (HITL)', 'ראש QA (HITL)'],
        hero: true,
        accent: 'teal',
        bullets: [
          'כל בולט נסגר עם סיכום: מה נבנה, מה השתנה, מה הוחלט.',
          'הערות שחרור, מסמכים מקושרים, קבצים שהשתנו, commit סגירה — הכל בארטיפקט אחד.',
          'הסוכן הבא קורא את הסיכום ויורש הקשר מלא תוך 30 שניות. אפס הנדסה לאחור.',
          'כל ספק, כל סשן, כל חבר צוות — ממשיכים בדיוק מאיפה שהפסקתם.',
        ],
        output: 'bolts/bolt-X/summary.md',
      },
      {
        number: 'V',
        name: 'STEER',
        tagline: 'המערכת שמתקנת את עצמה בחזרה ל-Spec.',
        stageRef: 'שלב 7',
        owners: ['SRE / DevOps'],
        hero: false,
        accent: 'orange',
        bullets: [
          'סוכני Observability מנטרים טלמטריה אמיתית מול כוונת ה-spec; סטייה מפעילה התראות או בולט תיקון עצמי.',
          'סוכני SRE פותחים issues באופן יזום על אנומליות; GenAI כותב סיכומי אירועים.',
          'משמעת CI/CD עוברת לעולם האג\'נטי — כל תקשורות הסוכנים מתועדות לביקורת.',
          'הלולאה לעולם לא נגמרת: STEER מזהה סטייה → מפעיל בולט חדש → STEER ממשיך.',
        ],
        output: 'מערכת עצמית-היגוי ומיושרת ל-Spec',
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
    subtitle: 'שלושה שלבים — גלול דרך הפריסה',
    phases: [
      {
        number: '01',
        emoji: '🗓',
        name: 'שלב 1 — יסודות',
        accent: 'blue',
        bullets: [
          'סנדבוקסים + טלמטריה + שערי אבטחה — סוכנים פועלים ללא השפעה על פרודקשן.',
          'התחל בתהליכים לא-קריטיים, מתועדים היטב, עם קריטריוני הצלחה ברורים — למשל עדכוני תלויות, ניטור ביצועים שגרתי.',
          'בנה את הסבכה (בדיקות / linters / טיפוסים).',
          'פיילוט של Spec-Kit על צוות אחד.',
        ],
      },
      {
        number: '02',
        emoji: '📈',
        name: 'שלב 2 — התרחבות',
        accent: 'violet',
        bullets: [
          'סקירת קוד AI לכל הצוותים — מדוד שיעורי בריחת פגמים.',
          'Jira + Confluence כרכזי הקשר.',
          'סוכני אובזרווביליות בפרודקשן.',
          '⚠ אמן מפתחים בprompting, ניטור AI, אימות — שינוי המיומנות חשוב לא פחות משינוי הכלים.',
        ],
      },
      {
        number: '03',
        emoji: '🚀',
        name: 'שלב 3 — אופטימיזציה',
        accent: 'emerald',
        bullets: [
          'קצב בולטים מלא — שעות למשימות מוגבלות.',
          'מדוד ROI; הגדל את הסבכה ברציפות.',
          'צוותי "חלוצים" משיגים מהירות ואיכות (PwC 2026).',
        ],
      },
    ],
    metricsTitle: 'מדדי ROI',
    metrics: [
      {
        icon: '📝',
        title: 'מהירות',
        accent: 'blue',
        items: ['נקודות סיפור לבולט', 'זמן מחזור בולט', 'שורות קוד לשעה', 'זמן על יצירה מול תחזוקה'],
      },
      {
        icon: '🛡',
        title: 'איכות',
        accent: 'green',
        items: ['שיעור בריחת פגמים', 'MTTR', 'שיעור אישור HITL'],
      },
      {
        icon: '🚀',
        title: 'מהירות שוק',
        accent: 'violet',
        items: ['זמן-לשוק', 'שינוי עלות תשתית', 'תדירות פריסה'],
      },
      {
        icon: '👥',
        title: 'אנשים',
        accent: 'amber',
        items: ['שביעות רצון מפתחים', 'זמן הכשרה', 'זמן מחזור אישור ספסיפיקציה'],
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
