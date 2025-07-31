// Helper function to get status information with user-friendly explanations
const getStatusInfo = (status) => {
  const statusMap = {
    'CLEAR': {
      label: 'Active & Clear',
      color: '#059669',
      bgColor: '#dcfce7',
      icon: '✅',
      description: 'License is active and in good standing with no disciplinary actions'
    },
    'ACTIVE': {
      label: 'Active',
      color: '#059669', 
      bgColor: '#dcfce7',
      icon: '✅',
      description: 'License is currently active and valid'
    },
    'INACTIVE': {
      label: 'Inactive',
      color: '#dc2626',
      bgColor: '#fee2e2',
      icon: '⚠️',
      description: 'License is currently inactive - contractor may not perform work'
    },
    'SUSPENDED': {
      label: 'Suspended',
      color: '#dc2626',
      bgColor: '#fee2e2', 
      icon: '🚫',
      description: 'License is suspended - contractor is prohibited from working'
    },
    'REVOKED': {
      label: 'Revoked',
      color: '#dc2626',
      bgColor: '#fee2e2',
      icon: '❌',
      description: 'License has been revoked - contractor cannot legally operate'
    },
    'EXPIRED': {
      label: 'Expired',
      color: '#dc2626',
      bgColor: '#fee2e2',
      icon: '⏰',
      description: 'License has expired and needs to be renewed'
    },
    'PENDING': {
      label: 'Pending',
      color: '#d97706',
      bgColor: '#fef3c7',
      icon: '⏳',
      description: 'License application is pending review'
    }
  }

  // Handle null, undefined, or empty status
  if (!status || status.trim() === '') {
    return {
      label: 'Status Unknown',
      color: '#6b7280',
      bgColor: '#f3f4f6',
      icon: '❓',
      description: 'License status information is not available'
    }
  }

  // Return mapped status or default for unknown statuses
  return statusMap[status.toUpperCase()] || {
    label: status,
    color: '#6b7280',
    bgColor: '#f3f4f6', 
    icon: '❓',
    description: 'License status information needs verification'
  }
}

// Component for displaying status badge with tooltip
const StatusBadge = ({ status, showTooltip = false, size = 'normal' }) => {
  const statusInfo = getStatusInfo(status)
  
  const badgeStyle = {
    background: statusInfo.bgColor,
    color: statusInfo.color,
    padding: size === 'small' ? '0.25rem 0.5rem' : '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: size === 'small' ? '0.75rem' : '0.8rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    cursor: showTooltip ? 'help' : 'default',
    title: showTooltip ? statusInfo.description : undefined
  }

  return (
    <span style={badgeStyle}>
      <span>{statusInfo.icon}</span>
      <span>{statusInfo.label}</span>
    </span>
  )
}

export {
  getStatusInfo,
  StatusBadge
}