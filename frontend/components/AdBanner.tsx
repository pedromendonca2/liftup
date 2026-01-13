import React from 'react';
import { Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : Platform.select({
      ios: 'ca-app-pub-9259866383940251/8938959582',
      android: 'ca-app-pub-9259866383940251/8938959582',
    });

export default function AdBanner() {
  return (
    <BannerAd
      unitId={adUnitId!}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: false,
      }}
    />
  );
}
