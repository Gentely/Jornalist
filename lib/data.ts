export type FileType = "PDF" | "WORD";

export interface Research {
  id: string;
  /** عنوان البحث كما يظهر على الغلاف وفي رأس بطاقة العرض */
  title: string;
  /** نبذة مختصرة من سطرين إلى ثلاثة تظهر مباشرة تحت العنوان قبل أزرار الطلب */
  summary: string;
  /** المختصر الكامل الذي يقرأه الزائر في صفحة التفاصيل قبل الدفع */
  abstract: string;
  /** صورة غلاف البحث */
  cover: string;
  /** مجموعة التصنيف الكبرى المستخدمة في أزرار التصفية البسيطة */
  group: string;
  category: string;
  /** يحتفظ بهذا الحقل لتوافق الصفحات القديمة ويعرض بوصفه نوع البحث */
  university: string;
  fileType: FileType;
  priceLYD: number;
  oldPriceLYD?: number;
  /** عدد صفحات تقريبي بعد التنسيق في Word */
  pages: number;
  words: number;
  year: number;
  level: string;
  rating: number;
  downloads: number;
  language: string;
  chapters: string[];
  gradient: string;
  featured?: boolean;
  bestSeller?: boolean;
}

export const GROUPS = [
  { id: "all", label: "كل البحوث" },
  { id: "بحوث طبية عامة", label: "بحوث طبية عامة" },
  { id: "أمراض السرطان", label: "أمراض السرطان" },
  { id: "TESOL — اللغة الإنجليزية", label: "TESOL — اللغة الإنجليزية" },
] as const;

export const CATEGORIES = [
  "طب عام وصحة عامة",
  "طب الأسرة",
  "سرطان الرئة",
  "سرطان البروستاتا",
  "سرطان الثدي",
  "TESOL — اللغة الإنجليزية",
];

// تُبقى هذه القائمة لنماذج «بحث مخصص» و«إضافة بحث» في لوحة الإدارة.
export const UNIVERSITIES = [
  "جامعة طرابلس",
  "جامعة بنغازي",
  "جامعة صبراتة",
  "جامعة مصراتة",
  "جامعة عمر المختار",
  "جامعة الزاوية",
  "الأكاديمية الليبية",
  "الجامعة الليبية الدولية",
];

