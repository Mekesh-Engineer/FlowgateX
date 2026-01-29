'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

// Icons
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LinkIcon from '@mui/icons-material/Link';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';
import RouterIcon from '@mui/icons-material/Router';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import TimelineIcon from '@mui/icons-material/Timeline';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// QR Scanner Component
import IoTQrScanner from './qr-scanner';

// ==========================================
// MOCK DATA
// ==========================================

const DEVICES = [
  { id: 'GT-001', name: 'Main Entrance Scanner', type: 'Gateway', status: 'online', battery: 92, lastPing: '30s ago', firmware: 'v2.1.0', event: 'Tech Conference' },
  { id: 'GT-002', name: 'VIP Access Point', type: 'Gateway', status: 'online', battery: 85, lastPing: '1m ago', firmware: 'v2.1.0', event: 'Tech Conference' },
  { id: 'SN-104', name: 'Crowd Density A', type: 'Sensor', status: 'offline', battery: 0, lastPing: '4h ago', firmware: 'v1.8.5', event: 'Unassigned' },
  { id: 'SN-105', name: 'Crowd Density B', type: 'Sensor', status: 'online', battery: 12, lastPing: '5m ago', firmware: 'v1.8.5', event: 'Summer Fest' },
  { id: 'GT-003', name: 'Backstage Reader', type: 'Gateway', status: 'online', battery: 78, lastPing: '2m ago', firmware: 'v2.0.5', event: 'Summer Fest' },
  { id: 'GT-004', name: 'Parking Gate 1', type: 'Gateway', status: 'maintenance', battery: 100, lastPing: '10m ago', firmware: 'v2.1.0', event: 'Unassigned' },
];

const EVENTS_LIST = ['Tech Conference', 'Summer Fest', 'Food Expo', 'Unassigned'];

