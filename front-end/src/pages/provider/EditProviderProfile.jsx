import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FiCamera, FiMapPin, FiBriefcase, FiPhone, FiAlignLeft, FiAlertTriangle, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import ProviderHeader from '../../features/provider/components/ProviderHeader';
import Button from '../../components/ui/Button';
import { API_BASE } from '../../lib/public.constants';
import GlobalLoader from '../../components/layout/GlobalLoader';



const EditProviderProfile = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    location: {
      city: '',
      country: '',
      address: ''
    },
    avatar: '',
    phone: ''
  });

  
  const [userInfo, setUserInfo] = useState({
    name: "",
    avatar: ""
  })
  



  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [avatarFileP, setAvatarFileP] = useState(null);
  const [previewUrlP, setPreviewUrlP] = useState(null);
  

  const { user, updateUserData } = useAuth();


  const INDUSTRIES = ['other','healthcare', 'beauty', 'education', 'consulting', 'fitness'];

  
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get('/providers/me');
        const p = res.data.data || res.data; 

        console.log(p.location)

        setFormData({
          businessName: p.businessName || '',
          description: p.description || '',
          location: p.location || {
            city: '',
            country: '',
            address: ''
          },
          avatar: p.avatar || '',
          phone: p.phone || '',
          industry: p.industry || 'other'
        });

        setUserInfo({
          name: p.user.name || "",
          avatar: p.user.avatar || ""
        })

      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);


  const handleFileChange = (e, val) => {
    const file = e.target.files[0];

    console.log(file)

    if (file) {

      if(val === "user") {
        setAvatarFile(file); // This is where 'avatarFile' comes from!
        setPreviewUrl(URL.createObjectURL(file)); // This creates a local preview for the user to see
      }
      
      if(val === "provider") {
        setAvatarFileP(file);
        setPreviewUrlP(URL.createObjectURL(file));

      }
    }
  };

  const handleRemovePhoto = async (val) => {
    const confirm = window.confirm("Are you sure you want to remove your profile photo?");
    if (!confirm) return;

    try {
      if(val === "user") {
        // 1. Tell backend to set avatar to an empty string
        await api.patch('/users/me', { avatar: "" });
  
        // 2. Clear local states
        setAvatarFile(null);
        setPreviewUrl(null);
  
        // 3. Update global AuthContext so Navbar updates
        updateUserData({ avatar: "" });
        
      }
      
      if(val === "provider") {
        // 1. Tell backend to set avatar to an empty string
        await api.patch('/providers/profile', { avatar: "" });
  
        // 2. Clear local states
        setAvatarFileP(null);
        setPreviewUrlP(null);
      }

      alert("Photo removed.");
    } catch (err) {
      alert("Failed to remove photo.");
    }
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setSaving(true);

    const userData = new FormData();
    userData.append('name', userInfo.name);
    if (avatarFile) userData.append('avatar', avatarFile);  // User Avatar

    const businessData = new FormData();
    const newLocation = new FormData();


    for (let [key, val] of Object.entries(formData)) {
      if (key === "avatar" && avatarFileP) {
        // If it's the provider avatar, append it
        businessData.append("avatar", avatarFileP);
      } else if (key === "location") {

        businessData.append("location[address]", val.address);
        businessData.append("location[city]", val.city);
        businessData.append("location[country]", val.country);
      } else {
        // Append other form data normally
        businessData.append(`${key}`, val);
      }
    }

    console.log("bussi",businessData)

    try {
      // Update User Identity
      const userRes = await api.patch('/users/me', userData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Update Provider Business Info
      const providerRes = await api.patch('/providers/profile', businessData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (updateUserData) {
        updateUserData({
          name: userRes.data.data.name,
          avatar: userRes.data.data.avatar
        });
      }

      setFormData({
        ...formData,
        avatar: providerRes.data.data.avatar  // Update the avatar field in the formData after successful API response
      });

      alert("Professional profile and identity updated!");
    } catch (err) {
      console.error("Save Error Details:", err.response?.data);
      alert(err.response?.data?.message || "Error saving some data.");
    } finally {
      setSaving(false);
    }
  };
  const [confirmName, setConfirmName] = useState('');

  const handleDeleteAccount = async () => {
    // Final safeguard
    if (confirmName !== formData.businessName) {
      alert("The business name entered does not match.");
      return;
    }

    try {
      await api.delete('/providers/account');
      alert("Account and all associated data have been purged.");
      window.location.href = '/login'; 
    } catch (err) {
      alert("Error deleting account. Please try again.");
    }
  };

  if (loading) return <GlobalLoader message='Loading Profile...'/>

  console.log(formData)
  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-3">

      <ProviderHeader
        title="Provider Settings"
        subtitle="Update your information"
      />

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Avatar Upload Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm  flex flex-col items-center slideUp">

          <div className="flex flex-col items-center gap-2">
            <h2 className='text-(--brand-primary) border-b-2 rounded-2xl px-3'>User Avatar</h2>
            <div className="relative border-2 border-slate-100 rounded-3xl">
              <img 
                src={previewUrl ? URL.createObjectURL(avatarFile) : (user.avatar ? `${API_BASE}${user.avatar}` : `https://ui-avatars.com/api/?name=${user.name}`)}
                  className="w-32 h-32 rounded-3xl object-cover " 
                  alt="Profile"
                  className="w-32 h-32 rounded-3xl object-cover"
                className="w-32 h-32 rounded-3xl object-cover" 
              />
              <label className="absolute bottom-0 right-0 cursor-pointer bg-blue-600 p-2 rounded-xl">
                <FiCamera className="text-white" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(e,"user")} 
                />
              </label>
            </div>

            {(formData.avatar || previewUrl) && (
              <button 
                type="button"
                onClick={handleRemovePhoto.bind(this, "user")}
                className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-widest mt-2 cursor-pointer"
              >
                Remove Photo
              </button>
            )}
          </div>

        </div>
        {/* Provider Avatar Upload Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm  flex flex-col items-center slideUp">
          <h2 className='text-(--brand-primary) border-b-2 rounded-2xl px-3'>Provider Avatar</h2>
          <div className="flex flex-col items-center gap-2">
            <div className="relative border-2 border-slate-100 rounded-3xl">
              <img 
                src={previewUrlP ? URL.createObjectURL(avatarFileP) : (formData.avatar ? `${API_BASE}${formData.avatar}` : `https://ui-avatars.com/api/?name=${user.name}`)}
                  className="w-32 h-32 rounded-3xl object-cover " 
                  alt="Profile"
                  className="w-32 h-32 rounded-3xl object-cover"
                className="w-32 h-32 rounded-3xl object-cover" 
              />
              <label className="absolute bottom-0 right-0 cursor-pointer bg-blue-600 p-2 rounded-xl">
                <FiCamera className="text-white" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(e, "provider")} 
                />
              </label>
            </div>

            {(formData.avatar || previewUrlP) && (
              <button 
                type="button"
                onClick={handleRemovePhoto.bind(this, "provider")}
                className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-widest mt-2 cursor-pointer"
              >
                Remove Photo
              </button>
            )}
          </div>

        </div>

        {/* Camera Label Input */}


        {/* Core Info */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6 slideUp">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase mb-2">
              <FiUser /> User Name
            </label>
            <input 
              type="text" 
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500"
              value={userInfo.name}
              onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase mb-2">
              <FiBriefcase /> Business Name
            </label>
            <input 
              type="text" 
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500"
              value={formData.businessName}
              onChange={(e) => setFormData({...formData, businessName: e.target.value})}
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase mb-2">
              <FiBriefcase /> Industry Type
            </label>
            <select 
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 appearance-none"
              value={formData.industry}
              onChange={(e) => setFormData({...formData, industry: e.target.value})}
            >
              {industries.map((ind, index) => <option key={index} value={ind}>{ind}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Address Input */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase mb-2">
                <FiMapPin /> Street Address
              </label>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500"
                value={formData.location.address}
                onChange={(e) => setFormData({
                  ...formData, 
                  location: { ...formData.location, address: e.target.value }
                })}
              />
            </div>

            {/* City Input */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase mb-2">
                City
              </label>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500"
                value={formData.location.city}
                onChange={(e) => setFormData({
                  ...formData, 
                  location: { ...formData.location, city: e.target.value }
                })}
              />
            </div>

            {/* Country Input */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase mb-2">
                Country
              </label>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500"
                value={formData.location.country}
                onChange={(e) => setFormData({
                  ...formData, 
                  location: { ...formData.location, country: e.target.value }
                })}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase mb-2">
                <FiPhone /> Contact Phone
              </label>
              <input 
                type="text" 
                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase mb-2">
              <FiAlignLeft /> About / Description
            </label>
            <textarea 
              rows="4"
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your services..."
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={saving}
          className="w-full  py-5 rounded-3xl font-black text-lg transition disabled:bg-slate-300"
          variant='design'
        >
          {saving ? 'Updating Profile...' : 'Save Professional Profile'}
        </Button>
      </form>
      <div className="mt-12 pt-8 border-t border-red-100 bg-red-50/30 p-6 rounded-3xl">
        <h3 className="text-red-600 font-black text-xl mb-2 flex items-center gap-2">
          <FiAlertTriangle /> Danger Zone
        </h3>
        <p className="text-slate-600 text-sm mb-6">
          This action is <strong>permanent</strong>. It will delete your profile, services, and all historical/upcoming appointment data.
        </p>
        
        <div className="space-y-4">
          <label className="block text-xs font-bold text-red-400 uppercase">
            Type <strong>{formData.businessName}</strong> to confirm
          </label>
          <input 
            type="text"
            className="w-full p-4 border-2 border-red-100 rounded-2xl focus:border-red-500 outline-none transition"
            placeholder="Enter business name"
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
          />
          
          <button 
            type="button"
            onClick={handleDeleteAccount}
            disabled={confirmName !== formData.businessName}
            className="w-full bg-red-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-red-700 transition disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-red-200"
          >
            Permanently Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};


export default EditProviderProfile