export const slidesHE = [
  // 1. title
  {
    type: 'title',
    title: 'AutoSpec',
    subtitle: 'מדרישות לקוד עובד',
    tagline: 'אל תן ל-AI לחשוב. תן לו מפרטים.',
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
  // 9. sddMethodology
  {
    type: 'sddMethodology',
    title: 'SDD: המתודולוגיה',
    principles: [
      { title: 'מפרטים לפני קוד', description: 'לכוד כוונה פעם אחת, בצע פעמים רבות', icon: '📐' },
      { title: 'תיעוד חי', description: 'הדוקומנטציה גדלה עם הפרויקט, לא מתיישנת', icon: '📖' },
      { title: 'חשיבה מבוססת תפקידים', description: '10 נקודות מבט מונעות נקודות עיוורון', icon: '🎭' },
      { title: 'ביצוע אג\'נטי', description: 'מפרטים ברורים מסירים עמימות לסוכני AI', icon: '🤖' },
    ],
    implementations: [
      { name: 'AutoSpec', description: 'מסגרת SDD מלאה עם CLI + viewer', status: 'featured' },
      { name: 'OpenSpec', description: 'פורמט מפרטים פתוח מונחה קהילה', status: 'alternative' },
      { name: 'המסגרת שלך', description: 'SDD היא מתודולוגיה, לא מוצר', status: 'custom' },
    ],
  },
  // 10. sddCostOfChaos — NEW
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
  // 11. sddThreePillars — REWORKED: Five Pillars
  {
    type: 'sddThreePillars',
    title: 'חמשת עמודי התווך של SDD',
    subtitle: 'הכללים שגורמים ל-SDD לעבוד — תוצרים קונקרטיים, תהליך אכיף',
    pillars: [
      { number: '01', title: 'פיתוח Backlog-First', description: 'מקור אמת יחיד. כל שינוי מתועד במשימה לפני המימוש. עקיבות מלאה מרעיון ל-commit.', artifact: 'specs/backlog.md', icon: '📋', color: 'teal' },
      { number: '02', title: 'תיעוד חי', description: 'תיקיית docs/ גדלה עם כל משימה. לא נכתב בנפרד — נוצר אוטומטית יחד עם הקוד.', artifact: 'docs/auth/01-architecture.md', icon: '📖', color: 'emerald' },
      { number: '03', title: 'קישור ספרינט ↔ דוקומנטציה', description: 'סיכומי ספרינט מצליבים דוקומנטציה, משימות, תוצאות QA ו-commits. שום דבר לא יתום.', artifact: 'sprints/sprint-15/summary.md', icon: '🔗', color: 'cyan' },
      { number: '04', title: 'QA לפני Done', description: 'אימות מקצה לקצה. באגים משוחזרים קודם. עומק הבדיקות מותאם לסוג השינוי.', artifact: 'scripts/agent-team-tests.ts', icon: '🧪', color: 'amber' },
      { number: '05', title: 'מפרטים מבוססי תפקידים', description: '10 נקודות מבט מבטיחות שאין נקודות עיוורון. מנהל מוצר, Backend, QA — כל אחד כותב מהתמחותו.', artifact: 'specs/01_product_manager.md', icon: '🎭', color: 'violet' },
    ],
  },
  // 12. solution — REWORKED
  {
    type: 'solution',
    title: 'AutoSpec: ערכת הכלים שלך ל-SDD',
    subtitle: 'פרומפט אחד. עשרה מפרטים. אפס אובדן הקשר.',
    capabilities: [
      { number: '01', title: '10 מפרטים שנוצרו ב-AI', description: 'מסמך דרישות אחד מייצר 10 קבצי מפרט מבוססי תפקידים — מנהל מוצר, Backend, Frontend, DB, QA, DevOps ועוד.', artifact: '$ autospec init → specs/*.md', icon: '📐' },
      { number: '02', title: 'הרצת ספרינטים מתואמת', description: 'סוכן PM של Opus מתאם סוכני Sonnet שרצים ב-worktrees מקביליים. לכל סוכן הקשר מלא מהמפרטים.', artifact: 'Opus → [Agent A, B, C] → merge', icon: '🎯' },
      { number: '03', title: 'מערכת ידע חיה', description: 'כל משימה מעדכנת docs/, באקלוג וסיכומי ספרינט. הידע מצטבר עם כל ספרינט.', artifact: 'docs/ (100+ קבצים אחרי ספרינט 10)', icon: '📖' },
    ],
    keyInsight: 'AutoSpec מממש SDD כדי שתפסיק לדון במתודולוגיה ותתחיל לשלוח.',
  },
  // 13. docsFolder
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
  // 14. pipeline (was workflow)
  {
    type: 'pipeline',
    scrollable: true,
    title: 'צינור העבודה המלא של AutoSpec',
    subtitle: 'מדרישות לקוד עובד — סקור הכל לפני שתבנה',
    pipelineCallout: 'המפתח שסוקר לפני שמקודד שולח מהר יותר מזה שמקודד לפני שחושב.',
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
    ],
  },
  // 15. roles
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
        { agent: 'Opus Orchestrator', roles: ['מנהל מוצר', 'ליד עסקי'] },
        { agent: 'Sonnet Agent A', roles: ['ליד Backend', 'ארכיטקט DB', 'ליד DevOps'] },
        { agent: 'Sonnet Agent B', roles: ['ליד Frontend', 'ליד QA', 'מעצב UI'] },
      ],
    },
    insight: 'גם מפתחים יחידים נהנים מחשיבה בתפקידים.',
  },
  // 16. ticketExecution
  {
    type: 'ticketExecution',
    title: 'צלילה עמוקה לביצוע משימה',
    stages: [
      { stage: 1, title: 'משימה מהבאקלוג', description: 'מזהה משימה, כותרת, נקודות סיפור, קריטריוני קבלה', icon: '🎫', time: '0 דק\'‎' },
      { stage: 2, title: 'מנהל מוצר מקצה הקשר', description: 'מפרט תפקיד מתיקיית specs/ + חלקי docs/ רלוונטיים + סיכומי ספרינטים קודמים מוזרקים ל-brief', icon: '📋', time: '2 דק\'‎' },
      { stage: 3, title: 'סוכן פיתוח מבצע', description: 'מממש קוד, כותב בדיקות, מעדכן דוקומנטציה — הכל ב-worktree מבודד', icon: '⚙️', time: '15-45 דק\'‎' },
      { stage: 4, title: 'סוכן QA סוקר', description: 'סוכן נפרד עם תפקיד ליד QA (specs/05_qa_lead.md) מתכנן בדיקות, מאמת תהליך משתמש, מאשר או חוסם', icon: '🧪', time: '5-10 דק\'‎' },
      { stage: 5, title: 'מיזוג + סיכום', description: 'הבאקלוג מתעדכן ל-✅, נכתב סיכום ספרינט, docs/ מתעדכן', icon: '✅', time: '2 דק\'‎' },
    ],
    callout: 'סוכן מנהל המוצר מתזמר את כל התהליך.',
  },
  // 17. backlog
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
  // 18. orchestrator
  {
    type: 'orchestrator',
    title: 'תבנית ה-Orchestrator',
    orchestrator: {
      name: 'מנהל מוצר (Opus)',
      subtitle: 'ה-Orchestrator הוא סוכן AI עם תפקיד מנהל המוצר מ-specs/01_product_manager.md',
      tasks: ['כותב briefs לספרינט', 'משגר סוכנים מקביליים', 'מסדר ספרינטים לפי גרף תלויות', 'סוקר תוצאות ומאחד'],
    },
    agents: [
      { name: 'Sonnet Agent A', task: 'משימות Backend ב-worktree-a' },
      { name: 'Sonnet Agent B', task: 'משימות Frontend ב-worktree-b' },
      { name: 'Sonnet Agent C', task: 'דוקומנטציה וקונפיגורציה ב-worktree-c' },
    ],
    benefits: ['הקשר ראשי נקי', 'ביצוע מקבילי', 'worktrees מבודדים'],
  },
  // 19. multiagent
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
  // 20. qaMethodology
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
  // 21. sprintSummary
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
  // 22. modelOptimization
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
  // 23. environmentProof
  {
    type: 'environmentProof',
    title: 'אגנוסטי לסביבה: הוכחה',
    environments: [
      {
        name: 'Claude Code',
        accent: 'cyan',
        mockup: 'terminal',
        commands: ['$ claude', '> /sprint-run', 'Loading CLAUDE.md...', 'Loading specs/*.md...', 'Sprint 3 executing...'],
      },
      {
        name: 'GitHub Copilot',
        accent: 'purple',
        mockup: 'ide',
        commands: ['CLAUDE.md loaded in workspace', 'specs/ folder indexed', '@workspace /sprint-run'],
      },
      {
        name: 'Air-Gapped / Continue',
        accent: 'amber',
        mockup: 'local',
        commands: ['Ollama running locally', 'Same specs/ folder', 'No cloud required'],
      },
    ],
    callout: 'אותו CLAUDE.md. אותו specs/. אותה מתודולוגיה.',
    bottomText: 'עובד בכל סביבה — גם בלי אינטרנט.',
  },
  // 24. viewer
  {
    type: 'viewer',
    title: 'דשבורד Viewer חי',
    url: 'hundia.github.io/autospec/viewer',
    features: ['דפדפן מפרטים', 'באקלוג Kanban', 'דוקומנטציה חיה'],
    linkText: 'נסה אותו חי →',
  },
  // 25. example
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
  // 26. results
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
  // 27. demo
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
  // 28. futureWaterfall — NEW
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
  // 29. futureMonolith — NEW
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
  // 30. beforeAfter
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
  // 31. closing
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
  // 32. finalTagline
  {
    type: 'finalTagline',
    title: 'AutoSpec',
    tagline: 'אל תניח ל-AI שלך לחשוב. תן לו לבצע.',
  },
];
