import React from 'react'
import StatCard from './StatCard'

const ProviderDashboardSection = ({ repeat, title, type }) => {

  return (

    <section className='flex flex-col gap-4 text-center'>
      <h3
        className='text-2xl font-bold text-(--brand-primary-hover)'
      >{title}</h3>
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 border-t-4 rounded-2xl py-6 px-4 custom-arrow border-(--brand-primary-hover)">
        {
          repeat.map((val, index) => (
            <StatCard
              key={index}
              title={val.title}
              value={val.value}
              icon={val.icon}
              color={val.color}
            />

          ))
        }
      </div>
    </section>
  )
}

export default ProviderDashboardSection
