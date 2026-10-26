"use client";

import React, { useState } from "react";
import { useAfyaware } from "@/lib/store";
import { QueueStation } from "@/lib/types";
import {
  Activity,
  AlertTriangle,
  Clock,
  CreditCard,
  FileWarning,
  FlaskConical,
  HeartPulse,
  Hospital,
  Lock,
  Pill,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Users,
  CheckCircle2,
  ArrowRight,
  BedDouble,
  Send,
} from "lucide-react";

const STATIONS: QueueStation[] = [
  "Reception",
  "Triage",
  "Consultation",
  "Lab",
  "Imaging",
  "Procedure / Day-Ward",
  "Doctor Review",
  "Pharmacy",
  "Cashier",
];

export function LiveOpsWorkspace() {
  const {
    visits,
    resources,
    tasks,
    alerts,
    drugBatches,
    claims,
    currentRole,
    canViewClinicalConfidential,
    acknowledgeAlert,
    updateTaskStatus,
    moveVisitStation,
    updateResourceStatus,
    setActiveModule,
  } = useAfyaware();

  const [selectedStationFilter, setSelectedStationFilter] = useState<string>("ALL");
  const [ownerDigestSent, setOwnerDigestSent] = useState(false);

  const activeVisits = visits.filter((v) => v.station !== "Discharged");
  const longWaitVisits = activeVisits.filter((v) => v.waitMinutes >= 30);
  const unbilledVisits = activeVisits.filter((v) => !v.billingCleared);
  const criticalAlerts = alerts.filter((a) => !a.acknowledged);
  const expiringDrugs = drugBatches.filter((d) => d.daysToExpiry <= 60);
  const pendingClaims = claims.filter(
    (c) => c.status === "Pending Scrubbing" || c.status === "Rejected / Disputed"
  );

  const filteredVisits =
    selectedStationFilter === "ALL"
      ? activeVisits
      : activeVisits.filter((v) => v.station === selectedStationFilter);

  return (
    <div className="space-y-6">
      {/* Top Executive Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl p-6 shadow-lg border border-teal-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LIVE CLINICAL OPERATIONS COMMAND CENTER
              </span>
              <span className="text-xs text-slate-300">
                SHA/SHIF • M-Pesa Daraja • KRA eTIMS Active
              </span>
            </div>
            <h1 className="text-2xl font-bold mt-2 tracking-tight">
              Afyaware Outpatient, Pharmacy & Diagnostic Operations
            </h1>
            <p className="text-sm text-slate-300 mt-0.5">
              Real-time patient flow, wait-time bottleneck detection, resource occupancy, and zero-leakage revenue gates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setOwnerDigestSent(true);
                setTimeout(() => setOwnerDigestSent(false), 4000);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition cursor-pointer shadow"
            >
              <Send className="w-3.5 h-3.5" />
              {ownerDigestSent
                ? "Daily WhatsApp Digest Sent to Director!"
                : "Send Owner WhatsApp Revenue Digest"}
            </button>
            <button
              onClick={() => setActiveModule("empi-Scheduling")}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition cursor-pointer border border-white/15"
            >
              <Users className="w-3.5 h-3.5" />
              New Walk-In / Check-In
            </button>
          </div>
        </div>

        {/* Executive Overview Strip matching afyaware-project-overview.md */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 pt-5 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Visits Today</span>
              <Hospital className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-bold mt-1">142</div>
            <div className="text-[11px] text-emerald-300 mt-0.5">
              {activeVisits.length} active in clinic now
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Queue & Doctors</span>
              <Stethoscope className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold mt-1">14 / 6</div>
            <div className="text-[11px] text-sky-300 mt-0.5">
              14 Waiting • 6 With Doctors
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Lab & Imaging</span>
              <FlaskConical className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold mt-1">9 Pending</div>
            <div className="text-[11px] text-rose-300 font-medium mt-0.5">
              🚨 {criticalAlerts.length} Critical Alerts Active
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Revenue Today</span>
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold mt-1">KSh 385,400</div>
            <div className="text-[11px] text-emerald-300 mt-0.5">
              Cash: KSh 15,000 • eTIMS Synced
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>M-Pesa / SHA Split</span>
              <Smartphone className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-sm font-bold mt-1.5 text-green-300">
              📱 M-Pesa: KSh 192,000
            </div>
            <div className="text-xs font-semibold text-sky-300 mt-0.5">
              🛡️ SHA/Ins: KSh 178,400
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Expiry & Claims</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-sm font-bold mt-1.5 text-amber-300">
              ⚠️ {expiringDrugs.length} Batches &lt;60d Exp
            </div>
            <div className="text-xs font-semibold text-orange-300 mt-0.5">
              📄 {pendingClaims.length} Claims Unsubmitted
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Privacy Lock Notice when viewing as Cashier / Receptionist / Storekeeper */}
      {!canViewClinicalConfidential && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                Clinical Privacy Lock Active for Role: {currentRole}
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                Confidential doctor consultation notes, ICD-10 diagnoses, and clinical attachments are automatically masked. You have full access to queue status, billing items, and account ledgers.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-200/70 text-amber-900">
            KDPA Compliant
          </span>
        </div>
      )}

      {/* Critical Panic Value & Live Clinical Alerts Strip */}
      {criticalAlerts.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 animate-bounce" />
              <h2 className="text-sm font-bold text-rose-950 uppercase tracking-wider">
                Immediate Action Alerts & Panic Values ({criticalAlerts.length} Unacknowledged)
              </h2>
            </div>
            <span className="text-xs text-rose-700 font-medium">
              Real-Time Clinical Alert Bus
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {criticalAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                  alert.severity === "critical"
                    ? "bg-white border-rose-300 shadow-xs"
                    : "bg-white/90 border-amber-200"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        alert.severity === "critical"
                          ? "bg-rose-600 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {alert.type}
                    </span>
                    <span className="text-xs text-slate-500">
                      {alert.timestamp} • {alert.channel}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {alert.title}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{alert.message}</p>
                </div>
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
                >
                  Acknowledge
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Patient Flow Pipeline across 9 Clinic Stations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              Live Patient Flow Across Stations
            </h2>
            <p className="text-xs text-slate-500">
              Click any station card to filter active visits, or advance a patient to their next station in real time.
            </p>
          </div>
          {selectedStationFilter !== "ALL" && (
            <button
              onClick={() => setSelectedStationFilter("ALL")}
              className="text-xs font-semibold text-teal-700 hover:underline cursor-pointer"
            >
              Show All Stations ({activeVisits.length})
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2.5">
          {STATIONS.map((station) => {
            const count = activeVisits.filter((v) => v.station === station).length;
            const hasDelayed = activeVisits.some(
              (v) => v.station === station && v.waitMinutes >= 30
            );
            const isSelected = selectedStationFilter === station;

            return (
              <button
                key={station}
                onClick={() =>
                  setSelectedStationFilter(isSelected ? "ALL" : station)
                }
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  isSelected
                    ? "bg-teal-900 text-white border-teal-900 shadow-sm"
                    : hasDelayed
                    ? "bg-rose-50/70 border-rose-300 hover:bg-rose-50"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xl font-extrabold ${
                      isSelected
                        ? "text-white"
                        : hasDelayed
                        ? "text-rose-700"
                        : "text-slate-900"
                    }`}
                  >
                    {count}
                  </span>
                  {hasDelayed && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold">
                      &gt;30m
                    </span>
                  )}
                </div>
                <div
                  className={`text-[11px] font-semibold mt-1 truncate ${
                    isSelected ? "text-teal-100" : "text-slate-600"
                  }`}
                >
                  {station}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Visits Table with Wait-Time & Privacy-Aware Clinical Info */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 bg-slate-50/80">
                <th className="py-2.5 px-3">Ticket & Patient</th>
                <th className="py-2.5 px-3">Current Station</th>
                <th className="py-2.5 px-3">Wait Time</th>
                <th className="py-2.5 px-3">Doctor & Room</th>
                <th className="py-2.5 px-3">Clinical Triage / ICD-10</th>
                <th className="py-2.5 px-3">Payer & Billing Gate</th>
                <th className="py-2.5 px-3 text-right">Quick Route</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredVisits.map((visit) => {
                const isDelayed = visit.waitMinutes >= 30;
                const nextStationIdx =
                  (STATIONS.indexOf(visit.station) + 1) % STATIONS.length;
                const nextStation = STATIONS[nextStationIdx];

                return (
                  <tr
                    key={visit.id}
                    className={`hover:bg-slate-50/90 transition ${
                      visit.priority === "Emergency / Stat"
                        ? "bg-rose-50/40"
                        : ""
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                            visit.priority === "Emergency / Stat"
                              ? "bg-rose-600 text-white"
                              : visit.priority === "Urgent"
                              ? "bg-amber-500 text-white"
                              : "bg-slate-200 text-slate-800"
                          }`}
                        >
                          #{visit.ticketNumber}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900">
                            {visit.patientName}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {visit.patientUpn} • {visit.patientAge}y{" "}
                            {visit.patientGender}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                        {visit.station}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div
                        className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded ${
                          isDelayed
                            ? "bg-rose-100 text-rose-800 border border-rose-300"
                            : "text-slate-700"
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {visit.waitMinutes} mins
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Since {visit.stationEnteredAt}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">
                        {visit.assignedDoctor}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {visit.assignedRoom}
                      </div>
                    </td>

                    <td className="py-3 px-3 max-w-xs">
                      {canViewClinicalConfidential ? (
                        <div>
                          {visit.vitals?.abnormalityFlags &&
                          visit.vitals.abnormalityFlags.length > 0 ? (
                            <div className="flex flex-wrap gap-1 mb-1">
                              {visit.vitals.abnormalityFlags.map((flag, i) => (
                                <span
                                  key={i}
                                  className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold text-[10px]"
                                >
                                  {flag}
                                </span>
                              ))}
                            </div>
                          ) : null}
                          <div className="text-slate-700 truncate">
                            {visit.icd10Code ? (
                              <span className="font-semibold text-teal-900">
                                [{visit.icd10Code}] {visit.icd10Description}
                              </span>
                            ) : (
                              visit.vitals?.chiefComplaint ||
                              "Awaiting Triage Vitals"
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 text-slate-500 text-[11px] font-medium">
                          <Lock className="w-3 h-3 text-amber-600" />
                          Confidential EMR Masked ({currentRole})
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">
                        {visit.insurerName || visit.paymentType}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] text-slate-600">
                          KSh {visit.totalBillAmount.toLocaleString()}
                        </span>
                        {visit.billingCleared ? (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Cleared
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                            Gate Locked (Unpaid)
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => moveVisitStation(visit.id, nextStation)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-teal-700 text-white text-[11px] font-semibold transition cursor-pointer"
                      >
                        Send to {nextStation}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3-Column Operations Grid: Resource Occupancy | Clinical Action Worklists | Revenue & Expiry Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 1: Resource, Room, Equipment & Observation Bed Occupancy */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-teal-600" />
                Room, Equipment & Bed Occupancy
              </h3>
              <p className="text-xs text-slate-500">
                Prevent double-booking across consultation rooms & scans
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800">
              {resources.filter((r) => r.status === "Occupied").length}/
              {resources.length} Active
            </span>
          </div>

          <div className="space-y-2.5">
            {resources.map((res) => (
              <div
                key={res.id}
                className="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2 bg-slate-50/60"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {res.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {res.assignedClinician}
                    {res.currentOccupant ? ` • ${res.currentOccupant}` : ""}
                  </div>
                </div>
                <button
                  onClick={() =>
                    updateResourceStatus(
                      res.id,
                      res.status === "Available" ? "Occupied" : "Available"
                    )
                  }
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                    res.status === "Occupied"
                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                      : res.status === "Available"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {res.status}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Role-Based Clinical Action Worklists */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-600" />
                Clinical Action Worklists
              </h3>
              <p className="text-xs text-slate-500">
                Unreviewed lab results, pending procedures & shift tasks
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-800">
              {tasks.filter((t) => t.status !== "Completed").length} Open
            </span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-xl border ${
                  task.status === "Completed"
                    ? "bg-slate-50 border-slate-200 opacity-60"
                    : task.priority === "Emergency / Stat"
                    ? "bg-rose-50/50 border-rose-200"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-900 text-white">
                    {task.roleTarget} • {task.category}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {task.createdAt}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 mt-1.5">
                  {task.title}
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Patient: <span className="font-semibold">{task.patientName}</span> ({task.patientUpn})
                </div>
                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500">
                    {task.assignedTo}
                  </span>
                  {task.status !== "Completed" ? (
                    <button
                      onClick={() => updateTaskStatus(task.id, "Completed")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold cursor-pointer"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Mark Done
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-700">
                      ✓ Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3: Pharmacy FEFO Expiry Radar & Unbilled / Claims Gate */}
        <div className="space-y-6">
          {/* Pharmacy Expiry Radar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Pill className="w-4 h-4 text-amber-600" />
                Pharmacy FEFO Expiry Radar (&lt;60 Days)
              </h3>
              <button
                onClick={() => setActiveModule("pharmacy-inventory")}
                className="text-xs font-semibold text-teal-700 hover:underline cursor-pointer"
              >
                Open Inventory →
              </button>
            </div>
            <div className="space-y-2.5">
              {expiringDrugs.map((drug) => (
                <div
                  key={drug.id}
                  className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {drug.brandName} ({drug.genericName})
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Batch: <span className="font-mono font-semibold">{drug.batchNumber}</span> • Qty: {drug.stockQty} • {drug.supplierName}
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold">
                    {drug.daysToExpiry}d left
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Unbilled Services & Pending Claims Scrubbing */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileWarning className="w-4 h-4 text-rose-600" />
                Revenue Gate & Claims Scrubbing
              </h3>
              <button
                onClick={() => setActiveModule("cashier-insurance")}
                className="text-xs font-semibold text-teal-700 hover:underline cursor-pointer"
              >
                Open Cashier →
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {unbilledVisits.map((v) => (
                <div
                  key={v.id}
                  className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-rose-950">
                      Unpaid Balance: {v.patientName}
                    </div>
                    <div className="text-[11px] text-rose-700">
                      Station: {v.station} • Total KSh {v.totalBillAmount.toLocaleString()} (Paid KSh {v.paidAmount.toLocaleString()})
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold">
                    Locked
                  </span>
                </div>
              ))}

              {pendingClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900">
                      {claim.payerType}: {claim.patientName}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {claim.claimNumber} • KSh {claim.totalClaimedKes.toLocaleString()} •{" "}
                      {!claim.claimFormSigned
                        ? "Missing Signed Claim Form"
                        : claim.rejectionReason || claim.status}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                    {claim.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
