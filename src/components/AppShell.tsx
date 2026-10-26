"use client";

import React, { useState } from "react";
import { useAfyaware, ActiveModuleId } from "@/lib/store";
import { UserRole } from "@/lib/types";
import { LiveOpsWorkspace } from "./modules/LiveOpsWorkspace";
import { SystemAdminSecurity } from "./modules/SystemAdminSecurity";
import { EmpiSchedulingModule } from "./modules/EmpiSchedulingModule";
import { TriageModule } from "./modules/TriageModule";
import { EmrWorklistsModule } from "./modules/EmrWorklistsModule";
import { LisImagingWardModule } from "./modules/LisImagingWardModule";
import { PharmacyInventoryModule } from "./modules/PharmacyInventoryModule";
import { CashierInsuranceModule } from "./modules/CashierInsuranceModule";
import { SpecialistReferralsCrmModule } from "./modules/SpecialistReferralsCrmModule";
import { MohReportsNetworkModule } from "./modules/MohReportsNetworkModule";
import { AfyawareLogoIcon } from "@/components/AfyawareLogoIcon";
import {
  Activity,
  Bell,
  Building2,
  CalendarClock,
  CreditCard,
  FileBarChart2,
  FlaskConical,
  HeartHandshake,
  Lock,
  Pill,
  ShieldCheck,
  Stethoscope,
  Unlock,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

const ROLES: UserRole[] = [
  "Clinic Director",
  "Medical Officer / Doctor",
  "Nurse / Triage",
  "Lab Technologist",
  "Radiographer",
  "Pharmacist",
  "Cashier",
  "Receptionist",
  "Claims Officer",
  "Storekeeper",
];

interface NavItem {
  id: ActiveModuleId;
  label: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "live-ops",
    label: "Live Operations Center",
    category: "Operations",
    icon: Activity,
  },
  {
    id: "empi-Scheduling",
    label: "Patient Master Index & Scheduling",
    category: "Reception",
    icon: CalendarClock,
  },
  {
    id: "triage",
    label: "Triage & Nursing Station",
    category: "Nursing",
    icon: UserCheck,
  },
  {
    id: "emr-worklists",
    label: "Doctor EMR & Clinical Records",
    category: "Clinical",
    icon: Stethoscope,
  },
  {
    id: "lis-imaging-ward",
    label: "LIS Lab, Imaging & Observation",
    category: "Diagnostics",
    icon: FlaskConical,
  },
  {
    id: "pharmacy-inventory",
    label: "Pharmacy & FEFO Inventory",
    category: "Pharmacy",
    icon: Pill,
  },
  {
    id: "cashier-insurance",
    label: "Billing, eTIMS & Insurance Claims",
    category: "Finance",
    icon: CreditCard,
  },
  {
    id: "specialist-referrals-crm",
    label: "Specialist Clinics & Referrals",
    category: "Specialized",
    icon: HeartHandshake,
  },
  {
    id: "moh-reports-network",
    label: "MOH KHIS Reports & Multi-Branch",
    category: "Statutory",
    icon: FileBarChart2,
  },
  {
    id: "admin-security",
    label: "System Security & Audit Trail",
    category: "Security",
    icon: ShieldCheck,
  },
];

