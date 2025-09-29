import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, CreditCard, Globe, Heart } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  
  const isActive = (pageName) => {
    return location.pathname === createPageUrl(pageName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <style>
        {`
          :root {
            --primary-blue: #2563eb;
            --primary-emerald: #059669;
            --accent-blue: #3b82f6;
            --soft-gray: #64748b;
            --warm-white: #fefefe;
          }
        `}
      </style>
      
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Homepage")} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  AllergyGuard
                </h1>
                <p className="text-xs text-slate-500 font-medium">Travel Safe, Eat Safe</p>
              </div>
            </Link>
            
            <nav className="flex items-center gap-1 bg-white/60 rounded-full p-1 shadow-sm">
              <Link
                to={createPageUrl("Homepage")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive("Homepage")
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-slate-600 hover:bg-white/80 hover:text-blue-600"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Cards</span>
              </Link>
              <Link
                to={createPageUrl("AddCard")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive("AddCard")
                    ? "bg-emerald-500 text-white shadow-md"
                    : "text-slate-600 hover:bg-white/80 hover:text-emerald-600"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Card</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
      
      <footer className="bg-white/60 backdrop-blur-sm border-t border-blue-100/50 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-blue-500" />
            <span className="text-slate-600 text-sm font-medium">Made for travelers worldwide</span>
          </div>
          <p className="text-xs text-slate-500">Communicate your allergies clearly, anywhere you go</p>
        </div>
      </footer>
    </div>
  );
}