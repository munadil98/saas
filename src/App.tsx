/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import ToolWorkspace from "./components/ToolWorkspace";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import AuthModal from "./components/AuthModal";
import UpgradeModal from "./components/UpgradeModal";

import { UserProfile, UsageLog, BillingTransaction, SystemSettings, SaaSPlan, ToolDefinition } from "./types";
import { INITIAL_TOOLS, MOCK_USERS, MOCK_USAGE_LOGS, MOCK_TRANSACTIONS, DEFAULT_SETTINGS, SAAS_PLANS } from "./data";
import { AlertTriangle, Wrench, ShieldAlert } from "lucide-react";

export default function App() {
  // Global React state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [usersList, setUsersList] = useState<UserProfile[]>(MOCK_USERS);
  const [toolsList, setToolsList] = useState<ToolDefinition[]>(INITIAL_TOOLS);
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>(MOCK_USAGE_LOGS);
  const [transactions, setTransactions] = useState<BillingTransaction[]>(MOCK_TRANSACTIONS);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  
  // View Router state
  const [currentView, setCurrentView] = useState<string>("home"); // "home" | "tool" | "dashboard" | "admin"
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  
  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<"user" | "admin">("user");
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<SaaSPlan | null>(null);
  const [upgradeBillingPeriod, setUpgradeBillingPeriod] = useState<"month" | "year">("month");

  // Keep state sync across lists
  useEffect(() => {
    if (currentUser) {
      const updatedList = usersList.map(u => u.uid === currentUser.uid ? currentUser : u);
      // Only set if different to prevent renders loop
      if (JSON.stringify(updatedList) !== JSON.stringify(usersList)) {
        setUsersList(updatedList);
      }
    }
  }, [currentUser]);

  const handleNavigate = (view: string, toolId?: string) => {
    setCurrentView(view);
    if (toolId) {
      setSelectedToolId(toolId);
    } else {
      setSelectedToolId(null);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("home");
  };

  const handleTriggerAuth = (role: "user" | "admin" = "user") => {
    setAuthDefaultRole(role);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    // Add to users list if new
    if (!usersList.some(u => u.uid === user.uid)) {
      setUsersList(prev => [...prev, user]);
    }
  };

  const handleTriggerUpgrade = () => {
    const proPlan = SAAS_PLANS.find(p => p.id === "pro") || null;
    setSelectedPlanForUpgrade(proPlan);
    setUpgradeBillingPeriod("month");
    setUpgradeModalOpen(true);
  };

  const handleSelectUpgradePlan = (plan: SaaSPlan, billingPeriod: "month" | "year") => {
    if (!currentUser) {
      handleTriggerAuth();
      return;
    }
    
    // If selecting free plan, clear premium
    if (plan.id === "free") {
      setCurrentUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          isPremium: false,
          subscriptionPlan: "free",
          dailyLimit: systemSettings.freeDailyLimit
        };
      });
      return;
    }

    setSelectedPlanForUpgrade(plan);
    setUpgradeBillingPeriod(billingPeriod);
    setUpgradeModalOpen(true);
  };

  const handleUpgradeSuccess = (planId: "pro" | "enterprise", amount: number, last4: string) => {
    if (!currentUser) return;

    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    const updatedUser: UserProfile = {
      ...currentUser,
      isPremium: true,
      subscriptionPlan: planId,
      subscriptionId: `sub_${planId}_${Date.now().toString().slice(-5)}`,
      subscriptionExpiresAt: expires.toISOString(),
      dailyLimit: 99999
    };

    setCurrentUser(updatedUser);

    // Record Billing Transaction
    const newTxn: BillingTransaction = {
      id: `txn-${Date.now().toString().slice(-6)}`,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      planName: planId === "pro" ? "Pro Plan" : "Enterprise Plan",
      amount,
      currency: "USD",
      status: "succeeded",
      timestamp: new Date().toISOString(),
      paymentMethod: `Visa •••• ${last4}`,
      invoiceUrl: "#"
    };

    setTransactions(prev => [newTxn, ...prev]);
  };

  const handleCancelSubscription = () => {
    if (!currentUser) return;

    const updatedUser: UserProfile = {
      ...currentUser,
      isPremium: false,
      subscriptionPlan: "free",
      dailyLimit: systemSettings.freeDailyLimit
    };

    setCurrentUser(updatedUser);
  };

  const handleRecordUsage = (
    toolId: string, 
    toolName: string, 
    fileName: string, 
    fileSize: number, 
    isSuccess: boolean
  ) => {
    // Decrement credits for non-premium users
    if (currentUser) {
      const increment = isSuccess ? 1 : 0;
      setCurrentUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          creditsUsedToday: prev.isPremium ? prev.creditsUsedToday : Math.min(prev.dailyLimit, prev.creditsUsedToday + increment)
        };
      });
    }

    // Append Log
    const newLog: UsageLog = {
      id: `log-${Date.now()}-${Math.random().toString().slice(2, 6)}`,
      userId: currentUser?.uid || "anonymous",
      userEmail: currentUser?.email || "anonymous_user@visitor.com",
      toolId,
      toolName,
      timestamp: new Date().toISOString(),
      fileName,
      fileSize,
      status: isSuccess ? "success" : "error",
      duration: Math.floor(Math.random() * 2000) + 500
    };

    setUsageLogs(prev => [...prev, newLog]);

    // Update global tool popularity counter
    setToolsList(prev => prev.map(t => t.id === toolId ? { ...t, usageCount: t.usageCount + 1 } : t));
  };

  // Admin Cockpit Callbacks
  const handleUpdateSettings = (updates: Partial<SystemSettings>) => {
    setSystemSettings(prev => ({ ...prev, ...updates }));
    
    // If daily limit changes, sync active free users' limits
    if (updates.freeDailyLimit !== undefined) {
      setUsersList(prev => prev.map(u => u.isPremium ? u : { ...u, dailyLimit: updates.freeDailyLimit! }));
      if (currentUser && !currentUser.isPremium) {
        setCurrentUser(prev => prev ? { ...prev, dailyLimit: updates.freeDailyLimit! } : null);
      }
    }
  };

  const handleUpdateUser = (userId: string, updates: Partial<UserProfile>) => {
    setUsersList(prev => prev.map(u => u.uid === userId ? { ...u, ...updates } as UserProfile : u));
    
    // Sync current user session if changed
    if (currentUser && currentUser.uid === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } as UserProfile : null);
    }
  };

  const getSelectedTool = (): ToolDefinition | null => {
    if (!selectedToolId) return null;
    return toolsList.find(t => t.id === selectedToolId) || null;
  };

  // Check Maintenance Lock
  const isMaintenanceLocked = systemSettings.maintenanceMode && currentUser?.role !== "admin";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-indigo-500/10 select-none">
      
      {/* Navbar always visible */}
      <Navbar
        currentUser={currentUser}
        currentView={isMaintenanceLocked ? "maintenance" : currentView}
        onNavigate={isMaintenanceLocked ? () => {} : handleNavigate}
        onLogout={handleLogout}
        onTriggerAuth={handleTriggerAuth}
        onTriggerUpgrade={handleTriggerUpgrade}
      />

      {/* Primary Layout Router */}
      <main className="flex-grow">
        {isMaintenanceLocked ? (
          /* Maintenance View Override */
          <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
            <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-gray-150 shadow-sm space-y-6">
              <div className="mx-auto w-14 h-14 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center">
                <Wrench className="h-8 w-8 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-extrabold text-gray-900">Scheduled System Upgrades</h1>
                <p className="text-xs text-gray-500 leading-relaxed">
                  DocuTools is currently adjusting global WASM processing kernels. Workspaces are briefly locked for standard guest profiles. Admins can log in to audit active modules.
                </p>
              </div>
              <div className="border-t border-gray-100 pt-6">
                <button
                  onClick={() => handleTriggerAuth("admin")}
                  className="inline-flex items-center px-4 py-2 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  <ShieldAlert className="h-4 w-4 mr-1.5" />
                  Admin Bypass Login
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Normal view router */
          <>
            {currentView === "home" && (
              <LandingPage
                tools={toolsList}
                plans={SAAS_PLANS}
                onSelectTool={(toolId) => handleNavigate("tool", toolId)}
                onSelectPlan={handleSelectUpgradePlan}
                isPremium={currentUser?.isPremium || false}
              />
            )}

            {currentView === "tool" && getSelectedTool() && (
              <ToolWorkspace
                tool={getSelectedTool()!}
                currentUser={currentUser}
                onNavigateBack={() => handleNavigate("home")}
                onTriggerUpgrade={handleTriggerUpgrade}
                onRecordUsage={handleRecordUsage}
              />
            )}

            {currentView === "dashboard" && (
              <Dashboard
                currentUser={currentUser}
                usageLogs={usageLogs}
                transactions={transactions}
                onUpgradePlan={handleSelectUpgradePlan}
                onCancelSubscription={handleCancelSubscription}
              />
            )}

            {currentView === "admin" && (
              <AdminPanel
                currentUser={currentUser}
                usersList={usersList}
                usageLogs={usageLogs}
                transactions={transactions}
                systemSettings={systemSettings}
                onUpdateSettings={handleUpdateSettings}
                onUpdateUser={handleUpdateUser}
              />
            )}
          </>
        )}
      </main>

      {/* Footer always visible */}
      <Footer onNavigate={isMaintenanceLocked ? () => {} : handleNavigate} />

      {/* GLOBAL MODALS Overlay */}
      {authModalOpen && (
        <AuthModal
          defaultRole={authDefaultRole}
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {upgradeModalOpen && selectedPlanForUpgrade && (
        <UpgradeModal
          plan={selectedPlanForUpgrade}
          billingPeriod={upgradeBillingPeriod}
          onClose={() => {
            setUpgradeModalOpen(false);
            setSelectedPlanForUpgrade(null);
          }}
          onUpgradeSuccess={handleUpgradeSuccess}
        />
      )}

    </div>
  );
}
