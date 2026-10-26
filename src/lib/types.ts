export type UserRole =
  | "Clinic Director"
  | "Medical Officer / Doctor"
  | "Nurse / Triage"
  | "Lab Technologist"
  | "Radiographer"
  | "Pharmacist"
  | "Cashier"
  | "Receptionist"
  | "Claims Officer"
  | "Storekeeper";

export type PaymentSchemeType =
  | "Cash / M-Pesa"
  | "SHA (Social Health Authority)"
  | "Private Insurance"
  | "Corporate Credit";

export type QueueStation =
  | "Reception"
  | "Triage"
  | "Consultation"
  | "Lab"
  | "Imaging"
  | "Procedure / Day-Ward"
  | "Doctor Review"
  | "Pharmacy"
  | "Cashier"
  | "Discharged";

export type PriorityLevel = "Routine" | "Urgent" | "Emergency / Stat";

export interface Branch {
  id: string;
  name: string;
  code: string;
  location: string;
  phone: string;
  kraPin: string;
  etimsSerial: string;
  mpesaTill: string;
  mpesaPaybill: string;
  activeRooms: number;
  totalRooms: number;
}

export interface Patient {
  id: string;
  upn: string; // e.g., AFY-2026-00142
  fullName: string;
  dob: string;
  ageYears: number;
  ageMonths?: number;
  gender: "Male" | "Female";
  nationalId: string;
  phone: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
  nextOfKinRelation: string;
  paymentType: PaymentSchemeType;
  insurerName?: string;
  memberNumber?: string;
  principalMemberId?: string;
  relationshipToPrincipal?: "Self" | "Spouse" | "Child" | "Dependant";
  allergies: string[];
  chronicConditions: string[];
  bloodGroup: string;
  branchRegistered: string;
  accountBalance: number; // Positive = owes clinic, Negative = credit/deposit on account
  createdAt: string;
}

export interface VitalsRecord {
  id: string;
  visitId: string;
  patientId: string;
  recordedAt: string;
  recordedBy: string;
  bpSystolic: number;
  bpDiastolic: number;
  pulse: number;
  temperature: number;
  respiratoryRate: number;
  spo2: number;
  weightKg: number;
  heightCm: number;
  bmi: number;
  muacCm?: number;
  rbsMmol?: number;
  chiefComplaint: string;
  triageNotes: string;
  abnormalityFlags: string[];
}

export interface Visit {
  id: string;
  visitNumber: string;
  patientId: string;
  patientName: string;
  patientUpn: string;
  patientAge: number;
  patientGender: "Male" | "Female";
  branchId: string;
  station: QueueStation;
  ticketNumber: string;
  priority: PriorityLevel;
  paymentType: PaymentSchemeType;
  insurerName?: string;
  preAuthCode?: string;
  visitCapLimit?: number;
  assignedDoctor: string;
  assignedRoom: string;
  checkInTime: string;
  stationEnteredAt: string;
  waitMinutes: number;
  consultationFeePaid: boolean;
  billingCleared: boolean;
  vitals?: VitalsRecord;
  // Confidential EMR data (Protected by Clinical Privacy Lock)
  presentingComplaints?: string;
  historyOfPresentingIllness?: string;
  physicalExam?: string;
  icd10Code?: string;
  icd10Description?: string;
  diagnosisStatus?: "Provisional" | "Confirmed";
  treatmentPlan?: string;
  clinicalNotesSigned?: boolean;
  totalBillAmount: number;
  paidAmount: number;
  insuranceCoveredAmount: number;
}

export interface RoomEquipmentResource {
  id: string;
  name: string;
  type: "Consultation Room" | "Procedure Room" | "Diagnostic Equipment" | "Observation Bed" | "Dental Chair";
  branchId: string;
  status: "Available" | "Occupied" | "Maintenance" | "Cleaning";
  currentOccupant?: string;
  assignedClinician?: string;
  activeSince?: string;
}

export interface AppointmentSlot {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  roomName: string;
  equipmentName?: string;
  date: string;
  timeSlot: string;
  purpose: string;
  status: "Confirmed" | "Checked-In" | "Completed" | "No-Show";
  smsReminderSent: boolean;
  branchId: string;
}

