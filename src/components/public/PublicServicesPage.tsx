import React, { useState } from "react";
import {
  Stethoscope,
  Heart,
  Smile,
  Eye,
  Activity,
  Pill,
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Calendar,
  FileText,
  FlaskConical,
  Sparkles,
} from "lucide-react";

interface MedicalServiceDetail {
  id: string;
  category: string;
  name: string;
  tagline: string;
  description: string;
  keyProcedures: string[];
  schedule: string;
  consultationFee: string;
  insuranceAccepted: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SERVICES_DATA: MedicalServiceDetail[] = [
  {
    id: "general-outpatient",
    category: "Primary Care",
    name: "General Outpatient Consultation & Triage",
    tagline: "Rapid-triage acute illness assessment and comprehensive primary care.",
    description: "Our general outpatient department handles daily acute illnesses, infections, wound care, and preventive medicine. Every patient begins with rapid digital triage (blood pressure, pulse, SpO2, blood sugar, BMI) before seeing a certified Medical Officer.",
    keyProcedures: [
      "Acute infectious illness treatment (Malaria, Typhoid, Chest Infections)",
      "Hypertension, Diabetes and Asthma review & drug adjustments",
      "Minor trauma care, wound cleaning, dressings and suturing",
      "General medical checkups and statutory employment fitness examinations",
      "Official Medical Sick-Off and Fitness-to-Work certificates",
    ],
    schedule: "Daily: 7:00 AM – 9:00 PM (Walk-Ins & Appointments)",
    consultationFee: "KSh 1,500 (Free under active SHA / Private Insurance)",
    insuranceAccepted: "SHA / SHIF Primary, All Private Insurers & Corporate Credit",
    icon: Stethoscope,
  },
  {
    id: "mch-anc",
    category: "Maternal & Child Health",
    name: "Maternal Health (ANC), Child Welfare & KEPI Vaccines",
    tagline: "Holistic care for expectant mothers and pediatric development.",
    description: "Our dedicated maternal and child health clinic provides prenatal profiling, high-risk pregnancy monitoring, postnatal checkups, and standard Kenya Expanded Programme on Immunization (KEPI) childhood immunizations.",
    keyProcedures: [
      "Antenatal profiling (Blood Group, Rhesus, VDRL, HIV, Urinalysis, Hb)",
      "4D Obstetric Ultrasound Growth & Anatomy scans with sonogram printouts",
      "KEPI Schedule Immunizations (BCG, Polio, Pentavalent, Rotavirus, Measles)",
      "Pediatric growth monitoring with Mid-Upper Arm Circumference (MUAC)",
      "Lactation counseling and nutrition guidance",
    ],
    schedule: "Monday – Saturday: 8:00 AM – 5:00 PM",
    consultationFee: "KSh 2,000 / Discounted ANC Packages Available",
    insuranceAccepted: "SHA Linda Mama / Primary Care & Private Schemes",
    icon: Heart,
  },
  {
    id: "dental-clinic",
    category: "Specialized Care",
    name: "Dental Surgery & Aesthetic Odontology",
    tagline: "State-of-the-art dental suite with computerized low-dose imaging.",
    description: "Led by Dr. David Kimani, our dental department is equipped with an ergonomic operatory chair, ultrasonic scalers, and digital intraoral radiography to provide painless restorative and cosmetic dental treatments.",
    keyProcedures: [
      "Routine dental cleaning, scaling, and polishing",
      "Composite tooth-colored fillings and restorative dentistry",
      "Root canal therapy (endodontic treatment)",
      "Painless surgical extractions and impacted wisdom tooth removal",
      "Pediatric fluoride varnish application and fissure sealants",
    ],
    schedule: "Tuesday, Thursday & Saturday: 9:00 AM – 5:00 PM",
    consultationFee: "KSh 2,500 (Procedures priced separately)",
    insuranceAccepted: "Private Insurance Dental Riders & Cash / M-Pesa",
    icon: Smile,
  },
  {
    id: "optical-clinic",
    category: "Specialized Care",
    name: "Optical Examination & Eye Care Clinic",
    tagline: "Precision computerized refraction and designer eyewear dispensary.",
    description: "Comprehensive visual acuity and ocular health exams conducted by experienced optometrists. We provide automated refraction testing, intraocular pressure measurement for glaucoma, and an on-site dispensary for frames and lenses.",
    keyProcedures: [
      "Automated computerized refraction & subjective visual acuity",
      "Glaucoma screening (intraocular pressure tonometry)",
      "Prescription glasses for myopia, hyperopia, astigmatism & presbyopia",
      "Photochromic, anti-glare, blue-light blocking, and progressive lenses",
      "Allergic conjunctivitis and dry-eye syndrome management",
    ],
    schedule: "Monday – Friday: 8:30 AM – 5:30 PM",
    consultationFee: "KSh 1,500 (Waived when purchasing prescription frames)",
    insuranceAccepted: "All Major Optical Insurance Cards & Cash / M-Pesa",
    icon: Eye,
  },
  {
    id: "laboratory-lis",
    category: "Diagnostics",
    name: "Automated Clinical Laboratory (LIS)",
    tagline: "Certified Level C diagnostic laboratory with <30 minute turnaround times.",
    description: "Operating with modern hematology analyzers, clinical chemistry benches, and rapid serology analyzers. Results are interfaced digitally and can be accessed online via QR code on your official lab report.",
    keyProcedures: [
      "Full Haemogram (CBC) & 5-part Differential automated testing",
      "Renal Function (Urea, Electrolytes, Creatinine, eGFR)",
      "Liver Function Tests & Fasting Lipid Profiles",
      "Malaria BS/MRDT, Typhoid Widal, H. Pylori & Stool/Urine microscopy",
      "Glycated Hemoglobin (HbA1c) & Fasting Blood Sugar profiles",
    ],
    schedule: "Daily: 7:00 AM – 9:00 PM",
    consultationFee: "Test fees as per statutory Kenyan tariff schedules",
    insuranceAccepted: "Full Cashless Cover with all Empanelled Insurers",
    icon: FlaskConical,
  },
  {
    id: "radiology-imaging",
    category: "Diagnostics",
    name: "Digital Radiology (DR) & 4D Ultrasound Suite",
    tagline: "High-resolution digital diagnostic imaging with certified radiologist reports.",
    description: "Equipped with GE Voluson 4D diagnostic ultrasound systems and low-radiation Direct Digital Radiography (DR). We ensure accurate visual diagnosis for skeletal injuries, abdominal complaints, and prenatal development.",
    keyProcedures: [
      "Digital Chest X-Rays (PA/Lateral views)",
      "Musculoskeletal, extremity, pelvic, and spine X-ray imaging",
      "Abdominal & Pelvic Ultrasound",
      "Vascular Doppler and DVT screening",
      "Soft tissue and thyroid ultrasound examinations",
    ],
    schedule: "Daily: 8:00 AM – 7:00 PM",
    consultationFee: "From KSh 2,500 depending on modality",
    insuranceAccepted: "SHA & Private Insurance Diagnostic Pre-Auth Supported",
    icon: Activity,
  },
  {
    id: "pharmacy-chemist",
    category: "Pharmaceuticals",
    name: "Retail Chemist & E-Prescription Dispensary",
    tagline: "PPB registered pharmacy strictly adhering to FEFO and authentic sourcing.",
    description: "Our in-house pharmacy dispenses doctor-prescribed medications as well as over-the-counter wellness essentials. We stock authentic medicines sourced exclusively from licensed Kenyan pharmaceutical distributors.",
    keyProcedures: [
      "Patient e-prescription dispensing with drug-interaction verification",
      "Bilingual dosage instructions (English & Swahili) on thermal sticker labels",
      "Chronic medication refills for hypertension, diabetes & asthma patients",
      "PPB Dangerous Drugs Register compliance for controlled substances",
      "Over-the-counter family wellness and first-aid supplies",
    ],
    schedule: "Daily: 7:00 AM – 9:30 PM",
    consultationFee: "Standard pharmaceutical retail pricing",
    insuranceAccepted: "Cash, M-Pesa Till & Cashless Pharmacy Insurance Cards",
    icon: Pill,
  },
  {
    id: "day-observation-ward",
    category: "In-Clinic Care",
    name: "10-Bed Observation Day-Ward & Minor Procedure Suite",
    tagline: "Short-stay clinical monitoring, intravenous rehydration and minor surgery.",
    description: "Designed for patients requiring temporary medical stabilization without an expensive full hospital admission. Patients are monitored by registered nursing staff with hourly vital signs, IV fluids, nebulization, and pain management.",
    keyProcedures: [
      "Intravenous rehydration for acute gastroenteritis and dehydration",
      "Asthma and COPD acute nebulization therapy",
      "Minor surgical procedures: abscess drainage, lipoma excision, suturing",
      "Post-procedure recovery and continuous cardiac/SpO2 monitoring",
      "Stat injectable therapy (antibiotics, antiemetics, analgesics)",
    ],
    schedule: "Daily: 24/7 Day Observation",
    consultationFee: "Hourly Day-Bed rate: KSh 800/hr (capped per day)",
    insuranceAccepted: "Covered under Day-Care Outpatient Benefits",
    icon: Building2,
  },
];

export function PublicServicesPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Primary Care", "Specialized Care", "Diagnostics", "Pharmaceuticals", "In-Clinic Care"];

