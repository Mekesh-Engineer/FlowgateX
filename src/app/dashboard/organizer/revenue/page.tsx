'use client';

import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Icons
import DownloadIcon from '@mui/icons-material/Download';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

// ==========================================
// MOCK DATA
// ==========================================

const REVENUE_BY_TIER = [
  { name: 'VIP', value: 450000 },
  { name: 'General', value: 680000 },
  { name: 'Early Bird', value: 220000 },
  { name: 'Student', value: 50000 },
];

const REVENUE_BY_METHOD = [
  { method: 'UPI', amount: 850000 },
  { method: 'Credit Card', amount: 420000 },
  { method: 'Debit Card', amount: 120000 },
  { method: 'Net Banking', amount: 80000 },
];

const PAYOUTS = [
  { id: 'PO-7782', date: 'Oct 25, 2026', amount: 125000, status: 'Processing', method: 'Bank Transfer (**8821)' },
  { id: 'PO-7781', date: 'Oct 15, 2026', amount: 450000, status: 'Completed', method: 'Bank Transfer (**8821)' },
  { id: 'PO-7780', date: 'Oct 01, 2026', amount: 280000, status: 'Completed', method: 'UPI (merchant@upi)' },
  { id: 'PO-7779', date: 'Sep 15, 2026', amount: 310000, status: 'Completed', method: 'Bank Transfer (**8821)' },
];

const EVENTS_INVOICES = [
  { id: 'INV-2026-001', event: 'Tech Conference 2026', date: 'Oct 20, 2026', amount: 850000, status: 'Ready' },
  { id: 'INV-2026-002', event: 'Summer Music Fest', date: 'Sep 15, 2026', amount: 1240000, status: 'Ready' },
  { id: 'INV-2026-003', event: 'Food & Wine Expo', date: 'Aug 10, 2026', amount: 320000, status: 'Ready' },
];