export interface ClinicalTask {
  id: string;
  roleTarget: "Doctor" | "Nurse" | "Lab" | "Pharmacy" | "Claims / Reception";
  category:
    | "Lab Result Ready"
    | "Critical Panic Value"
    | "Unsigned Clinical Note"
    | "Pending Procedure / Injection"
    | "Observation Vitals Due"
    | "Consent Required"
    | "Pre-Auth Pending"
    | "Referral Follow-Up";
  title: string;
  description: string;
  patientName: string;
  patientUpn: string;
  visitId: string;
  priority: PriorityLevel;
  status: "Pending" | "In Progress" | "Completed" | "Escalated (Shift Handover)";
  createdAt: string;
  assignedTo: string;
}

export interface ClinicalAlert {
  id: string;
  severity: "critical" | "warning" | "info";
  type:
    | "Critical Lab Panic Value"
    | "Lab/Imaging Ready"
    | "Drug Allergy / Interaction"
    | "Missing Mandatory Consent"
    | "Drug Batch Expiring"
    | "Insurance Cap Exceeded"
    | "Long Wait Time (>30m)";
  title: string;
  message: string;
  recipientRole: string;
  channel: string;
  timestamp: string;
  acknowledged: boolean;
  patientName?: string;
}

export interface DrugBatch {
  id: string;
  drugCode: string;
  genericName: string;
  brandName: string;
  strength: string;
  formulation: "Tablet" | "Capsule" | "Syrup" | "Injection" | "Cream" | "Infusion" | "Inhaler";
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  daysToExpiry: number;
  storeLocation: "Main Bulk Store" | "Outpatient Pharmacy" | "Triage Sub-Store" | "Lab Store";
  stockQty: number;
  reorderLevel: number;
  buyingPriceKes: number;
  cashPriceKes: number;
  shaPriceKes: number;
  insurancePriceKes: number;
  isControlledNarcotic: boolean;
  supplierName: string;
  branchId: string;
}

export interface LabOrder {
  id: string;
  visitId: string;
  patientId: string;
  patientName: string;
  patientUpn: string;
  patientAge: number;
  patientGender: "Male" | "Female";
  orderedBy: string;
  orderedAt: string;
  testCode: string;
  testName: string;
  category: "Haematology" | "Biochemistry" | "Microbiology" | "Serology" | "Parasitology";
  sampleType: "Blood (EDTA)" | "Serum" | "Urine" | "Stool" | "Swab";
  sampleBarcode?: string;
  priceKes: number;
  billingCleared: boolean;
  status: "Ordered (Awaiting Billing)" | "Sample Collection" | "In Analysis" | "Verified" | "External Lab Sent";
  resultValue?: string;
  referenceRange: string;
  flag?: "Normal" | "Abnormal Low" | "Abnormal High" | "CRITICAL PANIC";
  verifiedBy?: string;
  verifiedAt?: string;
  reagentDeducted: string;
  externalLabName?: string;
}

export interface ImagingOrder {
  id: string;
  visitId: string;
  patientId: string;
  patientName: string;
  patientUpn: string;
  modality: "Ultrasound" | "Digital X-Ray" | "12-Lead ECG" | "Echocardiogram";
  studyName: string;
  equipmentName: string;
  orderedBy: string;
  orderedAt: string;
  priceKes: number;
  billingCleared: boolean;
  consentSigned: boolean;
  status: "Scheduled" | "In Progress" | "Report Verified";
  findingsSummary?: string;
  impression?: string;
  radiologistName?: string;
  consumablesUsed: string;
}

export interface PrescriptionOrder {
  id: string;
  visitId: string;
  patientId: string;
  patientName: string;
  patientUpn: string;
  patientAllergies: string[];
  prescribedBy: string;
  prescribedAt: string;
  drugGenericName: string;
  drugBrandName: string;
  dosageInstruction: string; // e.g., 1x3 for 5 days
  swahiliInstruction: string; // e.g., Meza tembe 1 mara 3 kwa siku kwa muda wa siku 5
  route: "Oral" | "IV" | "IM" | "Topical" | "Inhalation";
  totalQty: number;
  dispensedQty: number;
  selectedBatchNumber: string;
  selectedBatchExpiry: string;
  unitPriceKes: number;
  totalPriceKes: number;
  billingCleared: boolean;
  status: "Pending Pharmacy" | "Partial Dispensed" | "Dispensed" | "Cancelled";
  interactionWarning?: string;
}

