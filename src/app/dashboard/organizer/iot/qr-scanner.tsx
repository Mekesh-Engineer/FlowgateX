'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import type { CameraDevice } from 'html5-qrcode';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// UI Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Icons
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import FlashlightOnIcon from '@mui/icons-material/FlashlightOn';
import FlashlightOffIcon from '@mui/icons-material/FlashlightOff';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RouterIcon from '@mui/icons-material/Router';

// --- Types ---

interface ScanResult {
  id: string;
  data: string;
  timestamp: string;
  isValid: boolean;
  message: string;
  payload?: any;
}

interface ValidationResponse {
  valid: boolean;
  reason: string;
  payload: any;
}

// --- Configuration ---

const ESP32_CONFIG = {
  IP_ADDRESS: "10.250.176.91",
  CAMERA_STREAM_URL: "http://10.250.176.91/stream",
  CONTROL_URL: "http://10.250.176.91/openGate",
};

export default function IoTQrScanner() {
  // State
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [cameraMode, setCameraMode] = useState<'webcam' | 'esp32'>('webcam');
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [activeCameraId, setActiveCameraId] = useState<string | null>(null);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<{ time: string; msg: string; type: 'info' | 'success' | 'error' }[]>([]);

  // Refs
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const esp32PollInterval = useRef<NodeJS.Timeout | null>(null);

  // --- Helpers ---

  const log = useCallback((msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    setTerminalLogs((prev) => [
      { time: new Date().toLocaleTimeString(), msg, type },
      ...prev.slice(0, 99), // Keep last 100 logs
    ]);
  }, []);

  // Load History on Mount
  useEffect(() => {
    const saved = localStorage.getItem('iot_scan_history');
    if (saved) {
      try {
        setScanHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    
    // Get Cameras
    Html5Qrcode.getCameras()
      .then((devices: CameraDevice[]) => {
        if (devices && devices.length) {
          setCameras(devices);
          setActiveCameraId(devices[0].id);
        }
      })
      .catch((err: Error) => log(`Camera permissions error: ${err}`, 'error'));

    return () => {
      // Cleanup - stop scanning synchronously
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
      if (esp32PollInterval.current) {
        clearInterval(esp32PollInterval.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Validation Logic (Ported from qr.js) ---

  const validateTicket = (decodedText: string): ValidationResponse => {
    try {
      // 1. Extract JSON
      const jsonStartIndex = decodedText.indexOf("{");
      if (jsonStartIndex === -1) throw new Error("No JSON payload found.");
      
      const jsonString = decodedText.substring(jsonStartIndex);
      const payload = JSON.parse(jsonString);

      // 2. Required Fields
      const required = ["id", "title", "venue", "eventDate", "user", "qrValidation", "accessStatus"];
      const missing = required.filter((field) => !payload.hasOwnProperty(field));
      if (missing.length > 0) return { valid: false, reason: `Missing fields: ${missing.join(", ")}`, payload };

      // 3. Status Check
      if (payload.accessStatus !== "valid") return { valid: false, reason: `Status: ${payload.accessStatus}`, payload };

      // 4. Expiry
      const eventDate = new Date(payload.eventDate);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (today > eventDate) return { valid: false, reason: "Ticket Expired", payload };

      // 5. Validation Key
      const expectedKey = `VALID-${payload.id.slice(-9)}`;
      if (payload.qrValidation !== expectedKey) return { valid: false, reason: "Invalid Signature", payload };

      // 6. Reuse Check (Mock using LocalStorage)
      const usedTickets = JSON.parse(localStorage.getItem('usedTickets') || "[]");
      if (usedTickets.includes(payload.id)) return { valid: false, reason: "Ticket Already Used", payload };

      // Mark as used
      usedTickets.push(payload.id);
      localStorage.setItem('usedTickets', JSON.stringify(usedTickets));

      return { valid: true, reason: "Access Granted", payload };

    } catch (e: any) {
      return { valid: false, reason: `Format Error: ${e.message}`, payload: null };
    }
  };

  const handleScanSuccess = async (decodedText: string) => {
    // Prevent duplicate processing if it's the exact same as immediate last result
    if (lastResult?.data === decodedText && (Date.now() - new Date(lastResult.timestamp).getTime() < 3000)) return;

    const validation = validateTicket(decodedText);
    const resultEntry: ScanResult = {
      id: crypto.randomUUID(),
      data: decodedText,
      timestamp: new Date().toISOString(),
      isValid: validation.valid,
      message: validation.reason,
      payload: validation.payload
    };

    setLastResult(resultEntry);
    setScanHistory((prev) => {
      const updated = [resultEntry, ...prev];
      localStorage.setItem('iot_scan_history', JSON.stringify(updated));
      return updated;
    });

    log(`Scanned: ${validation.valid ? 'VALID' : 'INVALID'} - ${validation.reason}`, validation.valid ? 'success' : 'error');

    if (validation.valid) {
      // Trigger ESP32 Gate logic if needed
      if (cameraMode === 'esp32') {
         // Logic to open gate via ESP32 API
         try {
             await fetch(ESP32_CONFIG.CONTROL_URL, { method: 'GET', signal: AbortSignal.timeout(2000) });
             log('Gate Open Command Sent', 'success');
         } catch(e) {
             log('Gate Control Failed', 'error');
         }
      }
    }
  };

  // --- Scanning Control ---

  const startScan = async () => {
    try {
      setIsScanning(true);
      log(`Starting scanner in ${cameraMode} mode...`);

      if (cameraMode === 'webcam') {
        if (!activeCameraId) throw new Error("No camera selected");
        
        const scanner = new Html5Qrcode("reader");
        scannerRef.current = scanner;

        await scanner.start(
          activeCameraId,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText: string) => handleScanSuccess(decodedText),
          () => {} // Ignore frame failures
        );
        log("Webcam scanner active", 'success');
        
        // Check torch capability
        const caps = scanner.getRunningTrackCapabilities();
        // @ts-ignore - torch is not in standard types yet
        setTorchEnabled(false); // Reset state
      } 
      else if (cameraMode === 'esp32') {
        // ESP32 Polling Logic
        esp32PollInterval.current = setInterval(async () => {
           try {
             const res = await fetch(`http://${ESP32_CONFIG.IP_ADDRESS}/getQRData`);
             if (res.ok) {
               const data = await res.json();
               if (data.qrCode) handleScanSuccess(data.qrCode);
             }
           } catch(e) { /* silent fail */ }
        }, 1000);
        log("Connected to ESP32 stream", 'success');
      }
    } catch (err: any) {
      setIsScanning(false);
      log(`Start failed: ${err.message}`, 'error');
    }
  };

  const stopScan = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop();
      scannerRef.current.clear();
    }
    if (esp32PollInterval.current) {
      clearInterval(esp32PollInterval.current);
    }
    setIsScanning(false);
    log("Scanner stopped");
  };

  const toggleTorch = async () => {
    if (scannerRef.current && cameraMode === 'webcam') {
      try {
        await scannerRef.current.applyVideoConstraints({
          advanced: [{ torch: !torchEnabled }] as any
        });
        setTorchEnabled(!torchEnabled);
      } catch (e) {
        log("Torch not supported on this device", 'error');
      }
    }
  };

  const switchCamera = () => {
    if (cameras.length > 1) {
      const idx = cameras.findIndex(c => c.id === activeCameraId);
      const next = cameras[(idx + 1) % cameras.length];
      setActiveCameraId(next.id);
      if (isScanning) {
        stopScan().then(() => setTimeout(startScan, 500)); // Restart with new cam
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    log(`Processing file: ${file.name}`);
    const html5QrCode = new Html5Qrcode("file-reader-dummy");
    html5QrCode.scanFile(file, true)
      .then(handleScanSuccess)
      .catch((err: Error) => log(`File scan failed: ${err}`, 'error'));
  };

  const clearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem('iot_scan_history');
    log("History cleared");
  };

  const downloadHistory = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Timestamp,Valid,Message,Data\n"
      + scanHistory.map(e => `${e.timestamp},${e.isValid},${e.message},"${e.data.replace(/"/g, '""')}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "scan_history.csv");
    document.body.appendChild(link);
    link.click();
  };

  // --- Render ---

  return (
    <div className="qr-scanner-container">
      
      {/* LEFT COLUMN: SCANNER */}
      <div className="qr-scanner-left">
        <Card className="qr-scanner-viewport">
          
          {/* Viewport Layer */}
          <div className="qr-scanner-viewport-inner">
            {/* Hidden div for file scanning logic */}
            <div id="file-reader-dummy" className="hidden"></div>

            {!isScanning && (
              <div className="qr-scanner-idle">
                <QrCodeScannerIcon className="qr-scanner-idle-icon" />
                <p>Scanner Idle</p>
                <p className="qr-scanner-idle-text">Select a mode and start scanning</p>
              </div>
            )}

            {/* Webcam Mount Point */}
            {cameraMode === 'webcam' && (
              <div id="reader" className={cn("qr-scanner-reader", !isScanning && "qr-scanner-reader-hidden")} />
            )}

            {/* ESP32 Stream */}
            {cameraMode === 'esp32' && isScanning && (
              <img src={ESP32_CONFIG.CAMERA_STREAM_URL} alt="ESP32 Stream" className="qr-scanner-esp32-stream" />
            )}

            {/* Scanning Overlay */}
            {isScanning && (
              <div className="qr-scanner-overlay">
                <motion.div 
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="qr-scanner-line"
                />
                <div className="qr-scanner-frame">
                  <div className="qr-scanner-corner qr-scanner-corner-tl"></div>
                  <div className="qr-scanner-corner qr-scanner-corner-tr"></div>
                  <div className="qr-scanner-corner qr-scanner-corner-bl"></div>
                  <div className="qr-scanner-corner qr-scanner-corner-br"></div>
                </div>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="qr-scanner-controls">
            {!isScanning ? (
              <button onClick={startScan} className="qr-scanner-btn-start">
                <PlayCircleIcon /> Start Scan
              </button>
            ) : (
              <button onClick={stopScan} className="qr-scanner-btn-stop">
                <StopCircleIcon /> Stop
              </button>
            )}

            <div className="qr-scanner-controls-divider" />

            {/* Camera Mode Toggle */}
            <div className="qr-scanner-mode-toggle">
              <button 
                onClick={() => setCameraMode('webcam')} 
                className={cn("qr-scanner-mode-btn", cameraMode === 'webcam' && "qr-scanner-mode-btn-active")}
              >
                <CameraswitchIcon fontSize="small" />
              </button>
              <button 
                onClick={() => setCameraMode('esp32')} 
                className={cn("qr-scanner-mode-btn", cameraMode === 'esp32' && "qr-scanner-mode-btn-active")}
                title="ESP32 IoT Cam"
              >
                <RouterIcon fontSize="small" />
              </button>
            </div>

            {/* Torch & Switch (Webcam Only) */}
            {cameraMode === 'webcam' && (
              <>
                <button className="qr-scanner-icon-btn" onClick={switchCamera}>
                  <CameraswitchIcon />
                </button>
                <button 
                  className={cn("qr-scanner-icon-btn", torchEnabled && "qr-scanner-icon-btn-active")} 
                  onClick={toggleTorch}
                >
                  {torchEnabled ? <FlashlightOnIcon /> : <FlashlightOffIcon />}
                </button>
              </>
            )}

            <div className="qr-scanner-controls-divider" />
            
            <button className="qr-scanner-icon-btn" onClick={() => fileInputRef.current?.click()}>
              <UploadFileIcon />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          </div>
        </Card>

        {/* Console / Terminal */}
        <Card className="qr-scanner-terminal">
          {terminalLogs.length === 0 && <span className="qr-scanner-terminal-empty">System ready. Waiting for input...</span>}
          {terminalLogs.map((logEntry, i) => (
            <div key={i} className="qr-scanner-log-entry">
              <span className="qr-scanner-log-time">[{logEntry.time}]</span>{' '}
              <span className={cn(
                logEntry.type === 'error' && 'qr-scanner-log-type-error',
                logEntry.type === 'success' && 'qr-scanner-log-type-success',
                logEntry.type === 'info' && 'qr-scanner-log-type-info'
              )}>
                {logEntry.type.toUpperCase()}
              </span>{' '}
              <span className="qr-scanner-log-msg">{logEntry.msg}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* RIGHT COLUMN: RESULTS & HISTORY */}
      <div className="qr-scanner-right">
        
        {/* Current Result Card */}
        <Card className={cn(
          "qr-scanner-result",
          !lastResult && "qr-scanner-result-empty",
          lastResult?.isValid && "qr-scanner-result-valid",
          lastResult && !lastResult.isValid && "qr-scanner-result-invalid"
        )}>
          {!lastResult ? (
            <div className="qr-scanner-result-placeholder">
              <QrCodeScannerIcon className="qr-scanner-result-placeholder-icon" />
              <p>No result yet</p>
            </div>
          ) : (
            <div className="qr-scanner-result-content">
              <div className="qr-scanner-result-header">
                {lastResult.isValid 
                  ? <CheckCircleIcon className="qr-scanner-result-icon-valid" /> 
                  : <ErrorIcon className="qr-scanner-result-icon-invalid" />
                }
                <div>
                  <h3 className={lastResult.isValid ? "qr-scanner-result-title-valid" : "qr-scanner-result-title-invalid"}>
                    {lastResult.isValid ? "ACCESS GRANTED" : "ACCESS DENIED"}
                  </h3>
                  <p className="qr-scanner-result-message">{lastResult.message}</p>
                </div>
              </div>
              
              {lastResult.payload && (
                <div className="qr-scanner-result-details">
                  <div className="qr-scanner-result-details-row">
                    <span className="qr-scanner-result-details-label">Name:</span>
                    <span className="qr-scanner-result-details-value">
                      {lastResult.payload.user?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="qr-scanner-result-details-row">
                    <span className="qr-scanner-result-details-label">Event:</span>
                    <span className="qr-scanner-result-details-value">
                      {lastResult.payload.title || 'N/A'}
                    </span>
                  </div>
                  <div className="qr-scanner-result-details-row">
                    <span className="qr-scanner-result-details-label">Date:</span>
                    <span className="qr-scanner-result-details-value">
                      {lastResult.payload.eventDate ? new Date(lastResult.payload.eventDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              )}

              <div className="qr-scanner-result-raw">
                {lastResult.data}
              </div>
            </div>
          )}
        </Card>

        {/* History Panel */}
        <Card className="qr-scanner-history">
          <div className="qr-scanner-history-header">
            <h3 className="qr-scanner-history-title">
              <HistoryIcon className="qr-scanner-history-title-icon" fontSize="small"/> Recent Scans
            </h3>
            <div className="qr-scanner-history-actions">
              <button className="qr-scanner-history-btn" onClick={downloadHistory} title="Export CSV">
                <DownloadIcon fontSize="small"/>
              </button>
              <button className="qr-scanner-history-btn qr-scanner-history-btn-danger" onClick={clearHistory} title="Clear History">
                <DeleteSweepIcon fontSize="small"/>
              </button>
            </div>
          </div>
           
          <div className="qr-scanner-history-list">
            <div className="qr-scanner-history-list-content">
              {scanHistory.length === 0 && (
                <p className="qr-scanner-history-empty">History is empty</p>
              )}
              {scanHistory.map((scan) => (
                <div 
                  key={scan.id} 
                  className="qr-scanner-history-item" 
                  onClick={() => setLastResult(scan)}
                >
                  <div className="qr-scanner-history-item-icon">
                    {scan.isValid 
                      ? <CheckCircleIcon className="qr-scanner-history-item-icon-valid" /> 
                      : <ErrorIcon className="qr-scanner-history-item-icon-invalid" />
                    }
                  </div>
                  <div className="qr-scanner-history-item-content">
                    <p className={cn(
                      "qr-scanner-history-item-text",
                      scan.isValid ? "qr-scanner-history-item-text-valid" : "qr-scanner-history-item-text-invalid"
                    )}>
                      {scan.isValid ? scan.payload?.user?.name || "Valid Ticket" : scan.message}
                    </p>
                    <p className="qr-scanner-history-item-time">{scan.timestamp}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="qr-scanner-history-item-copy" 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(scan.data);
                      log('Copied to clipboard');
                    }}
                  >
                    <ContentCopyIcon style={{ fontSize: 14 }} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}