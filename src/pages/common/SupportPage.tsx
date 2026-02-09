import { useState } from 'react';
import { 
  Search, 
  History, 
  Lock, 
  QrCode, 
  Terminal, 
  Rocket, 
  Ticket, 
  CreditCard, 
  ShieldCheck, 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  UploadCloud, 
  ChevronDown, 
  ChevronUp,
  FileText,
  CheckCircle2,
  Clock
} from 'lucide-react';

import { cn } from '@/lib/utils';
import Input from '@/components/forms/Input';
import Button from '@/components/common/Button';
import { Card, CardContent } from '@/components/common/Card';

// =============================================================================
// MOCK DATA
// =============================================================================

const CATEGORIES = [
  { id: 'getting-started', icon: Rocket, title: 'Getting Started', desc: 'Account setup & basics' },
  { id: 'booking', icon: Ticket, title: 'Booking & Tickets', desc: 'Reservations & transfers' },
  { id: 'payments', icon: CreditCard, title: 'Payments', desc: 'Billing, invoices & refunds' },
  { id: 'security', icon: ShieldCheck, title: 'Privacy & Security', desc: 'Passwords & 2FA' },
  { id: 'api', icon: Terminal, title: 'Developer API', desc: 'Docs, keys & webhooks' },
];

const FAQS = [
  {
    id: 1,
    question: 'How do I process a refund for a cancelled event?',
    answer: 'Refunds can be processed directly from your Dashboard under the "Transactions" tab. Select the transaction ID, click "Issue Refund," and choose whether it\'s a full or partial refund. Funds typically return to the customer within 5-10 business days.'
  },
  {
    id: 2,
    question: 'Where can I find my API keys?',
    answer: 'Navigate to Settings > Developer > API Keys. You can generate new keys there. Remember to store your secret key securely as it will only be shown once.'
  },
  {
    id: 3,
    question: 'Can I transfer a ticket to another user?',
    answer: 'Yes! Go to "My Tickets", select the ticket you wish to transfer, and click "Transfer Ticket". Enter the recipient\'s email address. They will receive a link to claim the ticket.'
  },
  {
    id: 4,
    question: 'Why is my account locked?',
    answer: 'Accounts are temporarily locked after 5 failed login attempts. Please wait 15 minutes and try again, or use the "Forgot Password" link to reset your credentials.'
  }
];

const TICKET_HISTORY = [
  { id: '#4829', subject: 'API Rate Limiting Issue', date: 'Oct 24, 2023', status: 'Pending' },
  { id: '#4810', subject: 'Refund Request - Event #99', date: 'Oct 20, 2023', status: 'Closed' },
  { id: '#4782', subject: 'Login 2FA Reset', date: 'Oct 15, 2023', status: 'Closed' },
  { id: '#4755', subject: 'Dashboard Loading Error', date: 'Oct 12, 2023', status: 'Closed' },
];

