import React, { useState } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Globe, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
];

export default function LanguageSelect() {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selectedLanguage) return;
    
    setIsLoading(true);
    try {
      await User.updateMyUserData({
        preferred_language: selectedLanguage,
        has_completed_language_setup: true
      });
      navigate(createPageUrl("Homepage"));
    } catch (error) {
      console.error("Error saving language preference:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-3">
            Welcome to AllergyGuard
          </h1>
          <p className="text-slate-600 text-lg font-medium">Choose your preferred language to get started</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              {languages.map((language) => (
                <motion.button
                  key={language.code}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedLanguage(language.code)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left relative overflow-hidden ${
                    selectedLanguage === language.code
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{language.flag}</span>
                    <div>
                      <p className="font-semibold text-slate-800">{language.name}</p>
                      <p className="text-xs text-slate-500">{language.code.toUpperCase()}</p>
                    </div>
                  </div>
                  {selectedLanguage === language.code && (
                    <div className="absolute top-2 right-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            <Button
              onClick={handleContinue}
              disabled={!selectedLanguage || isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Setting up...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-slate-500 text-sm mt-6">
          You can change this language preference anytime in your settings
        </p>
      </motion.div>
    </div>
  );
}