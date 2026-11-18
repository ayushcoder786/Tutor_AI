import { useEffect, useRef } from 'react';
import {AlertTriangle, CheckCircle, Info, X, XCircle} from 'lucide-react';
import './MessageBox.css';

const MessageBox = ({type = 'info', title, message, onConfirm, onCancel, confirmText = 'OK', cancelText = 'Cancel'}) => {
  
  const confirmButtonRef = useRef(null);

  useEffect(() => {
      confirmButtonRef.current?.focus();
  }, []);
  
  const icons = {
    success: <CheckCircle size={24} />,
    error: <XCircle size={24} />,
    warning: <AlertTriangle size={24} />,
    info: <Info size={24} />
  };

  const isConfirmation = Boolean(onConfirm && onCancel);
  const closeMessageBox = onCancel || onConfirm;

  return (
    <div className="messagebox-overlay msgBox">
      <div className={`messagebox ${type}`}>
        <button className="messagebox-close" onClick={closeMessageBox}>
          <X size={18} />
        </button>

        <div className="messagebox-icon">
          {icons[type]}
        </div>

        <div className="messagebox-content">
          <h3>{title}</h3>
          <p>{message}</p>
        </div>

        <div className="messagebox-actions">
          {isConfirmation && (
            <button className="messagebox-cancel" onClick={onCancel}>
              {cancelText}
            </button>
          )}

          <button ref={confirmButtonRef} className={`messagebox-confirm ${type}`} onClick={onConfirm || onCancel}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;