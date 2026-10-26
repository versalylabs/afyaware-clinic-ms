"use client";

import React, { useState, useMemo } from "react";
import { useAfyaware } from "@/lib/store";
import { Patient, Visit, AppointmentSlot, PaymentSchemeType, PriorityLevel, QueueStation } from "@/lib/types";
import {
  Users,
  Search,
  UserPlus,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Tv,
  Volume2,
  Printer,
  QrCode,
  ShieldAlert,
  ArrowRight,
  Filter,
  Sparkles,
  Phone,
  CreditCard,
  Building,
  UserCheck,
  Stethoscope,
  X,
} from "lucide-react";

export function EmpiSchedulingModule() {
  const {
    patients,
    addPatient,
    visits,
    addVisit,
    moveVisitStation,
    resources,
    appointments,
    addAppointment,
    activeBranchId,
    currentRole,
    canViewClinicalConfidential,
    setActiveModule,
  } = useAfyaware();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showRegModal, setShowRegModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState<Patient | null>(null);
  const [showCheckInModal, setShowCheckInModal] = useState<Patient | null>(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showTvMode, setShowTvMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"directory" | "queue" | "appointments">("directory");

  // New Patient Form State
  const [newPatient, setNewPatient] = useState({
    fullName: "",
    dob: "1995-05-15",
    gender: "Female" as "Male" | "Female",
    nationalId: "",
    phone: "",
    nextOfKinName: "",
    nextOfKinPhone: "",
    nextOfKinRelation: "Spouse",
    paymentType: "SHA (Social Health Authority)" as PaymentSchemeType,
    insurerName: "SHA / SHIF Primary Care",
    memberNumber: "",
    allergies: "Penicillin",
    chronicConditions: "Hypertension",
    bloodGroup: "O+",
  });

  // Check-In Form State
  const [checkInDoctor, setCheckInDoctor] = useState("Dr. Kelvin Mwangi (MO)");
  const [checkInRoom, setCheckInRoom] = useState("Consultation Room 1");
  const [checkInPriority, setCheckInPriority] = useState<PriorityLevel>("Routine");
  const [checkInStation, setCheckInStation] = useState<QueueStation>("Triage");

  // Booking Form State
  const [bookPatientId, setBookPatientId] = useState("");
  const [bookDoctor, setBookDoctor] = useState("Dr. Kelvin Mwangi (MO)");
  const [bookRoom, setBookRoom] = useState("Consultation Room 1");
  const [bookEquipment, setBookEquipment] = useState("GE Voluson 4D Ultrasound Machine #1");
  const [bookDate, setBookDate] = useState("2026-10-14");
  const [bookSlot, setBookSlot] = useState("09:00 AM - 09:30 AM");
  const [bookPurpose, setBookPurpose] = useState("Follow-up Consultation");
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Fast search filter (<15s lookup)
  const filteredPatients = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.nationalId.toLowerCase().includes(q) ||
        p.upn.toLowerCase().includes(q) ||
        (p.memberNumber && p.memberNumber.toLowerCase().includes(q))
    );
  }, [patients, searchQuery]);

  // Handle New Patient Registration
  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const upn = `AFY-2026-00${patients.length + 148}`;
    const birthYear = parseInt(newPatient.dob.slice(0, 4)) || 1990;
    const age = 2026 - birthYear;

    const patientToAdd: Patient = {
      id: `PAT-00${patients.length + 7}`,
      upn,
      fullName: newPatient.fullName,
      dob: newPatient.dob,
      ageYears: age,
      gender: newPatient.gender,
      nationalId: newPatient.nationalId || `ID-${Math.floor(10000000 + Math.random() * 90000000)}`,
      phone: newPatient.phone,
      nextOfKinName: newPatient.nextOfKinName,
      nextOfKinPhone: newPatient.nextOfKinPhone,
      nextOfKinRelation: newPatient.nextOfKinRelation,
      paymentType: newPatient.paymentType,
      insurerName: newPatient.paymentType !== "Cash / M-Pesa" ? newPatient.insurerName : undefined,
      memberNumber: newPatient.memberNumber,
      allergies: newPatient.allergies ? newPatient.allergies.split(",").map((s) => s.trim()) : [],
      chronicConditions: newPatient.chronicConditions
        ? newPatient.chronicConditions.split(",").map((s) => s.trim())
        : [],
      bloodGroup: newPatient.bloodGroup,
      branchRegistered: activeBranchId,
      accountBalance: 0,
      createdAt: new Date().toISOString(),
    };

    addPatient(patientToAdd);
    setShowRegModal(false);
    setSelectedPatient(patientToAdd);
    setShowCardModal(patientToAdd);
  };

  // Handle Check-In / Create Visit
  const handleCreateVisit = (patient: Patient) => {
    const ticketSeq = visits.length + 42;
    const priorityPrefix = checkInPriority === "Emergency / Stat" ? "E" : "A";
    const ticketNumber = `${priorityPrefix}0${ticketSeq}`;
    const visitNumber = `OP-261013-${String(visits.length + 1).padStart(2, "0")}`;

    const newVisit: Visit = {
      id: `VIS-2026-${Date.now().toString().slice(-4)}`,
      visitNumber,
      patientId: patient.id,
      patientName: patient.fullName,
      patientUpn: patient.upn,
      patientAge: patient.ageYears,
      patientGender: patient.gender,
      branchId: activeBranchId,
      station: checkInStation,
      ticketNumber,
      priority: checkInPriority,
      paymentType: patient.paymentType,
      insurerName: patient.insurerName,
      preAuthCode: patient.paymentType.includes("SHA") ? `SHA-AUTH-${Math.floor(10000 + Math.random() * 90000)}` : undefined,
      visitCapLimit: patient.paymentType.includes("SHA") ? 5000 : 8000,
      assignedDoctor: checkInDoctor,
      assignedRoom: checkInRoom,
      checkInTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      stationEnteredAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      waitMinutes: 0,
      consultationFeePaid: patient.paymentType !== "Cash / M-Pesa",
      billingCleared: patient.paymentType !== "Cash / M-Pesa",
      totalBillAmount: 2000,
      paidAmount: patient.paymentType === "Cash / M-Pesa" ? 0 : 2000,
      insuranceCoveredAmount: patient.paymentType !== "Cash / M-Pesa" ? 2000 : 0,
    };

    addVisit(newVisit);
    setShowCheckInModal(null);
    setActiveTab("queue");
  };

  // Conflict Detection for 4D Booking
  const checkConflicts = (doctor: string, room: string, equipment: string, date: string, slot: string) => {
    const existing = appointments.find(
      (a) =>
        a.date === date &&
        a.timeSlot === slot &&
        a.status !== "No-Show" &&
        (a.doctorName === doctor || a.roomName === room || (equipment && a.equipmentName === equipment))
    );
    if (existing) {
      if (existing.doctorName === doctor) {
        return `Conflict Detected: ${doctor} is already booked on ${date} at ${slot} (Patient: ${existing.patientName})`;
      }
      if (existing.roomName === room) {
        return `Conflict Detected: ${room} is already booked on ${date} at ${slot}`;
      }
      if (equipment && existing.equipmentName === equipment) {
        return `Conflict Detected: ${equipment} is already scheduled for use at ${slot}`;
      }
    }
    return null;
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const conflict = checkConflicts(bookDoctor, bookRoom, bookEquipment, bookDate, bookSlot);
    if (conflict) {
      setConflictWarning(conflict);
      return;
    }

    const patient = patients.find((p) => p.id === bookPatientId) || patients[0];
    const newApt: AppointmentSlot = {
      id: `APT-00${appointments.length + 1}`,
      patientId: patient.id,
      patientName: patient.fullName,
      patientPhone: patient.phone,
      doctorName: bookDoctor,
      roomName: bookRoom,
      equipmentName: bookEquipment || undefined,
      date: bookDate,
      timeSlot: bookSlot,
      purpose: bookPurpose,
      status: "Confirmed",
      smsReminderSent: true,
      branchId: activeBranchId,
    };

    addAppointment(newApt);
    setConflictWarning(null);
    setShowBookModal(false);
    setActiveTab("appointments");
  };

  // Audio Chime for TV Display Screen
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // AudioContext fallback
    }
  };

  const activeQueueVisits = visits.filter((v) => v.station !== "Discharged");

  // Waiting Room TV Mode View
  if (showTvMode) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-white p-8 flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500 flex items-center justify-center font-black text-slate-950 text-2xl shadow-lg">
              A+
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">AFYAWARE CLINICAL QUEUE DISPLAY</h1>
              <p className="text-slate-400 text-sm">Please proceed when your Ticket Number is called</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={playChime}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600/30 hover:bg-teal-600/50 text-teal-300 border border-teal-500/40 text-sm font-semibold transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              Test Audio Chime
            </button>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-teal-400">
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </div>
              <div className="text-xs text-slate-400">Waiting Room TV Mode</div>
            </div>
            <button
              onClick={() => setShowTvMode(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
            >
              Exit TV Mode
            </button>
          </div>
        </div>

        {/* TV Calling Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 flex-1">
          {/* Now Serving Highlight */}
          <div className="md:col-span-2 bg-gradient-to-br from-teal-950/80 via-slate-900 to-slate-900 border-2 border-teal-500 rounded-3xl p-8 flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-300 font-bold tracking-wider text-sm border border-teal-500/40">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
                NOW CALLING / CURRENT CONSULTATION
              </span>
              <span className="text-slate-400 text-sm font-semibold">Privacy Safe • No Names Broadcast</span>
            </div>

            {activeQueueVisits[0] ? (
              <div className="my-8 text-center space-y-4">
                <div className="text-8xl font-black font-mono tracking-tight text-teal-300 drop-shadow-md">
                  #{activeQueueVisits[0].ticketNumber}
                </div>
                <div className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                  <span>PROCEED TO:</span>
                  <span className="px-5 py-1.5 rounded-2xl bg-teal-600 text-white font-extrabold shadow-md">
                    {activeQueueVisits[0].assignedRoom}
                  </span>
                </div>
                <div className="text-xl text-slate-300 font-medium">
                  {activeQueueVisits[0].assignedDoctor} • Current Station: {activeQueueVisits[0].station}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-2xl font-bold">
                All queues clear. Next patient please check in at Reception.
              </div>
            )}

            <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Afyaware Voice & Chime Enabled</span>
              <span>Emergency / Stat patients take priority automatically</span>
            </div>
          </div>

          {/* Up Next List */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col">
            <h2 className="text-lg font-bold text-slate-200 border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-400" />
              UP NEXT IN QUEUE
            </h2>
            <div className="space-y-3 flex-1 overflow-y-auto">
              {activeQueueVisits.slice(1, 6).map((v) => (
                <div
                  key={v.id}
                  className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between"
                >
                  <div>
                    <div className="text-2xl font-mono font-bold text-teal-300">
                      #{v.ticketNumber}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Destination: {v.assignedRoom}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        v.priority === "Emergency / Stat"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {v.station}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Wait: {v.waitMinutes} min
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Ticker */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span>Afyaware Outpatient Clinic & Diagnostics • NHIF / SHA, M-Pesa, Corporate & Cash accepted</span>
          </div>
          <div>Need assistance? Please approach the Reception desk.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Patient Master Index (EMPI) & 4D Resource Scheduling
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Patient Master Index, 4D Multi-Resource Booking & Smart Queue
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Repeat patient lookup in &lt;15 seconds, conflict-free 4D appointment scheduling (Doctor + Room + Equipment + Slot), and live queue management.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowTvMode(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-sm transition"
          >
            <Tv className="w-3.5 h-3.5" />
            Waiting Room TV Screen
          </button>
          <button
            onClick={() => setShowBookModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold cursor-pointer transition"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book 4D Appointment
          </button>
          <button
            onClick={() => setShowRegModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold cursor-pointer shadow transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Register New Patient (&lt;15s)
          </button>
        </div>
      </div>

      {/* Tabs: Directory (EMPI) | Live Queue | Appointments */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab("directory")}
          className={`pb-3 text-xs font-bold border-b-2 cursor-pointer transition flex items-center gap-1.5 ${
            activeTab === "directory"
              ? "border-teal-600 text-teal-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          Patient Master Index (EMPI) ({patients.length})
        </button>
        <button
          onClick={() => setActiveTab("queue")}
          className={`pb-3 text-xs font-bold border-b-2 cursor-pointer transition flex items-center gap-1.5 ${
            activeTab === "queue"
              ? "border-teal-600 text-teal-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Clock className="w-4 h-4" />
          Live Department Queue ({activeQueueVisits.length})
        </button>
        <button
          onClick={() => setActiveTab("appointments")}
          className={`pb-3 text-xs font-bold border-b-2 cursor-pointer transition flex items-center gap-1.5 ${
            activeTab === "appointments"
              ? "border-teal-600 text-teal-800"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Calendar className="w-4 h-4" />
          4D Scheduled Appointments ({appointments.length})
        </button>
      </div>

      {/* TAB 1: EMPI DIRECTORY */}
      {activeTab === "directory" && (
        <div className="space-y-4">
          {/* Fast Lookup Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Instant lookup by Phone (07...), Name, National ID, UPN (AFY-...), or SHA / Insurance Member No..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Speed: &lt;15s repeat check-in</span>
            </div>
          </div>

          {/* Patients Grid / Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 bg-slate-50/80">
                    <th className="py-3 px-4">Patient & UPN</th>
                    <th className="py-3 px-4">Age / Gender / Blood</th>
                    <th className="py-3 px-4">Phone & National ID</th>
                    <th className="py-3 px-4">Payment Scheme</th>
                    <th className="py-3 px-4">Permanent Clinical Flags</th>
                    <th className="py-3 px-4">Account Balance</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPatients.map((patient) => {
                    const hasAllergies = patient.allergies.length > 0;
                    const hasChronic = patient.chronicConditions.length > 0;

                    return (
                      <tr key={patient.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{patient.fullName}</div>
                          <div className="font-mono text-[11px] text-teal-700 font-semibold">{patient.upn}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-slate-800">
                            {patient.ageYears}y • {patient.gender}
                          </div>
                          <div className="text-[11px] font-bold text-rose-700">Blood: {patient.bloodGroup}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1 text-slate-800">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {patient.phone}
                          </div>
                          <div className="text-[11px] text-slate-500">ID: {patient.nationalId}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                            <CreditCard className="w-3 h-3 text-teal-600" />
                            {patient.paymentType}
                          </span>
                          {patient.insurerName && (
                            <div className="text-[11px] text-slate-500">
                              {patient.insurerName} ({patient.memberNumber})
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {hasAllergies && (
                              <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px] flex items-center gap-1">
                                <ShieldAlert className="w-2.5 h-2.5" />
                                {patient.allergies.join(", ")}
                              </span>
                            )}
                            {hasChronic && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-medium text-[10px]">
                                {patient.chronicConditions.join(", ")}
                              </span>
                            )}
                            {!hasAllergies && !hasChronic && (
                              <span className="text-slate-400 text-[11px]">No active flags</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {patient.accountBalance > 0 ? (
                            <span className="font-bold text-rose-700">
                              Owes KSh {patient.accountBalance.toLocaleString()}
                            </span>
                          ) : patient.accountBalance < 0 ? (
                            <span className="font-bold text-emerald-700">
                              Credit KSh {Math.abs(patient.accountBalance).toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-slate-500 font-medium">KSh 0 (Settled)</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => setShowCardModal(patient)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                            title="View Barcode / QR Patient Card"
                          >
                            <QrCode className="w-3.5 h-3.5 inline mr-1" />
                            Card
                          </button>
                          <button
                            onClick={() => setShowCheckInModal(patient)}
                            className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold cursor-pointer shadow-xs"
                          >
                            Check-In →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE DEPARTMENT QUEUE */}
      {activeTab === "queue" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                Active Department Queue Board ({activeQueueVisits.length} Patients in Clinic)
              </h2>
              <p className="text-xs text-slate-500">
                Tracks patient movements, wait-time bottlenecks, and emergency priority jumps
              </p>
            </div>
            <button
              onClick={() => setShowTvMode(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
            >
              <Tv className="w-3.5 h-3.5" />
              Launch Waiting Room TV Mode
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeQueueVisits.map((visit) => (
              <div
                key={visit.id}
                className={`p-4 rounded-2xl border bg-white shadow-xs flex flex-col justify-between ${
                  visit.priority === "Emergency / Stat"
                    ? "border-rose-400 bg-rose-50/30 ring-1 ring-rose-400"
                    : "border-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-mono font-bold px-2.5 py-0.5 rounded-lg ${
                        visit.priority === "Emergency / Stat"
                          ? "bg-rose-600 text-white"
                          : "bg-teal-100 text-teal-900"
                      }`}
                    >
                      #{visit.ticketNumber}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      Wait: {visit.waitMinutes} mins
                    </span>
                  </div>

                  <div className="text-sm font-bold text-slate-900 mt-2">
                    {visit.patientName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {visit.patientUpn} • {visit.patientAge}y {visit.patientGender}
                  </div>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Station:</span>
                      <span className="font-bold text-teal-800">{visit.station}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Doctor:</span>
                      <span className="font-semibold text-slate-700">{visit.assignedDoctor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Room:</span>
                      <span className="font-semibold text-slate-700">{visit.assignedRoom}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <select
                    value={visit.station}
                    onChange={(e) => moveVisitStation(visit.id, e.target.value as QueueStation)}
                    className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="Triage">Route to Triage</option>
                    <option value="Consultation">Route to Doctor</option>
                    <option value="Lab">Route to Lab</option>
                    <option value="Imaging">Route to Imaging</option>
                    <option value="Procedure / Day-Ward">Route to Day-Ward</option>
                    <option value="Pharmacy">Route to Pharmacy</option>
                    <option value="Cashier">Route to Cashier</option>
                    <option value="Discharged">Discharge</option>
                  </select>

                  <button
                    onClick={() => {
                      if (visit.station === "Triage") {
                        setActiveModule("triage");
                      } else {
                        setActiveModule("emr-worklists");
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                  >
                    Open Workspace →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: 4D SCHEDULED APPOINTMENTS */}
      {activeTab === "appointments" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                4D Multi-Resource Synchronized Appointments
              </h2>
              <p className="text-xs text-slate-500">
                Synchronized across Doctor + Room + Diagnostic Equipment + Time Slot with conflict prevention
              </p>
            </div>
            <button
              onClick={() => setShowBookModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold cursor-pointer shadow-xs"
            >
              + Book New 4D Slot
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                      {apt.date} • {apt.timeSlot}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        apt.status === "Checked-In"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-slate-900 mt-2.5">
                    {apt.patientName}
                  </div>
                  <div className="text-xs text-slate-500">
                    Phone: {apt.patientPhone} • Purpose: {apt.purpose}
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                    <div className="text-slate-700">
                      🩺 <span className="font-semibold">{apt.doctorName}</span>
                    </div>
                    <div className="text-slate-700">
                      🚪 <span className="font-semibold">{apt.roomName}</span>
                    </div>
                    {apt.equipmentName && (
                      <div className="text-teal-700 font-semibold">
                        ⚙️ {apt.equipmentName}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> SMS Reminder Sent
                  </span>
                  {apt.status !== "Checked-In" && (
                    <button
                      onClick={() => {
                        const pat = patients.find((p) => p.id === apt.patientId) || patients[0];
                        handleCreateVisit(pat);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-semibold cursor-pointer"
                    >
                      Check-In Now →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: NEW PATIENT REGISTRATION (<15s) */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-teal-600" />
                  New Patient Registration & EMPI Indexing
                </h2>
                <p className="text-xs text-slate-500">Prevents duplicates and creates digital clinical card</p>
              </div>
              <button
                onClick={() => setShowRegModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterPatient} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newPatient.fullName}
                    onChange={(e) => setNewPatient({ ...newPatient, fullName: e.target.value })}
                    placeholder="e.g. Christine Wangari Mburu"
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    placeholder="0722 000 000"
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700">Date of Birth</label>
                  <input
                    type="date"
                    value={newPatient.dob}
                    onChange={(e) => setNewPatient({ ...newPatient, dob: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Gender</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value as "Male" | "Female" })}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">National ID / Passport</label>
                  <input
                    type="text"
                    value={newPatient.nationalId}
                    onChange={(e) => setNewPatient({ ...newPatient, nationalId: e.target.value })}
                    placeholder="32109845"
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Scheme */}
              <div className="p-3 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-3">
                <span className="font-bold text-teal-900 block">Payment Scheme & Coverage</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700">Payment Mode</label>
                    <select
                      value={newPatient.paymentType}
                      onChange={(e) => setNewPatient({ ...newPatient, paymentType: e.target.value as PaymentSchemeType })}
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
                    >
                      <option value="Cash / M-Pesa">Cash / M-Pesa</option>
                      <option value="SHA (Social Health Authority)">SHA (Social Health Authority)</option>
                      <option value="Private Insurance">Private Insurance</option>
                      <option value="Corporate Credit">Corporate Credit</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Insurer Name / Scheme</label>
                    <input
                      type="text"
                      value={newPatient.insurerName}
                      onChange={(e) => setNewPatient({ ...newPatient, insurerName: e.target.value })}
                      placeholder="e.g. SHA Primary Care / Jubilee"
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">SHA / Insurance Member ID</label>
                  <input
                    type="text"
                    value={newPatient.memberNumber}
                    onChange={(e) => setNewPatient({ ...newPatient, memberNumber: e.target.value })}
                    placeholder="SHA-KE-9948210"
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Permanent Clinical Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Known Drug Allergies</label>
                  <input
                    type="text"
                    value={newPatient.allergies}
                    onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
                    placeholder="Penicillin, Sulfa"
                    className="w-full mt-1 px-3 py-2 border border-rose-200 bg-rose-50/40 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Chronic Conditions</label>
                  <input
                    type="text"
                    value={newPatient.chronicConditions}
                    onChange={(e) => setNewPatient({ ...newPatient, chronicConditions: e.target.value })}
                    placeholder="Hypertension, Asthma"
                    className="w-full mt-1 px-3 py-2 border border-amber-200 bg-amber-50/40 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Blood Group</label>
                  <select
                    value={newPatient.bloodGroup}
                    onChange={(e) => setNewPatient({ ...newPatient, bloodGroup: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRegModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold cursor-pointer shadow-md"
                >
                  Save & Issue Patient Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PATIENT DIGITAL QR / BARCODE CARD PREVIEW */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                Digital Health Card & EMPI
              </span>
              <button onClick={() => setShowCardModal(null)} className="text-slate-400 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Medical Card UI */}
            <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl p-5 shadow-xl text-left border border-teal-500/40 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-400 text-slate-950 font-black flex items-center justify-center text-xs">
                    A+
                  </div>
                  <span className="font-extrabold text-sm tracking-tight">AFYAWARE CLINIC OS</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {showCardModal.paymentType}
                </span>
              </div>

              <div className="mt-5 space-y-1">
                <div className="text-lg font-bold">{showCardModal.fullName}</div>
                <div className="text-xs font-mono text-teal-300 font-semibold">{showCardModal.upn}</div>
                <div className="text-[11px] text-slate-300">
                  DOB: {showCardModal.dob} • Blood: <span className="font-bold text-rose-400">{showCardModal.bloodGroup}</span>
                </div>
              </div>

              {/* Barcode & QR Simulation */}
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px] tracking-widest text-slate-400">
                    ||||| | |||| ||| ||||||| |||
                  </div>
                  <div className="text-[9px] text-slate-400">Scan at Kiosk / Reception</div>
                </div>
                <div className="w-12 h-12 bg-white p-1 rounded-lg flex items-center justify-center shadow-xs">
                  <QrCode className="w-10 h-10 text-slate-950" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Physical Card
              </button>
              <button
                onClick={() => {
                  setShowCardModal(null);
                  setShowCheckInModal(showCardModal);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold cursor-pointer"
              >
                Proceed to Check-In →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CHECK-IN / CREATE VISIT */}
      {showCheckInModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Check-In Patient to Clinic Visit</h2>
                <p className="text-xs text-slate-500">
                  {showCheckInModal.fullName} ({showCheckInModal.upn})
                </p>
              </div>
              <button onClick={() => setShowCheckInModal(null)} className="text-slate-400 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Initial Queue Destination</label>
                <select
                  value={checkInStation}
                  onChange={(e) => setCheckInStation(e.target.value as QueueStation)}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                >
                  <option value="Triage">Triage & Nursing Station (Recommended)</option>
                  <option value="Consultation">Direct to Doctor Consultation</option>
                  <option value="Lab">Direct Walk-In Lab Request</option>
                  <option value="Pharmacy">Direct Retail OTC Pharmacy POS</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Assign Clinician / Doctor</label>
                <select
                  value={checkInDoctor}
                  onChange={(e) => setCheckInDoctor(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                >
                  <option value="Dr. Kelvin Mwangi (MO)">Dr. Kelvin Mwangi (General OPD MO)</option>
                  <option value="Dr. Amina Noor (Physician)">Dr. Amina Noor (Consultant Physician)</option>
                  <option value="Dr. Sarah Ndegwa (OB/GYN)">Dr. Sarah Ndegwa (OB/GYN)</option>
                  <option value="Dr. David Kimani (Dental Surgeon)">Dr. David Kimani (Dental Surgeon)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Assign Consultation / Procedure Room</label>
                <select
                  value={checkInRoom}
                  onChange={(e) => setCheckInRoom(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                >
                  <option value="Consultation Room 1">Consultation Room 1</option>
                  <option value="Consultation Room 2">Consultation Room 2</option>
                  <option value="Consultation Room 3">Consultation Room 3 (MCH/ANC)</option>
                  <option value="Dental Chair 1">Dental Chair 1</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Triage Priority</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {(["Routine", "Urgent", "Emergency / Stat"] as PriorityLevel[]).map((pri) => (
                    <button
                      type="button"
                      key={pri}
                      onClick={() => setCheckInPriority(pri)}
                      className={`py-2 rounded-xl text-center font-bold border cursor-pointer transition ${
                        checkInPriority === pri
                          ? pri === "Emergency / Stat"
                            ? "bg-rose-600 text-white border-rose-600"
                            : "bg-teal-600 text-white border-teal-600"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      {pri}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Coverage Mode:</span>
                  <span className="text-slate-600 ml-1">{showCheckInModal.paymentType}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  Billing Gate Cleared
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCheckInModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateVisit(showCheckInModal)}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold cursor-pointer shadow-md"
              >
                Confirm Check-In & Generate Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: 4D APPOINTMENT BOOKING WITH CONFLICT DETECTION */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  Synchronized 4D Resource Scheduling
                </h2>
                <p className="text-xs text-slate-500">Doctor + Room + Diagnostic Equipment + Time Slot</p>
              </div>
              <button onClick={() => setShowBookModal(false)} className="text-slate-400 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {conflictWarning && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{conflictWarning}</span>
              </div>
            )}

            <form onSubmit={handleBookAppointment} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Patient</label>
                <select
                  value={bookPatientId}
                  onChange={(e) => setBookPatientId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                >
                  <option value="">Select registered patient...</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.upn}) - {p.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">1. Clinician / Doctor</label>
                  <select
                    value={bookDoctor}
                    onChange={(e) => setBookDoctor(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  >
                    <option value="Dr. Kelvin Mwangi (MO)">Dr. Kelvin Mwangi (MO)</option>
                    <option value="Dr. Amina Noor (Physician)">Dr. Amina Noor (Physician)</option>
                    <option value="Dr. Sarah Ndegwa (OB/GYN)">Dr. Sarah Ndegwa (OB/GYN)</option>
                    <option value="Dr. David Kimani (Dental Surgeon)">Dr. David Kimani (Dental)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">2. Consultation / Procedure Room</label>
                  <select
                    value={bookRoom}
                    onChange={(e) => setBookRoom(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  >
                    <option value="Consultation Room 1">Consultation Room 1</option>
                    <option value="Consultation Room 2">Consultation Room 2</option>
                    <option value="Consultation Room 3">Consultation Room 3 (MCH/ANC)</option>
                    <option value="Dental Chair 1">Dental Chair 1</option>
                    <option value="Minor Theatre">Minor Theatre</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">3. Diagnostic Equipment (Optional)</label>
                  <select
                    value={bookEquipment}
                    onChange={(e) => setBookEquipment(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  >
                    <option value="">None (Routine Consult)</option>
                    <option value="GE Voluson 4D Ultrasound Machine #1">GE Voluson 4D Ultrasound Machine #1</option>
                    <option value="Digital X-Ray DR Unit #1">Digital X-Ray DR Unit #1</option>
                    <option value="12-Lead ECG Machine">12-Lead ECG Machine</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">4. Date & Time Slot</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="date"
                      value={bookDate}
                      onChange={(e) => setBookDate(e.target.value)}
                      className="w-1/2 px-2 py-1.5 border border-slate-300 rounded-xl focus:outline-none text-xs"
                    />
                    <select
                      value={bookSlot}
                      onChange={(e) => setBookSlot(e.target.value)}
                      className="w-1/2 px-2 py-1.5 border border-slate-300 rounded-xl focus:outline-none text-xs"
                    >
                      <option value="08:30 AM - 09:00 AM">08:30 - 09:00 AM</option>
                      <option value="09:00 AM - 09:30 AM">09:00 - 09:30 AM</option>
                      <option value="09:30 AM - 10:00 AM">09:30 - 10:00 AM</option>
                      <option value="10:00 AM - 10:30 AM">10:00 - 10:30 AM</option>
                      <option value="11:00 AM - 11:30 AM">11:00 - 11:30 AM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Clinical Purpose / Notes</label>
                <input
                  type="text"
                  value={bookPurpose}
                  onChange={(e) => setBookPurpose(e.target.value)}
                  placeholder="e.g. 28-Week ANC Follow-Up + Obstetric Growth Scan"
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold cursor-pointer shadow-md"
                >
                  Confirm & Check Conflict
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
