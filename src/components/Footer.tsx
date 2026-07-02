/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Layers, Github, Heart, Globe, Lock, ShieldCheck } from "lucide-react";

interface FooterProps {
  onNavigate: (view: string, toolId?: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#141414] text-[#E4E3E0] font-sans border-t border-[#141414]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-white font-bold text-lg">
              <div className="w-8 h-8 bg-[#E4E3E0] text-[#141414] flex items-center justify-center font-bold text-sm font-mono border border-[#141414]">
                DT
              </div>
              <span className="font-serif italic text-[#E4E3E0]">DocuTools / SaaS</span>
            </div>
            <p className="text-xs text-gray-400 opacity-80 leading-relaxed">
              Premium client-side document and image transcoding solutions. Built for ultimate speed, security, and exceptional user experience without compromising private data.
            </p>
            <div className="flex items-center space-x-3 text-xs bg-black/40 p-2 border border-[#E4E3E0]/20 text-gray-300 w-fit">
              <Lock className="h-3.5 w-3.5 text-green-400" />
              <span className="font-mono text-[10px] tracking-wider uppercase">LOCAL_SANDBOX_STRICT</span>
            </div>
          </div>

          {/* PDF Utilities Directory */}
          <div>
            <h3 className="text-white text-[11px] font-mono font-semibold uppercase tracking-wider mb-4 border-b border-[#E4E3E0]/20 pb-1">PDF Utilities</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate("tool", "merge-pdf")} className="hover:text-green-400 transition-colors cursor-pointer text-left font-mono text-[11px]">
                  MERGE_PDF_DOCUMENTS
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("tool", "split-pdf")} className="hover:text-green-400 transition-colors cursor-pointer text-left font-mono text-[11px]">
                  SPLIT_EXTRACT_PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("tool", "compress-pdf")} className="hover:text-green-400 transition-colors cursor-pointer text-left font-mono text-[11px]">
                  COMPRESS_PDF_SIZE
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("tool", "pdf-to-image")} className="hover:text-green-400 transition-colors cursor-pointer text-left font-mono text-[11px]">
                  RASTERIZE_PDF_TO_IMG
                </button>
              </li>
            </ul>
          </div>

          {/* Convert Directory */}
          <div>
            <h3 className="text-white text-[11px] font-mono font-semibold uppercase tracking-wider mb-4 border-b border-[#E4E3E0]/20 pb-1">File Convert</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate("tool", "image-to-pdf")} className="hover:text-green-400 transition-colors cursor-pointer text-left font-mono text-[11px]">
                  IMAGE_TO_PDF_BOOK
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("tool", "pdf-to-word")} className="hover:text-green-400 transition-colors cursor-pointer text-left font-mono text-[11px]">
                  PDF_TO_EDITABLE_WORD
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("tool", "word-to-pdf")} className="hover:text-green-400 transition-colors cursor-pointer text-left font-mono text-[11px]">
                  WORD_DOC_TO_PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("tool", "image-convert")} className="hover:text-green-400 transition-colors cursor-pointer text-left font-mono text-[11px]">
                  IMAGE_TRANSCODER
                </button>
              </li>
            </ul>
          </div>

          {/* Legal and Support */}
          <div>
            <h3 className="text-white text-[11px] font-mono font-semibold uppercase tracking-wider mb-4 border-b border-[#E4E3E0]/20 pb-1">Company & Safety</h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-1.5 text-gray-300 font-mono text-[11px]">
                <ShieldCheck className="h-4 w-4 text-green-400" />
                <span>HIPAA_GDPR_COMPLIANT</span>
              </li>
              <li>
                <span className="text-[11px] text-gray-400 block leading-relaxed">
                  Files are processed securely in your browser cache and never transferred to permanent cloud storage unless requested.
                </span>
              </li>
              <li className="pt-2">
                <span className="text-[10px] text-green-400 font-semibold bg-black/40 px-2 py-1 border border-[#E4E3E0]/20">
                  UT_00:00_DAILY_RESET
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#E4E3E0]/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-gray-400">
          <p>
            &copy; {currentYear} DocuTools SaaS Platform. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <span>Designed in swiss workstation style</span>
            <span>&bull;</span>
            <span>DocuTools Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
