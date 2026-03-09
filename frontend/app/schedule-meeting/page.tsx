'use client';

import React, { useState, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { apiService } from '../../services/api';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Bell,
  X,
  CheckCircle2,
  CalendarPlus,
  Loader2,
} from 'lucide-react';

// =============================================================================
// Schedule Meeting Page
// =============================================================================

export default function ScheduleMeetingPage() {
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [participantInput, setParticipantInput] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [reminder10m, setReminder10m] = useState(true);
  const [reminderAtTime, setReminderAtTime] = useState(false);
  const [addToCalendar, setAddToCalendar] = useState(false);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdMeetingId, setCreatedMeetingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // =========================================================================
  // Participant Tag Management
  // =========================================================================

  const addParticipant = () => {
    const name = participantInput.trim();
    if (name && !participants.includes(name)) {
      setParticipants([...participants, name]);
      setParticipantInput('');
    }
  };

  const removeParticipant = (name: string) => {
    setParticipants(participants.filter((p) => p !== name));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addParticipant();
    }
  };

  // =========================================================================
  // Submit
  // =========================================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      // Build the start_time ISO string
      let startTime: string | undefined;
      if (date && time) {
        startTime = new Date(`${date}T${time}`).toISOString();
      } else if (date) {
        startTime = new Date(`${date}T09:00`).toISOString();
      }

      const result = await apiService.createMeeting({
        title: title.trim(),
        description: notes.trim() || undefined,
        start_time: startTime,
        duration_minutes: duration,
        reminder_10m: reminder10m,
        reminder_at_time: reminderAtTime,
        schedule_status: 'upcoming',
        participant_names: participants,
      });

      setCreatedMeetingId(String(result.id));
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to schedule meeting.');
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================================
  // Custom Toggle Component
  // =========================================================================

  const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
    <label className="flex items-center justify-between cursor-pointer group py-2">
      <span className="text-[14px] text-neutral-700 font-medium group-hover:text-[#1F2937] transition-colors">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-all duration-200 ${checked ? 'bg-[#6C63FF]' : 'bg-neutral-200'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </label>
  );

  // =========================================================================
  // Success State
  // =========================================================================

  if (success) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-emerald-500" />
              </div>
              <h2 className="text-[20px] font-bold text-[#1F2937] mb-2">Meeting scheduled successfully</h2>
              <p className="text-[14px] text-neutral-500 mb-8">
                You will be reminded when it's time to start recording.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {createdMeetingId && (
                  <button
                    onClick={() => router.push(`/upcoming-meetings`)}
                    className="flex items-center gap-2 px-5 h-10 bg-[#6C63FF] text-white rounded-xl text-[13px] font-bold shadow-lg shadow-[#6C63FF]/20 hover:bg-[#5B54E0] transition-all active:scale-95"
                  >
                    View Meetings
                  </button>
                )}
                <button
                  onClick={() => {
                    setSuccess(false);
                    setTitle('');
                    setNotes('');
                    setDate('');
                    setTime('');
                    setDuration(30);
                    setParticipants([]);
                    setReminder10m(true);
                    setReminderAtTime(false);
                    setAddToCalendar(false);
                    setCreatedMeetingId(null);
                  }}
                  className="flex items-center gap-2 px-5 h-10 bg-white border border-[#E5E7EB] text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-[#F7F8FB] transition-all"
                >
                  <CalendarPlus size={16} />
                  Schedule Another
                </button>
              </div>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  // =========================================================================
  // Form
  // =========================================================================

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-[680px] mx-auto">
          {/* Back + Title */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-[#F7F8FB] rounded-lg text-neutral-400 transition-colors border border-[#E5E7EB]"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-[20px] font-bold text-[#0A1B3D]">Schedule a Meeting</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Basic Information */}
            <section className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-[#6C63FF]/10 flex items-center justify-center">
                  <Calendar size={14} className="text-[#6C63FF]" />
                </div>
                <h2 className="text-[15px] font-bold text-[#1F2937]">Basic Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                    Meeting Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Weekly Product Sync"
                    required
                    className="w-full h-11 px-4 bg-[#F7F8FB] border border-[#E5E7EB] rounded-xl text-[14px] outline-none focus:border-[#6C63FF]/30 focus:ring-4 focus:ring-[#6C63FF]/5 transition-all text-[#1F2937] placeholder:text-neutral-400"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Agenda, topics, or any pre-meeting context…"
                    rows={3}
                    className="w-full px-4 py-3 bg-[#F7F8FB] border border-[#E5E7EB] rounded-xl text-[14px] outline-none focus:border-[#6C63FF]/30 focus:ring-4 focus:ring-[#6C63FF]/5 transition-all text-[#1F2937] placeholder:text-neutral-400 resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Timing */}
            <section className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-[#6C63FF]/10 flex items-center justify-center">
                  <Clock size={14} className="text-[#6C63FF]" />
                </div>
                <h2 className="text-[15px] font-bold text-[#1F2937]">Timing</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-11 px-4 bg-[#F7F8FB] border border-[#E5E7EB] rounded-xl text-[14px] outline-none focus:border-[#6C63FF]/30 focus:ring-4 focus:ring-[#6C63FF]/5 transition-all text-[#1F2937]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Start Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full h-11 px-4 bg-[#F7F8FB] border border-[#E5E7EB] rounded-xl text-[14px] outline-none focus:border-[#6C63FF]/30 focus:ring-4 focus:ring-[#6C63FF]/5 transition-all text-[#1F2937]"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-[12px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Duration</label>
                <div className="flex flex-wrap gap-2">
                  {[15, 30, 60, 90].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`px-4 h-9 rounded-xl text-[13px] font-bold border transition-all ${
                        duration === d
                          ? 'bg-[#6C63FF] text-white border-[#6C63FF] shadow-lg shadow-[#6C63FF]/20'
                          : 'bg-white text-neutral-600 border-[#E5E7EB] hover:border-[#6C63FF]/30'
                      }`}
                    >
                      {d < 60 ? `${d} min` : `${d / 60} hr`}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-neutral-400 mt-3">
                Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </p>
            </section>

            {/* Section 3: Participants */}
            <section className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-[#6C63FF]/10 flex items-center justify-center">
                  <Users size={14} className="text-[#6C63FF]" />
                </div>
                <h2 className="text-[15px] font-bold text-[#1F2937]">Participants</h2>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={participantInput}
                  onChange={(e) => setParticipantInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add participant name and press Enter"
                  className="w-full h-11 px-4 bg-[#F7F8FB] border border-[#E5E7EB] rounded-xl text-[14px] outline-none focus:border-[#6C63FF]/30 focus:ring-4 focus:ring-[#6C63FF]/5 transition-all text-[#1F2937] placeholder:text-neutral-400"
                />
              </div>

              {participants.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {participants.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#6C63FF]/10 text-[#6C63FF] rounded-full text-[13px] font-medium"
                    >
                      {name}
                      <button type="button" onClick={() => removeParticipant(name)} className="hover:text-red-500 transition-colors">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <p className="text-[11px] text-neutral-400 mt-3">
                Participants help Eden assign tasks more accurately.
              </p>
            </section>

            {/* Section 4: Calendar Integration */}
            <section className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-[#6C63FF]/10 flex items-center justify-center">
                  <Calendar size={14} className="text-[#6C63FF]" />
                </div>
                <h2 className="text-[15px] font-bold text-[#1F2937]">Calendar Integration</h2>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F7F8FB] border border-[#E5E7EB] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#4285F4"/>
                      <path d="M12 11V7H16.5C17.3 8.1 17.8 9.5 17.9 11H12Z" fill="#EA4335"/>
                      <path d="M12 11V15H7.5C6.7 13.9 6.2 12.5 6.1 11H12Z" fill="#34A853"/>
                      <path d="M12 15V19C9.5 19 7.3 17.8 6 16L12 15Z" fill="#FBBC04"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#1F2937]">Google Calendar</p>
                    <p className="text-[11px] text-neutral-400">Add this meeting to your calendar</p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={addToCalendar}
                  onClick={() => setAddToCalendar(!addToCalendar)}
                  className={`relative w-11 h-6 rounded-full transition-all duration-200 ${addToCalendar ? 'bg-[#6C63FF]' : 'bg-neutral-200'}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${addToCalendar ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>

              {!addToCalendar && (
                <p className="text-[11px] text-neutral-400 mt-3">
                  Calendar sync is optional. You can always start recording manually.
                </p>
              )}
            </section>

            {/* Section 5: Reminders */}
            <section className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-[#6C63FF]/10 flex items-center justify-center">
                  <Bell size={14} className="text-[#6C63FF]" />
                </div>
                <h2 className="text-[15px] font-bold text-[#1F2937]">Reminders</h2>
              </div>

              <div className="space-y-1 divide-y divide-[#E5E7EB]">
                <Toggle checked={reminder10m} onChange={setReminder10m} label="Remind me 10 minutes before" />
                <Toggle checked={reminderAtTime} onChange={setReminderAtTime} label="Remind me at meeting time" />
              </div>
            </section>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-700">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pb-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 h-10 bg-white border border-[#E5E7EB] text-neutral-700 rounded-xl text-[13px] font-bold hover:bg-[#F7F8FB] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !title.trim()}
                className="flex items-center gap-2 px-6 h-10 bg-[#6C63FF] text-white rounded-xl text-[13px] font-bold shadow-lg shadow-[#6C63FF]/20 hover:bg-[#5B54E0] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Scheduling…
                  </>
                ) : (
                  'Schedule Meeting'
                )}
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
