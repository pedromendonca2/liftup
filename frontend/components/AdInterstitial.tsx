import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.select({
      ios: 'ca-app-pub-9259866383940251/7921407293',
      android: 'ca-app-pub-9259866383940251/7921407293',
    });

const interstitial = InterstitialAd.createForAdRequest(adUnitId!, {
  requestNonPersonalizedAdsOnly: false,
});

export function useInterstitialAd() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setLoaded(false);
        interstitial.load();
      }
    );

    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  const showAd = () => {
    if (loaded) {
      interstitial.show();
    }
  };

  return { loaded, showAd };
}
