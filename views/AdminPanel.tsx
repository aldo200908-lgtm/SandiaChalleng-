
import React from 'react';
import { AppView } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, FileCheck, DollarSign, Activity, ChevronRight, Check, X } from 'lucide-react';

interface AdminPanelProps {
  navigateTo: (view: AppView) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ navigateTo }) => {
  const statsData = [
    { name: 'Lun', users: 400, revenue: 240 },
    { name: 'Mar', users: 520, revenue: 310 },
    { name: 'Mie', users: 600, revenue: 450 },
    { name: 'Jue', users: 800, revenue: 580 },
    { name: 'Vie', users: 950, revenue: 620 },
    { name: 'Sab', users: 1100, revenue: 800 },
    { name: 'Dom', users: 1200, revenue: 950 },
  ];

  const pendingApprovals = [
    { id: '1', user: 'carlos_92', challenge: 'Murales', date: '10:15 AM' },
    { id: '2', user: 'ana_art', challenge: 'Creativo', date: '11:30 AM' },
  ];

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold font-poppins text-slate-800">Admin Dashboard</h2>
         <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded uppercase">Modo Admin</span>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
         <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-1">
            <div className="text-blue-600 bg-blue-50 w-8 h-8 rounded-lg flex items-center justify-center mb-2">
               <Users size={18} />
            </div>
            <p className="text-2xl font-bold">1,245</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Usuarios Activos</p>
         </div>
         <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-1">
            <div className="text-green-600 bg-green-50 w-8 h-8 rounded-lg flex items-center justify-center mb-2">
               <DollarSign size={18} />
            </div>
            <p className="text-2xl font-bold">$12.4k</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ingresos Ad</p>
         </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
         <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity size={18} className="text-blue-600" />
            Crecimiento Semanal
         </h4>
         <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={statsData}>
                  <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} dot={false} />
               </LineChart>
            </ResponsiveContainer>
         </div>
         <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-blue-600" />
               <span className="text-[10px] font-bold text-slate-500 uppercase">Usuarios</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-green-500" />
               <span className="text-[10px] font-bold text-slate-500 uppercase">Ingresos</span>
            </div>
         </div>
      </div>

      {/* Moderation Queue */}
      <div className="space-y-3">
         <div className="flex justify-between items-center px-1">
            <h4 className="font-bold text-slate-800">Cola de Moderación</h4>
            <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded">2 PENDIENTES</span>
         </div>
         <div className="space-y-2">
            {pendingApprovals.map((item) => (
               <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-100 rounded-full" />
                     <div>
                        <p className="text-sm font-bold text-slate-800">{item.user}</p>
                        <p className="text-[10px] text-slate-400">Reto: {item.challenge} • {item.date}</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors">
                        <Check size={16} />
                     </button>
                     <button className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                        <X size={16} />
                     </button>
                  </div>
               </div>
            ))}
         </div>
         <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-blue-600 font-bold text-xs rounded-xl border border-slate-100 mt-2">
            Ver todas las pruebas <ChevronRight size={14} />
         </button>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 gap-3">
         <button className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl shadow-lg active:scale-[0.98] transition-all">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-white/10 rounded-xl">
                  <FileCheck size={18} />
               </div>
               <div className="text-left">
                  <p className="text-sm font-bold">Gestionar Retos</p>
                  <p className="text-[10px] text-slate-400">Crear y editar desafíos</p>
               </div>
            </div>
            <ChevronRight size={18} />
         </button>
         
         <button className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl active:scale-[0.98] transition-all">
            <div className="flex items-center gap-3 text-slate-800">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <DollarSign size={18} />
               </div>
               <div className="text-left">
                  <p className="text-sm font-bold">Control Económico</p>
                  <p className="text-[10px] text-slate-400">Tasas de conversión y retiros</p>
               </div>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
         </button>
      </div>
    </div>
  );
};

export default AdminPanel;
