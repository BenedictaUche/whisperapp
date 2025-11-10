'use client'

import { Compass, EarIcon, Headphones, Home, MessageSquare, Users, X, ChevronLeft, ChevronRight } from "lucide-react"
import { LocationRadiusControl } from "./LocationRadiusControl"
import { useState } from "react"

type SidebarProps = {
    activeItem: string
    onItemClick: (item: string) => void
    isOpen: boolean
    onClose: () => void
}

const Sidebar = ({ activeItem, onItemClick, isOpen, onClose }: SidebarProps) => {
  const [locationRadius, setLocationRadius] = useState(5)
  const [incognitoMode, setIncognitoMode] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'following', icon: Users, label: 'Following' },
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' }
  ]

  const topics = [
    '❤️ Relationships', '👨‍👩‍👧‍👦 Family', '😊 Friends', '💡 Self Help',
    '📚 Education', '📖 My Story', '🏳️‍🌈 LGBTQ+', '✨ Positive',
    '⛪ Religion', '💡 Tips', '💙 Self Care', '🆘 Need Help',
    '🎮 Gaming', '📝 Poetry', '👶 Parenting', '🎵 Music'
  ]

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-background border-r border-border overflow-y-auto z-50 transform transition-all duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${
        isCollapsed ? 'w-16' : 'w-64 lg:w-80'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 lg:p-6 ${isCollapsed ? 'px-3' : ''}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <EarIcon className="w-6 lg:w-8 h-6 lg:h-8 text-primary" />
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-foreground">WhisperMap</h1>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Collapse/Expand Button - Desktop Only */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>

            {/* Close Button - Mobile Only */}
            <button
              onClick={onClose}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`px-4 lg:px-6 ${isCollapsed ? 'px-3' : ''}`}>
          {!isCollapsed && (
            <p className="text-muted-foreground text-sm mb-6 lg:mb-8">Anonymous whispers from nearby</p>
          )}

          {/* Navigation */}
          <nav className="space-y-1 lg:space-y-2 mb-6 lg:mb-8">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onItemClick(item.id)
                  onClose()
                }}
                className={`w-full flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors ${
                  isCollapsed ? 'justify-center px-2' : 'text-sm lg:text-base'
                } ${
                  activeItem === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium truncate">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Location Controls */}
          {!isCollapsed && (
            <div className="mb-6 lg:mb-8">
              <LocationRadiusControl
                onRadiusChange={setLocationRadius}
                onIncognitoToggle={setIncognitoMode}
              />
            </div>
          )}

          {/* Topics */}
          {!isCollapsed && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Topics</h3>
              <div className="space-y-1">
                {topics.map(topic => (
                  <button
                    key={topic}
                    className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Sidebar
