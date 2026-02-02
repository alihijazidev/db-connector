import React from 'react';
import { useForm } from "react-hook-form";
import { Database, ShieldCheck, Globe, Loader2 } from "lucide-react";
import { useConnection, getAvailableDatabases } from "@/context/ConnectionContext";

export const ConnectionForm = ({ onSuccess }) => {
  const { addConnection } = useConnection();
  const availableDatabases = getAvailableDatabases();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: "",
      database: availableDatabases[0],
    }
  });

  const onSubmit = async (values) => {
    const success = await addConnection({
      ...values,
      type: "PostgreSQL",
    });
    if (success) {
      onSuccess();
    }
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none";
  const labelClass = "block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 mr-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className={labelClass}>اسم الاتصال</label>
          <div className="relative">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Globe size={18} />
            </div>
            <input 
              {...register("name", { required: "يرجى إدخال اسم الاتصال" })}
              placeholder="مثال: قاعدة بيانات العملاء"
              className={cn(inputClass, "pr-12", errors.name && "border-red-300 bg-red-50")}
            />
          </div>
          {errors.name && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.name.message}</p>}
        </div>

        <div>
          <label className={labelClass}>قاعدة البيانات</label>
          <div className="relative">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Database size={18} />
            </div>
            <select 
              {...register("database")}
              className={cn(inputClass, "pr-12 cursor-pointer appearance-none")}
            >
              {availableDatabases.map(db => (
                <option key={db} value={db}>{db}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-3">
        <ShieldCheck className="text-indigo-600 shrink-0" size={20} />
        <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
          سيتم اختبار الاتصال تلقائياً وحفظ البيانات محلياً في متصفحك بشكل آمن.
        </p>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "تثبيت الاتصال الآن"}
      </button>
    </form>
  );
};