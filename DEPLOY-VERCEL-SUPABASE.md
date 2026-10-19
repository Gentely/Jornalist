# نشر Journalist على Vercel وربطه مع Supabase

## ما الحالة الآن؟

واجهة الموقع تعرض الدفعة الأولى الحقيقية (7 بحوث) من ملف `lib/data.ts`، ولكل بحث:

- صورة غلاف داخل `public/covers/`
- عنوان البحث
- نبذة مختصرة ومختصر علمي ومحتويات
- سعر وزر طلب ودفع بعد قراءة النبذة

أما ملفات البحوث الكاملة بصيغة Word فهي **ليست داخل مستودع GitHub العام**. تبقى عندك في حزمة البحوث الخاصة، وترفعها لاحقاً إلى Supabase Storage في حاوية خاصة. هذا مقصود حتى لا تفهرسها محركات البحث ولا يستطيع أي شخص تحميلها قبل الدفع.

## أولاً: النشر على Vercel

1. ادمج فرع العمل الحالي إلى `main` أولاً، أو اختر فرع الإنتاج المقصود من إعدادات Vercel. الأفضل للإنتاج هو `main`.
2. ادخل إلى Vercel بحساب GitHub الذي يملك مستودع `Gentely/Jornalist`.
3. اختر **Add New → Project** ثم **Import** بجانب المستودع.
4. اترك الإعدادات الافتراضية لمشروع Next.js:
   - Framework Preset: `Next.js`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: اتركها افتراضية
5. أضف المتغيرات التالية من قسم Environment Variables قبل أول نشر، إن كنت أنشأت Supabase بالفعل:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = مفتاح **Publishable** الذي يبدأ عادة بـ `sb_publishable_`
   - `NEXT_PUBLIC_SITE_URL` = رابط موقعك النهائي بعد إنشائه
   - إذا عرض مشروع قديم مفتاحاً باسم `anon` بدل Publishable، فيمكن وضعه بدلاً من ذلك في `NEXT_PUBLIC_SUPABASE_ANON_KEY`؛ الموقع يدعم الاسمين ولا حاجة لإدخال الاثنين.
6. اضغط **Deploy** وانتظر ظهور رابط الموقع.
7. افتح الصفحات التالية للاختبار: `/` و`/shop` وصفحة أي بحث و`/checkout` و`/admin` و`/login`.

لا تضع `SUPABASE_SECRET_KEY` أو `SUPABASE_SERVICE_ROLE_KEY` في أي متغير يبدأ بـ `NEXT_PUBLIC_` أبداً. مفتاح Publishable (أو anon القديم) هو المخصص للمتصفح مع Row Level Security.

## ثانياً: ربط Supabase بـGitHub وتطبيق قاعدة البيانات تلقائياً

لا تستخدم **SQL Editor** ولا تنسخ ملفات SQL. مخطط قاعدة البيانات وبيانات الدفعة الأولى موجودان الآن كترحيلات رسمية في `supabase/migrations/`:

- `20261019174000_create_journalist_schema.sql` — ينشئ الجداول والفهارس وسياسات RLS وملف المستخدم التلقائي.
- `20261019174100_insert_batch_01_research_catalogue.sql` — يُدخل بحوث الدفعة الأولى السبعة بعناوينها ونبذاتها وأسعارها ومسارات ملفاتها.

اتبع ما يلي مرة واحدة:

1. أنشئ مشروع Supabase، واحفظ كلمة مرور قاعدة البيانات في مكان آمن. لا ترسلها في المحادثة.
2. افتح **Project Settings → Integrations → GitHub Integration** واربط المشروع بمستودع `Gentely/Jornalist`. إذا كنت اخترت GitHub أثناء إنشاء المشروع، تحقق من الإعدادات التالية بدلاً من إنشاء ربط جديد:
   - **Production branch:** `main`
   - **Working directory:** `.` لأن مجلد `supabase/` في جذر المستودع
   - **Deploy to production:** مفعّل **ON**
   - لا حاجة إلى تفعيل Automatic branching لغرض نشر قاعدة بيانات الإنتاج.
