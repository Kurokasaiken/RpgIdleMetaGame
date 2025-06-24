import React, { useState, useRef, useEffect } from 'react';
import { useBalancerContext } from '@/core/BalancerContext';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  Upload, 
  Download, 
  Trash2, 
  ChevronDown, 
  Calendar, 
  FileText,
  FolderOpen,
  X,
  Clock,
  Info
} from 'lucide-react';

interface SnapshotInfo {
  name: string;
  timestamp: Date;
  statsCount: number;
  cardsCount: number;
}

export const SnapshotManager: React.FC = () => {
  const { 
    saveSnapshot, 
    loadSnapshot, 
    deleteSnapshot, 
    listSnapshotNames
  } = useBalancerContext();

  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [snapshotInfos, setSnapshotInfos] = useState<Record<string, SnapshotInfo>>({});
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carica le informazioni sui snapshot
  useEffect(() => {
    updateSnapshotInfos();
  }, []);

  const updateSnapshotInfos = () => {
    const names = listSnapshotNames();
    const infos: Record<string, SnapshotInfo> = {};
    
    names.forEach(name => {
      // Creiamo info di base senza getSnapshotInfo
      infos[name] = {
        name,
        timestamp: new Date(), // Potresti voler salvare questo dato quando crei lo snapshot
        statsCount: Object.keys(snapshotInfos).length || 0, // Placeholder
        cardsCount: 0 // Placeholder
      };
    });
    
    setSnapshotInfos(infos);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Devi inserire un nome per il snapshot');
      return;
    }

    setIsLoading(true);
    try {
      await saveSnapshot(name.trim());
      setName('');
      updateSnapshotInfos();
      
      // Feedback visivo di successo
      setTimeout(() => setIsLoading(false), 300);
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
      setIsLoading(false);
    }
  };

  const handleLoad = async () => {
    if (!selected) return;
    
    setIsLoading(true);
    try {
      await loadSnapshot(selected);
      setShowDropdown(false);
      setTimeout(() => setIsLoading(false), 300);
    } catch (error) {
      console.error('Errore durante il caricamento:', error);
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    
    if (confirm(`Eliminare lo snapshot "${selected}"?`)) {
      setIsLoading(true);
      try {
        await deleteSnapshot(selected);
        setSelected('');
        updateSnapshotInfos();
        setTimeout(() => setIsLoading(false), 300);
      } catch (error) {
        console.error('Errore durante l\'eliminazione:', error);
        setIsLoading(false);
      }
    }
  };

  const handleExportSnapshot = () => {
    if (!selected) return;
    
    // Implementa l'export dello snapshot come JSON
    const snapshotData = {
      name: selected,
      timestamp: new Date().toISOString(),
      // Aggiungi qui i dati dello snapshot
    };
    
    const dataStr = JSON.stringify(snapshotData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selected.replace(/\s+/g, '_')}_snapshot.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportSnapshot = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const snapshotData = JSON.parse(e.target?.result as string);
        // Implementa l'import dello snapshot
        console.log('Snapshot importato:', snapshotData);
        updateSnapshotInfos();
      } catch (error) {
        alert('Errore nell\'importazione del file');
      }
    };
    reader.readAsText(file);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const snapshots = listSnapshotNames();

  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-600 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Save size={16} className="text-gray-400" />
        <h3 className="text-sm font-semibold text-white">Gestione Snapshot</h3>
      </div>

      {/* Prima riga: Save */}
      <div className="flex items-center gap-2 mb-3">
        <input
          type="text"
          placeholder="Nome snapshot"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          className="bg-gray-700 text-white border border-gray-600 p-2 rounded-lg flex-1 focus:border-blue-500 focus:outline-none"
        />
        <Button 
          onClick={handleSave} 
          disabled={isLoading || !name.trim()}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
        >
          <Save size={16} className="mr-1" />
          Salva
        </Button>
      </div>

      {/* Seconda riga: Load, Delete, Import/Export */}
      <div className="flex items-center gap-2">
        {/* Load Dropdown */}
        <div className="relative flex-1">
          <Button
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={isLoading || snapshots.length === 0}
            className="w-full justify-between bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
          >
            <div className="flex items-center">
              <FolderOpen size={16} className="mr-2" />
              {selected || 'Seleziona snapshot...'}
            </div>
            <ChevronDown size={14} />
          </Button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-600 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
              <div className="p-2 border-b border-gray-600">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-300">
                    {snapshots.length} snapshot disponibili
                  </span>
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              
              {snapshots.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  <FileText size={24} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nessun snapshot salvato</p>
                </div>
              ) : (
                <div className="p-1">
                  {snapshots.map((snapshotName) => {
                    const info = snapshotInfos[snapshotName];
                    return (
                      <div
                        key={snapshotName}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selected === snapshotName 
                            ? 'bg-blue-600 text-white' 
                            : 'hover:bg-gray-700 text-gray-200'
                        }`}
                        onClick={() => {
                          setSelected(snapshotName);
                          setShowDropdown(false);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{snapshotName}</div>
                            {info && info.timestamp && (
                              <div className="flex items-center gap-3 mt-1 text-xs opacity-75">
                                <div className="flex items-center gap-1">
                                  <Clock size={12} />
                                  {formatDate(info.timestamp)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Info size={12} />
                                  {info.statsCount} stat, {info.cardsCount} card
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <Button 
          onClick={handleLoad} 
          disabled={!selected || isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
        >
          <Upload size={16} />
        </Button>

        <Button 
          onClick={handleDelete} 
          disabled={!selected || isLoading}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600"
        >
          <Trash2 size={16} />
        </Button>

        {/* Export Button */}
        <Button
          onClick={handleExportSnapshot}
          disabled={!selected || isLoading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
          title="Esporta snapshot"
        >
          <Download size={16} />
        </Button>

        {/* Import Button */}
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600"
          title="Importa snapshot"
        >
          <Upload size={16} />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportSnapshot}
          className="hidden"
        />
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="mt-3 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-400">Elaborazione...</span>
        </div>
      )}
    </div>
  );
};