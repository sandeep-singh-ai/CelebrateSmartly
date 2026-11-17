
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UserCheck, UserX, Clock as ClockIcon } from 'lucide-react';
import { RSVPData } from './hooks/useRSVPData';
import { useRSVPSubmission } from './hooks/useRSVPSubmission';

interface RSVPResponseFormProps {
  rsvpData: RSVPData;
  token?: string;
  hasSubmitted: boolean;
  onSubmissionSuccess: () => void;
  selectedResponse: 'attending' | 'not_attending' | 'maybe' | null;
  setSelectedResponse: (response: 'attending' | 'not_attending' | 'maybe' | null) => void;
}

export const RSVPResponseForm = ({ 
  rsvpData, 
  token, 
  hasSubmitted, 
  onSubmissionSuccess,
  selectedResponse,
  setSelectedResponse
}: RSVPResponseFormProps) => {
  const [message, setMessage] = useState('');
  const submitResponseMutation = useRSVPSubmission(token);

  const hasResponded = rsvpData.status !== 'no_response';
  const currentResponse = hasResponded ? rsvpData.status : selectedResponse;

  // Check if event date has passed
  const eventDate = rsvpData.sub_event?.event_date || rsvpData.event?.event_date;
  const isEventPassed = eventDate ? new Date(eventDate) < new Date() : false;

  const handleSubmit = () => {
    if (selectedResponse) {
      submitResponseMutation.mutate(
        { response: selectedResponse, message },
        { onSuccess: onSubmissionSuccess }
      );
    }
  };

  const getResponseText = (status: string) => {
    switch (status) {
      case 'attending': return 'Yes, I\'ll attend';
      case 'not_attending': return 'Can\'t attend';
      case 'maybe': return 'Maybe';
      default: return 'No response';
    }
  };

  if (isEventPassed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Event Has Passed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              This event has already taken place. RSVP responses are no longer accepted.
            </p>
            {hasResponded && (
              <p className="text-sm text-gray-500">
                Your final response was: <strong>{getResponseText(rsvpData.status)}</strong>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Your RSVP</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasSubmitted ? (
          <div className="text-center space-y-4">
            <div className="text-green-600 font-semibold text-lg">
              Thank you! Your response has been updated.
            </div>
            <p className="text-gray-600">
              Your response: <strong>{getResponseText(selectedResponse || rsvpData.status)}</strong>
            </p>
            {message && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-700">Your message: "{message}"</p>
              </div>
            )}
            <p className="text-sm text-gray-500">
              You can change your response anytime before the event date.
            </p>
          </div>
        ) : hasResponded ? (
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Your current response: <strong>{getResponseText(rsvpData.status)}</strong>
            </p>
            <p className="text-sm text-gray-500">
              You can update your response or add a message below.
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-600">
            Please let us know if you'll be attending this event.
          </p>
        )}

        {!hasSubmitted && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={currentResponse === 'attending' ? 'default' : 'outline'}
                className={`flex flex-col items-center p-4 h-auto ${
                  currentResponse === 'attending' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'hover:bg-green-50 hover:border-green-300'
                }`}
                onClick={() => setSelectedResponse('attending')}
              >
                <UserCheck className="w-6 h-6 mb-2" />
                <span>Yes, I'll attend</span>
              </Button>

              <Button
                variant={currentResponse === 'not_attending' ? 'default' : 'outline'}
                className={`flex flex-col items-center p-4 h-auto ${
                  currentResponse === 'not_attending' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'hover:bg-red-50 hover:border-red-300'
                }`}
                onClick={() => setSelectedResponse('not_attending')}
              >
                <UserX className="w-6 h-6 mb-2" />
                <span>Can't attend</span>
              </Button>

              <Button
                variant={currentResponse === 'maybe' ? 'default' : 'outline'}
                className={`flex flex-col items-center p-4 h-auto ${
                  currentResponse === 'maybe' 
                    ? 'bg-yellow-600 hover:bg-yellow-700' 
                    : 'hover:bg-yellow-50 hover:border-yellow-300'
                }`}
                onClick={() => setSelectedResponse('maybe')}
              >
                <ClockIcon className="w-6 h-6 mb-2" />
                <span>Maybe</span>
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal message or dietary restrictions..."
                rows={3}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!selectedResponse || submitResponseMutation.isPending}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              {submitResponseMutation.isPending ? 'Updating...' : hasResponded ? 'Update Response' : 'Submit Response'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
