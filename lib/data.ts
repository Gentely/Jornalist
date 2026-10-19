export type FileType = "PDF" | "WORD";
export interface Research {
  id: string; title: string; category: string; university: string; fileType: FileType;
  priceLYD: number; oldPriceLYD?: number; pages: number; year: number; level: "ماجستير" | "دكتوراه" | "بكالوريوس";
  rating: number; downloads: number; language: string; abstract: string; chapters: string[]; gradient: string; featured?: boolean; bestSeller?: boolean;
}

export const CATEGORIES = ["القانون","الطب وعلوم الصحة","الهندسة","تقنية المعلومات","إدارة الأعمال","التربية والتعليم","الاقتصاد والمحاسبة","العلوم الإنسانية","الشريعة والدراسات الإسلامية","الإعلام والصحافة"];
export const UNIVERSITIES = ["جامعة طرابلس","جامعة بنغازي","جامعة صبراتة","جامعة مصراتة","جامعة عمر المختار","جامعة الزاوية","الأكاديمية الليبية","الجامعة الليبية الدولية"];

const g = [
  "from-[#0F2A4A] to-[#16406E]","from-[#14532D] to-[#166534]","from-[#5B21B6] to-[#7C3AED]","from-[#7F1D1D] to-[#B91C1C]","from-[#0F766E] to-[#14B8A6]",
  "from-[#92400E] to-[#D97706]","from-[#1E3A5F] to-[#2563EB]","from-[#831843] to-[#DB2777]","from-[#164E63] to-[#0891B2]","from-[#3B0764] to-[#6D28D9]",
];
const abs = (t: string) => `بحث أكاديمي موثق يتناول ${t} بالدراسة والتحليل، بأسلوب علمي رصين ومراجع حديثة موثقة وفق أسلوب APA. يتضمن البحث إطاراً نظرياً ودراسات سابقة وتحليلاً ميدانياً ونتائج وتوصيات عملية قابلة للتطبيق في البيئة الليبية. صالح للاستعانة به في رسائل الماجستير والدكتوراه ومشاريع التخرج.`;
const ch = ["الفصل الأول: الإطار العام للدراسة","الفصل الثاني: الإطار النظري والدراسات السابقة","الفصل الثالث: منهجية الدراسة وإجراءاتها","الفصل الرابع: تحليل النتائج ومناقشتها","الفصل الخامس: الاستنتاجات والتوصيات"];

