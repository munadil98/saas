/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserProfile } from "../types";
import { MOCK_USERS } from "../data";
import { X, LogIn, Mail, ShieldAlert, Sparkles } from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  defaultRole?: "user" | "admin";
}

export default function AuthModal({
  onClose,
  onLoginSuccess,
  defaultRole = "user"
}: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleMockAccountClick = (userId: string) => {
    const matched = MOCK_USERS.find(u => u.uid === userId);
    if (matched) {
      onLoginSuccess(matched);
      onClose();
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter an email address.");
      return;
    }

    // Dynamic user registration/login
    const matched = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (matched) {
      onLoginSuccess(matched);
    } else {
      // Create a new mock user
      const name = email.split("@")[0];
      const newUser: UserProfile = {
        uid: `user-${Date.now()}`,
        email: email,
        displayName: name.charAt(0).toUpperCase() + name.slice(1),
        role: "user",
        isPremium: false,
        subscriptionPlan: "free",
        creditsUsedToday: 0,
        dailyLimit: 3,
        createdAt: new Date().toISOString()
      };
      onLoginSuccess(newUser);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-950/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full relative border border-gray-100 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          id="auth-modal-close"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <LogIn className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Sign in to DocuTools</h2>
          <p className="text-xs text-gray-400">Unlock subscription, history, billing and admin cockpit overlays</p>
        </div>

        {errorMessage && (
          <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">{errorMessage}</p>
        )}

        {/* Single-Click Simulation Profiles */}
        <div className="space-y-3">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Quick Sign-In Test Accounts</p>
          
          <div className="grid grid-cols-1 gap-2.5">
            <button
              id="auth-user-sarah"
              onClick={() => handleMockAccountClick("user-1")}
              className="flex items-center justify-between p-3 bg-indigo-50/45 hover:bg-indigo-50 border border-indigo-100 rounded-2xl text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <img
                  className="h-8 w-8 rounded-lg object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                  alt="Sarah"
                />
                <div>
                  <p className="text-xs font-bold text-gray-900">Sarah Connor</p>
                  <p className="text-[10px] text-indigo-600 font-semibold">Pro Premium Subscriber</p>
                </div>
              </div>
              <Sparkles className="h-4 w-4 text-indigo-500 fill-indigo-200" />
            </button>

            <button
              id="auth-user-james"
              onClick={() => handleMockAccountClick("user-2")}
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100/70 border border-gray-200/80 rounded-2xl text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <img
                  className="h-8 w-8 rounded-lg object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                  alt="Jim"
                />
                <div>
                  <p className="text-xs font-bold text-gray-900">Jim Kirk</p>
                  <p className="text-[10px] text-gray-500 font-semibold">Free Account (Used 2/3 credits)</p>
                </div>
              </div>
            </button>

            <button
              id="auth-user-admin"
              onClick={() => handleMockAccountClick("user-admin")}
              className="flex items-center justify-between p-3 bg-rose-50/45 hover:bg-rose-50 border border-rose-100 rounded-2xl text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <img
                  className="h-8 w-8 rounded-lg object-cover"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
                  alt="Alexander"
                />
                <div>
                  <p className="text-xs font-bold text-gray-900">Alexander Great (Admin)</p>
                  <p className="text-[10px] text-rose-600 font-semibold">System Administrator Cockpit</p>
                </div>
              </div>
              <ShieldAlert className="h-4 w-4 text-rose-500" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-full border-t border-gray-100" />
          <span className="relative px-3 bg-white text-[10px] font-bold uppercase text-gray-400">or sign in with email</span>
        </div>

        {/* Standard Email/Pass Inputs */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] uppercase font-bold text-gray-400">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="auth-email-input"
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 bg-gray-50/50"
              />
            </div>
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            className="w-full text-center py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors cursor-pointer"
          >
            Create / Connect Account
          </button>
        </form>

      </div>
    </div>
  );
}
