"use client";

import React, { useState } from "react";
import { useAfyaware } from "@/lib/store";
import {
  Moh705Row,
  Moh706Row,
  InterBranchStockTransfer,
  PatientHealthWallet,
  TelemedicinePhlebotomyDispatch,
} from "@/lib/types";
import {
  FileBarChart2,
  Network,
  Wallet,
  Video,
  Printer,
  Search,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  Building,
  QrCode,
  Smartphone,
  PhoneCall,
  MapPin,
  Calendar,
  PlusCircle,
  Download,
  ShieldCheck,
  Send,
  Sparkles,
} from "lucide-react";

export function MohReportsNetworkModule() {
  const {
    moh705,
    moh706,
    stockTransfers,
    wallets,
    dispatches,
    branches,
    activeBranchId,
    addStockTransfer,
    updateStockTransfer,
    updateWallet,
    addDispatch,
    updateDispatch,
  } = useAfyaware();

  const [activeTab, setActiveTab] = useState<
    "moh-reports" | "stock-transfers" | "patient-wallet" | "telemedicine-dispatch"
  >("moh-reports");

  const [mohSubTab, setMohSubTab] = useState<"705A" | "705B" | "706" | "710">("705A");
  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  // ==========================================
  // TAB 1: STATUTORY MOH REPORTS
  // ==========================================
  const [reportMonth, setReportMonth] = useState<string>("October 2026");
  const [filterQuery, setFilterQuery] = useState<string>("");

  const filtered705 = moh705.filter(
    (r) =>
      r.diseaseName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.icd10Ref.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const totalUnder5 = moh705.reduce((sum, r) => sum + r.under5Cases, 0);
  const totalOver5 = moh705.reduce((sum, r) => sum + r.over5Cases, 0);
  const totalLab706 = moh706.reduce((sum, r) => sum + r.totalPerformed, 0);
  const totalPos706 = moh706.reduce((sum, r) => sum + r.positiveCount, 0);

  // ==========================================
  // TAB 2: INTER-BRANCH STOCK NETWORK
  // ==========================================
  const [showNewTransferModal, setShowNewTransferModal] = useState<boolean>(false);
  const [destBranch, setDestBranch] = useState<string>("BR-UPPERHILL");
  const [transferDrugName, setTransferDrugName] = useState<string>("Amoxicillin / Clavulanate 625mg");
  const [transferBatch, setTransferBatch] = useState<string>("AUG-9921");
  const [transferQty, setTransferQty] = useState<number>(50);

  const handleCreateTransfer = () => {
    const trfNum = `TRF-${activeBranch.code}-${Date.now().toString().slice(-4)}`;
    addStockTransfer({
      id: `TRF-${Date.now().toString().slice(-4)}`,
      transferNumber: trfNum,
      sourceBranchId: activeBranchId,
      destinationBranchId: destBranch,
      drugCode: "KEML-AMOX-500",
      drugName: transferDrugName,
      batchNumber: transferBatch,
      quantityRequested: transferQty,
      status: "In Transit",
      requestedBy: "Branch Lead Pharmacist",
      requestDate: new Date().toISOString().replace("T", " ").slice(0, 16),
    });
    setShowNewTransferModal(false);
  };

  const handleReceiveTransfer = (transferId: string) => {
    updateStockTransfer(transferId, {
      status: "Received & Verified",
      receivedDate: new Date().toISOString().replace("T", " ").slice(0, 16),
    });
    alert(`Transfer ${transferId} received and batched into destination clinic inventory!`);
  };

  // ==========================================
  // TAB 3: PATIENT HEALTH WALLET & PORTAL
  // ==========================================
  const [selectedWalletId, setSelectedWalletId] = useState<string>(wallets[0]?.id || "");
  const [topUpAmount, setTopUpAmount] = useState<number>(1000);
  const selectedWallet = wallets.find((w) => w.id === selectedWalletId) || wallets[0];

  const handleWalletTopUp = () => {
    if (!selectedWallet) return;
    const ref = `QKA${Math.floor(100000 + Math.random() * 900000)}M`;
    const newTx = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      type: "Top-Up (M-Pesa)" as const,
      amountKes: Number(topUpAmount),
      receiptRef: ref,
    };

    updateWallet(selectedWallet.id, {
      balanceKes: selectedWallet.balanceKes + Number(topUpAmount),
      recentTransactions: [newTx, ...selectedWallet.recentTransactions],
    });
    alert(`Top-up of KSh ${topUpAmount.toLocaleString()} credited to ${selectedWallet.patientName}'s wallet via M-Pesa (Ref: ${ref})!`);
  };

  // ==========================================
  // TAB 4: TELEMEDICINE & HOME PHLEBOTOMY
  // ==========================================
  const [showNewDispatchModal, setShowNewDispatchModal] = useState<boolean>(false);
  const [dispType, setDispType] = useState<TelemedicinePhlebotomyDispatch["requestType"]>("Home Phlebotomy (Lab)");
  const [dispPatientName, setDispPatientName] = useState<string>("Fatuma Halima Hassan");
  const [dispPhone, setDispPhone] = useState<string>("+254733112233");
  const [dispAddress, setDispAddress] = useState<string>("Riverside Drive, Nairobi");
  const [dispTime, setDispTime] = useState<string>("11:00 AM");
  const [dispStaff, setDispStaff] = useState<string>("Phleb. Evans Omondi");
  const [dispService, setDispService] = useState<string>("CBC + Fasting Blood Sugar + Lipid Profile");

  const handleCreateDispatch = () => {
    addDispatch({
      id: `DISP-${Date.now().toString().slice(-4)}`,
      requestType: dispType,
      patientName: dispPatientName,
      patientUpn: "AFY-2026-00145",
      patientPhone: dispPhone,
      patientAddress: dispAddress,
      scheduledTime: dispTime,
      assignedStaff: dispStaff,
      testsOrSpecialty: dispService,
      dispatchStatus: "Dispatched",
    });
    setShowNewDispatchModal(false);
  };

  const handleUpdateDispatchStatus = (dispId: string, status: TelemedicinePhlebotomyDispatch["dispatchStatus"]) => {
    updateDispatch(dispId, { dispatchStatus: status });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                KHIS Statutory Reports & Network Operations
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <FileBarChart2 className="w-6 h-6 text-teal-600" />
              Statutory MOH Reports, Multi-Branch Network & Patient Portal
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              MOH 705A/B, MOH 706 & 710 KHIS reporting • Inter-branch stock transfers • Patient digital health wallet • Telemedicine & home phlebotomy dispatch
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 font-bold text-slate-700 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-500" />
              Branch: {activeBranch.name}
            </span>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-6 pt-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("moh-reports")}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "moh-reports"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileBarChart2 className="w-4 h-4" />
            Statutory MOH Reports
          </button>
          <button
            onClick={() => setActiveTab("stock-transfers")}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "stock-transfers"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            Inter-Branch Stock Network
          </button>
          <button
            onClick={() => setActiveTab("patient-wallet")}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "patient-wallet"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Wallet className="w-4 h-4" />
            Patient Digital Health Wallet
          </button>
          <button
            onClick={() => setActiveTab("telemedicine-dispatch")}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "telemedicine-dispatch"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Video className="w-4 h-4" />
            Telemedicine & Home Phlebotomy
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: STATUTORY KENYAN MOH REPORTS */}
      {/* ========================================================================= */}
      {activeTab === "moh-reports" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileBarChart2 className="w-4 h-4 text-teal-600" />
                  Kenyan Health Information System (KHIS) Statutory Registers
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monthly aggregated epidemiological & diagnostic returns formatted for direct MOH submission
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600">Reporting Period:</span>
                <select
                  value={reportMonth}
                  onChange={(e) => setReportMonth(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800"
                >
                  <option value="October 2026">October 2026</option>
                  <option value="September 2026">September 2026</option>
                  <option value="August 2026">August 2026</option>
                </select>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Export PDF
                </button>
              </div>
            </div>

            {/* Sub-tabs for MOH Forms */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <button
                onClick={() => setMohSubTab("705A")}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  mohSubTab === "705A" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                MOH 705A: Under 5 Morbidity ({totalUnder5} cases)
              </button>
              <button
                onClick={() => setMohSubTab("705B")}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  mohSubTab === "705B" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                MOH 705B: Over 5 Morbidity ({totalOver5} cases)
              </button>
              <button
                onClick={() => setMohSubTab("706")}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  mohSubTab === "706" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                MOH 706: Laboratory Register ({totalLab706} tests)
              </button>
              <button
                onClick={() => setMohSubTab("710")}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  mohSubTab === "710" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                MOH 710: Immunization & Vaccine Logistics
              </button>
            </div>

            {/* MOH 705A / 705B Table */}
            {(mohSubTab === "705A" || mohSubTab === "705B") && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Code</th>
                      <th className="py-2.5 px-3">Disease / Clinical Condition</th>
                      <th className="py-2.5 px-3">ICD-10 Code</th>
                      <th className="py-2.5 px-3 text-right">
                        {mohSubTab === "705A" ? "Under 5 Years Count" : "Over 5 Years Count"}
                      </th>
                      <th className="py-2.5 px-3 text-right">% of Morbidity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered705.map((row) => {
                      const count = mohSubTab === "705A" ? row.under5Cases : row.over5Cases;
                      const denominator = mohSubTab === "705A" ? totalUnder5 : totalOver5;
                      const pct = denominator > 0 ? ((count / denominator) * 100).toFixed(1) : "0.0";

                      return (
                        <tr key={row.diseaseCode} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                            {row.diseaseCode}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            {row.diseaseName}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-teal-800 font-bold">
                            {row.icd10Ref}
                          </td>
                          <td className="py-2.5 px-3 text-right font-black text-slate-900 text-sm">
                            {count}
                          </td>
                          <td className="py-2.5 px-3 text-right font-semibold text-slate-600">
                            {pct}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold text-slate-900">
                    <tr>
                      <td colSpan={3} className="py-2.5 px-3">
                        Total {mohSubTab === "705A" ? "Under 5" : "Over 5"} Outpatient Episodes
                      </td>
                      <td className="py-2.5 px-3 text-right text-sm font-black text-teal-800">
                        {mohSubTab === "705A" ? totalUnder5 : totalOver5}
                      </td>
                      <td className="py-2.5 px-3 text-right">100.0%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* MOH 706 Table */}
            {mohSubTab === "706" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Test Code</th>
                      <th className="py-2.5 px-3">Laboratory Investigation</th>
                      <th className="py-2.5 px-3">Specimen Matrix</th>
                      <th className="py-2.5 px-3 text-right">Total Performed</th>
                      <th className="py-2.5 px-3 text-right">Positive / Reactive</th>
                      <th className="py-2.5 px-3 text-right">Positivity Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {moh706.map((row) => {
                      const posRate = ((row.positiveCount / row.totalPerformed) * 100).toFixed(1);
                      return (
                        <tr key={row.testCode} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                            {row.testCode}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            {row.testName}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {row.specimenType}
                          </td>
                          <td className="py-2.5 px-3 text-right font-black text-slate-900">
                            {row.totalPerformed}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-rose-600">
                            {row.positiveCount}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-700">
                            {posRate}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold text-slate-900">
                    <tr>
                      <td colSpan={3} className="py-2.5 px-3">Total Diagnostic Tests Performed</td>
                      <td className="py-2.5 px-3 text-right text-sm font-black text-teal-800">{totalLab706}</td>
                      <td className="py-2.5 px-3 text-right text-sm font-black text-rose-600">{totalPos706}</td>
                      <td className="py-2.5 px-3 text-right">{((totalPos706 / totalLab706) * 100).toFixed(1)}%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* MOH 710 Tab */}
            {mohSubTab === "710" && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">MOH 710 Vaccine Cold Chain & Wastage Summary</span>
                  <span className="text-emerald-700 font-bold">✓ Zero Vaccine Stockouts in Current Period</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">BCG Doses</span>
                    <span className="text-sm font-black text-slate-900 mt-1 block">48 Vials Opened</span>
                    <span className="text-[10px] text-slate-500">Wastage Factor: 1.15</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Pentavalent (DPT-HepB-Hib)</span>
                    <span className="text-sm font-black text-slate-900 mt-1 block">112 Doses</span>
                    <span className="text-[10px] text-emerald-600 font-bold">100% Fully Immunized</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Rotavirus (Oral)</span>
                    <span className="text-sm font-black text-slate-900 mt-1 block">96 Doses</span>
                    <span className="text-[10px] text-slate-500">Cold Chain: 4.2°C (Optimal)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Measles-Rubella (MR)</span>
                    <span className="text-sm font-black text-slate-900 mt-1 block">74 Doses</span>
                    <span className="text-[10px] text-slate-500">Coverage: 94.2%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INTER-BRANCH STOCK NETWORK */}
      {/* ========================================================================= */}
      {activeTab === "stock-transfers" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-teal-600" />
                  Inter-Branch Stock Transfers & Inventory Network
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Balance drug inventory between Westlands (Main), Upper Hill, and Mombasa branches
                </p>
              </div>

              <button
                onClick={() => setShowNewTransferModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Initiate Inter-Branch Transfer
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Transfer Ref</th>
                    <th className="py-2.5 px-3">Source $\rightarrow$ Destination</th>
                    <th className="py-2.5 px-3">Drug & Batch</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3">Requested By & Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stockTransfers.map((trf) => {
                    const src = branches.find((b) => b.id === trf.sourceBranchId)?.name || trf.sourceBranchId;
                    const dest = branches.find((b) => b.id === trf.destinationBranchId)?.name || trf.destinationBranchId;
                    return (
                      <tr key={trf.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          {trf.transferNumber}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-slate-800 block">{src}</span>
                          <span className="text-[10px] text-teal-700 font-bold">$\rightarrow$ {dest}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-slate-900 block">{trf.drugName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">Batch: {trf.batchNumber}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-slate-900 text-sm">
                          {trf.quantityRequested} Units
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-600">
                          <div>{trf.requestedBy}</div>
                          <div className="text-[10px] text-slate-400">{trf.requestDate}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              trf.status === "Received & Verified"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {trf.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {trf.status === "In Transit" && (
                            <button
                              onClick={() => handleReceiveTransfer(trf.id)}
                              className="px-2.5 py-1 rounded bg-teal-600 text-white font-bold text-[10px] hover:bg-teal-700 cursor-pointer shadow-xs"
                            >
                              Confirm Receipt
                            </button>
                          )}
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

      {/* ========================================================================= */}
      {/* TAB 3: PATIENT HEALTH WALLET & PORTAL */}
      {/* ========================================================================= */}
      {activeTab === "patient-wallet" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Wallet Selector & Balance Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-teal-600" />
                Patient Health Wallet & Digital Card
              </h3>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-600 block">Select Patient</label>
                <div className="space-y-2">
                  {wallets.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWalletId(w.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedWalletId === w.id
                          ? "border-teal-600 bg-teal-50/40 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{w.patientName}</span>
                        <span className="font-mono text-xs font-black text-emerald-600">
                          KSh {w.balanceKes.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        UPN: {w.patientUpn} • Loyalty: {w.loyaltyPoints} pts
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Digital Wallet Card */}
              {selectedWallet && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400">
                      Afyaware Digital Health Pass
                    </span>
                    <QrCode className="w-5 h-5 text-teal-300" />
                  </div>

                  <div>
                    <div className="text-lg font-black">{selectedWallet.patientName}</div>
                    <div className="text-xs text-slate-400 font-mono">{selectedWallet.patientUpn}</div>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400">Pre-Paid Balance</div>
                      <div className="text-xl font-black text-emerald-400">
                        KSh {selectedWallet.balanceKes.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] uppercase tracking-wider text-slate-400">AfyaPoints</div>
                      <div className="text-sm font-bold text-amber-300">{selectedWallet.loyaltyPoints} pts</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Instant M-Pesa Top Up */}
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                <span className="text-xs font-bold text-emerald-950 block">Instant M-Pesa Wallet Top-Up</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(Number(e.target.value))}
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900"
                  />
                  <button
                    onClick={handleWalletTopUp}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 cursor-pointer shadow-xs"
                  >
                    Top-Up
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Ledger & Transaction History (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Recent Wallet Transactions & Co-Pay Redemptions
              </h3>

              {selectedWallet ? (
                <div className="divide-y divide-slate-100 text-xs">
                  {selectedWallet.recentTransactions.map((tx) => (
                    <div key={tx.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{tx.type}</span>
                        <span className="text-[10px] text-slate-500">
                          {tx.date} • Ref: <span className="font-mono">{tx.receiptRef}</span>
                        </span>
                      </div>
                      <span
                        className={`font-black ${
                          tx.amountKes > 0 ? "text-emerald-600" : "text-slate-900"
                        }`}
                      >
                        {tx.amountKes > 0 ? "+" : ""}KSh {tx.amountKes.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-500 text-xs">Select a wallet to inspect history.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TELEMEDICINE & HOME PHLEBOTOMY */}
      {/* ========================================================================= */}
      {activeTab === "telemedicine-dispatch" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Video className="w-4 h-4 text-teal-600" />
                  Telemedicine Consultations & Home Phlebotomy Lab Dispatch
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Coordinate doorstep sample collection and scheduled virtual clinical reviews
                </p>
              </div>

              <button
                onClick={() => setShowNewDispatchModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Schedule Dispatch
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dispatches.map((disp) => (
                <div
                  key={disp.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-black text-slate-900 block">{disp.patientName}</span>
                      <span className="text-[10px] text-slate-500">{disp.patientPhone}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        disp.requestType.includes("Lab")
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {disp.requestType}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{disp.patientAddress}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{disp.scheduledTime} • Assigned: <b>{disp.assignedStaff}</b></span>
                    </div>
                    <div className="text-[11px] text-teal-800 font-semibold pt-1 border-t border-slate-100">
                      Services: {disp.testsOrSpecialty}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        disp.dispatchStatus === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : disp.dispatchStatus === "Sample Collected"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {disp.dispatchStatus}
                    </span>

                    <div className="space-x-1">
                      {disp.dispatchStatus === "Dispatched" && (
                        <button
                          onClick={() => handleUpdateDispatchStatus(disp.id, "Sample Collected")}
                          className="px-2.5 py-1 rounded bg-indigo-600 text-white font-bold text-[10px] hover:bg-indigo-700 cursor-pointer"
                        >
                          Mark Sample Collected
                        </button>
                      )}
                      {disp.dispatchStatus !== "Completed" && (
                        <button
                          onClick={() => handleUpdateDispatchStatus(disp.id, "Completed")}
                          className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 cursor-pointer"
                        >
                          Complete Review
                        </button>
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
      {/* MODAL 1: NEW STOCK TRANSFER MODAL */}
      {/* ========================================================================= */}
      {showNewTransferModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-teal-600" />
              Initiate Inter-Branch Transfer
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Destination Branch</label>
                <select
                  value={destBranch}
                  onChange={(e) => setDestBranch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  {branches
                    .filter((b) => b.id !== activeBranchId)
                    .map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Drug Item</label>
                <input
                  type="text"
                  value={transferDrugName}
                  onChange={(e) => setTransferDrugName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Batch Number</label>
                <input
                  type="text"
                  value={transferBatch}
                  onChange={(e) => setTransferBatch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Transfer Quantity (Packs)</label>
                <input
                  type="number"
                  min="1"
                  value={transferQty}
                  onChange={(e) => setTransferQty(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNewTransferModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTransfer}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 cursor-pointer shadow-xs"
              >
                Dispatch Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: SCHEDULE DISPATCH MODAL */}
      {/* ========================================================================= */}
      {showNewDispatchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-teal-600" />
              Schedule Home Phlebotomy / Telemedicine
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Request Type</label>
                <select
                  value={dispType}
                  onChange={(e) => setDispType(e.target.value as TelemedicinePhlebotomyDispatch["requestType"])}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  <option value="Home Phlebotomy (Lab)">Home Phlebotomy (Lab Sample Pickup)</option>
                  <option value="Telemedicine Video Consult">Telemedicine Video Consult</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Patient Name</label>
                <input
                  type="text"
                  value={dispPatientName}
                  onChange={(e) => setDispPatientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={dispPhone}
                  onChange={(e) => setDispPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Location / Address</label>
                <input
                  type="text"
                  value={dispAddress}
                  onChange={(e) => setDispAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Services / Lab Profile</label>
                <input
                  type="text"
                  value={dispService}
                  onChange={(e) => setDispService(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNewDispatchModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDispatch}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 cursor-pointer shadow-xs"
              >
                Schedule & Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
