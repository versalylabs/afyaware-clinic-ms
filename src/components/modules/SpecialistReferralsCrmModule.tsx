"use client";

import React, { useState } from "react";
import { useAfyaware } from "@/lib/store";
import {
  DentalToothRecord,
  KepiImmunizationRecord,
  OpticalRefractionRecord,
  ClinicalReferralRecord,
  DoctorCommissionRecord,
  ChronicRefillLead,
} from "@/lib/types";
import {
  Smile,
  Baby,
  Eye,
  Send,
  Coins,
  MessageCircle,
  FileText,
  Printer,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  UserCheck,
  Building,
  PlusCircle,
  ShieldAlert,
  Percent,
  Check,
} from "lucide-react";

export function SpecialistReferralsCrmModule() {
  const {
    teeth,
    kepiRecords,
    opticalRecords,
    referrals,
    commissions,
    chronicLeads,
    visits,
    branches,
    activeBranchId,
    updateTooth,
    updateKepiRecord,
    addKepiRecord,
    addOpticalRecord,
    addReferral,
    updateReferral,
    updateCommission,
    updateChronicLead,
    addAuditLog,
  } = useAfyaware();

  const [activeTab, setActiveTab] = useState<
    "dental" | "mch-kepi" | "optical" | "referrals" | "commissions" | "chronic-crm"
  >("dental");

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  // ==========================================
  // TAB 1: DENTAL ODONTOGRAM
  // ==========================================
  const [selectedToothNum, setSelectedToothNum] = useState<number>(16);
  const selectedTooth = teeth.find((t) => t.toothNumber === selectedToothNum) || teeth[0];

  const handleUpdateToothStatus = (status: DentalToothRecord["status"], notes?: string) => {
    updateTooth(selectedToothNum, {
      status,
      notes: notes || selectedTooth.notes,
    });
  };

  // ==========================================
  // TAB 2: MCH / ANC & KEPI IMMUNIZATION
  // ==========================================
  const [vaccineSearch, setVaccineSearch] = useState<string>("");
  const [showAddVaccineModal, setShowAddVaccineModal] = useState<boolean>(false);
  const [newChildName, setNewChildName] = useState<string>("Baby Kamau");
  const [newChildUpn, setNewChildUpn] = useState<string>("AFY-2026-00142-C1");
  const [newVaccineName, setNewVaccineName] = useState<string>("Measles-Rubella 2 (18 Months)");
  const [newVaccineDueDate, setNewVaccineDueDate] = useState<string>("2028-02-10");

  const filteredKepi = kepiRecords.filter((r) =>
    r.childName.toLowerCase().includes(vaccineSearch.toLowerCase()) ||
    r.vaccineName.toLowerCase().includes(vaccineSearch.toLowerCase()) ||
    r.childUpn.toLowerCase().includes(vaccineSearch.toLowerCase())
  );

  const handleAdministerVaccine = (recordId: string) => {
    updateKepiRecord(recordId, {
      status: "Administered",
      administeredDate: new Date().toISOString().slice(0, 10),
      administeredBy: "RN. Mercy Chepkirui",
      batchNumber: `KEPI-BATCH-${Math.floor(1000 + Math.random() * 9000)}`,
    });
  };

  const handleCreateKepiRecord = () => {
    addKepiRecord({
      id: `IMM-${Date.now().toString().slice(-4)}`,
      childName: newChildName,
      childUpn: newChildUpn,
      dateOfBirth: "2026-08-10",
      vaccineName: newVaccineName,
      targetAgeWeeks: 78,
      dueDate: newVaccineDueDate,
      status: "Due",
    });
    setShowAddVaccineModal(false);
  };

  // ==========================================
  // TAB 3: OPTICAL REFRACTION
  // ==========================================
  const [showNewRefractionModal, setShowNewRefractionModal] = useState<boolean>(false);
  const [optPatientUpn, setOptPatientUpn] = useState<string>("AFY-2026-00145");
  const [odSphere, setOdSphere] = useState<number>(-1.5);
  const [odCyl, setOdCyl] = useState<number>(-0.5);
  const [odAxis, setOdAxis] = useState<number>(90);
  const [osSphere, setOsSphere] = useState<number>(-1.75);
  const [osCyl, setOsCyl] = useState<number>(-0.75);
  const [osAxis, setOsAxis] = useState<number>(85);
  const [pdMm, setPdMm] = useState<number>(62);
  const [optNotes, setOptNotes] = useState<string>("Blue-cut anti-reflective single vision lenses.");

  const handleSaveRefraction = () => {
    const patient = visits.find((v) => v.patientUpn === optPatientUpn);
    addOpticalRecord({
      id: `OPT-${Date.now().toString().slice(-4)}`,
      patientId: patient?.patientId || "PAT-001",
      patientName: patient?.patientName || "Fatuma Halima Hassan",
      patientUpn: optPatientUpn,
      examDate: new Date().toISOString().slice(0, 10),
      optometristName: "Dr. James Karanja (Optometrist)",
      odSphere,
      odCylinder: odCyl,
      odAxis,
      osSphere,
      osCylinder: osCyl,
      osAxis,
      pupillaryDistanceMm: pdMm,
      recommendations: optNotes,
    });
    setShowNewRefractionModal(false);
  };

  // ==========================================
  // TAB 4: CLINICAL REFERRALS & MOH FORM
  // ==========================================
  const [showReferralModal, setShowReferralModal] = useState<boolean>(false);
  const [showPrintReferralModal, setShowPrintReferralModal] = useState<boolean>(false);
  const [activePrintReferral, setActivePrintReferral] = useState<ClinicalReferralRecord | null>(referrals[0] || null);

  const [refPatientName, setRefPatientName] = useState<string>("David Ochieng Otieno");
  const [refPatientUpn, setRefPatientUpn] = useState<string>("AFY-2026-00146");
  const [refType, setRefType] = useState<"Outgoing" | "Incoming">("Outgoing");
  const [refFacility, setRefFacility] = useState<string>("Kenyatta National Hospital (Cardiology)");
  const [refSpecialty, setRefSpecialty] = useState<ClinicalReferralRecord["specialty"]>("Cardiology");
  const [refPriority, setRefPriority] = useState<ClinicalReferralRecord["priority"]>("Urgent");
  const [refSummary, setRefSummary] = useState<string>("Refractory Stage 2 Essential Hypertension with BP 178/104 mmHg. Needs specialist Holter and 2D Echo.");
  const [refDiagnosis, setRefDiagnosis] = useState<string>("Essential (Primary) Hypertension - Refractory");

  const handleSaveReferral = () => {
    const mohNum = `MOH-REF-${Date.now().toString().slice(-4)}`;
    const newRef: ClinicalReferralRecord = {
      id: `REF-${Date.now().toString().slice(-4)}`,
      referralType: refType,
      patientName: refPatientName,
      patientUpn: refPatientUpn,
      patientAge: 42,
      patientGender: "Male",
      date: new Date().toISOString().slice(0, 10),
      referringFacilityOrDoctor: refType === "Outgoing" ? `${activeBranch.name} (Dr. Kelvin Mwangi)` : refFacility,
      receivingFacilityOrSpecialist: refType === "Outgoing" ? refFacility : `${activeBranch.name}`,
      specialty: refSpecialty,
      priority: refPriority,
      clinicalSummary: refSummary,
      provisionalDiagnosis: refDiagnosis,
      status: "Dispatched",
      mohFormNumber: mohNum,
    };
    addReferral(newRef);
    setShowReferralModal(false);
    setActivePrintReferral(newRef);
    setShowPrintReferralModal(true);
  };

  // ==========================================
  // TAB 5: DOCTOR COMMISSIONS & WHT
  // ==========================================
  const handleApproveCommission = (commId: string) => {
    updateCommission(commId, { paymentStatus: "Approved" });
  };

  const handleMarkCommissionPaid = (commId: string) => {
    updateCommission(commId, { paymentStatus: "Paid via M-Pesa / Bank" });
  };

  // ==========================================
  // TAB 6: CHRONIC CARE DAY-27 REFILL CRM
  // ==========================================
  const handleTriggerRefillAlert = (leadId: string, channel: "WhatsApp" | "SMS") => {
    updateChronicLead(leadId, {
      reminderStatus: channel === "WhatsApp" ? "WhatsApp Sent" : "SMS Sent",
    });
    alert(`${channel} reminder dispatched for 30-day refill prescription!`);
  };

  const handleMarkRefillCollected = (leadId: string) => {
    updateChronicLead(leadId, { reminderStatus: "Refill Collected" });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                Specialized Clinical & Retention Care
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <Smile className="w-6 h-6 text-indigo-600" />
              Specialist Clinics, Referrals, Doctor Commissions & Chronic CRM
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Interactive 32-tooth Dental Odontogram • MCH / KEPI immunization schedule • Optical refraction • MOH Clinical Referral letters • 5% KRA WHT doctor locum commissions • Day-27 chronic refills
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 font-bold text-slate-700 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-500" />
              {activeBranch.name}
            </span>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-6 pt-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("dental")}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "dental"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Smile className="w-4 h-4" />
            Dental Odontogram
          </button>
          <button
            onClick={() => setActiveTab("mch-kepi")}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "mch-kepi"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Baby className="w-4 h-4" />
            MCH / ANC & KEPI Vaccines
          </button>
          <button
            onClick={() => setActiveTab("optical")}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "optical"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Eye className="w-4 h-4" />
            Optical Refraction
          </button>
          <button
            onClick={() => setActiveTab("referrals")}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "referrals"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Send className="w-4 h-4" />
            MOH Clinical Referrals
          </button>
          <button
            onClick={() => setActiveTab("commissions")}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "commissions"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Coins className="w-4 h-4" />
            Doctor Commissions & WHT
          </button>
          <button
            onClick={() => setActiveTab("chronic-crm")}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "chronic-crm"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Day-27 Chronic Refill CRM
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 font-bold">
              {chronicLeads.filter((l) => l.reminderStatus === "Queued (Day 27)").length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DENTAL ODONTOGRAM */}
      {/* ========================================================================= */}
      {activeTab === "dental" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 32-Tooth Interactive Odontogram Grid (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Smile className="w-4 h-4 text-indigo-600" />
                    Adult Dental Charting Odontogram (Universal 1–32)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Click any tooth to examine surface anatomy, status, restoration, or extraction
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-semibold">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Healthy</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Caries</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Filled</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Crown</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" /> Missing</span>
                </div>
              </div>

              {/* Upper Arch (1 to 16) */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Maxillary Arch (Upper Teeth 1 – 16)
                </div>
                <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
                  {teeth.slice(0, 16).map((t) => {
                    const isSelected = t.toothNumber === selectedToothNum;
                    const colorBg =
                      t.status === "Healthy"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                        : t.status === "Caries / Decay"
                        ? "bg-rose-50 border-rose-300 text-rose-900"
                        : t.status === "Filled"
                        ? "bg-blue-50 border-blue-300 text-blue-900"
                        : t.status === "Crown"
                        ? "bg-amber-50 border-amber-300 text-amber-900"
                        : "bg-slate-100 border-slate-300 text-slate-400";

                    return (
                      <button
                        key={t.toothNumber}
                        onClick={() => setSelectedToothNum(t.toothNumber)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${colorBg} ${
                          isSelected ? "ring-2 ring-indigo-600 scale-105 shadow-md" : "hover:border-slate-400"
                        }`}
                      >
                        <div className="text-[10px] font-black">{t.toothNumber}</div>
                        <div className="text-[9px] font-semibold truncate mt-0.5">
                          {t.status.split(" ")[0]}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lower Arch (32 down to 17) */}
              <div className="pt-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Mandibular Arch (Lower Teeth 17 – 32)
                </div>
                <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
                  {teeth.slice(16, 32).map((t) => {
                    const isSelected = t.toothNumber === selectedToothNum;
                    const colorBg =
                      t.status === "Healthy"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                        : t.status === "Caries / Decay"
                        ? "bg-rose-50 border-rose-300 text-rose-900"
                        : t.status === "Filled"
                        ? "bg-blue-50 border-blue-300 text-blue-900"
                        : t.status === "Crown"
                        ? "bg-amber-50 border-amber-300 text-amber-900"
                        : "bg-slate-100 border-slate-300 text-slate-400";

                    return (
                      <button
                        key={t.toothNumber}
                        onClick={() => setSelectedToothNum(t.toothNumber)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${colorBg} ${
                          isSelected ? "ring-2 ring-indigo-600 scale-105 shadow-md" : "hover:border-slate-400"
                        }`}
                      >
                        <div className="text-[10px] font-black">{t.toothNumber}</div>
                        <div className="text-[9px] font-semibold truncate mt-0.5">
                          {t.status.split(" ")[0]}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Tooth Surface & Treatment Editor (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm">
                    #{selectedTooth.toothNumber}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Tooth #{selectedTooth.toothNumber} Details
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      {selectedTooth.toothNumber <= 16 ? "Maxillary Arch" : "Mandibular Arch"}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                  {selectedTooth.status}
                </span>
              </div>

              {/* Quick Status Selectors */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Clinical Diagnosis / Status
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(
                    [
                      "Healthy",
                      "Caries / Decay",
                      "Filled",
                      "Crown",
                      "Root Canal",
                      "Missing",
                      "Extracted",
                    ] as const
                  ).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateToothStatus(st)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        selectedTooth.status === st
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clinical Notes */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Procedure & Surface Notes
                </label>
                <textarea
                  rows={3}
                  value={selectedTooth.notes || ""}
                  onChange={(e) => handleUpdateToothStatus(selectedTooth.status, e.target.value)}
                  placeholder="e.g. Occlusal amalgam replacement with resin composite..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Surface diagram hint */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Five Surface Notation (MODBL)
                </div>
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700">
                  <span className="px-1.5 py-0.5 rounded bg-white border border-slate-300">M</span>
                  <span className="px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-300 text-indigo-700">O</span>
                  <span className="px-1.5 py-0.5 rounded bg-white border border-slate-300">D</span>
                  <span className="px-1.5 py-0.5 rounded bg-white border border-slate-300">B</span>
                  <span className="px-1.5 py-0.5 rounded bg-white border border-slate-300">L</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MCH / ANC & KEPI IMMUNIZATION SCHEDULE */}
      {/* ========================================================================= */}
      {activeTab === "mch-kepi" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Baby className="w-4 h-4 text-indigo-600" />
                  Kenyan Expanded Programme on Immunization (KEPI) Schedule
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  MOH standardized schedule: BCG, OPV, Pentavalent (DPT-HepB-Hib), Rotavirus, PCV-10 & Measles-Rubella
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search child, UPN or vaccine..."
                    value={vaccineSearch}
                    onChange={(e) => setVaccineSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl w-60 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  onClick={() => setShowAddVaccineModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Schedule Vaccine
                </button>
              </div>
            </div>

            {/* KEPI Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Child & UPN</th>
                    <th className="py-2.5 px-3">Vaccine Antigen</th>
                    <th className="py-2.5 px-3">Target Age</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3">Administered</th>
                    <th className="py-2.5 px-3">Nurse & Batch</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredKepi.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-900 block">{rec.childName}</span>
                        <span className="text-[10px] text-slate-500">{rec.childUpn}</span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {rec.vaccineName}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {rec.targetAgeWeeks === 0 ? "At Birth" : `${rec.targetAgeWeeks} Weeks`}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700">
                        {rec.dueDate}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700">
                        {rec.administeredDate || "—"}
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-600">
                        {rec.administeredBy ? (
                          <div>
                            <span className="block">{rec.administeredBy}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{rec.batchNumber}</span>
                          </div>
                        ) : "—"}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rec.status === "Administered"
                              ? "bg-emerald-100 text-emerald-800"
                              : rec.status === "Overdue"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {rec.status !== "Administered" && (
                          <button
                            onClick={() => handleAdministerVaccine(rec.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 cursor-pointer shadow-xs"
                          >
                            Administer
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: OPTICAL REFRACTION */}
      {/* ========================================================================= */}
      {activeTab === "optical" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  Optometry & Optical Refraction Examination Records
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Standardized optical Rx: OD (Right Eye), OS (Left Eye), Sphere, Cylinder, Axis & Pupillary Distance (PD)
                </p>
              </div>

              <button
                onClick={() => setShowNewRefractionModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Record Eye Examination
              </button>
            </div>

            <div className="space-y-3">
              {opticalRecords.map((opt) => (
                <div key={opt.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <span className="font-bold text-slate-900 text-xs">{opt.patientName}</span>
                      <span className="text-[11px] text-slate-500 ml-2">UPN: {opt.patientUpn}</span>
                    </div>
                    <div className="text-xs text-slate-600">
                      Examined by: <span className="font-semibold text-slate-900">{opt.optometristName}</span> • Date: {opt.examDate}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* OD (Right Eye) */}
                    <div className="p-3 rounded-lg bg-white border border-slate-200">
                      <div className="text-[10px] font-black uppercase text-indigo-700 mb-1">
                        OD — Oculus Dexter (Right Eye)
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div><span className="text-slate-400 block text-[10px]">Sphere:</span> <span className="font-bold">{opt.odSphere}</span></div>
                        <div><span className="text-slate-400 block text-[10px]">Cylinder:</span> <span className="font-bold">{opt.odCylinder}</span></div>
                        <div><span className="text-slate-400 block text-[10px]">Axis:</span> <span className="font-bold">{opt.odAxis}°</span></div>
                      </div>
                    </div>

                    {/* OS (Left Eye) */}
                    <div className="p-3 rounded-lg bg-white border border-slate-200">
                      <div className="text-[10px] font-black uppercase text-indigo-700 mb-1">
                        OS — Oculus Sinister (Left Eye)
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div><span className="text-slate-400 block text-[10px]">Sphere:</span> <span className="font-bold">{opt.osSphere}</span></div>
                        <div><span className="text-slate-400 block text-[10px]">Cylinder:</span> <span className="font-bold">{opt.osCylinder}</span></div>
                        <div><span className="text-slate-400 block text-[10px]">Axis:</span> <span className="font-bold">{opt.osAxis}°</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div>
                      <span className="text-slate-500">Pupillary Distance:</span>{" "}
                      <span className="font-bold text-slate-900">{opt.pupillaryDistanceMm} mm</span>
                    </div>
                    <div className="text-slate-700 italic max-w-md truncate">
                      Rx: {opt.recommendations}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CLINICAL REFERRALS & MOH FORM */}
      {/* ========================================================================= */}
      {activeTab === "referrals" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Send className="w-4 h-4 text-indigo-600" />
                  Clinical Referral Management & Official MOH Referral Letters
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kenyan Ministry of Health Inter-Facility & Specialist Referral Protocol
                </p>
              </div>

              <button
                onClick={() => setShowReferralModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Draft MOH Referral Letter
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">MOH Form No</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Patient</th>
                    <th className="py-2.5 px-3">From / To Facility</th>
                    <th className="py-2.5 px-3">Specialty</th>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {referrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {ref.mohFormNumber}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            ref.referralType === "Outgoing"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {ref.referralType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-900 block">{ref.patientName}</span>
                        <span className="text-[10px] text-slate-500">{ref.patientUpn} • {ref.patientAge}y</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 max-w-xs truncate">
                        {ref.receivingFacilityOrSpecialist}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {ref.specialty}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            ref.priority.includes("Emergency")
                              ? "bg-rose-100 text-rose-800"
                              : ref.priority === "Urgent"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {ref.priority}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                          {ref.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            setActivePrintReferral(ref);
                            setShowPrintReferralModal(true);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-300 text-slate-700 text-[10px] font-bold hover:bg-slate-100 flex items-center gap-1 cursor-pointer ml-auto"
                        >
                          <Printer className="w-3 h-3 text-slate-500" />
                          View Letter
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DOCTOR COMMISSIONS & 5% KRA WHT */}
      {/* ========================================================================= */}
      {activeTab === "commissions" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-indigo-600" />
                  Doctor Commissions, Locum Shifts & Statutory 5% KRA WHT
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated calculation of consultation splits, procedure fees, 5% Kenyan Withholding Tax, and net disbursements
                </p>
              </div>

              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                Statutory KRA 5% WHT Compliant
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Doctor & KRA PIN</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Period</th>
                    <th className="py-2.5 px-3 text-center">Consults / Procedures</th>
                    <th className="py-2.5 px-3 text-right">Gross (KES)</th>
                    <th className="py-2.5 px-3 text-right">5% KRA WHT (KES)</th>
                    <th className="py-2.5 px-3 text-right">Net Payable (KES)</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Disbursement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {commissions.map((comm) => (
                    <tr key={comm.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-900 block">{comm.doctorName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">PIN: {comm.kraPin}</span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">
                        {comm.doctorRole}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {comm.periodMonth}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                        {comm.consultationsCount} / {comm.proceduresCount}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        KSh {comm.grossEarningsKes.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-rose-600">
                        -KSh {comm.kraWithholdingTaxKes.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-emerald-600 text-sm">
                        KSh {comm.netPayableKes.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            comm.paymentStatus.includes("Paid")
                              ? "bg-emerald-100 text-emerald-800"
                              : comm.paymentStatus === "Approved"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {comm.paymentStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-1">
                        {comm.paymentStatus === "Pending Approval" && (
                          <button
                            onClick={() => handleApproveCommission(comm.id)}
                            className="px-2 py-1 rounded bg-indigo-600 text-white text-[10px] font-bold hover:bg-indigo-700 cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {comm.paymentStatus === "Approved" && (
                          <button
                            onClick={() => handleMarkCommissionPaid(comm.id)}
                            className="px-2 py-1 rounded bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 cursor-pointer"
                          >
                            Disburse
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: CHRONIC CARE DAY-27 REFILL CRM */}
      {/* ========================================================================= */}
      {activeTab === "chronic-crm" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-indigo-600" />
                  Day-27 Chronic Disease Medication Refill Engine & CRM
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Proactive WhatsApp & SMS reminders before 30-day chronic supply expires (Hypertension, Diabetes, Asthma)
                </p>
              </div>

              <span className="text-xs font-bold text-slate-600">
                Retention Target: &gt;92% Adherence
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {chronicLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-black text-slate-900 block">
                        {lead.patientName}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {lead.patientUpn} • {lead.patientPhone}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        lead.condition === "Hypertension"
                          ? "bg-rose-100 text-rose-800"
                          : lead.condition === "Type 2 Diabetes"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-teal-100 text-teal-800"
                      }`}
                    >
                      {lead.condition}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
                    <div className="text-slate-500 text-[10px]">Current Medication:</div>
                    <div className="font-bold text-slate-900 truncate">
                      {lead.primaryMedication}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                      <span>Days Left: <b className="text-slate-900">{lead.daysRemaining} days</b></span>
                      <span>Refill Due: <b className="text-rose-600">{lead.refillDueDate}</b></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        lead.reminderStatus === "Refill Collected"
                          ? "bg-emerald-100 text-emerald-800"
                          : lead.reminderStatus.includes("Sent")
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {lead.reminderStatus}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {lead.reminderStatus !== "Refill Collected" && (
                        <>
                          <button
                            onClick={() => handleTriggerRefillAlert(lead.id, "WhatsApp")}
                            className="px-2 py-1 rounded bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 cursor-pointer shadow-xs"
                          >
                            WhatsApp
                          </button>
                          <button
                            onClick={() => handleTriggerRefillAlert(lead.id, "SMS")}
                            className="px-2 py-1 rounded bg-slate-900 text-white font-bold text-[10px] hover:bg-slate-800 cursor-pointer shadow-xs"
                          >
                            SMS
                          </button>
                          <button
                            onClick={() => handleMarkRefillCollected(lead.id)}
                            className="px-2 py-1 rounded border border-slate-300 text-slate-700 font-bold text-[10px] hover:bg-slate-100 cursor-pointer"
                          >
                            Dispensed
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: SCHEDULE KEPI VACCINE MODAL */}
      {/* ========================================================================= */}
      {showAddVaccineModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Baby className="w-5 h-5 text-indigo-600" />
              Schedule KEPI Vaccine Dose
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Child Name</label>
                <input
                  type="text"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Child UPN</label>
                <input
                  type="text"
                  value={newChildUpn}
                  onChange={(e) => setNewChildUpn(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Vaccine Dose</label>
                <input
                  type="text"
                  value={newVaccineName}
                  onChange={(e) => setNewVaccineName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Due Date</label>
                <input
                  type="date"
                  value={newVaccineDueDate}
                  onChange={(e) => setNewVaccineDueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddVaccineModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateKepiRecord}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer shadow-xs"
              >
                Schedule Vaccine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: RECORD OPTICAL REFRACTION */}
      {/* ========================================================================= */}
      {showNewRefractionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-600" />
              Record Optical Refraction Exam
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Patient</label>
                <select
                  value={optPatientUpn}
                  onChange={(e) => setOptPatientUpn(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                >
                  {visits.map((v) => (
                    <option key={v.id} value={v.patientUpn}>
                      {v.patientName} ({v.patientUpn})
                    </option>
                  ))}
                </select>
              </div>

              {/* OD and OS Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-bold text-indigo-800 text-xs">Right Eye (OD)</div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Sphere</label>
                    <input
                      type="number"
                      step="0.25"
                      value={odSphere}
                      onChange={(e) => setOdSphere(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Cylinder</label>
                    <input
                      type="number"
                      step="0.25"
                      value={odCyl}
                      onChange={(e) => setOdCyl(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Axis (°)</label>
                    <input
                      type="number"
                      value={odAxis}
                      onChange={(e) => setOdAxis(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-bold text-indigo-800 text-xs">Left Eye (OS)</div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Sphere</label>
                    <input
                      type="number"
                      step="0.25"
                      value={osSphere}
                      onChange={(e) => setOsSphere(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Cylinder</label>
                    <input
                      type="number"
                      step="0.25"
                      value={osCyl}
                      onChange={(e) => setOsCyl(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Axis (°)</label>
                    <input
                      type="number"
                      value={osAxis}
                      onChange={(e) => setOsAxis(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Pupillary Distance (PD in mm)</label>
                <input
                  type="number"
                  value={pdMm}
                  onChange={(e) => setPdMm(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Prescription Recommendations</label>
                <input
                  type="text"
                  value={optNotes}
                  onChange={(e) => setOptNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNewRefractionModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRefraction}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer shadow-xs"
              >
                Save Optical Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DRAFT MOH REFERRAL LETTER */}
      {/* ========================================================================= */}
      {showReferralModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-600" />
              Draft MOH Clinical Referral Letter
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Patient</label>
                  <input
                    type="text"
                    value={refPatientName}
                    onChange={(e) => setRefPatientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">UPN</label>
                  <input
                    type="text"
                    value={refPatientUpn}
                    onChange={(e) => setRefPatientUpn(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Referral Type</label>
                  <select
                    value={refType}
                    onChange={(e) => setRefType(e.target.value as "Outgoing" | "Incoming")}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-semibold"
                  >
                    <option value="Outgoing">Outgoing Referral</option>
                    <option value="Incoming">Incoming Referral</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={refPriority}
                    onChange={(e) => setRefPriority(e.target.value as ClinicalReferralRecord["priority"])}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-semibold"
                  >
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Emergency / Red Flag">Emergency / Red Flag</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Receiving Facility / Specialist</label>
                <input
                  type="text"
                  value={refFacility}
                  onChange={(e) => setRefFacility(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Provisional Diagnosis</label>
                <input
                  type="text"
                  value={refDiagnosis}
                  onChange={(e) => setRefDiagnosis(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Clinical Summary & Reason for Referral</label>
                <textarea
                  rows={3}
                  value={refSummary}
                  onChange={(e) => setRefSummary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowReferralModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReferral}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer shadow-xs"
              >
                Generate Referral Letter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: OFFICIAL MOH REFERRAL LETTER PDF PREVIEW */}
      {/* ========================================================================= */}
      {showPrintReferralModal && activePrintReferral && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl space-y-5">
            {/* MOH Official Header */}
            <div className="text-center border-b-2 border-slate-800 pb-4">
              <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                REPUBLIC OF KENYA • MINISTRY OF HEALTH
              </div>
              <h2 className="text-base font-black text-slate-900 uppercase tracking-tight mt-1">
                OFFICIAL PATIENT CLINICAL REFERRAL LETTER
              </h2>
              <div className="text-xs font-mono font-bold text-indigo-700 mt-0.5">
                Form No: {activePrintReferral.mohFormNumber}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div><span className="text-slate-400">Date:</span> <b className="text-slate-900">{activePrintReferral.date}</b></div>
                <div><span className="text-slate-400">Patient:</span> <b className="text-slate-900">{activePrintReferral.patientName}</b></div>
                <div><span className="text-slate-400">UPN:</span> <span className="font-mono">{activePrintReferral.patientUpn}</span></div>
                <div><span className="text-slate-400">Age / Gender:</span> <b>{activePrintReferral.patientAge} Years • {activePrintReferral.patientGender}</b></div>
              </div>

              <div className="space-y-1">
                <div><span className="text-slate-400">Referring Facility:</span> <b className="text-slate-900">{activePrintReferral.referringFacilityOrDoctor}</b></div>
                <div><span className="text-slate-400">Receiving Specialist:</span> <b className="text-indigo-800">{activePrintReferral.receivingFacilityOrSpecialist}</b></div>
                <div><span className="text-slate-400">Specialty Target:</span> <b>{activePrintReferral.specialty}</b></div>
                <div><span className="text-slate-400">Referral Priority:</span> <span className="px-1.5 py-0.2 rounded font-bold bg-amber-100 text-amber-800">{activePrintReferral.priority}</span></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-700 block text-[11px] uppercase">Provisional Diagnosis:</span>
                <span className="font-bold text-slate-900">{activePrintReferral.provisionalDiagnosis}</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-700 block text-[11px] uppercase">Clinical History & Reason for Referral:</span>
                <p className="text-slate-800 mt-1 leading-relaxed">{activePrintReferral.clinicalSummary}</p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-xs text-slate-500">
              <div>
                <div>Official Stamp: <b className="text-slate-800">{activeBranch.name}</b></div>
                <div className="text-[10px]">Licensed by KMPDC</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Official Letter
                </button>
                <button
                  onClick={() => setShowPrintReferralModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
