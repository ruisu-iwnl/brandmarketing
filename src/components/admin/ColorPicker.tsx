'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'

const ColorPicker: React.FC<any> = (props) => {
  const { path, field } = props
  const { value, setValue } = useField<string>({ path })
  const label = field?.label || field?.name;

  return (
    <div className="field-type text" style={{ marginBottom: '25px' }}>
      <div style={{ 
        marginBottom: '10px',
        fontSize: '13px',
        fontWeight: '700',
        color: 'var(--theme-text, #ffffff)', // Use theme variable if available
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        opacity: 0.8
      }}>
        {label}
      </div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        marginTop: '8px'
      }}>
        <div style={{
          position: 'relative',
          width: '45px',
          height: '45px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #ccc',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <input 
            type="color" 
            value={value || '#000000'} 
            onChange={(e) => setValue(e.target.value)}
            style={{
              position: 'absolute',
              top: '-10px',
              left: '-10px',
              width: '150%',
              height: '150%',
              border: 'none',
              padding: '0',
              cursor: 'pointer',
              background: 'none'
            }}
          />
        </div>
        <input 
          type="text"
          value={value || ''}
          onChange={(e) => setValue(e.target.value)}
          placeholder="#000000"
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '14px',
            fontFamily: 'monospace',
            backgroundColor: '#fff'
          }}
        />
      </div>
    </div>
  )
}

export default ColorPicker
