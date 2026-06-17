export const trainAnnouncement =
  'TATKAL BOOKING TIP: Keep your Aadhaar verified profile active and load traveler details beforehand to complete tatkal checkouts under 30 seconds!';

export const trainPhotoAssets = {
  offerTracks: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&q=80',
  sponsoredTravel: 'https://images.unsplash.com/photo-1532186218683-1188339f4e24?w=600&q=80',
};

export const trainOffers = [
  {
    id: 'o1',
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&q=80',
    brandTitle: 'ZERO CONVENIENCE FEE',
    brandSubtitle: 'First Booking',
    badge: 'NEW USER',
    eyebrow: 'Limited Period Offer',
    title: 'Flat 100% OFF Convenience Fees',
    subtitle: 'Book your first train ticket with zero convenience charges',
  },
  {
    id: 'o2',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80',
    brandTitle: 'FEDERAL BANK',
    brandSubtitle: 'Upto 15% OFF',
    badge: 'BANK DEALS',
    eyebrow: 'Instant Cashback',
    title: 'Save on Tatkal & AC Classes',
    subtitle: 'Use Federal Bank Cards for additional savings of up to ₹250',
  },
  {
    id: 'o3',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    brandTitle: 'TATKAL PRIORITY',
    brandSubtitle: 'Guaranteed Refund',
    badge: 'HOT DEAL',
    eyebrow: 'Peace of Mind',
    title: 'Tatkal Cancel Protection',
    subtitle: 'Opt-in for free cancellation & secure full refunds on tatkal WL tickets',
  },
];

export const trainUserFeatures = [
  {
    id: 'f1',
    accent: ['#EBF4FF', '#D8ECFF'] as [string, string],
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80',
    imageStyle: 'bottomRight' as const,
    intro: 'Tatkal Master',
    eyebrow: 'Over 50L+ Tatkal Successes',
    eyebrowColor: '#0084FF',
    title: 'Pre-book Tatkal Autofill',
    subtitle: 'Fill passenger details, payment info & checkout instantaneously when the window opens.',
    cta: 'SETUP PROFILE',
  },
  {
    id: 'f2',
    accent: ['#EBFBFA', '#D6F7F5'] as [string, string],
    icon: 'lightning-bolt',
    iconBg: '#00A699',
    intro: 'Superfast PNR',
    eyebrow: '99% Confirmed Predictions',
    eyebrowColor: '#00A699',
    title: 'PNR Status & Prediction',
    subtitle: 'Track your seat status live, get predictive chance of waitlist confirmation and delay updates.',
    cta: 'CHECK STATUS',
  },
  {
    id: 'f3',
    accent: ['#F9F0FF', '#EFE0FF'] as [string, string],
    image: 'https://images.unsplash.com/photo-1553684208-5e796de3fe0e?w=500&q=80',
    imageStyle: 'right' as const,
    intro: 'Hot Meals Onboard',
    eyebrow: 'IRCTC Approved Partner',
    eyebrowColor: '#8244E1',
    title: 'Food on Train Delivery',
    subtitle: 'Order delicious, fresh hygiene-certified meals directly to your train seat from premium restaurants.',
    cta: 'ORDER MEAL',
  },
];

export const trainWhyBookCards = [
  {
    id: 'w1',
    leftTone: '#EBFBFA',
    iconColor: '#00A699',
    icon: 'shield-check',
    title: 'IRCTC Authorised booking partner offering fully verified tickets',
    showRupeeBadge: false,
  },
  {
    id: 'w2',
    leftTone: '#FFF0F2',
    iconColor: '#FF5A5F',
    icon: 'cash-back',
    title: 'Instant Refund on failures, ticket cancellations or tatkal failures',
    showRupeeBadge: true,
  },
  {
    id: 'w3',
    leftTone: '#EBF4FF',
    iconColor: '#0084FF',
    icon: 'customer-service',
    title: 'Dedicated 24/7 Priority support hotline directly inside app',
    showRupeeBadge: false,
  },
];
