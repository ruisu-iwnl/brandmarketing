'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCcw, Trash2, Rocket, CheckCircle2, AlertCircle } from 'lucide-react';

const Toolbox: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const runTool = async (name: string, endpoint: string) => {
    setLoading(name);
    setStatus(null);
    try {
      const response = await fetch(endpoint, { method: 'POST' });
      const data = await response.json();
      
      if (response.ok) {
        setStatus({ type: 'success', message: data.message || `${name} completed successfully!` });
      } else {
        throw new Error(data.error || 'Operation failed');
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(null);
    }
  };

  if (!mounted) return null;

  return (
    <div style={{
      padding: '2.5rem',
      backgroundColor: '#111111',
      border: '1px solid #222222',
      borderRadius: '4px',
      marginTop: '2rem',
      fontFamily: 'inherit'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '300', 
          color: '#ffffff', 
          margin: 0,
          letterSpacing: '0.02em',
          textTransform: 'uppercase'
        }}>
          Brand Intelligence
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#888888', marginTop: '0.5rem', fontWeight: '300' }}>
          Collection-wide administrative operations and analytics management.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        
        {/* Reset Tool */}
        <button 
          onClick={() => runTool('Reset', '/api/products/reset-analytics')}
          disabled={!!loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.25rem',
            backgroundColor: '#1a1a1a',
            border: '1px solid #222222',
            borderRadius: '2px',
            cursor: loading ? 'not-allowed' : 'pointer',
            textAlign: 'left',
            transition: 'all 0.3s ease',
            opacity: loading && loading !== 'Reset' ? 0.3 : 1,
            color: '#ffffff'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#DB2777'; e.currentTarget.style.backgroundColor = '#222222'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#222222'; e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
        >
          <div style={{ 
            color: '#DB2777'
          }}>
            <Trash2 size={22} strokeWidth={1.5} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: '400', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Grand Opening Reset</div>
            <div style={{ fontSize: '0.75rem', color: '#666666', marginTop: '2px' }}>Zero out all views & orders</div>
          </div>
          {loading === 'Reset' && <RefreshCcw size={16} style={{ marginLeft: 'auto', animation: 'spin 2s linear infinite' }} />}
        </button>

        {/* Migrate Tool */}
        <button 
          onClick={() => runTool('Sync', '/api/products/migrate')}
          disabled={!!loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.25rem',
            backgroundColor: '#1a1a1a',
            border: '1px solid #222222',
            borderRadius: '2px',
            cursor: loading ? 'not-allowed' : 'pointer',
            textAlign: 'left',
            transition: 'all 0.3s ease',
            opacity: loading && loading !== 'Sync' ? 0.3 : 1,
            color: '#ffffff'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#DB2777'; e.currentTarget.style.backgroundColor = '#222222'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#222222'; e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
        >
          <div style={{ 
            color: '#DB2777'
          }}>
            <Rocket size={22} strokeWidth={1.5} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: '400', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Collection Sync</div>
            <div style={{ fontSize: '0.75rem', color: '#666666', marginTop: '2px' }}>Re-sync data from local files</div>
          </div>
          {loading === 'Sync' && <RefreshCcw size={16} style={{ marginLeft: 'auto', animation: 'spin 2s linear infinite' }} />}
        </button>

        {/* Cleanup Tool */}
        <button 
          onClick={() => runTool('Cleanup', '/api/products/cleanup')}
          disabled={!!loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.25rem',
            backgroundColor: '#1a1a1a',
            border: '1px solid #222222',
            borderRadius: '2px',
            cursor: loading ? 'not-allowed' : 'pointer',
            textAlign: 'left',
            transition: 'all 0.3s ease',
            opacity: loading && loading !== 'Cleanup' ? 0.3 : 1,
            color: '#ffffff'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#DB2777'; e.currentTarget.style.backgroundColor = '#222222'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#222222'; e.currentTarget.style.backgroundColor = '#1a1a1a'; }}
        >
          <div style={{ 
            color: '#DB2777'
          }}>
            <RefreshCcw size={22} strokeWidth={1.5} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: '400', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Media Cleanup</div>
            <div style={{ fontSize: '0.75rem', color: '#666666', marginTop: '2px' }}>Remove orphaned/ghost files</div>
          </div>
          {loading === 'Cleanup' && <RefreshCcw size={16} style={{ marginLeft: 'auto', animation: 'spin 2s linear infinite' }} />}
        </button>

      </div>

      {status && (
        <div style={{ 
          marginTop: '2rem', 
          padding: '1.25rem', 
          borderRadius: '2px',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          backgroundColor: status.type === 'success' ? '#065f46' : '#7f1d1d',
          border: `1px solid ${status.type === 'success' ? '#059669' : '#b91c1c'}`,
          color: '#ffffff',
          fontSize: '0.875rem',
          fontWeight: '300'
        }}>
          {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {status.message}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

export default Toolbox;