export const RESEARCHES: Research[] = [
  {
    id: "amr-public-health",
    title: "مقاومة المضادات الحيوية بوصفها تهديداً للصحة العامة: الأسباب والآثار واستراتيجيات المواجهة",
    summary: "مراجعة تحليلية تشرح كيف تنشأ مقاومة المضادات وتنتشر، ولماذا يسرّعها الوصف العشوائي والصرف دون وصفة والاستعمال الحيواني، مع حلول عملية تشمل الإشراف على المضادات والترصد ومكافحة العدوى ضمن مقاربة «الصحة الواحدة».",
    abstract: "يستعرض هذا البحث مفهوم مقاومة المضادات الحيوية وآلياتها البيولوجية، ويحلل أسباب تسارعها السريرية والسلوكية والزراعية والبيئية والاقتصادية، ويقدر آثارها الصحية والاقتصادية بالاعتماد على تقديرات وتقارير عالمية حديثة. ثم يناقش حزمة مواجهة متعددة المستويات تشمل ترشيد الوصف والصرف، وبرامج الإشراف على مضادات الميكروبات، ومكافحة العدوى، والترصد المخبري، والتشخيص السريع، واللقاحات، وإصلاح حوافز ابتكار مضادات جديدة. ويخلص إلى أن المقاومة ليست مشكلة دواء منفرد، بل مشكلة تنسيق بين الطبيب والصيدلي والمريض وصانع السياسة وقطاعي الزراعة والبيئة، وأن أولى الخطوات في البيئات محدودة الموارد هي بناء المختبرات والبيانات مع ضمان وصول الدواء لمن يحتاجه فعلاً.",
    cover: "/covers/01-amr.jpg",
    group: "بحوث طبية عامة",
    category: "طب عام وصحة عامة",
    university: "مراجعة أدبية موثقة",
    fileType: "WORD",
    priceLYD: 120,
    pages: 11,
    words: 2528,
    year: 2026,
    level: "مراجعة أدبية",
    rating: 0,
    downloads: 0,
    language: "العربية + مستخلص إنجليزي",
    chapters: ["المقدمة", "هدف البحث وأسئلته ومنهجية المراجعة", "كيف تنشأ المقاومة وتنتشر؟", "محرّكات تسارع المقاومة", "الآثار الصحية والاقتصادية", "استراتيجيات المواجهة", "مناقشة في ضوء البيئات محدودة الموارد", "حدود البحث وخاتمة وتوصيات", "قائمة المراجع الموثقة"],
    gradient: "from-[#0B2942] to-[#0F766E]",
    featured: true,
  },
  {
    id: "diabetes-primary-care",
    title: "تدبير داء السكري من النوع الثاني في الرعاية الصحية الأولية: من ضبط الغلوكوز إلى حماية القلب والكلى",
    summary: "بحث عملي ينتقل من مجرد خفض السكر إلى حماية القلب والكلى وإدارة الوزن، ويعرض دور التثقيف ونمط الحياة والميتفورمين والفئات الحديثة، مع إطار متابعة واضح للمضاعفات في الرعاية الأولية محدودة الموارد.",
    abstract: "يعرض هذا البحث حجم مشكلة السكري من النوع الثاني وأسبابها، ثم يتتبع تحول الإرشادات الحديثة من نموذج ضيق يتمحور حول الهيموغلوبين السكري إلى نموذج متمركز حول المريض يستهدف ضبط الغلوكوز وإدارة الوزن وخفض خطر القلب والأوعية وحماية الكلى في وقت واحد. ويراجع أدلة التثقيف ونمط الحياة والميتفورمين ومثبطات SGLT2 ومناهضات GLP-1 والتكثيف العلاجي عند الحاجة، ويترجمها إلى متابعة عملية تتضمن أهدافاً فردية وفحوص مضاعفات دورية ودعماً للالتزام. ويؤكد أن نجاح التدبير لا يقاس برقم مخبري واحد، بل بسنوات يعيشها المريض بعيداً عن الجلطات والفشل الكلوي وبتر الأطراف.",
    cover: "/covers/02-diabetes.jpg",
    group: "بحوث طبية عامة",
    category: "طب الأسرة",
    university: "مراجعة أدبية موثقة",
    fileType: "WORD",
    priceLYD: 110,
    pages: 10,
    words: 2158,
    year: 2026,
    level: "مراجعة أدبية",
    rating: 0,
    downloads: 0,
    language: "العربية + مستخلص إنجليزي",
    chapters: ["المقدمة", "هدف البحث وأسئلته ومنهجية المراجعة", "من تخفيض السكر إلى إدارة خطر شامل", "التثقيف ونمط الحياة", "الميتفورمين والخطوات العلاجية الأولى", "حماية القلب والكلى في ضوء التجارب الكبرى", "متابعة المضاعفات في الرعاية الأولية", "مناقشة وحدود البحث وخاتمة وتوصيات", "قائمة المراجع الموثقة"],
    gradient: "from-[#14532D] to-[#0F766E]",
    featured: true,
  },
  {
    id: "lung-cancer",
    title: "سرطان الرئة: عوامل الخطورة والكشف المبكر وحدود العلاجات الحديثة",
    summary: "مراجعة تتبع سرطان الرئة من التبغ والرادون وتلوث الهواء إلى التصنيف الجزيئي، وتشرح أدلة الكشف بالأشعة المقطعية منخفضة الجرعة، وخيارات الجراحة والإشعاع والعلاج المناعي والموجه بحسب المرحلة.",
    abstract: "يراجع هذا البحث عوامل خطورة سرطان الرئة، وفي مقدمتها التبغ، دون إغفال غير المدخنين والأسباب المهنية والبيئية كالأسبستوس والرادون وتلوث الهواء. ويعرض الفرق بين سرطانات صغيرة الخلايا وغير صغيرة الخلايا، وأهمية البصمة الجزيئية وPD-L1 في اختيار العلاج الموجه والمناعي، ثم يحلل أدلة تجربتي NLST وNELSON والتوصيات الحديثة للفحص السنوي بالأشعة المقطعية منخفضة الجرعة عند ذوي خطورة مرتفعة. ويلخص البحث الخيارات الجراحية والإشعاعية والكيماوية والمناعية والموجهة جزيئياً بحسب المرحلة، ويقترح أولويات للسياق العربي والليبي تبدأ بمكافحة التبغ وسجلات السرطان ومسارات تشخيص أسرع.",
    cover: "/covers/03-lung-cancer.jpg",
    group: "أمراض السرطان",
    category: "سرطان الرئة",
    university: "مراجعة أدبية موثقة",
    fileType: "WORD",
    priceLYD: 130,
    pages: 10,
    words: 2119,
    year: 2026,
    level: "مراجعة أدبية",
    rating: 0,
    downloads: 0,
    language: "العربية + مستخلص إنجليزي",
    chapters: ["المقدمة", "هدف البحث وأسئلته ومنهجية المراجعة", "عوامل الخطورة: التبغ وما وراءه", "الصمت الإكلينيكي والتصنيفان النسيجي والجزيئي", "الكشف المبكر بالأشعة المقطعية منخفضة الجرعة", "لمحة علاجية بحسب المرحلة", "أين نبدأ عربياً وليبياً؟", "حدود البحث وخاتمة وتوصيات", "قائمة المراجع الموثقة"],
    gradient: "from-[#164E63] to-[#2563EB]",
    featured: true,
  },
  {
    id: "prostate-cancer",
    title: "سرطان البروستاتا: جدل الفحص المبكر بمستضد البروستاتا ومسارات التشخيص والعلاج الحديثة",
    summary: "بحث يوازن بين فائدة فحص PSA ومخاطر فرط التشخيص والعلاج، ويعرض دور الرنين المغناطيسي قبل الخزعة، والمراقبة النشطة للحالات منخفضة الخطورة، وعلاجات المرض المتقدم الحديثة.",
    abstract: "ينطلق هذا البحث من مفارقة سرطان البروستاتا: قد يبقى خاملاً طوال حياة رجل، بينما يكون عدوانياً وقاتلاً لدى آخر. يراجع عوامل الخطورة العمرية والوراثية والعرقية، ويشرح الجدل بين تجربتي ERSPC وPLCO حول فحص المستضد النوعي للبروستاتا PSA، وكيف استقرت التوصيات على قرار فردي مستنير في الفئة العمرية 55–69 عاماً بدل الفحص العام. ثم يعرض التحول إلى الرنين المغناطيسي متعدد المعايير والخزعة الموجهة وأدوات تقدير الخطورة، ويضع ذلك ضمن سلم يبدأ بالمراقبة النشطة ويصل إلى الجراحة والإشعاع والحرمان الأندروجيني والعلاجات الهرمونية والمستهدفة في المرض المتقدم.",
    cover: "/covers/04-prostate-cancer.jpg",
    group: "أمراض السرطان",
    category: "سرطان البروستاتا",
    university: "مراجعة أدبية موثقة",
    fileType: "WORD",
    priceLYD: 130,
    pages: 11,
    words: 2263,
    year: 2026,
    level: "مراجعة أدبية",
    rating: 0,
    downloads: 0,
    language: "العربية + مستخلص إنجليزي",
    chapters: ["المقدمة", "هدف البحث وأسئلته ومنهجية المراجعة", "من يُصاب؟ عوامل الخطورة", "جدل PSA: حين تتصادم تجربتان كبيرتان", "من الخزعة العمياء إلى التشخيص الموجه بالرنين", "سلم العلاج من المراقبة إلى المرض المنتشر", "ملاءمة السياق المحلي", "حدود البحث وخاتمة وتوصيات", "قائمة المراجع الموثقة"],
    gradient: "from-[#1E3A5F] to-[#0891B2]",
  },
  {
    id: "breast-cancer",
    title: "سرطان الثدي: الوعي والكشف المبكر بوصفهما مدخلاً لتحسين المآلات العلاجية",
    summary: "مراجعة تركز على الوعي والكشف المبكر بوصفهما مفتاح تحسين النتائج، وتشرح عوامل الخطورة والأنماط الهرمونية وHER2، والفروق بين الوعي بالثدي والفحص السريري والماموغرام، مع خارطة واقعية للبيئات محدودة الموارد.",
    abstract: "يراجع هذا البحث عبء سرطان الثدي وعوامل خطورته الهرمونية والإنجابية والوراثية والقابلة للتعديل، ويشرح لماذا لم يعد مرضاً واحداً مع اعتماد العلاج الحديث على مستقبلات الهرمونات وHER2 ومؤشرات التكاثر. ويقارن بين وعي الثدي والفحص الذاتي الروتيني والفحص السريري والماموغرام المنظم والفحص المكثف عند صاحبات الخطورة الوراثية، ثم يعرض مثلث التشخيص وأهمية السرعة ومؤشرات مبادرة منظمة الصحة العالمية. ويخلص إلى أن الاكتشاف المبكر لا يثمر ما لم تقابله خزعة وتشخيص في وقتهما وعلاج مكتمل، وأن حزمة تشخيص مبكر عالية التنظيم قد تتفوق واقعياً على أجهزة فحص من دون مسار متابعة.",
    cover: "/covers/05-breast-cancer.jpg",
    group: "أمراض السرطان",
    category: "سرطان الثدي",
    university: "مراجعة أدبية موثقة",
    fileType: "WORD",
    priceLYD: 130,
    pages: 11,
    words: 2485,
    year: 2026,
    level: "مراجعة أدبية",
    rating: 0,
    downloads: 0,
    language: "العربية + مستخلص إنجليزي",
    chapters: ["المقدمة", "هدف البحث وأسئلته ومنهجية المراجعة", "عوامل الخطورة: ما يتغير وما يمكن تعديله", "الأنماط الفرعية والمُستقبلات وHER2", "من الوعي بالثدي إلى الماموغرام", "ما بعد الاشتباه: مثلث التشخيص والسرعة", "لمحة علاجية بحسب المرحلة والنمط", "أولويات واقعية عربية وليبية", "حدود البحث وخاتمة وتوصيات", "قائمة المراجع الموثقة"],
    gradient: "from-[#831843] to-[#DB2777]",
  },
  {
    id: "tesol-clt-efl",
    title: "Communicative Language Teaching in EFL Classrooms: Opportunities, Constraints, and Context-Sensitive Implementation",
    summary: "بحث TESOL مكتوب بالإنجليزية يناقش تطبيق المنهج التواصلي في فصول تعليم الإنجليزية لغةً أجنبية، بين فرص التفاعل الحقيقي وقيود الامتحانات وازدحام الفصول وكفاءة المعلم، مع تنفيذ حساس للسياق لا يهمل القواعد والدقة.",
    abstract: "Research summary: This literature review traces Communicative Language Teaching from the theory of communicative competence to classroom practices such as information-gap tasks, pair work, meaningful interaction and a balanced treatment of fluency and accuracy. It examines why implementation often stalls in EFL settings because of grammar-heavy examinations, large classes, limited time and resources, teacher proficiency and cultural expectations about the teacher's role. Drawing on post-method scholarship, it argues that teachers should not ask whether to adopt CLT as a fixed package, but how to adapt its principles locally: short accountable communicative tasks, delayed form-focused correction, judicious first-language support, assessment that rewards performance, and teacher development based on real classroom conditions.",
    cover: "/covers/06-tesol-clt.jpg",
    group: "TESOL — اللغة الإنجليزية",
    category: "TESOL — اللغة الإنجليزية",
    university: "Literature Review",
    fileType: "WORD",
    priceLYD: 140,
    pages: 12,
    words: 2667,
    year: 2026,
    level: "Literature Review",
    rating: 0,
    downloads: 0,
    language: "English + ملخص عربي",
    chapters: ["Introduction", "Aim, questions and review methodology", "From competence to communicative competence", "Defining principles and classroom repertoire", "Examinations, class size and teacher-related constraints", "Cultural expectations and the fluency–grammar debate", "Context-sensitive post-method implementation", "Implications for Arabic-speaking EFL contexts", "Limitations, conclusion and recommendations", "References"],
    gradient: "from-[#0F2A4A] to-[#0F766E]",
  },
  {
    id: "tesol-mobile-vocabulary",
    title: "Technology-Assisted Vocabulary Learning in TESOL: Mobile Applications, Spaced Repetition, and Learner Autonomy",
    summary: "بحث TESOL مكتوب بالإنجليزية يراجع تعلم مفردات اللغة الإنجليزية بالتطبيقات وبطاقات الكلمات والتكرار المتباعد، ويبين ما تنجح فيه التقنية وما تعجز عنه، مع إطار يربط الحفظ بالقراءة الواسعة ومهام الكلام والكتابة واستقلالية المتعلم.",
    abstract: "Research summary: This review explains what deeper word knowledge involves beyond recognising a translation, including pronunciation, spelling, collocations, register and productive use. It synthesises evidence on mobile-assisted vocabulary learning, flashcards and spaced-repetition systems, showing that retrieval practice and expanding review can build durable receptive knowledge when vocabulary is selected by frequency and practised with audio, examples and collocations. It also identifies limits: productive use may lag behind recognition, novelty effects fade, and poor word selection wastes effort. The proposed framework combines level diagnosis, high-frequency targets, extensive reading and listening, speaking and writing tasks that recycle new words, explicit autonomy training, and delayed receptive/productive assessment.",
    cover: "/covers/07-tesol-mobile.jpg",
    group: "TESOL — اللغة الإنجليزية",
    category: "TESOL — اللغة الإنجليزية",
    university: "Literature Review",
    fileType: "WORD",
    priceLYD: 140,
    pages: 12,
    words: 2607,
    year: 2026,
    level: "Literature Review",
    rating: 0,
    downloads: 0,
    language: "English + ملخص عربي",
    chapters: ["Introduction: the vocabulary arithmetic problem", "Aim, questions and review methodology", "What it means to know a word", "Why spacing and retrieval should work", "What mobile vocabulary evidence shows", "Learner autonomy as the hidden curriculum", "A design framework for TESOL programmes", "Arabic-speaking learners and low-resource settings", "Limitations, conclusion and recommendations", "References"],
    gradient: "from-[#3B0764] to-[#2563EB]",
  },
];

