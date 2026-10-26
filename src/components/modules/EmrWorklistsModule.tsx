"use client";

import React, { useState } from "react";
import { useAfyaware } from "@/lib/store";
import {
  Visit,
  LabOrder,
  ImagingOrder,
  PrescriptionOrder,
  ClinicalTask,
  ClinicalDocument,
  ConsentRecord,
  PriorityLevel,
} from "@/lib/types";
import {
  Stethoscope,
  ClipboardList,
  FolderOpen,
  FileCheck2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Plus,
  Send,
  Printer,
  Sparkles,
  Search,
  FlaskConical,
  Pill,
  Radio,
  FileSignature,
  ArrowRight,
  ShieldAlert,
  Clock,
  Eye,
  Calendar,
  X,
  Upload,
} from "lucide-react";

// Standardized Kenyan ICD-10 / ICD-11 Catalog
const ICD10_CATALOG = [
  { code: "B50.9", title: "Plasmodium falciparum malaria, unspecified", category: "Infectious" },
  { code: "J06.9", title: "Acute upper respiratory infection, unspecified", category: "Respiratory" },
  { code: "J45.901", title: "Unspecified asthma with (acute) exacerbation", category: "Respiratory" },
  { code: "I10", title: "Essential (primary) hypertension", category: "Cardiovascular" },
  { code: "E11.9", title: "Type 2 diabetes mellitus without complications", category: "Endocrine" },
  { code: "K29.7", title: "Gastritis, unspecified", category: "Gastrointestinal" },
  { code: "N39.0", title: "Urinary tract infection, site not specified", category: "Genitourinary" },
  { code: "A09", title: "Infectious gastroenteritis and colitis, unspecified", category: "Gastrointestinal" },
  { code: "Z34.8", title: "Supervision of other normal pregnancy (ANC)", category: "Obstetric" },
  { code: "K02.9", title: "Dental caries, unspecified", category: "Dental" },
  { code: "H52.1", title: "Myopia (Refractive Error)", category: "Ophthalmology" },
  { code: "L03.90", title: "Cellulitis, unspecified", category: "Dermatology" },
];

// Clinical Macros for 1-Click Documentation
const CLINICAL_MACROS = [
  {
    name: "Malaria (Uncomplicated)",
    icd10Code: "B50.9",
    icd10Title: "Plasmodium falciparum malaria, unspecified",
    complaints: "High-grade fever with chills and rigor x 3 days, headache, nausea, joint aches.",
    history: "Patient travelled to Kisumu / western lake region 1 week ago. No prior anti-malarial taken.",
    exam: "Febrile to touch (38.8°C), alert, mild dehydration, no neck stiffness, spleen not palpable.",
    treatmentPlan: "Coartem (Artemether/Lumefantrine 20/120mg) 4 tabs stat then per weight; Paracetamol 1g PO TDS x 3d; ORS hydration.",
    suggestedLab: "Blood Slide for Malaria Parasites (BS for MP) + MRDT",
  },
  {
    name: "Acute URTI / Flu",
    icd10Code: "J06.9",
    icd10Title: "Acute upper respiratory infection, unspecified",
    complaints: "Sore throat, nasal congestion, dry cough, low-grade fever for 2 days.",
    history: "Onset after exposure to cold weather. No shortness of breath, no chest pain.",
    exam: "Pharyngeal erythema without exudate, tonsils not enlarged, chest clear bilaterally.",
    treatmentPlan: "Cetirizine 10mg nocte x 5d; Paracetamol 1g TDS x 3d; Steam inhalation; warm saline gargles.",
  },
  {
    name: "Acute Gastritis / Dyspepsia",
    icd10Code: "K29.7",
    icd10Title: "Gastritis, unspecified",
    complaints: "Burning epigastric pain worsened by fasting and spicy foods, bloating, heartburn x 4 days.",
    history: "Frequent NSAID use for joint pains. No hematemesis or melena stools.",
    exam: "Moderate tenderness over epigastrium, soft abdomen, normal bowel sounds, no guarding.",
    treatmentPlan: "Omeprazole 20mg PO BD x 14d; Magnesium/Aluminum hydroxide antacid suspension 15mL TDS; avoid NSAIDs & trigger foods.",
  },
  {
    name: "Urinary Tract Infection (UTI)",
    icd10Code: "N39.0",
    icd10Title: "Urinary tract infection, site not specified",
    complaints: "Dysuria, urinary frequency and urgency, lower abdominal discomfort x 3 days.",
    history: "Sexually active female, no fever, no loin pain or vaginal discharge.",
    exam: "Suprapubic tenderness on palpation, no renal angle tenderness.",
    treatmentPlan: "Nitrofurantoin 100mg PO BD x 5d; increased oral fluid intake (>2.5L/day); Paracetamol 1g PRN.",
    suggestedLab: "Urinalysis Dipstick + Microscopy",
  },
  {
    name: "Hypertension Review (Stage 2)",
    icd10Code: "I10",
    icd10Title: "Essential (primary) hypertension",
    complaints: "Mild occipital headache, fatigue. Routine monthly hypertensive follow-up.",
    history: "Known hypertensive for 4 years on monotherapy. Poor compliance over the last week.",
    exam: "BP elevated (158/96 mmHg), pulse regular (78 bpm), heart sounds I + II with no murmurs, no pedal edema.",
    treatmentPlan: "U&E / Creatinine check; Telmisartan 80mg + Amlodipine 5mg PO OD; dietary salt restriction and aerobic exercise counseling.",
    suggestedLab: "Renal Function Profile (U&E / Creatinine)",
  },
];

