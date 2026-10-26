import React from "react";
import {
  ShieldCheck,
  Target,
  Award,
  Heart,
  Users,
  Building2,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";

export function PublicAboutPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="space-y-16 pb-20">
      {/* HEADER BANNER */}
      <section className="bg-gradient-to-b from-teal-950 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-500/30">
            About Afyaware Medical Center
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Setting the Benchmark for Outpatient Care in Kenya
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Founded with a commitment to accessible, compassionate, and digitally empowered healthcare, Afyaware operates modern outpatient facilities serving thousands of Kenyan individuals, families, and corporate partners every month.
          </p>
        </div>
      </section>

      {/* MISSION, VISION & VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To deliver patient-centered, dignifying, and clinically accurate outpatient medical care with rapid turnaround times, transparent pricing, and seamless continuity of care.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To be East Africa’s most trusted network of private outpatient health facilities, acclaimed for medical integrity, cutting-edge diagnostics, and clinical empathy.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Core Values</h3>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span><strong>Clinical Integrity:</strong> Evidence-based medical ethics.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span><strong>Empathy:</strong> Treating every patient like family.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span><strong>Transparency:</strong> No hidden medical billing.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span><strong>Innovation:</strong> Digital records and faster service.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* STATUTORY COMPLIANCE & REGISTRATION */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Statutory Certifications</span>
            <h2 className="text-3xl font-black text-slate-900">Licensed & Regulated Healthcare Delivery</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Afyaware operates under strict adherence to the regulatory frameworks of the Republic of Kenya.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "KMPDC Registered",
                desc: "Kenya Medical Practitioners and Dentists Council Level 3B/4 Outpatient Facility License.",
                reg: "License No: KMPDC/CL/2026/0491",
              },
              {
                title: "PPB Licensed Pharmacy",
                desc: "Pharmacy and Poisons Board authorized retail and outpatient dispensary with qualified resident pharmacists.",
                reg: "PPB Premise Reg: PPB/RET/2026/894",
              },
              {
                title: "KMLTTB Certified Lab",
                desc: "Kenya Medical Laboratory Technicians and Technologists Board registered diagnostic laboratory.",
                reg: "KMLTTB Class C Facility #310",
              },
              {
                title: "SHA & eTIMS Compliant",
                desc: "Social Health Authority empanelled primary care provider with automated KRA eTIMS fiscalization.",
                reg: "SHA Empanelment #SHA-EM-99201",
              },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                <div className="text-[11px] font-mono font-semibold text-teal-700 pt-2 border-t border-slate-100">
                  {item.reg}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR CLINIC NETWORK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Strategic Locations</span>
          <h2 className="text-3xl font-black text-slate-900">Serving You Across Nairobi</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Three conveniently located modern medical facilities connected by shared clinical history for uninterrupted patient care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Westlands Medical Center (Main Hospital)",
              location: "Parklands Road, Westlands, Nairobi",
              phone: "+254 709 340 100",
              hours: "Daily: 7:00 AM – 9:00 PM",
              services: "Full Diagnostics, 4D Ultrasound, LIS Lab, Dental, Pharmacy & Day-Ward.",
            },
            {
              name: "Thika Road Specialist Center",
              location: "Roasters / TRM Drive, Kasarani, Nairobi",
              phone: "+254 709 340 200",
              hours: "Mon – Sat: 7:30 AM – 8:30 PM",
              services: "Doctor Consultations, Digital DR X-Ray, Pediatric & Antenatal Clinics.",
            },
            {
              name: "Mombasa Road Outpatient Center",
              location: "Nextgen Mall, Ground Floor, Mombasa Road",
              phone: "+254 709 340 300",
              hours: "Mon – Sun: 8:00 AM – 8:00 PM",
              services: "Rapid Triage, Chemist, Doctor Consultations, Routine Laboratory & Vaccinations.",
            },
          ].map((branch, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{branch.name}</h4>
                  <p className="text-xs text-slate-500">{branch.location}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{branch.hours}</span>
                </div>
                <div className="text-slate-600">
                  <strong className="text-slate-800">Facilities:</strong> {branch.services}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate("contact")}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                >
                  Book at This Branch
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
