import React from 'react'

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className=" p-6 rounded-2xl border border-slate-100  design-bgRight">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="text-xl" />
        </div>
      </div>
    </div>
  )
}


export default StatCard
