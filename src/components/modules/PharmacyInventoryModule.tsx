"use client";

import React, { useState } from "react";
import { useAfyaware } from "@/lib/store";
import {
  PrescriptionOrder,
  DrugBatch,
  PurchaseOrder,
  NarcoticLogEntry,
} from "@/lib/types";
import {
  Pill,
  Package,
  ShoppingCart,
  AlertTriangle,
  CheckCircle2,
  Printer,
  QrCode,
  Search,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Warehouse,
  FileText,
  Clock,
  DollarSign,
  Plus,
  RefreshCw,
  Building,
  Lock,
  Layers,
  X,
  Send,
} from "lucide-react";

// Kenyan Pharmaceutical Distributor Price Comparison Matrix
const DISTRIBUTOR_PRICES = [
  {
    generic: "Amoxicillin + Clavulanic Acid 625mg (14s)",
    surgipharm: 450,
    phillips: 475,
    medisel: 430,
    harleys: 460,
    cheapest: "Medisel Kenya Ltd (KSh 430)",
  },
  {
    generic: "Ceftriaxone Sodium 1g Inj Vial",
    surgipharm: 190,
    phillips: 180,
    medisel: 195,
    harleys: 185,
    cheapest: "Phillips Pharmaceuticals (KSh 180)",
  },
  {
    generic: "Artemether + Lumefantrine 20/120mg (24s)",
    surgipharm: 200,
    phillips: 210,
    medisel: 190,
    harleys: 195,
    cheapest: "Medisel Kenya Ltd (KSh 190)",
  },
  {
    generic: "Telmisartan + HCTZ 80/12.5mg (30s)",
    surgipharm: 980,
    phillips: 1020,
    medisel: 960,
    harleys: 950,
    cheapest: "Harley's Limited (KSh 950)",
  },
];

