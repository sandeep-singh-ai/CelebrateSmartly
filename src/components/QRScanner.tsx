import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { QrCode, Camera, CheckCircle, XCircle, User, Calendar, MapPin } from 'lucide-react';
import { markGuestCheckedIn, getInvitationStatus } from '@/utils/invitationUtils';
import { useToast } from '@/hooks/use-toast';

interface QRScannerProps {
  eventId?: string;
  eventTitle?: string;
}

export const QRScanner = ({ eventId, eventTitle }: QRScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [guestInfo, setGuestInfo] = useState<{
    guestName: string;
    eventTitle: string;
    status: string;
    checkedIn: boolean;
  } | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [scanHistory, setScanHistory] = useState<Array<{
    token: string;
    guestName: string;
    status: string;
    timestamp: string;
  }>>([]);
  
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Start camera for QR scanning
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Access Error",
        description: "Unable to access camera. Please check permissions or use manual entry.",
        variant: "destructive",
      });
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  // Handle manual token entry
  const handleManualTokenSubmit = async () => {
    if (!manualToken.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid invitation token",
        variant: "destructive",
      });
      return;
    }

    await processToken(manualToken.trim());
  };

  // Process QR code token
  const processToken = async (token: string) => {
    try {
      const result = await getInvitationStatus(token);
      
      if (result.success && result.data) {
        setGuestInfo(result.data);
        
        // Add to scan history
        setScanHistory(prev => [
          {
            token,
            guestName: result.data!.guestName,
            status: result.data!.status,
            timestamp: new Date().toLocaleTimeString()
          },
          ...prev.slice(0, 9) // Keep last 10 scans
        ]);
        
        toast({
          title: "Guest Found",
          description: `Found ${result.data.guestName} for ${result.data.eventTitle}`,
        });
      } else {
        setGuestInfo(null);
        toast({
          title: "Invalid Token",
          description: result.error || "This invitation token is not valid",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error processing token:', error);
      toast({
        title: "Error",
        description: "Failed to process invitation token",
        variant: "destructive",
      });
    }
  };

  // Check in guest
  const handleCheckIn = async () => {
    if (!guestInfo) return;
    
    setCheckingIn(true);
    try {
      const result = await markGuestCheckedIn(manualToken);
      
      if (result.success) {
        setGuestInfo(prev => prev ? { ...prev, checkedIn: true } : null);
        toast({
          title: "Check-in Successful",
          description: `${guestInfo.guestName} has been checked in!`,
        });
        
        // Update scan history
        setScanHistory(prev => 
          prev.map(scan => 
            scan.token === manualToken 
              ? { ...scan, status: 'checked_in' }
              : scan
          )
        );
        
        // Clear manual token
        setManualToken('');
      } else {
        toast({
          title: "Check-in Failed",
          description: result.error || "Failed to check in guest",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking in guest:', error);
      toast({
        title: "Error",
        description: "Failed to check in guest",
        variant: "destructive",
      });
    } finally {
      setCheckingIn(false);
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Guest Check-in Scanner
        </h2>
        {eventTitle && (
          <p className="text-gray-600">Event: {eventTitle}</p>
        )}
      </div>

      {/* Camera Scanner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            QR Code Scanner
          </CardTitle>
          <CardDescription>
            Scan guest QR codes or manually enter invitation tokens
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Camera View */}
          <div className="relative">
            <video
              ref={videoRef}
              className={`w-full h-64 object-cover rounded-lg border-2 ${
                scanning ? 'border-blue-500' : 'border-gray-300'
              }`}
              autoPlay
              playsInline
            />
            
            {!scanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <Camera className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Camera not active</p>
                </div>
              </div>
            )}
            
            {/* Scanning overlay */}
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-blue-500 rounded-lg relative">
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-blue-500"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-blue-500"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-blue-500"></div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-blue-500"></div>
                </div>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="flex gap-2">
            {!scanning ? (
              <Button onClick={startCamera} className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                Start Scanner
              </Button>
            ) : (
              <Button onClick={stopCamera} variant="outline" className="flex-1">
                <XCircle className="h-4 w-4 mr-2" />
                Stop Scanner
              </Button>
            )}
          </div>

          {/* Manual Token Entry */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Manual Token Entry</label>
            <div className="flex gap-2">
              <Input
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="Enter invitation token manually"
                className="flex-1"
              />
              <Button onClick={handleManualTokenSubmit} disabled={!manualToken.trim()}>
                <QrCode className="h-4 w-4 mr-2" />
                Verify
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guest Information */}
      {guestInfo && (
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
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Status</label>
                <Badge variant={guestInfo.checkedIn ? "default" : "secondary"}>
                  {guestInfo.checkedIn ? "Checked In" : "Not Checked In"}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Invitation Status</label>
                <Badge variant="outline">{guestInfo.status}</Badge>
              </div>
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

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>Last 10 scanned invitations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scanHistory.map((scan, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">{scan.guestName}</p>
                      <p className="text-sm text-gray-500">{scan.timestamp}</p>
                    </div>
                  </div>
                  <Badge variant={scan.status === 'checked_in' ? 'default' : 'secondary'}>
                    {scan.status === 'checked_in' ? 'Checked In' : scan.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <p className="text-sm text-gray-600">
              Start the camera scanner or manually enter an invitation token
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <p className="text-sm text-gray-600">
              Verify the guest information appears correctly
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <p className="text-sm text-gray-600">
              Click "Check In Guest" to mark them as present at the event
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};