  const filteredServices =
    selectedCategory === "All"
      ? SERVICES_DATA
      : SERVICES_DATA.filter((s) => s.category === selectedCategory);

  return (
    <div className="space-y-16 pb-20">
      {/* HEADER BANNER */}
      <section className="bg-gradient-to-b from-teal-950 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-500/30">
            Clinical Departments
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Comprehensive Medical & Diagnostic Services
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            From routine walk-in checkups to specialized optical, dental, ultrasound, and observation care — explore our fully licensed clinical suites.
          </p>
        </div>
      </section>

      {/* FILTER BUTTONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SERVICES CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-3xl border border-slate-200 p-7 shadow-xs hover:border-teal-300 transition flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {service.category}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-1">{service.name}</h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {service.tagline}
                  </p>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Key Procedures */}
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-900 block">Common Treatments & Procedures:</span>
                    <ul className="space-y-1.5">
                      {service.keyProcedures.map((proc, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span>{proc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Details & Booking Button */}
                <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="text-slate-600">
                      <strong className="text-slate-800">Hours:</strong> {service.schedule}
                    </div>
                    <div className="text-slate-600">
                      <strong className="text-slate-800">Fee:</strong> {service.consultationFee}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-teal-800 font-semibold bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                      {service.insuranceAccepted}
                    </span>
                    <button
                      onClick={() => onNavigate("contact")}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Book This Clinic
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
