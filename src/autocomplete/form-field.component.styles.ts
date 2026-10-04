import { tokens } from '../theming/index.js';

export default `
:host {
  font-family: ${tokens.fontFamilyBase};
  color-scheme: ${tokens.colorScheme};
  display: block;
}
::slotted(input) {
  box-sizing: border-box;
  width: 100%;
  padding: ${tokens.spacingHorizontalS} ${tokens.spacingHorizontalM};
  border: ${tokens.strokeWidthThin} solid ${tokens.colorNeutralStrokeAccessible};
  border-radius: ${tokens.borderRadiusMedium};
  background: ${tokens.colorNeutralBackground1};
  color: ${tokens.colorNeutralForeground1};
  font: inherit;
}
::slotted(input:focus-visible) {
  outline: ${tokens.strokeWidthThick} solid ${tokens.colorBrandStroke1};
  outline-offset: ${tokens.strokeWidthThick};
}
`;
