export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission === 'denied') {
    return false
  }

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

export const notifyNewWhisper = (distance: string) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification('New whisper nearby! 👻', {
      body: `Someone dropped a whisper ${distance}`,
      icon: '/whisper-icon.png',
      tag: 'whisper-notification',
      requireInteraction: false,
      silent: false,
      // vibrate: [200, 100, 200]
    })

    // Auto-close notification after 5 seconds
    setTimeout(() => notification.close(), 5000)
  }
}

export const showWhisperCreatedNotification = () => {
  if (Notification.permission === 'granted') {
    const notification = new Notification('Whisper dropped! ✨', {
      body: 'Your whisper has been shared anonymously',
      icon: '/whisper-icon.png',
      tag: 'whisper-created',
      requireInteraction: false,
      silent: false,
      // vibrate: [100, 50, 100]
    })

    // Auto-close notification after 3 seconds
    setTimeout(() => notification.close(), 3000)
  }
}
