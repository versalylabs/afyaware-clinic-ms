"use client";

import React, { useState } from "react";
import { useAfyaware } from "@/lib/store";
import { UserRole } from "@/lib/types";
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  Activity,
  Server,
  RotateCcw,
  CheckCircle2,
  BellRing,
  FileSearch,
} from "lucide-react";

const ALL_ROLES: {
  role: UserRole;
  clinicalAccess: boolean;
  billingAccess: boolean;
  inventoryAccess: boolean;
  summary: string;
}[] = [
  {
    role: "Clinic Director",
    clinicalAccess: true,
    billingAccess: true,
    inventoryAccess: true,
    summary: "Full clinical, financial, multi-branch, MOH statutory & audit access",
  },
  {
    role: "Medical Officer / Doctor",
    clinicalAccess: true,
    billingAccess: false,
    inventoryAccess: false,
    summary: "EMR consultation, ICD-10 coding, lab/imaging orders, e-prescriptions, referrals",
  },
  {
    role: "Nurse / Triage",
    clinicalAccess: true,
    billingAccess: false,
    inventoryAccess: true,
    summary: "Triage vitals, nursing procedures, observation ward beds, consent capture",
  },
  {
    role: "Lab Technologist",
    clinicalAccess: true,
    billingAccess: false,
    inventoryAccess: true,
    summary: "Sample collection, LIS result entry, panic value verification, reagent deduction",
  },
  {
    role: "Radiographer",
    clinicalAccess: true,
    billingAccess: false,
    inventoryAccess: false,
    summary: "Ultrasound, X-Ray, ECG scheduling, modality reporting & DICOM links",
  },
  {
    role: "Pharmacist",
    clinicalAccess: true,
    billingAccess: true,
    inventoryAccess: true,
    summary: "E-prescription dispensing, OTC POS, FEFO batch control, narcotics register",
  },
  {
    role: "Cashier",
    clinicalAccess: false,
    billingAccess: true,
    inventoryAccess: false,
    summary: "PRIVACY LOCKED: Split billing, M-Pesa Daraja, KRA eTIMS, shift cash-up only",
  },
  {
    role: "Receptionist",
    clinicalAccess: false,
    billingAccess: true,
    inventoryAccess: false,
    summary: "PRIVACY LOCKED: EMPI check-in, 4D appointments, queue routing, SHA eligibility",
  },
  {
    role: "Claims Officer",
    clinicalAccess: true,
    billingAccess: true,
    inventoryAccess: false,
    summary: "SHA/SHIF & private insurance claim scrubbing, ICD-10 vetting, aging reconciliation",
  },
  {
    role: "Storekeeper",
    clinicalAccess: false,
    billingAccess: false,
    inventoryAccess: true,
    summary: "PRIVACY LOCKED: Bulk drug store, GRN batch logging, inter-branch transfers, POs",
  },
];

const INTEGRATIONS = [
  {
    name: "M-Pesa Daraja 2.0 (Safaricom)",
    category: "Payments",
    endpoint: "STK Push (Lipa Na M-Pesa) + C2B Till/Paybill Auto-Matcher",
    status: "Connected • Live",
    badgeColor: "bg-emerald-100 text-emerald-800",
  },
  {
    name: "KRA eTIMS (OSCU / VSCU)",
    category: "Tax Compliance",
    endpoint: "Real-Time Tax Invoice Signing & QR Receipt Verification",
    status: "Connected • Serial #KRA-OSCU-WLD-00921",
    badgeColor: "bg-emerald-100 text-emerald-800",
  },
  {
    name: "SHA / SHIF & Slade360 / Smart Gateway",
    category: "Insurance & Capitation",
    endpoint: "Biometric Member Eligibility, Pre-Auth & E-Claim Dispatch",
    status: "Connected • Live",
    badgeColor: "bg-emerald-100 text-emerald-800",
  },
  {
    name: "Vensure (Versaly B2B Procurement)",
    category: "Pharmaceutical Replenishment",
    endpoint: "Automated Reorder PO Handoff to Surgipharm / Phillips / Medisel",
    status: "Connected • Versaly Native",
    badgeColor: "bg-teal-100 text-teal-800",
  },
  {
    name: "Fleesio (Versaly Fleet & Home Dispatch)",
    category: "Ambulance & Home Phlebotomy",
    endpoint: "Rider Dispatch for Home Sample Collection & Chronic Drug Delivery",
    status: "Connected • Versaly Native",
    badgeColor: "bg-teal-100 text-teal-800",
  },
  {
    name: "HL7 / ASTM Lab Analyzer Interface",
    category: "Laboratory Hardware",
    endpoint: "Sysmex XN-350 Haematology & Mindray BS-240 Biochemistry Listeners",
    status: "Ready",
    badgeColor: "bg-sky-100 text-sky-800",
  },
];

