import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FiCamera, FiMapPin, FiBriefcase, FiPhone, FiAlignLeft, FiAlertTriangle } from 'react-icons/fi';


const EditProviderProfile = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    businessName: '',
    bio: '',
    location: '',
    avatar: '',
    phone: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // --- MISSING STATES ADDED HERE ---
  const [providerName, setProviderName] = useState('');
  const [settings, setSettings] = useState(null);


  const industries = ['healthcare', 'beauty', 'education', 'consulting', 'fitness', 'other'];

  
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get('/providers/me');
        const p = res.data.data || res.data; 

        setFormData({
          businessName: p.businessName || '',
          bio: p.bio || '',
          location: p.location || '',
          avatar: p.avatar || '',
          phone: p.phone || '',
          industry: p.industry || 'other'
        });

        // These now have corresponding states to update!
        if (p.user) {
          setProviderName(p.user.name || ''); 
        }
        if (p.settings) {
          setSettings(p.settings);
        }

      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file); // This is where 'avatarFile' comes from!
      setPreviewUrl(URL.createObjectURL(file)); // This creates a local preview for the user to see
    }
  };

  const handleRemovePhoto = async () => {
    const confirm = window.confirm("Are you sure you want to remove your profile photo?");
    if (!confirm) return;

    try {
      // 1. Tell backend to set avatar to an empty string
      await api.patch('/users/me', { avatar: "" });

      // 2. Clear local states
      setAvatarFile(null);
      setPreviewUrl(null);

      // 3. Update global AuthContext so Navbar updates
      updateUserData({ avatar: "" });

      alert("Photo removed.");
    } catch (err) {
      alert("Failed to remove photo.");
    }
  };


  // const handleSave = async (e) => {
  //   e.preventDefault();
  //   setSaving(true);
  //   try {
  //     await api.patch('/providers/profile', formData);
  //     alert("Profile updated successfully!");
  //   } catch (err) {
  //     alert("Error updating profile");
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  // const handleSave = async (e) => {
  //   e.preventDefault();
  //   setSaving(true);

  //   // We MUST use FormData for file uploads
  //   const data = new FormData();
  //   data.append('businessName', formData.businessName);
  //   data.append('bio', formData.bio);
  //   data.append('industry', formData.industry);
  //   if (file) data.append('avatar', file); // Append the actual file

  //   try {
  //     // Important: Use multipart/form-data header
  //     await api.patch('/providers/profile', data, {
  //       headers: { 'Content-Type': 'multipart/form-data' }
  //     });
  //     alert("Local profile updated!");
  //   } catch (err) {
  //     alert("Upload failed.");
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  // const handleSaveAll = async (e) => {
  //   e.preventDefault();
  //   setSaving(true);

  //   // 1. Prepare User Data (Identity)
  //   const userData = new FormData();
  //   userData.append('name', providerName); // The personal name of the user
  //   if (avatarFile) userData.append('avatar', avatarFile);

  //   // 2. Prepare Provider Data (Business)
  //   const businessData = {
  //     businessName: formData.businessName,
  //     bio: formData.bio,
  //     industry: formData.industry,
  //     settings: settings // The hours/buffer we built earlier
  //   };

  //   try {
  //     // Hit both endpoints simultaneously
  //     await Promise.all([
  //       api.patch('/users/me', userData), 
  //       api.patch('/providers/profile', businessData)
  //     ]);
      
  //     alert("Professional profile and identity updated!");
  //   } catch (err) {
  //     alert("Error saving some data.");
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setSaving(true);

    const userData = new FormData();
    userData.append('name', providerName);
    // Only append if there is a new file to upload
    if (avatarFile) userData.append('avatar', avatarFile);

    const businessData = {
      businessName: formData.businessName,
      bio: formData.bio,
      industry: formData.industry,
      location: formData.location, // Ensure the object we fixed earlier is included
      settings: settings 
    };

    try {
      // 1. Update User Identity
      const userRes = await api.patch('/users/me', userData);
      
      // 2. Update Provider Business Info
      const providerRes = await api.patch('/providers/profile', businessData);
      
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

  if (loading) return <div className="p-10 text-center">Loading settings...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-8">Provider Settings</h1>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Avatar Upload Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="relative mb-4">
            <img 
              src={
                  previewUrl || 
                  (formData.avatar ? `http://localhost:5000${formData.avatar}` : null) || 
                  `https://ui-avatars.com/api/?name=${formData.businessName || 'User'}`
                } 
                className="w-32 h-32 rounded-3xl object-cover bg-slate-100" 
                alt="Profile"
                className="w-32 h-32 rounded-3xl object-cover border-4 border-slate-50"
              alt="Preview"
            />
            <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-xl text-white shadow-lg">
              <FiCamera />
            </div>
          </div>
          <input 
            type="text" 
            placeholder="Paste Image URL (e.g., Cloudinary/Imgur)"
            className="w-full max-w-sm p-2 text-sm bg-slate-50 border rounded-lg text-center"
            value={formData.avatar}
            onChange={(e) => setFormData({...formData, avatar: e.target.value})}
          />
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden" 
            id="avatar-upload" 
          />
          <label htmlFor="avatar-upload" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-xl">
            Choose Local Photo
          </label>
        </div>

        {/* Camera Label Input */}

        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <img 
              src={
                  previewUrl || 
                  (formData.avatar ? `http://localhost:5000${formData.avatar}` : null) || 
                  `https://ui-avatars.com/api/?name=${formData.businessName || 'User'}`
                } 
                className="w-32 h-32 rounded-3xl object-cover bg-slate-100" 
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
                onChange={handleFileChange} 
              />
            </label>
          </div>

          {(formData.avatar || previewUrl) && (
            <button 
              type="button"
              onClick={handleRemovePhoto}
              className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-widest mt-2"
            >
              Remove Photo
            </button>
          )}
        </div>

        {/* Core Info */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
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
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
              <FiBriefcase /> Industry Type
            </label>
            <select 
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 appearance-none"
              value={formData.industry}
              onChange={(e) => setFormData({...formData, industry: e.target.value})}
            >
              {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Address Input */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
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
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
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
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
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
          </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
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
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
              <FiAlignLeft /> About / Description
            </label>
            <textarea 
              rows="4"
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Describe your services..."
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-lg hover:bg-black transition disabled:bg-slate-300"
        >
          {saving ? 'Updating Profile...' : 'Save Professional Profile'}
        </button>
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