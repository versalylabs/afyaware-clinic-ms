import React, { useState } from "react";
import {
  Phone,
  Clock,
  MapPin,
  Calendar,
  ShieldCheck,
  Building2,
  Menu,
  X,
  Stethoscope,
  ChevronRight,
  ExternalLink,
  Lock,
} from "lucide-react";
import { PublicHomePage } from "./PublicHomePage";
import { PublicAboutPage } from "./PublicAboutPage";
import { PublicServicesPage } from "./PublicServicesPage";
import { PublicDoctorsPage } from "./PublicDoctorsPage";
import { PublicContactPage } from "./PublicContactPage";
import { AfyawareLogoIcon } from "@/components/AfyawareLogoIcon";

export type PublicNavTab = "home" | "about" | "services" | "doctors" | "contact";

export function PublicWebsiteLayout() {
  const [activeTab, setActiveTab] = useState<PublicNavTab>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as PublicNavTab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* TOP STATUTORY & CONTACT NOTIFICATION BAR */}
      <div className="bg-slate-950 text-slate-300 text-[11px] py-2 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span>Direct Appointments: <strong>+254 709 340 100</strong></span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>Mon – Sat: 7:00 AM – 9:00 PM • Sun: 8:00 AM – 6:00 PM</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SHA / SHIF & Private Cashless Insurance Accepted</span>
            </span>
            {/* Direct Switch to Internal Clinical Dashboard */}
            <a
              href="/app"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-teal-300 text-[10px] font-bold border border-slate-700 transition"
              title="Switch to internal clinic management dashboard"
            >
              <Lock className="w-2.5 h-2.5 text-teal-400" />
              <span>Staff Portal</span>
            </a>
          </div>
        </div>
      </div>

      {/* MAIN PUBLIC NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Clinic Brand */}
          <div
            onClick={() => handleNavigate("home")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <AfyawareLogoIcon size="md" className="group-hover:scale-105 transition-transform" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  AFYAWARE
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  Medical Center
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Outpatient Clinic, Pharmacy & Diagnostics
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {[
              { id: "home", label: "Home" },
              { id: "about", label: "About Us" },
              { id: "services", label: "Medical Services" },
              { id: "doctors", label: "Our Doctors" },
              { id: "contact", label: "Contact & Locations" },
            ].map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavigate(link.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? "bg-teal-50 text-teal-900 border border-teal-200 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Header Action: Book Appointment CTA & Staff Portal */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => handleNavigate("contact")}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition cursor-pointer flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 shadow-lg">
            {[
              { id: "home", label: "Home" },
              { id: "about", label: "About Us" },
              { id: "services", label: "Medical Services" },
              { id: "doctors", label: "Our Doctors" },
              { id: "contact", label: "Contact & Locations" },
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavigate(link.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold block ${
                  activeTab === link.id
                    ? "bg-teal-50 text-teal-900 font-extrabold"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => handleNavigate("contact")}
                className="w-full py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs text-center"
              >
                Book An Appointment
              </button>
              <a
                href="/app"
                className="w-full py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs text-center flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Clinic Management System</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* PAGE BODY */}
      <main className="flex-1">
        {activeTab === "home" && <PublicHomePage onNavigate={handleNavigate} />}
        {activeTab === "about" && <PublicAboutPage onNavigate={handleNavigate} />}
        {activeTab === "services" && <PublicServicesPage onNavigate={handleNavigate} />}
        {activeTab === "doctors" && <PublicDoctorsPage onNavigate={handleNavigate} />}
        {activeTab === "contact" && <PublicContactPage />}
      </main>

      {/* PUBLIC FOOTER */}
      <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Col 1: Brand & Overview */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <AfyawareLogoIcon size="sm" />
                <span className="text-lg font-black tracking-tight text-white">
                  AFYAWARE
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Afyaware Outpatient Clinic, Pharmacy & Diagnostic Center delivers patient-centered primary care, maternal wellness, dental surgery, and rapid-turnaround laboratory diagnostics across Nairobi.
              </p>
              <div className="text-[11px] text-teal-400 font-semibold">
                KMPDC Reg: Level 3B/4 Outpatient Facility
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Quick Links</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button onClick={() => handleNavigate("home")} className="hover:text-teal-300 transition cursor-pointer">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate("about")} className="hover:text-teal-300 transition cursor-pointer">
                    About Our Clinic
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate("services")} className="hover:text-teal-300 transition cursor-pointer">
                    Outpatient Medical Services
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate("doctors")} className="hover:text-teal-300 transition cursor-pointer">
                    Our Doctors & Specialists
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate("contact")} className="hover:text-teal-300 transition cursor-pointer">
                    Book An Appointment
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Medical Services */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Clinical Services</h4>
              <ul className="space-y-2 text-slate-400">
                <li>General Outpatient Consultations</li>
                <li>Antenatal Care (ANC) & 4D Ultrasound</li>
                <li>Childhood Vaccines (KEPI Schedule)</li>
                <li>Dental Surgery & Cleanings</li>
                <li>Automated LIS Diagnostic Laboratory</li>
                <li>Digital X-Ray & Day Observation Ward</li>
              </ul>
            </div>

            {/* Col 4: Locations & Emergency Contact */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Clinic Contacts</h4>
              <div className="space-y-2 text-slate-400">
                <div>
                  <strong className="text-white block">Main Clinic (Westlands):</strong>
                  Parklands Road, Westlands, Nairobi
                </div>
                <div>
                  <strong className="text-white block">Central Telephone:</strong>
                  +254 709 340 100 / +254 722 419 820
                </div>
                <div>
                  <strong className="text-white block">Email:</strong>
                  care@afyaware.co.ke
                </div>
                <div className="pt-2">
                  <span className="text-[11px] text-emerald-400 font-bold block">
                    ● Emergency Day Observation Open
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & OS Link */}
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <div>
              &copy; {new Date().getFullYear()} Afyaware Outpatient Medical Center. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Data Protected (Kenya DPA 2019)</span>
              <span>•</span>
              <a
                href="/app"
                className="text-teal-400 hover:text-teal-300 font-semibold inline-flex items-center gap-1"
              >
                <span>Clinic Management OS</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
