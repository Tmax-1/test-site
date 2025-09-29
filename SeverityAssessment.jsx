import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Shield, CheckCircle, Plus, X } from "lucide-react";
import { motion } from "framer-motion";

const severityConfig = {
  mild: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: Shield,
    iconColor: "text-green-600",
    bgColor: "bg-green-50"
  },
  moderate: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: AlertTriangle,
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-50"
  },
  severe: {
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: AlertTriangle,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  life_threatening: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: AlertTriangle,
    iconColor: "text-red-600",
    bgColor: "bg-red-50"
  }
};

const commonSymptoms = [
  "Hives", "Swelling", "Difficulty breathing", "Nausea", "Vomiting",
  "Diarrhea", "Dizziness", "Rapid pulse", "Loss of consciousness", "Throat tightness"
];

export default function SeverityAssessment({ foodAllergen, severityData, onSubmit, isLoading }) {
  const [symptoms, setSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [emergencyMedication, setEmergencyMedication] = useState("");

  const severity = severityConfig[severityData.level];
  const SeverityIcon = severity.icon;

  const addSymptom = (symptom) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const removeSymptom = (symptom) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !symptoms.includes(customSymptom.trim())) {
      setSymptoms([...symptoms, customSymptom.trim()]);
      setCustomSymptom("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      symptoms,
      emergencyMedication
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl overflow-hidden">
      <CardHeader className="text-center pb-6">
        <div className={`w-16 h-16 ${severity.bgColor} rounded-full mx-auto mb-4 flex items-center justify-center`}>
          <SeverityIcon className={`w-8 h-8 ${severity.iconColor}`} />
        </div>
        <CardTitle className="text-2xl font-bold text-slate-800 mb-2">
          Assessment Complete
        </CardTitle>
        <Badge className={`${severity.color} border font-semibold text-lg px-4 py-2`}>
          {severityData.level.replace('_', ' ').toUpperCase()} ALLERGY
        </Badge>
      </CardHeader>
      
      <CardContent className="p-8">
        <div className={`${severity.bgColor} border-2 ${severity.color.replace('text-', 'border-').replace('800', '200')} rounded-2xl p-6 mb-8`}>
          <h3 className="font-bold text-slate-800 mb-2">Assessment Result:</h3>
          <p className="text-slate-700 font-medium">{severityData.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <Label className="text-lg font-semibold text-slate-800 mb-4 block">
              Your Symptoms (Optional)
            </Label>
            <p className="text-sm text-slate-600 mb-4">
              Select symptoms you typically experience with {foodAllergen}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {commonSymptoms.map((symptom) => (
                <motion.button
                  key={symptom}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => 
                    symptoms.includes(symptom) 
                      ? removeSymptom(symptom) 
                      : addSymptom(symptom)
                  }
                  className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                    symptoms.includes(symptom)
                      ? 'border-blue-400 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {symptom}
                  {symptoms.includes(symptom) && (
                    <X className="w-3 h-3 ml-1 inline" />
                  )}
                </motion.button>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                placeholder="Add custom symptom..."
                className="rounded-xl"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSymptom())}
              />
              <Button 
                type="button"
                onClick={addCustomSymptom}
                variant="outline"
                size="icon"
                className="rounded-xl"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {symptoms.length > 0 && (
              <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                <p className="text-sm font-medium text-slate-700 mb-2">Selected symptoms:</p>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom) => (
                    <Badge 
                      key={symptom}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-red-100 hover:text-red-800 transition-colors"
                      onClick={() => removeSymptom(symptom)}
                    >
                      {symptom} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="emergency-med" className="text-lg font-semibold text-slate-800 mb-2 block">
              Emergency Medication (Optional)
            </Label>
            <Input
              id="emergency-med"
              value={emergencyMedication}
              onChange={(e) => setEmergencyMedication(e.target.value)}
              placeholder="e.g., EpiPen, Benadryl, Inhaler..."
              className="text-lg p-4 rounded-xl border-slate-200"
            />
            <p className="text-sm text-slate-500 mt-2">
              Medication you carry or need in case of allergic reaction
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Card...
              </div>
            ) : (
              <>
                Create Allergy Card
                <CheckCircle className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}