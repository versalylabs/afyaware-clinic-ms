# Afyaware — Outpatient Clinic, Pharmacy & Diagnostic Center OS
### Product Overview & Feature Scope (SHA/SHIF, M-Pesa & KRA eTIMS Ready)
*Developed by Versaly | Target: Outpatient Medical Centers, Specialist Clinics, Standalone & Chain Pharmacies, Diagnostic Labs, Imaging Centers, Dental/Optical Clinics, Maternity & Nursing Homes*

---

## End-to-End Patient & Revenue Lifecycle

Every stage maintains its own **status, timestamps, clinician/staff ID, billing lock, clinical documents, and audit history.**

```text
Appointment / Resource Booking (Doctor + Room + Equipment + Time Slot) or Walk-In Arrival
      ↓
Patient Registration, Privacy Consent & Insurance / SHA Eligibility Check
      ↓
Visit Creation & Consultation Billing / Pre-Authorization
      ↓
Queue Management → Triage & Vitals Capture
      ↓
Doctor / Clinician Consultation (EMR, Clinical Documents, ICD-10/11 Diagnosis)
      ↓
Clinical Orders & Tasks Dispatched:
   ├── 🧪 Laboratory Request → Sample Collection → Lab Analysis → Verified Results
   ├── 🩻 Imaging / Procedure → Consent Form Signed → Scan / Minor Theatre → Report
   ├── 💊 E-Prescription → Pharmacy Stock Check (FEFO Batch/Expiry)
   └── 🏥 Outgoing Referral (if specialized/inpatient care needed)
      ↓
Clinical Worklist Alert → Doctor Review of Results & Final Treatment Plan
      ↓
Consolidated Billing & Patient Account Ledger Update (Cash / M-Pesa / SHA / Insurance Split)
      ↓
KRA eTIMS Receipt + Drug Dispensing & Dosage Labeling
      ↓
Insurance E-Claim Submission & Reconciliation
      ↓
Patient Follow-Up / Chronic Care Reminder + MOH & Financial Reporting
```

---

## Dashboard Summary (Management & Clinical Operations View)

```text
🏥 142 Visits Today       ⏳ 14 In Waiting Queue   🩺 6 With Doctors    🧪 9 Pending Lab/X-Ray
💊 38 Prescriptions Filled                         🚨 4 Critical Lab Alerts

📋 11 Pending Doctor Tasks / Results to Review     🏥 3 Outgoing Referrals Today
💰 Revenue Today: KSh 385,400     📱 M-Pesa: KSh 192,000     🛡️ Insurance/SHA: KSh 178,400
⚠️ 12 Drugs Near Expiry (<60d)    📉 8 Fast-Moving Drugs Low  📄 18 Unsubmitted Insurance Claims
```

---

## Module Index

| # | Module | Priority |
|---|--------|----------|
| 1 | Patient Registration & Master Index (EMPI) | Core |
| 2 | Appointments, Resource Scheduling & Smart Queue | Core |
| 3 | Triage & Nursing Station | Core |
| 4 | Electronic Medical Records (EMR) & Consultation | Core |
| 5 | Clinical Document & Attachment Vault | 🟠 Medium |
| 6 | Patient Consent & Clinical Forms | 🟠 Medium |
| 7 | Clinical Task & Worklist Management | 🔴 High |
| 8 | Specialist Clinic Templates (Dental, Optical, MCH, Chronic) | 🟠 Medium |
| 9 | Laboratory Information System (LIS) | 🔴 High |
| 10 | Radiology, Imaging & Diagnostic Procedures | 🟠 Medium |
| 11 | Minor Theatre, Nursing Procedures & Observation Day-Ward | 🟠 Medium |
| 12 | Clinical Referral Management (Incoming & Outgoing) | 🟠 Medium |
| 13 | Pharmacy Management, E-Prescription & Walk-In POS | 🔴 High |
| 14 | Drug Inventory, Batch, FEFO & Expiry Control | 🔴 High |
| 15 | Cashier, Split Billing, M-Pesa & KRA eTIMS | 🔴 High |
| 16 | Patient Billing Statements & Account Ledger | 🔴 High |
| 17 | SHA/SHIF, Private Insurance & Corporate Schemes | 🔴 High |
| 18 | Doctor Commissions, Locum & Referral Payouts | 🟠 Medium |
| 19 | Procurement & Supplier Replenishment (Vensure Ready) | 🟠 Medium |
| 20 | Patient Engagement, Follow-Ups & Chronic Care CRM | 🟠 Medium |
| 21 | Patient Portal & Digital Health Wallet | 🟡 Phase 2 |
| 22 | Telemedicine & Home Sample Collection | 🟡 Phase 2 |
| 23 | Clinic Live Operations Workspace | 🟢 Recommended |
| 24 | Clinical, Financial & MOH (KHIS) Reporting | Core |
| 25 | Notifications & Clinical Alerts | Core |
| 26 | Multi-Branch Clinic & Pharmacy Network | 🟠 Medium |
| 27 | System Administration, Security & Integrations | Core |

