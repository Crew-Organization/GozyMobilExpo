import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import { useApp } from '@/src/context/app-context';
import { useSuperAppStore } from '@/src/store/super-app-store';
import { colors, radius, spacing } from '@/src/theme/tokens';
import {
  Header,
  GenderTabs,
  CategorySidebar,
  CategorySection,
  SearchModal,
} from '@/src/components/shopping-module/categories';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// LEFT SIDEBAR RAIL MOCK DATA
const sidebarCategories = [
  {
    id: 'men',
    label: "Men's Wear",
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'women',
    label: "Women's Wear",
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'kids',
    label: 'Kids Wear',
    image: 'https://images.unsplash.com/photo-1519457431-44cacac7a15a?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'footwear',
    label: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'beauty',
    label: 'Beauty & Grooming',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'home',
    label: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'accessories',
    label: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'jewellery',
    label: 'Jewellery',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'bags',
    label: 'Bags & Backpacks',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'gadgets',
    label: 'Smart Gadgets',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'luxe',
    label: 'Luxe Couture',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'activewear',
    label: 'Active Wear',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'sleepwear',
    label: 'Sleep & Innerwear',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=150&q=80',
  },
];

// RIGHT CONTENT AREA DETAILS MAP
const categoryDataMap: Record<string, any> = {
  men: {
    spotlight: [
      { label: 'Rising Stars', image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
      { label: 'Luxe Store', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'FWD Trend', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'House of Brands', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
      { label: 'Global Brands', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
    ],
    trending: [
      { label: 'Western Avenue', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Ethnic Alley', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80', productId: 'prod-w1' },
      { label: 'Men Casuals', image: 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
      { label: 'Gifting Store', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=150&q=80', productId: 'prod-b8' },
      { label: 'Korean Beauty', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=150&q=80', productId: 'prod-4' },
      { label: 'Sneaker Club', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
      { label: 'Gozy For Earth', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=150&q=80', productId: 'prod-b5' },
      { label: 'Derma Care', image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=150&q=80', productId: 'prod-b1' },
      { label: 'Indie Work', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=150&q=80', productId: 'prod-w2' },
      { label: 'Gozy Street', image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
    ],
    occasions: [
      { label: 'Office Wear', icon: 'tie', color: '#3182CE' },
      { label: 'Wedding Collection', icon: 'crown-outline', color: '#9C27B0' },
      { label: 'Vacation Wear', icon: 'beach', color: '#38A169' },
    ],
    brands: [
      { label: 'Nike', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
      { label: 'Vero Moda', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Gozy Studio', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
    ],
  },
  women: {
    spotlight: [
      { label: 'Rising Stars', image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=150&q=80', productId: 'prod-w3' },
      { label: 'Luxe Store', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=150&q=80', productId: 'prod-w4' },
      { label: 'FWD Trend', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=150&q=80', productId: 'prod-w4' },
      { label: 'House of Brands', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=150&q=80', productId: 'prod-w1' },
      { label: 'Global Brands', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80', productId: 'prod-w2' },
    ],
    trending: [
      { label: 'Western Avenue', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=150&q=80', productId: 'prod-w3' },
      { label: 'Ethnic Alley', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80', productId: 'prod-w1' },
      { label: 'Women Casuals', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', productId: 'prod-w4' },
      { label: 'Gifting Store', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=150&q=80', productId: 'prod-b8' },
      { label: 'Korean Beauty', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=150&q=80', productId: 'prod-4' },
      { label: 'Sneaker Club', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
      { label: 'Gozy For Earth', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=150&q=80', productId: 'prod-b5' },
      { label: 'Derma Care', image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=150&q=80', productId: 'prod-b1' },
      { label: 'Indie Work', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=150&q=80', productId: 'prod-w2' },
      { label: 'Gozy Street', image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
    ],
    occasions: [
      { label: 'Party Wear', icon: 'glass-cocktail', color: '#E53E3E' },
      { label: 'Festive Wear', icon: 'firework', color: '#D69E2E' },
      { label: 'College Essentials', icon: 'notebook-outline', color: '#4A5568' },
    ],
    brands: [
      { label: 'Berrylush', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
      { label: 'Miss Chase', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Lino Perros', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=150&q=80', productId: 'prod-4' },
    ],
  },
  kids: {
    spotlight: [
      { label: 'Kids Boutique', image: 'https://images.unsplash.com/photo-1519457431-44cacac7a15a?auto=format&fit=crop&w=150&q=80', productId: 'prod-k1' },
      { label: 'Play Wear', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=150&q=80', productId: 'prod-k2' },
    ],
    trending: [
      { label: 'Toddler Shop', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=150&q=80', productId: 'prod-k3' },
      { label: 'School Active', image: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=150&q=80', productId: 'prod-k4' },
    ],
    occasions: [
      { label: 'Birthday Special', icon: 'cake-variant', color: '#EC4899' },
      { label: 'Casual Outings', icon: 'walk', color: '#3B82F6' },
    ],
    brands: [
      { label: 'H&M Kids', image: 'https://images.unsplash.com/photo-1519457431-44cacac7a15a?auto=format&fit=crop&w=150&q=80', productId: 'prod-k1' },
      { label: 'Mothercare', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=150&q=80', productId: 'prod-k3' },
    ],
  },
  footwear: {
    spotlight: [
      { label: 'Sneaker Store', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
      { label: 'Running Shoes', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
      { label: 'Casual Loafers', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Sports Sandals', image: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
    ],
    trending: [
      { label: 'Formal Oxfords', image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
      { label: 'Flip Flops', image: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Heels & Wedges', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=150&q=80', productId: 'prod-w3' },
      { label: 'Boots & Chelsea', image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Ethnic Juttis', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80', productId: 'prod-4' },
    ],
    occasions: [
      { label: 'Athletic Sports', icon: 'run', color: '#10B981' },
      { label: 'Weekend Walks', icon: 'walk', color: '#3B82F6' },
      { label: 'Party Nights', icon: 'glass-cocktail', color: '#E53E3E' },
    ],
    brands: [
      { label: 'Nike', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
      { label: 'Puma', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
      { label: 'Adidas', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
    ],
  },
  beauty: {
    spotlight: [
      { label: 'Sunscreen Gel', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=150&q=80', productId: 'prod-b1' },
      { label: 'Strawberry Wash', image: 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?auto=format&fit=crop&w=150&q=80', productId: 'prod-b2' },
      { label: 'Eyeconic Eyeliner', image: 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=150&q=80', productId: 'prod-b3' },
      { label: 'Matte Lipstick', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=150&q=80', productId: 'prod-b4' },
      { label: 'Hair Serum', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=150&q=80', productId: 'prod-b5' },
    ],
    trending: [
      { label: 'Rosemary Oil', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=150&q=80', productId: 'prod-b5' },
      { label: 'Dewy Lotion', image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=150&q=80', productId: 'prod-b6' },
      { label: 'Vitamin C Serum', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80', productId: 'prod-b1' },
      { label: 'Korean Skincare', image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=150&q=80', productId: 'prod-b4' },
      { label: 'Face Masks', image: 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?auto=format&fit=crop&w=150&q=80', productId: 'prod-b2' },
      { label: 'Fragrance Store', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=150&q=80', productId: 'prod-b8' },
    ],
    occasions: [
      { label: 'Daily Care', icon: 'bottle-tonic-plus-outline', color: '#10B981' },
      { label: 'Party Glam', icon: 'star-outline', color: '#E53E3E' },
      { label: 'Self Care Sunday', icon: 'spa-outline', color: '#8B5CF6' },
    ],
    brands: [
      { label: 'Lakme India', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=150&q=80', productId: 'prod-b1' },
      { label: 'Plum Goodness', image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=150&q=80', productId: 'prod-b4' },
      { label: 'Maybelline', image: 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=150&q=80', productId: 'prod-b3' },
      { label: 'Soulflower', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=150&q=80', productId: 'prod-b5' },
    ],
  },
  home: {
    spotlight: [
      { label: 'Floral Sheets', image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=150&q=80', productId: 'prod-h1' },
      { label: 'Blackout Curtains', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=150&q=80', productId: 'prod-h2' },
      { label: 'Wall Art Frames', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&w=150&q=80', productId: 'prod-h5' },
      { label: 'Scented Candles', image: 'https://images.unsplash.com/photo-1602607616780-e1e5e4f9ecf0?auto=format&fit=crop&w=150&q=80', productId: 'prod-h3' },
    ],
    trending: [
      { label: 'Microfiber Pillow', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=150&q=80', productId: 'prod-h3' },
      { label: 'Ceramic Vase', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=150&q=80', productId: 'prod-h5' },
      { label: 'Bath Towels', image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=150&q=80', productId: 'prod-h1' },
      { label: 'Cushion Covers', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=150&q=80', productId: 'prod-h2' },
      { label: 'Indoor Plants', image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=150&q=80', productId: 'prod-h5' },
    ],
    occasions: [
      { label: 'Bed Linen', icon: 'home-variant-outline', color: '#F59E0B' },
      { label: 'Kitchen Essentials', icon: 'silverware-fork-knife', color: '#10B981' },
      { label: 'Decor Refresh', icon: 'palette-outline', color: '#8B5CF6' },
    ],
    brands: [
      { label: 'Home Living', image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=150&q=80', productId: 'prod-h1' },
      { label: 'SoftTouch', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=150&q=80', productId: 'prod-h3' },
      { label: 'Portico', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=150&q=80', productId: 'prod-h2' },
    ],
  },
  accessories: {
    spotlight: [
      { label: 'Smart Watches', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Premium Belts', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Ties & Cufflinks', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
    ],
    trending: [
      { label: 'Premium Sunglasses', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Hair Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80', productId: 'prod-w3' },
      { label: 'Phone Cases', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80', productId: 'prod-2' },
      { label: 'Scarves & Stoles', image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=150&q=80', productId: 'prod-w1' },
    ],
    occasions: [
      { label: 'Men Accessory', icon: 'watch', color: '#3B82F6' },
      { label: 'Women Accessory', icon: 'necklace', color: '#EC4899' },
    ],
    brands: [
      { label: 'Gozy Luxe', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Ray-Ban Style', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Titan Edge', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
    ],
  },
  jewellery: {
    spotlight: [
      { label: 'Fine Earrings', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80', productId: 'prod-4' },
      { label: 'Statement Rings', image: 'https://images.unsplash.com/photo-1515562141589-67f0d1f7f59d?auto=format&fit=crop&w=150&q=80', productId: 'prod-4' },
      { label: 'Gold Bangles', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=150&q=80', productId: 'prod-w1' },
    ],
    trending: [
      { label: 'Traditional Necklace', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80', productId: 'prod-4' },
      { label: 'Nose Pins', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=150&q=80', productId: 'prod-w1' },
      { label: 'Anklets & Toe Rings', image: 'https://images.unsplash.com/photo-1515562141589-67f0d1f7f59d?auto=format&fit=crop&w=150&q=80', productId: 'prod-4' },
      { label: 'Temple Jewellery', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80', productId: 'prod-w1' },
    ],
    occasions: [
      { label: 'Festive Gold', icon: 'crown-outline', color: '#D69E2E' },
      { label: 'Daily Wear', icon: 'diamond-stone', color: '#E53E3E' },
    ],
    brands: [
      { label: 'Jewel House', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80', productId: 'prod-4' },
      { label: 'Tanishq Style', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=150&q=80', productId: 'prod-w1' },
      { label: 'Malabar', image: 'https://images.unsplash.com/photo-1515562141589-67f0d1f7f59d?auto=format&fit=crop&w=150&q=80', productId: 'prod-4' },
    ],
  },
  bags: {
    spotlight: [
      { label: 'Leather Wallets', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=150&q=80', productId: 'prod-4' },
      { label: 'Tote Bags', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Travel Backpacks', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
    ],
    trending: [
      { label: 'Laptop Sleeves', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=150&q=80', productId: 'prod-4' },
      { label: 'Clutch Purses', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=150&q=80', productId: 'prod-w3' },
      { label: 'Gym Duffel Bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
      { label: 'Sling Bags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
    ],
    occasions: [
      { label: 'Travel Essentials', icon: 'bag-suitcase-outline', color: '#10B981' },
      { label: 'Work Bags', icon: 'briefcase-outline', color: '#3B82F6' },
    ],
    brands: [
      { label: 'Lino Perros', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=150&q=80', productId: 'prod-4' },
      { label: 'Baggit', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Wildcraft', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
    ],
  },
  gadgets: {
    spotlight: [
      { label: 'Smart Wearables', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80', productId: 'prod-2' },
      { label: 'Noise Earbuds', image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?auto=format&fit=crop&w=150&q=80', productId: 'prod-2' },
      { label: 'Power Banks', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=150&q=80', productId: 'prod-2' },
    ],
    trending: [
      { label: 'Bluetooth Speakers', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80', productId: 'prod-2' },
      { label: 'Fitness Bands', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=150&q=80', productId: 'prod-2' },
      { label: 'Gaming Headsets', image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?auto=format&fit=crop&w=150&q=80', productId: 'prod-2' },
      { label: 'Smart Home', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=150&q=80', productId: 'prod-2' },
    ],
    occasions: [
      { label: 'Tech Life', icon: 'cellphone', color: '#3B82F6' },
      { label: 'Gaming Zone', icon: 'gamepad-variant-outline', color: '#10B981' },
    ],
    brands: [
      { label: 'Waveform Tech', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80', productId: 'prod-2' },
      { label: 'Boat Audio', image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?auto=format&fit=crop&w=150&q=80', productId: 'prod-2' },
      { label: 'Noise India', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=150&q=80', productId: 'prod-2' },
    ],
  },
  luxe: {
    spotlight: [
      { label: 'Couture Dress', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Designer Sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80', productId: 'prod-w1' },
      { label: 'Premium Suits', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
    ],
    trending: [
      { label: 'Luxury Essential', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
      { label: 'Designer Watches', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Premium Fragrance', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=150&q=80', productId: 'prod-b8' },
      { label: 'Silk Collection', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80', productId: 'prod-w1' },
    ],
    occasions: [
      { label: 'Royal Wedding', icon: 'crown-outline', color: '#D69E2E' },
      { label: 'Black Tie Event', icon: 'bow-tie', color: '#1F2937' },
    ],
    brands: [
      { label: 'Gozy Luxe', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Vero Moda Premium', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Calvin Style', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
    ],
  },
  activewear: {
    spotlight: [
      { label: 'Sports Sneakers', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
      { label: 'Gym Vests', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Yoga Pants', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=150&q=80', productId: 'prod-w3' },
    ],
    trending: [
      { label: 'Active Tees', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Track Pants', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Sports Bras', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=150&q=80', productId: 'prod-w3' },
      { label: 'Running Shorts', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
    ],
    occasions: [
      { label: 'Gym Workout', icon: 'run', color: '#10B981' },
      { label: 'Morning Jog', icon: 'weather-sunny', color: '#F59E0B' },
    ],
    brands: [
      { label: 'Nike Active', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
      { label: 'Puma Fitness', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
      { label: 'HRX by Hrithik', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
    ],
  },
  sleepwear: {
    spotlight: [
      { label: 'Cotton PJs', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Silk Nightgowns', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=150&q=80', productId: 'prod-w3' },
      { label: 'Lounge Sets', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
    ],
    trending: [
      { label: 'Comfy Sleepsuits', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=150&q=80', productId: 'prod-k3' },
      { label: 'Boxers & Briefs', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Thermal Wear', image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Night Shorts', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=150&q=80', productId: 'prod-k3' },
    ],
    occasions: [
      { label: 'Night Lounge', icon: 'bed-double-outline', color: '#8B5CF6' },
      { label: 'Winter Cozy', icon: 'snowflake', color: '#3B82F6' },
    ],
    brands: [
      { label: 'Mothercare Sleep', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=150&q=80', productId: 'prod-k3' },
      { label: 'Jockey India', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
      { label: 'Enamor', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=150&q=80', productId: 'prod-w3' },
    ],
  },
};

// Default structures for other categories to keep them populated
const defaultCategoryData = {
  spotlight: [
    { label: "What's New", image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80', productId: 'prod-3' },
    { label: 'Hot Deals', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80', productId: 'prod-4' },
    { label: 'Budget Finds', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=150&q=80', productId: 'prod-1' },
  ],
  trending: [
    { label: 'Rising Stars', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80', productId: 'prod-2' },
  ],
  occasions: [
    { label: 'Daily Essentials', icon: 'shopping-outline', color: '#00BCD4' },
  ],
  brands: [
    { label: 'Waveform', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80', productId: 'prod-2' },
  ],
};

const shoppingBenefits = [
  { label: 'Free Delivery', icon: 'truck-delivery-outline', color: '#E6F4EA' },
  { label: 'Easy Returns', icon: 'swap-horizontal', color: '#EBF8FF' },
  { label: 'Cashback Offers', icon: 'cash-multiple', color: '#FFF4E5' },
  { label: 'Membership Benefits', icon: 'crown-outline', color: '#FAF5FF' },
];

const appUniverse = [
  { label: 'Rising Stars', icon: 'star-outline', color: '#F1F1F1' },
  { label: 'Premium Collection', icon: 'diamond-stone', color: '#F1F1F1' },
  { label: 'Exclusive Stores', icon: 'store-outline', color: '#F1F1F1' },
];

export default function CategoriesScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const { shoppingCart } = useSuperAppStore();
  const { setSelectedProduct } = useSuperAppStore();

  const [selectedGender, setSelectedGender] = useState<'ALL' | 'MEN' | 'WOMEN' | 'KIDS'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('men');
  const [searchVisible, setSearchVisible] = useState(false);

  const rightScrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Sync category selection from home screen circle taps
  useEffect(() => {
    if (params?.category) {
      const parsedCat = params.category.toLowerCase();
      // Match ID maps
      if (parsedCat.includes('beauty')) {
        setSelectedCategory('beauty');
      } else if (parsedCat.includes('accessories')) {
        setSelectedCategory('accessories');
      } else if (parsedCat.includes('home') || parsedCat.includes('living')) {
        setSelectedCategory('home');
      } else if (parsedCat.includes('footwear')) {
        setSelectedCategory('footwear');
      } else if (parsedCat.includes('gadget')) {
        setSelectedCategory('gadgets');
      } else if (parsedCat.includes('luxe')) {
        setSelectedCategory('luxe');
      } else if (parsedCat.includes('active') || parsedCat.includes('sports')) {
        setSelectedCategory('activewear');
      } else if (parsedCat.includes('sleep') || parsedCat.includes('inner')) {
        setSelectedCategory('sleepwear');
      } else if (parsedCat.includes('men')) {
        setSelectedCategory('men');
        setSelectedGender('MEN');
      } else if (parsedCat.includes('women')) {
        setSelectedCategory('women');
        setSelectedGender('WOMEN');
      } else if (parsedCat.includes('kids')) {
        setSelectedCategory('kids');
        setSelectedGender('KIDS');
      }
    }
  }, [params?.category]);

  const handleCategorySelect = (id: string) => {
    // Smooth transition trigger
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedCategory(id);
    // Auto scroll right container to top on category switch
    rightScrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const handleGridItemPress = (item: any) => {
    if (item.productId) {
      setSelectedProduct(item.productId);
      router.push('/product-detail');
    } else {
      // Dynamic route mapping to dynamic subcategory detail pages
      const slug = item.label.toLowerCase().replace(/\s+/g, '-');
      router.push({ pathname: '/category/[id]', params: { id: slug } } as any);
    }
  };

  const handleSearchSubmit = (query: string) => {
    // Seamless routing to product detail for mapped keywords
    if (query.toLowerCase().includes('shirt') || query.toLowerCase().includes('chase') || query.toLowerCase().includes('top')) {
      setSelectedProduct('prod-1');
    } else if (query.toLowerCase().includes('earbud') || query.toLowerCase().includes('noise') || query.toLowerCase().includes('tech')) {
      setSelectedProduct('prod-2');
    } else if (query.toLowerCase().includes('sneaker') || query.toLowerCase().includes('nike') || query.toLowerCase().includes('shoe')) {
      setSelectedProduct('prod-3');
    } else {
      setSelectedProduct('prod-4');
    }
    router.push('/product-detail');
  };

  // Get active data content
  const activeData = categoryDataMap[selectedCategory] || defaultCategoryData;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Sticky Header */}
      <Header
        title="Categories"
        onBack={() => router.back()}
        onSearchPress={() => setSearchVisible(true)}
        onWishlistPress={() => router.push('/wishlist')}
        onBagPress={() => router.push('/shopping-checkout')}
        cartCount={shoppingCart.length}
      />

      {/* Segmented Top Gender Tabs */}
      <GenderTabs
        activeTab={selectedGender}
        onTabChange={(tab) => {
          setSelectedGender(tab);
          // Sync left list active entry based on tab selections
          if (tab === 'MEN') handleCategorySelect('men');
          else if (tab === 'WOMEN') handleCategorySelect('women');
          else if (tab === 'KIDS') handleCategorySelect('kids');
          else handleCategorySelect('men'); // Default to men's on ALL
        }}
        onGridPress={() => handleCategorySelect('men')}
      />

      {/* Dual Split Scroll Layout */}
      <View style={styles.splitBody}>
        {/* Left Vertical sidebar (width 110px) */}
        <CategorySidebar
          items={sidebarCategories}
          selectedId={selectedCategory}
          onSelect={handleCategorySelect}
        />

        {/* Right main grid area */}
        <Animated.View style={[styles.rightContent, { opacity: fadeAnim }]}>
          <ScrollView
            ref={rightScrollRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.rightContentScroll}
          >
            {/* Spotlight section */}
            {activeData.spotlight && activeData.spotlight.length > 0 && (
              <CategorySection
                title="In The Spotlight"
                items={activeData.spotlight}
                onItemPress={handleGridItemPress}
                type="spotlight"
              />
            )}

            {/* Trending Stores section */}
            {activeData.trending && activeData.trending.length > 0 && (
              <CategorySection
                title="Trending Stores"
                items={activeData.trending}
                onItemPress={handleGridItemPress}
                type="trending"
              />
            )}

            {/* Occasions block */}
            {activeData.occasions && activeData.occasions.length > 0 && (
              <CategorySection
                title="Shop By Occasion"
                items={activeData.occasions}
                onItemPress={handleGridItemPress}
                type="occasions"
              />
            )}

            {/* Featured brands list */}
            {activeData.brands && activeData.brands.length > 0 && (
              <CategorySection
                title="Trending Brands"
                items={activeData.brands}
                onItemPress={handleGridItemPress}
                type="brands"
              />
            )}

            {/* App Universe block */}
            <CategorySection
              title="App Universe"
              items={appUniverse}
              onItemPress={handleGridItemPress}
              type="universe"
            />

            {/* Shopping Benefits block */}
            <CategorySection
              title="Shopping Benefits"
              items={shoppingBenefits}
              onItemPress={handleGridItemPress}
              type="benefits"
            />
          </ScrollView>
        </Animated.View>
      </View>

      {/* Floating search Modal */}
      <SearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        onSearch={handleSearchSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  splitBody: {
    flex: 1,
    flexDirection: 'row',
  },
  rightContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  rightContentScroll: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
});
