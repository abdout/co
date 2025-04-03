'use client'
import { AnimatedHierarchicalSelect, SelectionStep } from "../atom/hierarchical-select"
import { Option } from "../atom/auto-complete"

// Sample location data
const COUNTRIES: Option[] = [
  { value: "sudan", label: "السودان" },
  { value: "egypt", label: "مصر" },
  { value: "saudi_arabia", label: "السعودية" },
  { value: "jordan", label: "الأردن" },
  { value: "libya", label: "ليبيا" },
  { value: "south_sudan", label: "جنوب السودان" },
  { value: "eritrea", label: "إريتريا" },
  { value: "yemen", label: "اليمن" },
]

// Sample states/provinces by country
const STATES: Record<string, Option[]> = {
  "sudan": [
    { value: "khartoum_state", label: "ولاية الخرطوم" },
    { value: "river_nile", label: "نهر النيل" },
    { value: "kassala", label: "كسلا" }
  ],
  "egypt": [
    { value: "cairo_gov", label: "محافظة القاهرة" },
    { value: "alexandria_gov", label: "محافظة الإسكندرية" },
    { value: "luxor_gov", label: "محافظة الأقصر" }
  ],
  "saudi_arabia": [
    { value: "riyadh_province", label: "منطقة الرياض" },
    { value: "makkah_province", label: "منطقة مكة المكرمة" },
    { value: "eastern_province", label: "المنطقة الشرقية" }
  ],
  "jordan": [
    { value: "amman_gov", label: "محافظة عمان" },
    { value: "zarqa_gov", label: "محافظة الزرقاء" },
    { value: "irbid_gov", label: "محافظة إربد" }
  ],
  "libya": [
    { value: "tripoli_gov", label: "محافظة طرابلس" },
    { value: "benghazi_gov", label: "محافظة بنغازي" },
    { value: "misrata_gov", label: "محافظة مصراتة" }
  ],
  "south_sudan": [
    { value: "central_equatoria", label: "ولاية الاستوائية الوسطى" },
    { value: "jonglei", label: "ولاية جونقلي" },
    { value: "unity", label: "ولاية الوحدة" }
  ],
  "eritrea": [
    { value: "maekel", label: "إقليم ماكل" },
    { value: "anseba", label: "إقليم عنسبا" },
    { value: "gash_barka", label: "إقليم قاش بركة" }
  ],
  "yemen": [
    { value: "sanaa_gov", label: "محافظة صنعاء" },
    { value: "aden_gov", label: "محافظة عدن" },
    { value: "taiz_gov", label: "محافظة تعز" }
  ]
}

