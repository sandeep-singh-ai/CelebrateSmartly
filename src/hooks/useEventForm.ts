import { useState } from 'react';

export const useEventForm = () => {
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setEventName('');
    setLocation('');
    setNumberOfPeople(1);
    setSelectedCategory('');
    setEventDate('');
    setDescription('');
  };

  const isFormValid = () => {
    return eventName && location && numberOfPeople > 0 && selectedCategory && eventDate;
  };

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
    resetForm,
    isFormValid
  };
};
