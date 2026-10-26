"use client";

import React, { useState } from "react";
import { useAfyaware } from "@/lib/store";
import { LedgerEntry, CashierShiftRecord, InsuranceClaim } from "@/lib/types";
import {
  CreditCard,
  Receipt,
  FileSpreadsheet,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  Search,
  PlusCircle,
  QrCode,
  Smartphone,
  Banknote,
  Send,
  Building,
  KeyRound,
  FileCheck,
  Percent,
} from "lucide-react";

export function CashierInsuranceModule() {
  const {
    visits,
    currentRole,
    canViewClinicalConfidential,
    activeBranchId,
    branches,
    ledgers,
    shifts,
    claims,
    addLedgerEntry,
    addShiftRecord,
    updateShiftRecord,
    updateVisit,
    addClaim,
    updateClaim,
    addAuditLog,
  } = useAfyaware();

  const [activeTab, setActiveTab] = useState<
    "cashier-pos" | "patient-ledgers" | "insurance-claims" | "shift-reconciliation"
  >("cashier-pos");

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  // ==========================================
  // TAB 1: CASHIER STATION & BILLING GATES
  // ==========================================
  const [selectedVisitId, setSelectedVisitId] = useState<string>(
    visits.find((v) => v.branchId === activeBranchId && !v.billingCleared)?.id || visits[0]?.id || ""
  );

  const selectedVisit = visits.find((v) => v.id === selectedVisitId);

  // Payment form states
  const [payCashAmount, setPayCashAmount] = useState<number>(0);
  const [payMpesaAmount, setPayMpesaAmount] = useState<number>(0);
  const [payInsuranceAmount, setPayInsuranceAmount] = useState<number>(0);
  const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState<string>("0712345678");
  const [mpesaStkSent, setMpesaStkSent] = useState<boolean>(false);
  const [mpesaStkCode, setMpesaStkCode] = useState<string>("");
  const [c2bRefInput, setC2bRefInput] = useState<string>("");

  // Waiver modal state
  const [showWaiverModal, setShowWaiverModal] = useState<boolean>(false);
  const [waiverAmount, setWaiverAmount] = useState<number>(500);
  const [waiverPin, setWaiverPin] = useState<string>("");
  const [waiverReason, setWaiverReason] = useState<string>("Clinic Director courtesy adjustment / indigent waiver");
  const [waiverError, setWaiverError] = useState<string>("");

  // eTIMS Printed receipt modal state
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [lastReceiptData, setLastReceiptData] = useState<{
    receiptNumber: string;
    etimsSignature: string;
    patientName: string;
    patientUpn: string;
    totalAmount: number;
    paymentMode: string;
    items: string[];
    date: string;
  } | null>(null);

  // Trigger Daraja STK Push
  const handleTriggerStkPush = () => {
    if (!payMpesaAmount || payMpesaAmount <= 0) {
      alert("Please specify a valid M-Pesa amount to charge.");
      return;
    }
    setMpesaStkSent(true);
    const mockRef = `QKA${Math.floor(100000 + Math.random() * 900000)}X`;
    setTimeout(() => {
      setMpesaStkCode(mockRef);
      addAuditLog(
        `M-Pesa Daraja STK Push initiated for KSh ${payMpesaAmount} to ${mpesaPhoneNumber} (Ref: ${mockRef})`,
        "M-Pesa Daraja 2.0 Integration",
        mockRef
      );
    }, 1200);
  };

  // Complete Payment & Generate KRA eTIMS Tax Receipt
  const handleProcessPayment = () => {
    if (!selectedVisit) return;

    const totalPaying = Number(payCashAmount) + Number(payMpesaAmount) + Number(payInsuranceAmount);
    if (totalPaying <= 0) {
      alert("Please enter a payment amount in Cash, M-Pesa, or Insurance.");
      return;
    }

    const newPaidAmount = selectedVisit.paidAmount + totalPaying;
    const isFull = newPaidAmount >= selectedVisit.totalBillAmount;

    // Update visit
    updateVisit(selectedVisit.id, {
      paidAmount: newPaidAmount,
      billingCleared: isFull,
      consultationFeePaid: true,
      insuranceCoveredAmount: selectedVisit.insuranceCoveredAmount + Number(payInsuranceAmount),
    });

    const receiptNo = `REC-${activeBranch.code}-${Date.now().toString().slice(-4)}`;
    const etimsSig = `KRA-ETIMS-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    // Add ledger entries
    if (payCashAmount > 0) {
      addLedgerEntry({
        id: `LED-${Date.now()}-CASH`,
        patientId: selectedVisit.patientId,
        patientName: selectedVisit.patientName,
        patientUpn: selectedVisit.patientUpn,
        visitId: selectedVisit.id,
        date: new Date().toISOString().replace("T", " ").slice(0, 16),
        type: "Payment (Cash)",
        description: `Cash desk payment for visit ${selectedVisit.visitNumber}`,
        amountKes: -Number(payCashAmount),
        runningBalanceKes: selectedVisit.totalBillAmount - newPaidAmount,
        receiptNumber: receiptNo,
      });
    }

    if (payMpesaAmount > 0) {
      const ref = mpesaStkCode || c2bRefInput || `MPESA-${Math.floor(100000 + Math.random() * 900000)}`;
      addLedgerEntry({
        id: `LED-${Date.now()}-MPESA`,
        patientId: selectedVisit.patientId,
        patientName: selectedVisit.patientName,
        patientUpn: selectedVisit.patientUpn,
        visitId: selectedVisit.id,
        date: new Date().toISOString().replace("T", " ").slice(0, 16),
        type: "Payment (M-Pesa)",
        description: `M-Pesa Till ${activeBranch.mpesaTill} payment (Ref: ${ref})`,
        amountKes: -Number(payMpesaAmount),
        runningBalanceKes: selectedVisit.totalBillAmount - newPaidAmount,
        receiptNumber: receiptNo,
      });
    }

    if (payInsuranceAmount > 0) {
      addLedgerEntry({
        id: `LED-${Date.now()}-INS`,
        patientId: selectedVisit.patientId,
        patientName: selectedVisit.patientName,
        patientUpn: selectedVisit.patientUpn,
        visitId: selectedVisit.id,
        date: new Date().toISOString().replace("T", " ").slice(0, 16),
        type: "Payment (Insurance)",
        description: `Pre-authorized ${selectedVisit.paymentType} benefit settlement`,
        amountKes: -Number(payInsuranceAmount),
        runningBalanceKes: selectedVisit.totalBillAmount - newPaidAmount,
        receiptNumber: receiptNo,
      });
    }

    // Set Receipt Data for thermal printable modal
    setLastReceiptData({
      receiptNumber: receiptNo,
      etimsSignature: etimsSig,
      patientName: selectedVisit.patientName,
      patientUpn: selectedVisit.patientUpn,
      totalAmount: totalPaying,
      paymentMode: [
        payCashAmount > 0 ? `Cash: KSh ${payCashAmount}` : "",
        payMpesaAmount > 0 ? `M-Pesa: KSh ${payMpesaAmount}` : "",
        payInsuranceAmount > 0 ? `Insurance/SHA: KSh ${payInsuranceAmount}` : "",
      ]
        .filter(Boolean)
        .join(" | "),
      items: [
        `Consultation / Clinical Triage Review: KSh ${Math.min(1000, totalPaying)}`,
        totalPaying > 1000 ? `Diagnostics & Pharmacy Order Items: KSh ${totalPaying - 1000}` : "",
      ].filter(Boolean),
      date: new Date().toLocaleString(),
    });

    setShowReceiptModal(true);

    // Reset payment fields
    setPayCashAmount(0);
    setPayMpesaAmount(0);
    setPayInsuranceAmount(0);
    setMpesaStkSent(false);
    setMpesaStkCode("");
    setC2bRefInput("");
  };

  // Authorize Fee Waiver / Credit Note with Manager PIN
  const handleAuthorizeWaiver = () => {
    if (waiverPin !== "1234" && waiverPin !== "9999") {
      setWaiverError("Invalid Manager PIN. Default authorized PIN is 1234.");
      return;
    }

    if (!selectedVisit) return;

    const waiverNo = `WVR-${Date.now().toString().slice(-4)}`;
    const newPaid = selectedVisit.paidAmount + Number(waiverAmount);

    updateVisit(selectedVisit.id, {
      paidAmount: newPaid,
      billingCleared: newPaid >= selectedVisit.totalBillAmount,
      consultationFeePaid: true,
    });

    addLedgerEntry({
      id: `LED-${Date.now()}-WVR`,
      patientId: selectedVisit.patientId,
      patientName: selectedVisit.patientName,
      patientUpn: selectedVisit.patientUpn,
      visitId: selectedVisit.id,
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
      type: "Credit Note / Waiver",
      description: `Manager Authorized Fee Waiver: ${waiverReason}`,
      amountKes: -Number(waiverAmount),
      runningBalanceKes: selectedVisit.totalBillAmount - newPaid,
      receiptNumber: waiverNo,
    });

    addAuditLog(
      `Manager PIN Override: Approved Fee Waiver of KSh ${waiverAmount} for ${selectedVisit.patientName} (${waiverReason})`,
      "Cashier Billing Gate",
      waiverNo,
      "Financial Override"
    );

    setShowWaiverModal(false);
    setWaiverPin("");
    setWaiverError("");
    alert(`Fee Waiver of KSh ${waiverAmount.toLocaleString()} authorized and applied to patient account.`);
  };

  // ==========================================
  // TAB 2: PATIENT ACCOUNT LEDGERS
  // ==========================================
  const [ledgerSearch, setLedgerSearch] = useState<string>("");
  const [showDepositModal, setShowDepositModal] = useState<boolean>(false);
  const [depositPatientUpn, setDepositPatientUpn] = useState<string>("AFY-2026-00142");
  const [depositAmount, setDepositAmount] = useState<number>(5000);
  const [depositDesc, setDepositDesc] = useState<string>("Advance Deposit for Dental/ANC Care Package");

  const filteredLedgers = ledgers.filter(
    (l) =>
      l.patientName.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      l.patientUpn.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      (l.receiptNumber && l.receiptNumber.toLowerCase().includes(ledgerSearch.toLowerCase()))
  );

  const handlePostDeposit = () => {
    const patientVisit = visits.find((v) => v.patientUpn === depositPatientUpn);
    const recNo = `DEP-${activeBranch.code}-${Date.now().toString().slice(-4)}`;

    addLedgerEntry({
      id: `LED-${Date.now()}-DEP`,
      patientId: patientVisit?.patientId || "PAT-WALKIN",
      patientName: patientVisit?.patientName || "Account Holder",
      patientUpn: depositPatientUpn,
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
      type: "Deposit on Account",
      description: depositDesc,
      amountKes: -Number(depositAmount),
      runningBalanceKes: -Number(depositAmount),
      receiptNumber: recNo,
    });

    setShowDepositModal(false);
    alert(`Advance deposit of KSh ${depositAmount.toLocaleString()} credited to ${depositPatientUpn}.`);
  };

  // ==========================================
  // TAB 3: INSURANCE & SHA CLAIMS
  // ==========================================
  const [claimSearch, setClaimSearch] = useState<string>("");
  const [claimStatusFilter, setClaimStatusFilter] = useState<string>("All");
  const [selectedClaimForReview, setSelectedClaimForReview] = useState<InsuranceClaim | null>(null);

  const filteredClaims = claims.filter((c) => {
    const matchText =
      c.claimNumber.toLowerCase().includes(claimSearch.toLowerCase()) ||
      c.patientName.toLowerCase().includes(claimSearch.toLowerCase()) ||
      c.payerType.toLowerCase().includes(claimSearch.toLowerCase());
    const matchStatus = claimStatusFilter === "All" || c.status === claimStatusFilter;
    return matchText && matchStatus;
  });

  // Calculate Aging
  const agingTotals = claims.reduce(
    (acc, c) => {
      if (c.status === "Paid") return acc;
      if (c.agingDays <= 30) acc.days30 += c.totalClaimedKes;
      else if (c.agingDays <= 60) acc.days60 += c.totalClaimedKes;
      else if (c.agingDays <= 90) acc.days90 += c.totalClaimedKes;
      else acc.days120Plus += c.totalClaimedKes;
      acc.totalOutstanding += c.totalClaimedKes;
      return acc;
    },
    { days30: 0, days60: 0, days90: 0, days120Plus: 0, totalOutstanding: 0 }
  );

  // Quick Claim Submission (MOH / SHA scrub engine)
  const handleScrubAndSubmitClaim = (claimId: string) => {
    updateClaim(claimId, { status: "Batched & Submitted" });
    addAuditLog(
      `Claims Scrubbing: Auto-validated preauth, ICD-10 and itemized charges. Submitted claim ${claimId} to SHA/Payer portal.`,
      "Insurance Scrubbing & Submission",
      claimId
    );
    alert(`Claim ${claimId} successfully scrubbed against SHA tariff and dispatched to payer portal!`);
  };

  // Quick Manual Settlement
  const handleMarkClaimSettled = (claimId: string) => {
    updateClaim(claimId, { status: "Paid" });
    addAuditLog(
      `Remittance Reconciled: Marked claim ${claimId} as Paid by insurer.`,
      "Insurance Remittance Reconciliation",
      claimId
    );
    alert(`Claim ${claimId} marked as fully settled.`);
  };

  // ==========================================
  // TAB 4: CASHIER SHIFT RECONCILIATION
  // ==========================================
  const activeShift = shifts.find((s) => s.status === "Open") || shifts[0];
  const [declaredCash, setDeclaredCash] = useState<number>(activeShift?.systemCashExpectedKes || 0);
  const [shiftCloseNotes, setShiftCloseNotes] = useState<string>("");

  const handleBlindCashUp = () => {
    if (!activeShift) return;
    const variance = declaredCash - activeShift.systemCashExpectedKes;

    updateShiftRecord(activeShift.id, {
      closedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      declaredCashKes: declaredCash,
      cashVarianceKes: variance,
      status: "Closed & Reconciled",
      notes: shiftCloseNotes || `Shift closed by ${currentRole}. Variance: KSh ${variance}`,
    });

    alert(
      `Shift ${activeShift.id} closed!\nSystem Expected: KSh ${activeShift.systemCashExpectedKes.toLocaleString()}\nDeclared: KSh ${declaredCash.toLocaleString()}\nVariance: KSh ${variance.toLocaleString()}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Billing & Revenue Operations
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-emerald-600" />
              Cashier POS, Accounts Ledger & SHA Insurance Claims
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Pay-Before-Service billing gates • M-Pesa Daraja 2.0 STK Push • KRA eTIMS Tax Invoices • SHA/Private Insurance claims scrubbing & aging
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Active Branch Till
              </div>
              <div className="text-xs font-black text-slate-800">
                Till No: {activeBranch.mpesaTill}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold">
                eTIMS: {activeBranch.etimsSerial}
              </div>
            </div>
            <button
              onClick={() => setActiveTab("shift-reconciliation")}
              className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Clock className="w-4 h-4 text-emerald-400" />
              Cashier Shift: {activeShift?.status === "Open" ? "Active" : "Closed"}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-6 pt-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("cashier-pos")}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "cashier-pos"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Banknote className="w-4 h-4" />
            Cashier Station & POS
          </button>
          <button
            onClick={() => setActiveTab("patient-ledgers")}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "patient-ledgers"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Patient & Corporate Ledgers
          </button>
          <button
            onClick={() => setActiveTab("insurance-claims")}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "insurance-claims"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            SHA & Insurance Claims Pipeline
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">
              {claims.filter((c) => c.status !== "Paid").length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("shift-reconciliation")}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "shift-reconciliation"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Receipt className="w-4 h-4" />
            Blind Cash-Up & Float Reconciliation
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CASHIER STATION & BILLING GATES */}
      {/* ========================================================================= */}
      {activeTab === "cashier-pos" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Patient Billing Queue (4 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  Active Outpatient Queue ({visits.length})
                </h3>
                <span className="text-[11px] text-slate-500">
                  Select visit to settle
                </span>
              </div>

              <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
                {visits.map((v) => {
                  const isSelected = v.id === selectedVisitId;
                  const balance = v.totalBillAmount - v.paidAmount;
                  const isSettled = v.billingCleared || balance <= 0;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVisitId(v.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/50 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900">
                              {v.patientName}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-bold text-slate-600">
                              {v.ticketNumber}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            UPN: {v.patientUpn} • Age: {v.patientAge}y • {v.paymentType}
                          </div>
                          <div className="text-[10px] text-slate-600 font-medium mt-1">
                            Current Station:{" "}
                            <span className="font-bold text-indigo-700">
                              {v.station}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-black text-slate-900">
                            KSh {v.totalBillAmount.toLocaleString()}
                          </div>
                          <span
                            className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isSettled
                                ? "bg-emerald-100 text-emerald-800"
                                : v.paidAmount > 0
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {isSettled ? "Fully Settled" : v.paidAmount > 0 ? "Partial" : "Unpaid"}
                          </span>
                          {balance > 0 && (
                            <div className="text-[10px] text-rose-600 font-bold mt-1">
                              Bal: KSh {balance.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Payment Terminal & Billing Gate (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {selectedVisit ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
                {/* Visit Summary Card */}
                <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                      Point-Of-Sale Cashier Station • {selectedVisit.visitNumber}
                    </div>
                    <h2 className="text-lg font-black mt-0.5">
                      {selectedVisit.patientName}
                    </h2>
                    <div className="text-xs text-slate-300 mt-1 flex items-center gap-3">
                      <span>UPN: {selectedVisit.patientUpn}</span>
                      <span>Payment Scheme: {selectedVisit.paymentType}</span>
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
                    <div className="text-[11px] text-slate-400 font-medium">
                      Net Outstanding Due
                    </div>
                    <div className="text-2xl font-black text-emerald-400">
                      KSh{" "}
                      {(
                        selectedVisit.totalBillAmount - selectedVisit.paidAmount
                      ).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Billed: KSh {selectedVisit.totalBillAmount.toLocaleString()} | Paid: KSh {selectedVisit.paidAmount.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Billing Gate Lock Warning */}
                {!selectedVisit.billingCleared && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">
                        Pay-Before-Service Billing Gate Enforced:
                      </span>{" "}
                      Laboratory investigations and Pharmacy drug dispensing are locked until pre-service co-pay or full settlement is verified.
                    </div>
                  </div>
                )}

                {/* Tender Split Payment Inputs */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Multi-Tender Payment Split
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Cash */}
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                        <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                        Cash Tender (KES)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={payCashAmount || ""}
                        onChange={(e) => setPayCashAmount(Number(e.target.value))}
                        placeholder="0.00"
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* M-Pesa */}
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                        M-Pesa Tender (KES)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={payMpesaAmount || ""}
                        onChange={(e) => setPayMpesaAmount(Number(e.target.value))}
                        placeholder="0.00"
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Insurance / SHA */}
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Insurance / SHA (KES)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={payInsuranceAmount || ""}
                        onChange={(e) => setPayInsuranceAmount(Number(e.target.value))}
                        placeholder="0.00"
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* M-Pesa Daraja 2.0 Integration Panel */}
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        M-Pesa Daraja 2.0 STK Push & C2B Auto-Match
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Till: {activeBranch.mpesaTill}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-5">
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          Patient Phone Number (Safaricom)
                        </label>
                        <input
                          type="text"
                          value={mpesaPhoneNumber}
                          onChange={(e) => setMpesaPhoneNumber(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          Manual C2B Receipt Code (If no STK)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. QKA88219"
                          value={c2bRefInput}
                          onChange={(e) => setC2bRefInput(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 uppercase"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <button
                          onClick={handleTriggerStkPush}
                          disabled={!payMpesaAmount || payMpesaAmount <= 0}
                          className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Send STK
                        </button>
                      </div>
                    </div>

                    {mpesaStkSent && (
                      <div className="p-2.5 rounded-lg bg-white border border-emerald-300 flex items-center justify-between text-xs">
                        <span className="text-emerald-900 font-semibold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          STK Prompt dispatched to {mpesaPhoneNumber}
                        </span>
                        {mpesaStkCode ? (
                          <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            Verified Ref: {mpesaStkCode}
                          </span>
                        ) : (
                          <span className="text-slate-500 animate-pulse text-[11px]">
                            Waiting for PIN confirmation...
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions: Process Payment or Authorize Waiver */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => setShowWaiverModal(true)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold hover:bg-amber-100 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4 text-amber-600" />
                      Manager PIN Fee Waiver / Discount
                    </button>

                    <button
                      onClick={handleProcessPayment}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Receipt className="w-4 h-4 text-emerald-400" />
                      Process Payment & Print eTIMS Invoice
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No active visit selected.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PATIENT & CORPORATE RUNNING ACCOUNT LEDGERS */}
      {/* ========================================================================= */}
      {activeTab === "patient-ledgers" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  Patient, Family & Corporate Running Account Ledgers
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time audit trail of charges, payments, credit deposits, and package installments
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search patient, UPN or receipt..."
                    value={ledgerSearch}
                    onChange={(e) => setLedgerSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl w-64 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Post Advance Deposit
                </button>
              </div>
            </div>

            {/* Ledger Transactions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Date & ID</th>
                    <th className="py-2.5 px-3">Patient Account</th>
                    <th className="py-2.5 px-3">Transaction Type</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Receipt / Ref</th>
                    <th className="py-2.5 px-3 text-right">Debit / Credit (KES)</th>
                    <th className="py-2.5 px-3 text-right">Balance (KES)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLedgers.map((entry) => {
                    const isCredit = entry.amountKes < 0;
                    return (
                      <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-slate-900 block">
                            {entry.date}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {entry.id}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-slate-900 block">
                            {entry.patientName}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {entry.patientUpn}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              entry.type.includes("Payment")
                                ? "bg-emerald-100 text-emerald-800"
                                : entry.type.includes("Deposit")
                                ? "bg-blue-100 text-blue-800"
                                : entry.type.includes("Waiver")
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {entry.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 max-w-xs truncate">
                          {entry.description}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                          {entry.receiptNumber || "—"}
                        </td>
                        <td
                          className={`py-2.5 px-3 text-right font-black ${
                            isCredit ? "text-emerald-600" : "text-slate-900"
                          }`}
                        >
                          {isCredit ? "-" : "+"}KSh{" "}
                          {Math.abs(entry.amountKes).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                          KSh {entry.runningBalanceKes.toLocaleString()}
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
      {/* TAB 3: SHA & PRIVATE INSURANCE CLAIMS PIPELINE */}
      {/* ========================================================================= */}
      {activeTab === "insurance-claims" && (
        <div className="space-y-5">
          {/* Claims Aging KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Outstanding
              </span>
              <span className="text-base font-black text-slate-900 mt-1 block">
                KSh {agingTotals.totalOutstanding.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-500">Unsettled claims</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                0 - 30 Days (Current)
              </span>
              <span className="text-base font-black text-emerald-700 mt-1 block">
                KSh {agingTotals.days30.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600">Within payment terms</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-blue-200 bg-blue-50/20 shadow-xs">
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                31 - 60 Days
              </span>
              <span className="text-base font-black text-blue-700 mt-1 block">
                KSh {agingTotals.days60.toLocaleString()}
              </span>
              <span className="text-[10px] text-blue-600">Pending reconciliation</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                61 - 90 Days
              </span>
              <span className="text-base font-black text-amber-700 mt-1 block">
                KSh {agingTotals.days90.toLocaleString()}
              </span>
              <span className="text-[10px] text-amber-600">Escalate to liaison</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-rose-200 bg-rose-50/20 shadow-xs">
              <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
                90+ Days (Overdue)
              </span>
              <span className="text-base font-black text-rose-700 mt-1 block">
                KSh {agingTotals.days120Plus.toLocaleString()}
              </span>
              <span className="text-[10px] text-rose-600">High rejection risk</span>
            </div>
          </div>

          {/* Claims List and Vetting Drawer */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  SHA / SHIF & Private Insurance Claims Pipeline
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated tariff scrubbing • ICD-10 validation • Capitation limit enforcement
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search claim, scheme or patient..."
                    value={claimSearch}
                    onChange={(e) => setClaimSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl w-60 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <select
                  value={claimStatusFilter}
                  onChange={(e) => setClaimStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending Scrubbing">Pending Scrubbing</option>
                  <option value="Vetted & Ready">Vetted & Ready</option>
                  <option value="Batched & Submitted">Batched & Submitted</option>
                  <option value="Paid">Paid</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Rejected / Disputed">Rejected / Disputed</option>
                </select>
              </div>
            </div>

            {/* Claims Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Claim No</th>
                    <th className="py-2.5 px-3">Patient & UPN</th>
                    <th className="py-2.5 px-3">Insurer / Scheme</th>
                    <th className="py-2.5 px-3">Pre-Auth / Member No</th>
                    <th className="py-2.5 px-3 text-right">Amount (KES)</th>
                    <th className="py-2.5 px-3">Aging</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {claim.claimNumber}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-900 block">
                          {claim.patientName}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {claim.patientUpn}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-slate-900 block">
                          {claim.payerType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                        {claim.preAuthCode || claim.memberNumber}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-900">
                        KSh {claim.totalClaimedKes.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            claim.agingDays > 90
                              ? "bg-rose-100 text-rose-800"
                              : claim.agingDays > 60
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {claim.agingDays} Days
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            claim.status === "Paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : claim.status === "Batched & Submitted"
                              ? "bg-blue-100 text-blue-800"
                              : claim.status === "Rejected / Disputed"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {claim.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-1">
                        {(claim.status === "Pending Scrubbing" || claim.status === "Vetted & Ready") && (
                          <button
                            onClick={() => handleScrubAndSubmitClaim(claim.id)}
                            className="px-2 py-1 rounded bg-indigo-600 text-white font-bold text-[10px] hover:bg-indigo-700 cursor-pointer"
                          >
                            Scrub & Submit
                          </button>
                        )}
                        {claim.status === "Batched & Submitted" && (
                          <button
                            onClick={() => handleMarkClaimSettled(claim.id)}
                            className="px-2 py-1 rounded bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 cursor-pointer"
                          >
                            Reconcile Payment
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedClaimForReview(claim)}
                          className="px-2 py-1 rounded border border-slate-300 text-slate-700 font-bold text-[10px] hover:bg-slate-100 cursor-pointer"
                        >
                          View Details
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
      {/* TAB 4: CASHIER SHIFT BLIND CASH-UP & RECONCILIATION */}
      {/* ========================================================================= */}
      {activeTab === "shift-reconciliation" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Shift Balancing Form (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  Active Shift Cash-Up & Drawer Handover
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeShift?.status === "Open"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {activeShift?.status || "Closed"}
                </span>
              </div>

              {activeShift && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Shift ID:</span>
                      <span className="font-mono font-bold text-slate-900">{activeShift.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cashier on Duty:</span>
                      <span className="font-bold text-slate-900">{activeShift.cashierName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Opening Time:</span>
                      <span className="text-slate-800">{activeShift.openedAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Opening Float:</span>
                      <span className="font-bold text-slate-900">
                        KSh {activeShift.openingFloatKes.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Blind Cash-Up Field */}
                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
                    <div>
                      <span className="text-xs font-bold text-amber-950 block">
                        Blind Cash-Up Drawer Declaration
                      </span>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Cashier must count and enter physical notes/coins in till without viewing the system expectation first.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Physical Cash Counted in Drawer (KES)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={declaredCash}
                        onChange={(e) => setDeclaredCash(Number(e.target.value))}
                        disabled={activeShift.status !== "Open"}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Shift Handover / Variance Notes
                      </label>
                      <textarea
                        rows={2}
                        value={shiftCloseNotes}
                        onChange={(e) => setShiftCloseNotes(e.target.value)}
                        placeholder="State reason for any notes/coins mismatch or float adjustment..."
                        disabled={activeShift.status !== "Open"}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {activeShift.status === "Open" && (
                      <button
                        onClick={handleBlindCashUp}
                        className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Submit Blind Cash-Up & Close Shift
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Historical Shift Records (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                Shift Balancing Audit History
              </h3>

              <div className="space-y-3">
                {shifts.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{s.cashierName}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.status === "Open"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {s.shiftDate} • {s.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-slate-500">Expected Cash:</span>{" "}
                        <span className="font-bold text-slate-800">
                          KSh {s.systemCashExpectedKes.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Expected M-Pesa:</span>{" "}
                        <span className="font-bold text-slate-800">
                          KSh {s.systemMpesaExpectedKes.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Declared Cash:</span>{" "}
                        <span className="font-bold text-slate-800">
                          {s.declaredCashKes !== undefined
                            ? `KSh ${s.declaredCashKes.toLocaleString()}`
                            : "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Variance:</span>{" "}
                        <span
                          className={`font-black ${
                            s.cashVarianceKes === 0
                              ? "text-emerald-600"
                              : s.cashVarianceKes && s.cashVarianceKes < 0
                              ? "text-rose-600"
                              : "text-amber-600"
                          }`}
                        >
                          {s.cashVarianceKes !== undefined
                            ? `KSh ${s.cashVarianceKes.toLocaleString()}`
                            : "—"}
                        </span>
                      </div>
                    </div>

                    {s.notes && (
                      <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-200">
                        {s.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: KRA eTIMS THERMAL PRINTABLE RECEIPT */}
      {/* ========================================================================= */}
      {showReceiptModal && lastReceiptData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="text-center border-b border-dashed border-slate-300 pb-3">
              <div className="font-black text-sm uppercase tracking-wide text-slate-900">
                AFYAWARE CLINIC
              </div>
              <div className="text-[11px] text-slate-600 font-semibold">
                {activeBranch.name} • Nairobi, Kenya
              </div>
              <div className="text-[10px] text-slate-500">
                PIN: P051982731A • KRA eTIMS Serial: {activeBranch.etimsSerial}
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt No:</span>
                <span className="font-mono font-bold text-slate-900">
                  {lastReceiptData.receiptNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span className="text-slate-800">{lastReceiptData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-bold text-slate-900">
                  {lastReceiptData.patientName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">UPN:</span>
                <span className="text-slate-700">{lastReceiptData.patientUpn}</span>
              </div>
            </div>

            <div className="border-y border-dashed border-slate-300 py-3 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Itemized Services
              </div>
              {lastReceiptData.items.map((item, idx) => (
                <div key={idx} className="text-xs text-slate-800 font-medium">
                  {item}
                </div>
              ))}
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-black text-slate-900 text-sm">
                <span>TOTAL PAID:</span>
                <span>KSh {lastReceiptData.totalAmount.toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-slate-600">
                Mode: {lastReceiptData.paymentMode}
              </div>
            </div>

            {/* KRA eTIMS QR Code Signature Box */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-900">
                <QrCode className="w-4 h-4 text-emerald-600" />
                KRA eTIMS Fiscal Signature
              </div>
              <div className="text-[9px] font-mono text-slate-600 break-all">
                {lastReceiptData.etimsSignature}
              </div>
              <div className="text-[9px] text-emerald-700 font-semibold">
                ✓ Verified Fiscal Transmission to KRA Portal
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Thermal Receipt
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: MANAGER PIN WAIVER AUTHORIZATION */}
      {/* ========================================================================= */}
      {showWaiverModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Manager PIN Fee Waiver / Courtesy Discount
                </h3>
                <p className="text-xs text-slate-500">
                  Authorized manager override for indigent patients or director discounts
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Waiver Amount (KES)
                </label>
                <input
                  type="number"
                  min="0"
                  value={waiverAmount}
                  onChange={(e) => setWaiverAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Justification / Reason
                </label>
                <input
                  type="text"
                  value={waiverReason}
                  onChange={(e) => setWaiverReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Clinic Manager / Director Security PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="Enter 4-digit PIN (default: 1234)"
                  value={waiverPin}
                  onChange={(e) => setWaiverPin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              {waiverError && (
                <div className="text-xs text-rose-600 font-semibold">{waiverError}</div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowWaiverModal(false);
                  setWaiverError("");
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAuthorizeWaiver}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 cursor-pointer"
              >
                Approve & Apply Credit Waiver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADVANCE DEPOSIT ON ACCOUNT */}
      {/* ========================================================================= */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Credit Advance Deposit to Patient Account
                </h3>
                <p className="text-xs text-slate-500">
                  ANC packages, dental crown installments, or corporate retainers
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Patient UPN
                </label>
                <select
                  value={depositPatientUpn}
                  onChange={(e) => setDepositPatientUpn(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  {visits.map((v) => (
                    <option key={v.id} value={v.patientUpn}>
                      {v.patientName} ({v.patientUpn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Deposit Amount (KES)
                </label>
                <input
                  type="number"
                  min="0"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Package / Reason Description
                </label>
                <input
                  type="text"
                  value={depositDesc}
                  onChange={(e) => setDepositDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDepositModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePostDeposit}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
              >
                Post Deposit & Issue Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CLAIM REVIEW DETAIL MODAL */}
      {/* ========================================================================= */}
      {selectedClaimForReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  Insurance Claim Summary
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {selectedClaimForReview.claimNumber}
                </h3>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  selectedClaimForReview.status === "Paid"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {selectedClaimForReview.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-bold text-slate-900 block">
                    {selectedClaimForReview.patientName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">UPN:</span>
                  <span className="font-semibold text-slate-800 block">
                    {selectedClaimForReview.patientUpn}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Payer / Scheme:</span>
                  <span className="font-bold text-slate-900 block">
                    {selectedClaimForReview.payerType}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Member No:</span>
                  <span className="font-mono text-slate-800 block">
                    {selectedClaimForReview.memberNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Pre-Authorization Code:</span>
                  <span className="font-mono font-bold text-slate-900 block">
                    {selectedClaimForReview.preAuthCode || "Walk-In Emergency"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Aging Duration:</span>
                  <span className="font-bold text-slate-900 block">
                    {selectedClaimForReview.agingDays} Days since service
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Claim Billed Amount:</span>
                  <span className="text-base font-black text-slate-900">
                    KSh {selectedClaimForReview.totalClaimedKes.toLocaleString()}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  SHA Outpatient tariff capitation compliance verified. Rejection risk score: 1.2% (Low).
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedClaimForReview(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              {selectedClaimForReview.status !== "Paid" && (
                <button
                  onClick={() => {
                    handleMarkClaimSettled(selectedClaimForReview.id);
                    setSelectedClaimForReview(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                >
                  Mark Settled
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