// Sample localities (larger city areas) by state
const LOCALITIES: Record<string, Option[]> = {
  "khartoum_state": [
    { value: "khartoum_locality", label: "محلية الخرطوم" },
    { value: "omdurman_locality", label: "محلية أم درمان" },
    { value: "bahri_locality", label: "محلية بحري" }
  ],
  "river_nile": [
    { value: "atbara_locality", label: "محلية عطبرة" },
    { value: "damar_locality", label: "محلية الدامر" },
    { value: "shendi_locality", label: "محلية شندي" }
  ],
  "kassala": [
    { value: "kassala_city_locality", label: "محلية كسلا المدينة" },
    { value: "halfa_locality", label: "محلية حلفا" },
    { value: "aroma_locality", label: "محلية أروما" }
  ],
  "cairo_gov": [
    { value: "cairo_east", label: "القاهرة الشرقية" },
    { value: "cairo_west", label: "القاهرة الغربية" },
    { value: "cairo_central", label: "وسط القاهرة" }
  ],
  "alexandria_gov": [
    { value: "montazah_locality", label: "المنتزه" },
    { value: "agami_locality", label: "العجمي" },
    { value: "amriya_locality", label: "العامرية" }
  ],
  "luxor_gov": [
    { value: "luxor_city_locality", label: "مدينة الأقصر" },
    { value: "karnak_locality", label: "الكرنك" },
    { value: "thebes_locality", label: "طيبة" }
  ],
  "riyadh_province": [
    { value: "riyadh_city_area", label: "منطقة مدينة الرياض" },
    { value: "diriyah_area", label: "منطقة الدرعية" },
    { value: "kharj_area", label: "منطقة الخرج" }
  ],
  "makkah_province": [
    { value: "makkah_city_locality", label: "منطقة مكة المكرمة" },
    { value: "jeddah_locality", label: "منطقة جدة" },
    { value: "taif_locality", label: "منطقة الطائف" }
  ],
  "eastern_province": [
    { value: "dammam_locality", label: "منطقة الدمام" },
    { value: "dhahran_locality", label: "منطقة الظهران" },
    { value: "khobar_locality", label: "منطقة الخبر" }
  ],
  "amman_gov": [
    { value: "amman_central", label: "وسط عمان" },
    { value: "amman_north", label: "شمال عمان" },
    { value: "amman_south", label: "جنوب عمان" }
  ],
  "zarqa_gov": [
    { value: "zarqa_city", label: "مدينة الزرقاء" },
    { value: "russeifa", label: "الرصيفة" },
    { value: "hashemiya", label: "الهاشمية" }
  ],
  "irbid_gov": [
    { value: "irbid_city", label: "مدينة إربد" },
    { value: "ramtha", label: "الرمثا" },
    { value: "husn", label: "الحصن" }
  ],
  "tripoli_gov": [
    { value: "tripoli_central", label: "وسط طرابلس" },
    { value: "janzour", label: "جنزور" },
    { value: "tajoura", label: "تاجوراء" }
  ],
  "benghazi_gov": [
    { value: "benghazi_central", label: "وسط بنغازي" },
    { value: "benghazi_north", label: "شمال بنغازي" },
    { value: "benghazi_south", label: "جنوب بنغازي" }
  ],
  "misrata_gov": [
    { value: "misrata_central", label: "وسط مصراتة" },
    { value: "tawergha", label: "تاورغاء" },
    { value: "zliten", label: "زليتن" }
  ],
  "central_equatoria": [
    { value: "juba", label: "جوبا" },
    { value: "yei", label: "يي" },
    { value: "kajo_keji", label: "كاجو كيجي" }
  ],
  "jonglei": [
    { value: "bor", label: "بور" },
    { value: "pibor", label: "بيبور" },
    { value: "akobo", label: "أكوبو" }
  ],
  "unity": [
    { value: "bentiu", label: "بانتيو" },
    { value: "mayom", label: "مايوم" },
    { value: "leer", label: "لير" }
  ],
  "maekel": [
    { value: "asmara", label: "أسمرا" },
    { value: "serejaka", label: "سريجاكا" },
    { value: "emberemi", label: "إمبيريمي" }
  ],
  "anseba": [
    { value: "keren", label: "كيرين" },
    { value: "hagaz", label: "حقاز" },
    { value: "elabered", label: "العابد" }
  ],
  "gash_barka": [
    { value: "barentu", label: "بارنتو" },
    { value: "agordat", label: "أقردات" },
    { value: "teseney", label: "تسني" }
  ],
  "sanaa_gov": [
    { value: "sanaa_city", label: "مدينة صنعاء" },
    { value: "bani_harith", label: "بني حارث" },
    { value: "arhab", label: "أرحب" }
  ],
  "aden_gov": [
    { value: "crater", label: "كريتر" },
    { value: "maalla", label: "المعلا" },
    { value: "tawahi", label: "التواهي" }
  ],
  "taiz_gov": [
    { value: "taiz_city", label: "مدينة تعز" },
    { value: "maqbanah", label: "مقبنة" },
    { value: "almaafir", label: "المعافر" }
  ]
}