export const getResearch = (id: string) => RESEARCHES.find((r) => r.id === id);

export type OrderStatus = "pending" | "approved" | "rejected";
export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  items: { id: string; title: string; priceLYD: number; fileType: string }[];
  totalLYD: number;
  method: "bank" | "whatsapp";
  status: OrderStatus;
  receiptName?: string;
  receiptDataUrl?: string;
  /** True when a real receipt exists in the private Supabase receipts bucket. */
  hasReceipt?: boolean;
  /** Distinguishes a real Supabase order from a local demo order. */
  backend?: "demo" | "supabase";
  /**
   * Plain guest order tracking token, returned once by the order API and kept
   * only in this customer's browser. Never returned by later API responses.
   */
  accessToken?: string;
  createdAt: string;
  note?: string;
}

// طلبات عرض تجريبية للوحة الإدارة فقط، وتستند الآن إلى عناوين الدفعة الحقيقية.
export const MOCK_ORDERS: Order[] = [
  { id: "ORD-1042", customerName: "عبد السلام", phone: "0912345678", email: "sara@example.com", items: [{ id: RESEARCHES[0].id, title: RESEARCHES[0].title, priceLYD: RESEARCHES[0].priceLYD, fileType: "WORD" }], totalLYD: RESEARCHES[0].priceLYD, method: "bank", status: "pending", receiptName: "receipt.jpg", createdAt: "2026-10-18" },
  { id: "ORD-1041", customerName: "ليلى", phone: "0923456789", email: "omar@example.com", items: [{ id: RESEARCHES[2].id, title: RESEARCHES[2].title, priceLYD: RESEARCHES[2].priceLYD, fileType: "WORD" }], totalLYD: RESEARCHES[2].priceLYD, method: "bank", status: "approved", receiptName: "transfer.png", createdAt: "2026-10-17" },
  { id: "ORD-1040", customerName: "فاطمة أحمد", phone: "0934567890", email: "fatima@example.com", items: [{ id: RESEARCHES[4].id, title: RESEARCHES[4].title, priceLYD: RESEARCHES[4].priceLYD, fileType: "WORD" }], totalLYD: RESEARCHES[4].priceLYD, method: "whatsapp", status: "approved", createdAt: "2026-10-16" },
  { id: "ORD-1039", customerName: "محمود صالح", phone: "0945678901", email: "mahmoud@example.com", items: [{ id: RESEARCHES[6].id, title: RESEARCHES[6].title, priceLYD: RESEARCHES[6].priceLYD, fileType: "WORD" }], totalLYD: RESEARCHES[6].priceLYD, method: "bank", status: "rejected", receiptName: "receipt2.jpg", createdAt: "2026-10-15" },
];

export const TESTIMONIALS = [
  { name: "قارئة بحوث طبية", text: "وجود النبذة قبل الطلب يجعل الاختيار واضحاً، وأعرف تماماً ما سأحصل عليه وعدد الصفحات والمصادر." },
  { name: "معلم لغة إنجليزية", text: "بحوث TESOL الإنجليزية مرتبة بفصول ومراجع يمكن الرجوع إليها، وليست عناوين عامة بلا مضمون." },
  { name: "طالبة دراسات عليا", text: "أهم ما يميز القائمة هو البساطة: الغلاف والعنوان والمختصر والسعر في مكان واحد بلا تعقيد." },
];
