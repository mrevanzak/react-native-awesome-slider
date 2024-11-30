"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BubbleComponent = exports.Bubble = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireDefault(require("react-native-reanimated"));
var _palette = require("./theme/palette");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const BUBBLE_STYLE = {
  padding: 2,
  paddingHorizontal: 4,
  borderRadius: 5
};

/**
 * a component to show text inside a bubble
 */

const BubbleComponent = exports.BubbleComponent = /*#__PURE__*/_react.default.forwardRef(({
  containerStyle,
  color = _palette.palette.Main,
  textStyle,
  textColor = _palette.palette.White,
  bubbleMaxWidth
}, ref) => {
  const textRef = (0, _react.useRef)(null);
  (0, _react.useImperativeHandle)(ref, () => ({
    setText: text => {
      textRef.current?.setNativeProps({
        text
      });
    }
  }));
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.view, containerStyle]
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: {
      ...BUBBLE_STYLE,
      backgroundColor: color,
      maxWidth: bubbleMaxWidth
    }
  }, /*#__PURE__*/_react.default.createElement(_reactNative.TextInput, {
    ref: textRef,
    textAlign: "center",
    style: [styles.textStyle, {
      color: textColor
    }, textStyle],
    defaultValue: "",
    caretHidden: true
  })), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.triangle, {
      borderTopColor: color
    }]
  }));
});
const Bubble = exports.Bubble = /*#__PURE__*/(0, _react.memo)(BubbleComponent);
const styles = _reactNative.StyleSheet.create({
  triangle: {
    width: 10,
    height: 10,
    borderWidth: 5,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    flexDirection: 'row'
  },
  textStyle: {
    fontSize: 12,
    paddingVertical: 0
  },
  view: {
    alignItems: 'center'
  }
});
//# sourceMappingURL=ballon.js.map