import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { ToastProvider } from "./components/Toast.jsx";
import { TemplatesPage } from "./pages/TemplatesPage.jsx";
import { BuilderPage } from "./pages/BuilderPage.jsx";
import { packageService } from "./services/packageService.js";
import { templateService } from "./services/templateService.js";

function App() {
  const [currentPage, setCurrentPage] = useState("templates"); // "templates" or "builder"
  const [builderTemplateId, setBuilderTemplateId] = useState(null);

  const handleUseTemplate = (template) => {
    // TemplatesPage passes the full template object or template ID
    const templateId = typeof template === 'object' ? template.id : template;
    setBuilderTemplateId(templateId);
    setCurrentPage("builder");
  };

  const handleBackToTemplates = () => {
    setCurrentPage("templates");
    setBuilderTemplateId(null);
  };

  return (
    <div className="app">
      {currentPage === "templates" && (
        <TemplatesPage
          onNavigateToBuilder={handleUseTemplate}
        />
      )}

      {currentPage === "builder" && (
        <BuilderPage
          templateId={builderTemplateId}
          onBack={handleBackToTemplates}
        />
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <ToastProvider>
    <App />
  </ToastProvider>
);
