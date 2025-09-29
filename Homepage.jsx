
import React, { useState, useEffect } from "react";
import { AllergyCard } from "@/entities/AllergyCard";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, AlertTriangle, Shield, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import AllergyCardComponent from "./AllergyCardComponent.jsx";
import EmptyState from "./EmptyState.jsx";

export default function Homepage() {
  const [cards, setCards] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAndLoadData = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        
        // Redirect to language selection if not completed
        if (!currentUser.has_completed_language_setup) {
          navigate(createPageUrl("LanguageSelect"));
          return;
        }
        
        // Load cards
        setIsLoading(true);
        try {
          const userCards = await AllergyCard.list("-created_date");
          setCards(userCards);
        } catch (error) {
          console.error("Error loading cards:", error);
        }
        setIsLoading(false);
      } catch (error) {
        // User not authenticated, redirect to language selection
        navigate(createPageUrl("LanguageSelect"));
      }
    };

    checkUserAndLoadData();
  }, [navigate]);

  const handleCardClick = (card) => {
    navigate(createPageUrl(`CardDetail?id=${card.id}`));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-slate-600 font-medium">Loading your cards...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-slate-800 mb-2"
          >
            Your Allergy Cards
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 font-medium"
          >
            Manage and translate your allergy information for safe travels
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link to={createPageUrl("AddCard")}>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Card
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Stats Overview */}
      {cards.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{cards.length}</p>
                <p className="text-sm text-slate-600">Active Cards</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {cards.filter(card => card.severity_level === 'severe' || card.severity_level === 'life_threatening').length}
                </p>
                <p className="text-sm text-slate-600">Severe Allergies</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {user?.preferred_language?.toUpperCase() || 'EN'}
                </p>
                <p className="text-sm text-slate-600">Primary Language</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Cards Grid */}
      <AnimatePresence mode="wait">
        {cards.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <AllergyCardComponent 
                  card={card} 
                  onClick={handleCardClick}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
