'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

// Icons
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import GroupIcon from '@mui/icons-material/Group';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// ==========================================
// MOCK DATA
// ==========================================

const TEAM_MEMBERS = [
  { id: 1, name: 'John Doe', email: 'john@techevents.in', role: 'Owner', status: 'Active' },
  { id: 2, name: 'Sarah Smith', email: 'sarah@techevents.in', role: 'Admin', status: 'Active' },
  { id: 3, name: 'Mike Wilson', email: 'mike@techevents.in', role: 'Editor', status: 'Pending' },
];

const PLAN_FEATURES = [
  { feature: 'Events', limit: 'Unlimited' },
  { feature: 'Team Members', limit: 'Up to 5' },
  { feature: 'Commission', limit: '2% per ticket' },
  { feature: 'Support', limit: 'Priority Email' },
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function OrganizerProfilePage() {
  const [activeTab, setActiveTab] = useState<'details' | 'payout' | 'team' | 'billing'>('details');
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Form States (Mock)
  const [orgDetails, setOrgDetails] = useState({
    name: 'TechEvents India',
    email: 'contact@techevents.in',
    phone: '+91 98765 43210',
    address: '123 MG Road, Mumbai, Maharashtra 400001',
    gst: '27AABCT1234A1Z5'
  });

  const [bankDetails, setBankDetails] = useState({
    holder: 'TechEvents India Pvt Ltd',
    account: '123456789012',
    ifsc: 'HDFC0001234',
    bank: 'HDFC Bank',
    branch: 'Mumbai Main'
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20 p-4 md:p-8">
      
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Organization Settings</h1>
        <p className="text-gray-500">Manage your profile, team access, and financial details.</p>
      </div>

      {/* ================= NAVIGATION TABS ================= */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
        {[
          { id: 'details', label: 'Organization Info', icon: BusinessIcon },
          { id: 'payout', label: 'Payout Settings', icon: AccountBalanceIcon },
          { id: 'team', label: 'Team Members', icon: GroupIcon },
          { id: 'billing', label: 'Subscription', icon: WorkspacePremiumIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-all text-sm whitespace-nowrap",
              activeTab === tab.id 
                ? "border-blue-600 text-blue-600 bg-blue-50/50" 
                : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
            )}
          >
            <tab.icon fontSize="small" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= CONTENT TABS ================= */}

      {/* 1. ORGANIZATION DETAILS */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
          {/* Main Info Form */}
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BusinessIcon className="text-blue-600" /> General Information
            </h3>
            
            <div className="space-y-5">
              <div className="flex gap-6 items-start">
                 <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all shrink-0 group">
                    <CloudUploadIcon className="text-gray-400 group-hover:text-blue-500" />
                 </div>
                 <div className="flex-1">
                    <label className="label">Organization Name</label>
                    <input 
                      type="text" 
                      className="input font-semibold" 
                      value={orgDetails.name} 
                      onChange={(e) => setOrgDetails({...orgDetails, name: e.target.value})} 
                    />
                    <p className="text-xs text-gray-500 mt-2">This name will appear on your public event pages.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="label">Contact Email</label>
                  <input type="email" className="input" value={orgDetails.email} readOnly />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input type="tel" className="input" value={orgDetails.phone} onChange={(e) => setOrgDetails({...orgDetails, phone: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="label">Business Address</label>
                <textarea className="input min-h-[80px]" value={orgDetails.address} onChange={(e) => setOrgDetails({...orgDetails, address: e.target.value})} />
              </div>

              <div className="pt-4 flex justify-end">
                <Button className="shadow-md shadow-blue-500/20">Save Changes</Button>
              </div>
            </div>
          </Card>

          {/* Verification Status */}
          <div className="space-y-6">
            <Card className="p-6 border-l-4 border-l-green-500">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <VerifiedUserIcon className="text-green-600" /> Verification
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon fontSize="small" className="text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900 text-sm">Email Verified</p>
                      <p className="text-xs text-green-700">{orgDetails.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon fontSize="small" className="text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900 text-sm">GST Verified</p>
                      <p className="text-xs text-green-700">{orgDetails.gst}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                   <p className="text-sm text-gray-600 mb-3">Identity verification is active.</p>
                   <Badge variant="success">Level 2 Verified</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* 2. PAYOUT SETTINGS */}
      {activeTab === 'payout' && (
        <div className="max-w-4xl mx-auto animate-fadeIn">
          <Card className="p-8">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
               <div>
                 <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                   <AccountBalanceIcon className="text-blue-600" /> Bank Details
                 </h3>
                 <p className="text-gray-500 text-sm mt-1">Payouts are processed automatically every Wednesday.</p>
               </div>
               <Badge variant="success" className="px-3 py-1">Active for Payouts</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               <div>
                  <label className="label">Account Holder Name</label>
                  <input type="text" className="input" value={bankDetails.holder} onChange={(e) => setBankDetails({...bankDetails, holder: e.target.value})} />
               </div>
               <div>
                  <label className="label">Account Number</label>
                  <input type="text" className="input font-mono" value={bankDetails.account} onChange={(e) => setBankDetails({...bankDetails, account: e.target.value})} />
               </div>
               <div>
                  <label className="label">Bank Name</label>
                  <input type="text" className="input" value={bankDetails.bank} onChange={(e) => setBankDetails({...bankDetails, bank: e.target.value})} />
               </div>
               <div>
                  <label className="label">IFSC Code</label>
                  <input type="text" className="input font-mono uppercase" value={bankDetails.ifsc} onChange={(e) => setBankDetails({...bankDetails, ifsc: e.target.value})} />
               </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 text-sm text-blue-800">
               <div className="mt-0.5"><VerifiedUserIcon fontSize="small" /></div>
               <div>
                  <p className="font-bold">Secure Data Handling</p>
                  <p className="opacity-80">Your banking details are encrypted and stored securely. Changes may require OTP verification.</p>
               </div>
            </div>

            <div className="mt-8 flex justify-end">
               <Button className="w-full md:w-auto">Update Bank Details</Button>
            </div>
          </Card>
        </div>
      )}

      {/* 3. TEAM MANAGEMENT */}
      {activeTab === 'team' && (
        <div className="max-w-5xl mx-auto animate-fadeIn space-y-6">
           <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-xl font-bold text-gray-900">Team Members</h3>
                    <p className="text-gray-500 text-sm">Manage access and roles for your organization.</p>
                 </div>
                 <Button onClick={() => setShowInviteModal(true)} className="gap-2">
                    <AddIcon fontSize="small" /> Invite Member
                 </Button>
              </div>

              <div className="overflow-hidden border rounded-lg border-gray-200">
                 <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                       <tr>
                          <th className="p-4">Name / Email</th>
                          <th className="p-4">Role</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                       {TEAM_MEMBERS.map((member) => (
                          <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                             <td className="p-4">
                                <p className="font-bold text-gray-900">{member.name}</p>
                                <p className="text-xs text-gray-500">{member.email}</p>
                             </td>
                             <td className="p-4">
                                <span className={cn(
                                   "px-2 py-1 rounded text-xs font-bold border",
                                   member.role === 'Owner' ? "bg-purple-50 text-purple-700 border-purple-200" :
                                   member.role === 'Admin' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                   "bg-gray-100 text-gray-700 border-gray-200"
                                )}>
                                   {member.role}
                                </span>
                             </td>
                             <td className="p-4">
                                <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>
                                   {member.status}
                                </Badge>
                             </td>
                             <td className="p-4 text-right">
                                {member.role !== 'Owner' && (
                                   <div className="flex justify-end gap-2">
                                      <button className="text-gray-400 hover:text-blue-600 transition-colors p-1"><EditIcon fontSize="small" /></button>
                                      <button className="text-gray-400 hover:text-red-600 transition-colors p-1"><DeleteIcon fontSize="small" /></button>
                                   </div>
                                )}
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </Card>
        </div>
      )}

      {/* 4. SUBSCRIPTION / BILLING */}
      {activeTab === 'billing' && (
        <div className="max-w-4xl mx-auto animate-fadeIn">
           <Card className="p-0 overflow-hidden border border-purple-200 shadow-lg shadow-purple-500/10">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
                 <div className="flex justify-between items-start">
                    <div>
                       <p className="text-purple-200 font-medium mb-1">Current Plan</p>
                       <h2 className="text-3xl font-bold flex items-center gap-2">
                          Pro Plan <Badge variant="secondary" className="bg-white/20 text-white border-none">Active</Badge>
                       </h2>
                       <p className="text-sm text-purple-100 mt-2">Renewing on Nov 12, 2026</p>
                    </div>
                    <div className="text-right">
                       <p className="text-4xl font-bold">₹2,999</p>
                       <p className="text-xs text-purple-200">/ month</p>
                    </div>
                 </div>
              </div>
              
              <div className="p-8">
                 <h3 className="font-bold text-gray-900 mb-4">Plan Features</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {PLAN_FEATURES.map((feat, i) => (
                       <div key={i} className="flex justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <span className="text-gray-600 text-sm">{feat.feature}</span>
                          <span className="font-bold text-gray-900 text-sm">{feat.limit}</span>
                       </div>
                    ))}
                 </div>
                 
                 <div className="flex gap-4">
                    <Button variant="outline" className="flex-1">View Invoices</Button>
                    <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">Upgrade Plan</Button>
                 </div>
              </div>
           </Card>
        </div>
      )}

      {/* ================= MODALS ================= */}
      
      {/* Invite Member Modal */}
      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite Team Member">
         <div className="space-y-4">
            <div>
               <label className="label">Email Address</label>
               <div className="relative">
                  <EmailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
                  <input type="email" className="input pl-10" placeholder="colleague@company.com" />
               </div>
            </div>
            <div>
               <label className="label">Role</label>
               <select className="input">
                  <option value="Admin">Admin (Full Access)</option>
                  <option value="Editor">Editor (Manage Events)</option>
                  <option value="Viewer">Viewer (Read Only)</option>
               </select>
            </div>
            <div className="pt-2 flex justify-end gap-2">
               <Button variant="outline" onClick={() => setShowInviteModal(false)}>Cancel</Button>
               <Button>Send Invite</Button>
            </div>
         </div>
      </Modal>

    </div>
  );
}