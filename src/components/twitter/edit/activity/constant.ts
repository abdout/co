export const CLUB_TYPES = [
  'رياضي',
  'ثقافي',
  'اجتماعي',
  'فني',
  'علمي',
  'أخرى'
] as const;

export const SKILLS = [
  'برمجة',
  'تصميم جرافيك',
  'تصوير',
  'كتابة محتوى',
  'ترجمة',
  'تحرير فيديو',
  'إدارة مشاريع',
  'تسويق رقمي',
  'تحليل بيانات',
  'تصميم مواقع',
  'إدارة وسائل التواصل',
  'تنظيم فعاليات',
  'خدمة عملاء',
  'تدريب وتعليم',
  'تصميم UX/UI',
  'تطوير تطبيقات',
  'إدارة قواعد بيانات',
  'تحليل نظم',
  'أمن سيبراني',
  'ذكاء اصطناعي'
] as const;

export const INTERESTS = [
  'تكنولوجيا',
  'فنون',
  'رياضة',
  'موسيقى',
  'قراءة',
  'كتابة',
  'سفر',
  'تصوير',
  'طبخ',
  'تعلم لغات',
  'عمل تطوعي',
  'حماية البيئة',
  'تنمية بشرية',
  'ريادة أعمال',
  'علوم',
  'سياسة',
  'تاريخ',
  'ثقافة',
  'تعليم',
  'صحة ولياقة'
] as const;

// Dropdown options for AutoComplete fields
export const PARTY_OPTIONS = [
  { value: " البعث العربي الاشتراكي", label: "حزب البعث العربي الاشتراكي" },
  { value: " الشيوعي السوري", label: "الحزب الشيوعي السوري" },
  { value: " الاتحاد الاشتراكي العربي", label: "حزب الاتحاد الاشتراكي العربي" },
  { value: " السوري القومي الاجتماعي", label: "الحزب السوري القومي الاجتماعي" },
  { value: " الشيوعي السوري (المكتب السياسي)", label: "الحزب الشيوعي السوري (المكتب السياسي)" },
  { value: " الديمقراطي السوري", label: "الحزب الديمقراطي السوري" },
];

export const UNION_OPTIONS = [
  { value: "نقابة المعلمين", label: "نقابة المعلمين" },
  { value: "نقابة المهندسين", label: "نقابة المهندسين" },
  { value: "نقابة الأطباء", label: "نقابة الأطباء" },
  { value: "نقابة المحامين", label: "نقابة المحامين" },
  { value: "نقابة الصيادلة", label: "نقابة الصيادلة" },
  { value: "نقابة الصحفيين", label: "نقابة الصحفيين" },
  { value: "نقابة الفنانين", label: "نقابة الفنانين" },
  { value: "نقابة العمال", label: "نقابة العمال" },
];

export const NGO_OPTIONS = [
  { value: "الهلال الأحمر السوري", label: "الهلال الأحمر السوري" },
  { value: "جمعية البر والإحسان", label: "جمعية البر والإحسان" },
  { value: "منظمة المرأة السورية", label: "منظمة المرأة السورية" },
  { value: "جمعية رعاية الأيتام", label: "جمعية رعاية الأيتام" },
  { value: "مؤسسة الشام الخيرية", label: "مؤسسة الشام الخيرية" },
  { value: "جمعية حماية البيئة", label: "جمعية حماية البيئة" },
];

export const NGO_ACTIVITY_OPTIONS = [
  { value: "تعليم", label: "تعليم" },
  { value: "صحة", label: "صحة" },
  { value: "إغاثة", label: "إغاثة" },
  { value: "تنمية مجتمعية", label: "تنمية مجتمعية" },
  { value: "دعم نفسي", label: "دعم نفسي" },
  { value: "حماية البيئة", label: "حماية البيئة" },
  { value: "ثقافة وفنون", label: "ثقافة وفنون" },
  { value: "تمكين المرأة", label: "تمكين المرأة" },
];

export const CLUB_OPTIONS = [
  { value: "نادي الجلاء الرياضي", label: "نادي الجلاء الرياضي" },
  { value: "نادي الوحدة", label: "نادي الوحدة" },
  { value: "نادي تشرين", label: "نادي تشرين" },
  { value: "نادي الكرامة", label: "نادي الكرامة" },
  { value: "نادي الاتحاد", label: "نادي الاتحاد" },
  { value: "نادي حطين", label: "نادي حطين" },
];

