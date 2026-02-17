export interface SocialNetwork {
  id: string;
  name: string;
  icon: string;
  color: string;
  urlTemplate: string;
  placeholder: string;
}

const SOCIAL_NETWORKS: SocialNetwork[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'instagram',
    color: '#E1306C',
    urlTemplate: 'https://instagram.com/{username}',
    placeholder: 'username',
  },
  {
    id: 'twitter',
    name: 'X / Twitter',
    icon: 'twitter',
    color: '#000000',
    urlTemplate: 'https://x.com/{username}',
    placeholder: 'username',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'facebook',
    color: '#1877F2',
    urlTemplate: 'https://facebook.com/{username}',
    placeholder: 'username or profile ID',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'linkedin',
    color: '#0A66C2',
    urlTemplate: 'https://linkedin.com/in/{username}',
    placeholder: 'profile slug',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: 'github',
    color: '#333333',
    urlTemplate: 'https://github.com/{username}',
    placeholder: 'username',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'music',
    color: '#010101',
    urlTemplate: 'https://tiktok.com/@{username}',
    placeholder: 'username',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'youtube-play',
    color: '#FF0000',
    urlTemplate: 'https://youtube.com/@{username}',
    placeholder: 'channel name',
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    icon: 'snapchat-ghost',
    color: '#FFFC00',
    urlTemplate: 'https://snapchat.com/add/{username}',
    placeholder: 'username',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: 'whatsapp',
    color: '#25D366',
    urlTemplate: 'https://wa.me/{username}',
    placeholder: 'phone number (with country code)',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: 'telegram',
    color: '#26A5E4',
    urlTemplate: 'https://t.me/{username}',
    placeholder: 'username',
  },
];

export default SOCIAL_NETWORKS;