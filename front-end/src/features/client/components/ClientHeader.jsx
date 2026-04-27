import dayjs from 'dayjs'
import React from 'react'

const ClientHeader = ({title, subtitle}) => {

  return (
    <header className="flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold text-(--brand-primary)">{title}</h1>
        <p className="text-slate-500 text-xl">{subtitle}</p>
      </div>
      <div className="text-sm font-medium bg-(--bg-sidebar) px-4 py-2 rounded-lg border border-slate-200">
        {dayjs().format('dddd, MMMM D')}
      </div>
    </header>
  )
}

export default ClientHeader
