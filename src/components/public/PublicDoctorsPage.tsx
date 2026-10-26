import React from "react";
import {
  Stethoscope,
  Heart,
  Smile,
  Eye,
  Award,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  FileBadge,
  Sparkles,
} from "lucide-react";

interface DoctorProfile {
  id: string;
  name: string;
  postNominal: string;
  role: string;
  specialty: string;
  kmpdcReg: string;
  qualifications: string[];
  experienceYears: number;
  clinicBranch: string;
  roomName: string;
  consultationDays: string;
  bio: string;
  focusAreas: string[];
  avatarGradient: string;
}

const DOCTORS_DATA: DoctorProfile[] = [
  {
    id: "doc-kelvin",
    name: "Dr. Kelvin Mwangi",
    postNominal: "MBChB (UoN)",
    role: "Senior Medical Officer & Clinical Director",
    specialty: "General Medicine & Outpatient Primary Care",
    kmpdcReg: "KMPDC Reg No: A7419",
    qualifications: ["Bachelor of Medicine and Surgery (MBChB) — University of Nairobi", "Advanced Cardiac Life Support (ACLS Certified)"],
    experienceYears: 11,
    clinicBranch: "Westlands Medical Center (Main)",
    roomName: "Consultation Room 1",
    consultationDays: "Monday to Friday: 8:00 AM – 4:00 PM",
    bio: "Dr. Mwangi has over a decade of clinical experience in acute outpatient triage, adult lifestyle diseases, and family health. He oversees clinical quality and evidence-based practice across all Afyaware branches.",
    focusAreas: ["Hypertension Management", "Type 2 Diabetes Screening & Care", "Infectious Diseases (Malaria, Typhoid)", "Executive Wellness Checkups"],
    avatarGradient: "from-teal-600 to-emerald-700",
  },
  {
    id: "doc-sarah",
    name: "Dr. Sarah Ndegwa",
    postNominal: "MBChB, MMed (Obs/Gyn)",
    role: "Consultant Obstetrician & Gynaecologist",
    specialty: "Maternal Health, Antenatal Care & 4D Ultrasound",
    kmpdcReg: "KMPDC Reg No: A6218",
    qualifications: ["MMed in Obstetrics & Gynaecology — Aga Khan University", "MBChB — Moi University", "Fellow of the East, Central & Southern Africa College of Obstetrics (ECSACOG)"],
    experienceYears: 14,
    clinicBranch: "Westlands Medical Center",
    roomName: "Consultation Room 3 (MCH / ANC Suite)",
    consultationDays: "Monday, Wednesday & Friday: 9:00 AM – 3:30 PM",
    bio: "Dr. Ndegwa specializes in high-risk antenatal supervision, reproductive health, and obstetric ultrasound. She is known for her warm, empowering bedside care for expectant mothers.",
    focusAreas: ["Routine & High-Risk Antenatal Care (ANC)", "4D Obstetric Growth & Doppler Scans", "Cervical Cancer Screening (Pap Smear & HPV)", "Family Planning & Infertility Consultation"],
    avatarGradient: "from-rose-600 to-pink-700",
  },
  {
    id: "doc-amina",
    name: "Dr. Amina Noor",
    postNominal: "MBChB, MMed (Internal Med)",
    role: "Consultant Physician & Cardiometabolic Specialist",
    specialty: "Internal Medicine & Chronic Non-Communicable Diseases (NCDs)",
    kmpdcReg: "KMPDC Reg No: A8102",
    qualifications: ["MMed in Internal Medicine — University of Nairobi", "MBChB — University of Nairobi", "Post-Graduate Diploma in Clinical Diabetes (UK)"],
    experienceYears: 12,
    clinicBranch: "Westlands Medical Center & Thika Road",
    roomName: "Consultation Room 2 (Specialist Suite)",
    consultationDays: "Tuesday, Thursday & Saturday: 9:00 AM – 4:00 PM",
    bio: "Dr. Noor brings specialized expertise in chronic illness management, lipid metabolism, and secondary hypertension. She coordinates our Day-27 Chronic Refill CRM to ensure continuous medication adherence.",
    focusAreas: ["Cardiovascular Risk Assessment & 12-Lead ECG", "Complex Diabetic Glycemic Control", "Dyslipidemia & Metabolic Syndrome", "Chronic Kidney Disease Stage 1-3 Monitoring"],
    avatarGradient: "from-indigo-600 to-purple-700",
  },
  {
    id: "doc-david",
    name: "Dr. David Kimani",
    postNominal: "BDS (UoN)",
    role: "Lead Dental Surgeon & Implantologist",
    specialty: "Restorative, Endodontic & Pediatric Dentistry",
    kmpdcReg: "KMPDC Reg No: B1904",
    qualifications: ["Bachelor of Dental Surgery (BDS) — University of Nairobi", "Certification in Advanced Rotary Endodontics"],
    experienceYears: 9,
    clinicBranch: "Westlands Medical Center",
    roomName: "Dental Chair 1 (Operatory Suite)",
    consultationDays: "Tuesday, Thursday & Saturday: 9:00 AM – 5:00 PM",
    bio: "Dr. Kimani emphasizes gentle, painless dental procedures using digital intraoral X-ray sensors. He treats children and adults for preventative, aesthetic, and emergency dental concerns.",
    focusAreas: ["Painless Root Canal Therapy (Endodontics)", "Composite Aesthetic Restorations", "Surgical Tooth Extractions", "Pediatric Fluoride & Preventive Sealants"],
    avatarGradient: "from-sky-600 to-blue-700",
  },
  {
    id: "opt-kenneth",
    name: "Dr. Kenneth Rotich",
    postNominal: "B.Optom (Maseno)",
    role: "Senior Optometrist & Refraction Specialist",
    specialty: "Primary Eye Care, Visual Acuity & Contact Lenses",
    kmpdcReg: "Optometrists Association of Kenya #OAK-391",
    qualifications: ["Bachelor of Optometry (B.Optom) — Maseno University", "Certified in Glaucoma Screening & Low Vision Aid"],
    experienceYears: 8,
    clinicBranch: "Westlands & Mombasa Road",
    roomName: "Optical Suite",
    consultationDays: "Monday to Friday: 8:30 AM – 5:00 PM",
    bio: "Dr. Rotich leads our optical and refraction center, carrying out automated computer tests, eye pressure measurements, and custom lens dispensing for computer-screen workers, students, and drivers.",
    focusAreas: ["Computerized Auto-Refraction & Subjective Rx", "Computer Vision Syndrome Management", "Intraocular Pressure (Tonometry) Screening", "Progressive & Blue-Cut Lenses"],
    avatarGradient: "from-amber-600 to-orange-700",
  },
  {
    id: "doc-esther",
    name: "Dr. Esther Chege",
    postNominal: "MBChB, MMed (Paed)",
    role: "Visiting Consultant Paediatrician",
    specialty: "Child Health, Neonatology & Growth Development",
    kmpdcReg: "KMPDC Reg No: A7890",
    qualifications: ["MMed in Paediatrics and Child Health — University of Nairobi", "MBChB — University of Nairobi"],
    experienceYears: 13,
    clinicBranch: "Westlands & Thika Road",
    roomName: "Paediatric Consultation Room",
    consultationDays: "Wednesday & Saturday: 9:00 AM – 2:00 PM",
    bio: "Dr. Chege brings extensive expertise in managing childhood infectious conditions, asthma nebulization, allergy profiling, and baby growth milestones.",
    focusAreas: ["Severe Childhood Asthma & Wheezing", "Neonatal Jaundice Review", "Feeding Difficulties & Growth Faltering", "Extended Pediatric Vaccination Schedules"],
    avatarGradient: "from-emerald-600 to-teal-800",
  },
];