// Sample admin units (smaller administrative divisions) by locality
const ADMIN_UNITS: Record<string, Option[]> = {
  "khartoum_locality": [
    { value: "khartoum_downtown", label: "وسط الخرطوم" },
    { value: "khartoum_east", label: "شرق الخرطوم" },
    { value: "khartoum_south", label: "جنوب الخرطوم" }
  ],
  "omdurman_locality": [
    { value: "omdurman_central", label: "وسط أم درمان" },
    { value: "omdurman_north", label: "شمال أم درمان" },
    { value: "karari", label: "كرري" }
  ],
  "bahri_locality": [
    { value: "bahri_central", label: "وسط بحري" },
    { value: "shambat", label: "شمبات" },
    { value: "halfaya", label: "حلفايا" }
  ],
  "atbara_locality": [
    { value: "atbara_central", label: "وسط عطبرة" },
    { value: "atbara_north", label: "شمال عطبرة" },
    { value: "atbara_industrial", label: "عطبرة الصناعية" }
  ],
  "damar_locality": [
    { value: "damar_central", label: "وسط الدامر" },
    { value: "damar_east", label: "شرق الدامر" },
    { value: "damar_west", label: "غرب الدامر" }
  ],
  "shendi_locality": [
    { value: "shendi_central", label: "وسط شندي" },
    { value: "shendi_north", label: "شمال شندي" },
    { value: "shendi_south", label: "جنوب شندي" }
  ],
  "kassala_city_locality": [
    { value: "kassala_central", label: "وسط كسلا" },
    { value: "kassala_north", label: "شمال كسلا" },
    { value: "khatmiya", label: "الختمية" }
  ],
  "halfa_locality": [
    { value: "halfa_central", label: "وسط حلفا" },
    { value: "halfa_east", label: "شرق حلفا" },
    { value: "halfa_industrial", label: "حلفا الصناعية" }
  ],
  "aroma_locality": [
    { value: "aroma_central", label: "وسط أروما" },
    { value: "aroma_north", label: "شمال أروما" },
    { value: "aroma_south", label: "جنوب أروما" }
  ],
  "cairo_east": [
    { value: "nasr_city", label: "مدينة نصر" },
    { value: "heliopolis", label: "مصر الجديدة" },
    { value: "maadi", label: "المعادي" }
  ],
  "cairo_west": [
    { value: "dokki", label: "الدقي" },
    { value: "mohandessin", label: "المهندسين" },
    { value: "giza", label: "الجيزة" }
  ],
  "cairo_central": [
    { value: "downtown_cairo", label: "وسط البلد" },
    { value: "garden_city", label: "جاردن سيتي" },
    { value: "zamalek", label: "الزمالك" }
  ],
  "montazah_locality": [
    { value: "montazah_first", label: "المنتزه الأول" },
    { value: "montazah_second", label: "المنتزه الثاني" },
    { value: "abu_qir", label: "أبو قير" }
  ],
  "agami_locality": [
    { value: "agami_central", label: "وسط العجمي" },
    { value: "hanoville", label: "هانوفيل" },
    { value: "bitash", label: "البيطاش" }
  ],
  "amriya_locality": [
    { value: "amriya_first", label: "العامرية الأولى" },
    { value: "amriya_second", label: "العامرية الثانية" },
    { value: "king_mariout", label: "الملك مريوط" }
  ],
  "luxor_city_locality": [
    { value: "luxor_central", label: "وسط الأقصر" },
    { value: "luxor_east", label: "شرق الأقصر" },
    { value: "luxor_west", label: "غرب الأقصر" }
  ],
  "karnak_locality": [
    { value: "karnak_central", label: "وسط الكرنك" },
    { value: "karnak_north", label: "شمال الكرنك" },
    { value: "karnak_south", label: "جنوب الكرنك" }
  ],
  "thebes_locality": [
    { value: "thebes_central", label: "وسط طيبة" },
    { value: "thebes_east", label: "شرق طيبة" },
    { value: "thebes_west", label: "غرب طيبة" }
  ],
  "riyadh_city_area": [
    { value: "olaya_district", label: "حي العليا" },
    { value: "malaz_district", label: "حي الملز" },
    { value: "sulaimaniyah_district", label: "حي السليمانية" }
  ],
  "diriyah_area": [
    { value: "diriyah_central", label: "وسط الدرعية" },
    { value: "diriyah_north", label: "شمال الدرعية" },
    { value: "diriyah_south", label: "جنوب الدرعية" }
  ],
  "kharj_area": [
    { value: "kharj_central", label: "وسط الخرج" },
    { value: "kharj_industrial", label: "الخرج الصناعية" },
    { value: "kharj_agricultural", label: "الخرج الزراعية" }
  ],
  "makkah_city_locality": [
    { value: "aziziyah", label: "العزيزية" },
    { value: "haram_district", label: "حي الحرم" },
    { value: "jarwal", label: "جرول" }
  ],
  "jeddah_locality": [
    { value: "jeddah_downtown", label: "وسط جدة" },
    { value: "obhur", label: "أبحر" },
    { value: "balad", label: "البلد" }
  ],
  "taif_locality": [
    { value: "taif_central", label: "وسط الطائف" },
    { value: "shafa", label: "الشفا" },
    { value: "hawiyah", label: "الهدا" }
  ],
  "dammam_locality": [
    { value: "dammam_central", label: "وسط الدمام" },
    { value: "dammam_north", label: "شمال الدمام" },
    { value: "dammam_south", label: "جنوب الدمام" }
  ],
  "dhahran_locality": [
    { value: "dhahran_central", label: "وسط الظهران" },
    { value: "aramco_compound", label: "مجمع أرامكو" },
    { value: "dhahran_airport", label: "مطار الظهران" }
  ],
  "khobar_locality": [
    { value: "khobar_north", label: "الخبر الشمالية" },
    { value: "thuqbah", label: "الثقبة" },
    { value: "corniche", label: "الكورنيش" }
  ],
  "amman_central": [
    { value: "abdali_district", label: "حي العبدلي" },
    { value: "jabal_amman", label: "جبل عمان" },
    { value: "sweifieh", label: "الصويفية" }
  ],
  "amman_north": [
    { value: "shmeisani", label: "الشميساني" },
    { value: "tla_ali", label: "تلاع العلي" },
    { value: "jubeiha", label: "الجبيهة" }
  ],
  "amman_south": [
    { value: "qweismeh", label: "القويسمة" },
    { value: "sahab", label: "سحاب" },
    { value: "marka", label: "ماركا" }
  ],
  "tripoli_central": [
    { value: "tripoli_downtown", label: "وسط طرابلس" },
    { value: "tripoli_port", label: "ميناء طرابلس" },
    { value: "tripoli_castle", label: "قلعة طرابلس" }
  ],
  "juba": [
    { value: "juba_central", label: "وسط جوبا" },
    { value: "juba_north", label: "شمال جوبا" },
    { value: "juba_south", label: "جنوب جوبا" }
  ],
  "asmara": [
    { value: "asmara_central", label: "وسط أسمرا" },
    { value: "asmara_north", label: "شمال أسمرا" },
    { value: "asmara_south", label: "جنوب أسمرا" }
  ],
  "sanaa_city": [
    { value: "sanaa_old_city", label: "صنعاء القديمة" },
    { value: "sanaa_new_city", label: "صنعاء الجديدة" },
    { value: "sanaa_university", label: "جامعة صنعاء" }
  ]
}

