import dayjs from 'dayjs'
import React from 'react'
import { API_BASE } from '../../../lib/public.constants'
import { useNavigate } from 'react-router-dom'




const PastAppointmentCard = ({appt, isPast, handleOpenReview, handleCancel, providerInfo}) => {

  const navigate = useNavigate()

  // if(providerInfo) {
  //   console.log("Dragon...:",providerInfo)
  //   console.log("Dragon:", typeof(providerInfo.avatar))

  //   let l = providerInfo.avatar

  //   let o = l.includes("b")
  //   console.log(o)

  // }

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center mb-4">
      <div className="flex gap-4 items-center">
        <div className="bg-slate-100 p-3 rounded-lg text-center min-w-[70px]">
          <span className="block text-xs font-bold text-slate-500 uppercase">
            {dayjs(appt.date).format('MMM')}
          </span>
          <span className="text-xl font-black">{dayjs(appt.date).format('DD')}</span>
        </div>
        <div>

          {providerInfo && 
            <img 
              src={!providerInfo?.avatar.includes("background=random") ? `${API_BASE}${providerInfo.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(providerInfo.user.name)}`}
              className="w-32 h-32 rounded-3xl object-cover"
            />
          }
          <h4 className="font-bold text-slate-800">{appt.provider?.businessName}</h4>
          <p className="text-sm text-slate-500">{appt.service?.name} • {appt.startTime}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Status Badge */}
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
          appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {appt.status}
        </span>

        {/* Action: Review */}
        {!isPast && appt.status === 'confirmed' && !appt.isReviewed && (
          <button 
            onClick={() => handleOpenReview(appt)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold "
          >
            Leave a Review
          </button>
        )}

        {/* Action: Cancel (Now connected to handleCancel) */}
        {!isPast && appt.status === 'confirmed' && (
          <button 
            onClick={() => handleCancel(appt._id)}
            className="text-xs text-red-500 font-semibold hover:underline"
          >
            Cancel
          </button>
        )}

        {/* Action: Reschedule (Fixed Navigate Bug) */}
        {!isPast && (
          <button 
            onClick={() => navigate(`/booking/${appt.provider?._id}?reschedule=${appt._id}`)}
            className="text-xs text-blue-600 font-semibold hover:underline"
          >
            Reschedule
          </button>
        )}
      </div>
    </div>
  )
}

export default PastAppointmentCard
