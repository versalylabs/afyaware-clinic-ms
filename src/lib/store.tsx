"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserRole,
  Branch,
  Patient,
  Visit,
  RoomEquipmentResource,
  AppointmentSlot,
  ClinicalTask,
  ClinicalAlert,
  DrugBatch,
  LabOrder,
  ImagingOrder,
  PrescriptionOrder,
  InsuranceClaim,
  AuditLogEntry,
  QueueStation,
  ClinicalDocument,
  ConsentRecord,
  ProcedureOrder,
  ObservationBedRecord,
  PurchaseOrder,
  NarcoticLogEntry,
  LedgerEntry,
  CashierShiftRecord,
  DentalToothRecord,
  KepiImmunizationRecord,
  OpticalRefractionRecord,
  ClinicalReferralRecord,
  DoctorCommissionRecord,
  ChronicRefillLead,
  Moh705Row,
  Moh706Row,
  InterBranchStockTransfer,
  PatientHealthWallet,
  TelemedicinePhlebotomyDispatch,
} from "./types";
import {
  INITIAL_BRANCHES,
  INITIAL_PATIENTS,
  INITIAL_VISITS,
  INITIAL_RESOURCES,
  INITIAL_APPOINTMENTS,
  INITIAL_TASKS,
  INITIAL_ALERTS,
  INITIAL_DRUG_BATCHES,
  INITIAL_LAB_ORDERS,
  INITIAL_IMAGING_ORDERS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_CLAIMS,
  INITIAL_AUDIT_LOGS,
  INITIAL_DOCUMENTS,
  INITIAL_CONSENTS,
  INITIAL_PROCEDURES,
  INITIAL_BEDS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_NARCOTICS,
  INITIAL_LEDGERS,
  INITIAL_SHIFTS,
  INITIAL_TEETH,
  INITIAL_KEPI_RECORDS,
  INITIAL_OPTICAL_RECORDS,
  INITIAL_REFERRALS,
  INITIAL_COMMISSIONS,
  INITIAL_CHRONIC_LEADS,
  INITIAL_MOH705,
  INITIAL_MOH706,
  INITIAL_STOCK_TRANSFERS,
  INITIAL_WALLETS,
  INITIAL_DISPATCHES,
} from "./seed-data";

export type ActiveModuleId =
  | "live-ops"
  | "empi-Scheduling"
  | "triage"
  | "emr-worklists"
  | "lis-imaging-ward"
  | "pharmacy-inventory"
  | "cashier-insurance"
  | "specialist-referrals-crm"
  | "moh-reports-network"
  | "admin-security";

interface AfyawareStoreContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  canViewClinicalConfidential: boolean;
  activeBranchId: string;
  setActiveBranchId: (id: string) => void;
  activeModule: ActiveModuleId;
  setActiveModule: (mod: ActiveModuleId) => void;
  branches: Branch[];
  patients: Patient[];
  visits: Visit[];
  resources: RoomEquipmentResource[];
  appointments: AppointmentSlot[];
  tasks: ClinicalTask[];
  alerts: ClinicalAlert[];
  drugBatches: DrugBatch[];
  labOrders: LabOrder[];
  imagingOrders: ImagingOrder[];
  prescriptions: PrescriptionOrder[];
  claims: InsuranceClaim[];
  auditLogs: AuditLogEntry[];
  documents: ClinicalDocument[];
  consents: ConsentRecord[];
  procedures: ProcedureOrder[];
  beds: ObservationBedRecord[];
  purchaseOrders: PurchaseOrder[];
  narcotics: NarcoticLogEntry[];
  ledgers: LedgerEntry[];
  shifts: CashierShiftRecord[];
  teeth: DentalToothRecord[];
  kepiRecords: KepiImmunizationRecord[];
  opticalRecords: OpticalRefractionRecord[];
  referrals: ClinicalReferralRecord[];
  commissions: DoctorCommissionRecord[];
  chronicLeads: ChronicRefillLead[];
  moh705: Moh705Row[];
  moh706: Moh706Row[];
  stockTransfers: InterBranchStockTransfer[];
  wallets: PatientHealthWallet[];
  dispatches: TelemedicinePhlebotomyDispatch[];
  // Actions
  acknowledgeAlert: (alertId: string) => void;
  updateTaskStatus: (taskId: string, status: ClinicalTask["status"]) => void;
  moveVisitStation: (visitId: string, newStation: QueueStation) => void;
  updateResourceStatus: (resourceId: string, status: RoomEquipmentResource["status"]) => void;
  addPatient: (patient: Patient) => void;
  addVisit: (visit: Visit) => void;
  updateVisit: (visitId: string, updates: Partial<Visit>) => void;
  addAppointment: (apt: AppointmentSlot) => void;
  addLabOrder: (order: LabOrder) => void;
  updateLabOrder: (orderId: string, updates: Partial<LabOrder>) => void;
  addImagingOrder: (order: ImagingOrder) => void;
  updateImagingOrder: (orderId: string, updates: Partial<ImagingOrder>) => void;
  addPrescription: (rx: PrescriptionOrder) => void;
  updatePrescription: (rxId: string, updates: Partial<PrescriptionOrder>) => void;
  updateDrugBatch: (batchId: string, updates: Partial<DrugBatch>) => void;
  addDrugBatch: (batch: DrugBatch) => void;
  updateClaim: (claimId: string, updates: Partial<InsuranceClaim>) => void;
  addClaim: (claim: InsuranceClaim) => void;
  addDocument: (doc: ClinicalDocument) => void;
  addConsent: (consent: ConsentRecord) => void;
  updateConsent: (consentId: string, updates: Partial<ConsentRecord>) => void;
  addProcedure: (procedure: ProcedureOrder) => void;
  updateProcedure: (procedureId: string, updates: Partial<ProcedureOrder>) => void;
  updateBed: (bedId: string, updates: Partial<ObservationBedRecord>) => void;
  addPurchaseOrder: (po: PurchaseOrder) => void;
  updatePurchaseOrder: (poId: string, updates: Partial<PurchaseOrder>) => void;
  addNarcoticEntry: (entry: NarcoticLogEntry) => void;
  addLedgerEntry: (entry: LedgerEntry) => void;
  addShiftRecord: (shift: CashierShiftRecord) => void;
  updateShiftRecord: (shiftId: string, updates: Partial<CashierShiftRecord>) => void;
  updateTooth: (toothNumber: number, updates: Partial<DentalToothRecord>) => void;
  updateKepiRecord: (recordId: string, updates: Partial<KepiImmunizationRecord>) => void;
  addKepiRecord: (record: KepiImmunizationRecord) => void;
  addOpticalRecord: (record: OpticalRefractionRecord) => void;
  addReferral: (referral: ClinicalReferralRecord) => void;
  updateReferral: (referralId: string, updates: Partial<ClinicalReferralRecord>) => void;
  updateCommission: (commId: string, updates: Partial<DoctorCommissionRecord>) => void;
  updateChronicLead: (leadId: string, updates: Partial<ChronicRefillLead>) => void;
  addStockTransfer: (transfer: InterBranchStockTransfer) => void;
  updateStockTransfer: (transferId: string, updates: Partial<InterBranchStockTransfer>) => void;
  updateWallet: (walletId: string, updates: Partial<PatientHealthWallet>) => void;
  addDispatch: (dispatch: TelemedicinePhlebotomyDispatch) => void;
  updateDispatch: (dispatchId: string, updates: Partial<TelemedicinePhlebotomyDispatch>) => void;
  addAuditLog: (
    action: string,
    module: string,
    targetRecord: string,
    severity?: AuditLogEntry["severity"]
  ) => void;
  resetDemoData: () => void;
}

const AfyawareContext = createContext<AfyawareStoreContextType | undefined>(undefined);

const STORAGE_KEY = "afyaware_os_state_v1";

export function AfyawareProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRoleState] = useState<UserRole>("Clinic Director");
  const [activeBranchId, setActiveBranchId] = useState<string>("BR-WESTLANDS");
  const [activeModule, setActiveModule] = useState<ActiveModuleId>("live-ops");

  const [branches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [visits, setVisits] = useState<Visit[]>(INITIAL_VISITS);
  const [resources, setResources] = useState<RoomEquipmentResource[]>(INITIAL_RESOURCES);
  const [appointments, setAppointments] = useState<AppointmentSlot[]>(INITIAL_APPOINTMENTS);
  const [tasks, setTasks] = useState<ClinicalTask[]>(INITIAL_TASKS);
  const [alerts, setAlerts] = useState<ClinicalAlert[]>(INITIAL_ALERTS);
  const [drugBatches, setDrugBatches] = useState<DrugBatch[]>(INITIAL_DRUG_BATCHES);
  const [labOrders, setLabOrders] = useState<LabOrder[]>(INITIAL_LAB_ORDERS);
  const [imagingOrders, setImagingOrders] = useState<ImagingOrder[]>(INITIAL_IMAGING_ORDERS);
  const [prescriptions, setPrescriptions] = useState<PrescriptionOrder[]>(INITIAL_PRESCRIPTIONS);
  const [claims, setClaims] = useState<InsuranceClaim[]>(INITIAL_CLAIMS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [documents, setDocuments] = useState<ClinicalDocument[]>(INITIAL_DOCUMENTS);
  const [consents, setConsents] = useState<ConsentRecord[]>(INITIAL_CONSENTS);
  const [procedures, setProcedures] = useState<ProcedureOrder[]>(INITIAL_PROCEDURES);
  const [beds, setBeds] = useState<ObservationBedRecord[]>(INITIAL_BEDS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [narcotics, setNarcotics] = useState<NarcoticLogEntry[]>(INITIAL_NARCOTICS);
  const [ledgers, setLedgers] = useState<LedgerEntry[]>(INITIAL_LEDGERS);
  const [shifts, setShifts] = useState<CashierShiftRecord[]>(INITIAL_SHIFTS);
  const [teeth, setTeeth] = useState<DentalToothRecord[]>(INITIAL_TEETH);
  const [kepiRecords, setKepiRecords] = useState<KepiImmunizationRecord[]>(INITIAL_KEPI_RECORDS);
  const [opticalRecords, setOpticalRecords] = useState<OpticalRefractionRecord[]>(INITIAL_OPTICAL_RECORDS);
  const [referrals, setReferrals] = useState<ClinicalReferralRecord[]>(INITIAL_REFERRALS);
  const [commissions, setCommissions] = useState<DoctorCommissionRecord[]>(INITIAL_COMMISSIONS);
  const [chronicLeads, setChronicLeads] = useState<ChronicRefillLead[]>(INITIAL_CHRONIC_LEADS);
  const [moh705] = useState<Moh705Row[]>(INITIAL_MOH705);
  const [moh706] = useState<Moh706Row[]>(INITIAL_MOH706);
  const [stockTransfers, setStockTransfers] = useState<InterBranchStockTransfer[]>(INITIAL_STOCK_TRANSFERS);
  const [wallets, setWallets] = useState<PatientHealthWallet[]>(INITIAL_WALLETS);
  const [dispatches, setDispatches] = useState<TelemedicinePhlebotomyDispatch[]>(INITIAL_DISPATCHES);

  // Load persisted state from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.patients) setPatients(parsed.patients);
        if (parsed.visits) setVisits(parsed.visits);
        if (parsed.resources) setResources(parsed.resources);
        if (parsed.appointments) setAppointments(parsed.appointments);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.alerts) setAlerts(parsed.alerts);
        if (parsed.drugBatches) setDrugBatches(parsed.drugBatches);
        if (parsed.labOrders) setLabOrders(parsed.labOrders);
        if (parsed.imagingOrders) setImagingOrders(parsed.imagingOrders);
        if (parsed.prescriptions) setPrescriptions(parsed.prescriptions);
        if (parsed.claims) setClaims(parsed.claims);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        if (parsed.documents) setDocuments(parsed.documents);
        if (parsed.consents) setConsents(parsed.consents);
        if (parsed.procedures) setProcedures(parsed.procedures);
        if (parsed.beds) setBeds(parsed.beds);
        if (parsed.purchaseOrders) setPurchaseOrders(parsed.purchaseOrders);
        if (parsed.narcotics) setNarcotics(parsed.narcotics);
        if (parsed.ledgers) setLedgers(parsed.ledgers);
        if (parsed.shifts) setShifts(parsed.shifts);
        if (parsed.teeth) setTeeth(parsed.teeth);
        if (parsed.kepiRecords) setKepiRecords(parsed.kepiRecords);
        if (parsed.opticalRecords) setOpticalRecords(parsed.opticalRecords);
        if (parsed.referrals) setReferrals(parsed.referrals);
        if (parsed.commissions) setCommissions(parsed.commissions);
        if (parsed.chronicLeads) setChronicLeads(parsed.chronicLeads);
        if (parsed.stockTransfers) setStockTransfers(parsed.stockTransfers);
        if (parsed.wallets) setWallets(parsed.wallets);
        if (parsed.dispatches) setDispatches(parsed.dispatches);
      }
    } catch {
      // Ignore storage parse error
    }
  }, []);

  // Save state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          patients,
          visits,
          resources,
          appointments,
          tasks,
          alerts,
          drugBatches,
          labOrders,
          imagingOrders,
          prescriptions,
          claims,
          auditLogs,
          documents,
          consents,
          procedures,
          beds,
          purchaseOrders,
          narcotics,
          ledgers,
          shifts,
          teeth,
          kepiRecords,
          opticalRecords,
          referrals,
          commissions,
          chronicLeads,
          stockTransfers,
          wallets,
          dispatches,
        })
      );
    } catch {
      // Ignore quota errors
    }
  }, [
    patients,
    visits,
    resources,
    appointments,
    tasks,
    alerts,
    drugBatches,
    labOrders,
    imagingOrders,
    prescriptions,
    claims,
    auditLogs,
    documents,
    consents,
    procedures,
    beds,
    purchaseOrders,
    narcotics,
    ledgers,
    shifts,
    teeth,
    kepiRecords,
    opticalRecords,
    referrals,
    commissions,
    chronicLeads,
    stockTransfers,
    wallets,
    dispatches,
  ]);

  // Clinical Privacy Lock: Cashiers, Receptionists, and Storekeepers CANNOT read confidential clinical notes or diagnoses
  const nonClinicalRoles: UserRole[] = ["Cashier", "Receptionist", "Storekeeper"];
  const canViewClinicalConfidential = !nonClinicalRoles.includes(currentRole);

  const addAuditLog = (
    action: string,
    module: string,
    targetRecord: string,
    severity: AuditLogEntry["severity"] = "Standard"
  ) => {
    const newEntry: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toTimeString().slice(0, 8),
      actorName: `${currentRole} User`,
      actorRole: currentRole,
      action,
      module,
      targetRecord,
      ipAddress: "192.168.10.10",
      severity,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    addAuditLog(
      `Switched active workspace role to ${role}`,
      "System Admin & RBAC",
      `Session Role: ${role}`,
      "Standard"
    );
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
    addAuditLog(
      `Acknowledged clinical alert ${alertId}`,
      "Notifications & Alerts",
      alertId,
      "Sensitive Clinical Access"
    );
  };

  const updateTaskStatus = (taskId: string, status: ClinicalTask["status"]) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
    addAuditLog(
      `Updated clinical worklist task ${taskId} to ${status}`,
      "Clinical Worklists",
      taskId,
      "Standard"
    );
  };

  const moveVisitStation = (visitId: string, newStation: QueueStation) => {
    setVisits((prev) =>
      prev.map((v) =>
        v.id === visitId
          ? {
              ...v,
              station: newStation,
              stationEnteredAt: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              waitMinutes: 1,
            }
          : v
      )
    );
    addAuditLog(
      `Routed visit ${visitId} to station: ${newStation}`,
      "Smart Queue",
      visitId,
      "Standard"
    );
  };

  const updateResourceStatus = (
    resourceId: string,
    status: RoomEquipmentResource["status"]
  ) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === resourceId
          ? {
              ...r,
              status,
              currentOccupant: status === "Available" ? undefined : r.currentOccupant,
            }
          : r
      )
    );
    addAuditLog(
      `Changed resource ${resourceId} status to ${status}`,
      "Resource Scheduling",
      resourceId
    );
  };

  const addPatient = (patient: Patient) => {
    setPatients((prev) => [patient, ...prev]);
    addAuditLog(
      `Registered new patient ${patient.fullName} (${patient.upn})`,
      "EMPI Registration",
      patient.upn
    );
  };

  const addVisit = (visit: Visit) => {
    setVisits((prev) => [visit, ...prev]);
    addAuditLog(
      `Checked in visit ${visit.visitNumber} for ${visit.patientName}`,
      "Queue & Check-In",
      visit.visitNumber
    );
  };

  const updateVisit = (visitId: string, updates: Partial<Visit>) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, ...updates } : v))
    );
  };

  const addAppointment = (apt: AppointmentSlot) => {
    setAppointments((prev) => [apt, ...prev]);
    addAuditLog(
      `Booked 4D appointment ${apt.id} (${apt.doctorName} + ${apt.roomName})`,
      "Resource Scheduling",
      apt.id
    );
  };

  const addLabOrder = (order: LabOrder) => {
    setLabOrders((prev) => [order, ...prev]);
    addAuditLog(
      `Ordered Lab Test: ${order.testName} for ${order.patientName}`,
      "Laboratory LIS",
      order.id
    );
  };

  const updateLabOrder = (orderId: string, updates: Partial<LabOrder>) => {
    setLabOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
    );
  };

  const addImagingOrder = (order: ImagingOrder) => {
    setImagingOrders((prev) => [order, ...prev]);
    addAuditLog(
      `Ordered Imaging Study: ${order.studyName} for ${order.patientName}`,
      "Radiology & Imaging",
      order.id
    );
  };

  const updateImagingOrder = (orderId: string, updates: Partial<ImagingOrder>) => {
    setImagingOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
    );
  };

  const addPrescription = (rx: PrescriptionOrder) => {
    setPrescriptions((prev) => [rx, ...prev]);
    addAuditLog(
      `Dispatched E-Prescription: ${rx.drugBrandName} for ${rx.patientName}`,
      "Pharmacy & E-Prescription",
      rx.id,
      "Sensitive Clinical Access"
    );
  };

  const updatePrescription = (rxId: string, updates: Partial<PrescriptionOrder>) => {
    setPrescriptions((prev) =>
      prev.map((p) => (p.id === rxId ? { ...p, ...updates } : p))
    );
  };

  const updateDrugBatch = (batchId: string, updates: Partial<DrugBatch>) => {
    setDrugBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, ...updates } : b))
    );
  };

  const addDrugBatch = (batch: DrugBatch) => {
    setDrugBatches((prev) => [batch, ...prev]);
    addAuditLog(
      `Logged GRN Drug Batch ${batch.batchNumber} (${batch.brandName}, Exp: ${batch.expiryDate})`,
      "Drug Inventory & FEFO",
      batch.batchNumber
    );
  };

  const updateClaim = (claimId: string, updates: Partial<InsuranceClaim>) => {
    setClaims((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, ...updates } : c))
    );
  };

  const addDocument = (doc: ClinicalDocument) => {
    setDocuments((prev) => [doc, ...prev]);
    addAuditLog(
      `Uploaded clinical document: ${doc.title} (${doc.category})`,
      "Clinical Vault",
      doc.id,
      "Sensitive Clinical Access"
    );
  };

  const addConsent = (consent: ConsentRecord) => {
    setConsents((prev) => [consent, ...prev]);
    addAuditLog(
      `Signed digital consent: ${consent.procedureName} for ${consent.patientName}`,
      "Patient Consents",
      consent.id,
      "Sensitive Clinical Access"
    );
  };

  const updateConsent = (consentId: string, updates: Partial<ConsentRecord>) => {
    setConsents((prev) =>
      prev.map((c) => (c.id === consentId ? { ...c, ...updates } : c))
    );
  };

  const addProcedure = (procedure: ProcedureOrder) => {
    setProcedures((prev) => [procedure, ...prev]);
    addAuditLog(
      `Logged procedure: ${procedure.procedureName} for ${procedure.patientName}`,
      "Minor Theatre & Ward",
      procedure.id,
      "Sensitive Clinical Access"
    );
  };

  const updateProcedure = (procedureId: string, updates: Partial<ProcedureOrder>) => {
    setProcedures((prev) =>
      prev.map((p) => (p.id === procedureId ? { ...p, ...updates } : p))
    );
  };

  const updateBed = (bedId: string, updates: Partial<ObservationBedRecord>) => {
    setBeds((prev) =>
      prev.map((b) => (b.id === bedId ? { ...b, ...updates } : b))
    );
    addAuditLog(
      `Updated Observation Bed ${bedId}`,
      "Observation Day-Ward",
      bedId
    );
  };

  const addPurchaseOrder = (po: PurchaseOrder) => {
    setPurchaseOrders((prev) => [po, ...prev]);
    addAuditLog(
      `Raised Purchase Order ${po.poNumber} for ${po.supplierName}`,
      "Procurement & Stock",
      po.poNumber
    );
  };

  const updatePurchaseOrder = (poId: string, updates: Partial<PurchaseOrder>) => {
    setPurchaseOrders((prev) =>
      prev.map((p) => (p.id === poId ? { ...p, ...updates } : p))
    );
  };

  const addNarcoticEntry = (entry: NarcoticLogEntry) => {
    setNarcotics((prev) => [entry, ...prev]);
    addAuditLog(
      `PPB Dangerous Drugs Register: Dispensed ${entry.quantityDispensed} of ${entry.drugName} (Ref: ${entry.ppbReference})`,
      "Controlled Narcotics Register",
      entry.ppbReference,
      "Sensitive Clinical Access"
    );
  };

  const addClaim = (claim: InsuranceClaim) => {
    setClaims((prev) => [claim, ...prev]);
    addAuditLog(
      `Filed Insurance Claim ${claim.claimNumber} for ${claim.patientName} (${claim.payerType})`,
      "Insurance Claims",
      claim.claimNumber
    );
  };

  const addLedgerEntry = (entry: LedgerEntry) => {
    setLedgers((prev) => [entry, ...prev]);
    addAuditLog(
      `Recorded Ledger Entry: ${entry.type} (${entry.description}) - KSh ${Math.abs(entry.amountKes).toLocaleString()}`,
      "Patient Account Ledgers",
      entry.id
    );
  };

  const addShiftRecord = (shift: CashierShiftRecord) => {
    setShifts((prev) => [shift, ...prev]);
    addAuditLog(
      `Opened Cashier Shift for ${shift.cashierName} (Float: KSh ${shift.openingFloatKes.toLocaleString()})`,
      "Cashier Shift Balancing",
      shift.id
    );
  };

  const updateShiftRecord = (shiftId: string, updates: Partial<CashierShiftRecord>) => {
    setShifts((prev) =>
      prev.map((s) => (s.id === shiftId ? { ...s, ...updates } : s))
    );
    addAuditLog(
      `Reconciled/Updated Cashier Shift ${shiftId}`,
      "Cashier Shift Balancing",
      shiftId
    );
  };

  const updateTooth = (toothNumber: number, updates: Partial<DentalToothRecord>) => {
    setTeeth((prev) =>
      prev.map((t) => (t.toothNumber === toothNumber ? { ...t, ...updates } : t))
    );
    addAuditLog(
      `Dental Odontogram Updated: Tooth #${toothNumber} (${updates.status || "Updated"})`,
      "Dental Clinic Module",
      `Tooth-${toothNumber}`,
      "Sensitive Clinical Access"
    );
  };

  const updateKepiRecord = (recordId: string, updates: Partial<KepiImmunizationRecord>) => {
    setKepiRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, ...updates } : r))
    );
    addAuditLog(
      `KEPI Immunization Register: Updated record ${recordId}`,
      "MCH / ANC & KEPI Clinic",
      recordId
    );
  };

  const addKepiRecord = (record: KepiImmunizationRecord) => {
    setKepiRecords((prev) => [record, ...prev]);
    addAuditLog(
      `KEPI Immunization Register: Added vaccine ${record.vaccineName} for ${record.childName}`,
      "MCH / ANC & KEPI Clinic",
      record.id
    );
  };

  const addOpticalRecord = (record: OpticalRefractionRecord) => {
    setOpticalRecords((prev) => [record, ...prev]);
    addAuditLog(
      `Optical Refraction Exam Recorded for ${record.patientName} (OD: ${record.odSphere}, OS: ${record.osSphere})`,
      "Optical Clinic Module",
      record.id
    );
  };

  const addReferral = (referral: ClinicalReferralRecord) => {
    setReferrals((prev) => [referral, ...prev]);
    addAuditLog(
      `Dispatched MOH Clinical Referral (${referral.referralType}): ${referral.patientName} -> ${referral.receivingFacilityOrSpecialist} (Ref: ${referral.mohFormNumber})`,
      "Clinical Referrals",
      referral.mohFormNumber
    );
  };

  const updateReferral = (referralId: string, updates: Partial<ClinicalReferralRecord>) => {
    setReferrals((prev) =>
      prev.map((r) => (r.id === referralId ? { ...r, ...updates } : r))
    );
  };

  const updateCommission = (commId: string, updates: Partial<DoctorCommissionRecord>) => {
    setCommissions((prev) =>
      prev.map((c) => (c.id === commId ? { ...c, ...updates } : c))
    );
    addAuditLog(
      `Doctor Commission / Locum Payout Updated for ${commId} (${updates.paymentStatus || "Updated"})`,
      "Doctor Commissions & WHT",
      commId,
      "Financial Override"
    );
  };

  const updateChronicLead = (leadId: string, updates: Partial<ChronicRefillLead>) => {
    setChronicLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, ...updates } : l))
    );
    addAuditLog(
      `Day-27 Chronic Refill CRM Trigger: Lead ${leadId} updated to ${updates.reminderStatus}`,
      "Chronic Care Refill CRM",
      leadId
    );
  };

  const addStockTransfer = (transfer: InterBranchStockTransfer) => {
    setStockTransfers((prev) => [transfer, ...prev]);
    addAuditLog(
      `Inter-Branch Stock Transfer Created: ${transfer.drugName} (Qty: ${transfer.quantityRequested}) from ${transfer.sourceBranchId} to ${transfer.destinationBranchId}`,
      "Multi-Branch Stock Network",
      transfer.transferNumber
    );
  };

  const updateStockTransfer = (transferId: string, updates: Partial<InterBranchStockTransfer>) => {
    setStockTransfers((prev) =>
      prev.map((t) => (t.id === transferId ? { ...t, ...updates } : t))
    );
    addAuditLog(
      `Inter-Branch Stock Transfer ${transferId} status updated to ${updates.status}`,
      "Multi-Branch Stock Network",
      transferId
    );
  };

  const updateWallet = (walletId: string, updates: Partial<PatientHealthWallet>) => {
    setWallets((prev) =>
      prev.map((w) => (w.id === walletId ? { ...w, ...updates } : w))
    );
    addAuditLog(
      `Patient Health Wallet updated for ${walletId}`,
      "Patient Portal & Health Wallet",
      walletId
    );
  };

  const addDispatch = (dispatch: TelemedicinePhlebotomyDispatch) => {
    setDispatches((prev) => [dispatch, ...prev]);
    addAuditLog(
      `Telemedicine / Home Phlebotomy Dispatch Created: ${dispatch.requestType} for ${dispatch.patientName} (${dispatch.scheduledTime})`,
      "Telemedicine & Home Phlebotomy",
      dispatch.id
    );
  };

  const updateDispatch = (dispatchId: string, updates: Partial<TelemedicinePhlebotomyDispatch>) => {
    setDispatches((prev) =>
      prev.map((d) => (d.id === dispatchId ? { ...d, ...updates } : d))
    );
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPatients(INITIAL_PATIENTS);
    setVisits(INITIAL_VISITS);
    setResources(INITIAL_RESOURCES);
    setAppointments(INITIAL_APPOINTMENTS);
    setTasks(INITIAL_TASKS);
    setAlerts(INITIAL_ALERTS);
    setDrugBatches(INITIAL_DRUG_BATCHES);
    setLabOrders(INITIAL_LAB_ORDERS);
    setImagingOrders(INITIAL_IMAGING_ORDERS);
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    setClaims(INITIAL_CLAIMS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setDocuments(INITIAL_DOCUMENTS);
    setConsents(INITIAL_CONSENTS);
    setProcedures(INITIAL_PROCEDURES);
    setBeds(INITIAL_BEDS);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setNarcotics(INITIAL_NARCOTICS);
    setLedgers(INITIAL_LEDGERS);
    setShifts(INITIAL_SHIFTS);
    setTeeth(INITIAL_TEETH);
    setKepiRecords(INITIAL_KEPI_RECORDS);
    setOpticalRecords(INITIAL_OPTICAL_RECORDS);
    setReferrals(INITIAL_REFERRALS);
    setCommissions(INITIAL_COMMISSIONS);
    setChronicLeads(INITIAL_CHRONIC_LEADS);
    setStockTransfers(INITIAL_STOCK_TRANSFERS);
    setWallets(INITIAL_WALLETS);
    setDispatches(INITIAL_DISPATCHES);
  };

  return (
    <AfyawareContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        canViewClinicalConfidential,
        activeBranchId,
        setActiveBranchId,
        activeModule,
        setActiveModule,
        branches,
        patients,
        visits,
        resources,
        appointments,
        tasks,
        alerts,
        drugBatches,
        labOrders,
        imagingOrders,
        prescriptions,
        claims,
        auditLogs,
        documents,
        consents,
        procedures,
        beds,
        purchaseOrders,
        narcotics,
        ledgers,
        shifts,
        teeth,
        kepiRecords,
        opticalRecords,
        referrals,
        commissions,
        chronicLeads,
        moh705,
        moh706,
        stockTransfers,
        wallets,
        dispatches,
        acknowledgeAlert,
        updateTaskStatus,
        moveVisitStation,
        updateResourceStatus,
        addPatient,
        addVisit,
        updateVisit,
        addAppointment,
        addLabOrder,
        updateLabOrder,
        addImagingOrder,
        updateImagingOrder,
        addPrescription,
        updatePrescription,
        updateDrugBatch,
        addDrugBatch,
        updateClaim,
        addClaim,
        addDocument,
        addConsent,
        updateConsent,
        addProcedure,
        updateProcedure,
        updateBed,
        addPurchaseOrder,
        updatePurchaseOrder,
        addNarcoticEntry,
        addLedgerEntry,
        addShiftRecord,
        updateShiftRecord,
        updateTooth,
        updateKepiRecord,
        addKepiRecord,
        addOpticalRecord,
        addReferral,
        updateReferral,
        updateCommission,
        updateChronicLead,
        addStockTransfer,
        updateStockTransfer,
        updateWallet,
        addDispatch,
        updateDispatch,
        addAuditLog,
        resetDemoData,
      }}
    >
      {children}
    </AfyawareContext.Provider>
  );
}

export function useAfyaware() {
  const ctx = useContext(AfyawareContext);
  if (!ctx) {
    throw new Error("useAfyaware must be used within an AfyawareProvider");
  }
  return ctx;
}
