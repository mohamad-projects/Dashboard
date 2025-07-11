import { createContext, useEffect, useState } from "react";

export const DarkModeContext = createContext();

export const DarkModeContextProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? JSON.parse(saved) : false;
  });
  
  const [translateMode, setTranslateMode] = useState(() => {
    const saved = localStorage.getItem("translateMode");
    return saved !== null ? JSON.parse(saved) : false; // تغيير القيمة الافتراضية لـ false
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("translateMode", JSON.stringify(translateMode));
    document.documentElement.dir = translateMode ? 'ltr' : 'rtl';
    document.documentElement.lang = translateMode ? 'en' : 'ar';
  }, [translateMode]);

  // تحسين اسماء الوظائف لتكون أكثر وصفية
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const toggleLanguage = () => {
    setTranslateMode(prev => !prev);
  };

  return (
    <DarkModeContext.Provider 
      value={{ 
        darkMode, 
        toggleDarkMode, 
        translateMode, 
        toggleLanguage 
      }}
    >
      {children}
    </DarkModeContext.Provider>
  );
};