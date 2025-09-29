import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

// Complete 30-question assessment with branching logic
const questionTree = {
  1: {
    text: "Can you safely eat [ALLERGEN] directly?",
    options: ["Yes, no problems", "No, I get reactions"],
    branches: {
      "Yes, no problems": "END_MILD",
      "No, I get reactions": 2
    }
  },
  2: {
    text: "Can you eat foods that have [ALLERGEN] cooked into them as a main ingredient?",
    options: ["Yes, when it's cooked in", "No, even when cooked in"],
    branches: {
      "Yes, when it's cooked in": "END_MILD",
      "No, even when cooked in": 3
    }
  },
  3: {
    text: "Can you eat foods where [ALLERGEN] is mixed in as a smaller ingredient (like nuts in a cookie)?",
    options: ["Yes, small amounts are okay", "No, any amount causes problems"],
    branches: {
      "Yes, small amounts are okay": "END_MODERATE",
      "No, any amount causes problems": 4
    }
  },
  4: {
    text: "Can you eat foods that were prepared on the same cutting board as [ALLERGEN]?",
    options: ["Yes, shared cutting board is fine", "No, cross-contact causes reactions"],
    branches: {
      "Yes, shared cutting board is fine": "END_MODERATE",
      "No, cross-contact causes reactions": 5
    }
  },
  5: {
    text: "Can you eat foods cooked in the same pan or fryer that was used for [ALLERGEN]?",
    options: ["Yes, shared cooking surfaces are okay", "No, shared cooking causes reactions"],
    branches: {
      "Yes, shared cooking surfaces are okay": "END_MODERATE",
      "No, shared cooking causes reactions": 6
    }
  },
  6: {
    text: "Can you eat foods prepared with utensils that touched [ALLERGEN] (even if washed)?",
    options: ["Yes, washed utensils are safe", "No, previously used utensils cause problems"],
    branches: {
      "Yes, washed utensils are safe": "END_MODERATE",
      "No, previously used utensils cause problems": 7
    }
  },
  7: {
    text: "Can you safely touch [ALLERGEN] with your hands?",
    options: ["Yes, touching is fine", "No, skin contact causes reactions"],
    branches: {
      "Yes, touching is fine": "END_MODERATE",
      "No, skin contact causes reactions": 8
    }
  },
  8: {
    text: "Can you be in the same room while [ALLERGEN] is being cooked or prepared?",
    options: ["Yes, cooking smells don't bother me", "No, cooking fumes cause problems"],
    branches: {
      "Yes, cooking smells don't bother me": "END_SEVERE",
      "No, cooking fumes cause problems": 9
    }
  },
  9: {
    text: "Can you safely smell [ALLERGEN] when someone else is eating it nearby?",
    options: ["Yes, food smells are tolerable", "No, food odors cause reactions"],
    branches: {
      "Yes, food smells are tolerable": "END_SEVERE",
      "No, food odors cause reactions": 10
    }
  },
  10: {
    text: "Can you be in a restaurant that serves [ALLERGEN] dishes?",
    options: ["Yes, restaurants are usually okay", "No, restaurant environments are risky"],
    branches: {
      "Yes, restaurants are usually okay": "END_SEVERE",
      "No, restaurant environments are risky": 11
    }
  },
  11: {
    text: "When you have a reaction, how quickly do symptoms usually start?",
    options: ["Within 30 minutes", "Immediately (within 5 minutes)", "It varies"],
    branches: {
      "Within 30 minutes": 12,
      "Immediately (within 5 minutes)": 15,
      "It varies": 12
    }
  },
  12: {
    text: "What happens to your skin during a typical reaction?",
    options: ["Mild redness or itching", "Hives or significant swelling", "No skin symptoms"],
    branches: {
      "Mild redness or itching": 13,
      "Hives or significant swelling": 16,
      "No skin symptoms": 14
    }
  },
  13: {
    text: "Do you ever have trouble breathing during reactions?",
    options: ["No breathing problems", "Sometimes feel short of breath", "Often have breathing difficulty"],
    branches: {
      "No breathing problems": "END_MODERATE",
      "Sometimes feel short of breath": 18,
      "Often have breathing difficulty": 20
    }
  },
  14: {
    text: "Do you get stomach problems (nausea, vomiting, diarrhea) during reactions?",
    options: ["Mild stomach upset", "Severe stomach symptoms", "No stomach problems"],
    branches: {
      "Mild stomach upset": "END_MODERATE",
      "Severe stomach symptoms": 17,
      "No stomach problems": "END_MODERATE"
    }
  },
  15: {
    text: "When symptoms start immediately, what typically happens first?",
    options: ["Mouth tingling or throat irritation", "Skin reactions", "Breathing changes"],
    branches: {
      "Mouth tingling or throat irritation": 19,
      "Skin reactions": 16,
      "Breathing changes": 22
    }
  },
  16: {
    text: "How severe are your skin reactions?",
    options: ["Hives that stay in one area", "Hives that spread across my body", "Severe swelling (face, throat, tongue)"],
    branches: {
      "Hives that stay in one area": 17,
      "Hives that spread across my body": 21,
      "Severe swelling (face, throat, tongue)": 25
    }
  },
  17: {
    text: "Have you ever felt dizzy or faint during a reaction?",
    options: ["No dizziness", "Sometimes feel lightheaded", "Often feel faint or dizzy"],
    branches: {
      "No dizziness": "END_SEVERE",
      "Sometimes feel lightheaded": 23,
      "Often feel faint or dizzy": 26
    }
  },
  18: {
    text: "When you feel short of breath, how would you describe it?",
    options: ["Slight tightness in chest", "Clear difficulty breathing", "Severe breathing problems"],
    branches: {
      "Slight tightness in chest": "END_SEVERE",
      "Clear difficulty breathing": 24,
      "Severe breathing problems": 27
    }
  },
  19: {
    text: "When your mouth or throat is affected, what exactly happens?",
    options: ["Tingling or itching", "Swelling that makes swallowing hard", "Throat closes up significantly"],
    branches: {
      "Tingling or itching": "END_SEVERE",
      "Swelling that makes swallowing hard": 24,
      "Throat closes up significantly": 28
    }
  },
  20: {
    text: "Have you ever needed emergency medical treatment for a reaction?",
    options: ["No, never needed emergency care", "Once or twice needed ER visit", "Multiple emergency situations"],
    branches: {
      "No, never needed emergency care": "END_SEVERE",
      "Once or twice needed ER visit": 26,
      "Multiple emergency situations": 29
    }
  },
  21: {
    text: "Do you carry emergency medication (like an EpiPen)?",
    options: ["No emergency medication needed", "Doctor prescribed but rarely use", "Always carry and have used it"],
    branches: {
      "No emergency medication needed": "END_SEVERE",
      "Doctor prescribed but rarely use": 26,
      "Always carry and have used it": 29
    }
  },
  22: {
    text: "When breathing changes happen immediately, how severe is it?",
    options: ["Just feel winded", "Clear trouble getting air", "Can barely breathe"],
    branches: {
      "Just feel winded": 23,
      "Clear trouble getting air": 27,
      "Can barely breathe": 30
    }
  },
  23: {
    text: "How do you usually treat your reactions?",
    options: ["They go away on their own", "Take antihistamine (Benadryl)", "Need stronger medication or medical help"],
    branches: {
      "They go away on their own": "END_SEVERE",
      "Take antihistamine (Benadryl)": "END_SEVERE",
      "Need stronger medication or medical help": 26
    }
  },
  24: {
    text: "Have your reactions gotten worse over time?",
    options: ["About the same severity", "Somewhat worse than before", "Much more severe now"],
    branches: {
      "About the same severity": "END_SEVERE",
      "Somewhat worse than before": 26,
      "Much more severe now": 29
    }
  },
  25: {
    text: "When you get severe swelling, which areas are affected?",
    options: ["Mostly face and lips", "Face, throat, and tongue", "Widespread swelling"],
    branches: {
      "Mostly face and lips": 26,
      "Face, throat, and tongue": 28,
      "Widespread swelling": 29
    }
  },
  26: {
    text: "Can you safely eat at buffets or shared food areas?",
    options: ["Yes, with some caution", "Only if very careful", "Never, too risky"],
    branches: {
      "Yes, with some caution": "END_SEVERE",
      "Only if very careful": "END_SEVERE",
      "Never, too risky": 29
    }
  },
  27: {
    text: "During severe breathing problems, what helps you most?",
    options: ["Fresh air and staying calm", "Inhaler or breathing treatment", "Emergency epinephrine injection"],
    branches: {
      "Fresh air and staying calm": "END_SEVERE",
      "Inhaler or breathing treatment": 29,
      "Emergency epinephrine injection": 30
    }
  },
  28: {
    text: "When your throat swells, how quickly does it happen?",
    options: ["Develops over 10-15 minutes", "Happens within a few minutes", "Almost immediately"],
    branches: {
      "Develops over 10-15 minutes": 29,
      "Happens within a few minutes": 29,
      "Almost immediately": 30
    }
  },
  29: {
    text: "Have you ever lost consciousness during a reaction?",
    options: ["No, stayed conscious", "Felt like I might pass out", "Yes, lost consciousness"],
    branches: {
      "No, stayed conscious": "END_LIFE_THREATENING",
      "Felt like I might pass out": "END_LIFE_THREATENING",
      "Yes, lost consciousness": 30
    }
  },
  30: {
    text: "Do you avoid airplanes or other enclosed spaces because of your allergy?",
    options: ["No special precautions needed", "Take extra precautions but still travel", "Avoid these situations completely"],
    branches: {
      "No special precautions needed": "END_LIFE_THREATENING",
      "Take extra precautions but still travel": "END_LIFE_THREATENING",
      "Avoid these situations completely": "END_LIFE_THREATENING"
    }
  }
};

