import { useState, useCallback } from "react";

export const translations = {
  en: {
    // Header
    studio: "Studio",
    settings: "Settings",
    effects: "Effects",
    home: "Home",
    hideSettings: "Hide Settings",
    showSettings: "Show Settings",
    hideEffects: "Hide Effects",
    showEffects: "Show Effects",
    
    // Left Panel
    aiModel: "AI Model",
    subjectReference: "Subject Reference",
    subjectFace: "Subject / Face",
    uploadSubject: "Upload a person or object to include",
    styleInspiration: "Style Inspiration",
    styleReference: "Style Reference",
    uploadStyle: "Upload an image for style inspiration",
    activeEffects: "Active Effects",
    clearAll: "Clear all",
    more: "more",
    
    // Center
    generatedImages: "Generated Images",
    finalPrompt: "Final Prompt",
    copy: "Copy",
    copied: "Copied!",
    describeVision: "Describe your vision...",
    generate: "Generate",
    generating: "Generating...",
    
    // Right Panel
    effectsStyles: "Effects & Styles",
    selected: "selected",
    
    // Categories
    artStyle: "Art Style",
    lighting: "Lighting",
    effectsCat: "Effects",
    environment: "Environment",
    camera: "Camera",
    quality: "Quality",
    
    // Messages
    promptCopied: "Prompt copied!",
    failedToCopy: "Failed to copy",
    enterPrompt: "Please enter a prompt or select some effects",
    imageGenerated: "Image generated!",
    generationFailed: "Generation failed",
    imageRemoved: "Image removed from history",
    clearedSelections: "Cleared all selections",
    
    // Language
    language: "Language",
    english: "English",
    arabic: "العربية",
  },
  ar: {
    // Header
    studio: "الاستوديو",
    settings: "الإعدادات",
    effects: "التأثيرات",
    home: "الرئيسية",
    hideSettings: "إخفاء الإعدادات",
    showSettings: "إظهار الإعدادات",
    hideEffects: "إخفاء التأثيرات",
    showEffects: "إظهار التأثيرات",
    
    // Left Panel
    aiModel: "نموذج الذكاء الاصطناعي",
    subjectReference: "مرجع الموضوع",
    subjectFace: "الموضوع / الوجه",
    uploadSubject: "ارفع شخص أو كائن لإضافته",
    styleInspiration: "إلهام الأسلوب",
    styleReference: "مرجع الأسلوب",
    uploadStyle: "ارفع صورة لإلهام الأسلوب",
    activeEffects: "التأثيرات النشطة",
    clearAll: "مسح الكل",
    more: "المزيد",
    
    // Center
    generatedImages: "الصور المُنشأة",
    finalPrompt: "الوصف النهائي",
    copy: "نسخ",
    copied: "تم النسخ!",
    describeVision: "صف رؤيتك...",
    generate: "إنشاء",
    generating: "جاري الإنشاء...",
    
    // Right Panel
    effectsStyles: "التأثيرات والأساليب",
    selected: "محدد",
    
    // Categories
    artStyle: "أسلوب فني",
    lighting: "الإضاءة",
    effectsCat: "تأثيرات",
    environment: "البيئة",
    camera: "الكاميرا",
    quality: "الجودة",
    
    // Messages
    promptCopied: "تم نسخ الوصف!",
    failedToCopy: "فشل النسخ",
    enterPrompt: "من فضلك أدخل وصفاً أو اختر بعض التأثيرات",
    imageGenerated: "تم إنشاء الصورة!",
    generationFailed: "فشل الإنشاء",
    imageRemoved: "تمت إزالة الصورة من السجل",
    clearedSelections: "تم مسح جميع الاختيارات",
    
    // Language
    language: "اللغة",
    english: "English",
    arabic: "العربية",
  },
};

export type Language = "en" | "ar";
export type TranslationKey = keyof typeof translations.en;

export function useTranslation() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("language") as Language) || "en";
    }
    return "en";
  });

  const t = useCallback((key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  }, [language]);

  const toggleLanguage = useCallback(() => {
    const newLang = language === "en" ? "ar" : "en";
    setLanguage(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLang);
    }
  }, [language]);

  const isArabic = language === "ar";

  return { t, language, setLanguage, toggleLanguage, isArabic };
}