// =============================================================================
// COMPONENT
// =============================================================================

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [tickets, setTickets] = useState(TICKET_HISTORY);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [ticketForm, setTicketForm] = useState({ subject: '', message: '' });

  const toggleFaq = (id: number) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newTicket = {
      id: `#${Math.floor(Math.random() * 9000) + 1000}`,
      subject: ticketForm.subject,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending'
    };

    setTickets([newTicket, ...tickets]);
    setTicketForm({ subject: '', message: '' });
    setIsSubmitting(false);
  };

  const filteredFaqs = FAQS.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 font-sans">
      
      {/* ─── Hero Section ─── */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-950 to-neutral-900 pt-16 pb-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            FlowGate<span className="text-primary-400">X</span> Support Center
          </h1>
          <p className="text-lg text-primary-100/80">
            How can we help you today?
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl opacity-30 group-hover:opacity-100 transition duration-200 blur"></div>
            <div className="relative flex items-center bg-white dark:bg-neutral-800 rounded-xl shadow-xl">
              <div className="pl-4 text-gray-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                className="w-full bg-transparent border-none py-4 px-4 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-0 text-base"
                placeholder="Search for answers (e.g. refunds, api keys)..."
                value={searchQuery}
                onChange={handleSearch}
              />
              <div className="pr-2">
                <Button size="sm" className="hidden sm:flex">Search</Button>
              </div>
            </div>
          </div>

          {/* Quick Chips */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {[
              { label: 'Refunds', icon: History },
              { label: 'Login Issues', icon: Lock },
              { label: 'QR Tickets', icon: QrCode },
              { label: 'API Access', icon: Terminal },
            ].map((chip) => (
              <button
                key={chip.label}
                onClick={() => setSearchQuery(chip.label.split(' ')[0])}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary-400/50 transition-all text-sm text-gray-300 hover:text-white backdrop-blur-sm"
              >
                <chip.icon size={16} className="text-primary-400" />
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-20">
        
        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {CATEGORIES.map((cat) => (
            <Card 
              key={cat.id} 
              hover 
              className="bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-center h-full group"
            >
              <CardContent className="p-6 flex flex-col items-center h-full">
                <div className="p-3 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <cat.icon size={28} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{cat.title}</h3>
                <p className="text-xs text-gray-500 dark:text-neutral-400">{cat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: FAQ & Tickets */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* FAQ Section */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <HelpCircle className="text-primary-500" />
                Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq) => (
                    <div 
                      key={faq.id}
                      className={cn(
                        "bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden transition-all duration-300",
                        activeFaq === faq.id && "border-primary-500 dark:border-primary-500 ring-1 ring-primary-500/20"
                      )}
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full flex justify-between items-center p-5 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors"
                      >
                        {faq.question}
                        {activeFaq === faq.id ? (
                          <ChevronUp className="text-primary-500" size={20} />
                        ) : (
                          <ChevronDown className="text-gray-400" size={20} />
                        )}
                      </button>
                      <div 
                        className={cn(
                          "px-5 text-gray-600 dark:text-neutral-400 leading-relaxed overflow-hidden transition-all duration-300 ease-in-out",
                          activeFaq === faq.id ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"
                        )}
                      >
                        {faq.answer}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-neutral-500">
                    No answers found for "{searchQuery}"
                  </div>
                )}
              </div>
            </section>

            {/* Ticket Form & History Split */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              {/* Submit Ticket Form */}
              <Card className="bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 shadow-sm h-fit">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Mail className="text-primary-500" size={20} />
                    Email Support
                  </h3>
                  <form onSubmit={handleTicketSubmit} className="space-y-4">
                    <Input
                      label="Subject"
                      placeholder="Briefly describe the issue"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      required
                      className="bg-gray-50 dark:bg-neutral-900"
                    />
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Message</label>
                      <textarea
                        className="w-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all h-32 resize-none placeholder-gray-400 dark:placeholder-neutral-500"
                        placeholder="Provide details about what happened..."
                        value={ticketForm.message}
                        onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                        required
                      />
                    </div>
                    
                    {/* File Upload Mock */}
                    <div className="border-2 border-dashed border-gray-300 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-gray-50 dark:bg-neutral-900/50">
                      <UploadCloud className="mx-auto text-gray-400 mb-2" size={24} />
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        Drag & drop files or <span className="text-primary-600 dark:text-primary-400 hover:underline">browse</span>
                      </p>
                    </div>

                    <Button type="submit" className="w-full" isLoading={isSubmitting}>
                      Submit Ticket
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Recent Tickets Table */}
              <div className="flex flex-col h-full">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <History className="text-primary-500" size={20} />
                  Ticket History
                </h3>
                <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden flex-1">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700">
                        <tr>
                          <th className="px-6 py-3 font-semibold text-gray-700 dark:text-neutral-300">ID</th>
                          <th className="px-6 py-3 font-semibold text-gray-700 dark:text-neutral-300">Subject</th>
                          <th className="px-6 py-3 font-semibold text-gray-700 dark:text-neutral-300">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                        {tickets.map((ticket) => (
                          <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-neutral-400">{ticket.id}</td>
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900 dark:text-white">{ticket.subject}</div>
                              <div className="text-xs text-gray-500 dark:text-neutral-500 mt-0.5">{ticket.date}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={cn(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                ticket.status === 'Pending' 
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800"
                                  : "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                              )}>
                                {ticket.status === 'Pending' ? <Clock size={12} className="mr-1"/> : <CheckCircle2 size={12} className="mr-1"/>}
                                {ticket.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-6 py-3 border-t border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 text-center">
                    <button className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                      View All Tickets
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Contact Support Panel */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Live Chat */}
            <Card hover className="bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-900 dark:text-white">Live Chat</h4>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6">
                  Our support team is online and ready to help you instantly.
                </p>
                <Button className="w-full flex items-center justify-center gap-2">
                  <MessageCircle size={18} /> Start Chat
                </Button>
              </CardContent>
            </Card>

            {/* Phone Support */}
            <Card hover className="bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary-50 dark:bg-primary-900/20 p-2.5 rounded-lg text-primary-600 dark:text-primary-400">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Phone Support</h4>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">Mon-Fri, 9am - 5pm EST</p>
                  </div>
                </div>
                <a 
                  href="tel:+18001234567" 
                  className="block text-xl font-mono font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-center bg-gray-50 dark:bg-neutral-900 py-3 rounded-xl border border-gray-100 dark:border-neutral-700"
                >
                  +1 (800) 123-4567
                </a>
              </CardContent>
            </Card>

            {/* Documentation Link */}
            <Card hover className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white border-none">
              <CardContent className="p-6 text-center">
                <FileText className="mx-auto mb-3 opacity-90" size={32} />
                <h4 className="font-bold mb-2">Read Documentation</h4>
                <p className="text-sm text-white/80 mb-4">Detailed guides and API references.</p>
                <Button variant="secondary" size="sm" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Visit Docs
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 py-10 px-4 text-center">
        <p className="text-gray-500 dark:text-neutral-400 text-sm">© 2026 FlowGateX Inc. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="#" className="text-gray-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">Privacy Policy</a>
          <a href="#" className="text-gray-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">Terms of Service</a>
          <a href="#" className="text-gray-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">Status Page</a>
        </div>
      </footer>
    </div>
  );
}