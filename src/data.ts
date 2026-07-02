/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ToolDefinition, SaaSPlan, UserProfile, UsageLog, BillingTransaction, SystemSettings } from "./types";

export const SAAS_PLANS: SaaSPlan[] = [
  {
    id: "free",
    name: "Free Plan",
    price: 0,
    interval: "month",
    description: "Essential tools for occasional document tasks.",
    features: [
      "3 conversions or edits per day",
      "Standard processing speed",
      "Maximum file size of 15MB",
      "Web-only access",
      "Community support"
    ]
  },
  {
    id: "pro",
    name: "Pro Plan",
    price: 12,
    interval: "month",
    description: "Unlimited access to all premium document & image tools.",
    features: [
      "Unlimited conversions & edits",
      "High-speed server processing",
      "Maximum file size of 500MB",
      "Batch file processing",
      "Priority customer support",
      "Secure cloud storage for 30 days"
    ],
    isPopular: true
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    price: 49,
    interval: "month",
    description: "Tailored features and support for high-volume teams.",
    features: [
      "Everything in Pro Plan",
      "Unlimited users & team spaces",
      "Dedicated API key access",
      "Custom branding options",
      "24/7 dedicated account manager",
      "SLA-backed 99.9% uptime"
    ]
  }
];

export const INITIAL_TOOLS: ToolDefinition[] = [
  {
    id: "merge-pdf",
    name: "Merge PDF",
    description: "Combine multiple PDF files into a single, cohesive document in seconds.",
    icon: "FileUp",
    category: "pdf",
    route: "merge-pdf",
    popular: true,
    active: true,
    usageCount: 1482
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    description: "Extract specific page ranges or split every page into separate PDF files.",
    icon: "FileDown",
    category: "pdf",
    route: "split-pdf",
    active: true,
    usageCount: 924
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce PDF file sizes dramatically while preserving optimal visual quality.",
    icon: "Percent",
    category: "pdf",
    route: "compress-pdf",
    popular: true,
    active: true,
    usageCount: 2154
  },
  {
    id: "pdf-to-image",
    name: "PDF to Image",
    description: "Extract high-resolution pages of a PDF document and save them as PNG or JPEG images.",
    icon: "FileImage",
    category: "convert",
    route: "pdf-to-image",
    active: true,
    usageCount: 742
  },
  {
    id: "image-to-pdf",
    name: "Image to PDF",
    description: "Convert single or multiple image files (JPG, PNG, WEBP) into a standard PDF document.",
    icon: "Image",
    category: "convert",
    route: "image-to-pdf",
    active: true,
    usageCount: 1105
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Convert complex PDF documents into editable Microsoft Word (.docx) files.",
    icon: "FileText",
    category: "convert",
    route: "pdf-to-word",
    popular: true,
    active: true,
    usageCount: 3102
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert docx, doc, and rtf files into clean, professional PDF documents.",
    icon: "FileOutput",
    category: "convert",
    route: "word-to-pdf",
    active: true,
    usageCount: 1248
  },
  {
    id: "image-convert",
    name: "Image Format Converter",
    description: "Instantly transcode images between JPEG, PNG, WEBP, and GIF formats.",
    icon: "RefreshCw",
    category: "image",
    route: "image-convert",
    active: true,
    usageCount: 819
  }
];

