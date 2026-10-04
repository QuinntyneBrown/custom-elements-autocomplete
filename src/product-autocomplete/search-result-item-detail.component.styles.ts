import { tokens } from '../theming/index.js';

export default `
:host {
  color: ${tokens.colorNeutralForeground1};
  font-family: ${tokens.fontFamilyBase};
  color-scheme: ${tokens.colorScheme};
  display: block;
}
:host([hidden]) {
  display: none;
}
img {
  width: 64px;
  height: 86px;
  object-fit: contain;
  float: left;
  margin: 0 ${tokens.spacingHorizontalM} ${tokens.spacingVerticalS} 0;
}
div {
  overflow-wrap: anywhere;
}
h3 {
  font-size: ${tokens.fontSizeBase300};
  margin: ${tokens.spacingVerticalXS} 0;
}
p {
  margin: ${tokens.spacingVerticalS} 0;
  line-height: ${tokens.lineHeightBase300};
}
.category {
  color: ${tokens.colorBrandForeground1};
  font-weight: ${tokens.fontWeightSemibold};
}
.price {
  font-weight: ${tokens.fontWeightBold};
}
`;
