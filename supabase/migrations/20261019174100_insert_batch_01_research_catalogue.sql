-- ============================================================================
-- Journalist — Batch 01 research catalogue (7 literature-review papers)
--
-- This is deliberately a production data migration, not supabase/seed.sql:
-- the GitHub "Deploy to production" flow applies migrations to production,
-- while ordinary seed files are for local/preview databases.
--
-- Upload each private DOCX to the `research-files` bucket using the exact
-- file_path below. Never make that bucket public and never commit the DOCX
-- files to this public GitHub repository.
-- ============================================================================

insert into public.researches (
  slug, title, short_summary, research_group, category, university, file_type,
  price_lyd, pages, word_count, year, level, language, abstract, cover_path,
  file_path, featured
) values
(
  'amr-public-health',
  'مقاومة المضادات الحيوية بوصفها تهديداً للصحة العامة: الأسباب والآثار واستراتيجيات المواجهة',
  'مراجعة تحليلية تشرح كيف تنشأ مقاومة المضادات وتنتشر، ولماذا يسرّعها الوصف العشوائي والصرف دون وصفة والاستعمال الحيواني، مع حلول عملية تشمل الإشراف على المضادات والترصد ومكافحة العدوى.',
  'بحوث طبية عامة', 'طب عام وصحة عامة', 'مراجعة أدبية موثقة', 'WORD', 120, 11, 2528, 2026, 'مراجعة أدبية', 'العربية + مستخلص إنجليزي',
  'بحث مراجعة أدبية حول آليات مقاومة المضادات ومحركاتها وآثارها واستراتيجيات مواجهتها على مستويات الرعاية والتشريع والترصد ومكافحة العدوى.',
  '01-amr.jpg', 'amr-public-health.docx', true
),
(
  'diabetes-primary-care',
  'تدبير داء السكري من النوع الثاني في الرعاية الصحية الأولية: من ضبط الغلوكوز إلى حماية القلب والكلى',
  'بحث عملي ينتقل من مجرد خفض السكر إلى حماية القلب والكلى وإدارة الوزن، ويعرض دور التثقيف ونمط الحياة والميتفورمين والفئات الحديثة، مع إطار متابعة واضح للمضاعفات.',
  'بحوث طبية عامة', 'طب الأسرة', 'مراجعة أدبية موثقة', 'WORD', 110, 10, 2158, 2026, 'مراجعة أدبية', 'العربية + مستخلص إنجليزي',
  'بحث مراجعة أدبية يترجم أدلة تدبير السكري الحديثة إلى متابعة عملية في الرعاية الأولية تشمل أهداف الغلوكوز والوزن وحماية القلب والكلى وفحص المضاعفات.',
  '02-diabetes.jpg', 'diabetes-primary-care.docx', true
),
(
  'lung-cancer',
  'سرطان الرئة: عوامل الخطورة والكشف المبكر وحدود العلاجات الحديثة',
  'مراجعة تتبع سرطان الرئة من التبغ والرادون وتلوث الهواء إلى التصنيف الجزيئي، وتشرح الكشف بالأشعة منخفضة الجرعة وخيارات العلاج بحسب المرحلة.',
  'أمراض السرطان', 'سرطان الرئة', 'مراجعة أدبية موثقة', 'WORD', 130, 10, 2119, 2026, 'مراجعة أدبية', 'العربية + مستخلص إنجليزي',
  'بحث مراجعة أدبية حول عوامل خطورة سرطان الرئة والتصنيف النسيجي والجزيئي والكشف المبكر والعلاجات الجراحية والإشعاعية والمناعية والموجهة.',
  '03-lung-cancer.jpg', 'lung-cancer.docx', true
),
(
  'prostate-cancer',
  'سرطان البروستاتا: جدل الفحص المبكر بمستضد البروستاتا ومسارات التشخيص والعلاج الحديثة',
  'بحث يوازن بين فائدة فحص PSA ومخاطر فرط التشخيص والعلاج، ويعرض دور الرنين المغناطيسي قبل الخزعة والمراقبة النشطة وعلاجات المرض المتقدم.',
  'أمراض السرطان', 'سرطان البروستاتا', 'مراجعة أدبية موثقة', 'WORD', 130, 11, 2263, 2026, 'مراجعة أدبية', 'العربية + مستخلص إنجليزي',
  'بحث مراجعة أدبية يناقش جدل فحص PSA والتشخيص الموجه بالرنين المغناطيسي وتقدير الخطورة والعلاج المتدرج من المراقبة النشطة حتى المرض المنتشر.',
  '04-prostate-cancer.jpg', 'prostate-cancer.docx', false
),
(
  'breast-cancer',
  'سرطان الثدي: الوعي والكشف المبكر بوصفهما مدخلاً لتحسين المآلات العلاجية',
  'مراجعة تركز على الوعي والكشف المبكر، وتشرح عوامل الخطورة والأنماط الهرمونية وHER2 والفروق بين وعي الثدي والفحص السريري والماموغرام.',
  'أمراض السرطان', 'سرطان الثدي', 'مراجعة أدبية موثقة', 'WORD', 130, 11, 2485, 2026, 'مراجعة أدبية', 'العربية + مستخلص إنجليزي',
  'بحث مراجعة أدبية عن عوامل خطورة سرطان الثدي وأنواعه البيولوجية وطرق الاكتشاف المبكر والتشخيص وتكامل العلاج، مع تركيز خاص على البيئات محدودة الموارد.',
  '05-breast-cancer.jpg', 'breast-cancer.docx', false
),
(
  'tesol-clt-efl',
  'Communicative Language Teaching in EFL Classrooms: Opportunities, Constraints, and Context-Sensitive Implementation',
  'بحث TESOL مكتوب بالإنجليزية يناقش تطبيق المنهج التواصلي في فصول تعليم الإنجليزية لغة أجنبية، وقيود الامتحانات وازدحام الفصول، مع تنفيذ حساس للسياق لا يهمل الدقة.',
  'TESOL — اللغة الإنجليزية', 'TESOL — اللغة الإنجليزية', 'Literature Review', 'WORD', 140, 12, 2667, 2026, 'Literature Review', 'English + ملخص عربي',
  'A literature review of communicative competence, CLT principles, EFL implementation constraints and context-sensitive post-method classroom implementation.',
  '06-tesol-clt.jpg', 'tesol-clt-efl.docx', false
),
(
  'tesol-mobile-vocabulary',
  'Technology-Assisted Vocabulary Learning in TESOL: Mobile Applications, Spaced Repetition, and Learner Autonomy',
  'بحث TESOL مكتوب بالإنجليزية يراجع تعلم مفردات اللغة بالتطبيقات وبطاقات الكلمات والتكرار المتباعد، ويربط الحفظ بالقراءة الواسعة ومهام الكلام والكتابة واستقلالية المتعلم.',
  'TESOL — اللغة الإنجليزية', 'TESOL — اللغة الإنجليزية', 'Literature Review', 'WORD', 140, 12, 2607, 2026, 'Literature Review', 'English + ملخص عربي',
  'A literature review of mobile-assisted vocabulary learning, spaced retrieval, word-knowledge depth, learner autonomy and receptive/productive assessment.',
  '07-tesol-mobile.jpg', 'tesol-mobile-vocabulary.docx', false
)
on conflict (slug) do update set
  title = excluded.title,
  short_summary = excluded.short_summary,
  research_group = excluded.research_group,
  category = excluded.category,
  university = excluded.university,
  file_type = excluded.file_type,
  price_lyd = excluded.price_lyd,
  pages = excluded.pages,
  word_count = excluded.word_count,
  year = excluded.year,
  level = excluded.level,
  language = excluded.language,
  abstract = excluded.abstract,
  cover_path = excluded.cover_path,
  file_path = excluded.file_path,
  featured = excluded.featured;

-- Fail the whole migration rather than silently deploying an incomplete
-- catalogue if one of the seven expected slugs was not written.
do $$
begin
  if (
    select count(*)
    from public.researches
    where slug in (
      'amr-public-health',
      'diabetes-primary-care',
      'lung-cancer',
      'prostate-cancer',
      'breast-cancer',
      'tesol-clt-efl',
      'tesol-mobile-vocabulary'
    )
  ) <> 7 then
    raise exception 'Batch 01 catalogue migration did not create all 7 researches';
  end if;
end;
$$;
