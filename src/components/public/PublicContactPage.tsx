import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Building2,
  User,
  ShieldCheck,
  Stethoscope,
  Send,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useAfyaware } from "@/lib/store";
import { AppointmentSlot } from "@/lib/types";

export function PublicContactPage() {
  const { branches, addAppointment } = useAfyaware();

  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.name || "Afyaware Medical Center — Westlands (Main)");
  const [clinicService, setClinicService] = useState("General Outpatient Doctor Consultation");
  const [preferredDate, setPreferredDate] = useState("2026-10-15");
  const [preferredTime, setPreferredTime] = useState("09:00 AM - 09:30 AM");
  const [paymentScheme, setPaymentScheme] = useState("SHA (Social Health Authority)");
  const [patientNotes, setPatientNotes] = useState("");

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    // Generate random confirmation
    const aptId = `WEB-APT-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmationCode(aptId);

    // Map to an AppointmentSlot and write to the internal clinic management system reactive store
    const newSlot: AppointmentSlot = {
      id: aptId,
      patientId: `PAT-WEB-${Math.floor(100 + Math.random() * 899)}`,
      patientName: fullName,
      patientPhone: phone,
      doctorName: clinicService.includes("Dental")
        ? "Dr. David Kimani (Dental Surgeon)"
        : clinicService.includes("Maternal") || clinicService.includes("ANC")
        ? "Dr. Sarah Ndegwa (OB/GYN)"
        : clinicService.includes("Physician") || clinicService.includes("Diabetes")
        ? "Dr. Amina Noor (Physician)"
        : "Dr. Kelvin Mwangi (MO)",
      roomName: "Consultation Suite (Online Web Booking)",
      date: preferredDate,
      timeSlot: preferredTime,
      purpose: `${clinicService} (${paymentScheme}) - Notes: ${patientNotes || "None"}`,
      status: "Confirmed",
      smsReminderSent: true,
      branchId: branches.find((b) => b.name === selectedBranch)?.id || branches[0].id,
    };

    addAppointment(newSlot);
    setBookingConfirmed(true);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* HEADER BANNER */}
      <section className="bg-gradient-to-b from-teal-950 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-500/30">
            Contact & Appointments
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Book An Appointment or Reach Our Clinic
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Reserve your consultation online to skip queue delays, or contact any of our outpatient branches directly.
          </p>
        </div>
      </section>

      {/* APPOINTMENT BOOKING FORM & CLINIC CONTACTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Form: Direct Booking */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
            <div className="pb-6 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                Online Reservation
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Schedule Your Outpatient Visit
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Your booking connects directly with our internal reception scheduling desk. An SMS confirmation will be sent upon submission.
              </p>
            </div>

            {bookingConfirmed ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  Appointment Confirmed!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <strong>{fullName}</strong>. Your consultation has been scheduled at{" "}
                  <strong>{selectedBranch}</strong> on <strong>{preferredDate}</strong> ({preferredTime}).
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 inline-block font-mono text-xs text-slate-800">
                  Booking Reference: <strong className="text-teal-700 font-bold">{confirmationCode}</strong>
                </div>
                <div className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Please arrive 10 minutes before your slot with your National ID and insurance card (if applicable).
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setBookingConfirmed(false);
                      setFullName("");
                      setPhone("");
                      setPatientNotes("");
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
                  >
                    Book Another Appointment
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 mt-6 text-xs">
                {/* Full Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wanjiku Kamau"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Phone Number (for SMS confirmation) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0722 000 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Email & Preferred Branch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Clinic Branch *
                    </label>
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-teal-500"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Clinic Service & Payment Scheme */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Medical Service / Clinic *
                    </label>
                    <select
                      value={clinicService}
                      onChange={(e) => setClinicService(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="General Outpatient Doctor Consultation">General Outpatient Doctor Consultation</option>
                      <option value="Antenatal Care (ANC) & 4D Obstetric Ultrasound">Antenatal Care (ANC) & 4D Obstetric Ultrasound</option>
                      <option value="Childhood Immunizations (KEPI Vaccines)">Childhood Immunizations (KEPI Vaccines)</option>
                      <option value="Dental Examination & Cleaning">Dental Examination & Cleaning</option>
                      <option value="Optical Eye Exam & Visual Refraction">Optical Eye Exam & Visual Refraction</option>
                      <option value="Specialist Physician (Hypertension & Diabetes)">Specialist Physician (Hypertension & Diabetes)</option>
                      <option value="Laboratory Test Only">Laboratory Diagnostic Tests Only</option>
                      <option value="Digital X-Ray / Ultrasound Scan">Digital DR X-Ray / Ultrasound Scan</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Payment / Insurance Scheme *
                    </label>
                    <select
                      value={paymentScheme}
                      onChange={(e) => setPaymentScheme(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="SHA (Social Health Authority)">SHA (Social Health Authority) / SHIF</option>
                      <option value="Private Insurance (Jubilee, AAR, Britam, etc)">Private Insurance (Jubilee, AAR, Britam, etc)</option>
                      <option value="Corporate Credit Scheme">Corporate Employer Credit Scheme</option>
                      <option value="Cash / M-Pesa at Till">Cash / M-Pesa</option>
                    </select>
                  </div>
                </div>

                {/* Preferred Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Preferred Time Window *
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="08:00 AM - 08:30 AM">Morning: 08:00 AM - 08:30 AM</option>
                      <option value="09:00 AM - 09:30 AM">Morning: 09:00 AM - 09:30 AM</option>
                      <option value="10:30 AM - 11:00 AM">Morning: 10:30 AM - 11:00 AM</option>
                      <option value="12:00 PM - 12:30 PM">Midday: 12:00 PM - 12:30 PM</option>
                      <option value="02:00 PM - 02:30 PM">Afternoon: 02:00 PM - 02:30 PM</option>
                      <option value="04:00 PM - 04:30 PM">Afternoon: 04:00 PM - 04:30 PM</option>
                      <option value="06:00 PM - 06:30 PM">Evening: 06:00 PM - 06:30 PM</option>
                    </select>
                  </div>
                </div>

                {/* Patient Notes */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Describe Your Main Symptoms / Special Requests (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly state your symptoms or any specific requirements..."
                    value={patientNotes}
                    onChange={(e) => setPatientNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-sm tracking-wide shadow-lg shadow-teal-600/20 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Confirm & Book Appointment</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 text-center">
                  By submitting this form, your request is logged with Afyaware Clinic MS and encrypted in accordance with the Kenya Data Protection Act 2019.
                </p>
              </form>
            )}
          </div>

          {/* Right Info: Locations, Contact Info, Emergency Hotline */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Emergency Box */}
            <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Emergency or Immediate Assistance?</span>
              </div>
              <p className="text-xs text-rose-800 leading-relaxed">
                If you are experiencing severe breathing difficulty, sudden chest pain, or heavy trauma, proceed immediately to our Westlands triage bay or call our ambulance dispatch hotline.
              </p>
              <div className="pt-2">
                <a
                  href="tel:+254709340100"
                  className="inline-flex items-center gap-2 text-xs font-black text-rose-700 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Emergency Dispatch: +254 709 340 100</span>
                </a>
              </div>
            </div>

            {/* Branches Directory */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600" />
                Branch Contacts & Location Map
              </h3>

              <div className="space-y-4 text-xs divide-y divide-slate-100">
                {branches.map((b) => (
                  <div key={b.id} className="pt-3 first:pt-0 space-y-1">
                    <div className="font-bold text-slate-900">{b.name}</div>
                    <div className="text-slate-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{b.location}</span>
                    </div>
                    <div className="text-slate-600 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{b.phone}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Till: {b.mpesaTill} • Paybill: {b.mpesaPaybill}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs text-xs">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                Clinic Working Hours
              </h3>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-800">Monday – Friday:</span>
                  <span>7:00 AM – 9:00 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-800">Saturday:</span>
                  <span>7:00 AM – 9:00 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-800">Sunday & Public Holidays:</span>
                  <span>8:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between py-1 text-teal-700 font-bold">
                  <span>Day Observation Ward:</span>
                  <span>24 Hours Continuous</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
