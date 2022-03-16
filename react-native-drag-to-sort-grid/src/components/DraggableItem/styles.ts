import Animated from "react-native-reanimated";
import styled from "styled-components/native";

const Styles = {
  AnimatedView: styled(Animated.View)`
    position: absolute;
    justify-content: center;
    align-items: center;
  `,
  InnerAnimatedView: styled(Animated.View)``,
  Content: styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
  `,
  CancelPressable: styled.Pressable`
    position: absolute;
    width: 100%;
    height: 100%;
  `,
  AnimatedDeleteView: styled(Animated.View)`
    position: absolute;
  `,
};

export default Styles;