export const RESEARCHES: Research[] = [
  {id:"res-001",title:"أثر التحول الرقمي على كفاءة الأداء الإداري في المؤسسات الحكومية الليبية",category:"إدارة الأعمال",university:"الأكاديمية الليبية",fileType:"PDF",priceLYD:180,oldPriceLYD:240,pages:142,year:2024,level:"ماجستير",rating:4.9,downloads:412,language:"العربية",abstract:abs("التحول الرقمي في المؤسسات الحكومية"),chapters:ch,gradient:g[0],featured:true,bestSeller:true},
  {id:"res-002",title:"المسؤولية المدنية عن الأضرار البيئية في القانون الليبي: دراسة مقارنة",category:"القانون",university:"جامعة طرابلس",fileType:"WORD",priceLYD:220,pages:210,year:2023,level:"دكتوراه",rating:4.8,downloads:286,language:"العربية",abstract:abs("المسؤولية المدنية البيئية"),chapters:ch,gradient:g[1],featured:true},
  {id:"res-003",title:"استخدام الذكاء الاصطناعي في تشخيص الأمراض المزمنة: تطبيقات التعلم العميق",category:"تقنية المعلومات",university:"جامعة مصراتة",fileType:"PDF",priceLYD:250,oldPriceLYD:300,pages:188,year:2025,level:"دكتوراه",rating:5.0,downloads:523,language:"العربية / English",abstract:abs("الذكاء الاصطناعي الطبي"),chapters:ch,gradient:g[2],featured:true,bestSeller:true},
  {id:"res-004",title:"انتشار مرض السكري وعوامل الخطورة لدى البالغين في مدينة صبراتة",category:"الطب وعلوم الصحة",university:"جامعة صبراتة",fileType:"PDF",priceLYD:150,pages:118,year:2024,level:"ماجستير",rating:4.7,downloads:340,language:"العربية",abstract:abs("وبائيات مرض السكري في صبراتة"),chapters:ch,gradient:g[3],featured:true},
  {id:"res-005",title:"تصميم المباني السكنية المستدامة باستخدام الطاقة الشمسية في المناخ الليبي",category:"الهندسة",university:"جامعة عمر المختار",fileType:"PDF",priceLYD:200,pages:165,year:2024,level:"ماجستير",rating:4.8,downloads:198,language:"العربية",abstract:abs("المباني المستدامة والطاقة الشمسية"),chapters:ch,gradient:g[4]},
  {id:"res-006",title:"أثر القيادة التحولية على الرضا الوظيفي لدى معلمي المدارس الثانوية",category:"التربية والتعليم",university:"جامعة بنغازي",fileType:"WORD",priceLYD:95,pages:96,year:2023,level:"ماجستير",rating:4.6,downloads:267,language:"العربية",abstract:abs("القيادة التحولية والرضا الوظيفي"),chapters:ch,gradient:g[5]},
  {id:"res-007",title:"دور المحاسبة القضائية في الحد من الاحتيال المالي بالمصارف التجارية الليبية",category:"الاقتصاد والمحاسبة",university:"جامعة طرابلس",fileType:"PDF",priceLYD:175,oldPriceLYD:210,pages:154,year:2024,level:"ماجستير",rating:4.8,downloads:305,language:"العربية",abstract:abs("المحاسبة القضائية والاحتيال المالي"),chapters:ch,gradient:g[6],featured:true},
  {id:"res-008",title:"حماية حقوق الطفل في التشريع الليبي والاتفاقيات الدولية",category:"القانون",university:"جامعة صبراتة",fileType:"WORD",priceLYD:120,pages:132,year:2023,level:"بكالوريوس",rating:4.5,downloads:189,language:"العربية",abstract:abs("حقوق الطفل في التشريع الليبي"),chapters:ch,gradient:g[7]},
  {id:"res-009",title:"أمن المعلومات في المؤسسات المصرفية: التهديدات السيبرانية وسبل الحماية",category:"تقنية المعلومات",university:"جامعة الزاوية",fileType:"PDF",priceLYD:190,pages:146,year:2025,level:"ماجستير",rating:4.9,downloads:377,language:"العربية",abstract:abs("أمن المعلومات المصرفي"),chapters:ch,gradient:g[8],bestSeller:true},
  {id:"res-010",title:"الصيرفة الإسلامية في ليبيا: الواقع والتحديات وآليات التطوير",category:"الشريعة والدراسات الإسلامية",university:"الأكاديمية الليبية",fileType:"PDF",priceLYD:210,pages:198,year:2024,level:"دكتوراه",rating:4.8,downloads:244,language:"العربية",abstract:abs("الصيرفة الإسلامية في ليبيا"),chapters:ch,gradient:g[9]},
  {id:"res-011",title:"تأثير وسائل التواصل الاجتماعي على السلوك الانتخابي للشباب الليبي",category:"الإعلام والصحافة",university:"جامعة بنغازي",fileType:"WORD",priceLYD:85,pages:88,year:2024,level:"ماجستير",rating:4.4,downloads:226,language:"العربية",abstract:abs("وسائل التواصل والسلوك الانتخابي"),chapters:ch,gradient:g[0]},
  {id:"res-012",title:"جودة الرعاية الصحية الأولية من وجهة نظر المستفيدين في المناطق الغربية",category:"الطب وعلوم الصحة",university:"جامعة صبراتة",fileType:"WORD",priceLYD:110,pages:104,year:2023,level:"بكالوريوس",rating:4.5,downloads:152,language:"العربية",abstract:abs("جودة الرعاية الصحية الأولية"),chapters:ch,gradient:g[1]},
  {id:"res-013",title:"إدارة مشاريع البنية التحتية في البلديات الليبية: معوقات التنفيذ والحلول",category:"الهندسة",university:"جامعة مصراتة",fileType:"PDF",priceLYD:160,pages:138,year:2024,level:"ماجستير",rating:4.6,downloads:171,language:"العربية",abstract:abs("إدارة مشاريع البنية التحتية"),chapters:ch,gradient:g[2]},
  {id:"res-014",title:"صعوبات تعلم اللغة الإنجليزية لدى طلاب المرحلة الإعدادية وسبل علاجها",category:"التربية والتعليم",university:"جامعة الزاوية",fileType:"WORD",priceLYD:65,pages:74,year:2023,level:"بكالوريوس",rating:4.3,downloads:318,language:"العربية",abstract:abs("صعوبات تعلم اللغة الإنجليزية"),chapters:ch,gradient:g[3]},
  {id:"res-015",title:"أثر تقلبات سعر الصرف على التضخم في الاقتصاد الليبي (2011-2024)",category:"الاقتصاد والمحاسبة",university:"الجامعة الليبية الدولية",fileType:"PDF",priceLYD:230,pages:176,year:2025,level:"دكتوراه",rating:4.9,downloads:291,language:"العربية",abstract:abs("سعر الصرف والتضخم في ليبيا"),chapters:ch,gradient:g[4],featured:true},
  {id:"res-016",title:"الجريمة الإلكترونية وأحكامها في القانون الجنائي الليبي رقم 5 لسنة 2022",category:"القانون",university:"جامعة طرابلس",fileType:"PDF",priceLYD:195,oldPriceLYD:230,pages:168,year:2024,level:"ماجستير",rating:4.8,downloads:433,language:"العربية",abstract:abs("الجريمة الإلكترونية في القانون الليبي"),chapters:ch,gradient:g[5],bestSeller:true},
  {id:"res-017",title:"الهوية الثقافية الليبية في الرواية المعاصرة: قراءة في أعمال مختارة",category:"العلوم الإنسانية",university:"جامعة عمر المختار",fileType:"WORD",priceLYD:75,pages:92,year:2023,level:"ماجستير",rating:4.4,downloads:118,language:"العربية",abstract:abs("الهوية الثقافية في الرواية الليبية"),chapters:ch,gradient:g[6]},
  {id:"res-018",title:"تطوير نظام حجز مواعيد العيادات باستخدام تطبيقات الهاتف المحمول",category:"تقنية المعلومات",university:"جامعة صبراتة",fileType:"WORD",priceLYD:55,pages:68,year:2024,level:"بكالوريوس",rating:4.5,downloads:264,language:"العربية",abstract:abs("نظم حجز المواعيد الطبية"),chapters:ch,gradient:g[7]},
  {id:"res-019",title:"التسويق الرقمي للخدمات المصرفية وأثره على ولاء العملاء في ليبيا",category:"إدارة الأعمال",university:"جامعة بنغازي",fileType:"PDF",priceLYD:135,pages:122,year:2024,level:"ماجستير",rating:4.7,downloads:209,language:"العربية",abstract:abs("التسويق الرقمي المصرفي"),chapters:ch,gradient:g[8]},
  {id:"res-020",title:"أحكام التبرع بالأعضاء وزراعتها في الفقه الإسلامي والقانون الليبي",category:"الشريعة والدراسات الإسلامية",university:"جامعة طرابلس",fileType:"PDF",priceLYD:45,pages:58,year:2022,level:"بكالوريوس",rating:4.2,downloads:97,language:"العربية",abstract:abs("أحكام زراعة الأعضاء فقهياً"),chapters:ch,gradient:g[9]},
];
export const getResearch = (id: string) => RESEARCHES.find((r) => r.id === id);

