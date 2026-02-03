import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

interface StatsData {
  totalVisits: number;
  onlineNow: number;
  hourlyStats: { hour: string; visits: number }[];
}

// Global flag to ensure visit is recorded only once per page load
let visitRecorded = false;

export const StatsPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<StatsData>({
    totalVisits: 0,
    onlineNow: 0,
    hourlyStats: []
  });
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Fetch stats when panel opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchStats = async () => {
      // Total visits (unique sessions)
      const { count: totalCount } = await supabase
        .from('site_visits')
        .select('*', { count: 'exact', head: true });

      // Visits in last 24 hours by hour
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: recentVisits } = await supabase
        .from('site_visits')
        .select('visited_at')
        .gte('visited_at', last24Hours);

      // Group by hour
      const hourlyMap: Record<string, number> = {};
      for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0');
        hourlyMap[hour] = 0;
      }

      recentVisits?.forEach(visit => {
        const hour = new Date(visit.visited_at).getHours().toString().padStart(2, '0');
        hourlyMap[hour] = (hourlyMap[hour] || 0) + 1;
      });

      const hourlyStats = Object.entries(hourlyMap)
        .map(([hour, visits]) => ({ hour: `${hour}:00`, visits }))
        .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

      setStats(prev => ({
        ...prev,
        totalVisits: totalCount || 0,
        hourlyStats
      }));
    };

    fetchStats();
  }, [isOpen]);

  // Setup presence channel once on mount (not when panel opens)
  useEffect(() => {
    // Generate unique session ID
    let sessionId = localStorage.getItem('game_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('game_session_id', sessionId);
    }

    // Record visit only once per page load
    const recordVisit = async () => {
      if (visitRecorded) return;
      visitRecorded = true;
      await supabase.from('site_visits').insert({ session_id: sessionId });
    };

    recordVisit();

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
        setStats(prev => ({ ...prev, onlineNow: onlineCount }));
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

  const COLORS = ['#f59e0b', '#d97706', '#b45309', '#92400e'];

  return (
    <div className="pixel-modal">
      <div className="modal-box bg-gradient-to-b from-blue-50 to-blue-100 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-blue-900">📊 סטטיסטיקות</h2>
          <button onClick={onClose} className="pixel-btn pixel-btn-red w-8 h-8 text-sm p-0">✕</button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white border-4 border-green-500 p-3 text-center shadow-md">
            <div className="text-3xl font-black text-green-600">{stats.onlineNow}</div>
            <div className="text-xs font-bold text-green-700">🎮 משחקים עכשיו</div>
          </div>
          <div className="bg-white border-4 border-purple-500 p-3 text-center shadow-md">
            <div className="text-3xl font-black text-purple-600">{stats.totalVisits}</div>
            <div className="text-xs font-bold text-purple-700">👥 סה״כ ביקורים</div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white border-4 border-black p-3 shadow-md">
          <div className="text-sm font-black text-gray-700 mb-2 text-center">ביקורים ב-24 שעות אחרונות</div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.hourlyStats}>
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 8, fontWeight: 'bold' }} 
                  interval={3}
                />
                <YAxis 
                  tick={{ fontSize: 8, fontWeight: 'bold' }} 
                  width={25}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: '#fef3c7', 
                    border: '2px solid #000',
                    borderRadius: 0,
                    fontWeight: 'bold'
                  }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="visits" radius={[4, 4, 0, 0]}>
                  {stats.hourlyStats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
