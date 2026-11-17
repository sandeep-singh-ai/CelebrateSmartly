import { useEventCategories } from './useEventCategories';
import { useThemeGeneration } from './useThemeGeneration';
import { useEventForm } from './useEventForm';
import { useEventCreationSubmit } from './useEventCreationSubmit';

export const useEventCreation = () => {
  const {
    categories,
    categoriesLoading
  } = useEventCategories();

  const {
    eventName,
    setEventName,
    location,
    setLocation,
    numberOfPeople,
    setNumberOfPeople,
    selectedCategory,
    setSelectedCategory,
    eventDate,
    setEventDate,
    description,
    setDescription,
    resetForm,
    isFormValid
  } = useEventForm();

  const {
    themes,
    selectedTheme,
    setSelectedTheme,
    loading: themeLoading,
    needsApiKey,
    generateThemes: generateThemesBase,
    resetThemes
  } = useThemeGeneration();

  const {
    createEvent: createEventBase,
    loading: createLoading
  } = useEventCreationSubmit();

  const generateThemes = async () => {
    if (!isFormValid()) return;
    await generateThemesBase(eventName, location, numberOfPeople, selectedCategory);
  };

  const createEvent = async () => {
    const success = await createEventBase(
      eventName,
      location,
      numberOfPeople,
      selectedCategory,
      eventDate,
      description,
      themes,
      selectedTheme
    );
    
    if (success) {
      resetForm();
      resetThemes();
    }
    
    return success;
  };

  const loading = themeLoading || createLoading;

  return {
    eventName,
    setEventName,
    location,
    setLocation,
    numberOfPeople,
    setNumberOfPeople,
    selectedCategory,
    setSelectedCategory,
    eventDate,
    setEventDate,
    description,
    setDescription,
    categories,
    themes,
    selectedTheme,
    setSelectedTheme,
    loading,
    needsApiKey,
    categoriesLoading,
    generateThemes,
    createEvent
  };
};
