/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserProfile, UsageLog, BillingTransaction, SaaSPlan } from "../types";
import { 
  CreditCard, 
  History, 
  Settings, 
  Zap, 
  ArrowUpRight, 
  CheckCircle2, 
  Trash2, 
  File, 
  Lock, 
  FileText,
  Calendar,
  AlertCircle
} from "lucide-react";

interface DashboardProps {
  currentUser: UserProfile | null;
  usageLogs: UsageLog[];
  transactions: BillingTransaction[];
  onUpgradePlan: (plan: SaaSPlan, billingPeriod: "month" | "year") => void;
  onCancelSubscription: () => void;
}

export default function Dashboard({
  currentUser,
  usageLogs,
  transactions,
  onUpgradePlan,
  onCancelSubscription
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"usage" | "billing" | "upgrade">("usage");
  const [billingPeriod, setBillingPeriod] = useState<"month" | "year">("month");

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4 flex items-center justify-center font-sans">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-gray-150 shadow-sm space-y-4">
          <AlertCircle className="h-10 w-10 text-indigo-500 mx-auto" />
          <h2 className="text-lg font-extrabold text-gray-900">Please Sign In First</h2>
          <p className="text-xs text-gray-500">Sign in to unlock subscription management, billing transaction lists, and real-time usage metrics.</p>
        </div>
      </div>
    );
  }

  // Filter logs for this specific user
  const userLogs = usageLogs.filter(log => log.userId === currentUser.uid);
  const userTxns = transactions.filter(txn => txn.userId === currentUser.uid);

  // Calculate stats for SVG chart
  // Group logs by past 7 days: Day names + count of logs
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayName = days[d.getDay()];
    // format as YYYY-MM-DD
    const dateStr = d.toISOString().split("T")[0];
    const count = userLogs.filter(log => log.timestamp.startsWith(dateStr)).length;
    return { day: dayName, count, dateStr };
  });

  const maxCount = Math.max(...last7Days.map(d => d.count), 4);
  const chartHeight = 120;
  const chartWidth = 460;
  const padding = 25;

  // Compute SVG Points for Line Chart
  const svgPoints = last7Days.map((d, index) => {
    const x = padding + (index * (chartWidth - padding * 2)) / 6;
    const y = chartHeight - padding - (d.count * (chartHeight - padding * 2)) / maxCount;
    return `${x},${y}`;
  }).join(" ");

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="bg-[#E4E3E0] min-h-screen py-12 font-sans text-[#141414]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Welcome Block */}
        <div className="bg-white/45 border border-[#141414] p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <img
              className="h-14 w-14 object-cover border border-[#141414]"
              src={currentUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser.email}`}
              alt={currentUser.displayName}
            />
            <div>
              <h1 className="text-2xl font-serif italic text-[#141414]">Hello, {currentUser.displayName}</h1>
              <p className="text-xs font-mono uppercase opacity-60 mt-0.5">Account ID: {currentUser.uid} • Created {new Date(currentUser.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-[#DEDCD7] border border-[#141414] p-3">
            <Zap className="h-5 w-5 text-[#141414]" />
            <div className="text-xs font-mono">
              <p className="font-bold">
                {currentUser.isPremium ? `${currentUser.subscriptionPlan.toUpperCase()} PREMIUM` : "FREE LIMIT MATRIX"}
              </p>
              <p className="opacity-70 mt-0.5">
                {currentUser.isPremium 
                  ? "Infinite local transcoding enabled" 
                  : `${currentUser.dailyLimit - currentUser.creditsUsedToday} / ${currentUser.dailyLimit} remaining today`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-[#DEDCD7] p-1 border border-[#141414] w-fit mb-8 text-xs font-mono">
          <button
            id="tab-usage"
            onClick={() => setActiveTab("usage")}
            className={`px-4 py-2 uppercase transition-all cursor-pointer border border-transparent ${
              activeTab === "usage" ? "bg-[#141414] text-[#E4E3E0] border-[#141414]" : "text-[#141414] hover:bg-white/40"
            }`}
          >
            <History className="h-3.5 w-3.5 inline mr-1.5" />
            SANDBOX_HISTORY
          </button>
          <button
            id="tab-billing"
            onClick={() => setActiveTab("billing")}
            className={`px-4 py-2 uppercase transition-all cursor-pointer border border-transparent ${
              activeTab === "billing" ? "bg-[#141414] text-[#E4E3E0] border-[#141414]" : "text-[#141414] hover:bg-white/40"
            }`}
          >
            <CreditCard className="h-3.5 w-3.5 inline mr-1.5" />
            BILLING_INVOICES
          </button>
          <button
            id="tab-upgrade"
            onClick={() => setActiveTab("upgrade")}
            className={`px-4 py-2 uppercase transition-all cursor-pointer border border-transparent ${
              activeTab === "upgrade" ? "bg-[#141414] text-[#E4E3E0] border-[#141414] font-bold" : "text-[#141414] hover:bg-white/40 font-bold"
            }`}
          >
            <Zap className="h-3.5 w-3.5 inline mr-1.5 fill-current" />
            UPGRADE_SUITE
          </button>
        </div>

        {/* TAB content: Usage Statistics */}
        {activeTab === "usage" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Usage Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-150 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Sandbox Processing Activity</h2>
                <p className="text-xs text-gray-400">Total conversion jobs ran locally inside the browser sandbox in the last week.</p>
              </div>

              {/* High Fidelity SVG Line Chart */}
              <div className="mt-6 border-b border-gray-100 pb-2 relative">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
                  {/* Grid Lines */}
                  <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#F3F4F6" strokeWidth={1} />
                  <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="#F3F4F6" strokeWidth={1} />
                  <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#E5E7EB" strokeWidth={1.5} />

                  {/* Gradient Fill Under Line */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {svgPoints && (
                    <>
                      {/* Area Path */}
                      <path
                        d={`M ${padding},${chartHeight - padding} L ${svgPoints} L ${chartWidth - padding},${chartHeight - padding} Z`}
                        fill="url(#chartGradient)"
                      />
                      {/* Line Path */}
                      <path
                        d={`M ${svgPoints}`}
                        fill="none"
                        stroke="#4F46E5"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-300"
                      />
                    </>
                  )}

                  {/* Data Circles & Value Labels */}
                  {last7Days.map((d, index) => {
                    const x = padding + (index * (chartWidth - padding * 2)) / 6;
                    const y = chartHeight - padding - (d.count * (chartHeight - padding * 2)) / maxCount;
                    return (
                      <g key={index} className="group cursor-pointer">
                        <circle
                          cx={x}
                          cy={y}
                          r={4.5}
                          fill="#FFFFFF"
                          stroke="#4F46E5"
                          strokeWidth={2.5}
                          className="hover:r-6 transition-all"
                        />
                        <text
                          x={x}
                          y={y - 10}
                          textAnchor="middle"
                          className="text-[10px] font-bold text-indigo-600 fill-current opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {d.count}
                        </text>
                        {/* Day Label on X Axis */}
                        <text
                          x={x}
                          y={chartHeight - 6}
                          textAnchor="middle"
                          className="text-[9px] font-semibold text-gray-400 fill-current"
                        >
                          {d.day}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Simple Account Summary Sidebar */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm space-y-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Account Specifications</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-xs pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Subscription Plan</span>
                  <span className="font-extrabold text-indigo-600 uppercase">{currentUser.subscriptionPlan}</span>
                </div>
                <div className="flex justify-between text-xs pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Daily Limit Credit</span>
                  <span className="font-extrabold text-gray-900">{currentUser.isPremium ? "Unlimited" : `${currentUser.dailyLimit} Files / Day`}</span>
                </div>
                <div className="flex justify-between text-xs pb-3 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Role Level</span>
                  <span className="font-semibold text-gray-700 capitalize">{currentUser.role}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Auto-renew Cycle</span>
                  <span className="font-semibold text-gray-600">
                    {currentUser.isPremium ? "Active (Monthly)" : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Conversion Logs Table */}
            <div className="col-span-full bg-white rounded-3xl border border-gray-150 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Sandbox Processing Log</h2>
              
              {userLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-left">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-100 font-semibold">
                        <th className="py-3 px-4">Filename</th>
                        <th className="py-3 px-4">Utility Type</th>
                        <th className="py-3 px-4">File Size</th>
                        <th className="py-3 px-4">Date processed</th>
                        <th className="py-3 px-4 text-right">Conversion status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-medium">
                      {userLogs.slice().reverse().map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50/50">
                          <td className="py-3 px-4 font-bold text-gray-900 flex items-center max-w-xs truncate">
                            <File className="h-4 w-4 mr-2 text-indigo-500 shrink-0" />
                            <span className="truncate">{log.fileName}</span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{log.toolName}</td>
                          <td className="py-3 px-4 text-gray-500">{formatBytes(log.fileSize)}</td>
                          <td className="py-3 px-4 text-gray-400">
                            {new Date(log.timestamp).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              log.status === "success" 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                : "bg-red-50 text-red-700 border-red-100"
                            }`}>
                              {log.status === "success" ? "Success" : "Failed"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-gray-400">
                  <History className="h-8 w-8 text-gray-300 mx-auto" />
                  <p className="font-semibold text-gray-900 mt-2 text-sm">No conversion history</p>
                  <p className="text-xs text-gray-500 mt-1">Conversions executed in the workspace will appear here in real-time.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB content: Billing & Transactions */}
        {activeTab === "billing" && (
          <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Payment and Invoice History</h2>
            
            {userTxns.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs text-left">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-100 font-semibold">
                      <th className="py-3 px-4">Invoice ID</th>
                      <th className="py-3 px-4">Plan Level</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Transaction Date</th>
                      <th className="py-3 px-4">Charge Amount</th>
                      <th className="py-3 px-4 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-medium">
                    {userTxns.map((txn) => (
                      <tr key={txn.id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-4 font-mono font-bold text-gray-700">{txn.id.toUpperCase()}</td>
                        <td className="py-3 px-4 font-bold text-gray-900">{txn.planName}</td>
                        <td className="py-3 px-4 text-gray-600 font-mono text-[10px]">{txn.paymentMethod}</td>
                        <td className="py-3 px-4 text-gray-500">{new Date(txn.timestamp).toLocaleDateString()}</td>
                        <td className="py-3 px-4 font-extrabold text-gray-900">${txn.amount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            id={`invoice-dl-${txn.id}`}
                            onClick={() => alert("Simulated: Raw receipt pdf generated on client-side and saved.")}
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                          >
                            <FileText className="h-3.5 w-3.5 mr-1" />
                            PDF Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400">
                <CreditCard className="h-8 w-8 text-gray-300 mx-auto" />
                <p className="font-semibold text-gray-900 mt-2 text-sm">No transaction statements available</p>
                <p className="text-xs text-gray-500 mt-1">Upgrade your account plan to access high-speed batch files processing.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB content: Manage Subscription */}
        {activeTab === "upgrade" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Active Subscription Status */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Active Subscription Plan</h2>
                
                <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-5 mt-4">
                  <p className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider">Current Tier</p>
                  <p className="text-2xl font-extrabold text-gray-900 mt-1">
                    {currentUser.isPremium ? `${currentUser.subscriptionPlan.toUpperCase()} Plan` : "Free Tier"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {currentUser.isPremium 
                      ? "Your account currently enjoys unlimited high-speed sandbox document processes." 
                      : "Your account is on the standard daily free allowance plan."
                    }
                  </p>
                  
                  {currentUser.isPremium && currentUser.subscriptionExpiresAt && (
                    <p className="text-[11px] font-semibold text-gray-400 mt-4 flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-indigo-500" />
                      Next renewal date: {new Date(currentUser.subscriptionExpiresAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {currentUser.isPremium ? (
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <p className="text-[11px] text-gray-400 leading-normal mb-4">
                    Cancelling your plan returns your limit allowance to 3 conversions per day at the end of your billing cycle. No further amounts will be charged.
                  </p>
                  <button
                    id="cancel-subscription-btn"
                    onClick={onCancelSubscription}
                    className="inline-flex items-center px-4 py-2 border border-red-200 text-xs font-bold rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    Cancel Plan Subscription
                  </button>
                </div>
              ) : (
                <div className="mt-8">
                  <p className="text-[11px] text-gray-400">Unlock high-speed sandbox execution queues, batch document mergers, and 500MB file size tolerances.</p>
                </div>
              )}
            </div>

            {/* Change Subscription Plan Panel */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Subscription Tiers</h2>
              
              {/* Billing Toggle */}
              <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200/50 p-1.5 rounded-xl w-fit text-xs font-semibold mb-6">
                <button
                  id="dashboard-billing-monthly"
                  onClick={() => setBillingPeriod("month")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    billingPeriod === "month" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                  }`}
                >
                  Monthly
                </button>
                <button
                  id="dashboard-billing-yearly"
                  onClick={() => setBillingPeriod("year")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center ${
                    billingPeriod === "year" ? "bg-white text-gray-900 shadow-sm font-bold" : "text-gray-500"
                  }`}
                >
                  Annually
                  <span className="ml-1 px-1.5 py-0.5 text-[9px] bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100">
                    -25%
                  </span>
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { id: "pro", name: "Pro Plan", price: 12, features: ["Infinite Conversions", "Batch Processing", "500MB Limit"] },
                  { id: "enterprise", name: "Enterprise Plan", price: 49, features: ["Everything in Pro", "Dedicated API Key", "SLA Support"] }
                ].map((plan) => {
                  const calculatedPrice = billingPeriod === "year" ? plan.price * 0.75 : plan.price;
                  const isActive = currentUser.isPremium && currentUser.subscriptionPlan === plan.id;
                  
                  return (
                    <div 
                      key={plan.id} 
                      className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                        isActive 
                          ? "border-indigo-500 bg-indigo-50/25" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-extrabold text-gray-900">{plan.name}</p>
                        <p className="text-xl font-extrabold text-gray-900 mt-1">
                          ${calculatedPrice}
                          <span className="text-[10px] text-gray-400 font-normal"> / month</span>
                        </p>
                        <ul className="flex flex-wrap gap-2 mt-2">
                          {plan.features.map((f, i) => (
                            <li key={i} className="text-[9px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">{f}</li>
                          ))}
                        </ul>
                      </div>

                      <button
                        id={`dashboard-buy-${plan.id}`}
                        onClick={() => onUpgradePlan({ id: plan.id as any, name: plan.name, price: plan.price, interval: billingPeriod, features: plan.features } as any, billingPeriod)}
                        disabled={isActive}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-150 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        {isActive ? "Active Plan" : "Upgrade"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
