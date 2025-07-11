// TRANSLATIONS.js

const translations = {
  en: {
    common: {
      title: 'Find Your Dream Home',
      subtitle: 'Browse thousands of properties for sale and rent.',
      search: 'Search',
    },
    buttons: {
      buy: 'Buy',
      rent: 'Rent',
    },
    filters: {
      price: 'Max Price',
      type: 'Property Type',
    },
    stats: {
      purchase: 'Properties for Sale',
      rent: 'Properties for Rent',
      support: 'Customer Support',
    },
    messages: { // <--- THIS IS THE MISSING PART OR WHERE THE ERROR LIES
      loadingProperties: 'Loading properties...',
      propertiesError: 'Failed to fetch properties. Please try again later.',
      noProperties: 'No properties found matching your criteria.',
      statsError: 'Failed to load statistics.',
    },
    // ... other English translations
  },
  ar: {
    common: {
      title: 'اعثر على منزل أحلامك',
      subtitle: 'تصفح آلاف العقارات للبيع والإيجار.',
      search: 'بحث',
    },
    buttons: {
      buy: 'شراء',
      rent: 'إيجار',
    },
    filters: {
      price: 'أقصى سعر',
      type: 'نوع العقار',
    },
    stats: {
      purchase: 'عقارات للبيع',
      rent: 'عقارات للإيجار',
      support: 'دعم العملاء',
    },
    messages: { // <--- THIS IS THE MISSING PART OR WHERE THE ERROR LIES
      loadingProperties: 'جاري تحميل العقارات...',
      propertiesError: 'فشل جلب العقارات. الرجاء المحاولة مرة أخرى لاحقاً.',
      noProperties: 'لم يتم العثور على عقارات مطابقة لمعاييرك.',
      statsError: 'فشل تحميل الإحصائيات.',
    },
    // ... other Arabic translations
  },
};

export const getTranslations = (mode) => {
  return translations[mode] || translations.en; // Default to English if mode is not found
};

export const getTranslatedOptions = (mode) => {
  // Example for options, adjust as per your actual structure
  const currentTranslations = getTranslations(mode);
  return {
    types: currentTranslations.filters.propertyTypes || ['Apartment', 'Villa', 'Land', 'Commercial'], // Example types
    // ... other options
  };
};