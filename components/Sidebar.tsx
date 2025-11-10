import { Compass, EarIcon, Headphones, Home, MessageSquare, Users, X } from "lucide-react";
import { LocationRadiusControl } from "./LocationRadiusControl";
import { useState } from "react";

type SidebarProps = {
    activeItem: string;
    onItemClick: (item: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ activeItem, onItemClick, isOpen, onClose }: SidebarProps) => {
  const [locationRadius, setLocationRadius] = useState(5)
  const [incognitoMode, setIncognitoMode] = useState(false)

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'following', icon: Users, label: 'Following' },
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' }
  ];

  const topics = [
    '❤️ Relationships', '👨‍👩‍👧‍👦 Family', '😊 Friends', '💡 Self Help',
    '📚 Education', '📖 My Story', '🏳️‍🌈 LGBTQ+', '✨ Positive',
    '⛪ Religion', '💡 Tips', '💙 Self Care', '🆘 Need Help',
    '🎮 Gaming', '📝 Poetry', '👶 Parenting', '🎵 Music'
  ];

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
      <div className={`fixed left-0 top-0 h-full w-64 lg:w-80 bg-background border-r border-border p-4 lg:p-6 overflow-y-auto z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <EarIcon className="w-6 lg:w-8 h-6 lg:h-8 text-primary" />
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">WhisperMap</h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-muted-foreground text-sm mb-6 lg:mb-8">Anonymous whispers from nearby</p>

        <nav className="space-y-1 lg:space-y-2 mb-6 lg:mb-8">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onItemClick(item.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors text-sm lg:text-base ${
                activeItem === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Location Controls */}
        <div className="mb-6 lg:mb-8">
          <LocationRadiusControl
            onRadiusChange={setLocationRadius}
            onIncognitoToggle={setIncognitoMode}
          />
        </div>

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
      </div>
    </>
  );
  };
  export default Sidebar;
