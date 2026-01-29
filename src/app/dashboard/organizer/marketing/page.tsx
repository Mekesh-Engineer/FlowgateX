'use client';

import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

// Icons
import CampaignIcon from '@mui/icons-material/Campaign';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EmailIcon from '@mui/icons-material/Email';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';

// ==========================================
// MOCK DATA
// ==========================================

const PROMO_CODES = [
  { id: 1, code: 'EARLYBIRD25', type: 'Percentage', value: '25%', uses: 45, limit: 100, expiry: '2026-11-01', status: 'Active' },
  { id: 2, code: 'VIPACCESS', type: 'Fixed', value: '₹500', uses: 12, limit: 50, expiry: '2026-10-15', status: 'Active' },
  { id: 3, code: 'STUDENT10', type: 'Percentage', value: '10%', uses: 89, limit: 200, expiry: '2026-12-31', status: 'Active' },
  { id: 4, code: 'SUMMERFLASH', type: 'Percentage', value: '50%', uses: 100, limit: 100, expiry: '2026-08-01', status: 'Expired' },
];

const CAMPAIGNS = [
  { id: 1, name: 'Season Launch', subject: 'Tickets are live!', type: 'Email', sent: 2500, openRate: '45%', clickRate: '12%', status: 'Sent' },
  { id: 2, name: 'VIP Reminder', subject: 'Last chance for VIP', type: 'Email', sent: 400, openRate: '68%', clickRate: '25%', status: 'Sent' },
  { id: 3, name: 'Flash Sale Alert', subject: '24 Hours Only', type: 'SMS', sent: 1800, openRate: '92%', clickRate: '8%', status: 'Scheduled' },
];

const PERFORMANCE_DATA = [
  { name: 'EARLYBIRD25', redeemed: 45 },
  { name: 'VIPACCESS', redeemed: 12 },
  { name: 'STUDENT10', redeemed: 89 },
  { name: 'SUMMERFLASH', redeemed: 100 },
];

const CAMPAIGN_STATS = [
  { name: 'Opened', value: 3200 },
  { name: 'Clicked', value: 850 },
  { name: 'Converted', value: 320 },
];

