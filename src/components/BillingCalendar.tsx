import React, { useState } from "react";
import { Calendar, DollarSign, ChevronRight, TrendingUp, AlertTriangle, Play } from "lucide-react";
import { Subscription } from "../types";

interface BillingCalendarProps {
  subscriptions: Subscription[];
}

export default function BillingCalendar({ subscriptions }: BillingCalendarProps) {
  const [selectedMonthOffset, setSelectedMonthOffset] = useState(0);

  // Months labels from current date
  const getMonthsArray = () => {
    const arr = [];
    const baseDate = new Date(); // Starts at July 2026 as per user metadata or local system time
    for (let i = 0; i < 12; i++) {
      const d = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, 1);
      arr.push({
        label: d.toLocaleString("default", { month: "short", year: "2-digit" }),
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        offset: i,
      });
    }
    return arr;
  };

  const months = getMonthsArray();
  const activeMonthObj = months[selectedMonthOffset];

  // Compute total cost for the selected month
  const getSelectedMonthBills = () => {
    return subscriptions.filter((sub) => {
      // If yearly, checks if its billing month aligns
      if (sub.period === "yearly") {
        const billingMonth = new Date(sub.billingDate).getMonth();
        return billingMonth === activeMonthObj.monthIndex;
      }
      // If monthly, all monthly subscriptions apply every month!
      return true;
    });
  };

  const selectedMonthBills = getSelectedMonthBills();
  const selectedMonthTotal = selectedMonthBills.reduce((sum, sub) => sum + sub.cost, 0);

  // Compute monthly totals for the entire year to locate spikes
  const getYearlyCashFlow = () => {
    return months.map((m) => {
      const bills = subscriptions.filter((sub) => {
        if (sub.period === "yearly") {
          return new Date(sub.billingDate).getMonth() === m.monthIndex;
        }
        return true;
      });
      const total = bills.reduce((sum, sub) => sum + sub.cost, 0);
      return {
        ...m,
        total,
      };
    });
  };

  const yearlyFlow = getYearlyCashFlow();
  const maxMonthlySpend = Math.max(...yearlyFlow.map((f) => f.total), 1);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="mb-6 border-b border-slate-50 pb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
          <Calendar className="w-5 h-5 text-indigo-600" /> Billing Calendar & Cash Flow Forecast
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Visualize a rolling 12-month calendar to anticipate payment spikes, premium renewals, and trial expires
        </p>
      </div>

      {/* 12-MONTH CASH FLOW TIMELINE GRAPH */}
      <div className="mb-6">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-3">
          Rolling 12-Month Cash Flow Timeline
        </span>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 h-24 items-end bg-slate-50 p-4 rounded-2xl border border-slate-100/80">
          {yearlyFlow.map((flow) => {
            const heightPercent = (flow.total / maxMonthlySpend) * 100;
            const isSelected = selectedMonthOffset === flow.offset;

            return (
              <button
                key={flow.offset}
                onClick={() => setSelectedMonthOffset(flow.offset)}
                className="group flex flex-col items-center justify-end h-full w-full focus:outline-hidden"
              >
                <div className="text-[9px] text-slate-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                  ${flow.total.toFixed(0)}
                </div>
                <div className="w-full relative rounded-t-md overflow-hidden bg-slate-200 h-16 flex items-end">
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      isSelected 
                        ? "bg-indigo-600" 
                        : "bg-indigo-200 group-hover:bg-indigo-300"
                    }`}
                    style={{ height: `${Math.max(heightPercent, 8)}%` }}
                  />
                </div>
                <span className={`text-[9px] font-bold mt-1.5 ${isSelected ? "text-indigo-600" : "text-slate-400"}`}>
                  {flow.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DETAILED MONTH DRILLDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100/80 flex flex-col justify-between">
          <div>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mb-3">
              Selected Forecast
            </span>
            <h4 className="text-lg font-bold text-slate-800 capitalize">
              Renewals in {activeMonthObj.label}
            </h4>
            <span className="text-4xl font-extrabold text-slate-800 block mt-3">
              ${selectedMonthTotal.toFixed(2)}
            </span>
            <p className="text-xs text-slate-400 mt-2">
              Sum of all subscriptions renewing in this monthly window.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200/50 mt-4">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider mb-2">
              Cash Flow Health Indicator
            </span>
            {selectedMonthTotal > 100 ? (
              <div className="p-2.5 bg-amber-50 border border-amber-100 text-amber-800 rounded-xl text-[11px] flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  High renewal month! Ensure adequate bank balance on active biller dates to prevent overdrafts.
                </span>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-[11px] flex gap-2">
                <Play className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 fill-emerald-600" />
                <span>
                  All systems clear. Spend is within standard budget safety limits.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* LIST OF SPECIFIC BILLS DUE THIS MONTH */}
        <div className="md:col-span-2 border border-slate-100 rounded-2xl p-4 bg-white space-y-3 max-h-72 overflow-y-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Scheduled Renewals List ({selectedMonthBills.length})
          </span>
          {selectedMonthBills.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No bills scheduled for this month.
            </div>
          ) : (
            selectedMonthBills.map((sub) => (
              <div
                key={sub.id}
                className="flex justify-between items-center p-3 border border-slate-100 bg-slate-50/20 rounded-xl hover:border-slate-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${sub.logoColor || "bg-indigo-500"} text-white font-bold text-sm flex items-center justify-center`}>
                    {sub.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs">{sub.name}</h5>
                    <span className="text-[10px] text-slate-400 block capitalize">
                      {sub.period} billing · Due date: {new Date(sub.billingDate).getDate()}th
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-800">${sub.cost.toFixed(2)}</span>
                  <span className="text-[9px] text-slate-400 block uppercase">
                    {sub.isTrial ? "Trial expire" : "Standard"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