---

## 1. 👤 Patient Registration & Master Index (EMPI)

*Prevents duplicate patient files and speeds up repeat check-ins to under 15 seconds.*

- Patient profile (Full name, DOB/Age, Gender, National ID / Passport / Birth Certificate, Phone, Next of Kin)
- Unique Patient Number (UPN / OP Number) + optional barcode/QR patient card
- Fast lookup by Phone Number, Name, National ID, or SHA/Insurance Member Number
- Family / Dependant linking (link children and spouse to a principal member's phone/insurance)
- Payment type tagging at check-in: `Cash / M-Pesa | SHA (Social Health Authority) | Private Insurance | Corporate Credit`
- Permanent clinical flags visible across all screens:
  - **Drug & Food Allergies**
  - **Chronic Conditions** (Hypertension, Diabetes, Asthma, HIV, Epilepsy)
  - **Blood Group & Rhesus Factor**

---

## 2. 🗓️ Appointments, Resource Scheduling & Smart Queue Management

*Eliminates corridor confusion, prevents room/equipment double-booking, and tracks patient waiting times.*

- **Multi-Resource Appointment Scheduling (`Doctor + Room + Equipment + Time Slot`)**:
  - Book appointments across four synchronized dimensions: **Clinician + Consultation/Procedure Room + Diagnostic Equipment + Time Slot**
  - **Conflict Detection**: Prevents two ultrasound appointments from being booked against the same ultrasound machine, or two visiting specialists from being assigned to Consultation Room 2 at the same time
  - Manage room and equipment availability calendars (e.g., X-Ray machine under maintenance, Dental Chair 1 occupied)
  - Automated SMS/WhatsApp appointment confirmation and reminders
- **Live Department Queue System**:
  - Tracks patient movement across stations in real time:
    `Reception → Triage → Consultation Room 1/2/3 → Lab → Imaging → Doctor Review → Pharmacy → Cashier → Discharged`
- **Waiting Room TV Display Screen**:
  - Privacy-friendly queue display (e.g., *Ticket #A042 → Proceed to Room 3*) with audio chime
- **Wait-Time Tracking**:
  - Measures exact minutes spent waiting at each station (identifies bottlenecks immediately)
- Priority / Emergency queue jumping (`Emergency / Stat` patients highlighted in red at top of list)

---

## 3. 🩺 Triage & Nursing Station

- Capture vital signs:
  - Blood Pressure (Systolic/Diastolic), Pulse Rate, Temperature, Respiratory Rate, SpO2 (Oxygen Saturation)
  - Weight, Height, auto-calculated **BMI** (and MUAC / Z-scores for pediatric patients)
  - Random / Fasting Blood Sugar (RBS/FBS) at triage
- Automatic color-coded abnormality flags (e.g., Hypertensive Crisis or High Fever highlighted in red)
- Historical vitals trend graph (compare today's BP/Weight against the last 5 visits)
- Chief complaint & brief nursing triage notes
- Route patient to specific Doctor, Clinical Officer, Room, or Direct-to-Lab/Pharmacy

---

## 4. 📋 Electronic Medical Records (EMR) & Doctor Consultation

*Designed for speed — doctors can complete a thorough consultation in under 2 minutes without typing essays.*

- **Single-Screen Clinical Workspace**:
  - View Triage Vitals, Past Visit History, Uploaded Clinical Documents, Lab Results, and Active Medications on one screen
- **Structured Clinical Notes**:
  - Presenting Complaints & History of Presenting Illness (HPI)
  - Past Medical & Surgical History
  - Review of Systems & Physical Examination findings
  - Customizable quick-text macros / templates for common conditions (e.g., URTI, Malaria, UTI, Gastritis)
- **Standardized Diagnosis Coding**:
  - Built-in **ICD-10 / ICD-11** searchable diagnosis database (mandatory for insurance & MOH reporting)
  - Provisional vs. Confirmed Diagnosis tagging
- **Clinical Orders from One Screen**:
  - Order Lab Tests, Radiology/Scans, Nursing Procedures, and E-Prescriptions
- **Medical Certificates & Letters**:
  - One-click generation of branded **Sick Off Sheets** and **Medical Fitness Certificates**

---

## 5. 📁 Clinical Document & Attachment Vault

*Centralizes all external and scanned paper records into the patient's permanent digital file.*

- Upload and categorize external medical documents:
  - Previous hospital discharge summaries
  - Historical paper lab results or external imaging reports (CT/MRI scans from outside centers)
  - Incoming referral letters & specialist notes
  - Scanned insurance pre-authorization forms and claim attachments
  - Clinical photographs (e.g., wound healing progression, dermatology photos)
- **Flexible Linking**: Attach documents at the **Patient level** (permanent history), **Visit level** (specific episode), or **Order level** (specific lab/imaging/procedure request)
- Built-in document previewer (PDF & image viewer directly inside the EMR without downloading)
- Tagging, timestamps, and audit trail of who uploaded or viewed each document

---

## 6. ✍️ Patient Consent & Clinical Forms

*Protects the clinic legally and standardizes clinical documentation for procedures, maternity, dental, and data privacy.*

- **Configurable Digital Consent Templates**:
  - **Minor Surgery & Procedure Consent** (circumcision, incision & drainage, implant insertion, biopsy)
  - **Dental & Extraction Consent**
  - **Maternity / ANC & High-Risk Treatment Consent**
  - **Imaging / Contrast / Sedation Consent**
  - **HIV Testing / Counseling Consent**
  - **Data Privacy & Health Information Sharing Consent** (Kenya Data Protection Act compliance)
- **Digital Signature Capture**:
  - Patient (or guardian/next-of-kin for minors) signs on a tablet/phone screen or prints for physical signature + scan upload
  - Witness / Clinician counter-signature and timestamp
- **Mandatory Procedure Gate**:
  - Option to block starting specific high-risk procedures in Minor Theatre or Dental until the required consent form is marked `Signed`
- **Consent Versioning & Audit History**:
  - Tracks exact template version signed, date/time, and revocation history if consent is withdrawn

---

## 7. ✅ Clinical Task & Worklist Management

*Eliminates dropped handoffs between doctors, nurses, lab techs, and follow-up teams.*

- **Role-Based "Requires Action" Queues**:
  - **Doctor Worklist**:
    - *Lab & Imaging Results Ready for Review* (patients who have returned from Lab/X-Ray waiting for final diagnosis/prescription)
    - *Critical / Panic Values Awaiting Acknowledgment*
    - *Pending Prescriptions / Unsigned Clinical Notes*
    - *Patient Callback / Follow-up Tasks Due Today*
  - **Nurse / Procedure Worklist**:
    - *Ordered Injections, Wound Dressings, Stat Medications, or IV Infusions Pending Execution*
    - *Observation Ward Hourly Vitals Due*
    - *Pending Procedure Consents to Capture*
  - **Claims / Reception Worklist**:
    - *Pre-Authorizations Pending Insurer Approval*
    - *Referrals Requiring Booking Confirmation*
- Task status tracking: `Pending → In Progress → Completed → Escalated / Handed Over (Shift Change)`
- Shift handover summary (incomplete nursing or clinical tasks automatically surface for the incoming shift)

---

## 8. 🦷 Specialist Clinic Modules (Configurable Templates)

*Allows Afyaware to sell to specialized outpatient practices, not just general clinics.*

- **Maternal & Child Health (MCH / ANC & Immunization)**:
  - Antenatal Care (ANC) visit tracker, gestation calculator, EDD, high-risk flags
  - KEPI Child Immunization schedule tracker with automated SMS vaccine due reminders to parents
  - Pediatric growth charts (Weight-for-Age, Height-for-Age)
- **Dental Clinic Module**:
  - Interactive visual **Dental Chart (Odontogram)** — click tooth number to record caries, fillings, extractions, root canals, crowns
- **Optical / Eye Clinic Module**:
  - Visual Acuity (VA), Refraction table (Sphere, Cylinder, Axis, PD, Add), lens & frame prescription generator
- **Chronic Disease Management (NCDs)**:
  - Dedicated flowsheets for Diabetes (HbA1c, glucose logs) and Hypertension monitoring

---

## 9. 🧪 Laboratory Information System (LIS)

*Stops revenue leakage from unbilled lab tests and delivers fast, accurate diagnostic reports.*

**Workflow:**
```text
Doctor Orders Test (or Walk-In Direct Lab Request)
      ↓
Billing Gate (Pre-paid by Cash/M-Pesa or Approved by Insurance)
      ↓
Sample Collection & Barcode Labeling (Blood, Urine, Stool, Swab)
      ↓
Sample Processing & Result Entry
      ↓
Lab Technologist Verification & Sign-Off
      ↓
Instant Alert to Doctor's Clinical Worklist + PDF Lab Report Ready
```

- Test catalogue with normal reference ranges stratified by **Age and Gender**
- Automatic flagging of **Abnormal (Low / High)** and **Critical / Panic Values**
- Panel testing support (e.g., Full Haemogram, Liver Function Test, Lipid Profile, Urinalysis)
- **Reagent & Lab Consumables Deduction**:
  - Automatically deduct test kits, vacutainers, slides, and reagents per test performed (stops staff doing "off-book" cash tests!)
- External Reference Lab Referral tracking (track samples sent out to Lancet, PathCare, Metropolis, etc., and attach returned PDF results)
- Branded Lab Result PDF with QR code verification

---

## 10. 🩻 Radiology, Imaging & Diagnostic Procedures

*For clinics with Ultrasound, X-Ray, ECG, Echo, or Endoscopy.*

- Imaging order intake linked to **Equipment & Room Schedule**
- Billing & Consent clearance gate before scan is performed
- Structured reporting templates per modality (Pelvic Ultrasound, Obstetric Scan, Chest X-Ray, 12-Lead ECG)
- Upload scan images / attachments or link PACS/DICOM viewer URL
- Radiologist / Sonographer digital sign-off
- Consumables tracking (ultrasound gel, X-ray films, thermal paper)

---

## 11. 🩹 Minor Theatre, Nursing Procedures & Observation Day-Ward

*Outpatient clinics generate substantial revenue from short procedures and day observations.*

- **Nursing & Minor Procedures**:
  - Wound dressing, stitching/suturing, nebulization, ear syringing, injections, circumcision, implant insertion/removal, IV fluid infusion
  - Appears immediately on the **Nursing Worklist** when ordered by a doctor
  - Auto-bills both the **Procedure Fee** and the **Consumables Used** (gloves, syringes, sutures, cannulas, bandages)
- **Observation / Short-Stay Day Bed Management**:
  - Track 2–10 observation beds for patients on IV drips, rehydration, or post-procedure monitoring
  - Hourly vitals & fluid balance chart (Input/Output)
  - Hourly or flat day-bed billing

---

## 12. 🏥 Clinical Referral Management (Incoming & Outgoing)

*Manages the clinical continuity of care when patients are referred into or out of the clinic.*

- **Incoming Referrals**:
  - Log patients referred *to* the clinic by external doctors, community health workers, or smaller clinics (for lab tests, ultrasound, specialist clinic, or minor procedures)
  - Attach incoming referral letter to the visit (via Module 5)
  - Option to automatically send a summary report / diagnostic result back to the referring clinician (with patient consent)
- **Outgoing Referrals (To Hospitals / Specialists / Inpatient Care)**:
  - Structured outgoing referral workflow when a patient requires inpatient admission, emergency surgery, ICU, or super-specialist care
  - Captures: **Receiving Facility/Specialist**, **Urgency (Routine / Urgent / Emergency Ambulance)**, **Reason for Referral**, **Provisional ICD-10 Diagnosis**, **Vitals & Investigations Done**, and **Treatment Already Given at Clinic**
  - Generates a standardized, branded **Clinical Referral Letter PDF** (and MOH referral form format)
- **Referral Status & Loop Closure Tracking**:
  - Track status: `Referred → Patient Arrived at Receiving Facility → Feedback/Outcome Received → Closed`
  - Follow-up task added to worklist to check on emergency referred patients

---

## 13. 💊 Pharmacy Management, E-Prescription & Walk-In POS

*Works both as an integrated hospital pharmacy AND a high-speed standalone retail chemist POS.*

- **Clinical E-Prescription Queue**:
  - Prescriptions sent by doctors appear instantly on the pharmacist's screen
  - Shows drug name (Generic & Brand), strength, dosage frequency (e.g., `1x3 for 5 days`), route, and auto-calculated quantity
- **Pharmacist Clinical Checks**:
  - Drug–Allergy warning alerts
  - Duplicate therapy & Drug–Drug interaction flags
  - Generic substitution support (with price comparison and insurance rule check)
  - Partial dispensing support (if patient can only afford half the dose today, track remaining balance)
- **Walk-In Over-The-Counter (OTC) Retail POS**:
  - Fast barcode scanner support for retail pharmacy customers without a clinic visit
- **Dosage Sticker Printing**:
  - One-click printing of thermal drug labels with patient name, drug name, instructions in English/Swahili, and clinic contact

---

## 14. 📦 Drug Inventory, Batch, FEFO & Expiry Control

*Solves the #1 financial bleed in Kenyan clinics and pharmacies: expired drugs and pilferage.*

- **Strict Batch & Expiry Tracking**:
  - Every drug received is logged with **Batch Number, Manufacturing Date, Expiry Date, Buying Price, and Selling Price**
- **FEFO Enforcement (First-Expiry, First-Out)**:
  - POS automatically selects and deducts from the batch expiring soonest
  - Blocks dispensing of expired batches
- **Expiry Radar Alerts**:
  - Dashboard lists drugs expiring in **< 30 days, < 60 days, < 90 days, and < 180 days** so staff can push sales or return to suppliers before losing money
- **Controlled / Narcotic Drugs Register**:
  - Dedicated audit log for dangerous/controlled substances (Pharmacy & Poisons Board compliance)
- **Multi-Store Management**:
  - Main Bulk Drug Store → Outpatient Dispensing Pharmacy → Triage/Procedure Room Sub-Store → Lab Store
- **Stock Take & Variance Auditing**:
  - Cycle count mode with blind stock-take; logs exact financial value of missing/shrinkage stock per shift
- **Dynamic Pricing & Markup Rules**:
  - Different price lists for **Cash Patients**, **SHA**, and **Private Insurers**

---

## 15. 💰 Cashier, Split Billing, M-Pesa & KRA eTIMS

*Plug every revenue loophole with strict billing gates and automated mobile money reconciliation.*

- **Configurable Billing Gates (Pay-Before-Service vs. Pay-After-Service)**:
  - *Cash Patients*: Require payment before Lab, Imaging, or Pharmacy dispensing unlocks
  - *Insurance/Corporate Patients*: Auto-clear covered items up to credit limit; route non-covered items or co-pays to Cashier
- **Split Payment Support on a Single Bill**:
  - Example: Total Bill KSh 4,500 → **Insurance covers KSh 3,500** + **Co-pay KSh 500 via M-Pesa** + **KSh 500 Cash**
- **Native M-Pesa Daraja Integration**:
  - **STK Push** directly to patient's phone from Cashier screen
  - **C2B Paybill / Till Auto-Matching**: Pulls M-Pesa confirmation codes automatically so cashiers cannot reuse fake or edited M-Pesa SMS messages
- **KRA eTIMS Compliance Ready**:
  - Seamless integration with KRA eTIMS (OSCU/VSCU) to generate validated tax invoices with QR codes
- **Shift Handover & Cash-Up**:
  - Blind cashier shift closing (Cashier declares cash in drawer vs. system expected cash)
- Credit Note, Refund, and Discount approval workflow (requires Manager PIN/approval)

---

## 16. 📒 Patient Billing Statements & Account Ledger

*Moves beyond single-visit receipts to provide a complete running financial ledger per patient, family, and corporate account.*

- **Individual & Family Patient Account Ledger**:
  - Tracks running balance across all visits:
    - Charges / Invoices raised
    - Payments received (Cash, M-Pesa, Card)
    - Pre-payments / Deposits on account (e.g., Antenatal package deposit or dental installment plan)
    - Credit notes, waivers, and refunds
    - Insurance-covered portions vs. Patient out-of-pocket portions
    - **Net Outstanding Balance or Credit Balance**
- **Installment & Package Billing Support**:
  - Ideal for Dental braces/crowns, Optical spectacles, Maternity packages, or Physiotherapy bundles paid across multiple visits
- **Historical Account Statements**:
  - Generate itemized **Patient Financial Statements** for any date range (for tax, NHIF/SHA, or personal reimbursement)
- **Corporate & Institutional Account Ledgers**:
  - Track credit limits, monthly consolidated statements, payments received, and aging balances for local corporate clients (schools, factories, NGOs)

---

## 17. 🛡️ SHA / SHIF, Private Insurance & Corporate Schemes

*Built specifically for the realities of Kenyan healthcare reimbursement.*

- **Scheme & Payer Configuration**:
  - **SHA (Social Health Authority / SHIF)** outpatient capitation & fee-for-service rules
  - Private Insurers & TPAs: Jubilee, AAR, Britam, Old Mutual/UAP, APA, Madison, CIC, Minet, Pacific, Liaison, etc.
  - Smart / Slade360 / biometric member verification & pre-authorization reference logging
- **Scheme Rule Engine**:
  - **Co-pay rules** (e.g., Fixed KSh 200 co-pay at registration, or 10% co-pay on drugs)
  - **Benefit sub-limits & Visit Caps** (e.g., Maximum KSh 5,000 per outpatient visit; requires pre-auth code above limit)
  - **Exclusions List** (automatically flags supplements, branded drugs, or cosmetic items not covered by the insurer and bills them to the patient's cash ledger)
- **Claims Lifecycle & Aging Tracker**:
  ```text
  Visit Completed → Claim Vetted & Scrubbed (Check ICD-10 + Signed Claim Form + Invoice)
  → Batched & Submitted to Insurer → Remittance Advice Uploaded
  → Paid / Partially Paid / Rejected (Disputed & Resubmitted)
  ```
- **Insurance Claims Aging Report**:
  - Track unpaid claims at `30 / 60 / 90 / 120+ days` per insurer

---

## 18. 👨‍⚕️ Doctor Commissions, Locum & Referral Payouts

*Essential for Kenyan medical centers that work with visiting specialists, locum doctors, and external business referrals.*

- **Visiting Specialist / Consultant Revenue Split**:
  - Configure automatic split rules (e.g., Consultant gets 70% of specialist consultation fee; clinic retains 30%)
- **Procedure & Investigation Commissions**:
  - Track commission per minor surgery, dental procedure, or ultrasound performed
- **Locum Shift & Hourly Rate Tracking**:
  - Log hours/shifts worked by locum clinical officers, nurses, lab techs, and pharmacists
- **External Business Referral Commission Tracking**:
  - Track revenue generated from diagnostic referrals sent by external clinicians
- Automated monthly Doctor Payout Statement (deducting 5% KRA Withholding Tax where applicable)

---

## 19. 🛒 Procurement & Supplier Replenishment (Vensure Ready)

- Drug & medical consumable reorder alerts based on minimum stock levels and average daily consumption
- Compare drug prices across registered pharmaceutical distributors (e.g., Surgipharm, Phillips, Goodlife wholesale, Medisel, Harley's)
- Generate Purchase Orders (PO) and record Goods Received Notes (GRN) with mandatory Batch, Expiry, and Free/Bonus pack capture
- Track supplier invoices and credit notes for expired/returned drugs
- **Native Versaly Ecosystem Hook**: Option to connect directly into **Vensure** for larger healthcare networks

---

## 20. 💬 Patient Engagement, Follow-Ups & Chronic Care CRM

*Turns one-time walk-in patients into loyal lifetime patients and drives recurring pharmacy refills.*

- **Automated Medication Refill Reminders**:
  - When a hypertension or diabetes patient is dispensed a 30-day supply of medicine, Afyaware automatically sends an SMS/WhatsApp on **Day 27**: *"Hi Mary, your blood pressure medication refill is due in 3 days. Reply 1 to have it prepared or delivered."*
- **Doctor Follow-Up Review Reminders**:
  - Automated SMS reminder 24 hours before a scheduled review date
- **Lab Result Ready Notification**:
  - Automated SMS when routine lab results are verified
- **Post-Visit Feedback & CSAT**:
  - Optional SMS link after discharge asking patient to rate their clinic experience (1–5 stars)

---

## 21. 📱 Patient Portal & Digital Health Wallet (Phase 2)

Patients can log in via mobile web/app to:
- View past prescriptions, lab test results, and vaccination records
- Book doctor or diagnostic appointments
- View their **Patient Account Statement**, outstanding balances, and download receipts
- Request chronic medication refills for home delivery

---

## 22. 🚑 Telemedicine & Home Sample Collection (Phase 2)

- **Video / Audio Tele-Consultation**: Doctor consults remotely while typing into the same EMR screen and sends e-prescription/lab request to the patient
- **Home Phlebotomy (Lab Sample Collection) & Pharmacy Delivery**:
  - Dispatch a mobile nurse/rider to collect lab samples or deliver drugs at the patient's home/office (integrates seamlessly with Versaly's **Feilys** or **Fleesio**)

---

## 23. 🖥️ Clinic Live Operations Workspace

*The real-time command center for the Clinic Manager, Head Nurse, and Medical Superintendent.*

| Panel | What it shows |
|-------|---------------|
| Live Patient Flow | Count of patients currently at Triage, Consultation, Lab, Imaging, Pharmacy, Cashier |
| Resource & Room Occupancy | Which Consultation Rooms, Dental Chairs, Observation Beds & Ultrasound Machines are active |
| Clinical Action Worklists | Unreviewed lab/imaging results, pending nursing procedures, overdue shift tasks |
| Long Wait-Time Alerts | Patients waiting > 30 mins at any station |
| Unbilled / Unpaid Services | Open visits where services were ordered but not yet paid/cleared |
| Critical Lab Results | Panic values awaiting immediate doctor acknowledgment |
| Pharmacy Expiry & Stock Alerts | Drugs expiring within 60 days or out of stock today |
| Pending Insurance Claims | Completed insurance visits missing ICD-10 codes, consent forms, or attachments |
| Cashier Live Collections | Real-time Cash vs. M-Pesa vs. Insurance totals by shift |

---

## 24. 📊 Clinical, Financial & MOH (KHIS) Reporting

**Management can always answer:**
> "How much did we make today across Cash, M-Pesa, and Insurance?" "Which drugs are expiring next month?" "Which insurance company or corporate client hasn't paid us in 90 days?" "Did any lab test or drug leave the clinic without being billed?"

**Financial & Operational Reports:**
- Daily Revenue Summary (by Department: Consultation, Lab, Pharmacy, Imaging, Procedures)
- Patient & Corporate Debtors Aging Report (from Account Ledgers)
- Cashier Shift Reconciliation & M-Pesa Audit Log
- Drug Profitability, Fast/Slow Moving Items, and Expiry Loss Report
- Lab Reagent Consumption vs. Billed Tests Variance Report (detects theft!)
- Insurance Claims Aging, Rejection Analysis, and Remittance Report
- Doctor, Room & Equipment Utilization Report
- Incoming vs. Outgoing Clinical Referrals Summary

**Kenyan Ministry of Health (MOH / KHIS) Statutory Reports:**
- Automated **MOH 705A** (Outpatient Morbidity Summary — Under 5 Years)
- Automated **MOH 705B** (Outpatient Morbidity Summary — Over 5 Years)
- Automated **MOH 706** (Laboratory Summary Report)
- Automated **MOH 710** (Immunization & Vaccines Summary)
- Notifiable Disease Surveillance Alerts

---

## 25. 🔔 Notifications & Clinical Alerts

| Alert | Recipient | Channel |
|-------|-----------|---------|
| Critical / Panic Lab Value | Ordering Doctor | Worklist Popup + SMS |
| Lab / Imaging Result Ready for Review | Ordering Doctor | Clinical Worklist Alert |
| Drug Allergy / Interaction Warning | Doctor & Pharmacist | Screen Modal Lock |
| Mandatory Consent Missing for Procedure | Doctor / Nurse | Screen Warning Gate |
| Drug Batch Expiring (<60 / <30 days) | Pharmacist & Manager | Dashboard + Email |
| Insurance Visit Exceeding Cap Limit | Doctor, Cashier & Reception | Screen Warning |
| Appointment, Balance & Refill Reminders | Patient | SMS / WhatsApp |
| Daily End-of-Day Revenue & Visit Summary | Clinic Owner / Director | WhatsApp / Email |

---

## 26. 🏢 Multi-Branch Clinic & Pharmacy Network

- Manage a single clinic or a chain of 20+ outpatient branches and pharmacies from one account
- **Shared Patient Master Index (EMPI), Documents & Account Ledger**: A patient treated at the *Westlands Branch* can walk into the *Thika Road Branch* and the doctor sees their full medical history, uploaded documents, allergies, and account balance immediately
- Branch-specific rooms, equipment schedules, drug inventory, pricing, and cashier shifts
- Inter-branch drug & reagent stock transfers (with transit tracking)
- Consolidated Head Office financial & clinical dashboard

---

## 27. ⚙️ System Administration, Security & Integrations

**Role-Based Access & Strict Clinical Privacy:**
- Granular roles: Clinic Director, Medical Officer/Doctor, Nurse/Triage, Lab Technologist, Radiographer, Pharmacist, Cashier, Receptionist, Claims Officer, Storekeeper
- **Clinical Privacy Lock**: Cashiers and receptionists see *billable items and account ledgers* only — they **cannot** read confidential doctor consultation notes, uploaded clinical documents, or sensitive diagnoses
- Full immutable audit trail on every prescription edit, bill cancellation, ledger adjustment, consent signature, and lab result modification

**Integrations:**
- **Payments**: M-Pesa Daraja (STK Push & C2B Paybill/Till), Card PDQ, Pesapal
- **Tax Compliance**: KRA eTIMS (OSCU / VSCU)
- **Healthcare / Insurance**: SHA/SHIF Portal hooks, Slade360 / Smart Applications integration
- **Lab Analyzers (Phase 2)**: HL7 / ASTM integration to pull results directly from hematology and biochemistry machines
- **Accounting**: QuickBooks, Xero, Sage, Odoo
- **Versaly Ecosystem**: Native handoff to **Vensure** (Procurement) and **Fleesio** (Ambulance & Home-Delivery Fleet)

---

## Priority Summary (MVP vs. Full Rollout)

| Priority | Module |
|----------|--------|
| 🔴 High | Patient Registration (EMPI) & Multi-Resource Scheduling (`Doctor + Room + Equipment + Slot`) |
| 🔴 High | Triage & Structured Doctor EMR (with ICD-10/11) |
| 🔴 High | Clinical Task & Worklist Management ("Requires Action" Queues) |
| 🔴 High | Pharmacy Management, E-Prescription & Walk-In Retail POS |
| 🔴 High | Drug Batch, FEFO & Expiry Control |
| 🔴 High | Laboratory Information System (LIS) with Reagent Deduction |
| 🔴 High | Cashier, Split Billing, M-Pesa Auto-Reconciliation & KRA eTIMS |
| 🔴 High | Patient Billing Statements & Account Ledger (Deposits, Installments, Balances) |
| 🔴 High | SHA/SHIF & Private Insurance Claims Vetting + Aging Tracker |
| 🔴 High | MOH 705A / 705B Automated Morbidity Reports |
| 🟠 Medium | Clinical Document & Attachment Vault (Patient / Visit / Order Level) |
| 🟠 Medium | Patient Consent & Clinical Forms (with Digital Signature & Versioning) |
| 🟠 Medium | Clinical Referral Management (Incoming & Outgoing Continuity of Care) |
| 🟠 Medium | Minor Procedures, Nursing Station & Observation Day-Ward |
| 🟠 Medium | Doctor Commissions & Locum Payouts |
| 🟠 Medium | Chronic Care Medication Refill Reminders (SMS/WhatsApp) |
| 🟠 Medium | Specialist Templates (MCH/ANC, Dental, Optical) |
| 🟠 Medium | Multi-Branch Patient History & Inter-Branch Stock Transfers |
| 🟢 Recommended | Clinic Live Operations Workspace & Owner Daily WhatsApp Digest |
| 🟡 Phase 2 | Patient Portal, Telemedicine & Lab Machine (HL7) Interfacing |

---

*Afyaware by Versaly — Clinical clarity. Zero revenue leakage. Built for modern African healthcare.*
