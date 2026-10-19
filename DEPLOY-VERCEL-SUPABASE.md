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
2. ادخل إلى Vercel بحساب GitHub الذي يملك مستودع `Gentely/this-is-me`.
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

## ثانياً: إنشاء Supabase وتنفيذ قاعدة البيانات

1. أنشئ مشروعاً جديداً في Supabase، واحفظ كلمة مرور قاعدة البيانات في مكان آمن.
2. من **SQL Editor** نفّذ محتوى `supabase/schema.sql` أولاً.
3. نفّذ بعد ذلك `supabase/seed-researches.sql`. سيُدخل هذا الملف بحوث الدفعة الأولى السبعة بعناوينها ونبذاتها وأسعارها ومسارات ملفاتها، ويمكن تنفيذه مرة أخرى لتحديث الصفوف نفسها بفضل `on conflict (slug)`.
4. افتح نافذة **Connect** أعلى مشروع Supabase، أو **Settings → API Keys**، ثم انسخ:
   - Project URL إلى `NEXT_PUBLIC_SUPABASE_URL`
   - **Publishable key** إلى `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - في المشاريع القديمة فقط: مفتاح `anon` إلى `NEXT_PUBLIC_SUPABASE_ANON_KEY` بدلاً من Publishable.
   لا تنسخ أي مفتاح يبدأ بـ `sb_secret_` إلى المتصفح أو Vercel public variables.
5. أضف المتغيرات في ملف `.env.local` محلياً، وفي إعدادات Vercel للإنتاج، ثم أعد نشر الموقع بعد تغيير المتغيرات.

## ثالثاً: إعداد Storage ورفع الأغلفة والملفات

من **Storage** أنشئ ثلاث حاويات Buckets:

| Bucket | الخصوصية | الاستخدام |
|---|---|---|
| `covers` | Public | صور أغلفة البحوث |
| `research-files` | Private | ملفات DOCX الكاملة؛ لا تجعلها عامة |
| `receipts` | Private | صور إيصالات التحويل |

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
4. بعد إنشاء الحساب و وجود صف له في `public.profiles`، اجعله مديراً بتنفيذ الاستعلام الموجود في نهاية `supabase/schema.sql` مع بريدك.

## خامساً: نقطة برمجية مهمة قبل البيع الفعلي

ربط المفاتيح وتنفيذ قاعدة البيانات ورفع الملفات يجهز البنية التحتية، لكنه لا يحوّل تلقائياً كل شاشات النسخة الحالية من وضع العرض التجريبي إلى العمل الكامل من قاعدة البيانات.

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
- [ ] مشروع Supabase يحتوي الجداول والبذرة والحاويات.
- [ ] Bucket `research-files` خاص وليس عاماً.
- [ ] تم اختبار طلب تجريبي وتأكد من سلوك «قيد المراجعة».
