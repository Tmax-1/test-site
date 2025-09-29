
import React, { useState, useEffect } from "react";
import { AllergyCard } from "@/entities/AllergyCard";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Globe, Copy, CheckCircle, AlertTriangle, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { motion } from "framer-motion";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' }
];

const severityConfig = {
  mild: { color: "bg-green-100 text-green-800 border-green-200", icon: Shield },
  moderate: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: AlertTriangle },
  severe: { color: "bg-orange-100 text-orange-800 border-orange-200", icon: AlertTriangle },
  life_threatening: { color: "bg-red-100 text-red-800 border-red-200", icon: AlertTriangle }
};

export default function CardDetail() {
  const [card, setCard] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [translatedContent, setTranslatedContent] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCard = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const cardId = urlParams.get('id');
      
      if (!cardId) {
        navigate(createPageUrl("Homepage"));
        return;
      }

      try {
        const cards = await AllergyCard.filter({ id: cardId });
        if (cards.length > 0) {
          setCard(cards[0]);
        } else {
          navigate(createPageUrl("Homepage"));
        }
      } catch (error) {
        console.error("Error loading card:", error);
        navigate(createPageUrl("Homepage"));
      }
    };

    loadCard();
  }, [navigate]);

  const handleTranslate = async () => {
    if (!selectedLanguage || !card) return;

    setIsTranslating(true);
    setTranslatedContent('');

    try {
      const prompt = `Translate this allergy information to ${languages.find(l => l.code === selectedLanguage)?.name}. 
      Make it clear, medically accurate, and suitable for showing to restaurant staff or medical personnel:

      I am allergic to: ${card.food_allergen}
      Severity: ${card.severity_level?.replace('_', ' ')}
      Description: ${card.severity_description}
      ${card.symptoms?.length > 0 ? `Symptoms: ${card.symptoms.join(', ')}` : ''}
      ${card.emergency_medication ? `Emergency medication needed: ${card.emergency_medication}` : ''}
      
      Please provide a clear, professional translation that can be easily understood by local people.`;

      const result = await InvokeLLM({ prompt });
      setTranslatedContent(result);
    } catch (error) {
      console.error("Translation error:", error);
      setTranslatedContent("Translation failed. Please try again.");
    }

    setIsTranslating(false);
  };

  const copyToClipboard = async () => {
    if (translatedContent) {
      await navigator.clipboard.writeText(translatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-slate-600 font-medium">Loading card...</span>
        </div>
      </div>
    );
  }

  const severity = severityConfig[card.severity_level] || severityConfig.mild;
  const SeverityIcon = severity.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(createPageUrl("Homepage"))}
          className="rounded-full border-slate-200 hover:border-slate-300"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Allergy Card Details</h1>
          <p className="text-slate-600 font-medium">
            Created on {format(new Date(card.created_date), "MMMM d, yyyy")}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Card Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl overflow-hidden">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold text-slate-700">
                  {card.food_allergen?.[0]?.toUpperCase()}
                </span>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800 mb-2">
                {card.food_allergen}
              </CardTitle>
              <Badge className={`${severity.color} border font-semibold text-lg px-4 py-2`}>
                <SeverityIcon className="w-4 h-4 mr-2" />
                {card.severity_level?.replace('_', ' ').toUpperCase()}
              </Badge>
            </CardHeader>
            
            <CardContent className="p-8 space-y-6">
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="font-bold text-slate-800 mb-2">Assessment Result:</h3>
                <p className="text-slate-700">{card.severity_description}</p>
              </div>

              {card.questionnaire_responses && card.questionnaire_responses.length > 0 && (
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h3 className="font-bold text-slate-800 mb-4">Assessment Answers:</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {card.questionnaire_responses.map((response, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold mt-1">•</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-700 mb-1">
                            {response.question || `Question ${response.question_id}`}
                          </p>
                          <p className="text-sm text-blue-700 font-semibold">
                            {response.response}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {card.symptoms && card.symptoms.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-800 mb-3">Symptoms</h3>
                  <div className="flex flex-wrap gap-2">
                    {card.symptoms.map((symptom, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {card.emergency_medication && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <h3 className="font-bold text-red-800 mb-2">Emergency Medication</h3>
                  <p className="text-red-700 font-medium">{card.emergency_medication}</p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  Original language: {card.original_language?.toUpperCase() || 'EN'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Translation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl overflow-hidden h-fit">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Globe className="w-8 h-8 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800">
                Translate Card
              </CardTitle>
              <p className="text-slate-600 font-medium">
                Make your allergy information clear in any language
              </p>
            </CardHeader>
            
            <CardContent className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Select Language
                </label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="rounded-xl border-slate-200 h-12">
                    <SelectValue placeholder="Choose a language..." />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.code} value={language.code}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleTranslate}
                disabled={!selectedLanguage || isTranslating}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isTranslating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Translating...
                  </div>
                ) : (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    Translate
                  </>
                )}
              </Button>

              {translatedContent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-emerald-800">Translation</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="border-emerald-200 hover:bg-emerald-100"
                      >
                        {copied ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1 text-emerald-600" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-emerald-800 whitespace-pre-wrap font-medium leading-relaxed">
                      {translatedContent}
                    </p>
                  </div>
                  
                  <p className="text-sm text-slate-500 text-center">
                    Show this translation to restaurant staff or medical personnel
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