// Mock Users for Admin Dashboard
export const MOCK_USERS: UserProfile[] = [
  {
    uid: "user-1",
    email: "sarah.connor@gmail.com",
    displayName: "Sarah Connor",
    photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    role: "user",
    isPremium: true,
    subscriptionPlan: "pro",
    subscriptionId: "sub_pro_81239",
    subscriptionExpiresAt: "2026-07-28T14:40:00.000Z",
    creditsUsedToday: 14,
    dailyLimit: 99999,
    createdAt: "2026-01-15T09:30:00.000Z"
  },
  {
    uid: "user-2",
    email: "james.tiberius@gmail.com",
    displayName: "Jim Kirk",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    role: "user",
    isPremium: false,
    subscriptionPlan: "free",
    creditsUsedToday: 2,
    dailyLimit: 3,
    createdAt: "2026-05-10T11:15:00.000Z"
  },
  {
    uid: "user-3",
    email: "elizabeth.b@yahoo.com",
    displayName: "Liz Bennett",
    photoURL: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    role: "user",
    isPremium: true,
    subscriptionPlan: "enterprise",
    subscriptionId: "sub_ent_11234",
    subscriptionExpiresAt: "2027-01-01T00:00:00.000Z",
    creditsUsedToday: 48,
    dailyLimit: 99999,
    createdAt: "2025-12-01T15:20:00.000Z"
  },
  {
    uid: "user-admin",
    email: "admin@saasplatform.com",
    displayName: "Alexander Great (Admin)",
    photoURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    role: "admin",
    isPremium: true,
    subscriptionPlan: "enterprise",
    creditsUsedToday: 0,
    dailyLimit: 99999,
    createdAt: "2025-06-01T08:00:00.000Z"
  }
];

// Pre-populated logs spanning the last 7 days
export const MOCK_USAGE_LOGS: UsageLog[] = [
  {
    id: "log-1",
    userId: "user-1",
    userEmail: "sarah.connor@gmail.com",
    toolId: "merge-pdf",
    toolName: "Merge PDF",
    timestamp: "2026-06-29T11:30:22.000Z",
    fileName: "Q2_Reports_Merged.pdf",
    fileSize: 4820192,
    status: "success",
    duration: 1820
  },
  {
    id: "log-2",
    userId: "user-1",
    userEmail: "sarah.connor@gmail.com",
    toolId: "compress-pdf",
    toolName: "Compress PDF",
    timestamp: "2026-06-29T11:35:10.000Z",
    fileName: "Client_Presentation_Compressed.pdf",
    fileSize: 15920392,
    status: "success",
    duration: 3120
  },
  {
    id: "log-3",
    userId: "user-2",
    userEmail: "james.tiberius@gmail.com",
    toolId: "pdf-to-word",
    toolName: "PDF to Word",
    timestamp: "2026-06-29T10:15:44.000Z",
    fileName: "Charter_Agreement.pdf",
    fileSize: 1240192,
    status: "success",
    duration: 2450
  },
  {
    id: "log-4",
    userId: "user-3",
    userEmail: "elizabeth.b@yahoo.com",
    toolId: "image-to-pdf",
    toolName: "Image to PDF",
    timestamp: "2026-06-29T09:02:11.000Z",
    fileName: "Receipts_Receipts_06_29.pdf",
    fileSize: 8420192,
    status: "success",
    duration: 1200
  },
  {
    id: "log-5",
    userId: "user-2",
    userEmail: "james.tiberius@gmail.com",
    toolId: "image-convert",
    toolName: "Image Format Converter",
    timestamp: "2026-06-29T08:12:05.000Z",
    fileName: "Profile_Avatar.png",
    fileSize: 2048576,
    status: "success",
    duration: 450
  },
  // Day before
  {
    id: "log-6",
    userId: "user-1",
    userEmail: "sarah.connor@gmail.com",
    toolId: "pdf-to-image",
    toolName: "PDF to Image",
    timestamp: "2026-06-28T16:20:00.000Z",
    fileName: "Marketing_Brochure.pdf",
    fileSize: 12500000,
    status: "success",
    duration: 4100
  },
  {
    id: "log-7",
    userId: "user-3",
    userEmail: "elizabeth.b@yahoo.com",
    toolId: "word-to-pdf",
    toolName: "Word to PDF",
    timestamp: "2026-06-28T14:10:00.000Z",
    fileName: "Draft_Proposal.docx",
    fileSize: 950000,
    status: "success",
    duration: 850
  },
  {
    id: "log-8",
    userId: "user-2",
    userEmail: "james.tiberius@gmail.com",
    toolId: "split-pdf",
    toolName: "Split PDF",
    timestamp: "2026-06-28T10:05:00.000Z",
    fileName: "Annual_Plan_Unsplit.pdf",
    fileSize: 4500000,
    status: "error",
    duration: 620
  },
  // Previous days
  {
    id: "log-9",
    userId: "user-3",
    userEmail: "elizabeth.b@yahoo.com",
    toolId: "merge-pdf",
    toolName: "Merge PDF",
    timestamp: "2026-06-27T12:00:00.000Z",
    fileName: "Consolidated_Tax_Docs.pdf",
    fileSize: 19500000,
    status: "success",
    duration: 2900
  },
  {
    id: "log-10",
    userId: "user-1",
    userEmail: "sarah.connor@gmail.com",
    toolId: "compress-pdf",
    toolName: "Compress PDF",
    timestamp: "2026-06-26T15:30:00.000Z",
    fileName: "Video_Release_Forms.pdf",
    fileSize: 41000000,
    status: "success",
    duration: 5400
  },
  {
    id: "log-11",
    userId: "user-3",
    userEmail: "elizabeth.b@yahoo.com",
    toolId: "pdf-to-word",
    toolName: "PDF to Word",
    timestamp: "2026-06-25T11:22:00.000Z",
    fileName: "User_Manual_v2.pdf",
    fileSize: 6400000,
    status: "success",
    duration: 3800
  },
  {
    id: "log-12",
    userId: "user-1",
    userEmail: "sarah.connor@gmail.com",
    toolId: "image-to-pdf",
    toolName: "Image to PDF",
    timestamp: "2026-06-24T09:45:00.000Z",
    fileName: "Design_Sketches.pdf",
    fileSize: 18200000,
    status: "success",
    duration: 2300
  },
  {
    id: "log-13",
    userId: "user-3",
    userEmail: "elizabeth.b@yahoo.com",
    toolId: "split-pdf",
    toolName: "Split PDF",
    timestamp: "2026-06-23T14:15:00.000Z",
    fileName: "Corporate_Bylaws_2026.pdf",
    fileSize: 8900000,
    status: "success",
    duration: 1950
  }
];

