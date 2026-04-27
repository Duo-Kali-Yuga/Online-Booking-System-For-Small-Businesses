import React from 'react'
import { INDUSTRIES } from '../../../lib/public.constants'
import Label from '../../../components/ui/Label'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'


const ProviderForm = ({
  onSubmit, formData, setFormData
}) => {

  INDUSTRIES.unshift("other")
  INDUSTRIES.pop()


  return (
      <form onSubmit={onSubmit} className="space-y-4 flex flex-col gap-2">
        <div>
          <Label>Business Name</Label>
          <Input 
            type="text" 
            placeholder="Business name..."
            onChange={(e) => setFormData({...formData, businessName: e.target.value})}
            required
            className="flex-1"
          />
        </div>
        <div>
          <Label>Industry</Label>
          <select 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
            onChange={(e) => setFormData({...formData, industry: e.target.value})}
          >
            {
              INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))
            }
          </select>
        </div>
        <div className="grid grid-cols-2">
          <div>
            <Label>City</Label>
            <input 
              placeholder="City (e.g. Nanjing)" 
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl"
              onChange={(e) => setFormData({...formData, city: e.target.value})}
            />
          </div>
          <div>
            <Label>Country</Label>
            <input 
              placeholder="Country" 
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl"
              onChange={(e) => setFormData({...formData, country: e.target.value})}
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full py-4  font-bold transition">
          Finish Setup
        </Button>
      </form>
  )
}


export default ProviderForm