export function SystemAdminSecurity() {
  const {
    currentRole,
    setCurrentRole,
    canViewClinicalConfidential,
    auditLogs,
    alerts,
    acknowledgeAlert,
    resetDemoData,
  } = useAfyaware();

  const [auditFilter, setAuditFilter] = useState<string>("ALL");

  const filteredLogs =
    auditFilter === "ALL"
      ? auditLogs
      : auditLogs.filter((l) => l.severity === auditFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Security, Clinical Privacy Lock & Integrations
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Role-Based Access Control (RBAC), Immutable Audit Trail & Kenyan Ecosystem Hooks
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Enforces Kenya Data Protection Act (KDPA) compliance: Cashiers, Receptionists & Storekeepers are strictly locked out of confidential EMR notes.
          </p>
        </div>
        <button
          onClick={resetDemoData}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Pre-Seeded Clinic Data
        </button>
      </div>

      {/* Role Switcher & Clinical Privacy Lock Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-teal-600" />
              Interactive 10-Role Access & Clinical Privacy Lock Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Click any role below to switch your active session and test the Clinical Privacy Lock across all modules.
            </p>
          </div>
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
              canViewClinicalConfidential
                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                : "bg-amber-100 text-amber-900 border border-amber-300"
            }`}
          >
            {canViewClinicalConfidential ? (
              <>
                <Unlock className="w-3.5 h-3.5" />
                EMR Confidential Access: UNLOCKED ({currentRole})
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                Clinical Privacy Lock: ENFORCED ({currentRole})
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {ALL_ROLES.map((item) => {
            const isSelected = currentRole === item.role;
            return (
              <button
                key={item.role}
                onClick={() => setCurrentRole(item.role)}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-md"
                    : "bg-slate-50/70 hover:bg-slate-100 border-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold">{item.role}</span>
                    {item.clinicalAccess ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 font-bold">
                        EMR OK
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 font-bold">
                        EMR Locked
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[11px] mt-1.5 leading-snug ${
                      isSelected ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {item.summary}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/30 flex items-center justify-between text-[10px]">
                  <span>
                    {item.billingAccess ? "💰 Billing" : ""}{" "}
                    {item.inventoryAccess ? "📦 Stock" : ""}
                  </span>
                  <span className="font-bold underline">
                    {isSelected ? "Active Role" : "Switch →"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Grid: Integrations Hub & Clinical Notification Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kenyan Healthcare & Versaly Integrations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
            <Server className="w-4 h-4 text-teal-600" />
            Kenyan Statutory, Payment & Versaly Ecosystem Integrations
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Pre-configured connectors for M-Pesa Daraja, KRA eTIMS, SHA/SHIF, Vensure & Fleesio
          </p>

          <div className="space-y-2.5">
            {INTEGRATIONS.map((intg) => (
              <div
                key={intg.name}
                className="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 bg-slate-50/50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {intg.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {intg.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    {intg.endpoint}
                  </div>
                </div>
                <span
                  className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold ${intg.badgeColor}`}
                >
                  {intg.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications & Clinical Alerts Matrix */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
            <BellRing className="w-4 h-4 text-rose-600" />
            Notifications & Clinical Alert Rules
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Automated multi-channel dispatch across Worklist Popups, Screen Modal Locks, SMS & WhatsApp
          </p>

          <div className="space-y-2.5">
            {alerts.map((a) => (
              <div
                key={a.id}
                className="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        a.severity === "critical"
                          ? "bg-rose-100 text-rose-800"
                          : a.severity === "warning"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {a.type}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      To: {a.recipientRole} ({a.channel})
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    {a.title}
                  </div>
                  <div className="text-[11px] text-slate-600">{a.message}</div>
                </div>
                {a.acknowledged ? (
                  <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Acked
                  </span>
                ) : (
                  <button
                    onClick={() => acknowledgeAlert(a.id)}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-semibold cursor-pointer"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Immutable Audit Trail Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-teal-600" />
              Immutable Clinical & Financial Audit Trail
            </h2>
            <p className="text-xs text-slate-500">
              Every prescription edit, bill cancellation, ledger adjustment, consent signature, and lab verification is permanently logged.
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {["ALL", "Standard", "Sensitive Clinical Access", "Financial Override"].map(
              (sev) => (
                <button
                  key={sev}
                  onClick={() => setAuditFilter(sev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    auditFilter === sev
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {sev}
                </button>
              )
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 bg-slate-50">
                <th className="py-2.5 px-3">Audit ID & Time</th>
                <th className="py-2.5 px-3">Staff & Role</th>
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-3">Action Recorded</th>
                <th className="py-2.5 px-3">Target Record</th>
                <th className="py-2.5 px-3">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                    <span className="font-bold text-slate-900">{log.id}</span> •{" "}
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900">{log.actorName}</div>
                    <div className="text-[11px] text-slate-500">{log.actorRole}</div>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-teal-800">
                    {log.module}
                  </td>
                  <td className="py-2.5 px-3 text-slate-800">{log.action}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                    {log.targetRecord}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.severity === "Financial Override"
                          ? "bg-amber-100 text-amber-900"
                          : log.severity === "Sensitive Clinical Access"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