export const MOCK_TRANSACTIONS: BillingTransaction[] = [
  {
    id: "txn-1",
    userId: "user-1",
    userEmail: "sarah.connor@gmail.com",
    planName: "Pro Plan",
    amount: 12.00,
    currency: "USD",
    status: "succeeded",
    timestamp: "2026-06-28T14:40:00.000Z",
    paymentMethod: "Visa •••• 4242",
    invoiceUrl: "#"
  },
  {
    id: "txn-2",
    userId: "user-3",
    userEmail: "elizabeth.b@yahoo.com",
    planName: "Enterprise Plan",
    amount: 49.00,
    currency: "USD",
    status: "succeeded",
    timestamp: "2026-06-01T15:20:00.000Z",
    paymentMethod: "Mastercard •••• 8812",
    invoiceUrl: "#"
  },
  {
    id: "txn-3",
    userId: "user-1",
    userEmail: "sarah.connor@gmail.com",
    planName: "Pro Plan",
    amount: 12.00,
    currency: "USD",
    status: "succeeded",
    timestamp: "2026-05-28T14:40:00.000Z",
    paymentMethod: "Visa •••• 4242",
    invoiceUrl: "#"
  },
  {
    id: "txn-4",
    userId: "user-1",
    userEmail: "sarah.connor@gmail.com",
    planName: "Pro Plan",
    amount: 12.00,
    currency: "USD",
    status: "succeeded",
    timestamp: "2026-04-28T14:40:00.000Z",
    paymentMethod: "Visa •••• 4242",
    invoiceUrl: "#"
  }
];

export const DEFAULT_SETTINGS: SystemSettings = {
  freeDailyLimit: 3,
  maintenanceMode: false,
  allowAnonymousAccess: true,
  pricingProMonthly: 12,
  pricingProYearly: 108 // $9/mo billed yearly
};
