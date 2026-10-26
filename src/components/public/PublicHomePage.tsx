import React from "react";
import Link from "next/link";
import {
  Phone,
  Clock,
  MapPin,
  Calendar,
  ShieldCheck,
  Award,
  Users,
  Stethoscope,
  Activity,
  Heart,
  Eye,
  Smile,
  Pill,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Star,
  FileText,
  BadgeCheck,
  Building2,
  CalendarCheck2,
} from "lucide-react";

export function PublicHomePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-950 via-slate-900 to-slate-950 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-teal-500/10 blur-3xl pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-semibold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                <span>Premier Outpatient Healthcare in Nairobi</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
                Compassionate Care, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-200 to-emerald-400">
                  Modern Medical Excellence.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Afyaware Medical Center delivers patient-centered primary and specialist care across Nairobi. 
                From rapid walk-in triage and full-spectrum diagnostics to dedicated maternal, dental, and optical clinics — your health is in expert hands.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate("contact")}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-teal-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-slate-950" />
                  <span>Book An Appointment</span>
                </button>

                <button
                  onClick={() => onNavigate("services")}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Explore Medical Services</span>
                  <ArrowRight className="w-4 h-4 text-teal-300" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-teal-300">15+</div>
                  <div className="text-xs text-slate-400 font-medium">Specialist Doctors</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-teal-300">3</div>
                  <div className="text-xs text-slate-400 font-medium">Nairobi Branches</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-teal-300">&lt;15 min</div>
                  <div className="text-xs text-slate-400 font-medium">Avg Triage Wait Time</div>
                </div>
              </div>
            </div>

            {/* Right Card: Quick Hospital Access & Live Hours */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">Main Clinic — Westlands</h3>
                      <p className="text-xs text-slate-400">Parklands Road, Nairobi</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
                    Open Today
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
                    <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Opening Hours</div>
                      <div className="text-slate-300 mt-0.5">Mon – Sat: 7:00 AM – 9:00 PM</div>
                      <div className="text-slate-400 text-[11px]">Sunday & Public Holidays: 8:00 AM – 6:00 PM</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
                    <Phone className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Direct Line & WhatsApp</div>
                      <div className="text-teal-300 font-mono font-semibold mt-0.5">+254 709 340 100 / +254 722 419 820</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">Insurance & Statutory Coverage</div>
                      <div className="text-slate-300 mt-0.5">SHA/SHIF Primary Care, Jubilee, AAR, Britam, CIC, APA & Corporate Schemes accepted.</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate("contact")}
                  className="w-full py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <CalendarCheck2 className="w-4 h-4" />
                  <span>Reserve Online Consultation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE AFYAWARE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Why Choose Afyaware
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Patient Care Designed Around Convenience & Trust
          </h2>
          <p className="text-sm text-slate-600">
            We combine warm bedside manners with cutting-edge medical diagnostic capabilities to ensure every member of your family receives prompt, world-class attention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {[
            {
              icon: Stethoscope,
              title: "Senior Consultants & MOs",
              desc: "Experienced general medical officers and board-certified visiting specialists in OB/GYN, Paediatrics, Internal Medicine, Dental and Eye Care.",
              color: "text-teal-600 bg-teal-50 border-teal-200",
            },
            {
              icon: Activity,
              title: "On-Site LIS Laboratory",
              desc: "Automated biochemistry, haematology, lipid profiles, and rapid infectious disease diagnostics with turnaround in under 30 minutes.",
              color: "text-emerald-600 bg-emerald-50 border-emerald-200",
            },
            {
              icon: Pill,
              title: "Fully Stocked Chemist",
              desc: "First-Expiry First-Out authenticated pharmaceutical dispensary with bilingual English & Swahili dosage guidance on every prescription.",
              color: "text-sky-600 bg-sky-50 border-sky-200",
            },
            {
              icon: ShieldCheck,
              title: "SHA & Cashless Insurance",
              desc: "Pre-authorized claims processing with SHA (Social Health Authority), NHIF biometric clearance, and major private insurance schemes.",
              color: "text-indigo-600 bg-indigo-50 border-indigo-200",
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition space-y-4"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feature.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900">{feature.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED MEDICAL SERVICES OVERVIEW */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Comprehensive Clinics</span>
              <h2 className="text-3xl font-black text-slate-900 mt-1">Our Outpatient Medical Services</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Full-spectrum outpatient care from walk-in checkups to minor surgical procedures.
              </p>
            </div>
            <button
              onClick={() => onNavigate("services")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 transition cursor-pointer"
            >
              <span>View All 10+ Clinics</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "General Outpatient Consultation",
                desc: "Walk-in acute illness care, infection treatment, lifestyle checkups, chronic disease reviews and routine health screenings.",
                icon: Stethoscope,
                timing: "Daily 7:00 AM – 9:00 PM",
              },
              {
                title: "Maternal Health (ANC) & Child Welfare",
                desc: "Antenatal clinic, KEPI childhood immunizations, developmental milestone tracking, and 4D obstetric ultrasound.",
                icon: Heart,
                timing: "Mon – Sat 8:00 AM – 5:00 PM",
              },
              {
                title: "Dental Surgery & Odontology",
                desc: "Modern digital dental operatory: scaling, root canal therapy, tooth restorations, pediatric dentistry, and extractions.",
                icon: Smile,
                timing: "Tue, Thu, Sat 9:00 AM – 5:00 PM",
              },
              {
                title: "Optical & Refraction Center",
                desc: "Auto-refraction testing, computerized visual acuity exams, prescription lenses, designer frames, and glaucoma screenings.",
                icon: Eye,
                timing: "Mon – Fri 8:30 AM – 5:30 PM",
              },
              {
                title: "Digital Radiology & Ultrasound",
                desc: "High-resolution digital X-rays (DR) and GE Voluson 4D obstetric, pelvic, abdominal, and vascular doppler scans.",
                icon: Activity,
                timing: "Daily 8:00 AM – 7:00 PM",
              },
              {
                title: "Day-Care Observation & Minor Theatre",
                desc: "Dedicated 10-bed day observation ward for rehydration, asthma nebulization, wound suturing, and minor day procedures.",
                icon: Building2,
                timing: "24/7 Day Observation",
              },
            ].map((srv, i) => {
              const Icon = srv.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-teal-300 transition flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900">{srv.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{srv.desc}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">{srv.timing}</span>
                    <button
                      onClick={() => onNavigate("contact")}
                      className="text-teal-700 font-bold hover:underline cursor-pointer"
                    >
                      Book Clinic &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MEDICAL TEAM HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Our Clinical Experts</span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">Meet Our Resident Medical Practitioners</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Dedicated, compassionate professionals licensed by the Kenya Medical Practitioners and Dentists Council (KMPDC).
            </p>
          </div>
          <button
            onClick={() => onNavigate("doctors")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 transition cursor-pointer"
          >
            <span>View All Doctors & Profiles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Dr. Kelvin Mwangi",
              title: "Senior Medical Officer & General Physician",
              spec: "MBChB (UoN) • 11+ Years Experience",
              room: "Consultation Suite 1",
              avatarBg: "from-teal-600 to-emerald-700",
            },
            {
              name: "Dr. Sarah Ndegwa",
              title: "Consultant Obstetrician & Gynaecologist",
              spec: "MBChB, MMed (Obs/Gyn) • 14+ Years",
              room: "MCH & Ultrasound Suite 3",
              avatarBg: "from-rose-600 to-pink-700",
            },
            {
              name: "Dr. Amina Noor",
              title: "Consultant Physician & Diabetologist",
              spec: "MBChB, MMed (Internal Med) • 12+ Years",
              room: "Consultation Suite 2",
              avatarBg: "from-indigo-600 to-purple-700",
            },
            {
              name: "Dr. David Kimani",
              title: "Lead Dental Surgeon & Implantologist",
              spec: "BDS (UoN) • 9+ Years Experience",
              room: "Dental Operatory Suite 1",
              avatarBg: "from-sky-600 to-blue-700",
            },
          ].map((doc, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
            >
              <div className={`h-40 bg-gradient-to-br ${doc.avatarBg} flex items-center justify-center text-white relative`}>
                <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl font-black">
                  {doc.name.split(" ")[1]?.charAt(0)}
                  {doc.name.split(" ")[2]?.charAt(0)}
                </div>
                <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs text-[10px] font-semibold text-white">
                  KMPDC Verified
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{doc.name}</h3>
                  <div className="text-xs font-semibold text-teal-700 mt-0.5">{doc.title}</div>
                  <p className="text-[11px] text-slate-500 mt-1">{doc.spec}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">{doc.room}</span>
                  <button
                    onClick={() => onNavigate("contact")}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                  >
                    Consult
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PATIENT TESTIMONIALS */}
      <section className="bg-slate-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Patient Experiences</span>
            <h2 className="text-3xl font-black text-white">What Our Patients Say</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Trusted by thousands of families across Nairobi for professional, quick, and transparent outpatient care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "The triage was fast and Dr. Mwangi explained my hypertensive condition with genuine care. Getting prescribed medication right downstairs at their chemist took less than 5 minutes.",
                author: "Wanjiku M. Kamau",
                role: "Westlands Patient (SHA / SHIF Scheme)",
                stars: 5,
              },
              {
                quote: "Had my 28-week ANC scan with Dr. Sarah Ndegwa. The 4D ultrasound pictures were incredible and the nursing team made me feel completely comfortable and supported.",
                author: "Amina Hassan A.",
                role: "Antenatal Clinic Patient",
                stars: 5,
              },
              {
                quote: "My son woke up with a high fever from malaria. Afyaware got him tested in their lab, nebulized, and discharged with oral treatment in under an hour. Outstanding service!",
                author: "Faith Chebet Koech",
                role: "Parent • Pediatric Clinic",
                stars: 5,
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="font-bold text-sm text-white">{t.author}</div>
                  <div className="text-[11px] text-teal-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA: BOOK TODAY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
              Walk-Ins & Online Bookings Welcome
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Ready to Visit? Schedule Your Outpatient Appointment Today.
            </h2>
            <p className="text-sm text-teal-100 leading-relaxed">
              Skip the long waiting lines. Choose your preferred branch, doctor, and consultation slot in seconds, or call our emergency hotline.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => onNavigate("contact")}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white text-teal-950 font-black text-xs hover:bg-teal-50 transition cursor-pointer shadow-md"
              >
                Book Appointment Online
              </button>
              <a
                href="tel:+254709340100"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-teal-900/60 hover:bg-teal-900/80 text-white font-bold text-xs border border-white/20 transition text-center"
              >
                Call Hotline: +254 709 340 100
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
