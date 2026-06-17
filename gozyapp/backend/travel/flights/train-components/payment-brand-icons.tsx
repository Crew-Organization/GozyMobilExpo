import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

export type PaymentBrandKind =
  | 'bhim'
  | 'upi'
  | 'card'
  | 'clock'
  | 'bank'
  | 'wallet'
  | 'emi'
  | 'phonepe'
  | 'gpay'
  | 'paytm'
  | 'navi'
  | 'supermoney'
  | 'amazonpay'
  | 'mycash'
  | 'giftcard'
  | 'axis'
  | 'hdfc'
  | 'icici'
  | 'sbi'
  | 'kotak'
  | 'bajaj'
  | 'lazy'
  | 'idfc'
  | 'hsbc'
  | 'tvs'
  | 'au'
  | 'bandhan'
  | 'bob'
  | 'boi'
  | 'bom';

const remoteLogoByKind: Record<PaymentBrandKind, string> = {
  gpay: 'https://cashfreelogo.cashfree.com/assets_images/pg/upi/64/gpay.png',
  phonepe: 'https://cashfreelogo.cashfree.com/assets_images/pg/upi/64/phonepe.png',
  bhim: 'https://cashfreelogo.cashfree.com/assets_images/pg/upi/64/bhim.png',
  upi: 'https://www.google.com/s2/favicons?domain=npci.org.in&sz=128',
  paytm: 'https://cashfreelogo.cashfree.com/assets_images/pg/upi/64/paytm.png',
  amazonpay: 'https://cashfreelogo.cashfree.com/assets_images/pg/upi/64/amazonpay.png',
  axis: 'https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/axis.png',
  hdfc: 'https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/hdfc.png',
  icici: 'https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/icici.png',
  sbi: 'https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/sbi.png',
  kotak: 'https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/kotak.png',
  bajaj: 'https://www.google.com/s2/favicons?domain=bajajfinserv.in&sz=128',
  lazy: 'https://www.google.com/s2/favicons?domain=lazypay.in&sz=128',
  idfc: 'https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/idfc.png',
  hsbc: 'https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/hsbc.png',
  tvs: 'https://img.icons8.com/color/96/delivery.png',
  au: 'https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/au.png',
  bandhan: 'https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/bandhan.png',
  bob: 'https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/bob.png',
  boi: 'https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/boi.png',
  navi: 'https://www.google.com/s2/favicons?domain=navi.com&sz=128',
  supermoney: 'https://www.google.com/s2/favicons?domain=super.money&sz=128',
  mycash: 'https://img.icons8.com/color/96/money-bag-rupee.png',
  giftcard: 'https://img.icons8.com/color/96/gift-card.png',
  card: 'https://img.icons8.com/color/96/bank-cards.png',
  clock: 'https://img.icons8.com/color/96/future.png',
  bank: 'https://img.icons8.com/color/96/online-banking.png',
  wallet: 'https://img.icons8.com/color/96/wallet.png',
  emi: 'https://img.icons8.com/color/96/card-in-use.png',
  bom: 'https://cashfreelogo.cashfree.com/assets_images/pg/nb/64/bom.png',
};

export function PaymentBrandIcon({ kind, compact = false }: { kind: PaymentBrandKind; compact?: boolean }) {
  const size = compact ? 30 : 36;
  const remoteLogo = remoteLogoByKind[kind];

  if (remoteLogo) {
    return (
      <View style={[styles.remoteLogoWrap, { width: size, height: size, borderRadius: compact ? 8 : 10 }]}>
        <Image contentFit="contain" source={{ uri: remoteLogo }} style={styles.remoteLogoImage} />
      </View>
    );
  }

  return (
    <View style={[styles.brandCircle, { width: size, height: size, borderRadius: 10, backgroundColor: '#EFF6FF' }]}>
      <MaterialCommunityIcons
        color="#2563EB"
        name="credit-card-outline"
        size={compact ? 16 : 20}
      />
    </View>
  );
}



const styles = StyleSheet.create({
  brandBase: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  brandCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandSquare: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  remoteLogoWrap: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  remoteLogoImage: {
    width: '100%',
    height: '100%',
  },
  gpayPill: {
    width: 7,
    height: 18,
    borderRadius: 5,
    transform: [{ rotate: '32deg' }],
  },
  gpayBlue: {
    backgroundColor: '#4285F4',
  },
  gpayGreen: {
    backgroundColor: '#34A853',
    marginLeft: -6,
  },
  gpayYellow: {
    backgroundColor: '#FBBC05',
    marginLeft: -6,
  },
  gpayRed: {
    backgroundColor: '#EA4335',
    marginLeft: -6,
  },
  phonePeGlyph: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  bhimWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bhimText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#4B5563',
    letterSpacing: 0.4,
  },
  paytmText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0891B2',
    lineHeight: 11,
  },
  paytmTextDark: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1E3A8A',
    lineHeight: 11,
  },
  naviText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#4ADE80',
  },
  superMoneyText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  amazonPayText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FBBF24',
  },
  upiArrowMark: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upiArrowOrange: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 16,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#F97316',
    left: 2,
  },
  upiArrowGreen: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 13,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#16A34A',
    left: 8,
  },
  myCashText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#8A5E00',
  },
  giftCardText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  bankBadgeWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  axisGlyph: {
    fontSize: 22,
    fontWeight: '900',
    color: '#BE185D',
  },
  hdfcInner: {
    width: 18,
    height: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#1D4ED8',
  },
  iciciGlyph: {
    fontSize: 24,
    fontWeight: '900',
    color: '#B45309',
  },
  sbiKeyhole: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  kotakGlyph: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  bajajGlyph: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  lazyGlyph: {
    fontSize: 18,
    fontWeight: '900',
    color: '#DB2777',
  },
  idfcGlyph: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  hsbcGlyph: {
    fontSize: 18,
    fontWeight: '900',
    color: '#EF4444',
  },
  tvsGlyph: {
    fontSize: 9,
    fontWeight: '900',
    color: '#059669',
  },
  auGlyph: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  bandhanGlyph: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  bobGlyph: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  boiGlyph: {
    fontSize: 11,
    fontWeight: '900',
    color: '#9A3412',
  },
});
