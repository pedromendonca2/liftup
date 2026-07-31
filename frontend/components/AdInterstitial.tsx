/** @deprecated Ads were removed from the offline-first product experience. */
export function useInterstitialAd() {
  return {
    loaded: false,
    showAd: () => undefined,
  };
}
