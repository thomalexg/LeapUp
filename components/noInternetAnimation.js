import LottieView from 'lottie-react-native';
import React from 'react';

export default function NoInternetIndicator({ visible = false }) {
  if (!visible) return null;
  return (
    <LottieView
      autoPlay
      loop
      source={require('../assets/animations/internet.json')}
    />
  );
}
