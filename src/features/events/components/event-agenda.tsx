'use client';

import { AgendaItem } from '@/features/events/event.types';

export function EventAgenda({ agenda }: { agenda?: AgendaItem[] }) {
  if (!agenda || agenda.length === 0) {
    return (
      <div className="bg-[var(--bg-card)] rounded-xl p-8 border border-[var(--border-primary)] text-center">
        <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-icons-outlined text-2xl text-[var(--text-tertiary)]">schedule</span>
        </div>
        <p className="text-[var(--text-secondary)]">Event agenda will be announced soon.</p>
        <p className="text-sm text-[var(--text-tertiary)] mt-2">Check back later for the detailed schedule.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-primary)]">
      <div className="relative border-l-2 border-[var(--border-primary)] ml-3 space-y-8 pl-8 py-2">
        {agenda.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <span className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-[var(--bg-card)] bg-[var(--brand-primary)] group-hover:scale-110 transition-transform" />
            
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
               <span className="font-mono font-bold text-[var(--brand-primary)] text-sm bg-[var(--brand-primary)]/5 px-2 py-1 rounded inline-block w-fit">
                 {item.time}
               </span>
               <h3 className="font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                 {item.title}
               </h3>
            </div>
            
            {item.description && (
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {item.description}
              </p>
            )}
            
            {item.speaker && (
              <div className="flex items-center gap-2 mt-2">
                <span className="material-icons-outlined text-sm text-[var(--text-tertiary)]">person</span>
                <span className="text-sm text-[var(--text-tertiary)] italic">Speaker: {item.speaker}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}