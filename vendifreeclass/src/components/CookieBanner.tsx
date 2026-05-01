import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';

export default function CookieBanner() {
  const { t } = useSettings();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-[100] max-w-xl mx-auto"
        >
          <div className="bg-white rounded-[2rem] shadow-2xl p-6 border border-primary/10 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
              <Cookie size={24} />
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm font-bold leading-tight">
                {t('cookies.desc')}
                <Link to="/cookies" className="text-primary hover:underline ml-1">{t('cookies.learnMore')}</Link>
              </p>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={handleReject}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-sm hover:bg-surface-container-high transition-colors"
              >
                {t('cookies.reject')}
              </button>
              <button 
                onClick={handleAccept}
                className="flex-1 sm:flex-none px-6 py-3 bg-primary text-white rounded-xl font-black text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
              >
                {t('cookies.accept')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
