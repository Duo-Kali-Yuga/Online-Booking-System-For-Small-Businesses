import React from 'react'
import dayjs from 'dayjs';
import { API_BASE } from '../lib/public.constants';




const ProviderHeaderStart = ({provider}) => {
  if (!provider) return null;

  console.log(provider)

  const { ratingStats, businessName, avatar, user, description } = provider;
  


  return (
    <div className="bg-white border-b border-slate-100 pb-8 pt-4 mb-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          
          {/* Avatar Section */}
          <div className="relative">
            <img 
              src={avatar ? `${API_BASE}${avatar}` : `https://ui-avatars.com/api/?name=${user.name}`}
              alt={businessName}
              className="w-24 h-24 md:w-32 md:h-32 rounded-3xl object-cover shadow-lg border-4 border-white"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm" title="Online"></div>
          </div>

          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-1">{businessName}</h1>
                
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={star <= Math.round(ratingStats?.averageRating || 0) ? "opacity-100" : "opacity-20"}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="font-bold text-slate-700">{ratingStats?.averageRating || "0.0"}</span>
                  <span className="text-slate-400 text-sm">({ratingStats?.totalReviews || 0} reviews)</span>
                </div>
              </div>

              <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider">
                Top Rated Provider
              </div>
            </div>

            {description && (
              <p className="mt-4 text-slate-500 max-w-2xl leading-relaxed text-sm md:text-base">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderHeaderStart
