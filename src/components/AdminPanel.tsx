/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserProfile, UsageLog, BillingTransaction, SystemSettings } from "../types";
import { 
  Users, 
  Activity, 
  DollarSign, 
  Settings, 
  ToggleLeft, 
  ToggleRight, 
  UserCheck, 
  ShieldAlert, 
  Search, 
  Info,
  Layers,
  Sparkles,
  Calendar,
  AlertTriangle
} from "lucide-react";

interface AdminPanelProps {
  currentUser: UserProfile | null;
  usersList: UserProfile[];
  usageLogs: UsageLog[];
  transactions: BillingTransaction[];
  systemSettings: SystemSettings;
  onUpdateSettings: (settings: Partial<SystemSettings>) => void;
  onUpdateUser: (userId: string, updates: Partial<UserProfile>) => void;
}

export default function AdminPanel({
  currentUser,
  usersList,
  usageLogs,
  transactions,
  systemSettings,
  onUpdateSettings,
  onUpdateUser
}: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "logs" | "settings">("users");

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 flex items-center justify-center font-sans">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-gray-150 shadow-sm space-y-4">
          <ShieldAlert className="h-10 w-10 text-red-500 mx-auto" />
          <h2 className="text-lg font-extrabold text-gray-900">Access Restricted</h2>
          <p className="text-xs text-gray-500">Only authorized administrators are allowed to view this cockpit. Please log in using an Admin account.</p>
        </div>
      </div>
    );
  }

  // Calculate high-level KPI cards
  const totalUsers = usersList.length;
  const totalJobs = usageLogs.length;
  const premiumUsers = usersList.filter(u => u.isPremium).length;
  const totalRevenue = transactions
    .filter(t => t.status === "succeeded")
    .reduce((acc, t) => acc + t.amount, 0);

  const filteredUsers = usersList.filter(u => 
    u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.uid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen py-12 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Cockpit Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-100">
              <ShieldAlert className="h-3 w-3" />
              <span>Admin Cockpit</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 mt-2">DocuTools SaaS Administration</h1>
            <p className="text-xs text-gray-400 mt-1">Configure global pricing thresholds, handle security updates, and manage user entitlements.</p>
          </div>
          
          <div className="flex items-center space-x-2 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 p-3 rounded-2xl max-w-sm">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Admin changes write directly to central state in App.tsx memory, simulating true live CRUD logic.</span>
          </div>
        </div>

        {/* Global KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Registered Users", value: totalUsers, icon: Users, color: "text-blue-600 bg-blue-50" },
            { title: "Processed Documents", value: totalJobs, icon: Activity, color: "text-indigo-600 bg-indigo-50" },
            { title: "Premium Accounts", value: premiumUsers, icon: Sparkles, color: "text-amber-600 bg-amber-50" },
            { title: "Accrued Revenue (USD)", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-emerald-600 bg-emerald-50" }
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm flex items-center space-x-4">
                <div className={`p-4.5 rounded-2xl ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{card.title}</p>
                  <p className="text-xl font-extrabold text-gray-900 mt-1">{card.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 bg-gray-150 p-1 rounded-2xl w-fit mb-8 border border-gray-200/50 text-xs font-semibold">
          <button
            id="admin-tab-users"
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "users" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Users className="h-3.5 w-3.5 inline mr-1.5" />
            User Directory ({usersList.length})
          </button>
          <button
            id="admin-tab-logs"
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "logs" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Activity className="h-3.5 w-3.5 inline mr-1.5" />
            Global System Logs ({usageLogs.length})
          </button>
          <button
            id="admin-tab-settings"
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "settings" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Settings className="h-3.5 w-3.5 inline mr-1.5" />
            Platform Configs
          </button>
        </div>

        {/* TAB content: User Directory */}
        {activeTab === "users" && (
          <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">User Administration</h2>
                <p className="text-xs text-gray-400 mt-0.5">Edit user properties, update daily allowances, and manage access tokens.</p>
              </div>

              {/* User search bar */}
              <div className="relative max-w-xs w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  id="admin-user-search"
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 bg-gray-50/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100 font-semibold">
                    <th className="py-3 px-4">User Details</th>
                    <th className="py-3 px-4">Daily Credits Limit</th>
                    <th className="py-3 px-4">SaaS Tier</th>
                    <th className="py-3 px-4">Role Access</th>
                    <th className="py-3 px-4 text-right">Overrides</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium">
                  {filteredUsers.map((user) => (
                    <tr key={user.uid} className="hover:bg-gray-50/40">
                      {/* Name Card */}
                      <td className="py-4 px-4 flex items-center space-x-3">
                        <img
                          className="h-9 w-9 rounded-xl object-cover"
                          src={user.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`}
                          alt={user.displayName}
                        />
                        <div>
                          <p className="font-bold text-gray-900">{user.displayName}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{user.email}</p>
                        </div>
                      </td>

                      {/* Usage credits tracker */}
                      <td className="py-4 px-4 text-gray-600">
                        {user.isPremium ? (
                          <span className="font-semibold text-indigo-500">Unlimited (Premium)</span>
                        ) : (
                          <span>{user.creditsUsedToday} / {user.dailyLimit} files used</span>
                        )}
                      </td>

                      {/* Tier Tag */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          user.isPremium 
                            ? "bg-amber-50 text-amber-700 border-amber-100" 
                            : "bg-gray-50 text-gray-500 border-gray-150"
                        }`}>
                          {user.subscriptionPlan}
                        </span>
                      </td>

                      {/* Role Tag */}
                      <td className="py-4 px-4 capitalize text-gray-700">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                          user.role === "admin" 
                            ? "bg-rose-50 text-rose-700 border border-rose-100" 
                            : "bg-blue-50 text-blue-700 border border-blue-100"
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Direct CRUD State Modifications */}
                      <td className="py-4 px-4 text-right space-x-2">
                        {/* Upgrade/Downgrade Button */}
                        <button
                          id={`admin-toggle-premium-${user.uid}`}
                          onClick={() => onUpdateUser(user.uid, {
                            isPremium: !user.isPremium,
                            subscriptionPlan: !user.isPremium ? "pro" : "free",
                            dailyLimit: !user.isPremium ? 99999 : systemSettings.freeDailyLimit
                          })}
                          className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold rounded-lg border cursor-pointer ${
                            user.isPremium
                              ? "bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-150"
                              : "bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-500"
                          }`}
                        >
                          {user.isPremium ? "Revoke Premium" : "Grant Premium"}
                        </button>

                        {/* Toggle Role Button */}
                        <button
                          id={`admin-toggle-role-${user.uid}`}
                          onClick={() => onUpdateUser(user.uid, {
                            role: user.role === "admin" ? "user" : "admin"
                          })}
                          disabled={user.uid === currentUser.uid} // Can't de-admin oneself
                          className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold rounded-lg border border-gray-200/85 text-gray-700 hover:bg-gray-50 cursor-pointer ${
                            user.uid === currentUser.uid ? "opacity-40 cursor-not-allowed" : ""
                          }`}
                        >
                          Make {user.role === "admin" ? "User" : "Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB content: Global Conversion Logs */}
        {activeTab === "logs" && (
          <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Aggregate Platform Conversions</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100 font-semibold">
                    <th className="py-3 px-4">Source User</th>
                    <th className="py-3 px-4">Processed Document</th>
                    <th className="py-3 px-4">Utility Type</th>
                    <th className="py-3 px-4">Timestamp (UTC)</th>
                    <th className="py-3 px-4 text-right">Transaction outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium">
                  {usageLogs.slice().reverse().map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/40">
                      <td className="py-3 px-4">
                        <p className="font-bold text-gray-900">{log.userEmail}</p>
                        <p className="text-[9px] text-gray-400 font-mono mt-0.5">ID: {log.userId}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-700 max-w-xs truncate font-bold">{log.fileName}</td>
                      <td className="py-3 px-4 text-gray-600 font-semibold">{log.toolName}</td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(log.timestamp).toISOString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          log.status === "success"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB content: Platform Settings */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Global Settings Block */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm space-y-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Settings Configuration</h2>
              
              <div className="space-y-6">
                {/* Free credit adjustment */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Free Daily Credits Allowance</label>
                  <div className="flex items-center space-x-4">
                    <input
                      id="admin-limit-slider"
                      type="range"
                      min={1}
                      max={15}
                      value={systemSettings.freeDailyLimit}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        onUpdateSettings({ freeDailyLimit: val });
                      }}
                      className="w-full h-2 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <span className="font-extrabold text-sm text-gray-900 w-8">{systemSettings.freeDailyLimit}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-normal">Determines the threshold count of daily browser conversions permitted before paywall checkout locks are triggered for free tier profiles.</p>
                </div>

                {/* Maintenance Toggle */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Global Maintenance Override</label>
                    <p className="text-[10px] text-gray-400 mt-1 leading-normal">Forces a platform lock template blocking conversions across all tools for scheduled system maintenance.</p>
                  </div>

                  <button
                    id="admin-toggle-maintenance"
                    onClick={() => onUpdateSettings({ maintenanceMode: !systemSettings.maintenanceMode })}
                    className="text-indigo-600 focus:outline-none cursor-pointer hover:opacity-85"
                  >
                    {systemSettings.maintenanceMode ? (
                      <ToggleRight className="h-9 w-9 text-rose-600" />
                    ) : (
                      <ToggleLeft className="h-9 w-9 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Settings Panel */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Pricing Adjustments Threshold</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150">
                    <p className="text-[10px] uppercase font-bold text-gray-400">Pro Plan Threshold</p>
                    <p className="text-lg font-extrabold text-gray-900 mt-1">${systemSettings.pricingProMonthly}.00 / month</p>
                    <p className="text-[10px] text-gray-400 mt-1">Calculated Annual cost: ${systemSettings.pricingProYearly}.00 ($9.00/mo)</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs bg-indigo-50/50 border border-indigo-100 p-3.5 rounded-2xl text-gray-600">
                    <Info className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                    <span className="leading-relaxed">These parameters serve as reactive state triggers in memory. Modify slider configurations to instantly change billing visual thresholds throughout the app checkout components.</span>
                  </div>
                </div>
              </div>

              {systemSettings.maintenanceMode && (
                <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-[10px] flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
                  <span>PLATFORM IS CURRENTLY LOCKED IN MAINTENANCE. ALL NON-ADMIN USERS WILL BE BLOCKED FROM LAUNCHING TOOLS.</span>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
