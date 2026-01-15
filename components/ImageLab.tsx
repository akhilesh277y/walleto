
import React, { useState, useRef } from 'react';
import { editImageWithGemini } from '../services/geminiService';
import { Icons } from '../constants.tsx';

const ImageLab: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImage(result);
        setHistory([result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) return;

    setLoading(true);
    setError(null);
    try {
      const editedBase64 = await editImageWithGemini(image, mimeType, prompt);
      setImage(editedBase64);
      setHistory(prev => [...prev, editedBase64]);
      setPrompt('');
    } catch (err: any) {
      setError(err.message || "Failed to edit image. Please check your prompt and try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetImage = () => {
    setImage(null);
    setHistory([]);
    setPrompt('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Visual Receipt & Image Lab</h3>
          <p className="text-slate-500 text-sm">Use AI to edit your financial documents or photos.</p>
        </div>
        {image && (
          <button 
            onClick={resetImage}
            className="text-xs font-semibold text-red-500 hover:text-red-600 uppercase tracking-tighter"
          >
            Clear All
          </button>
        )}
      </div>

      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-300 hover:bg-slate-50 transition-all group"
        >
          <div className="bg-indigo-50 p-4 rounded-full text-indigo-500 group-hover:scale-110 transition-transform mb-4">
            <Icons.ImagePlus />
          </div>
          <p className="text-slate-600 font-medium">Click to upload an image</p>
          <p className="text-slate-400 text-sm mt-1">PNG, JPG or WebP (Max 4MB)</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative group rounded-2xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50 flex items-center justify-center min-h-[300px]">
            <img 
              src={image} 
              alt="Workspace" 
              className="max-h-[500px] w-auto object-contain transition-opacity duration-300" 
            />
            {loading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-indigo-700 font-bold animate-pulse">Gemini is editing...</p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start space-x-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col space-y-3">
            <label className="text-sm font-semibold text-slate-700">Tell Gemini what to do:</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='e.g., "Add a warm vintage filter", "Highlight the total amount", "Enhance text"'
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
                disabled={loading}
              />
              <button
                onClick={handleEdit}
                disabled={loading || !prompt}
                className={`px-6 rounded-xl font-bold transition-all shadow-sm flex items-center space-x-2 ${
                  loading || !prompt 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
                }`}
              >
                <span>Process</span>
                {!loading && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {history.length > 1 && (
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Version History</p>
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                {history.map((h, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setImage(h)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      image === h ? 'border-indigo-500 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={h} alt={`v${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageLab;