export function AppShell() {
  const {
    currentRole,
    setCurrentRole,
    canViewClinicalConfidential,
    activeBranchId,
    setActiveBranchId,
    activeModule,
    setActiveModule,
    branches,
    alerts,
    acknowledgeAlert,
  } = useAfyaware();

  const [alertsDrawerOpen, setAlertsDrawerOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const activeBranch =
    branches.find((b) => b.id === activeBranchId) || branches[0];
  const unackedAlerts = alerts.filter((a) => !a.acknowledged);

  const renderModuleContent = () => {
    switch (activeModule) {
      case "live-ops":
        return <LiveOpsWorkspace />;
      case "empi-Scheduling":
        return <EmpiSchedulingModule />;
      case "triage":
        return <TriageModule />;
      case "emr-worklists":
        return <EmrWorklistsModule />;
      case "lis-imaging-ward":
        return <LisImagingWardModule />;
      case "pharmacy-inventory":
        return <PharmacyInventoryModule />;
      case "cashier-insurance":
        return <CashierInsuranceModule />;
      case "specialist-referrals-crm":
        return <SpecialistReferralsCrmModule />;
      case "moh-reports-network":
        return <MohReportsNetworkModule />;
      case "admin-security":
        return <SystemAdminSecurity />;
      default: {
        const nav = NAV_ITEMS.find((n) => n.id === activeModule);
        return (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-900">
              Workspace
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-3">
              {nav?.label}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              All underlying TypeScript domain schemas, RBAC privacy gates, and Kenyan clinical seed records are active in the global clinic store.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => setActiveModule("live-ops")}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                Return to Live Operations Center
              </button>
              <button
                onClick={() => setActiveModule("admin-security")}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Inspect RBAC & Integrations
              </button>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-slate-100 text-slate-900 overflow-hidden relative">
      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-950/70 z-40 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Left Clinical Sidebar (Independent Scrolling on desktop, Drawer on mobile) */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-950 text-slate-100 flex flex-col shrink-0 border-r border-slate-800 no-print h-full overflow-hidden transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sticky Sidebar Header: Brand & Public Website Link */}
        <div className="p-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AfyawareLogoIcon size="sm" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-white">
                    AFYAWARE OS
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    KE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Clinic, Pharmacy & Lab
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-semibold transition cursor-pointer"
                title="Open Public Clinic Website in new tab"
              >
                <span>Site</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white"
                title="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Middle Section: Branch Selector & Modules List */}
        <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-slate-850">
          {/* Branch Selector */}
          <div className="p-3 bg-slate-900/60">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1.5">
              <Building2 className="w-3.5 h-3.5 text-teal-400" />
              Active Clinic Branch
            </label>
            <select
              value={activeBranchId}
              onChange={(e) => setActiveBranchId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-teal-500"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
              <span>Till: {activeBranch.mpesaTill}</span>
              <span>eTIMS: {activeBranch.etimsSerial}</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-2.5 space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Clinical & Operations
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-teal-600 text-white shadow-sm"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-white" : "text-teal-400"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0 uppercase tracking-wider ${
                      isActive
                        ? "bg-teal-800/80 text-teal-100"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {item.category}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sticky Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-[10px] text-slate-400 space-y-0.5 shrink-0">
          <div className="font-semibold text-slate-200 flex items-center justify-between">
            <span>Versaly Healthcare Cloud</span>
            <span className="text-emerald-400 font-bold">● Online</span>
          </div>
          <div>SHA/SHIF • KRA eTIMS • MOH KHIS</div>
        </div>
      </aside>

      {/* Main Content Area (Independent Scrolling) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Clinical Context Bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 no-print">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-none">
                  {activeBranch.name}
                </span>
                <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  {activeBranch.activeRooms}/{activeBranch.totalRooms} Rooms Active
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span className="truncate max-w-[150px] sm:max-w-none">{activeBranch.location}</span>
                <span>•</span>
                <span>KRA PIN: {activeBranch.kraPin}</span>
              </div>
            </div>
          </div>

          {/* Right Controls: Role Switcher, Clinical Privacy Indicator, Alerts Bell */}
          <div className="flex items-center gap-3">
            {/* Clinical Privacy Badge */}
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                canViewClinicalConfidential
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-amber-50 text-amber-900 border-amber-300"
              }`}
            >
              {canViewClinicalConfidential ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                  Clinical EMR Unlocked
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  Clinical Privacy Lock Active
                </>
              )}
            </div>

            {/* Role Selector */}
            <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-1.5 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">
                Role:
              </span>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setAlertsDrawerOpen(!alertsDrawerOpen)}
                className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                title="Clinical Alerts & Notifications"
              >
                <Bell className="w-4 h-4" />
                {unackedAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {unackedAlerts.length}
                  </span>
                )}
              </button>

              {alertsDrawerOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">
                      Clinical Alerts & Notifications
                    </span>
                    <button
                      onClick={() => setAlertsDrawerOpen(false)}
                      className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-2">
                    {alerts.map((a) => (
                      <div key={a.id} className="py-2.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">
                            {a.title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {a.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          {a.message}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[10px] text-teal-700 font-semibold">
                            {a.channel}
                          </span>
                          {!a.acknowledged ? (
                            <button
                              onClick={() => acknowledgeAlert(a.id)}
                              className="px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-semibold cursor-pointer"
                            >
                              Acknowledge
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-700 font-bold inline-flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Acked
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="p-6 flex-1 overflow-y-auto">{renderModuleContent()}</main>
      </div>
    </div>
  );
}