// Sample neighborhoods by admin unit
const NEIGHBORHOODS: Record<string, Option[]> = {
  "khartoum_downtown": [
    { value: "almogran", label: "المقرن" },
    { value: "riyadh_khartoum", label: "الرياض" },
    { value: "alshaheed", label: "الشهيد" }
  ],
  "khartoum_east": [
    { value: "alsahafa", label: "الصحافة" },
    { value: "burri", label: "بري" },
    { value: "almamoura", label: "المعمورة" }
  ],
  "khartoum_south": [
    { value: "alazhari", label: "الأزهري" },
    { value: "jabra", label: "جبرة" },
    { value: "alkadarow", label: "الكدرو" }
  ],
  "omdurman_central": [
    { value: "wad_nubawi", label: "ود نوباوي" },
    { value: "beitelmal", label: "بيت المال" },
    { value: "almulazmeen", label: "الملازمين" }
  ],
  "omdurman_north": [
    { value: "ombada", label: "أمبدة" },
    { value: "thawra", label: "الثورة" },
    { value: "wad_albashir", label: "ود البشير" }
  ],
  "karari": [
    { value: "karari_central", label: "وسط كرري" },
    { value: "karari_north", label: "شمال كرري" },
    { value: "karari_south", label: "جنوب كرري" }
  ],
  "bahri_central": [
    { value: "bahri_market", label: "سوق بحري" },
    { value: "bahri_industrial", label: "بحري الصناعية" },
    { value: "kober", label: "كوبر" }
  ],
  "shambat": [
    { value: "shambat_university", label: "شمبات الجامعة" },
    { value: "shambat_residential", label: "شمبات السكنية" },
    { value: "shambat_agricultural", label: "شمبات الزراعية" }
  ],
  "halfaya": [
    { value: "halfaya_central", label: "وسط حلفايا" },
    { value: "halfaya_east", label: "شرق حلفايا" },
    { value: "halfaya_west", label: "غرب حلفايا" }
  ],
  "atbara_central": [
    { value: "atbara_market", label: "سوق عطبرة" },
    { value: "railway_district", label: "حي السكة حديد" },
    { value: "atbara_stadium", label: "عطبرة الإستاد" }
  ],
  "atbara_north": [
    { value: "new_atbara", label: "عطبرة الجديدة" },
    { value: "atbara_gardens", label: "حدائق عطبرة" },
    { value: "atbara_extension", label: "امتداد عطبرة" }
  ],
  "atbara_industrial": [
    { value: "factory_district", label: "حي المصانع" },
    { value: "cement_district", label: "حي الأسمنت" },
    { value: "workshop_district", label: "حي الورش" }
  ],
  "damar_central": [
    { value: "damar_market", label: "سوق الدامر" },
    { value: "damar_plaza", label: "ميدان الدامر" },
    { value: "damar_residential", label: "الدامر السكني" }
  ],
  "shendi_central": [
    { value: "shendi_market", label: "سوق شندي" },
    { value: "shendi_old", label: "شندي القديمة" },
    { value: "shendi_new", label: "شندي الجديدة" }
  ],
  "kassala_central": [
    { value: "kassala_market", label: "سوق كسلا" },
    { value: "kassala_old", label: "كسلا القديمة" },
    { value: "kassala_new", label: "كسلا الجديدة" }
  ],
  "halfa_central": [
    { value: "halfa_market", label: "سوق حلفا" },
    { value: "halfa_residential", label: "حلفا السكني" },
    { value: "halfa_extension", label: "امتداد حلفا" }
  ],
  "nasr_city": [
    { value: "first_zone", label: "المنطقة الأولى" },
    { value: "seventh_zone", label: "المنطقة السابعة" },
    { value: "eighth_zone", label: "المنطقة الثامنة" }
  ],
  "heliopolis": [
    { value: "korba", label: "الكوربة" },
    { value: "triumph", label: "تريومف" },
    { value: "cleopatra", label: "كليوباترا" }
  ],
  "maadi": [
    { value: "maadi_sarayat", label: "المعادي سرايات" },
    { value: "maadi_degla", label: "المعادي دجلة" },
    { value: "maadi_zahraa", label: "المعادي زهراء" }
  ],
  "dokki": [
    { value: "dokki_central", label: "وسط الدقي" },
    { value: "mesaha", label: "المساحة" },
    { value: "tahrir_square", label: "ميدان التحرير" }
  ],
  "mohandessin": [
    { value: "lebanon_square", label: "ميدان لبنان" },
    { value: "sphinx_square", label: "ميدان سفينكس" },
    { value: "gameat_dowal", label: "جامعة الدول" }
  ],
  "downtown_cairo": [
    { value: "tahrir_square", label: "ميدان التحرير" },
    { value: "talaat_harb", label: "طلعت حرب" },
    { value: "azbakeya", label: "الأزبكية" }
  ],
  "garden_city": [
    { value: "garden_city_central", label: "وسط جاردن سيتي" },
    { value: "garden_city_embassy", label: "جاردن سيتي السفارات" },
    { value: "garden_city_nile", label: "جاردن سيتي النيل" }
  ],
  "zamalek": [
    { value: "zamalek_north", label: "الزمالك الشمالي" },
    { value: "zamalek_south", label: "الزمالك الجنوبي" },
    { value: "zamalek_central", label: "وسط الزمالك" }
  ],
  "montazah_first": [
    { value: "montazah_palace", label: "قصر المنتزه" },
    { value: "montazah_beach", label: "شاطئ المنتزه" },
    { value: "montazah_gardens", label: "حدائق المنتزه" }
  ],
  "agami_central": [
    { value: "agami_beach", label: "شاطئ العجمي" },
    { value: "agami_residential", label: "العجمي السكني" },
    { value: "agami_market", label: "سوق العجمي" }
  ],
  "luxor_central": [
    { value: "luxor_temple", label: "معبد الأقصر" },
    { value: "luxor_market", label: "سوق الأقصر" },
    { value: "luxor_corniche", label: "كورنيش الأقصر" }
  ],
  "olaya_district": [
    { value: "olaya_north", label: "العليا الشمالية" },
    { value: "olaya_center", label: "وسط العليا" },
    { value: "olaya_south", label: "العليا الجنوبية" }
  ],
  "malaz_district": [
    { value: "malaz_central", label: "وسط الملز" },
    { value: "malaz_university", label: "الملز الجامعي" },
    { value: "malaz_residential", label: "الملز السكني" }
  ],
  "sulaimaniyah_district": [
    { value: "sulaimaniyah_central", label: "وسط السليمانية" },
    { value: "sulaimaniyah_north", label: "السليمانية الشمالية" },
    { value: "sulaimaniyah_east", label: "السليمانية الشرقية" }
  ],
  "diriyah_central": [
    { value: "diriyah_historic", label: "الدرعية التاريخية" },
    { value: "diriyah_new", label: "الدرعية الجديدة" },
    { value: "diriyah_museum", label: "متحف الدرعية" }
  ],
  "kharj_central": [
    { value: "kharj_market", label: "سوق الخرج" },
    { value: "kharj_residential", label: "الخرج السكني" },
    { value: "kharj_plaza", label: "ميدان الخرج" }
  ],
  "aziziyah": [
    { value: "aziziyah_central", label: "وسط العزيزية" },
    { value: "aziziyah_north", label: "العزيزية الشمالية" },
    { value: "aziziyah_south", label: "العزيزية الجنوبية" }
  ],
  "haram_district": [
    { value: "haram_central", label: "وسط الحرم" },
    { value: "haram_east", label: "شرق الحرم" },
    { value: "haram_west", label: "غرب الحرم" }
  ],
  "jeddah_downtown": [
    { value: "jeddah_corniche", label: "كورنيش جدة" },
    { value: "jeddah_market", label: "سوق جدة" },
    { value: "jeddah_old", label: "جدة القديمة" }
  ],
  "dammam_central": [
    { value: "dammam_corniche", label: "كورنيش الدمام" },
    { value: "dammam_market", label: "سوق الدمام" },
    { value: "dammam_plaza", label: "ميدان الدمام" }
  ],
  "dhahran_central": [
    { value: "dhahran_mall", label: "مول الظهران" },
    { value: "dhahran_residential", label: "الظهران السكني" },
    { value: "dhahran_park", label: "حديقة الظهران" }
  ],
  "khobar_north": [
    { value: "khobar_corniche", label: "كورنيش الخبر" },
    { value: "khobar_mall", label: "مول الخبر" },
    { value: "khobar_towers", label: "أبراج الخبر" }
  ],
  "abdali_district": [
    { value: "abdali_boulevard", label: "بوليفارد العبدلي" },
    { value: "abdali_mall", label: "مول العبدلي" },
    { value: "abdali_park", label: "حديقة العبدلي" }
  ],
  "jabal_amman": [
    { value: "first_circle", label: "الدوار الأول" },
    { value: "rainbow_street", label: "شارع الرينبو" },
    { value: "third_circle", label: "الدوار الثالث" }
  ],
  "sweifieh": [
    { value: "sweifieh_gardens", label: "حدائق الصويفية" },
    { value: "sweifieh_central", label: "وسط الصويفية" },
    { value: "sweifieh_commercial", label: "الصويفية التجاري" }
  ],
  "shmeisani": [
    { value: "shmeisani_central", label: "وسط الشميساني" },
    { value: "shmeisani_gardens", label: "حدائق الشميساني" },
    { value: "shmeisani_towers", label: "أبراج الشميساني" }
  ],
  "tripoli_downtown": [
    { value: "tripoli_oldtown", label: "المدينة القديمة" },
    { value: "tripoli_martyrs_square", label: "ميدان الشهداء" },
    { value: "tripoli_souq", label: "سوق طرابلس" }
  ],
  "juba_central": [
    { value: "juba_downtown", label: "وسط جوبا" },
    { value: "juba_residential", label: "جوبا السكني" },
    { value: "juba_ministries", label: "حي الوزارات" }
  ],
  "asmara_central": [
    { value: "asmara_oldtown", label: "أسمرا القديمة" },
    { value: "asmara_market", label: "سوق أسمرا" },
    { value: "asmara_cathedral", label: "كاتدرائية أسمرا" }
  ],
  "sanaa_old_city": [
    { value: "sanaa_gates", label: "بوابات صنعاء" },
    { value: "sanaa_souq", label: "سوق صنعاء القديم" },
    { value: "sanaa_heritage", label: "صنعاء التراثية" }
  ],
  "sanaa_new_city": [
    { value: "sanaa_modern", label: "صنعاء الحديثة" },
    { value: "sanaa_embassies", label: "حي السفارات" },
    { value: "sanaa_commercial", label: "صنعاء التجارية" }
  ]
}

