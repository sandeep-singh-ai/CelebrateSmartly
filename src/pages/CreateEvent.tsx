
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { useEventCreation } from '@/hooks/useEventCreation';
import { EventDetailsForm } from '@/components/create-event/EventDetailsForm';
import { ThemeSelection } from '@/components/create-event/ThemeSelection';

const CreateEvent = () => {
  const [step, setStep] = useState(1);
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
    categories,
    themes,
    selectedTheme,
    setSelectedTheme,
    loading,
    categoriesLoading,
    generateThemes,
    createEvent
  } = useEventCreation();

  const handleGenerateThemes = async () => {
    console.log('Starting theme generation...');
    try {
      await generateThemes();
      console.log('Themes generated, checking themes length:', themes.length);
      // Force step change after successful generation
      if (themes.length > 0) {
        console.log('Moving to step 2');
        setStep(2);
      }
    } catch (error) {
      console.error('Error generating themes:', error);
    }
  };

  const handleCreateEvent = async () => {
    console.log('Creating event...');
    try {
      const success = await createEvent();
      if (success) {
        console.log('Event created successfully, resetting to step 1');
        setStep(1);
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  // Watch for themes changes to automatically move to step 2
  React.useEffect(() => {
    if (themes.length > 0 && step === 1) {
      console.log('Themes available, moving to step 2');
      setStep(2);
    }
  }, [themes.length, step]);

  return (
    <Layout>
      <Helmet>
        <title>Create Your Event | AI-Powered Event Planning | CelebrateSmartly</title>
        <meta 
          name="description" 
          content="Create your perfect event with AI-powered theme generation. Get personalized recommendations and connect with local vendors for unforgettable celebrations." 
        />
        <meta name="keywords" content="create event, AI event planning, event themes, party planning, celebration organizer, RSVP management" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Create Your Event | AI-Powered Event Planning" />
        <meta property="og:description" content="Create personalized events with AI-powered themes and local vendor connections" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/create-event`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Create Your Event - CelebrateSmartly" />
        <meta name="twitter:description" content="AI-powered event planning with personalized themes" />
        
        <link rel="canonical" href={`${window.location.origin}/create-event`} />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              {step === 1 && (
                <EventDetailsForm
                  eventName={eventName}
                  setEventName={setEventName}
                  location={location}
                  setLocation={setLocation}
                  numberOfPeople={numberOfPeople}
                  setNumberOfPeople={setNumberOfPeople}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  eventDate={eventDate}
                  setEventDate={setEventDate}
                  description={description}
                  setDescription={setDescription}
                  categories={categories}
                  categoriesLoading={categoriesLoading}
                  onGenerateThemes={handleGenerateThemes}
                  loading={loading}
                />
              )}
              {step === 2 && (
                <ThemeSelection
                  themes={themes}
                  selectedTheme={selectedTheme}
                  onThemeSelect={setSelectedTheme}
                  onBack={() => setStep(1)}
                  onCreateEvent={handleCreateEvent}
                  loading={loading}
                />
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateEvent;
