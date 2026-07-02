/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ToolDefinition, SaaSPlan } from "../types";
import { 
  FileUp, 
  FileDown, 
  Percent, 
  FileImage, 
  Image as ImageIcon, 
  FileText, 
  FileOutput, 
  RefreshCw,
  Search,
  CheckCircle2,
  Lock,
  Zap,
  Star,
  ShieldCheck,
  ChevronDown,
  ArrowRight
} from "lucide-react";

interface LandingPageProps {
  tools: ToolDefinition[];
  plans: SaaSPlan[];
  onSelectTool: (toolId: string) => void;
  onSelectPlan: (plan: SaaSPlan, billingPeriod: "month" | "year") => void;
  isPremium: boolean;
}

export default function LandingPage({
  tools,
  plans,
  onSelectTool,
  onSelectPlan,
  isPremium
}: LandingPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "pdf" | "image" | "convert">("all");
  const [billingPeriod, setBillingPeriod] = useState<"month" | "year">("month");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Map icon strings to Lucide components
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    FileUp: FileUp,
    FileDown: FileDown,
    Percent: Percent,
    FileImage: FileImage,
    Image: ImageIcon,
    FileText: FileText,
    FileOutput: FileOutput,
    RefreshCw: RefreshCw
  };

  const categories = [
    { id: "all", name: "All Tools" },
    { id: "pdf", name: "PDF Utilities" },
    { id: "image", name: "Image Editors" },
    { id: "convert", name: "Converters" }
  ];

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory && tool.active;
  });

  const faqs = [
    {
      q: "Is it safe to upload my sensitive PDF documents to DocuTools?",
      a: "Yes, 100%. Unlike conventional platforms that upload your files to external remote servers, DocuTools uses advanced WASM technology (pdf-lib) to process and compile your files directly inside your browser sandbox. Your files never touch a remote storage disk unless explicitly authorized."
    },
    {
      q: "What are the limitations of the free plan?",
      a: "Our free tier provides 3 full-service conversions or edits per day across any of our 8 core tools. To bypass these limitations and unlock infinite conversions, lightning processing speeds, and up to 500MB batch uploads, you can upgrade to our Pro subscription."
    },
    {
      q: "How does the Image format converter handle transparency?",
      a: "Our image transcoder respects transparency profiles (e.g. PNG alpha channels) when converting to modern formats like WEBP. When converting to JPEG, transparency is automatically layered onto a clean, crisp white background."
    },
    {
      q: "Can I cancel my subscription anytime?",
      a: "Absolutely! You can manage, upgrade, or instantly cancel your active subscription directly from your account dashboard with a single click. There are no locking contracts or termination fees."
    }
  ];

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#E4E3E0] pt-12 pb-16 border-b border-[#141414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 border border-[#141414] bg-white/40 text-[10px] font-mono tracking-wider uppercase">
                <Star className="h-3 w-3 text-[#141414]" />
                <span>LOCAL_SANDBOX_CONVERSION_ENGINE</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif italic text-[#141414] leading-[1.1] tracking-tight">
                High-Speed Document <br />
                <span className="text-3xl sm:text-4xl lg:text-5xl font-mono uppercase font-bold tracking-tight bg-[#141414] text-[#E4E3E0] px-3 py-1 inline-block mt-2">
                  &amp; Image Transcoding
                </span>
              </h1>
              
              <p className="text-sm sm:text-base text-gray-800 leading-relaxed max-w-xl">
                Merge, split, compress, and transcode formats directly within your local tab cache. No cloud servers, zero external exposure risk, and lightning compilations.
              </p>

              {/* Quick Search */}
              <div className="max-w-md relative pt-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-900 pt-2">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  id="tool-search-input"
                  type="text"
                  placeholder="SEARCH_UTILITIES... (e.g. MERGE, TRANSCODE, JPG)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-[#141414] bg-white/80 placeholder-gray-500 text-xs font-mono uppercase focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#141414]"
                />
              </div>
            </div>

            {/* Hero Right Status Widget */}
            <div className="lg:col-span-5 border border-[#141414] p-6 bg-white/45 flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-[#141414] pb-2">
                <span className="text-[10px] font-mono uppercase opacity-60">Status Dashboard</span>
                <span className="text-[10px] font-mono uppercase font-semibold text-green-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span> SYSTEM_LIVE
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-[#141414] p-3 bg-[#DEDCD7]/50">
                  <p className="text-[9px] font-mono uppercase opacity-50">Local Processing</p>
                  <p className="text-xl font-serif italic font-bold mt-1">100%</p>
                </div>
                <div className="border border-[#141414] p-3 bg-[#DEDCD7]/50">
                  <p className="text-[9px] font-mono uppercase opacity-50">Transcode Rate</p>
                  <p className="text-xl font-serif italic font-bold mt-1">0.1s</p>
                </div>
              </div>
              <p className="text-[11px] font-mono uppercase text-gray-600">
                &gt; Securing active memory buffers... OK<br />
                &gt; Loading WebAssembly decoders... ACTIVE
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#141414]">
          <div>
            <h2 className="text-xl font-serif italic">Directory of Active Sandbox Utilities</h2>
            <p className="text-xs font-mono text-gray-600 uppercase mt-1">Select a utility tool block below to initiate workspace memory</p>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-1 mt-4 sm:mt-0 bg-[#DEDCD7] p-1 border border-[#141414] w-fit">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#141414] text-[#E4E3E0]"
                    : "text-[#141414] hover:bg-[#E4E3E0]/50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => {
              const IconComp = iconMap[tool.icon] || FileUp;
              return (
                <button
                  key={tool.id}
                  id={`tool-card-${tool.id}`}
                  onClick={() => onSelectTool(tool.id)}
                  className="group relative flex flex-col justify-between p-5 bg-white/45 border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors duration-150 text-left cursor-pointer focus:outline-none"
                >
                  <div>
                    {/* Tool Header */}
                    <div className="flex justify-between items-start">
                      <div className="p-2 border border-[#141414] bg-[#DEDCD7] text-[#141414] group-hover:bg-[#E4E3E0] transition-colors">
                        <IconComp className="h-5 w-5" />
                      </div>
                      
                      {tool.popular && (
                        <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-[#141414] bg-[#DEDCD7] border border-[#141414]">
                          Pop
                        </span>
                      )}
                    </div>
                    
                    {/* Tool Name */}
                    <h3 className="text-base font-serif italic font-bold mt-4">
                      {tool.name}
                    </h3>
                    
                    {/* Tool Description */}
                    <p className="text-xs opacity-80 mt-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#141414]/20 text-[10px] font-mono">
                    <span className="opacity-70">VOL: {(tool.usageCount + 24).toLocaleString()} JOBS</span>
                    <span className="font-bold uppercase flex items-center group-hover:underline">
                      LAUNCH <ArrowRight className="h-3 w-3 ml-1" />
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center bg-white/45 border border-[#141414] p-8">
              <Search className="h-8 w-8 text-gray-500 mx-auto" />
              <p className="text-xs font-mono uppercase font-bold mt-3">No matching utilities registered</p>
              <p className="text-xs text-gray-600 mt-1 uppercase">Adjust query strings or clear filters to reset matrix</p>
              <button
                onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}
                className="mt-4 px-3 py-1 border border-[#141414] bg-[#141414] text-[#E4E3E0] text-xs font-mono uppercase cursor-pointer hover:bg-transparent hover:text-[#141414]"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Trust & Local Sandboxed Pitch */}
      <section className="bg-[#141414] text-[#E4E3E0] py-16 border-t border-[#141414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            <div className="lg:col-span-1 space-y-4">
              <div className="p-3 bg-[#E4E3E0] text-[#141414] border border-[#141414] w-fit">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif italic text-white">
                Strict Local Sandbox. <br />
                Absolute Data Compliance.
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed uppercase font-mono">
                Conventional PDF transcoders upload files to remote databases. DocuTools intercepts execution, running compiling codecs directly inside your sandbox tab cache.
              </p>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 border border-[#E4E3E0]/20 bg-black/40">
                <div className="flex items-center space-x-2 text-[#E4E3E0] font-mono mb-3 text-xs uppercase font-bold">
                  <Lock className="h-4 w-4 text-green-400" />
                  <span>WASM_SECURED_MEM</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  All formatting engines, compression modules, and scaling routines are loaded locally. Your personal financials and private records remain strictly offline in active tab memory.
                </p>
              </div>
              
              <div className="p-6 border border-[#E4E3E0]/20 bg-black/40">
                <div className="flex items-center space-x-2 text-[#E4E3E0] font-mono mb-3 text-xs uppercase font-bold">
                  <Zap className="h-4 w-4 text-green-400" />
                  <span>DIRECT_IO_NO_QUEUE</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Because conversions execute without remote network trips, there are no batch processing pipelines, long wait queues, or network delays. Build or edit immediately.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-serif italic">
            Transparent Pricing Structure
          </h2>
          <p className="text-xs font-mono text-gray-600 uppercase">
            3 absolute free operations daily. Upgrade anytime to register infinite workloads and team accounts.
          </p>

          {/* Billing Toggle in technical box */}
          <div className="flex items-center justify-center pt-4">
            <div className="border border-[#141414] bg-[#DEDCD7] p-1 flex items-center">
              <button
                onClick={() => setBillingPeriod("month")}
                className={`px-3 py-1 text-xs font-mono uppercase transition-all ${
                  billingPeriod === "month"
                    ? "bg-[#141414] text-[#E4E3E0]"
                    : "text-[#141414] hover:bg-white/40"
                }`}
              >
                MONTHLY
              </button>
              <button
                onClick={() => setBillingPeriod("year")}
                className={`px-3 py-1 text-xs font-mono uppercase transition-all flex items-center gap-1.5 ${
                  billingPeriod === "year"
                    ? "bg-[#141414] text-[#E4E3E0]"
                    : "text-[#141414] hover:bg-white/40"
                }`}
              >
                ANNUALLY <span className="text-[9px] bg-green-700 text-white px-1 py-0.5">SAVE_25%</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const isFree = plan.id === "free";
            const isEnterprise = plan.id === "enterprise";
            const originalPrice = plan.price;
            
            // Adjust Pro price for yearly discount: $12 -> $9/mo ($108 billed annually)
            const calculatedPrice = plan.id === "pro" 
              ? (billingPeriod === "year" ? originalPrice * 0.75 : originalPrice)
              : originalPrice;

            return (
              <div
                key={plan.id}
                id={`pricing-card-${plan.id}`}
                className={`flex flex-col justify-between p-6 bg-white/45 border border-[#141414] relative ${
                  plan.isPopular 
                    ? "bg-[#DEDCD7]/60 border-2" 
                    : "hover:bg-white/70"
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3 left-6 px-2 py-0.5 text-[9px] font-mono uppercase bg-[#141414] text-[#E4E3E0] border border-[#141414]">
                    RECOMMENDED_MATRIX
                  </span>
                )}
                
                <div>
                  <h3 className="text-lg font-serif italic font-bold">{plan.name}</h3>
                  <p className="text-[10px] font-mono uppercase text-gray-500 mt-1">{plan.description}</p>
                  
                  {/* Price */}
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-mono font-bold tracking-tight">
                      ${calculatedPrice}
                    </span>
                    {!isEnterprise && (
                      <span className="text-[10px] font-mono text-gray-500 uppercase ml-1.5">
                        / {billingPeriod === "year" ? "mo" : "mo"}
                      </span>
                    )}
                  </div>
                  {billingPeriod === "year" && plan.id === "pro" && (
                    <p className="text-[10px] font-mono text-green-700 uppercase mt-1">Billed annually ($81.00 yr)</p>
                  )}

                  <ul className="mt-6 space-y-2.5 text-xs text-gray-700">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    id={`pricing-buy-${plan.id}`}
                    onClick={() => onSelectPlan(plan, billingPeriod)}
                    disabled={isPremium && plan.id === "free"}
                    className={`w-full text-center py-2 text-xs font-mono uppercase border border-[#141414] cursor-pointer transition-all ${
                      isFree
                        ? "bg-transparent text-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0]"
                        : plan.isPopular
                          ? "bg-[#141414] text-[#E4E3E0] hover:bg-transparent hover:text-[#141414]"
                          : "bg-[#141414] text-[#E4E3E0] hover:bg-transparent hover:text-[#141414]"
                    } ${isPremium && plan.id === "free" ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    {isPremium && plan.id === "pro" 
                      ? "ACTIVE_PRO" 
                      : isFree 
                        ? "FREE_TIER" 
                        : "UPGRADE_PLAN"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq-section" className="border-t border-b border-[#141414] py-16 bg-white/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif italic">
              Frequently Queried Indices
            </h2>
            <p className="text-xs font-mono text-gray-600 uppercase">
              Understanding browser sandbox cache layers, data retention policy, and billing matrix.
            </p>
          </div>

          <div className="mt-10 space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white/45 border border-[#141414] overflow-hidden"
                >
                  <button
                    id={`faq-toggle-${idx}`}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex justify-between items-center w-full px-5 py-3.5 text-left font-serif italic text-base hover:bg-[#DEDCD7]/40 transition-colors cursor-pointer focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform duration-150 ${isOpen ? "transform rotate-180 text-green-700" : ""}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs text-gray-700 leading-relaxed border-t border-[#141414]/15 font-sans">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
