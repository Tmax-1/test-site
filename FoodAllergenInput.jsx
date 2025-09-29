import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Utensils } from "lucide-react";
import { motion } from "framer-motion";

const commonAllergens = [
  "Peanuts", "Tree nuts", "Milk", "Eggs", "Wheat", "Soy", 
  "Fish", "Shellfish", "Sesame", "Corn", "Tomatoes", "Chocolate"
];

export default function FoodAllergenInput({ onSubmit, initialValue }) {
  const [food, setFood] = useState(initialValue || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!food.trim()) {
      setError("Please enter a food allergen");
      return;
    }
    setError("");
    onSubmit(food.trim());
  };

  const selectCommonAllergen = (allergen) => {
    setFood(allergen);
    setError("");
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl overflow-hidden">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Utensils className="w-8 h-8 text-orange-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-slate-800">
          What food are you allergic to?
        </CardTitle>
        <p className="text-slate-600 font-medium">
          Enter the specific food that causes your allergic reaction
        </p>
      </CardHeader>
      
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              value={food}
              onChange={(e) => setFood(e.target.value)}
              placeholder="e.g., Peanuts, Shellfish, Milk..."
              className="text-lg p-6 rounded-2xl border-slate-200 focus:border-blue-400 focus:ring-blue-400"
              autoFocus
            />
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 text-sm mt-2 font-medium"
              >
                {error}
              </motion.p>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700 mb-3">Common allergens:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {commonAllergens.map((allergen) => (
                <Badge
                  key={allergen}
                  variant="outline"
                  className={`cursor-pointer p-3 text-center justify-center border-2 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 ${
                    food === allergen ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-slate-200'
                  }`}
                  onClick={() => selectCommonAllergen(allergen)}
                >
                  {allergen}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Continue to Assessment
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}