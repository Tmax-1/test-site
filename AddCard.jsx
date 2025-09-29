import React, { useState } from "react";
import { AllergyCard } from "@/entities/AllergyCard";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

import FoodAllergenInput from "./FoodAllergenInput.jsx";
import QuestionnaireFlow from "./QuestionnaireFlow.jsx";
import SeverityAssessment from "./SeverityAssessment.jsx";

export default function AddCard() {
  const [step, setStep] = useState(1);
  const [foodAllergen, setFoodAllergen] = useState("");
  const [questionnaireResponses, setQuestionnaireResponses] = useState([]);
  const [severityData, setSeverityData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFoodSubmit = (food) => {
    setFoodAllergen(food);
    setStep(2);
  };

  const handleQuestionnaireComplete = (responses, severity) => {
    setQuestionnaireResponses(responses);
    setSeverityData(severity);
    setStep(3);
  };

  const handleFinalSubmit = async (finalData) => {
    setIsLoading(true);
    try {
      const user = await User.me();
      
      await AllergyCard.create({
        food_allergen: foodAllergen,
        questionnaire_responses: questionnaireResponses,
        severity_level: severityData.level,
        severity_description: severityData.description,
        symptoms: finalData.symptoms || [],
        emergency_medication: finalData.emergencyMedication || "",
        original_language: user.preferred_language || 'en'
      });
      
      navigate(createPageUrl("Homepage"));
    } catch (error) {
      console.error("Error creating allergy card:", error);
    }
    setIsLoading(false);
  };

  const goBack = () => {
    if (step === 1) {
      navigate(createPageUrl("Homepage"));
    } else {
      setStep(step - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={goBack}
          className="rounded-full border-slate-200 hover:border-slate-300"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Create New Allergy Card</h1>
          <p className="text-slate-600 font-medium">Step {step} of 3</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-slate-600">Progress</span>
          <span className="text-sm text-slate-500">({step}/3)</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <FoodAllergenInput 
              onSubmit={handleFoodSubmit}
              initialValue={foodAllergen}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionnaireFlow 
              foodAllergen={foodAllergen}
              onComplete={handleQuestionnaireComplete}
            />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SeverityAssessment 
              foodAllergen={foodAllergen}
              severityData={severityData}
              onSubmit={handleFinalSubmit}
              isLoading={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}