3. ادمج طلب السحب الذي يحتوي على `supabase/config.toml` وملفات `supabase/migrations/` إلى `main`. سيطبّق Supabase الترحيلين بالترتيب تلقائياً وينشئ حاويات Storage المعرّفة في الإعدادات.
4. تابع حالة نشر Supabase من صفحة GitHub Integration أو سجلات النشر داخل المشروع. بعد النجاح افتح **Table Editor → researches** فقط للتحقق بصرياً من وجود 7 صفوف؛ لا تنفّذ أي SQL.
5. افتح نافذة **Connect** أعلى مشروع Supabase، أو **Settings → API Keys**، ثم انسخ:
   - Project URL إلى `NEXT_PUBLIC_SUPABASE_URL`
   - **Publishable key** إلى `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - في المشاريع القديمة فقط: مفتاح `anon` إلى `NEXT_PUBLIC_SUPABASE_ANON_KEY` بدلاً من Publishable.
   لا تنسخ أي مفتاح يبدأ بـ `sb_secret_` إلى المتصفح أو Vercel public variables.
6. أضف المتغيرات في ملف `.env.local` محلياً، وفي إعدادات Vercel للإنتاج، ثم أعد نشر الموقع بعد تغيير المتغيرات.

ملفا `supabase/schema.sql` و`supabase/seed-researches.sql` باقيان كمؤشرين فقط إلى الترحيلات الجديدة ولا يحتويان على SQL قابل للتنفيذ.

## ثالثاً: إعداد Storage ورفع الأغلفة والملفات

الحاويات الثلاث معرّفة برمجياً في `supabase/config.toml` وينبغي أن تظهر تلقائياً بعد نجاح نشر Supabase من GitHub. افتح **Storage** للتحقق منها فقط، ولا تنشئ نسخاً مكررة:

| Bucket | الخصوصية | الاستخدام |
|---|---|---|
| `covers` | Public | صور أغلفة البحوث |
| `research-files` | Private | ملفات DOCX الكاملة؛ لا تجعلها عامة |
| `receipts` | Private | صور إيصالات التحويل |

إذا لم تظهر الحاويات، تحقق أولاً من أن **Deploy to production** مفعّل ومن سجل نشر GitHub Integration. الإعداد ينشئ الحاويات فارغة؛ ما يزال يلزم رفع صور الأغلفة وملفات DOCX نفسها بالأسماء الواردة أدناه.

### أسماء صور الأغلفة داخل `covers`

الأسماء نفسها الموجودة في `public/covers/`:

- `01-amr.jpg`
- `02-diabetes.jpg`
- `03-lung-cancer.jpg`
- `04-prostate-cancer.jpg`
- `05-breast-cancer.jpg`
- `06-tesol-clt.jpg`
- `07-tesol-mobile.jpg`

صور الموقع الحالية تُقرأ من `public/covers/` مباشرة على Vercel. رفعها أيضاً إلى Bucket يجعلها جاهزة عندما ينتقل عرض الكتالوج بالكامل لقراءة البيانات من Supabase.

### أسماء ملفات DOCX داخل `research-files`

أعد تسمية ملفات دفعتك الخاصة قبل الرفع بهذه الأسماء بالضبط:

| الملف عندك في الحزمة الخاصة | الاسم المطلوب داخل Supabase |
|---|---|
| `01-amr-ar.docx` | `amr-public-health.docx` |
| `02-diabetes-t2-ar.docx` | `diabetes-primary-care.docx` |
| `03-lung-cancer-ar.docx` | `lung-cancer.docx` |
| `04-prostate-cancer-ar.docx` | `prostate-cancer.docx` |
| `05-breast-cancer-ar.docx` | `breast-cancer.docx` |
| `06-tesol-clt-en.docx` | `tesol-clt-efl.docx` |
| `07-tesol-mobile-vocab-en.docx` | `tesol-mobile-vocabulary.docx` |

## رابعاً: إعداد تسجيل الدخول والمدير

1. من Supabase افتح **Authentication → URL Configuration**.
2. اجعل Site URL هو رابط Vercel النهائي، وأضف أيضاً `http://localhost:3000` وروابط التوجيه التي تحتاجها أثناء التطوير.
3. أنشئ حساب المدير من صفحة `/login` في موقعك أو من Supabase Auth.
4. ينشئ الترحيل تلقائياً صفاً مطابقاً في `public.profiles` عند إنشاء مستخدم Auth جديد. بعد تسجيل حسابك، افتح **Table Editor → profiles**، وحدد صفّك، وغيّر قيمة `role` من `customer` إلى `admin` من الواجهة نفسها. لا حاجة إلى SQL لهذه الخطوة أيضاً.

## خامساً: نقطة برمجية مهمة قبل البيع الفعلي

ربط المفاتيح وتطبيق Migrations ورفع الملفات يجهز البنية التحتية، لكنه لا يحوّل تلقائياً كل شاشات النسخة الحالية من وضع العرض التجريبي إلى العمل الكامل من قاعدة البيانات.

ما يعمل حالياً بعد إعداد المتغيرات:

- تسجيل الدخول/إنشاء حساب عبر Supabase Auth في `/login`.
- واجهة عرض البحوث والطلب والدفع الظاهرة للزائر.

ما يحتاج خطوة تطوير أخيرة قبل الاعتماد التجاري الكامل على Supabase:

1. قراءة قائمة البحوث من جدول `public.researches` بدل `lib/data.ts`.
2. حفظ الطلبات وعناصرها في `orders` و`order_items` بدل `localStorage`.
3. رفع إيصالات الزبائن إلى Bucket الخاص `receipts` وعرضها للمدير بصلاحيات آمنة.
4. إنشاء روابط تحميل موقعة مؤقتة من `research-files` فقط بعد اعتماد الطلب.
5. حماية `/admin` بالمصادقة ودور `admin` وسياسات RLS مصممة لعزل كل زبون عن طلبات الآخرين.

حتى تنفيذ هذه الخطوة، استخدم النشر الحالي للمراجعة والاختبار، وتعامل مع أي طلب حقيقي عبر واتساب/متابعة يدوية. لا تضع ملفات DOCX الكاملة داخل مجلد `public/` أو في GitHub لأنها ستصبح قابلة للتحميل والفهرسة.

## قائمة تحقق أخيرة قبل الإعلان العام

- [ ] رابط Vercel يعمل بجميع الصفحات.
- [ ] أغلفة الأبحاث السبعة ظاهرة وفيها العناوين مقروءة.
- [ ] النبذات والمختصرات صحيحة والأسعار نهائية.
- [ ] زر «حساب الدفع» يفتح النافذة فقط ولا تظهر بيانات الحساب في الصفحة نفسها.
- [ ] أزرار واتساب تفتح الرقم الصحيح.
- [ ] نشر Supabase من `main` ناجح، والجداول والبحوث السبعة والحاويات ظاهرة دون تنفيذ SQL يدوي.
- [ ] Bucket `research-files` خاص وليس عاماً.
- [ ] تم اختبار طلب تجريبي وتأكد من سلوك «قيد المراجعة».