// Direct mappings for simplified mode
const DIRECT_LOCALITIES: Record<string, Option[]> = {
  "sudan": [
    { value: "khartoum_locality", label: "الخرطوم" },
    { value: "omdurman_locality", label: "أم درمان" },
    { value: "bahri_locality", label: "بحري" }
  ],
  "egypt": [
    { value: "cairo_east", label: "القاهرة" },
    { value: "alexandria", label: "الإسكندرية" },
    { value: "luxor", label: "الأقصر" }
  ],
  "saudi_arabia": [
    { value: "riyadh_city_area", label: "الرياض" },
    { value: "jeddah", label: "جدة" },
    { value: "mecca", label: "مكة" }
  ],
  "jordan": [
    { value: "amman_central", label: "عمان" },
    { value: "zarqa_city", label: "الزرقاء" },
    { value: "irbid_city", label: "إربد" }
  ],
  "libya": [
    { value: "tripoli_central", label: "طرابلس" },
    { value: "benghazi_central", label: "بنغازي" },
    { value: "misrata_central", label: "مصراتة" }
  ],
  "south_sudan": [
    { value: "juba", label: "جوبا" },
    { value: "wau", label: "واو" },
    { value: "malakal", label: "ملكال" }
  ],
  "eritrea": [
    { value: "asmara", label: "أسمرا" },
    { value: "keren", label: "كيرين" },
    { value: "massawa", label: "مصوع" }
  ],
  "yemen": [
    { value: "sanaa_city", label: "صنعاء" },
    { value: "crater", label: "عدن" },
    { value: "taiz_city", label: "تعز" }
  ]
}

