import { useEffect, useRef } from 'react';
import QrScannerLib from 'qr-scanner';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type QrScannerProps = {
    open: boolean;
    onClose: () => void;
    onScan: (data: string) => void;
};

export default function QrScanner({ open, onClose, onScan }: QrScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const scannerRef = useRef<QrScannerLib | null>(null);

    useEffect(() => {
        if (open && videoRef.current) {
            scannerRef.current = new QrScannerLib(
                videoRef.current,
                (result: any) => {
                    console.log('QR code scanned:', result);
                    onScan(result);
                    scannerRef.current?.stop();
                    onClose();
                },
                { returnDetailedScanResult: true }
            );
            scannerRef.current.start().catch((err) => console.error(err));
        }

        return () => {
            scannerRef.current?.stop();
            scannerRef.current?.destroy();
            scannerRef.current = null;
        };
    }, [open, onScan, onClose]);

    if (!open) return null;

    return (
        <>
            {/* Overlay mờ nhưng không che hết nền */}
            <div className="fixed inset-0 z-50 bg-black opacity-60 backdrop-blur-sm"></div>

            \<div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="relative w-full max-w-md p-6 bg-neutral-800 rounded-xl shadow-xl border border-gray-600 pointer-events-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-white text-lg font-semibold">Quét QR Code</h2>
                        <Button
                            variant="ghost"
                            className="p-2  hover:bg-gray-700"
                            onClick={() => {
                                scannerRef.current?.stop();
                                onClose();
                            }}
                        >
                            <X className="w-5 h-5 text-red-500" />
                        </Button>
                    </div>


                    <div className="relative w-full h-64 flex items-center justify-center rounded-lg overflow-hidden border-4 border-dashed border-green-400">
                        <video ref={videoRef} className="w-full h-full object-cover" />

                        <div className="absolute inset-0 border-4 border-green-400 rounded-lg pointer-events-none animate-pulse"></div>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-gray-400 text-sm">
                            Hướng camera vào vé để quét tự động
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
