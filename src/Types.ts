export type UserRole = 'patron' | 'dj' | 'admin';
export type LocationType = {
  latitude:number;
  longitude:number;
  text?:string;
  short_name?:string;
  long_name?:string
}
export interface PlayMyJamProfile {
  role?: UserRole;
  userId?: string;
  appAdmin?: boolean;
  notificationToken?: string;
  clubId?: string;
  fname_lower?:string;
  subscriptionType?: 'credit' | 'premium';
  freePlays?: number;
  premiumActive?: boolean;
  premiumExpiry?: number;
  clubName?: string;
  operatingHours?: string;
  code?: number | string;
  acceptTerms?: boolean;
  password?: string;
  referredBy?: string;
  photos?: {
    photoId: number;
    url: string;
  }[];
  about?: string;
  rates?: string[];
  balance?: number;
  deleted?: boolean;
  address?: LocationType;
  geoHash?: string;
  fname?: string;
  phoneNumber?: string;
  avatar?: string;
  isVerified?: boolean;
  date?: number;
  image?: string;
  email?: string;
  djInfo?: DJ
  privacy?:PrivacyType[]
}
export type PrivacyType = {
  type:string;
  selected:boolean;
  amount?:number;
  value?:string;
  subscriptions?:string[];
}
export interface DJ extends Omit<PlayMyJamProfile, 'genres'> {
    name: string;
    djName: string;
    bio: string;
    avatar: string;
    listeners: number;
    genres: string[];
    contactInfo: {
        phone: string;
        email: string;
    };
    socialLinks: {
        instagram: string;
        soundcloud: string;
        spotify: string;
    };
    clubName?: string;
    clubId?:string;
    time?: string;
    endTime?: string;
    active?:boolean;
    venues?: Array<{
        clubId: string;
        clubName: string;
        startTime: string;
        endTime: string;
        isConfirmed: boolean;
        confirmedByClub: boolean;
        addedAt: string;
    }>;
    availability: {
        days: string[];
        hours: {
            start: string;
            end: string;
        };
    };
};

export interface BaseSong {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  url: string;
  currentBid?: number;
  currentBiders?: {userId:string,amount:number}[];
  active?: boolean;
  isLocal?: boolean;
  audioUrl?: string;
  ownerId?: string;
  ownerName?: string;
  playCount?: number;
  uploadProgress?: number;
  DJCurrentSong?: boolean;
  action: 'play' | 'pause' | 'stop';
  isPlaying:boolean;
  uploadStatus?: 'idle' | 'uploading' | 'completed' | 'failed';
  currentPosition?: number;
  ownershipLink?:string;
  originalTrackId?:string;
  fingerprint?:string;
  isOwnershipApproved?:boolean;
}

export interface Song extends BaseSong {
  duration: number;
  freePlays?:number;
  premiumPlays?:number;
  creditPlays?:number;
  creditPlaysClaimed?:number;
  premiumPlaysClaimed?:number;
  premiumPlaysLastClaimedDate?:number;
}