const DIRECT_ADMIN_UNITS: Record<string, Option[]> = {
  "khartoum_locality": [
    { value: "khartoum_downtown", label: "وسط الخرطوم" },
    { value: "khartoum_east", label: "شرق الخرطوم" },
    { value: "khartoum_south", label: "جنوب الخرطوم" }
  ],
  "cairo_east": [
    { value: "nasr_city", label: "مدينة نصر" },
    { value: "downtown", label: "وسط البلد" },
    { value: "zamalek", label: "الزمالك" }
  ],
  "riyadh_city_area": [
    { value: "olaya_district", label: "حي العليا" },
    { value: "malaz_district", label: "حي الملز" },
    { value: "sulaimaniyah_district", label: "حي السليمانية" }
  ],
  "amman_central": [
    { value: "abdali_district", label: "حي العبدلي" },
    { value: "jabal_amman", label: "جبل عمان" },
    { value: "sweifieh", label: "الصويفية" }
  ],
  "tripoli_central": [
    { value: "tripoli_downtown", label: "وسط طرابلس" },
    { value: "tripoli_port", label: "ميناء طرابلس" },
    { value: "tripoli_castle", label: "قلعة طرابلس" }
  ],
  "juba": [
    { value: "juba_central", label: "وسط جوبا" },
    { value: "juba_north", label: "شمال جوبا" },
    { value: "juba_south", label: "جنوب جوبا" }
  ],
  "asmara": [
    { value: "asmara_central", label: "وسط أسمرا" },
    { value: "asmara_north", label: "شمال أسمرا" },
    { value: "asmara_south", label: "جنوب أسمرا" }
  ],
  "sanaa_city": [
    { value: "sanaa_old_city", label: "صنعاء القديمة" },
    { value: "sanaa_new_city", label: "صنعاء الجديدة" },
    { value: "sanaa_university", label: "جامعة صنعاء" }
  ]
}

