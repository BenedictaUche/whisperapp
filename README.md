# WhisperMap (whispr)

An anonymous location-based messaging platform where users can share whispers from nearby locations. Built with Next.js, TypeScript, and Supabase.

![WhisperMap Logo](./public/assets/images/anonymous-woman.png)

## Overview

WhisperMap is a revolutionary social platform that allows people to share anonymous messages, secrets, and thoughts with others in their vicinity. Whether it's a text whisper or a voice message, users can connect with their community while maintaining complete anonymity.

### Key Features

- **Anonymous Messaging**: Share thoughts without revealing your identity
- **Location-Based**: Discover whispers from people nearby (configurable radius)
- **Voice Whispers**: Record and share voice messages
- **Categories**: Organize whispers by topics (General, Questions, Confessions, etc.)
- **Interactive Engagement**: React with emojis and reply to whispers
- **User Profiles**: Track activity, earn badges, and maintain streaks
- **Content Moderation**: Built-in moderation system to maintain community standards
- **Dual Views**: Switch between map and list views for different experiences
- **Mobile-First**: Responsive design optimized for all devices
- **Real-Time Updates**: Live whisper feed and notifications

## Tech Stack

### Frontend
- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Maps**: Leaflet with React-Leaflet
- **Icons**: Lucide React

### Backend & Database
- **Backend-as-a-Service**: Supabase
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **File Storage**: Supabase Storage (for voice messages)


<!-- ## 🗄️ Database Schema

### Core Tables

#### `whispers`
Main table for storing anonymous messages.
```sql
- id: uuid (primary key)
- text: text (optional, max 280 chars)
- voice_url: text (optional, for voice messages)
- latitude: double precision
- longitude: double precision
- timestamp: timestamptz
- expire_at: timestamptz
- user_id: uuid (optional)
- category_id: uuid (references whisper_categories)
- is_moderated: boolean
- reply_count: integer
- reaction_count: integer
```

#### `whisper_categories`
Predefined categories for organizing whispers.
```sql
- id: uuid (primary key)
- name: text (unique)
- emoji: text
- color: text
- created_at: timestamptz
```

#### `user_profiles`
User statistics, preferences, and achievements.
```sql
- id: uuid (primary key)
- user_id: uuid (unique)
- whisper_count: integer
- reply_count: integer
- reaction_count: integer
- current_streak: integer
- max_streak: integer
- last_activity_date: date
- badges: jsonb
- preferences: jsonb (incognito_mode, location_radius, etc.)
- created_at: timestamptz
- updated_at: timestamptz
```

#### `whisper_reactions`
Emoji reactions to whispers.
```sql
- id: uuid (primary key)
- whisper_id: uuid (foreign key)
- user_id: uuid
- emoji: text
- created_at: timestamptz
```

#### `whisper_replies`
Threaded replies to whispers.
```sql
- id: uuid (primary key)
- whisper_id: uuid (foreign key)
- user_id: uuid
- anonymous_label: text
- text: text (optional)
- gif_url: text (optional)
- voice_url: text (optional)
- created_at: timestamptz
- expire_at: timestamptz
- is_moderated: boolean
```

### Supporting Tables

- `user_sessions`: Temporary anonymous labels for users
- `abuse_reports`: Content moderation reports -->

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd whisperapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Set up Supabase database**

   Run the migrations in order:
   ```bash
   # Connect to your Supabase project and run these SQL files:
   # 1. supabase/migrations/20250721195205_yellow_lake.sql
   # 2. supabase/migrations/20250722070347_long_sun.sql
   # 3. supabase/migrations/20250722110252_silent_frost.sql
   # 4. supabase/migrations/20250722111351_flat_base.sql
   ```

5. **Configure Supabase Auth**

   In your Supabase dashboard:
   - Enable email authentication
   - Configure site URL and redirect URLs
   - Set up any additional auth providers if needed

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

### For Users

1. **Sign Up/Login**: Create an account or sign in
2. **Grant Location Access**: Allow location permissions for nearby whispers
3. **Create Whispers**: Share text or voice messages
4. **Explore**: Browse whispers on the map or in list view
5. **Engage**: React with emojis or reply to whispers
6. **Customize**: Adjust location radius and preferences

### For Developers

#### Key Components

- **WhisperForm**: Handles whisper creation with text/voice input
- **MapView**: Interactive map displaying whispers as markers
- **WhisperList**: List view with infinite scroll
- **VoiceRecorder**: WebRTC-based voice recording
- **UserBadges**: Achievement system display

#### Custom Hooks

- `useWhispers`: Manages whisper data fetching and mutations
- `useLocation`: Handles geolocation and permissions
- `useUserProfile`: User profile and preferences management
- `useWhisperCategories`: Category management

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Design System

### Color Palette
- **Primary**: Pink/Purple gradients (#EC4899, #8B5CF6)
- **Secondary**: Cyan/Blue (#06B6D4, #3B82F6)
- **Neutral**: Dark theme with light accents

### Typography
- **Primary Font**: Space Grotesk (display)
- **Secondary Font**: Inter (body text)
- **Monospace**: JetBrains Mono (code)


## Security & Privacy

- **Anonymous by Design**: No personal information stored with whispers
- **Row Level Security**: Supabase RLS policies protect user data
- **Content Moderation**: Automated filtering and reporting system
- **Location Privacy**: Configurable radius and incognito mode
- **Data Encryption**: All data encrypted in transit and at rest

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

The app is compatible with any platform supporting Next.js:
- Netlify
- Railway
- Self-hosted with Docker

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing component patterns
- Add proper error handling
- Test on multiple devices/browsers
- Update documentation as needed
<!--
## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. -->


<!-- ## 📞 Support

For support, email support@whispermap.com or join our Discord community. -->

---

**Made with ❤️ for anonymous connections everywhere**