const COLORS = ['hsl(217, 91%, 60%)', 'var(--status-success)', 'var(--status-warning)', 'hsl(258, 90%, 66%)'];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function RevenuePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices'>('overview');

  // Stats
  const totalRevenue = 1400000;
  const pendingPayout = 125000;
  const processedPayout = 1275000;
  const platformFees = 28000; // ~2%

  const handleDownloadInvoice = (id: string) => {
    alert(`Downloading invoice ${id}...`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 p-4 md:p-8">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Revenue Management</h1>
          <p className="text-gray-500">Track earnings, manage payouts, and download tax invoices.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant={activeTab === 'overview' ? 'primary' : 'outline'} 
            onClick={() => setActiveTab('overview')}
            className={activeTab === 'overview' ? "shadow-lg shadow-blue-500/20" : "bg-white"}
          >
            <AccountBalanceIcon fontSize="small" className="mr-2" /> Overview
          </Button>
          <Button 
            variant={activeTab === 'invoices' ? 'primary' : 'outline'} 
            onClick={() => setActiveTab('invoices')}
            className={activeTab === 'invoices' ? "shadow-lg shadow-blue-500/20" : "bg-white"}
          >
            <ReceiptIcon fontSize="small" className="mr-2" /> Invoices
          </Button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-8 animate-fadeIn">
          
          {/* ================= TOP STATS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 border-l-4 border-l-green-500">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h4 className="text-2xl font-bold text-gray-900 mt-1">₹{totalRevenue.toLocaleString()}</h4>
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <TrendingUpIcon style={{fontSize: 14}}/> +15% this month
              </p>
            </Card>

            <Card className="p-5 border-l-4 border-l-blue-500">
              <p className="text-sm font-medium text-gray-500">Processed Payouts</p>
              <h4 className="text-2xl font-bold text-gray-900 mt-1">₹{processedPayout.toLocaleString()}</h4>
              <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                <CheckCircleIcon style={{fontSize: 14}}/> Settled to bank
              </p>
            </Card>

            <Card className="p-5 border-l-4 border-l-orange-500">
              <p className="text-sm font-medium text-gray-500">Pending Payout</p>
              <h4 className="text-2xl font-bold text-orange-600 mt-1">₹{pendingPayout.toLocaleString()}</h4>
              <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                <PendingIcon style={{fontSize: 14}}/> Processing (2-3 days)
              </p>
            </Card>

            <Card className="p-5 border-l-4 border-l-purple-500">
              <p className="text-sm font-medium text-gray-500">Platform Fees</p>
              <h4 className="text-2xl font-bold text-gray-900 mt-1">₹{platformFees.toLocaleString()}</h4>
              <p className="text-xs text-purple-600 mt-2 flex items-center gap-1">
                <AttachMoneyIcon style={{fontSize: 14}}/> 2% Commission
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* ================= BREAKDOWN CHARTS ================= */}
            <Card className="p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-6">Revenue Breakdown</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* By Ticket Tier */}
                <div className="h-[250px]">
                  <p className="text-center text-xs font-bold text-gray-500 mb-2 uppercase">By Ticket Type</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={REVENUE_BY_TIER}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {REVENUE_BY_TIER.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{borderRadius: '8px'}} />
                      <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* By Payment Method */}
                <div className="h-[250px]">
                  <p className="text-center text-xs font-bold text-gray-500 mb-2 uppercase">By Payment Method</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={REVENUE_BY_METHOD} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="method" type="category" width={80} tick={{fontSize: 10}} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
                      <Bar dataKey="amount" fill="hsl(217, 91%, 60%)" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>

            {/* ================= TAX & COMMISSION ================= */}
            <div className="space-y-6">
              <Card className="p-6">
                 <h3 className="font-bold text-lg text-gray-900 mb-4">Financial Summary</h3>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                       <span className="text-sm text-gray-600">Gross Sales</span>
                       <span className="font-bold text-gray-900">₹1,400,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg text-red-700">
                       <span className="text-sm flex items-center gap-1">Platform Fee <span className="text-xs opacity-75">(2%)</span></span>
                       <span className="font-bold">- ₹28,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg text-red-700">
                       <span className="text-sm flex items-center gap-1">GST / Tax <span className="text-xs opacity-75">(18%)</span></span>
                       <span className="font-bold">- ₹252,000</span>
                    </div>
                    <div className="my-2 border-t border-gray-200"></div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                       <span className="text-sm font-bold text-green-800">Net Earnings</span>
                       <span className="text-xl font-bold text-green-700">₹1,120,000</span>
                    </div>
                 </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                 <h3 className="font-bold text-lg mb-2">Next Payout</h3>
                 <div className="flex justify-between items-end">
                    <div>
                       <p className="text-blue-100 text-sm mb-1">Estimated Date</p>
                       <p className="font-bold text-xl">Oct 30, 2026</p>
                    </div>
                    <div className="text-right">
                       <p className="text-blue-100 text-sm mb-1">Amount</p>
                       <p className="font-bold text-2xl">₹125,000</p>
                    </div>
                 </div>
              </Card>
            </div>
          </div>

          {/* ================= PAYOUT TABLE ================= */}
          <Card className="overflow-hidden border-gray-200 shadow-sm">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Payout History</h3>
                <Button variant="outline" size="sm" className="text-gray-600">Export CSV</Button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                         <th className="p-4">Payout ID</th>
                         <th className="p-4">Date Processed</th>
                         <th className="p-4">Method</th>
                         <th className="p-4">Amount</th>
                         <th className="p-4">Status</th>
                         <th className="p-4 text-right">Invoice</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {PAYOUTS.map((payout) => (
                         <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 text-sm font-mono text-gray-600">{payout.id}</td>
                            <td className="p-4 text-sm text-gray-900">{payout.date}</td>
                            <td className="p-4 text-sm text-gray-600">{payout.method}</td>
                            <td className="p-4 font-bold text-gray-900">₹{payout.amount.toLocaleString()}</td>
                            <td className="p-4">
                               <Badge variant={payout.status === 'Completed' ? 'success' : 'warning'}>
                                  {payout.status}
                               </Badge>
                            </td>
                            <td className="p-4 text-right">
                               <button className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50">
                                  <DownloadIcon fontSize="small" />
                               </button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </Card>
        </div>
      ) : (
        /* ================= INVOICE GENERATOR ================= */
        <div className="space-y-6 animate-fadeIn">
           <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="font-bold text-lg text-gray-900">Event Invoices</h3>
                    <p className="text-sm text-gray-500">Download consolidated financial reports per event.</p>
                 </div>
                 <div className="relative">
                    <input type="text" placeholder="Search events..." className="pl-4 pr-10 py-2 border rounded-lg text-sm" />
                 </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                 {EVENTS_INVOICES.map((inv) => (
                    <div key={inv.id} className="flex flex-col md:flex-row items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white">
                       <div className="flex items-center gap-4 mb-4 md:mb-0">
                          <div className="p-3 bg-gray-100 rounded-lg text-gray-500">
                             <DescriptionIcon />
                          </div>
                          <div>
                             <h4 className="font-bold text-gray-900">{inv.event}</h4>
                             <p className="text-xs text-gray-500">Generated: {inv.date} • ID: {inv.id}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                          <div className="text-right">
                             <p className="text-xs text-gray-500 uppercase font-bold">Total Processed</p>
                             <p className="font-bold text-gray-900">₹{inv.amount.toLocaleString()}</p>
                          </div>
                          <Badge variant="success" className="h-fit">Ready</Badge>
                          <Button size="sm" onClick={() => handleDownloadInvoice(inv.id)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                             <DownloadIcon fontSize="small" className="mr-2" /> Download
                          </Button>
                       </div>
                    </div>
                 ))}
              </div>
           </Card>
        </div>
      )}

    </div>
  );
}