export interface InsuranceClaim {
  id: string;
  claimNumber: string;
  visitId: string;
  patientName: string;
  patientUpn: string;
  memberNumber: string;
  payerType: "SHA / SHIF" | "Jubilee Health" | "AAR Insurance" | "Britam" | "Old Mutual / UAP" | "CIC Insurance" | "Minet";
  visitDate: string;
  icd10Code: string;
  icd10Title: string;
  preAuthCode: string;
  claimFormSigned: boolean;
  invoiceAttached: boolean;
  totalClaimedKes: number;
  approvedAmountKes?: number;
  status: "Pending Scrubbing" | "Vetted & Ready" | "Batched & Submitted" | "Paid" | "Partially Paid" | "Rejected / Disputed";
  agingDays: number;
  rejectionReason?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  module: string;
  targetRecord: string;
  ipAddress: string;
  severity: "Standard" | "Sensitive Clinical Access" | "Financial Override";
}

export interface ClinicalDocument {
  id: string;
  patientId: string;
  visitId?: string;
  title: string;
  category:
    | "Discharge Summary"
    | "External Lab / Imaging Report"
    | "Specialist Referral Letter"
    | "Insurance Pre-Auth / Form"
    | "Clinical Photo";
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
  summary: string;
}

export interface ConsentRecord {
  id: string;
  patientId: string;
  visitId: string;
  patientName: string;
  patientUpn: string;
  templateType:
    | "Minor Surgery & Procedure Consent"
    | "Dental & Extraction Consent"
    | "Maternity / ANC & High-Risk Treatment Consent"
    | "Imaging / Contrast / Sedation Consent"
    | "HIV Testing / Counseling Consent"
    | "Kenya DPA Privacy & Health Sharing Consent";
  procedureName: string;
  risksExplained: string;
  signedBy: string;
  relationshipToPatient: string;
  witnessName: string;
  signedAt: string;
  signatureDataUrl?: string;
  status: "Signed" | "Revoked" | "Pending Signature";
  version: string;
}

export interface ProcedureOrder {
  id: string;
  visitId: string;
  patientId: string;
  patientName: string;
  patientUpn: string;
  procedureName: string;
  category: "Minor Surgery" | "Nursing Procedure" | "Injections / Infusion" | "Wound Care";
  performedBy: string;
  orderedBy: string;
  orderedAt: string;
  completedAt?: string;
  feeKes: number;
  consumablesCostKes: number;
  consumablesList: string[];
  consentSigned: boolean;
  status: "Ordered" | "In Theatre / Bay" | "Completed";
  notes?: string;
}

export interface ObservationBedRecord {
  id: string;
  bedNumber: number; // 1 to 10
  bedName: string;
  status: "Available" | "Occupied" | "Cleaning";
  visitId?: string;
  patientId?: string;
  patientName?: string;
  patientUpn?: string;
  admittedAt?: string;
  admittedBy?: string;
  hourlyRateKes: number;
  hoursElapsed?: number;
  ivFluidType?: string;
  fluidIntakeMl?: number;
  fluidOutputMl?: number;
  lastVitalsTime?: string;
  lastVitalsSummary?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  orderDate: string;
  deliveryDate?: string;
  status: "Draft" | "Sent to Supplier" | "GRN Received" | "Partially Received";
  totalAmountKes: number;
  items: {
    drugCode: string;
    drugName: string;
    orderedQty: number;
    receivedQty?: number;
    unitPriceKes: number;
    batchNumber?: string;
    expiryDate?: string;
    bonusQty?: number;
  }[];
}

export interface NarcoticLogEntry {
  id: string;
  timestamp: string;
  drugName: string;
  batchNumber: string;
  prescribingDoctor: string;
  dispensingPharmacist: string;
  patientName: string;
  patientUpn: string;
  quantityDispensed: number;
  balanceRemaining: number;
  ppbReference: string;
}

export interface LedgerEntry {
  id: string;
  patientId: string;
  patientName: string;
  patientUpn: string;
  visitId?: string;
  date: string;
  type:
    | "Invoice / Charge"
    | "Payment (M-Pesa)"
    | "Payment (Cash)"
    | "Payment (Insurance)"
    | "Deposit on Account"
    | "Credit Note / Waiver";
  description: string;
  amountKes: number; // positive = charge, negative = payment/credit
  runningBalanceKes: number;
  receiptNumber?: string;
}

export interface CashierShiftRecord {
  id: string;
  shiftDate: string;
  cashierName: string;
  openedAt: string;
  closedAt?: string;
  openingFloatKes: number;
  systemCashExpectedKes: number;
  systemMpesaExpectedKes: number;
  declaredCashKes?: number;
  cashVarianceKes?: number;
  status: "Open" | "Closed & Reconciled";
  notes?: string;
}

