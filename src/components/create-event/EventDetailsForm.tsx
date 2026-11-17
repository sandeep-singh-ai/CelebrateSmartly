import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface EventCategory {
  id: string;
  name: string;
  description: string;
}

interface EventDetailsFormProps {
  eventName: string;
  setEventName: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  numberOfPeople: number;
  setNumberOfPeople: (value: number) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  eventDate: string;
  setEventDate: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  categories: EventCategory[];
  categoriesLoading: boolean;
  onGenerateThemes: () => void;
  loading: boolean;
}

export const EventDetailsForm: React.FC<EventDetailsFormProps> = ({
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
  categoriesLoading,
  onGenerateThemes,
  loading
}) => {
  const isFormValid = eventName && location && numberOfPeople && selectedCategory && eventDate;

  return (
    <>
      <CardHeader className="space-y-2">
        <CardTitle>Event Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Event Name *</Label>
          <Input
            id="name"
            placeholder="My Awesome Party"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="date">Event Date *</Label>
          <Input
            id="date"
            type="datetime-local"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            placeholder="City, State"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="people">Number of People *</Label>
          <Input
            id="people"
            type="number"
            placeholder="100"
            value={numberOfPeople.toString()}
            onChange={(e) => setNumberOfPeople(parseInt(e.target.value) || 1)}
            min="1"
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={categoriesLoading}>
            <SelectTrigger>
              <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select a category"} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {categories.length === 0 && !categoriesLoading && (
            <p className="text-sm text-gray-500">No categories available</p>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Tell us more about your event..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <Button 
          onClick={onGenerateThemes} 
          disabled={loading || !isFormValid} 
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
        >
          {loading ? 'Creating Unique Themes...' : 'Generate Celebration Themes'}
        </Button>
      </CardContent>
    </>
  );
};
