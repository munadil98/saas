/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserProfile } from "../types";
import { 
  FileCode, 
  User, 
  Settings, 
  CreditCard, 
  LogOut, 
  Layers, 
  ShieldAlert, 
  Menu, 
  X,
  Zap
} from "lucide-react";

interface NavbarProps {
  currentUser: UserProfile | null;
  currentView: string;
  onNavigate: (view: string, toolId?: string) => void;
  onLogout: () => void;
  onTriggerAuth: (role?: "user" | "admin") => void;
  onTriggerUpgrade: () => void;
}

export default function Navbar({
  currentUser,
  currentView,
  onNavigate,
  onLogout,
  onTriggerAuth,
  onTriggerUpgrade
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getCreditsText = () => {
    if (!currentUser) return "3 / 3 credits left";
    if (currentUser.isPremium) return "Unlimited Access";
    const remaining = Math.max(0, currentUser.dailyLimit - currentUser.creditsUsedToday);
    return `${remaining} / ${currentUser.dailyLimit} free left`;
  };

  const remainingRatio = currentUser 
    ? (currentUser.isPremium ? 1 : Math.max(0, currentUser.dailyLimit - currentUser.creditsUsedToday) / currentUser.dailyLimit)
    : 1;

  return (
    <nav className="sticky top-0 z-50 bg-[#E4E3E0] border-b border-[#141414] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              id="nav-logo-btn"
              onClick={() => { onNavigate("home"); setMobileMenuOpen(false); }}
              className="flex items-center space-x-3 text-left hover:opacity-90 transition-opacity cursor-pointer text-[#141414]"
            >
              <div className="w-9 h-9 bg-[#141414] text-[#E4E3E0] flex items-center justify-center font-bold text-base font-mono border border-[#141414]">
                DT
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest leading-none">Workspace</span>
                <span className="text-lg font-serif italic text-[#141414] mt-0.5">DocuTools / SaaS</span>
              </div>
            </button>
            
            {/* Nav Links */}
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              <button
                id="nav-home-btn"
                onClick={() => onNavigate("home")}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer border ${
                  currentView === "home"
                    ? "bg-[#141414] text-[#E4E3E0] border-[#141414]"
                    : "bg-transparent text-[#141414] border-transparent hover:border-[#141414]"
                }`}
              >
                All Tools
              </button>
              <button
                id="nav-pricing-btn"
                onClick={() => {
                  onNavigate("home");
                  setTimeout(() => {
                    document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-[#141414] border border-transparent hover:border-[#141414] transition-all cursor-pointer"
              >
                Pricing
              </button>
              <button
                id="nav-about-btn"
                onClick={() => {
                  onNavigate("home");
                  setTimeout(() => {
                    document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-[#141414] border border-transparent hover:border-[#141414] transition-all cursor-pointer"
              >
                About & FAQ
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {/* Credit Tracker with SYS_ONLINE indicator */}
            <div className="flex items-center space-x-4 text-[11px] font-mono text-[#141414]">
              <div className="flex gap-1.5 items-center">
                <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span> 
                <span className="opacity-70">SYS_ONLINE</span>
              </div>
              <div className="opacity-40 border-l border-[#141414] h-4" />
              <div className="flex items-center space-x-1">
                <Zap className={`h-3 w-3 ${currentUser?.isPremium ? "text-amber-600" : "text-gray-400"}`} />
                <span className="font-bold opacity-80">{getCreditsText().toUpperCase()}</span>
              </div>
            </div>

            {/* Premium CTA */}
            {(!currentUser || !currentUser.isPremium) && (
              <button
                id="nav-upgrade-btn"
                onClick={onTriggerUpgrade}
                className="px-3 py-1 border border-[#141414] bg-[#141414] text-[#E4E3E0] text-xs font-mono uppercase tracking-wider cursor-pointer hover:bg-transparent hover:text-[#141414] transition-all"
              >
                Go_Premium
              </button>
            )}

            {/* Auth Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="nav-user-dropdown-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                  className="flex items-center space-x-2 p-1 border border-[#141414] bg-white/40 cursor-pointer hover:bg-white/80 transition-all"
                >
                  <img
                    className="h-8 w-8 object-cover border-r border-[#141414]"
                    src={currentUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser.email}`}
                    alt={currentUser.displayName}
                  />
                  <div className="text-left pr-2 leading-none hidden xl:block">
                    <p className="text-[10px] font-mono font-bold uppercase text-gray-900 truncate max-w-[100px]">{currentUser.displayName}</p>
                    <p className="text-[9px] font-mono opacity-50 text-gray-400 truncate max-w-[100px] mt-0.5">{currentUser.role.toUpperCase()}</p>
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#E4E3E0] border border-[#141414] py-1.5 text-xs font-mono z-50 animate-in fade-in duration-100">
                    <div className="px-4 py-2 border-b border-[#141414]">
                      <p className="text-[9px] text-gray-400 uppercase">Profile Session</p>
                      <p className="font-bold text-[#141414] truncate mt-0.5">{currentUser.displayName}</p>
                      {currentUser.isPremium ? (
                        <span className="inline-flex items-center mt-1.5 px-2 py-0.5 text-[9px] font-bold bg-[#141414] text-[#E4E3E0] border border-[#141414]">
                          PREMIUM_{currentUser.subscriptionPlan.toUpperCase()}
                        </span>
                      ) : (
                        <span className="inline-flex items-center mt-1.5 px-2 py-0.5 text-[9px] font-bold bg-[#DEDCD7] text-[#141414] border border-[#141414]">
                          FREE_ACCOUNT
                        </span>
                      )}
                    </div>
                    
                    <button
                      id="nav-menu-dashboard"
                      onClick={() => { onNavigate("dashboard"); setDropdownOpen(false); }}
                      className={`flex w-full items-center px-4 py-2 text-left hover:bg-[#141414] hover:text-[#E4E3E0] cursor-pointer ${
                        currentView === "dashboard" ? "bg-[#141414] text-[#E4E3E0]" : "text-[#141414]"
                      }`}
                    >
                      <CreditCard className="mr-2 h-3.5 w-3.5" />
                      USAGE & INVOICES
                    </button>

                    {currentUser.role === "admin" && (
                      <button
                        id="nav-menu-admin"
                        onClick={() => { onNavigate("admin"); setDropdownOpen(false); }}
                        className={`flex w-full items-center px-4 py-2 text-left text-red-600 hover:bg-[#141414] hover:text-[#E4E3E0] cursor-pointer ${
                          currentView === "admin" ? "bg-[#141414] text-[#E4E3E0]" : ""
                        }`}
                      >
                        <ShieldAlert className="mr-2 h-3.5 w-3.5" />
                        ADMIN_COCKPIT
                      </button>
                    )}

                    <div className="border-t border-[#141414] my-1"></div>
                    
                    <button
                      id="nav-menu-logout"
                      onClick={() => { onLogout(); setDropdownOpen(false); }}
                      className="flex w-full items-center px-4 py-2 text-left text-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors cursor-pointer"
                    >
                      <LogOut className="mr-2 h-3.5 w-3.5" />
                      SIGN_OUT
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  id="nav-login-link"
                  onClick={() => onTriggerAuth()}
                  className="px-3 py-1 text-xs font-mono uppercase tracking-wider text-[#141414] border border-transparent hover:border-[#141414] transition-colors cursor-pointer"
                >
                  Sign_In
                </button>
                <button
                  id="nav-admin-login-link"
                  onClick={() => onTriggerAuth("admin")}
                  className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[#E4E3E0] bg-[#141414] border border-[#141414] hover:bg-transparent hover:text-[#141414] transition-colors cursor-pointer"
                >
                  Admin_Bypass
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 text-[#141414] hover:bg-[#DEDCD7] border border-transparent hover:border-[#141414] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#E4E3E0] border-b border-[#141414] px-4 pt-2 pb-4 space-y-1 text-xs font-mono">
          {currentUser && (
            <div className="flex items-center space-x-3 pb-3 border-b border-[#141414] mb-3">
              <img
                className="h-10 w-10 object-cover border border-[#141414]"
                src={currentUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser.email}`}
                alt={currentUser.displayName}
              />
              <div>
                <p className="font-bold text-gray-900">{currentUser.displayName}</p>
                <p className="text-[10px] text-gray-400 opacity-70">{currentUser.email}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between py-2 bg-[#DEDCD7] border border-[#141414] px-3 mb-2">
            <span className="flex items-center space-x-1.5">
              <Zap className="h-3 w-3 text-amber-600" />
              <span>{getCreditsText().toUpperCase()}</span>
            </span>
          </div>

          <button
            id="mobile-nav-tools"
            onClick={() => { onNavigate("home"); setMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0]"
          >
            ALL TOOLS
          </button>
          
          {currentUser ? (
            <>
              <button
                id="mobile-nav-dashboard"
                onClick={() => { onNavigate("dashboard"); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0]"
              >
                USAGE & BILLING
              </button>
              
              {currentUser.role === "admin" && (
                <button
                  id="mobile-nav-admin"
                  onClick={() => { onNavigate("admin"); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-[#141414] hover:text-[#E4E3E0]"
                >
                  ADMIN_COCKPIT
                </button>
              )}
              
              <button
                id="mobile-nav-logout"
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-red-600 hover:bg-[#141414] hover:text-[#E4E3E0]"
              >
                SIGN_OUT
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-[#141414] flex flex-col space-y-2">
              <button
                id="mobile-nav-login"
                onClick={() => { onTriggerAuth(); setMobileMenuOpen(false); }}
                className="block w-full text-center py-2 text-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] border border-[#141414] font-bold"
              >
                SIGN_IN
              </button>
              <button
                id="mobile-nav-admin-login"
                onClick={() => { onTriggerAuth("admin"); setMobileMenuOpen(false); }}
                className="block w-full text-center py-2 text-[#E4E3E0] bg-[#141414] border border-[#141414] hover:bg-transparent hover:text-[#141414]"
              >
                ADMIN_BYPASS
              </button>
            </div>
          )}

          {(!currentUser || !currentUser.isPremium) && (
            <button
              id="mobile-nav-upgrade"
              onClick={() => { onTriggerUpgrade(); setMobileMenuOpen(false); }}
              className="w-full text-center mt-2 px-4 py-2 text-[#E4E3E0] bg-[#141414] hover:bg-transparent hover:text-[#141414] border border-[#141414] font-bold"
            >
              GO_PREMIUM
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
