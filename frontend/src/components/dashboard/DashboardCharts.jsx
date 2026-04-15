import React from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Activity, PieChart as PieIcon } from 'lucide-react';

const COLORS = ['#10B981', '#F59E0B', '#F43F5E', '#A855F7'];

export default function DashboardCharts({ weeklyData = [], distributionData = [] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      
      {/* ── Weekly Activity Chart ── */}
      <div className="bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-3xl p-6 shadow-xl shadow-[var(--accent-glow)]/5 transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-glow)]/10 border border-[var(--accent-glow)]/20 flex items-center justify-center text-[var(--accent-glow)]">
              <Activity size={18} />
            </div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--primary-text)]">Velocity Stream</h3>
          </div>
          <p className="text-[9px] font-bold text-[var(--muted-text)] uppercase tracking-widest">7 Day Variance</p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData || []}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-glow)" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="var(--accent-glow)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-silk)" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--muted-text)', fontSize: 10, fontWeight: 700 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--muted-text)', fontSize: 10, fontWeight: 700 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.7)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '16px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: 'var(--primary-text)',
                  padding: '12px'
                }}
                itemStyle={{ color: 'var(--accent-glow)' }}
                cursor={{ stroke: 'var(--accent-glow)', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="var(--accent-glow)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={2500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Task Distribution Chart ── */}
      <div className="bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-3xl p-6 shadow-xl shadow-[var(--accent-glow)]/5 transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/20 flex items-center justify-center text-[var(--accent-secondary)]">
              <PieIcon size={18} />
            </div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--primary-text)]">Workload Balance</h3>
          </div>
          <p className="text-[9px] font-bold text-[var(--muted-text)] uppercase tracking-widest">Type Distribution</p>
        </div>

        <div className="h-72 w-full flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData || []}
                innerRadius={70}
                outerRadius={100}
                paddingAngle={8}
                dataKey="value"
                animationDuration={2000}
              >
                {(distributionData || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--accent-glow)' : index === 1 ? 'var(--accent-secondary)' : COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ 
                   backgroundColor: 'rgba(255, 255, 255, 0.7)', 
                   backdropFilter: 'blur(10px)',
                   border: '1px solid var(--glass-border)',
                   borderRadius: '16px',
                   boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                   padding: '12px'
                 }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-x-0 bottom-24 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-[9px] font-bold text-[var(--muted-text)] uppercase tracking-widest mb-1">Status</span>
             <span className="text-xs font-black text-[var(--primary-text)] uppercase tracking-widest">Optimal</span>
          </div>
        </div>
      </div>

    </div>
  );
}
