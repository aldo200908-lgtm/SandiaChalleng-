
import React, { useState } from 'react';
import { User, AppView } from '../types';
import { CONVERSION_RATE, MIN_WITHDRAWAL_LEVEL } from '../constants';
import { supabase } from '../lib/supabase';
import { CreditCard, ArrowRightLeft, ShieldCheck, Info, Loader2, AlertCircle, X, CheckCircle2, Phone } from 'lucide-react';

interface WalletProps {
  user: User;
  navigateTo: (view: AppView) => void;
}

const Wallet: React.FC<WalletProps> = ({ user, navigateTo }) => {
  const [amountToConvert, setAmountToConvert] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<'confirm' | 'processing' | 'success' | 'error'>('confirm');
  
  const canWithdraw = user.level >= MIN_WITHDRAWAL_LEVEL;
  const hasPaymentMethod = user.yape_number || user.plin_number;
  const estimatedValue = amountToConvert ? (parseFloat(amountToConvert) / CONVERSION_RATE).toFixed(2) : '0.00';

  const handleConvert = async () => {
    const points = parseInt(amountToConvert);
    if (isNaN(points) || points <= 0 || points > user.points) return;

    setIsProcessing(true);
    const moneyToAdd = points / CONVERSION_RATE;
    const newPoints = user.points - points;
    const newBalance = user.walletBalance + moneyToAdd;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          points: newPoints, 
          wallet_balance: newBalance 
        })
        .eq('id', user.id);

      if (!error) {
        alert(`¡Éxito! Has convertido ${points} puntos en S/ ${moneyToAdd.toFixed(2)}`);
        setAmountToConvert('');
        window.location.reload(); 
      }
    } catch (err) {
      alert("Error en la transacción.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdrawRequest = () => {
    if (!hasPaymentMethod) {
      setWithdrawStep('error');
      return;
    }
    setWithdrawStep('processing');
    setTimeout(() => {
      setWithdrawStep('success');
    }, 2000);
  };

  const closeWithdrawDialog = () => {
    setShowWithdrawDialog(false);
    setWithdrawStep('confirm');
  };

  return (
    <div className="p-4 space-y-6 pb-24 animate-in fade-in duration-300">
      <div className="flex items-center gap-2">
         <h2 className="text-2xl font-bold font-poppins text-slate-800">Mi Billetera Real</h2>
      </div>

      {/* Saldo Card */}
      <div className="bg-slate-900 rounded-[2.5rem] p-7 text-white shadow-2xl relative overflow-hidden border border-white/5">
        <div className="relative z-10">
          <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Saldo Disponible</p>
          <h3 className="text-4xl font-bold font-poppins mb-6">S/ {user.walletBalance.toFixed(2)}</h3>
          
          <div className="flex items-center gap-6">
             <div className="flex flex-col">
                <span className="text-slate-500 text-[9px] font-bold uppercase tracking-wider">Tus Puntos</span>
                <span className="text-lg font-bold">{user.points.toLocaleString()} <span className="text-xs font-medium opacity-60">pts</span></span>
             </div>
             <div className="w-px h-8 bg-white/10" />
             <div className="flex flex-col">
                <span className="text-slate-500 text-[9px] font-bold uppercase tracking-wider">Estado</span>
                <span className="text-xs font-bold text-green-400 flex items-center gap-1">
                  <ShieldCheck size={12} /> VERIFICADO
                </span>
             </div>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl" />
      </div>

      {/* Convertir Puntos */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-5">
         <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
               <ArrowRightLeft size={18} className="text-blue-600" />
               Canje de Puntos
            </h4>
         </div>

         <div className="relative">
            <input 
              type="number" 
              value={amountToConvert}
              onChange={(e) => setAmountToConvert(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 text-xl font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              placeholder="Mínimo 1000"
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-bold">P</div>
         </div>

         <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 text-center">
            <p className="text-[10px] text-blue-500 font-bold mb-1 uppercase tracking-widest">Recibirás</p>
            <p className="text-2xl font-bold text-blue-700">S/ {estimatedValue}</p>
         </div>

         <button 
           disabled={isProcessing || !amountToConvert || parseInt(amountToConvert) > user.points || parseInt(amountToConvert) < 1000}
           onClick={handleConvert}
           className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-blue-100"
         >
            {isProcessing ? <Loader2 className="animate-spin" size={20} /> : 'Convertir a Dinero Real'}
         </button>
      </div>

      {/* Retirar Dinero */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
         <h4 className="font-bold text-slate-800 flex items-center gap-2">
            <CreditCard size={18} className="text-green-600" />
            Retirar Fondos
         </h4>
         
         <div className="flex gap-2">
            <div className={`flex-1 p-3 rounded-2xl border flex flex-col items-center gap-1 ${user.yape_number ? 'bg-purple-50 border-purple-100' : 'bg-slate-50 border-slate-100 opacity-40'}`}>
                <div className="w-8 h-8 bg-[#742484] rounded-lg flex items-center justify-center text-white font-black text-[10px]">Y</div>
                <span className="text-[9px] font-black text-[#742484] uppercase">Yape</span>
            </div>
            <div className={`flex-1 p-3 rounded-2xl border flex flex-col items-center gap-1 ${user.plin_number ? 'bg-cyan-50 border-cyan-100' : 'bg-slate-50 border-slate-100 opacity-40'}`}>
                <div className="w-8 h-8 bg-[#00d1ff] rounded-lg flex items-center justify-center text-white font-black text-[10px]">P</div>
                <span className="text-[9px] font-black text-[#00a3cc] uppercase">Plin</span>
            </div>
         </div>

         <button 
           disabled={!canWithdraw || user.walletBalance < 10}
           onClick={() => setShowWithdrawDialog(true)}
           className={`w-full font-bold py-4 rounded-2xl transition-all ${
             canWithdraw && user.walletBalance >= 10 
             ? 'bg-green-600 text-white shadow-lg active:scale-95' 
             : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'
           }`}
         >
            {canWithdraw ? 'Solicitar Retiro (Min. S/ 10)' : `Bloqueado hasta Nivel ${MIN_WITHDRAWAL_LEVEL}`}
         </button>
      </div>

      {/* Withdraw Confirmation Modal */}
      {showWithdrawDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={withdrawStep === 'confirm' ? closeWithdrawDialog : undefined} />
          
          <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {withdrawStep === 'confirm' && (
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <AlertCircle size={28} />
                  </div>
                  <button onClick={closeWithdrawDialog} className="text-slate-400 hover:text-slate-600 p-1">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-800 font-poppins">Confirmar Retiro</h3>
                  <p className="text-sm text-slate-500">Estás por solicitar el retiro de tus fondos acumulados.</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Monto a retirar:</span>
                    <span className="text-slate-800 font-bold">S/ {user.walletBalance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Destino:</span>
                    <span className="text-blue-600 font-bold">{user.yape_number ? 'Yape' : (user.plin_number ? 'Plin' : 'No vinculado')}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={closeWithdrawDialog} className="flex-1 py-4 px-2 rounded-2xl text-slate-500 font-bold text-sm hover:bg-slate-50 transition-colors">
                    Cancelar
                  </button>
                  <button onClick={handleWithdrawRequest} className="flex-1 bg-blue-600 text-white py-4 px-2 rounded-2xl font-bold text-sm shadow-lg shadow-blue-100 active:scale-95 transition-all">
                    Confirmar
                  </button>
                </div>
              </div>
            )}

            {withdrawStep === 'error' && (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                  <Phone size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-800">Método de Pago Requerido</h3>
                  <p className="text-sm text-slate-500">Para retirar, primero debes vincular tu número de Yape o Plin en tu perfil.</p>
                </div>
                <button 
                  onClick={() => { closeWithdrawDialog(); navigateTo(AppView.PROFILE); }}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all"
                >
                  Ir a mi Perfil
                </button>
              </div>
            )}

            {withdrawStep === 'processing' && (
              <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
                <Loader2 size={48} className="text-blue-600 animate-spin" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-800">Procesando Solicitud</h3>
                  <p className="text-sm text-slate-400">Validando destino de transferencia...</p>
                </div>
              </div>
            )}

            {withdrawStep === 'success' && (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                  <CheckCircle2 size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-800">¡Solicitud Enviada!</h3>
                  <p className="text-sm text-slate-500">Tu retiro ha sido registrado. Te avisaremos cuando el depósito se complete.</p>
                </div>
                <button onClick={closeWithdrawDialog} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all">
                  Entendido
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
