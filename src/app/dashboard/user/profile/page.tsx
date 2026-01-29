'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type ProfileTab = 'personal' | 'security' | 'payment' | 'notifications' | 'privacy' | 'activity';

export default function UserProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('personal');
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : (user?.firstName || ''));
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.mobile || '');

  const tabs = [
    { key: 'personal' as ProfileTab, label: 'Personal Info', icon: 'person' },
    { key: 'security' as ProfileTab, label: 'Security', icon: 'security' },
    { key: 'payment' as ProfileTab, label: 'Payment Methods', icon: 'payment' },
    { key: 'notifications' as ProfileTab, label: 'Notifications', icon: 'notifications' },
    { key: 'privacy' as ProfileTab, label: 'Privacy', icon: 'lock' },
    { key: 'activity' as ProfileTab, label: 'Activity Log', icon: 'history' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <div className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                      activeTab === tab.key
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <span className="material-icons-outlined">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'personal' && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                  <Button onClick={() => setEditing(!editing)}>
                    {editing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </div>

                <div className="mb-6 text-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mx-auto">
                    {name.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} disabled={!editing} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!editing} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!editing} placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <Input type="date" disabled={!editing} />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Password & Security</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <Input type="password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <Input type="password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <Input type="password" />
                  </div>
                  <Button>Update Password</Button>
                </div>
              </Card>
            )}

            {activeTab === 'payment' && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
                  <Button>Add New Card</Button>
                </div>
                <p className="text-gray-600">Saved payment methods will appear here</p>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {['Email Notifications', 'SMS Notifications', 'Push Notifications'].map((item) => (
                    <label key={item} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="text-gray-900">{item}</span>
                      <input type="checkbox" className="w-5 h-5 text-blue-600" />
                    </label>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'privacy' && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <span className="text-gray-900">Profile Visibility</span>
                    <input type="checkbox" className="w-5 h-5 text-blue-600" />
                  </label>
                  <Button variant="outline">Download My Data</Button>
                </div>
              </Card>
            )}

            {activeTab === 'activity' && (
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {['Login from Chrome', 'Booking Created', 'Password Changed'].map((activity, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                      <p className="font-semibold text-gray-900">{activity}</p>
                      <p className="text-sm text-gray-500 mt-1">{idx + 1} days ago</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