export interface DentalToothRecord {
  toothNumber: number; // 1 to 32 FDI or Universal
  status: "Healthy" | "Caries / Decay" | "Filled" | "Missing" | "Extracted" | "Crown" | "Root Canal";
  notes?: string;
  surfacesAffected?: ("Occlusal" | "Mesial" | "Distal" | "Buccal" | "Lingual")[];
}

export interface KepiImmunizationRecord {
  id: string;
  childName: string;
  childUpn: string;
  dateOfBirth: string;
  vaccineName: string; // BCG, OPV 0, OPV 1, Pentavalent 1, Rota 1, Measles-Rubella 1 etc.
  targetAgeWeeks: number;
  dueDate: string;
  administeredDate?: string;
  administeredBy?: string;
  batchNumber?: string;
  status: "Due" | "Administered" | "Overdue";
}

export interface OpticalRefractionRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientUpn: string;
  examDate: string;
  optometristName: string;
  odSphere: number;
  odCylinder: number;
  odAxis: number;
  odAdd?: number;
  osSphere: number;
  osCylinder: number;
  osAxis: number;
  osAdd?: number;
  pupillaryDistanceMm: number;
  recommendations: string;
}

export interface ClinicalReferralRecord {
  id: string;
  referralType: "Outgoing" | "Incoming";
  patientName: string;
  patientUpn: string;
  patientAge: number;
  patientGender: "Male" | "Female";
  date: string;
  referringFacilityOrDoctor: string;
  receivingFacilityOrSpecialist: string;
  specialty: "Cardiology" | "Oncology" | "Orthopedics" | "Pediatrics" | "ENT" | "Ophthalmology" | "Obstetrics";
  priority: "Routine" | "Urgent" | "Emergency / Red Flag";
  clinicalSummary: string;
  provisionalDiagnosis: string;
  status: "Drafted" | "Dispatched" | "Accepted & Seen" | "Closed";
  mohFormNumber: string; // e.g. MOH-REF-2026-004
}

export interface DoctorCommissionRecord {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorRole: "Consultant Physician" | "Surgeon" | "Locum MO" | "Dentist" | "Radiologist";
  periodMonth: string; // e.g. "October 2026"
  consultationsCount: number;
  proceduresCount: number;
  grossEarningsKes: number;
  kraWithholdingTaxKes: number; // 5% Kenyan WHT
  netPayableKes: number;
  paymentStatus: "Pending Approval" | "Approved" | "Paid via M-Pesa / Bank";
  kraPin: string;
}

export interface ChronicRefillLead {
  id: string;
  patientName: string;
  patientPhone: string;
  patientUpn: string;
  condition: "Hypertension" | "Type 2 Diabetes" | "Asthma / COPD" | "Dyslipidemia";
  primaryMedication: string;
  lastDispenseDate: string;
  daysRemaining: number;
  refillDueDate: string;
  reminderStatus: "Queued (Day 27)" | "WhatsApp Sent" | "SMS Sent" | "Refill Collected";
}

export interface Moh705Row {
  diseaseCode: string;
  diseaseName: string;
  under5Cases: number;
  over5Cases: number;
  icd10Ref: string;
}

export interface Moh706Row {
  testCode: string;
  testName: string;
  specimenType: string;
  totalPerformed: number;
  positiveCount: number;
}

export interface InterBranchStockTransfer {
  id: string;
  transferNumber: string;
  sourceBranchId: string;
  destinationBranchId: string;
  drugCode: string;
  drugName: string;
  batchNumber: string;
  quantityRequested: number;
  status: "Requested" | "In Transit" | "Received & Verified";
  requestedBy: string;
  requestDate: string;
  receivedDate?: string;
}

export interface PatientHealthWallet {
  id: string;
  patientUpn: string;
  patientName: string;
  balanceKes: number;
  loyaltyPoints: number;
  activePrescriptionsCount: number;
  digitalCardQrCode: string;
  recentTransactions: {
    id: string;
    date: string;
    type: "Top-Up (M-Pesa)" | "Clinic Co-Pay" | "Pharmacy OTC" | "Loyalty Redemption";
    amountKes: number;
    receiptRef: string;
  }[];
}

export interface TelemedicinePhlebotomyDispatch {
  id: string;
  requestType: "Home Phlebotomy (Lab)" | "Telemedicine Video Consult";
  patientName: string;
  patientUpn: string;
  patientPhone: string;
  patientAddress: string;
  scheduledTime: string;
  assignedStaff: string; // e.g., "Phleb. Evans Omondi"
  testsOrSpecialty: string; // e.g., "Full Hemogram + Lipid Profile"
  dispatchStatus: "Dispatched" | "Sample Collected" | "Completed" | "Pending";
}






