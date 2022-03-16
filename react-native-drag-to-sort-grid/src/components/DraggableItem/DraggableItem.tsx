import React, { useCallback, useRef } from "react";
import { ViewStyle } from "react-native";
import {
  LongPressGestureHandler,
  PanGestureHandler,
} from "react-native-gesture-handler";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Animated, {
  Easing,
  runOnJS,
  SharedValue,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  WithSpringConfig,
  withTiming,
} from "react-native-reanimated";
import Styles from "./styles";

type Props = {
  index: number;
  order: SharedValue<number[]>;
  itemWidth: number;
  itemHeight: number;
  margin: number;
  numPerRow: number;
  offsetX: number;
  offsetY: number;
  scrollRef: React.MutableRefObject<Animated.ScrollView | null>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setScrollEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  cancelEditing: () => void;
  renderItem: () => JSX.Element;
  deleteRenderItem: () => JSX.Element;
  deleteStyle?: ViewStyle;
};

const springConfig: WithSpringConfig = {
  damping: 15,
};

const LONG_PRESS_DURATION = 300;

function DraggableItem({
  index,
  order,
  itemWidth,
  itemHeight,
  margin,
  numPerRow,
  offsetX,
  offsetY,
  scrollRef,
  isEditing,
  setIsEditing,
  setScrollEnabled,
  cancelEditing,
  renderItem,
  deleteRenderItem,
  deleteStyle,
}: Props) {
  const isHeld = useSharedValue(false);
  const isMoving = useSharedValue(false);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const deleteScale = useSharedValue(0);

  const panRef = useRef(null);
  const longPressRef = useRef(null);

  function getPositionFromOrder() {
    "worklet";

    const orderPosition = order.value.findIndex((item) => item === index);

    const col = orderPosition % numPerRow;
    const row = Math.floor(orderPosition / numPerRow);

    const x = offsetX + (itemWidth + 2 * margin) * col + margin;
    const y = offsetY + (itemHeight + 2 * margin) * row + margin;
    return { x, y };
  }

  const activeX = useSharedValue(getPositionFromOrder().x);
  const activeY = useSharedValue(getPositionFromOrder().y);

  function clamp(value: number, min: number, max: number) {
    "worklet";

    return Math.min(Math.max(value, min), max);
  }

  function getOrderFromPosition(newX: number, newY: number) {
    "worklet";

    const centerX = newX + itemWidth / 2;
    const centerY = newY + itemHeight / 2;

    const col = Math.floor((centerX - offsetX) / (itemWidth + 2 * margin));
    const row = Math.floor((centerY - offsetY) / (itemHeight + 2 * margin));

    const clampedCol = clamp(col, 0, numPerRow - 1);
    const clampedRow = clamp(
      row,
      0,
      Math.floor((order.value.length - 1) / numPerRow)
    );

    return { col: clampedCol, row: clampedRow };
  }

  function getOrderPositionFromRowCol(row: number, col: number) {
    "worklet";

    const newOrderPosition = row * numPerRow + col;
    return clamp(newOrderPosition, 0, order.value.length - 1);
  }

  function rearrangeOrder(newOrderPosition: number) {
    "worklet";

    // First, find and remove index from order array
    const newOrder = order.value.filter((orderIndex) => orderIndex !== index);

    // Then, insert index at position specified by newIndex
    newOrder.splice(newOrderPosition, 0, index);

    // Finally, update order
    order.value = newOrder;
  }

  function handleRearrange(newX: number, newY: number) {
    "worklet";

    const { col, row } = getOrderFromPosition(newX, newY);
    const newOrderPosition = getOrderPositionFromRowCol(row, col);

    rearrangeOrder(newOrderPosition);
  }

  function holdAnimation(value: number) {
    "worklet";

    return withDelay(
      200,
      withTiming(value, {
        duration: LONG_PRESS_DURATION - 200,
        easing: Easing.inOut(Easing.quad),
      })
    );
  }

  function releaseAnimation(value: number) {
    "worklet";

    return withTiming(value, {
      duration: LONG_PRESS_DURATION,
      easing: Easing.inOut(Easing.quad),
    });
  }

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startX = activeX.value;
      ctx.startY = activeY.value;
    },
    onActive: (event, ctx) => {
      if (isHeld.value) {
        isMoving.value = true;
        const newX = ctx.startX + event.translationX;
        const newY = ctx.startY + event.translationY;

        activeX.value = newX;
        activeY.value = newY;

        handleRearrange(newX, newY);
      }
    },
    onEnd: (event, ctx) => {
      scale.value = releaseAnimation(1);
      if (isHeld.value) {
        const newX = ctx.startX + event.translationX;
        const newY = ctx.startY + event.translationY;

        activeX.value = newX;
        activeY.value = newY;

        handleRearrange(newX, newY);
      }

      runOnJS(setScrollEnabled)(true);
      isHeld.value = false;
      isMoving.value = false;
    },
  });

  function handleReposition() {
    "worklet";

    const { x, y } = getPositionFromOrder(); // TODO: Might need to pass order as a param
    activeX.value = withSpring(x, springConfig);
    activeY.value = withSpring(y, springConfig);
  }

  useAnimatedReaction(
    () => JSON.stringify(order.value),
    (result, previous) => {
      if (result !== previous && !isHeld.value) {
        handleReposition();
      }
    }
  );

  useAnimatedReaction(
    () => isHeld.value,
    (result, previous) => {
      if (result !== previous) {
        handleReposition();
      }
    }
  );

  useAnimatedReaction(
    () => isEditing,
    (result, previous) => {
      const cycleTime = 150;
      const distance = 1.5;
      if (result && !previous) {
        rotation.value = withSequence(
          withTiming(-distance, { duration: cycleTime / 2 }),
          withRepeat(withTiming(distance, { duration: cycleTime }), 0, true)
        );
        deleteScale.value = withSpring(1, { damping: 12, mass: 1 });
      } else if (!result && previous) {
        rotation.value = withTiming(0, { duration: cycleTime / 2 });
        deleteScale.value = withTiming(0, {
          duration: 200,
          easing: Easing.out(Easing.quad),
        });
      }
    }
  );

  const triggerHapticFeedback = useCallback(() => {
    ReactNativeHapticFeedback.trigger("impactMedium");
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: activeX.value,
      },
      {
        translateY: activeY.value,
      },
      {
        scale: scale.value,
      },
      {
        rotateZ: `${rotation.value}deg`,
      },
    ],
    zIndex: isHeld.value ? 1 : 0,
  }));

  const deleteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: deleteScale.value,
      },
    ],
  }));

  return (
    <PanGestureHandler
      simultaneousHandlers={[scrollRef, longPressRef]}
      ref={panRef}
      onGestureEvent={eventHandler}
    >
      <Styles.AnimatedView
        style={[{ width: itemWidth, height: itemHeight }, animatedStyle]}
      >
        <LongPressGestureHandler
          maxDist={20}
          minDurationMs={LONG_PRESS_DURATION}
          onBegan={() => {
            scale.value = holdAnimation(1.05);
          }}
          onFailed={() => {
            scale.value = releaseAnimation(1);
          }}
          onActivated={() => {
            triggerHapticFeedback();
            setIsEditing(true);
            setScrollEnabled(false);
            isHeld.value = true;
          }}
          onEnded={() => {
            if (!isMoving.value) {
              isHeld.value = false;
            }
            scale.value = releaseAnimation(1);
          }}
          ref={longPressRef}
          simultaneousHandlers={[scrollRef, panRef]}
        >
          <Styles.InnerAnimatedView
            style={{
              width: itemWidth,
              height: itemHeight,
            }}
          >
            <Styles.Content>{renderItem()}</Styles.Content>
            {isEditing ? (
              <Styles.CancelPressable onPress={cancelEditing} />
            ) : null}
          </Styles.InnerAnimatedView>
        </LongPressGestureHandler>
        <Styles.AnimatedDeleteView style={[deleteStyle, deleteAnimatedStyle]}>
          {deleteRenderItem()}
        </Styles.AnimatedDeleteView>
      </Styles.AnimatedView>
    </PanGestureHandler>
  );
}

export default DraggableItem;
