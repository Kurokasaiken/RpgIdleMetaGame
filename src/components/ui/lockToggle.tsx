import React from 'react';
import { Lock, Unlock } from 'lucide-react';

interface LockToggleProps {
  locked: boolean;
  onToggle: () => void;
}

/**
 * LockToggle: pulsante che visualizza un lucchetto chiuso/aperto.
 */
export const LockToggle: React.FC<LockToggleProps> = ({ locked, onToggle }) => {
  return (
    <button onClick={onToggle} className="text-gray-600 hover:text-gray-800">
      {locked ? <Lock size={18} /> : <Unlock size={18} />}
    </button>
  );
};
