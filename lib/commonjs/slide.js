"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Slider = exports.PanDirectionEnum = exports.HapticModeEnum = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _ballon = require("./ballon");
var _palette = require("./theme/palette");
var _utils = require("./utils");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const formatSeconds = second => `${Math.round(second * 100) / 100}`;
const hitSlop = {
  top: 12,
  bottom: 12
};
let HapticModeEnum = exports.HapticModeEnum = /*#__PURE__*/function (HapticModeEnum) {
  HapticModeEnum["NONE"] = "none";
  HapticModeEnum["STEP"] = "step";
  HapticModeEnum["BOTH"] = "both";
  return HapticModeEnum;
}({});
let PanDirectionEnum = exports.PanDirectionEnum = /*#__PURE__*/function (PanDirectionEnum) {
  PanDirectionEnum[PanDirectionEnum["START"] = 0] = "START";
  PanDirectionEnum[PanDirectionEnum["LEFT"] = 1] = "LEFT";
  PanDirectionEnum[PanDirectionEnum["RIGHT"] = 2] = "RIGHT";
  PanDirectionEnum[PanDirectionEnum["END"] = 3] = "END";
  return PanDirectionEnum;
}({});
const defaultTheme = {
  minimumTrackTintColor: _palette.palette.Main,
  maximumTrackTintColor: _palette.palette.Gray,
  cacheTrackTintColor: _palette.palette.DeepGray,
  bubbleBackgroundColor: _palette.palette.Main,
  bubbleTextColor: _palette.palette.White,
  heartbeatColor: _palette.palette.LightGray
};
const Slider = exports.Slider = /*#__PURE__*/(0, _react.memo)(function Slider({
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
  const bubbleRef = (0, _react.useRef)(null);
  const isScrubbingInner = (0, _reactNativeReanimated.useSharedValue)(false);
  const prevX = (0, _reactNativeReanimated.useSharedValue)(0);
  const defaultThumbIndex = (0, _react.useMemo)(() => {
    if (!snappingEnabled) {
      return 0;
    }
    const index = Math.round((progress.value - minimumValue.value) / (maximumValue.value - minimumValue.value) * step);
    return (0, _utils.clamp)(index, 0, step);
  }, [maximumValue, minimumValue, progress, snappingEnabled, step]);
  const thumbIndex = (0, _reactNativeReanimated.useSharedValue)(defaultThumbIndex);
  const [sliderWidth, setSliderWidth] = (0, _react.useState)(0);
  const width = (0, _reactNativeReanimated.useSharedValue)(0);
  const thumbValue = (0, _reactNativeReanimated.useSharedValue)(0);
  const bubbleOpacity = (0, _reactNativeReanimated.useSharedValue)(0);
  const markLeftArr = (0, _reactNativeReanimated.useSharedValue)([]);
  const isTriggedHaptic = (0, _reactNativeReanimated.useSharedValue)(false);
  const _theme = {
    ...defaultTheme,
    ...theme
  };
  const sliderTotalValue = (0, _reactNativeReanimated.useDerivedValue)(() => {
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
  const animatedSeekStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    let seekWidth = 0;
    // when you set step
    if (snappingEnabled && markLeftArr.value.length >= step) {
      seekWidth = markLeftArr.value[thumbIndex.value] + thumbWidth / 2;
    } else {
      seekWidth = progressToValue(progress.value) + thumbWidth / 2;
    }
    sliderTotalValue.value; // hack: force recompute styles when 'sliderTotalValue' changes

    return {
      width: snappingEnabled && stepTimingOptions ? (0, _reactNativeReanimated.withTiming)((0, _utils.clamp)(seekWidth, 0, width.value), stepTimingOptions) : (0, _utils.clamp)(seekWidth, 0, width.value)
    };
  }, [progress, minimumValue, maximumValue, width, markLeftArr]);
  const animatedThumbStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    let translateX = 0;
    // when you set step
    if (snappingEnabled && markLeftArr.value.length >= step) {
      translateX = stepTimingOptions ? (0, _reactNativeReanimated.withTiming)(markLeftArr.value[thumbIndex.value], stepTimingOptions) : markLeftArr.value[thumbIndex.value];
    } else if (disableTrackFollow && isScrubbingInner.value) {
      translateX = (0, _utils.clamp)(thumbValue.value, 0, width.value ? width.value - thumbWidth : 0);
    } else {
      translateX = (0, _utils.clamp)(progressToValue(progress.value), 0, width.value ? width.value - thumbWidth : 0);
    }
    sliderTotalValue.value; // hack: force recompute styles when 'sliderTotalValue' change
    return {
      transform: [{
        translateX
      }, {
        scale: (0, _reactNativeReanimated.withTiming)(thumbScaleValue ? thumbScaleValue.value : 1, {
          duration: 100
        })
      }]
    };
  }, [progress, minimumValue, maximumValue, width]);
  const animatedBubbleStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
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
        translateX: snappingEnabled && stepTimingOptions ? (0, _reactNativeReanimated.withTiming)((0, _utils.clamp)(translateX, bubbleWidth / 2, width.value - bubbleWidth / 2), stepTimingOptions) : (0, _utils.clamp)(translateX, bubbleWidth / 2, width.value - bubbleWidth / 2)
      }, {
        scale: bubbleOpacity.value
      }]
    };
  }, [bubbleTranslateY, bubbleWidth, width]);
  const animatedCacheXStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    const cacheX = cache?.value && sliderTotalValue.value ? cache?.value / sliderTotalValue.value * width.value : 0;
    return {
      width: cacheX
    };
  }, [cache, sliderTotalValue, width]);
  const animatedHeartbeatStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    // Goes to one and zero continuously
    const opacity = heartbeat ? (0, _reactNativeReanimated.withSequence)((0, _reactNativeReanimated.withTiming)(1, {
      duration: 1000
    }), (0, _reactNativeReanimated.withRepeat)((0, _reactNativeReanimated.withTiming)(0, {
      duration: 1000
    }), -1, true)) : (0, _reactNativeReanimated.withTiming)(0, {
      duration: 500
    });
    return {
      width: sliderWidth,
      opacity
    };
  }, [sliderWidth, heartbeat]);
  const onSlideAcitve = (0, _react.useCallback)(seconds => {
    const bubbleText = bubble ? bubble?.(seconds) : formatSeconds(seconds);
    onValueChange?.(seconds);
    setBubbleText ? setBubbleText(bubbleText) : bubbleRef.current?.setText(bubbleText);
  }, [bubble, onValueChange, setBubbleText]);

  /**
   * convert Sharevalue to callback seconds
   * @returns number
   */
  const shareValueToSeconds = (0, _react.useCallback)(() => {
    'worklet';

    if (snappingEnabled) {
      return (0, _utils.clamp)(minimumValue.value + thumbIndex.value / step * (maximumValue.value - minimumValue.value), minimumValue.value, maximumValue.value);
    } else {
      const sliderPercent = (0, _utils.clamp)(thumbValue.value / (width.value - thumbWidth), 0, 1);
      return minimumValue.value + (0, _utils.clamp)(sliderPercent * sliderTotalValue.value, 0, sliderTotalValue.value);
    }
  }, [maximumValue, minimumValue, sliderTotalValue, step, thumbIndex, thumbValue, thumbWidth, width, snappingEnabled]);
  /**
   * convert [x] position to progress
   * @returns number
   */
  const xToProgress = (0, _react.useCallback)(x => {
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
  const onActiveSlider = (0, _react.useCallback)(x => {
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
        (0, _reactNativeReanimated.runOnJS)(onHapticFeedback)();
        isTriggedHaptic.value = true;
      } else {
        isTriggedHaptic.value = false;
      }
      (0, _reactNativeReanimated.runOnJS)(onSlideAcitve)(shareValueToSeconds());
    } else {
      thumbValue.value = (0, _utils.clamp)(x, 0, width.value - thumbWidth);
      if (!disableTrackFollow) {
        progress.value = xToProgress(x);
      }
      // Determines whether the thumb slides to both ends
      if (x <= 0 || x >= width.value - thumbWidth) {
        if (!isTriggedHaptic.value && hapticMode === HapticModeEnum.BOTH && onHapticFeedback) {
          (0, _reactNativeReanimated.runOnJS)(onHapticFeedback)();
          isTriggedHaptic.value = true;
        }
      } else {
        isTriggedHaptic.value = false;
      }
      (0, _reactNativeReanimated.runOnJS)(onSlideAcitve)(shareValueToSeconds());
    }
  }, [disableTrackFollow, hapticMode, isScrubbing, isScrubbingInner, isTriggedHaptic, markLeftArr, onHapticFeedback, onSlideAcitve, progress, shareValueToSeconds, step, thumbIndex, thumbValue, thumbWidth, width, xToProgress, snappingEnabled]);
  const onGestureEvent = (0, _react.useMemo)(() => {
    const gesture = _reactNativeGestureHandler.Gesture.Pan().hitSlop(panHitSlop).onStart(() => {
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
        (0, _reactNativeReanimated.runOnJS)(onSlidingStart)();
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
      bubbleOpacity.value = (0, _reactNativeReanimated.withSpring)(1);
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
      bubbleOpacity.value = (0, _reactNativeReanimated.withSpring)(0);
      if (disableTrackFollow) {
        progress.value = xToProgress(x);
      }
      if (onSlidingComplete) {
        (0, _reactNativeReanimated.runOnJS)(onSlidingComplete)(shareValueToSeconds());
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
  const onSingleTapEvent = (0, _react.useMemo)(() => _reactNativeGestureHandler.Gesture.Tap().hitSlop(panHitSlop).onEnd(({
    x
  }, isFinished) => {
    if (onTap) {
      (0, _reactNativeReanimated.runOnJS)(onTap)();
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
    bubbleOpacity.value = (0, _reactNativeReanimated.withSpring)(0);
    if (onSlidingComplete) {
      (0, _reactNativeReanimated.runOnJS)(onSlidingComplete)(shareValueToSeconds());
    }
  }), [bubbleOpacity, disable, disableTapEvent, isScrubbing, isScrubbingInner, onActiveSlider, onSlidingComplete, onTap, panHitSlop, shareValueToSeconds]);
  const gesture = (0, _react.useMemo)(() => _reactNativeGestureHandler.Gesture.Race(onSingleTapEvent, onGestureEvent), [onGestureEvent, onSingleTapEvent]);

  // setting markLeftArr
  (0, _reactNativeReanimated.useAnimatedReaction)(() => {
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
  (0, _reactNativeReanimated.useAnimatedReaction)(() => {
    if (isScrubbingInner.value) {
      return undefined;
    }
    if (snappingEnabled) {
      return undefined;
    }
    const currentValue = progress.value / (minimumValue.value + maximumValue.value) * (width.value - (disableTrackFollow ? thumbWidth : 0));
    return (0, _utils.clamp)(currentValue, 0, width.value - thumbWidth);
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
  return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
    gesture: gesture
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    testID: testID,
    style: [styles.view, {
      height: sliderHeight
    }, style],
    hitSlop: panHitSlop,
    onLayout: onLayout
  }, renderContainer ? renderContainer({
    style: _reactNative.StyleSheet.flatten([styles.slider, {
      height: sliderHeight,
      backgroundColor: _theme.maximumTrackTintColor
    }, containerStyle]),
    seekStyle: [styles.seek, {
      backgroundColor: disable ? _theme.disableMinTrackTintColor : _theme.minimumTrackTintColor
    }, animatedSeekStyle]
  }) : /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: _reactNative.StyleSheet.flatten([styles.slider, {
      height: sliderHeight,
      backgroundColor: _theme.maximumTrackTintColor
    }, containerStyle])
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.cache, {
      backgroundColor: _theme.cacheTrackTintColor
    }, animatedCacheXStyle]
  }), /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.heartbeat, {
      backgroundColor: _theme.heartbeatColor
    }, animatedHeartbeatStyle]
  }), /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.seek, {
      backgroundColor: disable ? _theme.disableMinTrackTintColor : _theme.minimumTrackTintColor
    }, animatedSeekStyle]
  })), sliderWidth > 0 && step ? new Array(step + 1).fill(0).map((_, i) => {
    const left = sliderWidth * (i / step) - i / step * markWidth;
    return renderMark ? /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      key: i,
      style: [styles.customMarkContainer, {
        left,
        width: markWidth
      }]
    }, renderMark({
      index: i
    })) : /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      key: i,
      style: [styles.mark, {
        width: markWidth,
        borderRadius: markWidth,
        left
      }, markStyle]
    });
  }) : null, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.thumb, animatedThumbStyle]
  }, renderThumb ? renderThumb() : /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: {
      backgroundColor: _theme.minimumTrackTintColor,
      height: thumbWidth,
      width: thumbWidth,
      borderRadius: thumbWidth
    }
  })), /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.bubble, {
      left: -bubbleMaxWidth / 2,
      width: bubbleMaxWidth
    }, animatedBubbleStyle]
  }, renderBubble ? renderBubble() : /*#__PURE__*/_react.default.createElement(_ballon.Bubble, {
    ref: bubbleRef,
    color: _theme.bubbleBackgroundColor,
    textColor: _theme.bubbleTextColor,
    textStyle: bubbleTextStyle,
    containerStyle: bubbleContainerStyle,
    bubbleMaxWidth: bubbleMaxWidth
  }))));
});
const styles = _reactNative.StyleSheet.create({
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