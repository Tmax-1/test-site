import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Shield, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function EmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-16"
    >
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg rounded-3xl max-w-lg mx-auto">
        <CardContent className="p-12">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Shield className="w-12 h-12 text-blue-500" />
          </div>
          
          <h3 className="text-2xl font-bold text-slate-800 mb-3">
            No Allergy Cards Yet
          </h3>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Create your first allergy card to start communicating your dietary restrictions clearly and safely, no matter where you travel.
          </p>
          
          <Link to={createPageUrl("AddCard")}>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Card
            </Button>
          </Link>
          
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Multi-language</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Travel ready</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}