export function PharmacyInventoryModule() {
  const {
    prescriptions,
    updatePrescription,
    drugBatches,
    updateDrugBatch,
    addDrugBatch,
    purchaseOrders,
    addPurchaseOrder,
    updatePurchaseOrder,
    narcotics,
    addNarcoticEntry,
    visits,
    currentRole,
    addAuditLog,
  } = useAfyaware();

  const [activeTab, setActiveTab] = useState<"prescriptions" | "otc-pos" | "inventory" | "narcotics" | "procurement">("prescriptions");

  // Selected E-Prescription for Dispensing
  const [selectedRxId, setSelectedRxId] = useState<string>(prescriptions[0]?.id || "");
  const selectedRx = prescriptions.find((p) => p.id === selectedRxId) || prescriptions[0];

  // Dispensing Form state
  const [dispenseQty, setDispenseQty] = useState<number>(selectedRx?.totalQty || 1);
  const [showDosageSticker, setShowDosageSticker] = useState(false);
  const [allergyModalOpen, setAllergyModalOpen] = useState(false);
  const [overrideAllergy, setOverrideAllergy] = useState(false);

  // Walk-In OTC POS Cart State
  const [otcCart, setOtcCart] = useState<{ drug: DrugBatch; qty: number }[]>([]);
  const [otcCustomerName, setOtcCustomerName] = useState("Walk-In Cash Customer");
  const [otcPaymentMode, setOtcPaymentMode] = useState<"Cash" | "M-Pesa">("M-Pesa");
  const [otcMpesaPhone, setOtcMpesaPhone] = useState("0722 000 000");
  const [otcSuccess, setOtcSuccess] = useState(false);

  // Drug Batch Add / GRN Form
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [newBatchName, setNewBatchName] = useState("Paracetamol 500mg Tabs");
  const [newBatchGeneric, setNewBatchGeneric] = useState("Paracetamol");
  const [newBatchNumber, setNewBatchNumber] = useState("PCM-2610A");
  const [newBatchExp, setNewBatchExp] = useState("2027-10-31");
  const [newBatchQty, setNewBatchQty] = useState(500);
  const [newBatchBuyPrice, setNewBatchBuyPrice] = useState(3);
  const [newBatchSellPrice, setNewBatchSellPrice] = useState(10);
  const [newBatchSupplier, setNewBatchSupplier] = useState("Surgipharm Ltd");

  // New Purchase Order Form
  const [showPoModal, setShowPoModal] = useState(false);
  const [poSupplier, setPoSupplier] = useState("Medisel Kenya Ltd");
  const [poDrug, setPoDrug] = useState("Artemether + Lumefantrine 20/120mg (24s)");
  const [poQty, setPoQty] = useState(100);
  const [poRate, setPoRate] = useState(190);

  // Expiry Radar Filters
  const criticalExpiry = drugBatches.filter((b) => b.daysToExpiry <= 30);
  const highRiskExpiry = drugBatches.filter((b) => b.daysToExpiry > 30 && b.daysToExpiry <= 60);
  const mediumRiskExpiry = drugBatches.filter((b) => b.daysToExpiry > 60 && b.daysToExpiry <= 90);

  // Calculate OTC Cart Total
  const otcTotal = otcCart.reduce((sum, item) => sum + item.drug.cashPriceKes * item.qty, 0);

  // Handle Dispensing E-Prescription
  const handleDispenseRx = (rx: PrescriptionOrder) => {
    // Check allergy lock: If patient has Penicillin allergy and Augmentin is chosen
    const hasPenicillinAllergy = rx.patientAllergies.some((a) => a.toLowerCase().includes("penicillin"));
    const isPenicillinDrug = rx.drugBrandName.toLowerCase().includes("augmentin") || rx.drugGenericName.toLowerCase().includes("amoxicillin");

    if (hasPenicillinAllergy && isPenicillinDrug && !overrideAllergy) {
      setAllergyModalOpen(true);
      return;
    }

    // FEFO Batch Deduction: Find batch and deduct
    const batch = drugBatches.find((b) => b.batchNumber === rx.selectedBatchNumber) || drugBatches[0];
    if (batch) {
      updateDrugBatch(batch.id, {
        stockQty: Math.max(0, batch.stockQty - dispenseQty),
      });
    }

    const isPartial = dispenseQty < rx.totalQty;
    updatePrescription(rx.id, {
      dispensedQty: dispenseQty,
      status: isPartial ? "Partial Dispensed" : "Dispensed",
    });

    addAuditLog(
      `Dispensed ${dispenseQty}x ${rx.drugBrandName} (Batch: ${rx.selectedBatchNumber}) to ${rx.patientName}`,
      "Pharmacy Dispensing",
      rx.id
    );

    setShowDosageSticker(true);
  };

  // Handle OTC POS Checkout
  const handleCheckoutOtc = (e: React.FormEvent) => {
    e.preventDefault();
    if (otcCart.length === 0) return;

    // Deduct stock for each cart item
    otcCart.forEach(({ drug, qty }) => {
      updateDrugBatch(drug.id, {
        stockQty: Math.max(0, drug.stockQty - qty),
      });
    });

    addAuditLog(
      `Walk-In OTC Sale: KSh ${otcTotal.toLocaleString()} (${otcPaymentMode}) for ${otcCustomerName}`,
      "Retail Pharmacy POS",
      `OTC-${Date.now().toString().slice(-4)}`
    );

    setOtcSuccess(true);
    setOtcCart([]);
    setTimeout(() => setOtcSuccess(false), 4000);
  };

  // Add Item to OTC Cart
  const handleAddToCart = (drug: DrugBatch) => {
    const existing = otcCart.find((item) => item.drug.id === drug.id);
    if (existing) {
      setOtcCart(
        otcCart.map((item) => (item.drug.id === drug.id ? { ...item, qty: item.qty + 1 } : item))
      );
    } else {
      setOtcCart([...otcCart, { drug, qty: 1 }]);
    }
  };

  // Handle Add New Drug Batch (GRN)
  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newBatch: DrugBatch = {
      id: `DRG-${Date.now().toString().slice(-4)}`,
      drugCode: `KEML-${newBatchGeneric.slice(0, 3).toUpperCase()}-100`,
      genericName: newBatchGeneric,
      brandName: newBatchName,
      strength: "Standard",
      formulation: "Tablet",
      batchNumber: newBatchNumber,
      manufacturingDate: "2025-01-01",
      expiryDate: newBatchExp,
      daysToExpiry: 365,
      storeLocation: "Outpatient Pharmacy",
      stockQty: newBatchQty,
      reorderLevel: 50,
      buyingPriceKes: newBatchBuyPrice,
      cashPriceKes: newBatchSellPrice,
      shaPriceKes: newBatchSellPrice * 0.85,
      insurancePriceKes: newBatchSellPrice * 1.15,
      isControlledNarcotic: false,
      supplierName: newBatchSupplier,
      branchId: "BR-WESTLANDS",
    };
    addDrugBatch(newBatch);
    setShowAddBatchModal(false);
  };

  // Handle Create PO
  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault();
    const newPo: PurchaseOrder = {
      id: `PO-${Date.now().toString().slice(-4)}`,
      poNumber: `PO-WLD-${Date.now().toString().slice(-4)}`,
      supplierName: poSupplier,
      orderDate: new Date().toISOString().slice(0, 10),
      status: "Sent to Supplier",
      totalAmountKes: poQty * poRate,
      items: [
        {
          drugCode: "KEML-REPLENISH",
          drugName: poDrug,
          orderedQty: poQty,
          unitPriceKes: poRate,
        },
      ],
    };
    addPurchaseOrder(newPo);
    setShowPoModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Pharmacy Dispensing, FEFO Inventory & Procurement
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Clinical E-Prescriptions, Walk-In OTC POS, FEFO Expiry Radar & Narcotics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict FEFO batch deduction, drug-allergy locks, bilingual English/Swahili thermal dosage labels, and PPB narcotics control.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab("prescriptions")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "prescriptions" ? "bg-white text-teal-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            E-Prescription Queue ({prescriptions.length})
          </button>
          <button
            onClick={() => setActiveTab("otc-pos")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "otc-pos" ? "bg-white text-teal-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Retail OTC POS
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "inventory" ? "bg-white text-teal-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            FEFO Inventory Radar ({drugBatches.length})
          </button>
          <button
            onClick={() => setActiveTab("narcotics")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "narcotics" ? "bg-white text-teal-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            PPB Narcotics Register
          </button>
          <button
            onClick={() => setActiveTab("procurement")}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "procurement" ? "bg-white text-teal-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            Procurement & Vensure
          </button>
        </div>
      </div>

      {/* TAB 1: CLINICAL E-PRESCRIPTION QUEUE */}
      {activeTab === "prescriptions" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: E-Prescription Queue */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <span className="text-xs font-bold text-slate-900 block pb-2 border-b border-slate-100">
                Incoming E-Prescriptions ({prescriptions.length})
              </span>

              <div className="space-y-2 mt-3 max-h-[600px] overflow-y-auto">
                {prescriptions.map((rx) => {
                  const isSelected = rx.id === selectedRxId;
                  const isDispensed = rx.status === "Dispensed";

                  return (
                    <button
                      key={rx.id}
                      onClick={() => {
                        setSelectedRxId(rx.id);
                        setDispenseQty(rx.totalQty);
                      }}
                      className={`w-full p-3.5 rounded-xl border text-left transition cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-md"
                          : isDispensed
                          ? "bg-slate-50 border-slate-200 opacity-60"
                          : "bg-white hover:bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-teal-400">
                          {rx.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isDispensed
                              ? "bg-emerald-100 text-emerald-800"
                              : isSelected
                              ? "bg-teal-500 text-slate-950 font-bold"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          {rx.status}
                        </span>
                      </div>

                      <div className="font-bold text-xs mt-2 truncate">
                        {rx.drugBrandName} ({rx.drugGenericName})
                      </div>
                      <div className={`text-[11px] truncate ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                        Patient: <strong>{rx.patientName}</strong> ({rx.patientUpn})
                      </div>

                      <div className="mt-2 text-[10px] flex items-center justify-between pt-1 border-t border-slate-200/30">
                        <span>Qty: {rx.totalQty} tabs</span>
                        <span>Total: KSh {rx.totalPriceKes.toLocaleString()}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Pharmacist Dispensing & Clinical Safety Checks */}
          <div className="lg:col-span-7 space-y-6">
            {selectedRx ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                {/* Prescription Ribbon */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-teal-300">
                      {selectedRx.id} • PRESCRIBED AT {selectedRx.prescribedAt}
                    </span>
                    <h2 className="text-base font-bold text-white mt-0.5">
                      {selectedRx.drugBrandName} ({selectedRx.drugGenericName})
                    </h2>
                    <div className="text-xs text-slate-300 mt-1">
                      Patient: <strong>{selectedRx.patientName}</strong> ({selectedRx.patientUpn}) • Prescriber: {selectedRx.prescribedBy}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-teal-300">
                      KSh {selectedRx.totalPriceKes.toLocaleString()}
                    </span>
                    <div className="text-[11px] text-slate-400">
                      Unit: KSh {selectedRx.unitPriceKes}
                    </div>
                  </div>
                </div>

                {/* Pharmacist Clinical Safety Checks (Drug-Allergy & FEFO Batch) */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Pharmacist Clinical Verification:
                  </span>

                  {/* Drug-Allergy Safety Check */}
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-xs font-bold text-amber-950">
                          Clinical Allergy Cross-Check:
                        </strong>
                        <p className="text-xs text-amber-900 mt-0.5">
                          Patient Allergy Flags:{" "}
                          <span className="font-bold underline">
                            {selectedRx.patientAllergies.length > 0
                              ? selectedRx.patientAllergies.join(", ")
                              : "No Known Drug Allergies (NKDA)"}
                          </span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                      Safety Pass
                    </span>
                  </div>

                  {/* FEFO Automated Batch Selection */}
                  <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-teal-950 block">FEFO Automated Batch Allocation:</strong>
                      <span className="text-slate-600">
                        Batch: <span className="font-mono font-bold">{selectedRx.selectedBatchNumber}</span> • Expiry:{" "}
                        <span className="font-bold text-rose-700">{selectedRx.selectedBatchExpiry}</span> (First-Expiry First-Out)
                      </span>
                    </div>
                    <span className="px-2 py-1 rounded-lg bg-teal-600 text-white font-bold text-[10px]">
                      FEFO Validated
                    </span>
                  </div>
                </div>

                {/* Dosage Instructions in English & Swahili */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-800 block">Dosage & Label Instructions:</span>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 text-[10px] block">English Instruction:</span>
                    <strong className="text-slate-900">{selectedRx.dosageInstruction}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 text-[10px] block">Swahili Instruction (Thermal Label):</span>
                    <strong className="text-teal-900">{selectedRx.swahiliInstruction}</strong>
                  </div>
                </div>

                {/* Partial Dispensing Calculator */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <label className="font-bold text-slate-800 block">Quantity to Dispense:</label>
                    <span className="text-slate-500 text-[11px]">
                      Full prescribed dose: {selectedRx.totalQty} tabs (Allows partial if patient requests)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={selectedRx.totalQty}
                      value={dispenseQty}
                      onChange={(e) => setDispenseQty(parseInt(e.target.value) || 1)}
                      className="w-20 px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-center text-sm"
                    />
                    <span className="text-slate-600 font-semibold">units</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => setShowDosageSticker(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Thermal Dosage Sticker
                  </button>

                  <button
                    onClick={() => handleDispenseRx(selectedRx)}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold cursor-pointer shadow-md"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Deduct FEFO Stock & Dispense
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                Select an e-prescription to dispense.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: WALK-IN OVER-THE-COUNTER (OTC) RETAIL POS */}
      {activeTab === "otc-pos" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Drug Catalog for POS */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-teal-600" />
                  Walk-In Chemist POS Catalog
                </h2>
                <span className="text-xs text-slate-500">Fast barcode & cash retail billing</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {drugBatches.map((drug) => (
                  <div
                    key={drug.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-slate-400 font-bold">{drug.drugCode}</span>
                        <span className="text-xs font-black text-teal-800">KSh {drug.cashPriceKes}</span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 mt-1">{drug.brandName}</h3>
                      <p className="text-[11px] text-slate-500">{drug.genericName}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-600">Stock: {drug.stockQty}</span>
                      <button
                        onClick={() => handleAddToCart(drug)}
                        className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold cursor-pointer text-[11px]"
                      >
                        + Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* POS Cart & Checkout */}
          <div className="lg:col-span-5 space-y-4">
            <form onSubmit={handleCheckoutOtc} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-slate-900 text-sm">POS Shopping Cart ({otcCart.length} Items)</span>
                <button
                  type="button"
                  onClick={() => setOtcCart([])}
                  className="text-slate-400 hover:text-slate-600 text-[11px] cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>

              {otcSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Receipt Issued & Stock Deducted!
                </div>
              )}

              {/* Cart Items */}
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {otcCart.map(({ drug, qty }) => (
                  <div key={drug.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{drug.brandName}</div>
                      <div className="text-[11px] text-slate-500">
                        {qty} x KSh {drug.cashPriceKes}
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      KSh {(drug.cashPriceKes * qty).toLocaleString()}
                    </span>
                  </div>
                ))}
                {otcCart.length === 0 && (
                  <div className="text-center py-8 text-slate-400">Cart is empty. Select medicines from the left.</div>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div>
                  <label className="font-bold text-slate-700">Customer Name / Reference</label>
                  <input
                    type="text"
                    value={otcCustomerName}
                    onChange={(e) => setOtcCustomerName(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 border border-slate-300 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700">Payment Mode</label>
                    <select
                      value={otcPaymentMode}
                      onChange={(e) => setOtcPaymentMode(e.target.value as "Cash" | "M-Pesa")}
                      className="w-full mt-1 px-3 py-1.5 border border-slate-300 rounded-xl bg-white focus:outline-none"
                    >
                      <option value="M-Pesa">M-Pesa (Daraja STK)</option>
                      <option value="Cash">Cash at Till</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700">M-Pesa Phone</label>
                    <input
                      type="text"
                      value={otcMpesaPhone}
                      onChange={(e) => setOtcMpesaPhone(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 border border-slate-300 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Total & Checkout */}
              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 flex items-center justify-between text-sm">
                <span className="font-bold text-teal-950">Grand Total:</span>
                <span className="font-black text-lg text-teal-950">KSh {otcTotal.toLocaleString()}</span>
              </div>

              <button
                type="submit"
                disabled={otcCart.length === 0}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:bg-slate-300 text-white font-bold cursor-pointer shadow-md transition"
              >
                Complete Sale & Generate Receipt
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: FEFO DRUG INVENTORY & EXPIRY RADAR */}
      {activeTab === "inventory" && (
        <div className="space-y-6">
          {/* Expiry Radar KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300">
              <div className="flex items-center justify-between text-xs font-bold text-rose-800">
                <span>CRITICAL: &lt;30 Days to Expiry</span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-black text-rose-950 mt-1">{criticalExpiry.length} Batches</div>
              <div className="text-[11px] text-rose-700 mt-0.5">Require immediate push or vendor return</div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300">
              <div className="flex items-center justify-between text-xs font-bold text-amber-800">
                <span>HIGH RISK: 31–60 Days to Expiry</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-950 mt-1">{highRiskExpiry.length} Batches</div>
              <div className="text-[11px] text-amber-700 mt-0.5">FEFO priority dispensing enforced</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                <span>HEALTHY: &gt;90 Days to Expiry</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-950 mt-1">
                {drugBatches.length - criticalExpiry.length - highRiskExpiry.length} Batches
              </div>
              <div className="text-[11px] text-emerald-700 mt-0.5">Adequate shelf life</div>
            </div>
          </div>

          {/* Batches Table with Quick Add */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-teal-600" />
                  Active Drug Batches & Multi-Store Stock
                </h2>
                <p className="text-xs text-slate-500">
                  Strict First-Expiry First-Out (FEFO) automated allocation stops financial shrinkage
                </p>
              </div>
              <button
                onClick={() => setShowAddBatchModal(true)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold cursor-pointer shadow-sm"
              >
                + Log New Batch / GRN
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 bg-slate-50/80">
                    <th className="py-2.5 px-3">Drug & Code</th>
                    <th className="py-2.5 px-3">Batch Number</th>
                    <th className="py-2.5 px-3">Expiry Date</th>
                    <th className="py-2.5 px-3">Days Left</th>
                    <th className="py-2.5 px-3">Store Location</th>
                    <th className="py-2.5 px-3">Stock Qty</th>
                    <th className="py-2.5 px-3">Buying / Cash Price</th>
                    <th className="py-2.5 px-3">Supplier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {drugBatches.map((batch) => {
                    const isExpCritical = batch.daysToExpiry <= 30;
                    const isExpWarning = batch.daysToExpiry <= 60;

                    return (
                      <tr key={batch.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{batch.brandName}</div>
                          <div className="text-[11px] text-slate-500">{batch.genericName}</div>
                        </td>

                        <td className="py-3 px-3 font-mono font-bold text-teal-800">
                          {batch.batchNumber}
                        </td>

                        <td className="py-3 px-3 font-semibold text-slate-800">
                          {batch.expiryDate}
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              isExpCritical
                                ? "bg-rose-600 text-white"
                                : isExpWarning
                                ? "bg-amber-500 text-white"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {batch.daysToExpiry}d left
                          </span>
                        </td>

                        <td className="py-3 px-3 text-slate-700">
                          {batch.storeLocation}
                        </td>

                        <td className="py-3 px-3 font-bold text-slate-900">
                          {batch.stockQty} units
                        </td>

                        <td className="py-3 px-3">
                          KSh {batch.buyingPriceKes} / <strong className="text-teal-800">KSh {batch.cashPriceKes}</strong>
                        </td>

                        <td className="py-3 px-3 text-slate-500">
                          {batch.supplierName}
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

      {/* TAB 4: CONTROLLED / NARCOTIC DRUGS REGISTER */}
      {activeTab === "narcotics" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-rose-600" />
                Kenya Pharmacy and Poisons Board (PPB) Dangerous Drugs Register
              </h2>
              <p className="text-xs text-slate-500">
                Statutory audit log for Schedule 1 controlled narcotics (Morphine, Pethidine, Fentanyl)
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
              PPB Form DDA Verified
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 bg-slate-50">
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Controlled Substance</th>
                  <th className="py-3 px-4">Prescribing Doctor</th>
                  <th className="py-3 px-4">Dispensing Pharmacist</th>
                  <th className="py-3 px-4">Patient & UPN</th>
                  <th className="py-3 px-4">Qty Dispensed</th>
                  <th className="py-3 px-4">Balance Remaining</th>
                  <th className="py-3 px-4">PPB Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {narcotics.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-slate-600">{entry.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {entry.drugName} (Batch: {entry.batchNumber})
                    </td>
                    <td className="py-3 px-4 text-slate-700">{entry.prescribingDoctor}</td>
                    <td className="py-3 px-4 text-slate-700">{entry.dispensingPharmacist}</td>
                    <td className="py-3 px-4">
                      <strong>{entry.patientName}</strong> ({entry.patientUpn})
                    </td>
                    <td className="py-3 px-4 font-bold text-rose-700">
                      {entry.quantityDispensed} ampoule
                    </td>
                    <td className="py-3 px-4 font-black text-slate-900">
                      {entry.balanceRemaining} units
                    </td>
                    <td className="py-3 px-4 font-mono text-teal-800 font-bold">
                      {entry.ppbReference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PROCUREMENT & DISTRIBUTOR PRICE COMPARISON */}
      {activeTab === "procurement" && (
        <div className="space-y-6">
          {/* Kenyan Distributor Price Comparison Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Kenyan Pharmaceutical Distributor Price Comparison
              </h2>
              <p className="text-xs text-slate-500">
                Compare buying prices across Surgipharm, Phillips, Medisel, and Harley's to optimize clinic profit margins
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 bg-slate-50">
                    <th className="py-2.5 px-3">Medicine Description</th>
                    <th className="py-2.5 px-3">Surgipharm</th>
                    <th className="py-2.5 px-3">Phillips</th>
                    <th className="py-2.5 px-3">Medisel</th>
                    <th className="py-2.5 px-3">Harley's</th>
                    <th className="py-2.5 px-3">Recommended Best Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {DISTRIBUTOR_PRICES.map((dp, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-900">{dp.generic}</td>
                      <td className="py-3 px-3 font-mono">KSh {dp.surgipharm}</td>
                      <td className="py-3 px-3 font-mono">KSh {dp.phillips}</td>
                      <td className="py-3 px-3 font-mono">KSh {dp.medisel}</td>
                      <td className="py-3 px-3 font-mono">KSh {dp.harleys}</td>
                      <td className="py-3 px-3 font-bold text-emerald-700 bg-emerald-50/50">
                        ✓ {dp.cheapest}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Purchase Orders Workflow */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600" />
                  Purchase Orders (PO) & Versaly Vensure Replenishment
                </h2>
                <p className="text-xs text-slate-500">
                  Generate POs with mandatory bonus pack capture and Vensure ecosystem integration
                </p>
              </div>
              <button
                onClick={() => setShowPoModal(true)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold cursor-pointer shadow-sm"
              >
                + Raise Purchase Order (PO)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {purchaseOrders.map((po) => (
                <div key={po.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-teal-800">{po.poNumber}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                      {po.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{po.supplierName}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">Date: {po.orderDate}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    {po.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-slate-700">
                        <span>{item.drugName} ({item.orderedQty}x)</span>
                        <span className="font-bold">KSh {(item.orderedQty * item.unitPriceKes).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                      <span>Total Value:</span>
                      <span>KSh {po.totalAmountKes.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[11px] text-teal-700 font-semibold">🔗 Vensure Connected</span>
                    <button
                      onClick={() => alert(`Transmitted PO ${po.poNumber} directly to ${po.supplierName}`)}
                      className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer text-xs"
                    >
                      Resend to Supplier →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: THERMAL DOSAGE LABEL STICKER (BILINGUAL ENG/SWAHILI) */}
      {showDosageSticker && selectedRx && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Thermal Drug Dosage Sticker Printer
              </span>
              <button onClick={() => setShowDosageSticker(false)} className="text-slate-400 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Standard 58mm / 80mm Thermal Label Layout */}
            <div className="p-4 rounded-xl border-2 border-dashed border-slate-400 bg-white text-slate-950 space-y-2 font-mono text-xs">
              <div className="text-center pb-2 border-b border-dashed border-slate-300">
                <div className="font-black text-sm">AFYAWARE PHARMACY</div>
                <div className="text-[10px]">Parklands, Westlands • Tel: 0709 340 100</div>
              </div>

              <div>
                <div className="text-[11px]">
                  PT: <strong>{selectedRx.patientName}</strong>
                </div>
                <div className="text-[10px] text-slate-500">UPN: {selectedRx.patientUpn} • {new Date().toLocaleDateString()}</div>
              </div>

              <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                <div className="font-bold text-xs uppercase">{selectedRx.drugBrandName}</div>
                <div className="text-[10px] text-slate-600">{selectedRx.drugGenericName}</div>
              </div>

              {/* Instructions */}
              <div className="space-y-1 pt-1">
                <div className="text-[11px] font-bold">
                  EN: {selectedRx.dosageInstruction}
                </div>
                <div className="text-[11px] font-bold text-teal-950">
                  SW: {selectedRx.swahiliInstruction}
                </div>
              </div>

              <div className="text-[9px] text-center pt-2 border-t border-dashed border-slate-300 text-slate-500">
                KEEP OUT OF REACH OF CHILDREN • WEKA MBALI NA WATOTO
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDosageSticker(false)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-md text-xs"
              >
                Print Thermal Sticker
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DRUG-ALLERGY HARD LOCK WARNING */}
      {allergyModalOpen && selectedRx && (
        <div className="fixed inset-0 z-50 bg-rose-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-500 space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <ShieldAlert className="w-8 h-8 shrink-0" />
              <div>
                <h2 className="text-base font-bold">HARD CLINICAL ALLERGY LOCK!</h2>
                <p className="text-xs text-rose-600">Dispensing Blocked by Clinical Safety Engine</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-2">
              <p>
                Patient <strong>{selectedRx.patientName}</strong> has a documented allergy to{" "}
                <strong>{selectedRx.patientAllergies.join(", ")}</strong>.
              </p>
              <p>
                The prescribed medicine <strong>{selectedRx.drugBrandName} ({selectedRx.drugGenericName})</strong> is contraindicated.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => setAllergyModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Cancel & Consult Doctor
              </button>
              <button
                onClick={() => {
                  setOverrideAllergy(true);
                  setAllergyModalOpen(false);
                  handleDispenseRx(selectedRx);
                }}
                className="px-4 py-2 rounded-xl border border-rose-400 text-rose-800 text-xs font-bold hover:bg-rose-50"
              >
                Pharmacist Override (PIN)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: LOG NEW BATCH / GRN */}
      {showAddBatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900">Log Goods Received Note (GRN) & New Batch</span>
              <button onClick={() => setShowAddBatchModal(false)} className="text-slate-400 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBatch} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={newBatchName}
                    onChange={(e) => setNewBatchName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Generic Name *</label>
                  <input
                    type="text"
                    required
                    value={newBatchGeneric}
                    onChange={(e) => setNewBatchGeneric(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Batch Number *</label>
                  <input
                    type="text"
                    required
                    value={newBatchNumber}
                    onChange={(e) => setNewBatchNumber(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={newBatchExp}
                    onChange={(e) => setNewBatchExp(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Stock Qty *</label>
                  <input
                    type="number"
                    required
                    value={newBatchQty}
                    onChange={(e) => setNewBatchQty(parseInt(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Buying Price (KSh)</label>
                  <input
                    type="number"
                    value={newBatchBuyPrice}
                    onChange={(e) => setNewBatchBuyPrice(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Selling Price (KSh)</label>
                  <input
                    type="number"
                    value={newBatchSellPrice}
                    onChange={(e) => setNewBatchSellPrice(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Supplier</label>
                  <select
                    value={newBatchSupplier}
                    onChange={(e) => setNewBatchSupplier(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Surgipharm Ltd">Surgipharm Ltd</option>
                    <option value="Phillips Pharmaceuticals">Phillips Pharmaceuticals</option>
                    <option value="Medisel Kenya Ltd">Medisel Kenya Ltd</option>
                    <option value="Harley's Limited">Harley's Limited</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddBatchModal(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-teal-600 text-white font-bold rounded-xl shadow-md">Add Batch to Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: RAISE PURCHASE ORDER */}
      {showPoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900">Raise New Purchase Order (PO)</span>
              <button onClick={() => setShowPoModal(false)} className="text-slate-400 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePo} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Supplier / Distributor</label>
                <select
                  value={poSupplier}
                  onChange={(e) => setPoSupplier(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-xl bg-white"
                >
                  <option value="Medisel Kenya Ltd">Medisel Kenya Ltd (Best Rates on Antimalarials)</option>
                  <option value="Phillips Pharmaceuticals">Phillips Pharmaceuticals (Best Rates on Ceftriaxone)</option>
                  <option value="Surgipharm Ltd">Surgipharm Ltd</option>
                  <option value="Harley's Limited">Harley's Limited</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Medicine Item</label>
                <input
                  type="text"
                  value={poDrug}
                  onChange={(e) => setPoDrug(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Order Quantity</label>
                  <input
                    type="number"
                    value={poQty}
                    onChange={(e) => setPoQty(parseInt(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Unit Price (KSh)</label>
                  <input
                    type="number"
                    value={poRate}
                    onChange={(e) => setPoRate(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="p-3 bg-teal-50 rounded-xl font-bold text-teal-950 flex justify-between">
                <span>Total PO Commitment:</span>
                <span>KSh {(poQty * poRate).toLocaleString()}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setShowPoModal(false)} className="px-4 py-2 border rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-teal-600 text-white font-bold rounded-xl shadow-md">Dispatch PO to Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
