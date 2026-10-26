"use client";

import React, { useState } from "react";
import { useAfyaware } from "@/lib/store";
import {
  LabOrder,
  ImagingOrder,
  ProcedureOrder,
  ObservationBedRecord,
} from "@/lib/types";
import {
  FlaskConical,
  Radio,
  BedDouble,
  Scissors,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Printer,
  Sparkles,
  Search,
  Plus,
  ShieldAlert,
  Clock,
  Droplets,
  Building,
  UserCheck,
  X,
  FileText,
  Activity,
  ArrowRight,
} from "lucide-react";

export function LisImagingWardModule() {
  const {
    labOrders,
    updateLabOrder,
    imagingOrders,
    updateImagingOrder,
    procedures,
    updateProcedure,
    addProcedure,
    beds,
    updateBed,
    visits,
    currentRole,
    addAuditLog,
  } = useAfyaware();

  const [activeTab, setActiveTab] = useState<"lab" | "imaging" | "theatre-ward">("lab");

  // Selected Lab Order for Result Entry / View
  const [selectedLabId, setSelectedLabId] = useState<string>(labOrders[0]?.id || "");
  const selectedLab = labOrders.find((o) => o.id === selectedLabId) || labOrders[0];

  // Lab Result Entry state
  const [resultInput, setResultInput] = useState(selectedLab?.resultValue || "");
  const [flagSelection, setFlagSelection] = useState<LabOrder["flag"]>(selectedLab?.flag || "Normal");
  const [showLabPdf, setShowLabPdf] = useState(false);
  const [labSearch, setLabSearch] = useState("");

  // Selected Imaging Order
  const [selectedImgId, setSelectedImgId] = useState<string>(imagingOrders[0]?.id || "");
  const selectedImg = imagingOrders.find((i) => i.id === selectedImgId) || imagingOrders[0];
  const [imgFindings, setImgFindings] = useState(selectedImg?.findingsSummary || "Normal organ morphology, no focal lesions identified.");
  const [imgImpression, setImgImpression] = useState(selectedImg?.impression || "Study within normal radiological limits.");
  const [showImgPdf, setShowImgPdf] = useState(false);

  // New Procedure Form state
  const [showProcModal, setShowProcModal] = useState(false);
  const [procPatientId, setProcPatientId] = useState(visits[0]?.id || "");
  const [procName, setProcName] = useState("Wound Debridement & Suturing (5-0 Vicryl)");
  const [procCategory, setProcCategory] = useState<ProcedureOrder["category"]>("Minor Surgery");
  const [procFee, setProcFee] = useState(1500);
  const [procConsumablesFee, setProcConsumablesFee] = useState(650);

  // Filtered Lab Orders
  const filteredLabOrders = labOrders.filter(
    (o) =>
      o.patientName.toLowerCase().includes(labSearch.toLowerCase()) ||
      o.testName.toLowerCase().includes(labSearch.toLowerCase()) ||
      o.patientUpn.toLowerCase().includes(labSearch.toLowerCase())
  );

  // Handle Lab Verification
  const handleVerifyLab = (orderId: string) => {
    updateLabOrder(orderId, {
      resultValue: resultInput,
      flag: flagSelection,
      status: "Verified",
      verifiedBy: `${currentRole}`,
      verifiedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
    addAuditLog(
      `Verified lab test ${orderId} (${flagSelection}) with auto-reagent deduction`,
      "Laboratory LIS",
      orderId,
      flagSelection === "CRITICAL PANIC" ? "Sensitive Clinical Access" : "Standard"
    );
  };

  // Handle Sample Collection
  const handleCollectSample = (orderId: string) => {
    const barcode = `SMP-${Date.now().toString().slice(-6)}`;
    updateLabOrder(orderId, {
      status: "In Analysis",
      sampleBarcode: barcode,
    });
    addAuditLog(`Collected sample and generated barcode ${barcode}`, "Laboratory LIS", orderId);
  };

  // Handle Imaging Sign-Off
  const handleSignImaging = (orderId: string) => {
    updateImagingOrder(orderId, {
      findingsSummary: imgFindings,
      impression: imgImpression,
      status: "Report Verified",
      radiologistName: `${currentRole}`,
    });
    addAuditLog(`Signed diagnostic imaging study ${orderId}`, "Radiology & Imaging", orderId);
  };

  // Handle Create Procedure
  const handleCreateProcedure = (e: React.FormEvent) => {
    e.preventDefault();
    const visit = visits.find((v) => v.id === procPatientId) || visits[0];
    const newProc: ProcedureOrder = {
      id: `PRC-${Date.now().toString().slice(-4)}`,
      visitId: visit.id,
      patientId: visit.patientId,
      patientName: visit.patientName,
      patientUpn: visit.patientUpn,
      procedureName: procName,
      category: procCategory,
      performedBy: `${currentRole}`,
      orderedBy: visit.assignedDoctor,
      orderedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      feeKes: procFee,
      consumablesCostKes: procConsumablesFee,
      consumablesList: ["1x Sterile Surgical Gloves 7.5", "1x Suture Pack 5-0 Vicryl", "2x Sterile Gauze Swabs", "Lignocaine 2% 10mL"],
      consentSigned: true,
      status: "In Theatre / Bay",
      notes: "Local anaesthesia administered, procedure commenced under aseptic technique.",
    };
    addProcedure(newProc);
    setShowProcModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-teal-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Diagnostic Services & Day-Ward
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Laboratory (LIS), Radiology/Imaging & Minor Theatre Day-Ward
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automatic reagent deduction (stops off-book cash tests), panic value alerts, QR lab PDF reports, and 10-bed day ward management.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab("lab")}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "lab" ? "bg-white text-teal-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            Laboratory LIS
          </button>
          <button
            onClick={() => setActiveTab("imaging")}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "imaging" ? "bg-white text-teal-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Radiology & Imaging
          </button>
          <button
            onClick={() => setActiveTab("theatre-ward")}
            className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "theatre-ward" ? "bg-white text-teal-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BedDouble className="w-3.5 h-3.5" />
            Minor Theatre & Day-Ward
          </button>
        </div>
      </div>

      {/* TAB 1: LABORATORY INFORMATION SYSTEM (LIS) */}
      {activeTab === "lab" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Lab Orders List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">
                  Lab Test Orders ({labOrders.length})
                </span>
                <span className="text-[10px] text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded">
                  Reagent Auto-Deduction On
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative my-3">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={labSearch}
                  onChange={(e) => setLabSearch(e.target.value)}
                  placeholder="Filter by test name or patient..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-2.5 max-h-[600px] overflow-y-auto">
                {filteredLabOrders.map((order) => {
                  const isSelected = order.id === selectedLabId;
                  const isPanic = order.flag === "CRITICAL PANIC";
                  const isVerified = order.status === "Verified";

                  return (
                    <button
                      key={order.id}
                      onClick={() => {
                        setSelectedLabId(order.id);
                        setResultInput(order.resultValue || "");
                        setFlagSelection(order.flag || "Normal");
                      }}
                      className={`w-full p-3 rounded-xl border text-left transition cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-md"
                          : isPanic
                          ? "bg-rose-50/80 border-rose-300"
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            isSelected ? "bg-teal-400 text-slate-950" : "bg-slate-200 text-slate-800"
                          }`}
                        >
                          {order.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            isPanic
                              ? "text-rose-400 animate-pulse"
                              : isVerified
                              ? "text-emerald-400"
                              : isSelected
                              ? "text-teal-300"
                              : "text-slate-500"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="text-xs font-bold mt-2 truncate">{order.testName}</div>
                      <div className={`text-[11px] truncate ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                        Patient: <strong>{order.patientName}</strong> ({order.patientUpn})
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-200/40 flex items-center justify-between text-[10px]">
                        <span>Sample: {order.sampleType}</span>
                        <span>KSh {order.priceKes.toLocaleString()}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Lab Processing & Result Verification */}
          <div className="lg:col-span-7 space-y-6">
            {selectedLab ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                {/* Test Header Ribbon */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-300">
                      {selectedLab.id} • {selectedLab.category}
                    </span>
                    <h2 className="text-base font-bold text-white mt-0.5">{selectedLab.testName}</h2>
                    <div className="text-xs text-slate-300 mt-1">
                      Patient: <strong>{selectedLab.patientName}</strong> ({selectedLab.patientAge}y {selectedLab.patientGender}) • Ordered by: {selectedLab.orderedBy}
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        selectedLab.status === "Verified"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {selectedLab.status}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-1 font-mono">
                      Barcode: {selectedLab.sampleBarcode || "Unlabeled"}
                    </div>
                  </div>
                </div>

                {/* Sample Collection Barcode & Billing Gate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block">Sample Tube & Container</span>
                      <strong className="text-slate-900 text-sm">{selectedLab.sampleType}</strong>
                    </div>
                    {selectedLab.status === "Ordered (Awaiting Billing)" || !selectedLab.sampleBarcode ? (
                      <button
                        onClick={() => handleCollectSample(selectedLab.id)}
                        className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold cursor-pointer shadow-xs"
                      >
                        Collect & Barcode
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Barcode Active
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block">Billing Gate Clearance</span>
                      <strong className="text-slate-900 text-sm">KSh {selectedLab.priceKes.toLocaleString()}</strong>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        selectedLab.billingCleared
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {selectedLab.billingCleared ? "Pre-Paid / Cleared" : "Payment Required"}
                    </span>
                  </div>
                </div>

                {/* Automated Reagent & Consumables Deduction (Theft Prevention) */}
                <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-1.5 text-xs">
                  <span className="font-bold text-teal-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                    Automated Reagent & Consumables Deduction (Security Gate):
                  </span>
                  <p className="text-slate-600 leading-snug">
                    To prevent staff from running "off-book" cash lab tests, the system automatically deducts consumables upon result entry:
                  </p>
                  <div className="p-2.5 rounded-xl bg-white border border-teal-300 font-mono text-[11px] text-teal-900 font-semibold">
                    Deducted: {selectedLab.reagentDeducted}
                  </div>
                </div>

                {/* Result Entry & Reference Ranges */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800">
                      Result Finding & Quantitative Value *
                    </label>
                    <span className="text-slate-500 text-[11px]">
                      Stratified Reference: <strong>{selectedLab.referenceRange}</strong>
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    value={resultInput}
                    onChange={(e) => setResultInput(e.target.value)}
                    placeholder="Enter numerical values, differential counts, or microbiological findings..."
                    className="w-full p-3 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none font-medium"
                  />

                  {/* Abnormality / Critical Panic Flags */}
                  <div>
                    <label className="font-bold text-slate-800 block mb-1.5">
                      Diagnostic Interpretation Flag:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(["Normal", "Abnormal Low", "Abnormal High", "CRITICAL PANIC"] as const).map(
                        (flag) => (
                          <button
                            type="button"
                            key={flag}
                            onClick={() => setFlagSelection(flag)}
                            className={`px-3 py-1.5 rounded-xl font-bold border cursor-pointer transition ${
                              flagSelection === flag
                                ? flag === "CRITICAL PANIC"
                                  ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                                  : flag.includes("Abnormal")
                                  ? "bg-amber-500 text-white border-amber-500"
                                  : "bg-teal-600 text-white border-teal-600"
                                : "bg-slate-50 border-slate-200 text-slate-700"
                            }`}
                          >
                            {flag === "CRITICAL PANIC" ? "🚨 CRITICAL PANIC" : flag}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Footer: PDF Report, Verify */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => setShowLabPdf(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    Preview Branded QR Lab Report
                  </button>

                  <button
                    onClick={() => handleVerifyLab(selectedLab.id)}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold cursor-pointer shadow-md"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verify & Deduct Reagents
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                Select a laboratory order to enter results.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: RADIOLOGY & IMAGING MODULE */}
      {activeTab === "imaging" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Imaging Queue */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <span className="text-xs font-bold text-slate-900 block pb-2 border-b border-slate-100">
                Diagnostic Imaging Orders ({imagingOrders.length})
              </span>

              <div className="space-y-2 mt-3 max-h-[600px] overflow-y-auto">
                {imagingOrders.map((img) => {
                  const isSelected = img.id === selectedImgId;
                  return (
                    <button
                      key={img.id}
                      onClick={() => {
                        setSelectedImgId(img.id);
                        setImgFindings(img.findingsSummary || "");
                        setImgImpression(img.impression || "");
                      }}
                      className={`w-full p-3 rounded-xl border text-left transition cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-md"
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          isSelected ? "bg-sky-400 text-slate-950" : "bg-slate-200 text-slate-800"
                        }`}>
                          {img.modality}
                        </span>
                        <span className={`text-[10px] font-bold ${isSelected ? "text-sky-300" : "text-slate-500"}`}>
                          {img.status}
                        </span>
                      </div>
                      <div className="text-xs font-bold mt-2 truncate">{img.studyName}</div>
                      <div className={`text-[11px] truncate ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                        Patient: <strong>{img.patientName}</strong> ({img.patientUpn})
                      </div>
                      <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>{img.equipmentName}</span>
                        <span>KSh {img.priceKes.toLocaleString()}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Reporting & Sign-Off */}
          <div className="lg:col-span-7 space-y-6">
            {selectedImg ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-md">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-sky-300">
                      {selectedImg.modality} REPORTING
                    </span>
                    <h2 className="text-base font-bold text-white mt-0.5">{selectedImg.studyName}</h2>
                    <div className="text-xs text-slate-300 mt-1">
                      Patient: <strong>{selectedImg.patientName}</strong> • {selectedImg.equipmentName}
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                    {selectedImg.status}
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Structured Radiological Findings
                    </label>
                    <textarea
                      rows={4}
                      value={imgFindings}
                      onChange={(e) => setImgFindings(e.target.value)}
                      placeholder="Describe anatomical structures, acoustic reflections, densities, lesions..."
                      className="w-full p-3 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Radiological Impression & Conclusion
                    </label>
                    <textarea
                      rows={2}
                      value={imgImpression}
                      onChange={(e) => setImgImpression(e.target.value)}
                      placeholder="e.g. Single live intrauterine pregnancy at 28w 3d with normal amniotic fluid index..."
                      className="w-full p-3 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none font-medium"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block">Consumables Deduction</span>
                      <strong className="text-slate-800">{selectedImg.consumablesUsed}</strong>
                    </div>
                    <span className="text-emerald-700 font-bold text-[11px]">✓ Auto-Deducted</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    onClick={() => handleSignImaging(selectedImg.id)}
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold cursor-pointer shadow-md"
                  >
                    Sign & Verify Imaging Report
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                Select an imaging study to report findings.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MINOR THEATRE & 10-BED OBSERVATION DAY-WARD */}
      {activeTab === "theatre-ward" && (
        <div className="space-y-6">
          {/* Top Actions: Add Procedure */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Scissors className="w-5 h-5 text-teal-600" />
                Minor Theatre & Nursing Procedures
              </h2>
              <p className="text-xs text-slate-500">
                Auto-bills both the Procedure Fee + Consumables Used (sutures, cannulas, sterile packs)
              </p>
            </div>
            <button
              onClick={() => setShowProcModal(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold cursor-pointer shadow-sm"
            >
              + Log New Procedure
            </button>
          </div>

          {/* Procedures List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {procedures.map((proc) => (
              <div key={proc.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                    {proc.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">{proc.status}</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{proc.procedureName}</h3>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Patient: <strong>{proc.patientName}</strong> ({proc.patientUpn}) • Performed by: {proc.performedBy}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span>Procedure Fee:</span>
                    <span className="font-bold">KSh {proc.feeKes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Consumables Used:</span>
                    <span className="font-bold">KSh {proc.consumablesCostKes.toLocaleString()}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    Items: {proc.consumablesList.join(", ")}
                  </div>
                </div>

                {proc.status !== "Completed" && (
                  <button
                    onClick={() => updateProcedure(proc.id, { status: "Completed", completedAt: new Date().toLocaleTimeString() })}
                    className="w-full py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
                  >
                    Mark Procedure Completed ✓
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Visual 10-Bed Observation Day-Ward Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BedDouble className="w-5 h-5 text-teal-600" />
                  Observation Short-Stay Day Ward (10 Beds)
                </h2>
                <p className="text-xs text-slate-500">
                  Track patients on IV fluids, rehydration, nebulization, or post-procedure monitoring
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                {beds.filter((b) => b.status === "Occupied").length} / 10 Beds Occupied
              </span>
            </div>

            {/* 10-Bed Interactive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {beds.map((bed) => {
                const isOccupied = bed.status === "Occupied";
                return (
                  <div
                    key={bed.id}
                    className={`p-3.5 rounded-2xl border transition flex flex-col justify-between ${
                      isOccupied
                        ? "bg-amber-50/70 border-amber-300 ring-1 ring-amber-300 shadow-xs"
                        : bed.status === "Cleaning"
                        ? "bg-slate-100 border-slate-300"
                        : "bg-slate-50/80 border-slate-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-slate-900">
                          BED #{bed.bedNumber}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            isOccupied
                              ? "bg-amber-600 text-white"
                              : bed.status === "Cleaning"
                              ? "bg-slate-500 text-white"
                              : "bg-emerald-600 text-white"
                          }`}
                        >
                          {bed.status}
                        </span>
                      </div>

                      {isOccupied ? (
                        <div className="mt-2.5 space-y-1 text-xs">
                          <div className="font-bold text-slate-900 truncate">{bed.patientName}</div>
                          <div className="text-[10px] text-slate-500">{bed.patientUpn}</div>
                          <div className="text-[10px] text-teal-800 font-semibold pt-1">
                            IV: {bed.ivFluidType || "Monitoring"}
                          </div>
                          <div className="text-[10px] text-slate-600">
                            In: {bed.fluidIntakeMl}mL • Out: {bed.fluidOutputMl}mL
                          </div>
                        </div>
                      ) : (
                        <div className="my-4 text-center text-xs text-slate-400 font-medium">
                          Bed Ready for Admission
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">Rate: KSh {bed.hourlyRateKes}/hr</span>
                      <button
                        onClick={() =>
                          updateBed(bed.id, {
                            status: isOccupied ? "Available" : "Occupied",
                            patientName: isOccupied ? undefined : visits[0]?.patientName,
                            patientUpn: isOccupied ? undefined : visits[0]?.patientUpn,
                          })
                        }
                        className="text-teal-700 font-bold hover:underline cursor-pointer"
                      >
                        {isOccupied ? "Discharge Bed" : "Assign Bed"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BRANDED QR LAB REPORT PDF */}
      {showLabPdf && selectedLab && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900">
                Official Branded Laboratory Diagnostic Report
              </span>
              <button onClick={() => setShowLabPdf(false)} className="text-slate-400 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Official Report */}
            <div className="p-6 rounded-2xl border-2 border-slate-300 bg-white text-slate-900 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                <div>
                  <div className="font-black text-lg tracking-tight text-teal-950">AFYAWARE DIAGNOSTIC LABORATORIES</div>
                  <div className="text-xs text-slate-500">ISO 15189 Compliant • KMLTTB Licensed</div>
                </div>
                <div className="w-14 h-14 bg-slate-100 p-1 rounded-lg border border-slate-300 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-950" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs border-b border-slate-200 pb-3">
                <div>Patient: <strong>{selectedLab.patientName}</strong></div>
                <div>UPN: <strong>{selectedLab.patientUpn}</strong></div>
                <div>Sample: <strong>{selectedLab.sampleType}</strong></div>
                <div>Barcode: <strong>{selectedLab.sampleBarcode || "SMP-001"}</strong></div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-bold text-teal-900 uppercase">{selectedLab.testName}</div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-sm font-bold">
                  {selectedLab.resultValue || "Result in analysis"}
                </div>
                <div className="text-slate-500 text-[11px]">
                  Biological Reference Limits: <strong>{selectedLab.referenceRange}</strong>
                </div>
                {selectedLab.flag && (
                  <div className="font-bold text-rose-700">Flag: {selectedLab.flag}</div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-xs text-slate-500">
                <div>Verified by: <strong>{selectedLab.verifiedBy || "Chief Lab Technologist"}</strong></div>
                <div className="text-right">QR Verification Validated</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowLabPdf(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold cursor-pointer shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LOG NEW MINOR PROCEDURE */}
      {showProcModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900">Log Nursing / Minor Theatre Procedure</span>
              <button onClick={() => setShowProcModal(false)} className="text-slate-400 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProcedure} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Select Patient</label>
                <select
                  value={procPatientId}
                  onChange={(e) => setProcPatientId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                >
                  {visits.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.patientName} ({v.patientUpn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Procedure Name</label>
                <input
                  type="text"
                  required
                  value={procName}
                  onChange={(e) => setProcName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Procedure Fee (KSh)</label>
                  <input
                    type="number"
                    value={procFee}
                    onChange={(e) => setProcFee(parseInt(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Consumables (KSh)</label>
                  <input
                    type="number"
                    value={procConsumablesFee}
                    onChange={(e) => setProcConsumablesFee(parseInt(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowProcModal(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-teal-600 text-white font-bold rounded-xl shadow-md">Record & Bill Procedure</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
