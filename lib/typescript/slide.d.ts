import React, { FC } from 'react';
import { Insets, StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { WithTimingConfig } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
export declare enum HapticModeEnum {
    NONE = "none",
    STEP = "step",
    BOTH = "both"
}
export declare enum PanDirectionEnum {
    START = 0,
    LEFT = 1,
    RIGHT = 2,
    END = 3
}
export type SliderThemeType = {
    /**
     * Color to fill the progress in the seekbar
     */
    minimumTrackTintColor?: string;
    /**
     * Color to fill the background in the seekbar
     */
    maximumTrackTintColor?: string;
    /**
     * Color to fill the cache in the seekbar
     */
    cacheTrackTintColor?: string;
    /**
     * Color to fill the bubble backgrouundColor
     */
    bubbleBackgroundColor?: string;
    /**
     * Bubble text color
     */
    bubbleTextColor?: string;
    /**
     * Disabled color to fill the progress in the seekbar
     */
    disableMinTrackTintColor?: string;
    /**
     * Color to fill the heartbeat animation in the seekbar
     */
    heartbeatColor?: string;
} | null | undefined;
export type AwesomeSliderProps = {
    /**
     * Style for the container view
     */
    style?: StyleProp<ViewStyle>;
    sliderHeight?: number;
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * A function that gets the current value of the slider as you slide it,
     * and returns a string to be used inside the bubble. if not provided it will use the
     * current value as integer.
     */
    bubble?: (s: number) => string;
    /**
     * An Animated.SharedValue from `react-native-reanimated` library which is the
     * current value of the slider.
     */
    progress: Animated.SharedValue<number>;
    /**
     * A Animated.SharedValue from `react-native-reanimated` library which is the
     * curren value of the cache. the cache is optional and will be rendered behind
     * the main progress indicator.
     */
    cache?: Animated.SharedValue<number>;
    /**
     * An  Animated.SharedValue from `react-native-reanimated` library which is the minimum value of the slider.
     */
    minimumValue: Animated.SharedValue<number>;
    /**
     * An Animated.SharedValue from `react-native-reanimated` library which is themaximum value of the slider.
     */
    maximumValue: Animated.SharedValue<number>;
    /**
     * Callback called when the users starts sliding
     */
    onSlidingStart?: () => void;
    /**
     * Callback called when slide value change
     */
    onValueChange?: (value: number) => void;
    /**
     * Callback called when the users stops sliding. the new value will be passed as argument
     */
    onSlidingComplete?: (value: number) => void;
    /**
     * Render custom Bubble to show when sliding.
     */
    renderBubble?: () => React.ReactNode;
    /**
     * This function will be called while sliding, and should set the text inside your custom bubble.
     */
    setBubbleText?: (s: string) => void;
    /**
     * Value to pass to the container of the bubble as `translateY`
     */
    bubbleTranslateY?: number;
    /**
     * Render custom container element.
     */
    renderContainer?: ({ style, seekStyle, }: {
        style: StyleProp<ViewStyle>;
        seekStyle: StyleProp<ViewStyle>;
    }) => React.ReactNode;
    /**
     * Render custom thumb image. if you need to customize thumb, you also need to set the `thumb width`
     */
    renderThumb?: () => React.ReactNode;
    /**
     * Render custom mark element. if you need to customize mark, you also need to set the `mark width`
     */
    renderMark?: ({ index }: {
        index: number;
    }) => React.ReactNode;
    /**
     * Thumb elements width, default 15
     */
    thumbWidth?: number;
    /**
     * Disable slider
     */
    disable?: boolean;
    /**
     * Enable tap event change value, default true
     */
    disableTapEvent?: boolean;
    /**
     * Bubble elements max width, default 100.
     */
    bubbleMaxWidth?: number;
    bubbleTextStyle?: StyleProp<TextStyle>;
    bubbleContainerStyle?: StyleProp<ViewStyle>;
    /**
     * By this, you know the slider status as quickly as possible.(This is useful when you doing video-palyer’s scrubber.)
     */
    isScrubbing?: Animated.SharedValue<boolean>;
    /**
     * On tap slider event.(This is useful when you doing video-palyer’s scrubber.)
     */
    onTap?: () => void;
    /**
     * By this, you can control thumb’s transform-scale animation.
     */
    thumbScaleValue?: Animated.SharedValue<number>;
    panHitSlop?: Insets;
    /**
     * @deprecated use `steps` instead.
     */
    step?: number;
    /**
     * Count of segmented sliders.
     */
    steps?: number;
    /**
     * withTiming options when step is defined. if false, no animation will be used. default false.
     */
    stepTimingOptions?: false | WithTimingConfig;
    markStyle?: StyleProp<ViewStyle>;
    markWidth?: number;
    onHapticFeedback?: () => void;
    hapticMode?: `${HapticModeEnum}`;
    theme?: SliderThemeType;
    /**
     * Current swipe direction
     * @enum Animated.SharedValue<PanDirectionEnum>
     */
    panDirectionValue?: Animated.SharedValue<PanDirectionEnum>;
    /**
     * Disable track follow thumb.(Commonly used in video/audio players)
     */
    disableTrackFollow?: boolean;
    /**
     * Bubble width, If you set this value, bubble positioning left & right will be clamp.
     */
    bubbleWidth?: number;
    testID?: string;
    snapToStep?: boolean;
    /**
     * Range along X axis (in points) where fingers travels without activation of
     * gesture. Moving outside of this range implies activation of gesture.
     *
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture#activeoffsetxvalue-number--number
     */
    activeOffsetX?: number | [activeOffsetXStart: number, activeOffsetXEnd: number];
    /**
     * Range along Y axis (in points) where fingers travels without activation of
     * gesture. Moving outside of this range implies activation of gesture.
     *
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture#activeoffsetyvalue-number--number
     */
    activeOffsetY?: number | [activeOffsetYStart: number, activeOffsetYEnd: number];
    /**
     * When the finger moves outside this range (in points) along X axis and
     * gesture hasn't yet activated it will fail recognizing the gesture. Range
     * can be given as an array or a single number.
     *
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture#failoffsetyvalue-number--number
     */
    failOffsetX?: number | [failOffsetXStart: number, failOffsetXEnd: number];
    /**
     * When the finger moves outside this range (in points) along Y axis and
     * gesture hasn't yet activated it will fail recognizing the gesture. Range
     * can be given as an array or a single number
     *
     * @see https://docs.swmansion.com/react-native-gesture-handler/docs/gestures/pan-gesture#failoffsetxvalue-number--number
     */
    failOffsetY?: number | [failOffsetYStart: number, failOffsetYEnd: number];
    /**
     * When 'heartbeat' is set to true, the progress bar color will animate back and forth between its current color and the color specified for the heartbeat.
     */
    heartbeat?: boolean;
};
export declare const Slider: FC<AwesomeSliderProps>;
//# sourceMappingURL=slide.d.ts.map