export type AutoLocationProps = {
  /**
   * Callback function when all selections are completed
   */
  onComplete?: (selections: Record<string, Option>) => void;
  
  /**
   * Whether to use full hierarchical selection (all 5 levels) 
   * or simplified selection (3 levels: country, locality, neighborhood)
   */
  mode: 'full' | 'simplified';
  
  /**
   * CSS classes to apply to the container
   */
  className?: string;
  
  /**
   * Custom animation timing configurations
   */
  timing?: {
    transitionDelay?: number;
    animationDuration?: number;
    dropdownDelay?: number;
    focusDelay?: number;
  };
}

/**
 * AutoLocation component for selecting location in a hierarchical manner
 * with animated transitions between selection steps
 */
export function AutoLocation({
  onComplete,
  mode = 'full',
  className = '',
  timing
}: AutoLocationProps) {
  // Define full hierarchical steps with all 5 levels
  const fullLocationSteps: SelectionStep[] = [
    {
      id: "country",
      title: "الدولة",
      placeholder: "اختر الدولة",
      emptyMessage: "لا توجد دول متاحة",
      getOptions: () => COUNTRIES
    },
    {
      id: "state",
      title: "المحافظة/الولاية",
      placeholder: "اختر المحافظة/الولاية",
      emptyMessage: "لا توجد محافظات متاحة",
      getOptions: (prev) => {
        const countryId = prev.country?.value;
        return countryId ? (STATES[countryId] || []) : [];
      }
    },
    {
      id: "locality",
      title: "المنطقة",
      placeholder: "اختر المنطقة",
      emptyMessage: "لا توجد مناطق متاحة",
      getOptions: (prev) => {
        const stateId = prev.state?.value;
        return stateId ? (LOCALITIES[stateId] || []) : [];
      }
    },
    {
      id: "admin_unit",
      title: "القطاع الإداري",
      placeholder: "اختر القطاع الإداري",
      emptyMessage: "لا توجد قطاعات إدارية متاحة",
      getOptions: (prev) => {
        const localityId = prev.locality?.value;
        return localityId ? (ADMIN_UNITS[localityId] || []) : [];
      }
    },
    {
      id: "neighborhood",
      title: "الحي",
      placeholder: "اختر الحي",
      emptyMessage: "لا توجد أحياء متاحة",
      getOptions: (prev) => {
        const adminUnitId = prev.admin_unit?.value;
        return adminUnitId ? (NEIGHBORHOODS[adminUnitId] || []) : [];
      }
    }
  ];

  // Define simplified steps (country > locality > admin_unit > neighborhood)
  const simplifiedLocationSteps: SelectionStep[] = [
    {
      id: "country",
      title: "الدولة",
      placeholder: "اختر الدولة",
      emptyMessage: "لا توجد دول متاحة",
      getOptions: () => COUNTRIES
    },
    {
      id: "locality",
      title: "المدينة",
      placeholder: "اختر المدينة",
      emptyMessage: "لا توجد مدن متاحة",
      getOptions: (prev) => {
        const countryId = prev.country?.value;
        return countryId ? (DIRECT_LOCALITIES[countryId] || []) : [];
      }
    },
    {
      id: "admin_unit",
      title: "المنطقة",
      placeholder: "اختر المنطقة",
      emptyMessage: "لا توجد مناطق متاحة",
      getOptions: (prev) => {
        const localityId = prev.locality?.value;
        return localityId ? (DIRECT_ADMIN_UNITS[localityId] || []) : [];
      }
    },
    {
      id: "neighborhood",
      title: "الحي",
      placeholder: "اختر الحي",
      emptyMessage: "لا توجد أحياء متاحة",
      getOptions: (prev) => {
        const adminUnitId = prev.admin_unit?.value;
        return adminUnitId ? (NEIGHBORHOODS[adminUnitId] || []) : [];
      }
    }
  ];

  // Select which steps to use based on the mode
  const locationSteps = mode === 'full' ? fullLocationSteps : simplifiedLocationSteps;

  const handleComplete = (selections: Record<string, Option>) => {
    console.log("Location selection complete:", selections);
    onComplete?.(selections);
  };

  return (
    <AnimatedHierarchicalSelect 
      steps={locationSteps} 
      onComplete={handleComplete}
      className={className}
      timing={timing}
    />
  );
} 