export function PublicDoctorsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="space-y-16 pb-20">
      {/* HEADER BANNER */}
      <section className="bg-gradient-to-b from-teal-950 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-500/30">
            Medical Staff
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Our Certified Doctors & Specialists
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Every doctor at Afyaware is rigorously vetted and licensed by the Kenya Medical Practitioners and Dentists Council (KMPDC), committed to providing clear explanations and evidence-based treatments.
          </p>
        </div>
      </section>

      {/* DOCTORS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DOCTORS_DATA.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Doctor Header Banner */}
                <div className={`p-6 bg-gradient-to-br ${doctor.avatarGradient} text-white relative`}>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-xl font-black shrink-0">
                      {doctor.name.split(" ")[1]?.charAt(0)}
                      {doctor.name.split(" ")[2]?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-white">{doctor.name}</h3>
                      <div className="text-xs text-teal-200 font-semibold">{doctor.postNominal}</div>
                      <div className="text-[11px] text-white/80 mt-0.5">{doctor.role}</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-[10px] text-white/90">
                    <span className="font-mono">{doctor.kmpdcReg}</span>
                    <span className="font-semibold">{doctor.experienceYears}+ Years Exp</span>
                  </div>
                </div>

                {/* Doctor Bio & Details */}
                <div className="p-6 space-y-4 text-xs">
                  <p className="text-slate-600 leading-relaxed">
                    {doctor.bio}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="font-bold text-slate-900 block">Areas of Clinical Focus:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {doctor.focusAreas.map((area, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{doctor.consultationDays}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{doctor.clinicBranch} • {doctor.roomName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultation Booking Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => onNavigate("contact")}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book with {doctor.name.split(" ")[1]}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
