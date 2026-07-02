/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: "user" | "admin";
  isPremium: boolean;
  subscriptionPlan: "free" | "pro" | "enterprise";
  subscriptionId?: string;
  subscriptionExpiresAt?: string;
  creditsUsedToday: number;
  dailyLimit: number; // e.g. 3 for free, 99999 for premium
  createdAt: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  category: "pdf" | "image" | "convert";
  route: string;
  popular?: boolean;
  active: boolean;
  usageCount: number;
}

export interface UsageLog {
  id: string;
  userId: string;
  userEmail: string;
  toolId: string;
  toolName: string;
  timestamp: string;
  fileName: string;
  fileSize: number; // in bytes
  status: "success" | "error";
  duration: number; // in ms
}

export interface BillingTransaction {
  id: string;
  userId: string;
  userEmail: string;
  planName: "Pro Plan" | "Enterprise Plan";
  amount: number;
  currency: string;
  status: "succeeded" | "failed" | "refunded";
  timestamp: string;
  paymentMethod: string; // e.g. "Visa **** 4242"
  invoiceUrl?: string;
}

export interface SaaSPlan {
  id: "free" | "pro" | "enterprise";
  name: string;
  price: number;
  interval: "month" | "year";
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface SystemSettings {
  freeDailyLimit: number;
  maintenanceMode: boolean;
  allowAnonymousAccess: boolean;
  pricingProMonthly: number;
  pricingProYearly: number;
}
