import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { showError } from '@/utils/toast';

export const QRScanner = () => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        () => {} // Error callback
      );
      setScanning(true);
    } catch (err) {
      showError('Failed to start QR scanner');
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop();
      scannerRef.current = null;
      setScanning(false);
    }
  };

  const handleScanSuccess = (url: string) => {
    stopScanning();
    // Extract reservation form ID from URL
    const formId = url.split('/').pop();
    if (formId) {
      navigate(`/reservation/${formId}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Scan Reservation QR Code</h1>
      <div id="qr-reader" className="w-full max-w-md h-64 mb-4 mx-auto border-2 border-gray-300 rounded-lg"></div>
      {!scanning ? (
        <Button onClick={startScanning} className="w-full max-w-md mx-auto">
          Start Scanning
        </Button>
      ) : (
        <Button onClick={stopScanning} variant="destructive" className="w-full max-w-md mx-auto">
          Stop Scanning
        </Button>
      )}
    </div>
  );
};