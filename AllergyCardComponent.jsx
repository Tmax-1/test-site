import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Eye, Clock } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const severityConfig = {
  mild: {
    color: "bg-green-100 text-green-800 border-green-200",
    icon: Shield,
    iconColor: "text-green-600"
  },
  moderate: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Eye,
    iconColor: "text-yellow-600"
  },
  severe: {
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: AlertTriangle,
    iconColor: "text-orange-600"
  },
  life_threatening: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: AlertTriangle,
    iconColor: "text-red-600"
  }
};

export default function AllergyCardComponent({ card, onClick }) {
  const severity = severityConfig[card.severity_level] || severityConfig.mild;
  const SeverityIcon = severity.icon;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card 
        className="cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl overflow-hidden group"
        onClick={() => onClick(card)}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-blue-100 group-hover:to-emerald-100 transition-all duration-200`}>
                <span className="text-lg font-bold text-slate-700 group-hover:text-blue-600 transition-colors duration-200">
                  {card.food_allergen?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors duration-200">
                  {card.food_allergen}
                </h3>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(card.created_date), "MMM d, yyyy")}
                </p>
              </div>
            </div>
            
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${severity.color.replace('text-', '').replace('800', '100')}`}>
              <SeverityIcon className={`w-4 h-4 ${severity.iconColor}`} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Severity Level</span>
              <Badge className={`${severity.color} border font-medium`}>
                {card.severity_level?.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>

            {card.emergency_medication && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-sm font-semibold text-red-800 mb-1">Emergency Medication</p>
                <p className="text-sm text-red-700">{card.emergency_medication}</p>
              </div>
            )}

            {card.severity_description && (
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-sm text-slate-700 line-clamp-2">
                  {card.severity_description}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-xs text-slate-500 font-medium">
                {card.original_language?.toUpperCase() || 'EN'} • Click to view & translate
              </span>
              <div className="w-2 h-2 bg-emerald-400 rounded-full group-hover:bg-blue-400 transition-colors duration-200"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}