export const CLUB_TYPE_OPTIONS = [
  { value: "كرة قدم", label: "كرة قدم" },
  { value: "كرة سلة", label: "كرة سلة" },
  { value: "كرة طائرة", label: "كرة طائرة" },
  { value: "سباحة", label: "سباحة" },
  { value: "تنس", label: "تنس" },
  { value: "كاراتيه", label: "كاراتيه" },
  { value: "جودو", label: "جودو" },
  { value: "مصارعة", label: "مصارعة" },
];

export const VOLUNTARY_OPTIONS = [
  { value: "الهلال الأحمر", label: "الهلال الأحمر" },
  { value: "كشافة", label: "كشافة" },
  { value: "مبادرات تطوعية", label: "مبادرات تطوعية" },
  { value: "قوافل إغاثة", label: "قوافل إغاثة" },
  { value: "حملات تنظيف", label: "حملات تنظيف" },
  { value: "تعليم وتدريب", label: "تعليم وتدريب" },
];

export const VOLUNTARY_ROLE_OPTIONS = [
  { value: "متطوع", label: "متطوع" },
  { value: "منسق", label: "منسق" },
  { value: "قائد فريق", label: "قائد فريق" },
  { value: "مدرب", label: "مدرب" },
  { value: "مساعد إداري", label: "مساعد إداري" },
  { value: "مسؤول تواصل", label: "مسؤول تواصل" },
];

export type ActivityFieldName = 
  | 'partyMember' | 'partyName' | 'partyStartDate' | 'partyEndDate'
  | 'unionMember' | 'unionName' | 'unionStartDate' | 'unionEndDate'
  | 'ngoMember' | 'ngoName' | 'ngoActivity'
  | 'clubMember' | 'clubName' | 'clubType'
  | 'voluntaryMember' | 'voluntaryName' | 'voluntaryRole' | 'voluntaryStartDate' | 'voluntaryEndDate'
  | 'skills' | 'interests';

type ActivityField = {
  name: ActivityFieldName;
  label: string;
  type: 'toggle' | 'text' | 'date' | 'textarea' | 'select';
  conditional?: ActivityFieldName;
  options?: readonly string[];
};

export const ACTIVITY_FIELDS: {
  political: ActivityField[];
  union: ActivityField[];
  social: ActivityField[];
  club: ActivityField[];
} = {
  political: [
    { name: 'partyMember' as const, label: 'عضو في حزب/حركة سياسية', type: 'toggle' },
    { name: 'partyName' as const, label: 'اسم الحزب/الحركة', type: 'text', conditional: 'partyMember' },
    { name: 'partyStartDate' as const, label: 'تاريخ البداية', type: 'date', conditional: 'partyMember' },
    { name: 'partyEndDate' as const, label: 'تاريخ النهاية', type: 'date', conditional: 'partyMember' },
  ],
  union: [
    { name: 'unionMember' as const, label: 'عضو في نقابة/اتحاد طلابي', type: 'toggle' },
    { name: 'unionName' as const, label: 'اسم النقابة/الاتحاد', type: 'text', conditional: 'unionMember' },
    { name: 'unionStartDate' as const, label: 'تاريخ البداية', type: 'date', conditional: 'unionMember' },
    { name: 'unionEndDate' as const, label: 'تاريخ النهاية', type: 'date', conditional: 'unionMember' },
  ],
  social: [
    { name: 'ngoMember' as const, label: 'عضو في منظمة/مجموعة ثقافية', type: 'toggle' },
    { name: 'ngoName' as const, label: 'اسم المنظمة/المجموعة', type: 'text', conditional: 'ngoMember' },
    { name: 'ngoActivity' as const, label: 'وصف النشاط', type: 'textarea', conditional: 'ngoMember' },
  ],
  club: [
    { name: 'clubMember' as const, label: 'عضو في نادي شبابي', type: 'toggle' },
    { name: 'clubName' as const, label: 'اسم النادي', type: 'text', conditional: 'clubMember' },
    { name: 'clubType' as const, label: 'نوع النادي', type: 'select', options: CLUB_TYPES, conditional: 'clubMember' },
  ],
} as const; 