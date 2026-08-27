import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, CheckCircle2, ShieldCheck, Trash2, ArrowUpRight, AlertCircle } from 'lucide-react';
import { TEAM_MEMBERS } from '../../data/teamData';

// Helper to resize/compress image client-side to crisp high-res 800x800 for optimal fast upload
function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image content'));
      img.onload = () => {
        const maxDim = 1000;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(reader.result as string);
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Use PNG if original is PNG to keep transparency, or JPEG at 0.92 quality
        const outputFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputFormat, 0.92);
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function TeamPhotoManager() {
  const [customImages, setCustomImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/team/images');
      if (res.ok) {
        const data = await res.json();
        const imagesMap = data || {};
        setCustomImages(imagesMap);
        try {
          localStorage.setItem('quorik_team_images', JSON.stringify(imagesMap));
        } catch (e) {}
      }
    } catch (err) {
      console.error('Failed to load team images:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileUpload = async (memberId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatusMessage({ type: 'error', text: 'Please select a valid image file (PNG, JPG, JPEG, WebP).' });
      setTimeout(() => setStatusMessage(null), 4000);
      return;
    }

    setUploadingId(memberId);
    try {
      // Process image client-side to ensure crisp display and fast transfer
      const processedDataUrl = await processImageFile(file);

      // Instant optimistic local update for instant feedback
      const optimisticUpdate = { ...customImages, [memberId]: processedDataUrl };
      setCustomImages(optimisticUpdate);
      try {
        localStorage.setItem('quorik_team_images', JSON.stringify(optimisticUpdate));
        window.dispatchEvent(new CustomEvent('quorik_team_images_updated', { detail: optimisticUpdate }));
      } catch (e) {}

      // Persist to server backend
      const res = await fetch('/api/team/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, imageData: processedDataUrl })
      });

      if (res.ok) {
        const result = await res.json();
        const finalUrl = result.url || processedDataUrl;
        const finalized = { ...customImages, [memberId]: finalUrl };
        setCustomImages(finalized);
        try {
          localStorage.setItem('quorik_team_images', JSON.stringify(finalized));
          window.dispatchEvent(new CustomEvent('quorik_team_images_updated', { detail: finalized }));
        } catch (e) {}

        const member = TEAM_MEMBERS.find(m => m.id === memberId);
        setStatusMessage({ 
          type: 'success', 
          text: `Successfully updated high-res photo for ${member?.name || memberId}! Active across the entire website.` 
        });
        setTimeout(() => setStatusMessage(null), 4500);
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Server rejected photo upload');
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to upload photo. Please try again.' });
      setTimeout(() => setStatusMessage(null), 4500);
      // Re-fetch to restore confirmed state
      fetchImages();
    } finally {
      setUploadingId(null);
      // Reset input value so re-selecting same file triggers onChange
      if (fileInputRefs.current[memberId]) {
        fileInputRefs.current[memberId]!.value = '';
      }
    }
  };

  const handleResetMember = async (memberId: string) => {
    const member = TEAM_MEMBERS.find(m => m.id === memberId);
    if (!confirm(`Reset photo for ${member?.name || memberId} back to official default?`)) return;

    try {
      setUploadingId(memberId);
      const res = await fetch(`/api/team/images/${memberId}`, { method: 'DELETE' });
      if (res.ok) {
        const updated = { ...customImages };
        delete updated[memberId];
        setCustomImages(updated);
        try {
          localStorage.setItem('quorik_team_images', JSON.stringify(updated));
          window.dispatchEvent(new CustomEvent('quorik_team_images_updated', { detail: updated }));
        } catch (e) {}
        setStatusMessage({ type: 'success', text: `Reset photo for ${member?.name} to official default.` });
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingId(null);
    }
  };

  const handleResetAll = async () => {
    if (!confirm('Are you sure you want to reset ALL council photos back to official system defaults?')) return;

    try {
      setLoading(true);
      const res = await fetch('/api/team/images/reset', { method: 'POST' });
      if (res.ok) {
        setCustomImages({});
        try {
          localStorage.removeItem('quorik_team_images');
          window.dispatchEvent(new CustomEvent('quorik_team_images_updated', { detail: {} }));
        } catch (e) {}
        setStatusMessage({ type: 'success', text: 'All team photos have been reset to official defaults.' });
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-brand-teal uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Admin-Only Management</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Leadership & Council Photo Manager
          </h3>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Upload custom PNG, JPG, or WebP portrait photos for each executive. Updates are instantly synchronized across the site.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchImages}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {Object.keys(customImages).length > 0 && (
            <button
              onClick={handleResetAll}
              className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-mono text-red-400 hover:text-red-300 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset All to Defaults</span>
            </button>
          )}
        </div>
      </div>

      {/* Notification Banner */}
      {statusMessage && (
        <div className={`p-4 rounded-xl font-mono text-xs flex items-center gap-2 border ${
          statusMessage.type === 'success' 
            ? 'bg-brand-teal/10 border-brand-teal/30 text-brand-teal' 
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Grid of Council Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEAM_MEMBERS.map((member) => {
          const hasCustom = !!customImages[member.id];
          const activeSrc = customImages[member.id] || member.image;
          const isUploading = uploadingId === member.id;

          return (
            <div
              key={member.id}
              className={`p-6 rounded-2xl bg-[#0A0E1A] border transition-all flex flex-col justify-between space-y-6 ${
                hasCustom 
                  ? 'border-brand-teal/50 shadow-lg shadow-brand-teal/10' 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                ref={el => { fileInputRefs.current[member.id] = el; }}
                onChange={e => handleFileUpload(member.id, e)}
                className="hidden"
              />

              <div className="space-y-4">
                {/* Member Identity */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-brand-teal/80 p-0.5 bg-[#05060A] shadow-md">
                      <img
                        key={activeSrc}
                        src={activeSrc}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // Fallback immediately to default image if custom fails
                          (e.target as HTMLImageElement).src = member.image;
                        }}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#05060A] border border-brand-teal flex items-center justify-center text-brand-teal text-[9px] font-mono font-bold">
                      0{member.order}
                    </div>
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-brand-teal font-semibold">
                        Seat 0{member.order}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white tracking-tight truncate">
                      {member.name}
                    </h4>
                    <p className="text-xs text-gray-400 font-mono truncate">
                      {member.displayRole}
                    </p>
                    <div className="pt-1">
                      {hasCustom ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-[10px] font-mono font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Custom Photo Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[10px] font-mono">
                          Official Default
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-400 bg-white/[0.02] p-3 rounded-xl border border-white/5 space-y-1">
                  <p className="font-mono text-[10px] uppercase text-gray-500">Badge & Strategic Scope</p>
                  <p className="text-gray-300 font-medium">{member.badge}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => {
                    if (fileInputRefs.current[member.id]) {
                      fileInputRefs.current[member.id]!.value = '';
                      fileInputRefs.current[member.id]!.click();
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-teal hover:bg-white text-[#05060A] font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-teal/10 cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Photo...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-3.5 h-3.5" />
                      <span>{hasCustom ? 'Change / Replace Photo' : 'Upload PNG / JPG Photo'}</span>
                    </>
                  )}
                </button>

                {hasCustom && (
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => handleResetMember(member.id)}
                    className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-gray-400 hover:text-red-400 text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset to Official Default</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