const COLORS = ['hsl(217, 91%, 60%)', 'hsl(258, 90%, 66%)', 'var(--status-success)', 'var(--status-warning)'];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'promos' | 'campaigns'>('overview');
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 p-4 md:p-8">
      
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketing Hub</h1>
          <p className="text-gray-500">Manage promotions, email campaigns, and track performance.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="gap-2 shadow-lg shadow-blue-500/20" 
            onClick={() => setShowPromoModal(true)}
          >
            <LocalOfferIcon fontSize="small" /> Create Promo
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 bg-white"
            onClick={() => setShowCampaignModal(true)}
          >
            <EmailIcon fontSize="small" /> New Campaign
          </Button>
        </div>
      </div>

      {/* ================= NAVIGATION TABS ================= */}
      <div className="flex overflow-x-auto gap-1 mb-8 border-b border-gray-200">
        {[
          { id: 'overview', label: 'Overview', icon: BarChartIcon },
          { id: 'promos', label: 'Promo Codes', icon: LocalOfferIcon },
          { id: 'campaigns', label: 'Campaigns', icon: CampaignIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap",
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

      {/* ================= TAB CONTENT ================= */}
      
      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5 border-l-4 border-l-blue-500 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Redemptions</p>
                <h4 className="text-3xl font-bold text-gray-900 mt-1">246</h4>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUpIcon style={{fontSize: 14}}/> +12% this week
                </p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <LocalOfferIcon />
              </div>
            </Card>
            <Card className="p-5 border-l-4 border-l-purple-500 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">Campaign Reach</p>
                <h4 className="text-3xl font-bold text-gray-900 mt-1">4,700</h4>
                <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                  <EmailIcon style={{fontSize: 14}}/> Emails & SMS sent
                </p>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <PeopleIcon />
              </div>
            </Card>
            <Card className="p-5 border-l-4 border-l-green-500 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 font-medium">Discount Value</p>
                <h4 className="text-3xl font-bold text-gray-900 mt-1">₹45,200</h4>
                <p className="text-xs text-gray-400 mt-1">Total savings given</p>
              </div>
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <TrendingUpIcon />
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-6">Promo Code Usage</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PERFORMANCE_DATA} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
                    <Bar dataKey="redeemed" fill="hsl(217, 91%, 60%)" radius={[0, 4, 4, 0]} barSize={30}>
                      {PERFORMANCE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-6">Campaign Conversion Funnel</h3>
              <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CAMPAIGN_STATS}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {CAMPAIGN_STATS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '8px'}} />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* 2. PROMO CODES TAB */}
      {activeTab === 'promos' && (
        <div className="space-y-6 animate-fadeIn">
          <Card className="overflow-hidden border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                    <th className="p-4">Code Name</th>
                    <th className="p-4">Discount</th>
                    <th className="p-4">Usage</th>
                    <th className="p-4">Expiry</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {PROMO_CODES.map((promo) => (
                    <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded text-sm border border-blue-100">
                          {promo.code}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-gray-700">{promo.value}</td>
                      <td className="p-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{promo.uses}</span>
                          <span className="text-gray-400">/ {promo.limit}</span>
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500" 
                              style={{ width: `${(promo.uses / promo.limit) * 100}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{promo.expiry}</td>
                      <td className="p-4">
                        <Badge variant={promo.status === 'Active' ? 'success' : 'secondary'}>
                          {promo.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="text-gray-400 hover:text-blue-600 transition-colors p-1">
                            <EditIcon fontSize="small" />
                          </button>
                          <button className="text-gray-400 hover:text-red-600 transition-colors p-1">
                            <DeleteIcon fontSize="small" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* 3. CAMPAIGNS TAB */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 gap-4">
            {CAMPAIGNS.map((campaign) => (
              <Card key={campaign.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "p-3 rounded-xl shrink-0",
                      campaign.type === 'Email' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                    )}>
                      {campaign.type === 'Email' ? <EmailIcon /> : <CampaignIcon />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{campaign.name}</h4>
                      <p className="text-sm text-gray-500">Subject: &ldquo;{campaign.subject}&rdquo;</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">{campaign.type}</Badge>
                        <Badge variant={campaign.status === 'Sent' ? 'success' : 'warning'} className="text-xs">
                          {campaign.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 md:border-l md:border-gray-100 md:pl-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-400 uppercase font-bold">Sent</p>
                      <p className="font-bold text-gray-900 text-lg">{campaign.sent}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 uppercase font-bold">Open Rate</p>
                      <p className="font-bold text-green-600 text-lg">{campaign.openRate}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 uppercase font-bold">Clicks</p>
                      <p className="font-bold text-blue-600 text-lg">{campaign.clickRate}</p>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2">
                    <Button variant="secondary" size="sm">Duplicate</Button>
                    <Button variant="outline" size="sm">Report</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}
      
      {/* Create Promo Modal */}
      <Modal isOpen={showPromoModal} onClose={() => setShowPromoModal(false)} title="Create Promo Code">
        <div className="space-y-4">
          <div>
            <label className="label">Code Name</label>
            <input type="text" className="input uppercase font-mono" placeholder="SUMMER2026" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Discount Type</label>
              <select className="input">
                <option>Percentage (%)</option>
                <option>Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="label">Value</label>
              <input type="number" className="input" placeholder="20" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Usage Limit</label>
              <input type="number" className="input" placeholder="100" />
            </div>
            <div>
              <label className="label">Expiry Date</label>
              <input type="date" className="input" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowPromoModal(false)}>Cancel</Button>
            <Button variant="primary">Create Code</Button>
          </div>
        </div>
      </Modal>

      {/* Create Campaign Modal */}
      <Modal isOpen={showCampaignModal} onClose={() => setShowCampaignModal(false)} title="New Campaign">
        <div className="space-y-4">
          <div>
            <label className="label">Campaign Name</label>
            <input type="text" className="input" placeholder="e.g. VIP Early Access" />
          </div>
          <div>
            <label className="label">Channel</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="channel" className="text-blue-600" defaultChecked /> Email
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="channel" className="text-blue-600" /> SMS
              </label>
            </div>
          </div>
          <div>
            <label className="label">Target Audience</label>
            <select className="input">
              <option>All Attendees</option>
              <option>VIP Ticket Holders</option>
              <option>Past Event Attendees</option>
            </select>
          </div>
          <div>
            <label className="label">Message Content</label>
            <textarea className="input min-h-[120px]" placeholder="Write your message here..." />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowCampaignModal(false)}>Save Draft</Button>
            <Button variant="primary" className="gap-2">
              <SendIcon fontSize="small" /> Schedule / Send
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}