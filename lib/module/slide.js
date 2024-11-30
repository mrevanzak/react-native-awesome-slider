import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, withTiming, withRepeat, withSequence } from 'react-native-reanimated';
import { Bubble } from './ballon';
import { palette } from './theme/palette';
import { clamp } from './utils';
const formatSeconds = second => `${Math.round(second * 100) / 100}`;
const hitSlop = {
  top: 12,
  bottom: 12
};
export let HapticModeEnum = /*#__PURE__*/function (HapticModeEnum) {
  HapticModeEnum["NONE"] = "none";
  HapticModeEnum["STEP"] = "step";
  HapticModeEnum["BOTH"] = "both";
  return HapticModeEnum;
}({});
export let PanDirectionEnum = /*#__PURE__*/function (PanDirectionEnum) {
  PanDirectionEnum[PanDirectionEnum["START"] = 0] = "START";
  PanDirectionEnum[PanDirectionEnum["LEFT"] = 1] = "LEFT";
  PanDirectionEnum[PanDirectionEnum["RIGHT"] = 2] = "RIGHT";
  PanDirectionEnum[PanDirectionEnum["END"] = 3] = "END";
  return PanDirectionEnum;
}({});
const defaultTheme = {
  minimumTrackTintColor: palette.Main,
  maximumTrackTintColor: palette.Gray,
  cacheTrackTintColor: palette.DeepGray,
  bubbleBackgroundColor: palette.Main,
  bubbleTextColor: palette.White,
  heartbeatColor: palette.LightGray
};
export const Slider = /*#__PURE__*/memo(function Slider({
  bubble,
  bubbleContainerStyle,
  bubbleMaxWidth = 100,
  bubbleTextStyle,
  bubbleTranslateY = -25,
  bubbleWidth = 0,
  cache,
  containerStyle,
  disable = false,
  disableTapEvent = false,
  disableTrackFollow = false,
  hapticMode = 'none',
  isScrubbing,
  markStyle,
  markWidth = 4,
  maximumValue,
  minimumValue,
  onHapticFeedback,
  onSlidingComplete,
  onSlidingStart,
  onTap,
  onValueChange,
  panDirectionValue,
  panHitSlop = hitSlop,
  progress,
  renderContainer,
  renderBubble,
  renderThumb,
  renderMark,
  setBubbleText,
  sliderHeight = 5,
  step: propsStep,
  steps,
  stepTimingOptions = false,
  style,
  testID,
  theme,
  thumbScaleValue,
  thumbWidth = 15,
  snapToStep = true,
  activeOffsetX,
  activeOffsetY,
  failOffsetX,
  failOffsetY,
  heartbeat = false
}) {
  const step = propsStep || steps;
  const snappingEnabled = snapToStep && step;
  const bubbleRef = useRef(null);
  const isScrubbingInner = useSharedValue(false);
  const prevX = useSharedValue(0);
  const defaultThumbIndex = useMemo(() => {
    if (!snappingEnabled) {
      return 0;
    }
    const index = Math.round((progress.value - minimumValue.value) / (maximumValue.value - minimumValue.value) * step);
    return clamp(index, 0, step);
  }, [maximumValue, minimumValue, progress, snappingEnabled, step]);
  const thumbIndex = useSharedValue(defaultThumbIndex);
  const [sliderWidth, setSliderWidth] = useState(0);
  const width = useSharedValue(0);
  const thumbValue = useSharedValue(0);
  const bubbleOpacity = useSharedValue(0);
  const markLeftArr = useSharedValue([]);
  const isTriggedHaptic = useSharedValue(false);
  const _theme = {
    ...defaultTheme,
    ...theme
  };
  const sliderTotalValue = useDerivedValue(() => {
    'worklet';

    return maximumValue.value - minimumValue.value;
  }, []);
  const progressToValue = value => {
    'worklet';

    if (sliderTotalValue.value === 0) {
      return 0;
    }
    return (value - minimumValue.value) / sliderTotalValue.value * (width.value - thumbWidth);
  };
  const animatedSeekStyle = useAnimatedStyle(() => {
    let seekWidth = 0;
    // when you set step
    if (snappingEnabled && markLeftArr.value.length >= step) {
      seekWidth = markLeftArr.value[thumbIndex.value] + thumbWidth / 2;
    } else {
      seekWidth = progressToValue(progress.value) + thumbWidth / 2;
    }
    sliderTotalValue.value; // hack: force recompute styles when 'sliderTotalValue' changes

    return {
      width: snappingEnabled && stepTimingOptions ? withTiming(clamp(seekWidth, 0, width.value), stepTimingOptions) : clamp(seekWidth, 0, width.value)
    };
  }, [progress, minimumValue, maximumValue, width, markLeftArr]);
  const animatedThumbStyle = useAnimatedStyle(() => {
    let translateX = 0;
    // when you set step
    if (snappingEnabled && markLeftArr.value.length >= step) {
      translateX = stepTimingOptions ? withTiming(markLeftArr.value[thumbIndex.value], stepTimingOptions) : markLeftArr.value[thumbIndex.value];
    } else if (disableTrackFollow && isScrubbingInner.value) {
      translateX = clamp(thumbValue.value, 0, width.value ? width.value - thumbWidth : 0);
    } else {
      translateX = clamp(progressToValue(progress.value), 0, width.value ? width.value - thumbWidth : 0);
    }
    sliderTotalValue.value; // hack: force recompute styles when 'sliderTotalValue' change
    return {
      transform: [{
        translateX
      }, {
        scale: withTiming(thumbScaleValue ? thumbScaleValue.value : 1, {
          duration: 100
        })
      }]
    };
  }, [progress, minimumValue, maximumValue, width]);
  const animatedBubbleStyle = useAnimatedStyle(() => {
    let translateX = 0;
    // when set step
    if (snappingEnabled && markLeftArr.value.length >= step) {
      translateX = markLeftArr.value[thumbIndex.value] + thumbWidth / 2;
    } else {
      translateX = thumbValue.value + thumbWidth / 2;
    }
    return {
      opacity: bubbleOpacity.value,
      transform: [{
        translateY: bubbleTranslateY
      }, {
        translateX: snappingEnabled && stepTimingOptions ? withTiming(clamp(translateX, bubbleWidth / 2, width.value - bubbleWidth / 2), stepTimingOptions) : clamp(translateX, bubbleWidth / 2, width.value - bubbleWidth / 2)
      }, {
        scale: bubbleOpacity.value
      }]
    };
  }, [bubbleTranslateY, bubbleWidth, width]);
  const animatedCacheXStyle = useAnimatedStyle(() => {
    const cacheX = cache?.value && sliderTotalValue.value ? cache?.value / sliderTotalValue.value * width.value : 0;
    return {
      width: cacheX
    };
  }, [cache, sliderTotalValue, width]);
  const animatedHeartbeatStyle = useAnimatedStyle(() => {
    // Goes to one and zero continuously
    const opacity = heartbeat ? withSequence(withTiming(1, {
      duration: 1000
    }), withRepeat(withTiming(0, {
      duration: 1000
    }), -1, true)) : withTiming(0, {
      duration: 500
    });
    return {
      width: sliderWidth,
      opacity
    };
  }, [sliderWidth, heartbeat]);
  const onSlideAcitve = useCallback(seconds => {
    const bubbleText = bubble ? bubble?.(seconds) : formatSeconds(seconds);
    onValueChange?.(seconds);
    setBubbleText ? setBubbleText(bubbleText) : bubbleRef.current?.setText(bubbleText);
  }, [bubble, onValueChange, setBubbleText]);

  /**
   * convert Sharevalue to callback seconds
   * @returns number
   */
  const shareValueToSeconds = useCallback(() => {
    'worklet';

    if (snappingEnabled) {
      return clamp(minimumValue.value + thumbIndex.value / step * (maximumValue.value - minimumValue.value), minimumValue.value, maximumValue.value);
    } else {
      const sliderPercent = clamp(thumbValue.value / (width.value - thumbWidth), 0, 1);
      return minimumValue.value + clamp(sliderPercent * sliderTotalValue.value, 0, sliderTotalValue.value);
    }
  }, [maximumValue, minimumValue, sliderTotalValue, step, thumbIndex, thumbValue, thumbWidth, width, snappingEnabled]);
  /**
   * convert [x] position to progress
   * @returns number
   */
  const xToProgress = useCallback(x => {
    'worklet';

    if (snappingEnabled && markLeftArr.value.length >= step) {
      return markLeftArr.value[thumbIndex.value];
    } else {
      return minimumValue.value + x / (width.value - thumbWidth) * sliderTotalValue.value;
    }
  }, [markLeftArr, sliderTotalValue, step, thumbIndex, thumbWidth, width, minimumValue, snappingEnabled]);

  /**
   * change slide value
   */
  const onActiveSlider = useCallback(x => {
    'worklet';

    isScrubbingInner.value = true;
    if (isScrubbing) {
      isScrubbing.value = true;
    }
    if (snappingEnabled) {
      const index = markLeftArr.value.findIndex(item => item >= x);
      const arrNext = markLeftArr.value[index];
      const arrPrev = markLeftArr.value[index - 1];
      // Computing step boundaries
      const currentX = (arrNext + arrPrev) / 2;
      const thumbIndexPrev = thumbIndex.value;
      if (x - thumbWidth / 2 > currentX) {
        thumbIndex.value = index;
      } else {
        if (index - 1 === -1) {
          thumbIndex.value = 0;
        } else if (index - 1 < -1) {
          thumbIndex.value = step;
        } else {
          thumbIndex.value = index - 1;
        }
      }
      // Determine trigger haptics callback
      if (thumbIndexPrev !== thumbIndex.value && hapticMode === HapticModeEnum.STEP && onHapticFeedback) {
        runOnJS(onHapticFeedback)();
        isTriggedHaptic.value = true;
      } else {
        isTriggedHaptic.value = false;
      }
      runOnJS(onSlideAcitve)(shareValueToSeconds());
    } else {
      thumbValue.value = clamp(x, 0, width.value - thumbWidth);
      if (!disableTrackFollow) {
        progress.value = xToProgress(x);
      }
      // Determines whether the thumb slides to both ends
      if (x <= 0 || x >= width.value - thumbWidth) {
        if (!isTriggedHaptic.value && hapticMode === HapticModeEnum.BOTH && onHapticFeedback) {
          runOnJS(onHapticFeedback)();
          isTriggedHaptic.value = true;
        }
      } else {
        isTriggedHaptic.value = false;
      }
      runOnJS(onSlideAcitve)(shareValueToSeconds());
    }
  }, [disableTrackFollow, hapticMode, isScrubbing, isScrubbingInner, isTriggedHaptic, markLeftArr, onHapticFeedback, onSlideAcitve, progress, shareValueToSeconds, step, thumbIndex, thumbValue, thumbWidth, width, xToProgress, snappingEnabled]);
  const onGestureEvent = useMemo(() => {
    const gesture = Gesture.Pan().hitSlop(panHitSlop).onStart(() => {
      if (disable) {
        return;
      }
      isScrubbingInner.value = false;
      if (isScrubbing) {
        isScrubbing.value = true;
      }
      if (panDirectionValue) {
        panDirectionValue.value = PanDirectionEnum.START;
        prevX.value = 0;
      }
      if (onSlidingStart) {
        runOnJS(onSlidingStart)();
      }
    }).onUpdate(({
      x
    }) => {
      if (disable) {
        return;
      }
      if (panDirectionValue) {
        panDirectionValue.value = prevX.value - x > 0 ? PanDirectionEnum.LEFT : PanDirectionEnum.RIGHT;
        prevX.value = x;
      }
      bubbleOpacity.value = withSpring(1);
      onActiveSlider(x);
    }).onEnd(({
      x
    }) => {
      isScrubbingInner.value = false;
      if (disable) {
        return;
      }
      if (isScrubbing) {
        isScrubbing.value = false;
      }
      if (panDirectionValue) {
        panDirectionValue.value = PanDirectionEnum.END;
      }
      bubbleOpacity.value = withSpring(0);
      if (disableTrackFollow) {
        progress.value = xToProgress(x);
      }
      if (onSlidingComplete) {
        runOnJS(onSlidingComplete)(shareValueToSeconds());
      }
    });
    if (activeOffsetX) {
      gesture.activeOffsetX(activeOffsetX);
    }
    if (activeOffsetY) {
      gesture.activeOffsetY(activeOffsetY);
    }
    if (failOffsetX) {
      gesture.failOffsetX(failOffsetX);
    }
    if (failOffsetY) {
      gesture.failOffsetY(failOffsetY);
    }
    return gesture;
  }, [activeOffsetX, activeOffsetY, bubbleOpacity, disable, disableTrackFollow, failOffsetX, failOffsetY, isScrubbing, isScrubbingInner, onActiveSlider, onSlidingComplete, onSlidingStart, panDirectionValue, panHitSlop, prevX, progress, shareValueToSeconds, xToProgress]);
  const onSingleTapEvent = useMemo(() => Gesture.Tap().hitSlop(panHitSlop).onEnd(({
    x
  }, isFinished) => {
    if (onTap) {
      runOnJS(onTap)();
    }
    if (disable || disableTapEvent) {
      return;
    }
    if (isFinished) {
      onActiveSlider(x);
    }
    isScrubbingInner.value = true;
    if (isScrubbing) {
      isScrubbing.value = true;
    }
    bubbleOpacity.value = withSpring(0);
    if (onSlidingComplete) {
      runOnJS(onSlidingComplete)(shareValueToSeconds());
    }
  }), [bubbleOpacity, disable, disableTapEvent, isScrubbing, isScrubbingInner, onActiveSlider, onSlidingComplete, onTap, panHitSlop, shareValueToSeconds]);
  const gesture = useMemo(() => Gesture.Race(onSingleTapEvent, onGestureEvent), [onGestureEvent, onSingleTapEvent]);

  // setting markLeftArr
  useAnimatedReaction(() => {
    if (snappingEnabled) {
      return new Array(step + 1).fill(0).map((_, i) => {
        return Math.round(width.value * (i / step)) - i / step * markWidth - Math.round(thumbWidth / 3);
      });
    }
    return [];
  }, data => {
    markLeftArr.value = data;
  }, [thumbWidth, markWidth, step, progress, width]);

  // setting thumbValue
  useAnimatedReaction(() => {
    if (isScrubbingInner.value) {
      return undefined;
    }
    if (snappingEnabled) {
      return undefined;
    }
    const currentValue = progress.value / (minimumValue.value + maximumValue.value) * (width.value - (disableTrackFollow ? thumbWidth : 0));
    return clamp(currentValue, 0, width.value - thumbWidth);
  }, data => {
    if (data !== undefined && !isNaN(data)) {
      thumbValue.value = data;
    }
  }, [thumbWidth, maximumValue, minimumValue, step, progress, width]);
  const onLayout = ({
    nativeEvent
  }) => {
    const layoutWidth = nativeEvent.layout.width;
    width.value = layoutWidth;
    setSliderWidth(layoutWidth);
  };
  return /*#__PURE__*/React.createElement(GestureDetector, {
    gesture: gesture
  }, /*#__PURE__*/React.createElement(Animated.View, {
    testID: testID,
    style: [styles.view, {
      height: sliderHeight
    }, style],
    hitSlop: panHitSlop,
    onLayout: onLayout
  }, renderContainer ? renderContainer({
    style: StyleSheet.flatten([styles.slider, {
      height: sliderHeight,
      backgroundColor: _theme.maximumTrackTintColor
    }, containerStyle]),
    seekStyle: [styles.seek, {
      backgroundColor: disable ? _theme.disableMinTrackTintColor : _theme.minimumTrackTintColor
    }, animatedSeekStyle]
  }) : /*#__PURE__*/React.createElement(Animated.View, {
    style: StyleSheet.flatten([styles.slider, {
      height: sliderHeight,
      backgroundColor: _theme.maximumTrackTintColor
    }, containerStyle])
  }, /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.cache, {
      backgroundColor: _theme.cacheTrackTintColor
    }, animatedCacheXStyle]
  }), /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.heartbeat, {
      backgroundColor: _theme.heartbeatColor
    }, animatedHeartbeatStyle]
  }), /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.seek, {
      backgroundColor: disable ? _theme.disableMinTrackTintColor : _theme.minimumTrackTintColor
    }, animatedSeekStyle]
  })), sliderWidth > 0 && step ? new Array(step + 1).fill(0).map((_, i) => {
    const left = sliderWidth * (i / step) - i / step * markWidth;
    return renderMark ? /*#__PURE__*/React.createElement(View, {
      key: i,
      style: [styles.customMarkContainer, {
        left,
        width: markWidth
      }]
    }, renderMark({
      index: i
    })) : /*#__PURE__*/React.createElement(View, {
      key: i,
      style: [styles.mark, {
        width: markWidth,
        borderRadius: markWidth,
        left
      }, markStyle]
    });
  }) : null, /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.thumb, animatedThumbStyle]
  }, renderThumb ? renderThumb() : /*#__PURE__*/React.createElement(View, {
    style: {
      backgroundColor: _theme.minimumTrackTintColor,
      height: thumbWidth,
      width: thumbWidth,
      borderRadius: thumbWidth
    }
  })), /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.bubble, {
      left: -bubbleMaxWidth / 2,
      width: bubbleMaxWidth
    }, animatedBubbleStyle]
  }, renderBubble ? renderBubble() : /*#__PURE__*/React.createElement(Bubble, {
    ref: bubbleRef,
    color: _theme.bubbleBackgroundColor,
    textColor: _theme.bubbleTextColor,
    textStyle: bubbleTextStyle,
    containerStyle: bubbleContainerStyle,
    bubbleMaxWidth: bubbleMaxWidth
  }))));
});
const styles = StyleSheet.create({
  slider: {
    width: '100%',
    overflow: 'hidden'
  },
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cache: {
    height: '100%',
    left: 0,
    position: 'absolute'
  },
  heartbeat: {
    height: '100%',
    left: 0,
    position: 'absolute'
  },
  seek: {
    height: '100%',
    maxWidth: '100%',
    left: 0,
    position: 'absolute'
  },
  mark: {
    height: 4,
    backgroundColor: '#fff',
    position: 'absolute'
  },
  customMarkContainer: {
    position: 'absolute'
  },
  thumb: {
    position: 'absolute',
    left: 0
  },
  bubble: {
    position: 'absolute'
  }
});
//# sourceMappingURL=slide.js.map