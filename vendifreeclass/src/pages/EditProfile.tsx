import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackNavigation } from '../hooks/useBackNavigation';
import { ArrowLeft, Camera, Check, Mail, Phone, User, MapPin, Info, Loader2, Download, Trash2, ShieldCheck, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function EditProfile() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const goBack = useBackNavigation();
  const navigate = useNavigate();
  const { user, logout: signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initial data
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatar: 'https://picsum.photos/seed/user/200/200'
  });

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data && !error) {
        setFormData({
          name: data.full_name || '',
          username: data.username || '',
          email: user.email || '',
          phone: data.phone || '',
          location: data.location || '',
          bio: data.bio || '',
          avatar: data.avatar_url || 'https://picsum.photos/seed/user/200/200'
        });
      }
    }
    loadProfile();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Reject if file is too large (> 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('A imagem é demasiado grande (máx 5MB).', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        // Use canvas to compress the image if it's very large
        const img = new Image();
        img.src = base64String;
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimensions for avatar
          const MAX_SIZE = 400;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);

          // Update profile immediately with new avatar
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: compressedBase64 })
            .eq('id', user.id);
          
          if (updateError) throw updateError;

          setFormData(prev => ({ ...prev, avatar: compressedBase64 }));
          setIsUploading(false);
        };
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showToast(t('profile.errorUploading'), 'error');
      setIsUploading(false);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.name,
          username: formData.username,
          phone: formData.phone,
          location: formData.location,
          bio: formData.bio,
          last_login: new Date().toISOString(),
          status: 'active'
        })
        .eq('id', user.id);

      if (error) throw error;

      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/profile');
      }, 1500);
    } catch (err) {
      console.error('Error saving profile:', err);
      showToast(t('profile.errorSaving'), 'error');
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-background min-h-screen pb-32">
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-50 glass-header flex items-center justify-between px-6 h-16 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => goBack()}
            className="p-2 text-primary hover:bg-surface-container-high/50 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-black font-headline text-primary tracking-tight">{t('profile.editProfile')}</h1>
        </div>
        <button 
          form="edit-profile-form"
          disabled={isSaving}
          className="text-primary font-bold hover:underline disabled:opacity-50"
        >
          {isSaving ? t('common.loading') : t('common.save')}
        </button>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        {/* Profile Picture Upload */}
        <section className="flex flex-col items-center mb-10">
          <div className="relative group">
            <div className="absolute inset-0 signature-gradient rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative z-10 w-32 h-32 rounded-full border-4 border-surface-container-lowest shadow-lg overflow-hidden">
              <img 
                src={formData.avatar} 
                alt="User" 
                className="w-full h-full object-cover" 
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="animate-spin text-white" size={24} />
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              className="hidden"
              accept="image/*"
            />
              <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-1 right-1 z-20 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform hover:bg-primary-dim"
            >
              <Camera size={20} />
            </button>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60 mt-4">{t('profile.tapToChange')}</p>
        </section>

        <form id="edit-profile-form" onSubmit={handleSave} className="space-y-8">
          {/* Basic Info */}
          <div className="space-y-6">
            <h3 className="text-sm font-black font-headline uppercase tracking-widest text-on-surface-variant px-1">{t('profile.basicInfo')}</h3>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-on-surface-variant ml-1">
                <User size={14} /> {t('profile.fullName')}
              </label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-on-surface-variant ml-1">
                @ {t('profile.username')}
              </label>
              <input 
                type="text" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-on-surface-variant ml-1">
                <Info size={14} /> {t('profile.bio')}
              </label>
              <textarea 
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-sm font-black font-headline uppercase tracking-widest text-on-surface-variant px-1">{t('profile.contactDetails')}</h3>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-on-surface-variant ml-1">
                <Mail size={14} /> {t('profile.email')}
              </label>
              <input 
                type="email" 
                value={formData.email}
                readOnly
                className="w-full bg-surface-container-low border border-outline-variant/10 rounded-2xl py-4 px-5 opacity-60 cursor-not-allowed outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-on-surface-variant ml-1">
                <Phone size={14} /> {t('profile.phone')}
              </label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-on-surface-variant ml-1">
                <MapPin size={14} /> {t('profile.location')}
              </label>
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
            </div>
          </div>
          
          {/* Privacy & GDPR */}
          <div className="space-y-6 mt-12 pt-8 border-t border-outline-variant/10">
            <h3 className="text-sm font-black font-headline uppercase tracking-widest text-on-surface-variant px-1 flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" />
              {t('profile.privacyData')}
            </h3>

            <div className="bg-surface-container-low/30 rounded-3xl p-6 border border-outline-variant/10 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold">{t('profile.exportData')}</p>
                  <p className="text-[10px] text-on-surface-variant font-bold leading-tight mt-1">{t('profile.exportDataDesc')}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    const data = JSON.stringify({ ...formData, createdAt: new Date().toISOString() }, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `user_data_${formData.username || 'profile'}.json`;
                    link.click();
                  }}
                  className="p-3 bg-surface-container-high rounded-2xl text-primary hover:bg-primary/10 transition-colors"
                >
                  <Download size={20} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 pt-4 border-t border-outline-variant/5">
                <div>
                  <p className="text-sm font-bold text-on-surface-variant">{t('profile.logoutAccount')}</p>
                  <p className="text-[10px] text-on-surface-variant font-bold leading-tight mt-1">{t('profile.logoutAccountDesc')}</p>
                </div>
                <button 
                  type="button"
                  onClick={async () => {
                    await signOut();
                    navigate('/login');
                  }}
                  className="p-3 bg-surface-container-high rounded-2xl text-on-surface-variant hover:bg-surface-container-highest transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 pt-4 border-t border-outline-variant/5">
                <div>
                  <p className="text-sm font-bold text-error">{t('profile.deleteAccount')}</p>
                  <p className="text-[10px] text-on-surface-variant font-bold leading-tight mt-1">{t('profile.deleteAccountDesc')}</p>
                </div>
                <button 
                  type="button"
                  onClick={async () => {
                    if (confirm(t('profile.deleteAccountConfirm'))) {
                      try {
                        const { data: { user: currentUser } } = await supabase.auth.getUser();
                        if (currentUser) {
                          await fetch('/api/delete-account', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId: currentUser.id })
                          });
                          await signOut();
                          alert('A sua conta foi eliminada permanentemente.');
                          navigate('/login');
                        }
                      } catch (err) {
                        alert('Erro ao eliminar a conta. Por favor contacte o suporte.');
                      }
                    }
                  }}
                  className="p-3 bg-error/10 rounded-2xl text-error hover:bg-error/20 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Success Overlay */}
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center border border-primary/10">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <Check size={40} />
              </div>
              <h4 className="text-xl font-black font-headline">{t('profile.updated')}</h4>
              <p className="text-on-surface-variant text-sm mt-1">{t('profile.updatedDesc')}</p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