export function EmrWorklistsModule() {
  const {
    visits,
    updateVisit,
    moveVisitStation,
    tasks,
    updateTaskStatus,
    documents,
    addDocument,
    consents,
    addConsent,
    addLabOrder,
    addImagingOrder,
    addPrescription,
    drugBatches,
    currentRole,
    canViewClinicalConfidential,
  } = useAfyaware();

  const [activeTab, setActiveTab] = useState<"consultation" | "worklists" | "vault" | "consents">("consultation");

  // Selected visit for doctor consultation
  const [selectedVisitId, setSelectedVisitId] = useState<string>(visits[0]?.id || "");
  const selectedVisit = visits.find((v) => v.id === selectedVisitId) || visits[0];

  // Consultation SOAP state
  const [presentingComplaints, setPresentingComplaints] = useState(selectedVisit?.presentingComplaints || "");
  const [hpi, setHpi] = useState(selectedVisit?.historyOfPresentingIllness || "");
  const [physicalExam, setPhysicalExam] = useState(selectedVisit?.physicalExam || "");
  const [icd10Code, setIcd10Code] = useState(selectedVisit?.icd10Code || "B50.9");
  const [icd10Description, setIcd10Description] = useState(selectedVisit?.icd10Description || "Plasmodium falciparum malaria, unspecified");
  const [diagnosisStatus, setDiagnosisStatus] = useState<"Provisional" | "Confirmed">(selectedVisit?.diagnosisStatus || "Provisional");
  const [treatmentPlan, setTreatmentPlan] = useState(selectedVisit?.treatmentPlan || "");
  const [icdSearchQuery, setIcdSearchQuery] = useState("");
  const [showSickOffModal, setShowSickOffModal] = useState(false);
  const [sickOffDays, setSickOffDays] = useState(3);
  const [sickOffReason, setSickOffReason] = useState("Acute illness requiring medical bed rest");
  const [showOrderModal, setShowOrderModal] = useState<"lab" | "imaging" | "prescription" | null>(null);

  // New Lab Order Form
  const [newLabTest, setNewLabTest] = useState("Full Haemogram (CBC / 5-Part)");
  const [newLabCategory, setNewLabCategory] = useState<"Haematology" | "Biochemistry" | "Parasitology">("Haematology");
  const [newLabPrice, setNewLabPrice] = useState(1200);

  // New Imaging Form
  const [newImagingModality, setNewImagingModality] = useState<"Ultrasound" | "Digital X-Ray" | "12-Lead ECG">("Ultrasound");
  const [newImagingStudy, setNewImagingStudy] = useState("Obstetric Ultrasound Scan");
  const [newImagingPrice, setNewImagingPrice] = useState(2500);

  // New Prescription Form
  const [newRxDrug, setNewRxDrug] = useState(drugBatches[0]?.brandName || "Augmentin 625mg");
  const [newRxDosage, setNewRxDosage] = useState("1 tablet twice daily for 5 days");
  const [newRxSwahili, setNewRxSwahili] = useState("Meza tembe 1 mara 2 kwa siku kwa siku 5");
  const [newRxQty, setNewRxQty] = useState(10);
  const [newRxPrice, setNewRxPrice] = useState(850);

  // New Document Upload State
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocCategory, setNewDocCategory] = useState<ClinicalDocument["category"]>("Discharge Summary");
  const [newDocSummary, setNewDocSummary] = useState("");

  // New Consent Form State
  const [newConsentTemplate, setNewConsentTemplate] = useState<ConsentRecord["templateType"]>("Minor Surgery & Procedure Consent");
  const [newConsentProcedure, setNewConsentProcedure] = useState("Incision & Drainage / Suturing");
  const [newConsentSigner, setNewConsentSigner] = useState(selectedVisit?.patientName || "Patient");

  // Filter ICD-10 catalog
  const filteredIcdList = ICD10_CATALOG.filter(
    (item) =>
      item.code.toLowerCase().includes(icdSearchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(icdSearchQuery.toLowerCase())
  );

  // Apply a 1-click clinical macro
  const applyMacro = (macro: (typeof CLINICAL_MACROS)[0]) => {
    setPresentingComplaints(macro.complaints);
    setHpi(macro.history);
    setPhysicalExam(macro.exam);
    setIcd10Code(macro.icd10Code);
    setIcd10Description(macro.icd10Title);
    setTreatmentPlan(macro.treatmentPlan);
  };

  // Save clinical consultation note
  const handleSaveConsultation = (andSign = false) => {
    if (!selectedVisit) return;
    updateVisit(selectedVisit.id, {
      presentingComplaints,
      historyOfPresentingIllness: hpi,
      physicalExam,
      icd10Code,
      icd10Description,
      diagnosisStatus,
      treatmentPlan,
      clinicalNotesSigned: andSign,
    });
  };

  // Submit Order Handlers
  const handleCreateLabOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisit) return;
    const newOrder: LabOrder = {
      id: `LAB-2026-${Date.now().toString().slice(-4)}`,
      visitId: selectedVisit.id,
      patientId: selectedVisit.patientId,
      patientName: selectedVisit.patientName,
      patientUpn: selectedVisit.patientUpn,
      patientAge: selectedVisit.patientAge,
      patientGender: selectedVisit.patientGender,
      orderedBy: `${currentRole}`,
      orderedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      testCode: `TST-${Math.floor(100 + Math.random() * 900)}`,
      testName: newLabTest,
      category: newLabCategory,
      sampleType: newLabCategory === "Haematology" ? "Blood (EDTA)" : "Serum",
      priceKes: newLabPrice,
      billingCleared: selectedVisit.paymentType !== "Cash / M-Pesa",
      status: "Ordered (Awaiting Billing)",
      referenceRange: "Standard reference limits",
      reagentDeducted: "Pending Billing Clearance",
    };
    addLabOrder(newOrder);
    setShowOrderModal(null);
  };

  const handleCreateImagingOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisit) return;
    const newImg: ImagingOrder = {
      id: `IMG-2026-${Date.now().toString().slice(-4)}`,
      visitId: selectedVisit.id,
      patientId: selectedVisit.patientId,
      patientName: selectedVisit.patientName,
      patientUpn: selectedVisit.patientUpn,
      modality: newImagingModality,
      studyName: newImagingStudy,
      equipmentName: newImagingModality === "Ultrasound" ? "GE Voluson 4D Ultrasound Machine #1" : "Digital X-Ray DR Unit #1",
      orderedBy: `${currentRole}`,
      orderedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      priceKes: newImagingPrice,
      billingCleared: selectedVisit.paymentType !== "Cash / M-Pesa",
      consentSigned: true,
      status: "Scheduled",
      consumablesUsed: "Standard capture consumables",
    };
    addImagingOrder(newImg);
    setShowOrderModal(null);
  };

  const handleCreatePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisit) return;
    const drug = drugBatches.find((d) => d.brandName === newRxDrug) || drugBatches[0];
    const newRx: PrescriptionOrder = {
      id: `RX-2026-${Date.now().toString().slice(-4)}`,
      visitId: selectedVisit.id,
      patientId: selectedVisit.patientId,
      patientName: selectedVisit.patientName,
      patientUpn: selectedVisit.patientUpn,
      patientAllergies: [],
      prescribedBy: `${currentRole}`,
      prescribedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      drugGenericName: drug.genericName,
      drugBrandName: drug.brandName,
      dosageInstruction: newRxDosage,
      swahiliInstruction: newRxSwahili,
      route: "Oral",
      totalQty: newRxQty,
      dispensedQty: 0,
      selectedBatchNumber: drug.batchNumber,
      selectedBatchExpiry: drug.expiryDate,
      unitPriceKes: drug.cashPriceKes,
      totalPriceKes: drug.cashPriceKes * newRxQty,
      billingCleared: selectedVisit.paymentType !== "Cash / M-Pesa",
      status: "Pending Pharmacy",
    };
    addPrescription(newRx);
    setShowOrderModal(null);
  };

  // Upload Document Handler
  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisit || !newDocTitle) return;
    const newDoc: ClinicalDocument = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      patientId: selectedVisit.patientId,
      visitId: selectedVisit.id,
      title: newDocTitle,
      category: newDocCategory,
      fileName: `${newDocTitle.replace(/\s+/g, "_")}.pdf`,
      fileSize: "2.1 MB",
      uploadedAt: new Date().toLocaleString(),
      uploadedBy: `${currentRole}`,
      summary: newDocSummary || "External scanned medical record.",
    };
    addDocument(newDoc);
    setNewDocTitle("");
    setNewDocSummary("");
  };

  // Sign Digital Consent Handler
  const handleSignConsent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisit) return;
    const newCns: ConsentRecord = {
      id: `CNS-${Date.now().toString().slice(-4)}`,
      patientId: selectedVisit.patientId,
      visitId: selectedVisit.id,
      patientName: selectedVisit.patientName,
      patientUpn: selectedVisit.patientUpn,
      templateType: newConsentTemplate,
      procedureName: newConsentProcedure,
      risksExplained: "Risks, benefits, complications, and alternatives explained in English & Swahili.",
      signedBy: newConsentSigner,
      relationshipToPatient: "Self",
      witnessName: `${currentRole}`,
      signedAt: new Date().toLocaleString(),
      status: "Signed",
      version: "v2.0",
    };
    addConsent(newCns);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Doctor Consultation & Clinical Governance
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Single-Screen Doctor EMR, Worklists, Attachment Vault & Consents
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Designed for sub-2 minute consultations with 1-click clinical macros, ICD-10 diagnosis, unified orders, and digital legal forms.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab("consultation")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "consultation" ? "bg-white text-teal-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Single-Screen EMR
          </button>
          <button
            onClick={() => setActiveTab("worklists")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "worklists" ? "bg-white text-teal-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            Clinical Worklists
          </button>
          <button
            onClick={() => setActiveTab("vault")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "vault" ? "bg-white text-teal-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            Document Vault
          </button>
          <button
            onClick={() => setActiveTab("consents")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "consents" ? "bg-white text-teal-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            Digital Consents
          </button>
        </div>
      </div>

      {/* Clinical Privacy Lock Gate Check */}
      {!canViewClinicalConfidential && (
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-4">
          <Lock className="w-8 h-8 text-amber-600 shrink-0" />
          <div>
            <h3 className="font-bold text-base">Confidential Clinical Consultation Locked</h3>
            <p className="text-xs text-amber-800 mt-1">
              Your active session role is <strong>{currentRole}</strong>. Under the Kenya Data Protection Act and Afyaware Clinical Privacy Lock, doctors' clinical notes, ICD-10 diagnoses, and attachments are confidential. Switch your role to <strong>Medical Officer / Doctor</strong>, <strong>Nurse</strong>, or <strong>Clinic Director</strong> in the top header to access this clinical workspace.
            </p>
          </div>
        </div>
      )}

      {/* TAB 1: SINGLE-SCREEN DOCTOR CONSULTATION */}
      {canViewClinicalConfidential && activeTab === "consultation" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Waiting Patient Queue */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <span className="text-xs font-bold text-slate-900 block pb-2 border-b border-slate-100">
                Active OPD Visits ({visits.length})
              </span>
              <div className="space-y-2 mt-3 max-h-[700px] overflow-y-auto">
                {visits.map((v) => {
                  const isSelected = v.id === selectedVisitId;
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVisitId(v.id);
                        setPresentingComplaints(v.presentingComplaints || "");
                        setHpi(v.historyOfPresentingIllness || "");
                        setPhysicalExam(v.physicalExam || "");
                        setIcd10Code(v.icd10Code || "B50.9");
                        setIcd10Description(v.icd10Description || "Plasmodium falciparum malaria, unspecified");
                        setDiagnosisStatus(v.diagnosisStatus || "Provisional");
                        setTreatmentPlan(v.treatmentPlan || "");
                      }}
                      className={`w-full p-3 rounded-xl border text-left transition cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-md"
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                            isSelected ? "bg-teal-500 text-slate-950" : "bg-slate-200 text-slate-800"
                          }`}
                        >
                          #{v.ticketNumber}
                        </span>
                        <span className={`text-[10px] font-bold ${isSelected ? "text-teal-300" : "text-slate-500"}`}>
                          {v.station}
                        </span>
                      </div>
                      <div className="font-bold text-xs mt-2 truncate">{v.patientName}</div>
                      <div className={`text-[11px] truncate ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                        {v.patientUpn} • {v.patientAge}y {v.patientGender}
                      </div>
                      <div className="mt-2 text-[10px] flex items-center justify-between">
                        <span className="truncate">{v.paymentType}</span>
                        {v.clinicalNotesSigned && <span className="text-emerald-400 font-bold">✓ Signed</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Single-Screen EMR Clinical Workspace */}
          <div className="lg:col-span-9 space-y-6">
            {selectedVisit ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                {/* Top Patient Clinical Ribbon */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold">{selectedVisit.patientName}</span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-teal-400 text-slate-950 font-bold">
                        #{selectedVisit.ticketNumber}
                      </span>
                      <span className="text-xs text-slate-300 font-mono">({selectedVisit.patientUpn})</span>
                    </div>
                    <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-3">
                      <span>Age: {selectedVisit.patientAge}y ({selectedVisit.patientGender})</span>
                      <span>•</span>
                      <span>Scheme: <strong className="text-teal-300">{selectedVisit.paymentType}</strong></span>
                      {selectedVisit.insurerName && <span>({selectedVisit.insurerName})</span>}
                    </div>
                  </div>

                  {/* Vitals Summary Pill */}
                  {selectedVisit.vitals && (
                    <div className="bg-white/10 rounded-xl p-2.5 text-xs border border-white/10 flex items-center gap-3">
                      <div>
                        <div className="text-slate-300 text-[10px]">BP & Pulse</div>
                        <div className="font-bold text-white">
                          {selectedVisit.vitals.bpSystolic}/{selectedVisit.vitals.bpDiastolic} mmHg • {selectedVisit.vitals.pulse} bpm
                        </div>
                      </div>
                      <div className="border-l border-white/10 pl-3">
                        <div className="text-slate-300 text-[10px]">Temp & SpO2</div>
                        <div className="font-bold text-white">
                          {selectedVisit.vitals.temperature}°C • {selectedVisit.vitals.spo2}%
                        </div>
                      </div>
                      <div className="border-l border-white/10 pl-3">
                        <div className="text-slate-300 text-[10px]">BMI</div>
                        <div className="font-bold text-teal-300">{selectedVisit.vitals.bmi} kg/m²</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 1-Click Clinical Macros Bar */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    1-Click Fast Clinical Macros (&lt;2 Min Consult):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {CLINICAL_MACROS.map((macro) => (
                      <button
                        key={macro.name}
                        onClick={() => applyMacro(macro)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-900 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition shadow-2xs"
                      >
                        ⚡ {macro.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Structured Clinical Notes (SOAP) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Presenting Complaints & History of Presenting Illness (HPI)
                    </label>
                    <textarea
                      rows={3}
                      value={presentingComplaints}
                      onChange={(e) => setPresentingComplaints(e.target.value)}
                      placeholder="Symptoms, duration, onset, severity, aggravating/relieving factors..."
                      className="w-full p-3 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Past Medical / Surgical History & Medications
                    </label>
                    <textarea
                      rows={3}
                      value={hpi}
                      onChange={(e) => setHpi(e.target.value)}
                      placeholder="Known chronic conditions, past surgeries, active medications..."
                      className="w-full p-3 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs">
                    Physical Examination Findings
                  </label>
                  <textarea
                    rows={2}
                    value={physicalExam}
                    onChange={(e) => setPhysicalExam(e.target.value)}
                    placeholder="General appearance, vitals verification, systemic examination (CVS, RS, Abdomen, CNS)..."
                    className="w-full p-3 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none text-xs"
                  />
                </div>

                {/* Standardized ICD-10 / ICD-11 Diagnosis Search */}
                <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-950 flex items-center gap-1.5">
                      <Search className="w-4 h-4 text-teal-700" />
                      Standardized ICD-10 / ICD-11 Diagnosis Coding (Mandatory for SHA/Insurance)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDiagnosisStatus("Provisional")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                          diagnosisStatus === "Provisional"
                            ? "bg-amber-500 text-white"
                            : "bg-white border border-slate-200 text-slate-700"
                        }`}
                      >
                        Provisional
                      </button>
                      <button
                        onClick={() => setDiagnosisStatus("Confirmed")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                          diagnosisStatus === "Confirmed"
                            ? "bg-teal-600 text-white"
                            : "bg-white border border-slate-200 text-slate-700"
                        }`}
                      >
                        Confirmed
                      </button>
                    </div>
                  </div>

                  {/* Active Diagnosis Card */}
                  <div className="p-3 bg-white rounded-xl border border-teal-300 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-teal-800 text-sm">[{icd10Code}]</span>
                      <span className="ml-2 font-bold text-slate-900">{icd10Description}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        diagnosisStatus === "Confirmed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {diagnosisStatus}
                    </span>
                  </div>

                  {/* Search input for ICD-10 */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={icdSearchQuery}
                      onChange={(e) => setIcdSearchQuery(e.target.value)}
                      placeholder="Search ICD-10 by name (e.g. Malaria, Asthma, Hypertension) or code..."
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl focus:outline-none"
                    />
                  </div>

                  {/* Quick Select Buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    {filteredIcdList.slice(0, 6).map((item) => (
                      <button
                        key={item.code}
                        onClick={() => {
                          setIcd10Code(item.code);
                          setIcd10Description(item.title);
                        }}
                        className="px-2 py-1 rounded-lg bg-white hover:bg-teal-100 border border-slate-200 text-[11px] font-semibold text-slate-800 cursor-pointer"
                      >
                        [{item.code}] {item.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Treatment Plan & Orders */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 text-xs">
                      Comprehensive Treatment Plan & Instructions
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowOrderModal("lab")}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <FlaskConical className="w-3.5 h-3.5" />
                        + Order Lab
                      </button>
                      <button
                        onClick={() => setShowOrderModal("imaging")}
                        className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-900 text-xs font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <Radio className="w-3.5 h-3.5" />
                        + Order Imaging
                      </button>
                      <button
                        onClick={() => setShowOrderModal("prescription")}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <Pill className="w-3.5 h-3.5" />
                        + E-Prescribe
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    value={treatmentPlan}
                    onChange={(e) => setTreatmentPlan(e.target.value)}
                    placeholder="Document clinical orders, drug regimens, patient advice, warning signs to watch for..."
                    className="w-full p-3 border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-none text-xs"
                  />
                </div>

                {/* Action Footer: Sick-Off Sheet, Save, Sign Notes */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowSickOffModal(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Generate Sick-Off Sheet / Medical Certificate
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSaveConsultation(false)}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-50"
                    >
                      Save Draft
                    </button>
                    <button
                      onClick={() => {
                        handleSaveConsultation(true);
                        moveVisitStation(selectedVisit.id, "Pharmacy");
                      }}
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold cursor-pointer shadow-md"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Sign Note & Send to Pharmacy →
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                Select an outpatient visit from the queue to start consultation.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CLINICAL WORKLISTS & "REQUIRES ACTION" QUEUES */}
      {canViewClinicalConfidential && activeTab === "worklists" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-teal-600" />
                Role-Based "Requires Action" Queues & Shift Handover
              </h2>
              <p className="text-xs text-slate-500">
                Eliminates dropped handoffs between doctors, nurses, lab techs, and follow-up teams
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
              {tasks.filter((t) => t.status !== "Completed").length} Pending Actions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => {
              const isDone = task.status === "Completed";
              const isStat = task.priority === "Emergency / Stat";

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border bg-white shadow-xs flex flex-col justify-between ${
                    isDone ? "opacity-60 bg-slate-50 border-slate-200" : isStat ? "border-rose-400 ring-1 ring-rose-400" : "border-slate-200"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-900 text-white">
                        {task.roleTarget} • {task.category}
                      </span>
                      <span className="text-xs text-slate-500">{task.createdAt}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-2.5 leading-snug">{task.title}</h3>
                    <p className="text-xs text-slate-600 mt-1">{task.description}</p>

                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="font-semibold text-slate-800">Patient: {task.patientName}</div>
                      <div className="text-slate-500 text-[11px]">{task.patientUpn} • Assigned: {task.assignedTo}</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span
                      className={`text-[11px] font-bold ${
                        isDone ? "text-emerald-700" : isStat ? "text-rose-700" : "text-amber-700"
                      }`}
                    >
                      Status: {task.status}
                    </span>

                    {!isDone ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateTaskStatus(task.id, "Escalated (Shift Handover)")}
                          className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-medium cursor-pointer"
                        >
                          Handover
                        </button>
                        <button
                          onClick={() => updateTaskStatus(task.id, "Completed")}
                          className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold cursor-pointer"
                        >
                          Mark Done ✓
                        </button>
                      </div>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CLINICAL DOCUMENT & ATTACHMENT VAULT */}
      {canViewClinicalConfidential && activeTab === "vault" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-teal-600" />
                Clinical Document & Attachment Vault
              </h2>
              <p className="text-xs text-slate-500">
                Centralized permanent digital vault for external discharge summaries, scans, referral letters & photos
              </p>
            </div>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
              {documents.length} Medical Documents Stored
            </span>
          </div>

          {/* Quick Upload Form */}
          <form onSubmit={handleUploadDocument} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-teal-600" />
              Upload New External Clinical Attachment for: <strong>{selectedVisit?.patientName}</strong>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700">Document Title *</label>
                <input
                  type="text"
                  required
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="e.g. External Brain MRI Scan Report"
                  className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Category</label>
                <select
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value as ClinicalDocument["category"])}
                  className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none"
                >
                  <option value="Discharge Summary">Discharge Summary</option>
                  <option value="External Lab / Imaging Report">External Lab / Imaging Report</option>
                  <option value="Specialist Referral Letter">Specialist Referral Letter</option>
                  <option value="Insurance Pre-Auth / Form">Insurance Pre-Auth / Form</option>
                  <option value="Clinical Photo">Clinical Photo</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700">Clinical Summary / Key Findings</label>
                <input
                  type="text"
                  value={newDocSummary}
                  onChange={(e) => setNewDocSummary(e.target.value)}
                  placeholder="e.g. Normal ventricular size, no midline shift."
                  className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold cursor-pointer"
              >
                + Upload to Patient Vault
              </button>
            </div>
          </form>

          {/* Stored Documents List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                    {doc.category}
                  </span>
                  <span className="text-xs text-slate-400">{doc.fileSize}</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{doc.title}</h3>
                  <div className="font-mono text-[11px] text-slate-500 mt-0.5">{doc.fileName}</div>
                  <p className="text-xs text-slate-600 mt-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    {doc.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Uploaded: {doc.uploadedAt}</span>
                  <button
                    onClick={() => alert(`Opening PDF previewer for: ${doc.fileName}`)}
                    className="inline-flex items-center gap-1 font-bold text-teal-700 hover:underline cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PATIENT CONSENT & CLINICAL FORMS */}
      {canViewClinicalConfidential && activeTab === "consents" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-teal-600" />
                Digital Patient Consent & Mandatory Procedure Gate
              </h2>
              <p className="text-xs text-slate-500">
                Standardized legally binding consent templates compliant with Kenya Data Protection Act and MOH standards
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              Mandatory Gate Active
            </span>
          </div>

          {/* Quick Sign New Consent */}
          <form onSubmit={handleSignConsent} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <FileSignature className="w-4 h-4 text-teal-600" />
              Capture Digital Informed Consent for: <strong>{selectedVisit?.patientName}</strong>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700">Consent Template</label>
                <select
                  value={newConsentTemplate}
                  onChange={(e) => setNewConsentTemplate(e.target.value as ConsentRecord["templateType"])}
                  className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none"
                >
                  <option value="Minor Surgery & Procedure Consent">Minor Surgery & Procedure Consent</option>
                  <option value="Dental & Extraction Consent">Dental & Extraction Consent</option>
                  <option value="Maternity / ANC & High-Risk Treatment Consent">Maternity / ANC Consent</option>
                  <option value="Imaging / Contrast / Sedation Consent">Imaging / Contrast / Sedation Consent</option>
                  <option value="HIV Testing / Counseling Consent">HIV Testing / Counseling Consent</option>
                  <option value="Kenya DPA Privacy & Health Sharing Consent">Kenya DPA Data Sharing Consent</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Procedure Name</label>
                <input
                  type="text"
                  value={newConsentProcedure}
                  onChange={(e) => setNewConsentProcedure(e.target.value)}
                  placeholder="e.g. Incision & Drainage under Local Anaesthesia"
                  className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Signer Name (Patient or Next-of-Kin)</label>
                <input
                  type="text"
                  value={newConsentSigner}
                  onChange={(e) => setNewConsentSigner(e.target.value)}
                  placeholder="Full name of signatory"
                  className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="text-[11px] text-slate-600">
                ✍️ <strong>Digital Signature Pad:</strong> Captured via tablet screen or stylus with timestamp & witness verification.
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold cursor-pointer"
              >
                Sign & Save Consent Form
              </button>
            </div>
          </form>

          {/* Stored Consent Forms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consents.map((cns) => (
              <div key={cns.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {cns.templateType}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-400">{cns.version}</span>
                </div>

                <div className="text-sm font-bold text-slate-900">{cns.procedureName}</div>
                <div className="text-xs text-slate-600">
                  Patient: <strong className="text-slate-900">{cns.patientName}</strong> ({cns.patientUpn})
                </div>

                <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {cns.risksExplained}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Signed by: <strong>{cns.signedBy}</strong> ({cns.relationshipToPatient})</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {cns.signedAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: SICK-OFF SHEET & MEDICAL CERTIFICATE */}
      {showSickOffModal && selectedVisit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                Medical Certificate / Sick-Off Sheet Generator
              </span>
              <button onClick={() => setShowSickOffModal(false)} className="text-slate-400 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Certificate Template */}
            <div className="p-6 rounded-2xl border-2 border-teal-800/30 bg-slate-50 text-slate-900 space-y-4">
              <div className="text-center border-b border-slate-300 pb-3">
                <div className="font-black text-lg tracking-tight text-teal-950">AFYAWARE MEDICAL CENTER</div>
                <div className="text-xs text-slate-500">Parklands Road, Westlands, Nairobi • Phone: +254 709 340 100</div>
                <div className="text-xs font-bold uppercase tracking-wider text-teal-800 mt-2">
                  OFFICIAL MEDICAL SICK-OFF CERTIFICATE
                </div>
              </div>

              <div className="text-xs space-y-2 leading-relaxed">
                <p>
                  This is to certify that <strong>{selectedVisit.patientName}</strong>, Patient Number{" "}
                  <strong>{selectedVisit.patientUpn}</strong>, was examined on <strong>{new Date().toLocaleDateString()}</strong>{" "}
                  and diagnosed with <strong>[{icd10Code}] {icd10Description}</strong>.
                </p>

                <div className="p-3 bg-white rounded-xl border border-slate-200 my-2">
                  <label className="font-bold text-slate-800 block text-xs">Recommended Days of Medical Leave:</label>
                  <div className="flex items-center gap-3 mt-1">
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={sickOffDays}
                      onChange={(e) => setSickOffDays(parseInt(e.target.value) || 1)}
                      className="w-20 px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-bold"
                    />
                    <span className="text-xs text-slate-600 font-semibold">days of mandatory bed rest</span>
                  </div>
                </div>

                <p>
                  The patient is advised to refrain from work / physical duties from today{" "}
                  <strong>{new Date().toLocaleDateString()}</strong> until further review.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold">{selectedVisit.assignedDoctor}</div>
                  <div className="text-slate-500">Attending Clinician</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-teal-800 font-bold">[OFFICIAL CLINICAL STAMP]</div>
                  <div className="text-slate-400 text-[10px]">Verifiable via Afyaware EMPI</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSickOffModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold cursor-pointer shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Certificate (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ORDER COMPOSER (LAB / IMAGING / PRESCRIPTION) */}
      {showOrderModal && selectedVisit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900">
                {showOrderModal === "lab" && "🧪 Order Laboratory Diagnostic Test"}
                {showOrderModal === "imaging" && "🩻 Order Diagnostic Imaging / Scan"}
                {showOrderModal === "prescription" && "💊 Dispatch Electronic Prescription"}
              </span>
              <button onClick={() => setShowOrderModal(null)} className="text-slate-400 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* LAB ORDER FORM */}
            {showOrderModal === "lab" && (
              <form onSubmit={handleCreateLabOrder} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700">Select Test from Catalog</label>
                  <select
                    value={newLabTest}
                    onChange={(e) => {
                      setNewLabTest(e.target.value);
                      if (e.target.value.includes("Malaria")) {
                        setNewLabCategory("Parasitology");
                        setNewLabPrice(850);
                      } else if (e.target.value.includes("Renal")) {
                        setNewLabCategory("Biochemistry");
                        setNewLabPrice(2200);
                      } else {
                        setNewLabCategory("Haematology");
                        setNewLabPrice(1200);
                      }
                    }}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  >
                    <option value="Full Haemogram (CBC / 5-Part)">Full Haemogram (CBC / 5-Part) - KSh 1,200</option>
                    <option value="Blood Slide for Malaria Parasites (BS for MP) + MRDT">Malaria Slide + MRDT - KSh 850</option>
                    <option value="Renal Function Profile (U&E / Creatinine)">Renal Function (U&E / Creatinine) - KSh 2,200</option>
                    <option value="Fasting Lipid Profile (Total Chol, HDL, LDL, Trig)">Fasting Lipid Profile - KSh 1,800</option>
                    <option value="Urinalysis Dipstick + Microscopy">Urinalysis Dipstick + Microscopy - KSh 600</option>
                  </select>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <span>Test Price: <strong>KSh {newLabPrice.toLocaleString()}</strong></span>
                  <span className="text-teal-700 font-bold">Category: {newLabCategory}</span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowOrderModal(null)} className="px-4 py-2 border rounded-xl">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-amber-600 text-white font-bold rounded-xl shadow-md">Dispatch to Lab Worklist</button>
                </div>
              </form>
            )}

            {/* IMAGING ORDER FORM */}
            {showOrderModal === "imaging" && (
              <form onSubmit={handleCreateImagingOrder} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700">Modality</label>
                  <select
                    value={newImagingModality}
                    onChange={(e) => setNewImagingModality(e.target.value as "Ultrasound" | "Digital X-Ray" | "12-Lead ECG")}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  >
                    <option value="Ultrasound">4D Ultrasound</option>
                    <option value="Digital X-Ray">Digital X-Ray (DR)</option>
                    <option value="12-Lead ECG">12-Lead Resting ECG</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700">Study / Examination Name</label>
                  <input
                    type="text"
                    value={newImagingStudy}
                    onChange={(e) => setNewImagingStudy(e.target.value)}
                    placeholder="e.g. Chest X-Ray PA View"
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowOrderModal(null)} className="px-4 py-2 border rounded-xl">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-sky-600 text-white font-bold rounded-xl shadow-md">Schedule Imaging Scan</button>
                </div>
              </form>
            )}

            {/* PRESCRIPTION FORM */}
            {showOrderModal === "prescription" && (
              <form onSubmit={handleCreatePrescription} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700">Select Drug from FEFO Pharmacy Store</label>
                  <select
                    value={newRxDrug}
                    onChange={(e) => setNewRxDrug(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  >
                    {drugBatches.map((d) => (
                      <option key={d.id} value={d.brandName}>
                        {d.brandName} ({d.genericName}) - Batch: {d.batchNumber} (Exp: {d.expiryDate})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700">Dosage Instructions (English)</label>
                  <input
                    type="text"
                    value={newRxDosage}
                    onChange={(e) => setNewRxDosage(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700">Swahili Label Instruction (for Thermal Dosage Sticker)</label>
                  <input
                    type="text"
                    value={newRxSwahili}
                    onChange={(e) => setNewRxSwahili(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowOrderModal(null)} className="px-4 py-2 border rounded-xl">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-md">Send E-Prescription to Pharmacy</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
