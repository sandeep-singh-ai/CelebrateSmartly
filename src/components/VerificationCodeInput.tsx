import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, User, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GuestInfo {
  guestName: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  status: string;
  checkedIn: boolean;
}

export const VerificationCodeInput = () => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '']);
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus next input when typing
  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single character
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setError(null);

    // Move to next input if value entered
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits are entered
    if (newCode.every(digit => digit !== '') && index === 4) {
      handleVerify(newCode.join(''));
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const newCode = [...verificationCode];
      newCode[index - 1] = '';
      setVerificationCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5);
    if (pastedData.length === 5) {
      const newCode = pastedData.split('');
      setVerificationCode(newCode);
      setError(null);
      // Auto-verify
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (code: string) => {
    if (code.length !== 5) return;
    
    setVerifying(true);
    setError(null);
    
    try {
      // Find invitation by verification code
      const { data: invitations, error: searchError } = await supabase
        .from('invitation_tracking')
        .select(`
          token,
          guest_name,
          guest_email,
          event_id,
          status,
          checked_in_at,
          events (
            title,
            event_date,
            location
          )
        `)
        .not('token', 'is', null);

      if (searchError) throw searchError;

      // Find the invitation that matches this verification code
      const invitation = invitations?.find(inv => {
        const generatedCode = generateVerificationCode(inv.token);
        return generatedCode === code;
      });

      if (!invitation) {
        setError('Invalid verification code. Please check and try again.');
        return;
      }

      setGuestInfo({
        guestName: invitation.guest_name,
        eventTitle: invitation.events?.title || 'Event',
        eventDate: invitation.events?.event_date || '',
        eventLocation: invitation.events?.location || '',
        status: invitation.status,
        checkedIn: !!invitation.checked_in_at
      });

      setVerified(true);
      toast({
        title: "Guest Found!",
        description: `Verified invitation for ${invitation.guest_name}`,
      });

    } catch (error) {
      console.error('Error verifying code:', error);
      setError('Failed to verify code. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const generateVerificationCode = (token: string): string => {
    // Generate a consistent 5-digit code based on the token
    const hash = token.split('').reduce((a, b) => {
      a = ((a << 5) - a + b.charCodeAt(0)) & 0xffffffff;
      return a;
    }, 0);
    return Math.abs(hash % 100000).toString().padStart(5, '0');
  };

  const handleCheckIn = async () => {
    if (!guestInfo) return;
    
    setCheckingIn(true);
    try {
      // Find the invitation token for this guest
      const { data: invitations, error: searchError } = await supabase
        .from('invitation_tracking')
        .select('token')
        .eq('guest_name', guestInfo.guestName)
        .eq('events.title', guestInfo.eventTitle);

      if (searchError) throw searchError;

      if (invitations && invitations.length > 0) {
        const token = invitations[0].token;
        
        // Mark as checked in
        const { error: updateError } = await supabase
          .from('invitation_tracking')
          .update({
            checked_in_at: new Date().toISOString(),
            status: 'checked_in'
          })
          .eq('token', token);

        if (updateError) throw updateError;

        setGuestInfo(prev => prev ? { ...prev, checkedIn: true } : null);
        toast({
          title: "Check-in Successful!",
          description: `${guestInfo.guestName} has been checked in!`,
        });
      }
    } catch (error) {
      console.error('Error checking in guest:', error);
      toast({
        title: "Check-in Failed",
        description: "Failed to check in guest. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCheckingIn(false);
    }
  };

  const resetForm = () => {
    setVerificationCode(['', '', '', '', '']);
    setGuestInfo(null);
    setVerified(false);
    setError(null);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Guest Check-in Verification
        </h2>
        <p className="text-gray-600">
          Enter the 5-digit verification code from the guest's invitation
        </p>
      </div>

      {/* Verification Code Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Enter Verification Code
          </CardTitle>
          <CardDescription>
            Type or paste the 5-digit code shown on the guest's invitation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Code Input Fields */}
          <div className="flex justify-center gap-3 mb-4">
            {verificationCode.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-16 h-16 text-center text-2xl font-bold border-2 focus:border-blue-500"
                placeholder="0"
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Verify Button */}
          <div className="text-center">
            <Button
              onClick={() => handleVerify(verificationCode.join(''))}
              disabled={verificationCode.some(digit => digit === '') || verifying}
              className="w-full"
              size="lg"
            >
              {verifying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Code
                </>
              )}
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-center text-sm text-gray-500">
            <p>• Enter the 5-digit code manually, or</p>
            <p>• Paste the code to auto-fill all fields</p>
          </div>
        </CardContent>
      </Card>

      {/* Guest Information */}
      {verified && guestInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Guest Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Guest Name</label>
                <p className="font-semibold">{guestInfo.guestName}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Event</label>
                <p className="font-semibold">{guestInfo.eventTitle}</p>
              </div>
              
              {guestInfo.eventDate && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Event Date</label>
                  <p className="font-semibold">{guestInfo.eventDate}</p>
                </div>
              )}
              
              {guestInfo.eventLocation && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <p className="font-semibold">{guestInfo.eventLocation}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <Badge variant={guestInfo.checkedIn ? "default" : "secondary"}>
                {guestInfo.checkedIn ? "Checked In" : "Not Checked In"}
              </Badge>
            </div>

            {/* Check-in Button */}
            {!guestInfo.checkedIn && (
              <Button
                onClick={handleCheckIn}
                disabled={checkingIn}
                className="w-full"
                size="lg"
              >
                {checkingIn ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Checking In...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Check In Guest
                  </>
                )}
              </Button>
            )}

            {guestInfo.checkedIn && (
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-medium">Guest Successfully Checked In!</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {verified && (
        <div className="flex gap-3">
          <Button
            onClick={resetForm}
            variant="outline"
            className="flex-1"
          >
            Verify Another Code
          </Button>
        </div>
      )}
    </div>
  );
};
