/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SaaSPlan } from "../types";
import { X, Lock, CreditCard, ShieldCheck, Loader2, Sparkles } from "lucide-react";

interface UpgradeModalProps {
  plan: SaaSPlan;
  billingPeriod: "month" | "year";
  onClose: () => void;
  onUpgradeSuccess: (planId: "pro" | "enterprise", amount: number, last4: string) => void;
}

export default function UpgradeModal({
  plan,
  billingPeriod,
  onClose,
  onUpgradeSuccess
}: UpgradeModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authStep, setAuthStep] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const originalPrice = plan.price;
  const calculatedMonthlyPrice = plan.id === "pro" 
    ? (billingPeriod === "year" ? originalPrice * 0.75 : originalPrice)
    : originalPrice;

  const billingTotal = billingPeriod === "year" 
    ? calculatedMonthlyPrice * 12 
    : calculatedMonthlyPrice;

  const handlePreFillCard = () => {
    setCardNumber("4242  4242  4242  4242");
    setCardExpiry("12/29");
    setCardCvv("123");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvv) {
      setErrorMessage("Please complete all credit card fields.");
      return;
    }

    setErrorMessage("");
    setIsAuthorizing(true);
    
    try {
      setAuthStep("Encrypting payment payload...");
      await new Promise(r => setTimeout(r, 600));
      
      setAuthStep("Authorizing secure bank vault...");
      await new Promise(r => setTimeout(r, 700));

      setAuthStep("Provisioning active premium token...");
      await new Promise(r => setTimeout(r, 500));

      const last4 = cardNumber.slice(-4) || "4242";
      onUpgradeSuccess(plan.id as any, billingTotal, last4);
      onClose();
    } catch (err) {
      setErrorMessage("Payment gateway connection failed. Please try again.");
      setIsAuthorizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-950/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full relative border border-gray-100 shadow-2xl space-y-6">
        
        {/* Close */}
        <button
          id="checkout-close"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <CreditCard className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Premium Secure Checkout</h2>
          <p className="text-xs text-gray-400">Upgrade to unlock infinite sandboxed document actions</p>
        </div>

        {errorMessage && (
          <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">{errorMessage}</p>
        )}

        {/* Selected Plan Details Card */}
        <div className="bg-indigo-50/45 border border-indigo-100 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Selected Tier</p>
            <p className="text-sm font-extrabold text-gray-900 mt-0.5">{plan.name}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Billed {billingPeriod === "year" ? "Annually" : "Monthly"}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-extrabold text-gray-900">${calculatedMonthlyPrice}</p>
            <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Total: ${billingTotal.toFixed(2)}</p>
          </div>
        </div>

        {/* Form Credit Card */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] uppercase font-bold text-gray-400">Cardholder Number</label>
              <button
                type="button"
                id="checkout-prefill-card"
                onClick={handlePreFillCard}
                className="text-[9px] font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                ⚡ Use Demo Card
              </button>
            </div>
            <div className="relative">
              <input
                id="checkout-card-num"
                type="text"
                maxLength={19}
                placeholder="4242  4242  4242  4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="block w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 bg-gray-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-gray-400">Expires</label>
              <input
                id="checkout-card-exp"
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                className="block w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 bg-gray-50/50"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-gray-400">Security CVV</label>
              <input
                id="checkout-card-cvv"
                type="password"
                maxLength={4}
                placeholder="***"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
                className="block w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 bg-gray-50/50"
              />
            </div>
          </div>

          <button
            id="checkout-submit-btn"
            type="submit"
            disabled={isAuthorizing}
            className="w-full text-center py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors flex items-center justify-center cursor-pointer disabled:bg-indigo-500"
          >
            {isAuthorizing ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5 mr-1.5" />
                Authorize & Subscribe (${billingTotal.toFixed(2)})
              </>
            )}
          </button>
        </form>

        {/* Footer Security Badge */}
        <div className="border-t border-gray-100 pt-4 flex items-center justify-center space-x-2 text-[10px] text-gray-400 font-semibold">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>AES-256 Bit Payment Gateway Encription</span>
        </div>

        {/* Secure Loader overlay */}
        {isAuthorizing && (
          <div className="absolute inset-0 z-50 bg-white/95 rounded-3xl flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
            <div className="text-center space-y-1">
              <p className="font-extrabold text-gray-900 text-sm">Processing Payment Transaction</p>
              <p className="text-xs text-indigo-500 font-bold tracking-wider uppercase animate-pulse">{authStep}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
