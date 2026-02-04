import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StatsData {
  onlineNow: number;
}

export const StatsPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<StatsData>({
    onlineNow: 0
  });
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Setup presence channel once on mount (not when panel opens)
  useEffect(() => {
    // Generate unique session ID
    let sessionId = localStorage.getItem('game_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('game_session_id', sessionId);
    }

    // Setup presence channel for real-time online count
    const channel = supabase.channel('online_players', {
      config: {
        presence: { key: sessionId }
      }
    });
    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const onlineCount = Object.keys(state).length;
        setStats({ onlineNow: onlineCount });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="pixel-modal">
      <div className="modal-box bg-gradient-to-b from-blue-50 to-blue-100 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-blue-900">📊 סטטיסטיקות</h2>
          <button onClick={onClose} className="pixel-btn pixel-btn-red w-8 h-8 text-sm p-0">✕</button>
        </div>

        {/* Online Now Card */}
        <div className="bg-white border-4 border-green-500 p-4 text-center shadow-md">
          <div className="text-4xl font-black text-green-600">{stats.onlineNow}</div>
          <div className="text-sm font-bold text-green-700">🎮 משחקים עכשיו</div>
        </div>
      </div>
    </div>
  );
};
