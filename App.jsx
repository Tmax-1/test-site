import React from "react";
import { Routes, Route } from "react-router-dom";

// Import your pages
import Homepage from "./Homepage.jsx";
import AddCard from "./AddCard.jsx";
import CardDetail from "./CardDetail.jsx";
import LanguageSelect from "./LanguageSelect.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/AddCard" element={<AddCard />} />
      <Route path="/CardDetail" element={<CardDetail />} />
      <Route path="/LanguageSelect" element={<LanguageSelect />} />
    </Routes>
  );
}
