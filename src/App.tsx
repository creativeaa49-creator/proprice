import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Settings, 
  FileText, 
  Eye, 
  Trash2, 
  Share2, 
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  Download,
  CheckCircle2,
  Package,
  User,
  DollarSign,
  Printer
} from 'lucide-react';
import { PriceList, PriceListItem, BusinessInfo } from './types';

// Initial default business info
const DEFAULT_BUSINESS_INFO: BusinessInfo = {
  name: 'Nama Bisnis Anda',
  email: 'kontak@bisnisanda.com',
  phone: '+62 812-3456-7890',
  website: 'www.bisnisanda.com',
  address: 'Jl. Sudirman No. 1, Jakarta Pusat, 10110',
};

export default function App() {
  const [view, setView] = useState<'dashboard' | 'editor' | 'preview'>('dashboard');
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('proprice_lists');
    if (saved) {
      try {
        setPriceLists(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load price lists', e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('proprice_lists', JSON.stringify(priceLists));
  }, [priceLists]);

  const activeList = priceLists.find(l => l.id === activeListId);

  const createNewList = () => {
    const newList: PriceList = {
      id: crypto.randomUUID(),
      title: 'Daftar Harga Layanan',
      description: 'Penawaran harga profesional untuk klien kami.',
      items: [],
      businessInfo: DEFAULT_BUSINESS_INFO,
      currency: 'IDR',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'draft',
      theme: 'modern',
    };
    setPriceLists([newList, ...priceLists]);
    setActiveListId(newList.id);
    setView('editor');
  };

  const deleteList = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this price list?')) {
      setPriceLists(priceLists.filter(l => l.id !== id));
      if (activeListId === id) setActiveListId(null);
    }
  };

  const updateActiveList = (updates: Partial<PriceList>) => {
    if (!activeListId) return;
    setPriceLists(priceLists.map(l => 
      l.id === activeListId ? { ...l, ...updates, updatedAt: Date.now() } : l
    ));
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans selection:bg-neutral-900 selection:text-white">
      <AnimatePresence mode="wait">
        {view === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-6xl mx-auto px-6 py-12"
          >
            <div className="flex justify-between items-end mb-12">
              <div>
                <h1 className="text-4xl font-serif font-medium tracking-tight text-neutral-900 mb-2">ProPrice</h1>
                <p className="text-neutral-500 font-medium italic">Buat dan bagikan daftar harga profesional Anda.</p>
              </div>
              <button
                onClick={createNewList}
                className="flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-full hover:bg-neutral-800 transition-all font-medium group shadow-lg shadow-neutral-200"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                Buat Price List Baru
              </button>
            </div>

            {priceLists.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-neutral-300">
                <div className="inline-flex p-6 bg-neutral-100 rounded-full mb-6">
                  <FileText className="text-neutral-400" size={40} />
                </div>
                <h2 className="text-2xl font-serif text-neutral-900 mb-2">Belum ada daftar harga</h2>
                <p className="text-neutral-500 mb-8 max-w-sm mx-auto">Mulai buat daftar harga pertama Anda untuk dibagikan ke klien secara profesional.</p>
                <button
                  onClick={createNewList}
                  className="text-neutral-900 font-semibold underline underline-offset-4 hover:text-neutral-600 transition-colors"
                >
                  Buat sekarang →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {priceLists.map((list) => (
                  <motion.div
                    layoutId={list.id}
                    key={list.id}
                    onClick={() => {
                      setActiveListId(list.id);
                      setView('editor');
                    }}
                    className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-neutral-900 transition-all cursor-pointer group flex flex-col h-full shadow-sm hover:shadow-md"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-neutral-100 rounded-lg text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                        <FileText size={20} />
                      </div>
                      <button 
                        onClick={(e) => deleteList(list.id, e)}
                        className="text-neutral-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <h3 className="text-xl font-serif font-medium text-neutral-900 mb-1">{list.title}</h3>
                    <p className="text-neutral-500 text-sm mb-6 line-clamp-2">{list.description || 'Tidak ada deskripsi.'}</p>
                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-neutral-100">
                      <span className="text-xs font-mono text-neutral-400">
                        {list.items.length} item • {new Intl.DateTimeFormat('id-ID', { month: 'short', day: 'numeric' }).format(list.updatedAt)}
                      </span>
                      <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${
                        list.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        {list.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {view === 'editor' && activeList && (
          <Editor 
            list={activeList} 
            onUpdate={updateActiveList} 
            onBack={() => setView('dashboard')}
            onPreview={() => setView('preview')}
          />
        )}

        {view === 'preview' && activeList && (
          <Preview 
            list={activeList} 
            onBack={() => setView('editor')} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Editor({ list, onUpdate, onBack, onPreview }: { 
  list: PriceList, 
  onUpdate: (updates: Partial<PriceList>) => void,
  onBack: () => void,
  onPreview: () => void
}) {
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemFeatures, setNewItemFeatures] = useState('');

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    
    const newItem: PriceListItem = {
      id: crypto.randomUUID(),
      name: newItemName,
      price: parseFloat(newItemPrice),
      description: newItemDesc,
      category: newItemCategory,
      features: newItemFeatures.split('\n').filter(f => f.trim() !== ''),
    };

    onUpdate({ items: [...list.items, newItem] });
    setNewItemName('');
    setNewItemPrice('');
    setNewItemDesc('');
    setNewItemCategory('');
    setNewItemFeatures('');
  };

  const removeItem = (id: string) => {
    onUpdate({ items: list.items.filter(i => i.id !== id) });
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-white">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-80 border-r border-neutral-200 p-6 flex flex-col h-full bg-neutral-50/50">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors mb-8 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Dashboard
        </button>

        <div className="space-y-8 overflow-y-auto pr-2">
          <section>
            <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-3 block">Informasi Umum</label>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-900 mb-1 block">Judul List</label>
                <input 
                  type="text" 
                  value={list.title}
                  onChange={e => onUpdate({ title: e.target.value })}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-neutral-900 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-900 mb-1 block">Deskripsi Singkat</label>
                <textarea 
                  value={list.description}
                  onChange={e => onUpdate({ description: e.target.value })}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-neutral-900 outline-none transition-all h-24 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-900 mb-1 block">Mata Uang</label>
                <select 
                   value={list.currency}
                   onChange={e => onUpdate({ currency: e.target.value })}
                   className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-neutral-900 outline-none transition-all"
                >
                  <option value="IDR">IDR (Rp)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </section>

          <section>
            <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-3 block">Detail Bisnis</label>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-900 mb-1 block">Nama Bisnis</label>
                <input 
                  type="text" 
                  value={list.businessInfo.name}
                  onChange={e => onUpdate({ businessInfo: { ...list.businessInfo, name: e.target.value } })}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-neutral-900 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-900 mb-1 block">Email Kontak</label>
                <input 
                  type="email" 
                  value={list.businessInfo.email}
                  onChange={e => onUpdate({ businessInfo: { ...list.businessInfo, email: e.target.value } })}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-neutral-900 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-900 mb-1 block">Situs Web</label>
                <input 
                  type="text" 
                  value={list.businessInfo.website}
                  onChange={e => onUpdate({ businessInfo: { ...list.businessInfo, website: e.target.value } })}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-neutral-900 outline-none transition-all"
                />
              </div>
            </div>
          </section>

          <section>
            <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-3 block">Aksi</label>
            <button 
              onClick={onPreview}
              className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white py-3 rounded-full hover:bg-neutral-800 transition-all font-medium text-sm shadow-md"
            >
              <Eye size={18} />
              Pratinjau & Bagikan
            </button>
          </section>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        <header className="p-6 border-b border-neutral-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-neutral-100 rounded-lg">
                <DollarSign size={20} className="text-neutral-900" />
             </div>
             <h2 className="font-serif text-xl font-medium">Price List Editor</h2>
          </div>
          <div className="flex gap-3">
            <span className="text-xs text-neutral-400 self-center hidden sm:block">Changes saved locally</span>
            <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 bg-neutral-50 rounded-full border border-neutral-200">
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
               Live Edit
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-10 max-w-4xl mx-auto w-full">
          {/* Add Item Form */}
          <form onSubmit={addItem} className="mb-12 p-8 bg-neutral-50 rounded-3xl border border-neutral-200 shadow-sm">
            <h3 className="font-serif text-lg mb-6 flex items-center gap-2">
              <Plus size={20} /> Tambah Layanan/Produk Baru
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 block">Nama Layanan</label>
                <input 
                  required
                  placeholder="misal: Jasa Desain Logo"
                  type="text" 
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-900/5 focus:border-neutral-900 transition-all"
                />
              </div>
              <div className="md:col-span-4">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 block">Harga ({list.currency})</label>
                <input 
                  required
                  placeholder="0"
                  type="number" 
                  value={newItemPrice}
                  onChange={e => setNewItemPrice(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-900/5 focus:border-neutral-900 transition-all font-mono"
                />
              </div>
              <div className="md:col-span-6">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 block">Kategori (Opsional)</label>
                <input 
                  placeholder="misal: Desain, Web, dll"
                  type="text" 
                  value={newItemCategory}
                  onChange={e => setNewItemCategory(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-900/5 focus:border-neutral-900 transition-all font-mono"
                />
              </div>
              <div className="md:col-span-6">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 block">Deskripsi Singkat Layanan</label>
                <input 
                   placeholder="Fitur yang didapat..."
                   type="text" 
                   value={newItemDesc}
                   onChange={e => setNewItemDesc(e.target.value)}
                   className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-900/5 focus:border-neutral-900 transition-all font-mono"
                />
              </div>
              <div className="md:col-span-12">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 block">Fitur / Apa yang didapat (Satu per baris)</label>
                <textarea 
                   placeholder="Misal:&#10;3x Revisi&#10;Kualitas 4K&#10;DOP & Lighting Included"
                   rows={4}
                   value={newItemFeatures}
                   onChange={e => setNewItemFeatures(e.target.value)}
                   className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-900/5 focus:border-neutral-900 transition-all font-mono text-sm resize-none"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="mt-8 bg-neutral-900 text-white px-8 py-4 rounded-xl hover:bg-neutral-800 transition-all font-semibold shadow-lg shadow-neutral-200 active:scale-95"
            >
              Tambahkan ke Daftar Harga
            </button>
          </form>

          {/* Current Items List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-xl">Daftar Item Saat Ini</h3>
              <span className="text-sm text-neutral-500">{list.items.length} item</span>
            </div>
            
            {list.items.length === 0 ? (
              <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
                  <Package className="mx-auto text-neutral-300 mb-4" size={32} />
                  <p className="text-neutral-500">Daftar harga masih kosong. Tambahkan item pertama di atas.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {list.items.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-white border border-neutral-100 rounded-2xl hover:border-neutral-200 hover:shadow-sm transition-all group"
                  >
                    <div className="flex gap-4 items-start">
                       <div className="mt-1 w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                          {item.category ? item.category[0].toUpperCase() : <FileText size={20} />}
                       </div>
                       <div>
                          <p className="font-bold text-neutral-900">{item.name}</p>
                          <p className="text-xs text-neutral-500">{item.description || 'Tidak ada deskripsi'}</p>
                          {item.category && <span className="text-[10px] font-mono uppercase bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-500 mt-1 inline-block">{item.category}</span>}
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <p className="font-mono font-bold text-lg text-neutral-900">
                         {formatCurrency(item.price, list.currency)}
                       </p>
                       <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Preview({ list, onBack }: { list: PriceList, onBack: () => void }) {
  const [activeTheme, setActiveTheme] = useState<'modern' | 'minimal' | 'formal'>('formal');

  const themes = {
    modern: 'font-sans',
    minimal: 'font-sans bg-white',
    formal: 'font-formal bg-white'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Action Bar */}
      <div className="no-print bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50 px-6 py-4 flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 py-2 px-4 rounded-full border border-neutral-200 hover:bg-neutral-50 font-medium transition-all"
          >
            <ChevronLeft size={18} /> Edit
          </button>
          <div className="h-6 w-[1px] bg-neutral-200 mx-2 hidden sm:block"></div>
          <div className="flex p-1 bg-neutral-100 rounded-full">
            {(['modern', 'minimal', 'formal'] as const).map(t => (
               <button 
                key={t}
                onClick={() => setActiveTheme(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTheme === t ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'
                }`}
               >
                 {t}
               </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 py-2 px-6 rounded-full bg-neutral-900 text-white font-semibold shadow-xl shadow-neutral-200 hover:bg-neutral-800 active:scale-95 transition-all"
          >
            <Printer size={18} /> Simpan sebagai PDF / Cetak
          </button>
        </div>
      </div>

      {/* The Actual Presentation */}
      <div className={`max-w-4xl mx-auto my-12 p-16 bg-white shadow-2xl rounded-3xl min-h-[1056px] print:shadow-none print:my-0 print:rounded-none print:p-12 ${themes[activeTheme]}`}>
        {/* Decorative Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-50 -z-10 rounded-bl-full opacity-50 print:hidden" />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-24 border-b border-neutral-100 pb-16">
          <div className="flex-1">
            <div className="mb-12 flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center text-white font-serif text-xl italic">
                {list.businessInfo.name[0]}
              </div>
              <div>
                <h2 className={`text-xl mb-0 tracking-tight leading-none ${activeTheme === 'formal' ? 'font-formal' : 'font-serif'}`}>{list.businessInfo.name}</h2>
                <p className="text-[9px] tracking-[0.3em] uppercase font-bold text-neutral-400 mt-1">Official Price Index</p>
              </div>
            </div>
            
            <h1 className={`text-7xl font-medium tracking-tighter mb-6 leading-[0.85] text-neutral-900 ${activeTheme === 'formal' ? 'font-formal' : 'font-serif'}`}>
              {list.title}
            </h1>
            <p className="text-neutral-500 max-w-sm text-lg leading-relaxed font-light">{list.description}</p>
          </div>
          
          <div className="md:text-right flex flex-col justify-end min-w-[200px]">
            <div className="space-y-4 text-sm text-neutral-600">
               <div className="space-y-1">
                 <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Hubungi Kami</p>
                 <p className="flex md:flex-row-reverse items-center gap-2">{list.businessInfo.email}</p>
                 <p className="flex md:flex-row-reverse items-center gap-2 font-mono text-xs tracking-tight">{list.businessInfo.website}</p>
                 <p className="flex md:flex-row-reverse items-center gap-2">{list.businessInfo.phone}</p>
               </div>
               <div className="pt-4 border-t border-neutral-100">
                 <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 mb-1">Tanggal Terbit</p>
                 <p className="text-neutral-900 font-medium">{new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(list.updatedAt)}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="space-y-20">
          {Object.entries(groupBy(list.items, 'category')).map(([category, items]) => (
            <div key={category} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-4 mb-10">
                <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-neutral-900 whitespace-nowrap">
                   {category || 'Layanan Utama'}
                </h3>
                <div className="h-[1px] w-full bg-neutral-200" />
                <span className="text-[10px] font-mono text-neutral-300 italic whitespace-nowrap">{items.length} Opsi</span>
              </div>
              
              <div className="grid gap-6">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-[1fr_auto] items-start gap-12 py-4 group hover:bg-neutral-50 transition-colors px-6 -mx-6 rounded-2xl">
                    <div className="space-y-1">
                      <h4 className={`text-2xl font-medium text-neutral-900 tracking-tight ${activeTheme === 'formal' ? 'font-formal' : 'font-serif'}`}>{item.name}</h4>
                      <p className="text-neutral-500 text-base max-w-xl leading-relaxed font-light">{item.description}</p>
                      
                      {item.features && item.features.length > 0 && (
                        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 border-t border-neutral-50 pt-4">
                          {item.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
                              <CheckCircle2 size={12} className="text-neutral-300" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="text-right pt-1">
                       <p className="font-mono text-3xl font-medium tracking-tighter text-neutral-900">
                         {formatCurrency(item.price, list.currency)}
                       </p>
                       <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-[0.2em] mt-1.5 flex items-center justify-end gap-1.5">
                          <CheckCircle2 size={10} className="text-green-500" /> Nett Price
                       </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Signature & T&C Area */}
        <div className="mt-40 grid md:grid-cols-2 gap-20">
           <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Syarat & Ketentuan</h4>
              <ul className="space-y-2 text-[11px] text-neutral-500 leading-relaxed italic pr-12">
                 <li>• Harga di atas adalah harga standar dan dapat berubah sewaktu-waktu.</li>
                 <li>• Penawaran ini berlaku selama 30 hari sejak tanggal diterbitkan.</li>
                 <li>• Pembayaran DP minimal 50% untuk memulai pengerjaan proyek.</li>
                 <li>• Harga belum termasuk pajak jika berlaku.</li>
              </ul>
           </div>
           
           <div className="md:text-right flex flex-col justify-end items-end space-y-8">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Disetujui Oleh,</p>
                <div className="h-24 w-48 border-b border-neutral-300 flex items-center justify-center italic text-neutral-300 text-sm">
                   Tanda Tangan Digital
                </div>
                <p className={`text-neutral-900 font-medium text-lg mt-4 ${activeTheme === 'formal' ? 'font-formal' : 'font-serif'}`}>{list.businessInfo.name}</p>
              </div>
           </div>
        </div>

        {/* Footer */}
        <footer className="mt-32 pt-12 border-t border-neutral-100 flex justify-between items-center">
            <div className="flex items-center gap-2 opacity-50">
               <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
               <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Dokumen Resmi Penawaran Harga</p>
            </div>
            <p className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">{list.id.slice(0,8).toUpperCase()}</p>
        </footer>
      </div>
      
      {/* Floating Share Button (Desktop) */}
      <div className="no-print fixed bottom-8 right-8 z-[100] group flex items-center gap-3">
         <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg pointer-events-none whitespace-nowrap shadow-2xl">
            Salin Link Publik
         </div>
         <button 
           onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link berhasil disalin ke clipboard!');
           }}
           className="w-14 h-14 bg-neutral-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-neutral-800 active:scale-95 transition-all outline-none"
         >
           <Share2 size={20} />
         </button>
      </div>
    </div>
  );
}

// Helper: Format Currency
function formatCurrency(amount: number, currency: string) {
  if (currency === 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Helper: Group By
function groupBy<T>(array: T[], key: string): { [key: string]: T[] } {
  return array.reduce((result, item) => {
    // @ts-ignore
    const group = item[key] || '';
    // @ts-ignore
    (result[group] = result[group] || []).push(item);
    return result;
  }, {} as { [key: string]: T[] });
}
