// keyboard detection used to determine whether to use autofocus on editable regions
// if the device doesn't have a physical keyboard, autofocusing will be avoided
// since focusing opens an annoying virtual keyboard on a device without a physical one

// (HEURISTIC)
// avoid virtualKeyboard on mobile devices or devices with touch-screen
const usesVirtualKeyboard =
  navigator.maxTouchPoints > 0 || navigator.userAgent.includes('Mobi');
export const shouldUseAutoFocus = !usesVirtualKeyboard;