export type OrderStatus = "pending" | "approved" | "rejected";
export interface Order {
  id: string; customerName: string; phone: string; email: string; items: { id: string; title: string; priceLYD: number; fileType: string }[];
  totalLYD: number; method: "bank" | "whatsapp"; status: OrderStatus; receiptName?: string; receiptDataUrl?: string; createdAt: string; note?: string;
}
export const MOCK_ORDERS: Order[] = [
  {id:"ORD-1042",customerName:"عبد السلام",phone:"0912345678",email:"sara@example.com",items:[{id:"res-001",title:RESEARCHES[0].title,priceLYD:180,fileType:"PDF"}],totalLYD:180,method:"bank",status:"pending",receiptName:"receipt.jpg",createdAt:"2026-10-18"},
  {id:"ORD-1041",customerName:"ليلى",phone:"0923456789",email:"omar@example.com",items:[{id:"res-009",title:RESEARCHES[8].title,priceLYD:190,fileType:"PDF"}],totalLYD:190,method:"bank",status:"approved",receiptName:"transfer.png",createdAt:"2026-10-17"},
  {id:"ORD-1040",customerName:"فاطمة أحمد",phone:"0934567890",email:"fatima@example.com",items:[{id:"res-004",title:RESEARCHES[3].title,priceLYD:150,fileType:"PDF"}],totalLYD:150,method:"whatsapp",status:"approved",createdAt:"2026-10-16"},
  {id:"ORD-1039",customerName:"محمود صالح",phone:"0945678901",email:"mahmoud@example.com",items:[{id:"res-016",title:RESEARCHES[15].title,priceLYD:195,fileType:"PDF"}],totalLYD:195,method:"bank",status:"rejected",receiptName:"receipt2.jpg",createdAt:"2026-10-15"},
];
export const TESTIMONIALS = [
  {name:"طالبة ماجستير - جامعة طرابلس",text:"بحث موثق ومرتب، وصلني بعد اعتماد الإيصال بساعات. تعامل راقٍ عبر واتساب."},
  {name:"باحث دكتوراه - الأكاديمية الليبية",text:"المراجع حديثة والفصول منظمة. وفر علي أسابيع من العمل في الإطار النظري."},
  {name:"خريجة إدارة أعمال - صبراتة",text:"طلبت بحث Word قابل للتعديل، وفعلاً كان منسقاً وجاهزاً للتطوير. شكراً فريق Journalist."},
];