const severityAssessments = {
  "END_MILD": {
    level: "mild",
    description: "Your allergy appears to be mild. You may experience minor symptoms but can generally tolerate some exposure or cross-contact. Continue to be cautious and avoid direct consumption."
  },
  "END_MODERATE": {
    level: "moderate",
    description: "Your allergy is moderate and requires careful management. Cross-contamination can cause symptoms, so you should avoid shared cooking surfaces and read labels carefully."
  },
  "END_SEVERE": {
    level: "severe",
    description: "Your allergy is severe and requires strict avoidance. Even small amounts or airborne particles can trigger significant reactions. You should carry emergency medication and inform others about your allergy."
  },
  "END_LIFE_THREATENING": {
    level: "life_threatening",
    description: "Your allergy is life-threatening and requires extreme caution. You are at risk for anaphylaxis and should always carry epinephrine, wear medical identification, and ensure others know about your emergency action plan."
  }
};

export default function QuestionnaireFlow({ foodAllergen, onComplete }) {
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [responses, setResponses] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const currentQuestion = questionTree[currentQuestionId];
  const questionText = currentQuestion.text.replace(/\[ALLERGEN\]/g, foodAllergen);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    const newResponses = [
      ...responses,
      {
        question_id: currentQuestionId,
        question: questionText,
        response: selectedAnswer
      }
    ];
    setResponses(newResponses);

    const nextStep = currentQuestion.branches[selectedAnswer];
    
    // Check if we've reached an endpoint
    if (typeof nextStep === 'string' && nextStep.startsWith('END_')) {
      const severityData = severityAssessments[nextStep];
      onComplete(newResponses, severityData);
    } else {
      // Continue to next question
      setCurrentQuestionId(nextStep);
      setSelectedAnswer("");
    }
  };

  const progress = ((responses.length + 1) / 30) * 100;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl overflow-hidden">
      <CardHeader className="text-center pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {foodAllergen} Allergy Assessment
          </Badge>
          <span className="text-sm font-medium text-slate-600">
            Question {responses.length + 1}
          </span>
        </div>
        
        <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <CardTitle className="text-xl font-bold text-slate-800">
          Allergy Severity Assessment
        </CardTitle>
        <p className="text-slate-600 font-medium">
          Answer honestly to help us understand your specific reactions
        </p>
      </CardHeader>
      
      <CardContent className="p-8">
        <motion.div
          key={currentQuestionId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              {questionText}
            </h3>
            <p className="text-sm text-blue-700 font-medium">
              Choose the answer that best describes your experience
            </p>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={option}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                  selectedAnswer === option
                    ? 'border-blue-400 bg-blue-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">{option}</span>
                  {selectedAnswer === option && (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={!selectedAnswer}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            Continue Assessment
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {responses.length > 0 && (
            <div className="text-center pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                Assessment adapts based on your answers • {responses.length} questions completed
              </p>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}