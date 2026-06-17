import * as React from 'react';
import {
  ViewProps,
  TextProps,
  TextInputProps,
  ActivityIndicatorProps,
  ScrollViewProps,
  ImageProps,
  TouchableOpacityProps,
  TouchableWithoutFeedbackProps,
  TouchableHighlightProps,
  PressableProps,
  SwitchProps,
  KeyboardAvoidingViewProps,
  RefreshControlProps,
  StatusBarProps,
  ModalProps,
  SafeAreaViewProps,
  ImageBackgroundProps,
} from 'react-native';

declare module 'react-native' {
  interface View extends React.Component<ViewProps> {}
  interface Text extends React.Component<TextProps> {}
  interface TextInput extends React.Component<TextInputProps> {}
  interface ActivityIndicator extends React.Component<ActivityIndicatorProps> {}
  interface ScrollView extends React.Component<ScrollViewProps> {}
  interface Image extends React.Component<ImageProps> {}
  interface TouchableOpacity extends React.Component<TouchableOpacityProps> {}
  interface TouchableWithoutFeedback extends React.Component<TouchableWithoutFeedbackProps> {}
  interface TouchableHighlight extends React.Component<TouchableHighlightProps> {}
  interface Pressable extends React.Component<PressableProps> {}
  interface Switch extends React.Component<SwitchProps> {}
  interface KeyboardAvoidingView extends React.Component<KeyboardAvoidingViewProps> {}
  interface RefreshControl extends React.Component<RefreshControlProps> {}
  interface StatusBar extends React.Component<StatusBarProps> {}
  interface Modal extends React.Component<ModalProps> {}
  interface SafeAreaView extends React.Component<SafeAreaViewProps> {}
  interface ImageBackground extends React.Component<ImageBackgroundProps> {}

  namespace Animated {
    interface AnimatedComponent<T extends React.ComponentType<any>> {
      children?: React.ReactNode;
      style?: any;
      [key: string]: any;
    }
  }
}

declare module 'react-native/Libraries/Image/AssetSourceResolver' {
  const content: any;
  export default content;
}
declare module '@react-native/assets-registry/registry' {
  const content: any;
  export default content;
}
declare module 'react-native/Libraries/Image/resolveAssetSource' {
  const content: any;
  export default content;
}
declare module 'invariant' {
  const content: any;
  export default content;
}

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      children?: React.ReactNode;
      style?: any;
    }
  }
}