const LOGS = [
  { id: 1, time: '10:42 AM', device: 'GT-001', type: 'info', message: 'Firmware update completed successfully.' },
  { id: 2, time: '10:30 AM', device: 'SN-104', type: 'error', message: 'Connection lost. Heartbeat missed.' },
  { id: 3, time: '09:15 AM', device: 'GT-002', type: 'warning', message: 'High latency detected (450ms).' },
  { id: 4, time: '08:00 AM', device: 'System', type: 'info', message: 'Scheduled health check completed.' },
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function IoTManagementPage() {
  // State
  const [activeTab, setActiveTab] = useState<'devices' | 'health' | 'logs'>('devices');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);

  // Computed Stats
  const totalDevices = DEVICES.length;
  const onlineCount = DEVICES.filter(d => d.status === 'online').length;
  const lowBatteryCount = DEVICES.filter(d => d.battery < 20 && d.status !== 'offline').length;
  const offlineCount = DEVICES.filter(d => d.status === 'offline').length;
  const healthScore = Math.round((onlineCount / totalDevices) * 100);

  // Filter Logic
  const filteredDevices = useMemo(() => {
    return DEVICES.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || d.status === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(filteredDevices.map(d => d.id));
    else setSelectedIds([]);
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkAction = (action: string) => {
    if (action === 'update') setShowUpdateModal(true);
    if (action === 'assign') setShowAssignModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 p-4 md:p-8">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">IoT Device Management</h1>
          <p className="text-gray-500">Monitor gateways, sensors, and access control hardware.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 bg-white" onClick={() => window.location.reload()}>
            <RefreshIcon fontSize="small" /> Refresh Status
          </Button>
          <Button variant="outline" className="gap-2 bg-white border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => setShowQrScanner(true)}>
            <QrCodeScannerIcon fontSize="small" /> Gate Scanner
          </Button>
          <Button className="gap-2 shadow-lg shadow-blue-500/20" onClick={() => setShowAddModal(true)}>
            <AddIcon fontSize="small" /> Register Device
          </Button>
        </div>
      </div>

      {/* ================= HEALTH DASHBOARD ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">System Health</p>
            <h4 className="text-2xl font-bold text-gray-900">{healthScore}%</h4>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <CheckCircleIcon style={{ fontSize: 14 }} /> Systems Operational
            </p>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <SignalCellularAltIcon />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Online Devices</p>
            <h4 className="text-2xl font-bold text-gray-900">{onlineCount} <span className="text-gray-400 text-lg font-normal">/ {totalDevices}</span></h4>
            <p className="text-xs text-gray-500 mt-1">Active gateways</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <RouterIcon />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Issues Detected</p>
            <h4 className="text-2xl font-bold text-red-600">{offlineCount}</h4>
            <p className="text-xs text-red-500 mt-1">Offline / Error State</p>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <WarningAmberIcon />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Battery Alerts</p>
            <h4 className="text-2xl font-bold text-yellow-600">{lowBatteryCount}</h4>
            <p className="text-xs text-yellow-600 mt-1">Devices below 20%</p>
          </div>
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
            <BatteryAlertIcon />
          </div>
        </Card>
      </div>

      {/* ================= TABS & CONTROLS ================= */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
          
          {/* Navigation Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
            {['devices', 'health', 'logs'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all capitalize flex-1 md:flex-none",
                  activeTab === tab 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search & Filter (Only for Devices Tab) */}
          {activeTab === 'devices' && (
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
                <input 
                  type="text" 
                  placeholder="Search devices..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          )}
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && activeTab === 'devices' && (
           <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100 animate-fadeIn">
              <span className="text-sm font-semibold text-blue-800">{selectedIds.length} devices selected</span>
              <div className="flex gap-2">
                 <Button size="sm" onClick={() => handleBulkAction('update')} className="bg-white text-blue-700 border border-blue-200 hover:bg-blue-100">
                    <SystemUpdateAltIcon fontSize="small" className="mr-2" /> Update Firmware
                 </Button>
                 <Button size="sm" onClick={() => handleBulkAction('assign')} className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-100">
                    <LinkIcon fontSize="small" className="mr-2" /> Assign Event
                 </Button>
                 <Button size="sm" className="bg-white text-red-600 border border-red-200 hover:bg-red-50">
                    <DeleteIcon fontSize="small" className="mr-2" /> Unregister
                 </Button>
              </div>
           </div>
        )}
      </div>

      {/* ================= CONTENT VIEWS ================= */}
      
      {/* 1. DEVICE LIST VIEW */}
      {activeTab === 'devices' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                  <th className="p-4 w-12 text-center">
                    <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === filteredDevices.length && filteredDevices.length > 0} className="rounded text-blue-600" />
                  </th>
                  <th className="p-4">Device Info</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Assigned To</th>
                  <th className="p-4">Battery</th>
                  <th className="p-4">Last Ping</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-center">
                      <input type="checkbox" checked={selectedIds.includes(device.id)} onChange={() => handleSelectOne(device.id)} className="rounded text-blue-600" />
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{device.name}</div>
                      <div className="text-xs text-gray-500 font-mono">{device.id} • {device.firmware}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant={device.status === 'online' ? 'success' : device.status === 'offline' ? 'destructive' : 'warning'}>
                        {device.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        {device.event === 'Unassigned' ? <span className="text-gray-400 italic">Unassigned</span> : device.event}
                      </div>
                    </td>
                    <td className="p-4 w-32">
                      <div className="flex items-center gap-2">
                        {device.battery < 20 ? <BatteryAlertIcon fontSize="small" className="text-red-500"/> : <BatteryFullIcon fontSize="small" className="text-green-500"/>}
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                           <div className={cn("h-full", device.battery < 20 ? "bg-red-500" : "bg-green-500")} style={{width: `${device.battery}%`}}></div>
                        </div>
                        <span className="text-xs font-mono">{device.battery}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {device.lastPing}
                    </td>
                    <td className="p-4 text-right">
                       <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100">
                          <MoreVertIcon fontSize="small" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. HEALTH VIEW */}
      {activeTab === 'health' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
           <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <TimelineIcon /> Uptime History (24h)
              </h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
                 <span className="text-gray-400">Chart Visualization Placeholder</span>
              </div>
           </Card>
           
           <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Error Distribution</h3>
              <div className="space-y-4">
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                       <span>Connection Timeout</span>
                       <span className="font-bold text-red-600">12%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                       <div className="bg-red-500 h-2 rounded-full" style={{width: '12%'}}></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                       <span>Low Battery Shutdown</span>
                       <span className="font-bold text-yellow-600">5%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                       <div className="bg-yellow-500 h-2 rounded-full" style={{width: '5%'}}></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                       <span>Firmware Crash</span>
                       <span className="font-bold text-blue-600">1%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                       <div className="bg-blue-500 h-2 rounded-full" style={{width: '1%'}}></div>
                    </div>
                 </div>
              </div>
           </Card>
        </div>
      )}

      {/* 3. LOGS VIEW */}
      {activeTab === 'logs' && (
        <Card className="animate-fadeIn overflow-hidden">
           <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">System Logs</h3>
           </div>
           <div className="divide-y divide-gray-100">
              {LOGS.map((log) => (
                 <div key={log.id} className="p-4 hover:bg-gray-50 flex gap-4 items-start">
                    <div className={cn(
                       "w-2 h-2 rounded-full mt-2 shrink-0",
                       log.type === 'error' ? "bg-red-500" : log.type === 'warning' ? "bg-yellow-500" : "bg-blue-500"
                    )} />
                    <div className="flex-1">
                       <p className="text-sm font-medium text-gray-900">{log.message}</p>
                       <p className="text-xs text-gray-500 mt-0.5">{log.time} • Device: <span className="font-mono text-gray-700">{log.device}</span></p>
                    </div>
                    <Badge variant="outline" className="uppercase text-[10px]">{log.type}</Badge>
                 </div>
              ))}
           </div>
        </Card>
      )}

      {/* ================= MODALS ================= */}
      
      {/* Add Device Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Register New Device">
         <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
               <button className="p-6 border border-blue-500 bg-blue-50 rounded-xl flex flex-col items-center gap-2 text-blue-700 ring-2 ring-blue-500 ring-offset-2">
                  <QrCodeScannerIcon fontSize="large" />
                  <span className="font-bold text-sm">Scan QR</span>
               </button>
               <button className="p-6 border border-gray-200 bg-white rounded-xl flex flex-col items-center gap-2 text-gray-600 hover:bg-gray-50">
                  <span className="material-icons-outlined text-3xl">keyboard</span>
                  <span className="font-bold text-sm">Manual Entry</span>
               </button>
            </div>
            <p className="text-sm text-center text-gray-500">Point your camera at the QR code on the back of the device.</p>
            <div className="h-48 bg-black rounded-lg flex items-center justify-center text-white/50">
               [Camera Preview Placeholder]
            </div>
         </div>
      </Modal>

      {/* Update Firmware Modal */}
      <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} title="Bulk Firmware Update">
         <div className="space-y-4">
            <p className="text-sm text-gray-600">You are about to update <span className="font-bold text-gray-900">{selectedIds.length} devices</span> to the latest stable version (v2.2.0).</p>
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-xs text-yellow-800 flex gap-2">
               <WarningAmberIcon fontSize="small" />
               <p>Devices will be offline for approximately 2-5 minutes during this process.</p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
               <Button variant="outline" onClick={() => setShowUpdateModal(false)}>Cancel</Button>
               <Button variant="primary">Confirm Update</Button>
            </div>
         </div>
      </Modal>

      {/* Assign Event Modal */}
      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Assign to Event">
         <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Select Event</label>
            <select className="input w-full">
               <option>Select an event...</option>
               {EVENTS_LIST.map(e => <option key={e}>{e}</option>)}
            </select>
            <div className="flex justify-end gap-2 mt-4">
               <Button variant="outline" onClick={() => setShowAssignModal(false)}>Cancel</Button>
               <Button variant="primary">Assign</Button>
            </div>
         </div>
      </Modal>

      {/* QR Scanner Modal - Full Screen */}
      {showQrScanner && (
        <div className="fixed inset-0 z-50 bg-gray-900/95 overflow-auto">
          <div className="min-h-screen p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-xl">
                  <QrCodeScannerIcon className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Gate Access Scanner</h2>
                  <p className="text-sm text-gray-400">Scan tickets to validate and control gate access</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => setShowQrScanner(false)}
              >
                Close Scanner
              </Button>
            </div>
            
            {/* QR Scanner Component */}
            <IoTQrScanner />
          </div>
        </div>
      )}

    </div>
  );
}