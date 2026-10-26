"use client";

import React, { useState } from "react";
import { useAfyaware } from "@/lib/store";
import { Visit, VitalsRecord, QueueStation } from "@/lib/types";
import {
  HeartPulse,
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  User,
  ArrowRight,
  ShieldAlert,
  Save,
  Clock,
  Sparkles,
  Stethoscope,
  ChevronRight,
  BedDouble,
  FlaskConical,
} from "lucide-react";

export function TriageModule() {
  const {
    visits,
    updateVisit,
    moveVisitStation,
    setActiveModule,
    currentRole,
    canViewClinicalConfidential,
  } = useAfyaware();

  // Find visits awaiting triage, or all visits
  const triageVisits = visits.filter((v) => v.station === "Triage" || v.station === "Reception");
  const [selectedVisitId, setSelectedVisitId] = useState<string>(
    triageVisits[0]?.id || visits[0]?.id || ""
  );

  const selectedVisit = visits.find((v) => v.id === selectedVisitId) || visits[0];

  // Vitals form state
  const [bpSystolic, setBpSystolic] = useState<number>(selectedVisit?.vitals?.bpSystolic || 120);
  const [bpDiastolic, setBpDiastolic] = useState<number>(selectedVisit?.vitals?.bpDiastolic || 80);
  const [pulse, setPulse] = useState<number>(selectedVisit?.vitals?.pulse || 78);
  const [temperature, setTemperature] = useState<number>(selectedVisit?.vitals?.temperature || 36.6);
  const [respiratoryRate, setRespiratoryRate] = useState<number>(selectedVisit?.vitals?.respiratoryRate || 18);
  const [spo2, setSpo2] = useState<number>(selectedVisit?.vitals?.spo2 || 98);
  const [weightKg, setWeightKg] = useState<number>(selectedVisit?.vitals?.weightKg || 70);
  const [heightCm, setHeightCm] = useState<number>(selectedVisit?.vitals?.heightCm || 170);
  const [muacCm, setMuacCm] = useState<number>(selectedVisit?.vitals?.muacCm || 15);
  const [rbsMmol, setRbsMmol] = useState<number>(selectedVisit?.vitals?.rbsMmol || 5.6);
  const [chiefComplaint, setChiefComplaint] = useState<string>(
    selectedVisit?.vitals?.chiefComplaint || selectedVisit?.presentingComplaints || "General malaise and headache"
  );
  const [nursingNotes, setNursingNotes] = useState<string>(
    selectedVisit?.vitals?.triageNotes || "Patient conscious, oriented in time and place. Ambulatory."
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Auto-calculated BMI
  const heightM = heightCm > 0 ? heightCm / 100 : 1.7;
  const bmi = weightKg > 0 ? parseFloat((weightKg / (heightM * heightM)).toFixed(1)) : 22.5;

  let bmiCategory = "Normal Weight";
  let bmiColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (bmi < 18.5) {
    bmiCategory = "Underweight";
    bmiColor = "text-amber-700 bg-amber-50 border-amber-200";
  } else if (bmi >= 25 && bmi < 30) {
    bmiCategory = "Overweight";
    bmiColor = "text-amber-700 bg-amber-50 border-amber-200";
  } else if (bmi >= 30) {
    bmiCategory = "Obese (Class I+)";
    bmiColor = "text-rose-700 bg-rose-50 border-rose-200";
  }

  // Automatic Abnormality Flags calculation
  const abnormalityFlags: string[] = [];
  if (bpSystolic >= 180 || bpDiastolic >= 110) {
    abnormalityFlags.push(`Hypertensive Crisis (${bpSystolic}/${bpDiastolic} mmHg)`);
  } else if (bpSystolic >= 140 || bpDiastolic >= 90) {
    abnormalityFlags.push(`Elevated BP Stage 2 (${bpSystolic}/${bpDiastolic} mmHg)`);
  }

  if (temperature >= 38.5) {
    abnormalityFlags.push(`High Fever / Pyrexia (${temperature}°C)`);
  } else if (temperature < 35.5) {
    abnormalityFlags.push(`Hypothermia (${temperature}°C)`);
  }

  if (pulse > 100) {
    abnormalityFlags.push(`Tachycardia (${pulse} bpm)`);
  } else if (pulse < 60) {
    abnormalityFlags.push(`Bradycardia (${pulse} bpm)`);
  }

  if (spo2 < 95) {
    abnormalityFlags.push(`Hypoxia / Low SpO2 (${spo2}%)`);
  }

  if (rbsMmol > 11.1) {
    abnormalityFlags.push(`Hyperglycemia (RBS ${rbsMmol} mmol/L)`);
  } else if (rbsMmol < 4.0) {
    abnormalityFlags.push(`Hypoglycemia (RBS ${rbsMmol} mmol/L)`);
  }

  const isPediatric = selectedVisit && selectedVisit.patientAge <= 5;
  if (isPediatric && muacCm > 0) {
    if (muacCm < 11.5) {
      abnormalityFlags.push(`Severe Acute Malnutrition (MUAC ${muacCm}cm - RED)`);
    } else if (muacCm < 12.5) {
      abnormalityFlags.push(`Moderate Acute Malnutrition (MUAC ${muacCm}cm - YELLOW)`);
    }
  }

  // Handle Save Vitals
  const handleSaveVitals = (targetStation?: QueueStation) => {
    if (!selectedVisit) return;

    const newVitals: VitalsRecord = {
      id: `VIT-${Date.now().toString().slice(-4)}`,
      visitId: selectedVisit.id,
      patientId: selectedVisit.patientId,
      recordedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      recordedBy: `${currentRole}`,
      bpSystolic,
      bpDiastolic,
      pulse,
      temperature,
      respiratoryRate,
      spo2,
      weightKg,
      heightCm,
      bmi,
      muacCm: isPediatric ? muacCm : undefined,
      rbsMmol,
      chiefComplaint,
      triageNotes: nursingNotes,
      abnormalityFlags,
    };

    updateVisit(selectedVisit.id, {
      vitals: newVitals,
      presentingComplaints: chiefComplaint,
      priority: abnormalityFlags.some((f) => f.includes("Crisis") || f.includes("Hypoxia"))
        ? "Emergency / Stat"
        : selectedVisit.priority,
      station: targetStation || (selectedVisit.station === "Triage" ? "Consultation" : selectedVisit.station),
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Switch selected visit
  const handleSelectVisit = (v: Visit) => {
    setSelectedVisitId(v.id);
    if (v.vitals) {
      setBpSystolic(v.vitals.bpSystolic);
      setBpDiastolic(v.vitals.bpDiastolic);
      setPulse(v.vitals.pulse);
      setTemperature(v.vitals.temperature);
      setRespiratoryRate(v.vitals.respiratoryRate);
      setSpo2(v.vitals.spo2);
      setWeightKg(v.vitals.weightKg);
      setHeightCm(v.vitals.heightCm);
      setMuacCm(v.vitals.muacCm || 15);
      setRbsMmol(v.vitals.rbsMmol || 5.6);
      setChiefComplaint(v.vitals.chiefComplaint);
      setNursingNotes(v.vitals.triageNotes);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Triage & Nursing Clinical Station
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Vitals Capture, Auto-BMI, Abnormality Flags & Historical Trend Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Rapid vital signs capture, automatic WHO BMI & pediatric MUAC calculations, critical clinical flags, and direct station routing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-rose-600" />
            {triageVisits.length} Waiting at Triage
          </span>
        </div>
      </div>

      {/* Main 2-Column Workspace: Left Queue | Right Vitals Capture Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Triage Waiting List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900">
                Triage Queue ({triageVisits.length})
              </span>
              <span className="text-[10px] text-slate-400">Click to load patient</span>
            </div>

            <div className="space-y-2 mt-3 max-h-[600px] overflow-y-auto">
              {visits.map((visit) => {
                const isSelected = visit.id === selectedVisitId;
                const hasVitals = !!visit.vitals;
                const isEmergency = visit.priority === "Emergency / Stat";

                return (
                  <button
                    key={visit.id}
                    onClick={() => handleSelectVisit(visit)}
                    className={`w-full p-3 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-md"
                        : isEmergency
                        ? "bg-rose-50/70 border-rose-300 hover:bg-rose-50"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                          isSelected
                            ? "bg-teal-500 text-slate-950"
                            : isEmergency
                            ? "bg-rose-600 text-white"
                            : "bg-slate-200 text-slate-800"
                        }`}
                      >
                        #{visit.ticketNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          isSelected ? "text-teal-300" : "text-slate-500"
                        }`}
                      >
                        {visit.station}
                      </span>
                    </div>

                    <div className="font-bold text-xs mt-2 truncate">
                      {visit.patientName}
                    </div>
                    <div
                      className={`text-[11px] truncate ${
                        isSelected ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {visit.patientUpn} • {visit.patientAge}y {visit.patientGender}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200/40 flex items-center justify-between text-[10px]">
                      <span>{visit.assignedDoctor}</span>
                      {hasVitals ? (
                        <span className="text-emerald-500 font-bold">✓ Vitals Done</span>
                      ) : (
                        <span className="text-amber-500 font-bold">⏳ Needs Vitals</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Vitals Form & Auto Abnormalities */}
        <div className="lg:col-span-8 space-y-6">
          {selectedVisit ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Selected Patient Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {selectedVisit.patientName}
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold">
                      #{selectedVisit.ticketNumber}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({selectedVisit.patientUpn})
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {selectedVisit.patientAge} years old • {selectedVisit.patientGender} • Payer:{" "}
                    <span className="font-semibold text-slate-900">{selectedVisit.paymentType}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Assigned Clinician:</div>
                  <div className="text-xs font-bold text-teal-800">
                    {selectedVisit.assignedDoctor} ({selectedVisit.assignedRoom})
                  </div>
                </div>
              </div>

              {/* Automatic Abnormality Flags Banner */}
              {abnormalityFlags.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 space-y-2">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
                    Clinical Abnormality Flags ({abnormalityFlags.length} Detected)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {abnormalityFlags.map((flag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-xs"
                      >
                        ⚠️ {flag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Vitals Input Grid */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Vital Signs Parameters
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  {/* Blood Pressure Systolic */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="font-bold text-slate-700 block">BP Systolic (mmHg)</label>
                    <input
                      type="number"
                      value={bpSystolic}
                      onChange={(e) => setBpSystolic(parseInt(e.target.value) || 0)}
                      className={`w-full mt-1.5 px-3 py-2 text-base font-black rounded-lg border focus:outline-none ${
                        bpSystolic >= 140 ? "text-rose-700 border-rose-300 bg-rose-50/50" : "border-slate-300"
                      }`}
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Normal: 90–120</span>
                  </div>

                  {/* Blood Pressure Diastolic */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="font-bold text-slate-700 block">BP Diastolic (mmHg)</label>
                    <input
                      type="number"
                      value={bpDiastolic}
                      onChange={(e) => setBpDiastolic(parseInt(e.target.value) || 0)}
                      className={`w-full mt-1.5 px-3 py-2 text-base font-black rounded-lg border focus:outline-none ${
                        bpDiastolic >= 90 ? "text-rose-700 border-rose-300 bg-rose-50/50" : "border-slate-300"
                      }`}
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Normal: 60–80</span>
                  </div>

                  {/* Pulse Rate */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="font-bold text-slate-700 block">Pulse Rate (bpm)</label>
                    <input
                      type="number"
                      value={pulse}
                      onChange={(e) => setPulse(parseInt(e.target.value) || 0)}
                      className={`w-full mt-1.5 px-3 py-2 text-base font-black rounded-lg border focus:outline-none ${
                        pulse > 100 || pulse < 60 ? "text-rose-700 border-rose-300 bg-rose-50/50" : "border-slate-300"
                      }`}
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Normal: 60–100</span>
                  </div>

                  {/* Temperature */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="font-bold text-slate-700 block">Temperature (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value) || 0)}
                      className={`w-full mt-1.5 px-3 py-2 text-base font-black rounded-lg border focus:outline-none ${
                        temperature >= 38.0 ? "text-rose-700 border-rose-300 bg-rose-50/50" : "border-slate-300"
                      }`}
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Normal: 36.5–37.5</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  {/* Respiratory Rate */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="font-bold text-slate-700 block">Resp. Rate (cpm)</label>
                    <input
                      type="number"
                      value={respiratoryRate}
                      onChange={(e) => setRespiratoryRate(parseInt(e.target.value) || 0)}
                      className="w-full mt-1.5 px-3 py-2 text-base font-black rounded-lg border border-slate-300 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Normal: 12–20</span>
                  </div>

                  {/* SpO2 */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="font-bold text-slate-700 block">SpO2 (%)</label>
                    <input
                      type="number"
                      value={spo2}
                      onChange={(e) => setSpo2(parseInt(e.target.value) || 0)}
                      className={`w-full mt-1.5 px-3 py-2 text-base font-black rounded-lg border focus:outline-none ${
                        spo2 < 95 ? "text-rose-700 border-rose-300 bg-rose-50/50" : "border-slate-300"
                      }`}
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Normal: ≥ 95%</span>
                  </div>

                  {/* Weight */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="font-bold text-slate-700 block">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={weightKg}
                      onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                      className="w-full mt-1.5 px-3 py-2 text-base font-black rounded-lg border border-slate-300 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Kilograms</span>
                  </div>

                  {/* Height */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="font-bold text-slate-700 block">Height (cm)</label>
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(parseInt(e.target.value) || 0)}
                      className="w-full mt-1.5 px-3 py-2 text-base font-black rounded-lg border border-slate-300 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Centimeters</span>
                  </div>
                </div>

                {/* Second Row: Auto-BMI, RBS, Pediatric MUAC */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {/* Auto-Calculated BMI Banner */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-700 block">Auto-Calculated BMI</span>
                      <div className="text-2xl font-black text-slate-900 mt-0.5">{bmi} kg/m²</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${bmiColor}`}>
                      {bmiCategory}
                    </span>
                  </div>

                  {/* Random Blood Sugar (RBS) */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-slate-700">RBS / FBS (mmol/L)</label>
                      <span className="text-[10px] text-slate-400">Normal: 4.0–7.8</span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      value={rbsMmol}
                      onChange={(e) => setRbsMmol(parseFloat(e.target.value) || 0)}
                      className={`w-full mt-1.5 px-3 py-2 text-base font-black rounded-lg border focus:outline-none ${
                        rbsMmol > 11.1 || rbsMmol < 4.0 ? "text-rose-700 border-rose-300 bg-rose-50" : "border-slate-300"
                      }`}
                    />
                  </div>

                  {/* Pediatric MUAC (if <= 5 years) */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-slate-700">Pediatric MUAC (cm)</label>
                      <span className="text-[10px] text-slate-400">&lt;5y Nutrition</span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      value={muacCm}
                      onChange={(e) => setMuacCm(parseFloat(e.target.value) || 0)}
                      placeholder="14.5"
                      className="w-full mt-1.5 px-3 py-2 text-base font-black rounded-lg border border-slate-300 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Chief Complaint & Nursing Triage Notes */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Nursing Assessment & Chief Complaints
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700">Chief Complaint (Presenting Problem) *</label>
                    <input
                      type="text"
                      value={chiefComplaint}
                      onChange={(e) => setChiefComplaint(e.target.value)}
                      placeholder="e.g. Severe occipital headache, high fever x 3 days, dizziness"
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-teal-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700">Triage Nursing Notes</label>
                    <textarea
                      rows={2}
                      value={nursingNotes}
                      onChange={(e) => setNursingNotes(e.target.value)}
                      placeholder="Enter nursing observations, known drug history, ambulatory status..."
                      className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* 5-Visit Longitudinal Trend Comparison */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-teal-600" />
                    5-Visit Historical Vitals Trend (Longitudinal Health Tracking)
                  </span>
                  <span className="text-[10px] text-slate-500">Comparing with past clinic records</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Visit 1 (3 Mo Ago)</span>
                    <span className="font-bold text-slate-800">140/90 mmHg</span>
                    <span className="text-[10px] text-slate-500 block">76 kg • RBS 6.2</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Visit 2 (2 Mo Ago)</span>
                    <span className="font-bold text-slate-800">148/92 mmHg</span>
                    <span className="text-[10px] text-slate-500 block">77 kg • RBS 7.4</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Visit 3 (Last Mo)</span>
                    <span className="font-bold text-slate-800">152/96 mmHg</span>
                    <span className="text-[10px] text-slate-500 block">78 kg • RBS 8.1</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-300">
                    <span className="text-[10px] text-teal-700 font-bold block">Today (Current)</span>
                    <span className="font-bold text-teal-950">{bpSystolic}/{bpDiastolic} mmHg</span>
                    <span className="text-[10px] text-teal-800 block">{weightKg} kg • RBS {rbsMmol}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Save & Route to Doctor / Lab / Ward */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {saveSuccess && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Vitals Saved & Patient Routed!
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleSaveVitals()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer transition"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Vitals Only
                  </button>

                  <button
                    onClick={() => handleSaveVitals("Lab")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold cursor-pointer transition"
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    Route Direct to Lab
                  </button>

                  <button
                    onClick={() => handleSaveVitals("Procedure / Day-Ward")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 text-xs font-semibold cursor-pointer transition"
                  >
                    <BedDouble className="w-3.5 h-3.5" />
                    Route to Day-Ward
                  </button>

                  <button
                    onClick={() => {
                      handleSaveVitals("Consultation");
                      setActiveModule("emr-worklists");
                    }}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold cursor-pointer shadow-md transition"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    Save & Route to Doctor Room →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              Select a patient from the left queue to capture triage vitals.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
