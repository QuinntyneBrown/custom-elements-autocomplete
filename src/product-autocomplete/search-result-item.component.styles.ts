import { tokens } from '../theming/index.js';

export default `
:host {
  color: ${tokens.colorNeutralForeground1};
  font-family: ${tokens.fontFamilyBase};
  color-scheme: ${tokens.colorScheme};
  display: block;
  margin: ${tokens.spacingVerticalM} 0;
  border: ${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1};
  border-radius: ${tokens.borderRadiusMedium};
  background: ${tokens.colorNeutralBackground1};
}
button {
  display: flex;
  align-items: center;
  gap: ${tokens.spacingHorizontalM};
  width: 100%;
  border: 0;
  border-radius: ${tokens.borderRadiusMedium};
  padding: ${tokens.spacingHorizontalXS};
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
  font: inherit;
  font-weight: ${tokens.fontWeightSemibold};
}
button:hover {
  background: ${tokens.colorNeutralBackground1Hover};
}
button:focus-visible {
  outline: ${tokens.strokeWidthThick} solid ${tokens.colorBrandStroke1};
  outline-offset: ${tokens.strokeWidthThick};
}
button img {
  width: 36px;
  height: 48px;
  flex-shrink: 0;
  object-fit: contain;
}
button span {
  overflow-wrap: anywhere;
  min-width: 0;
}
ce-search-result-item-detail {
  padding: ${tokens.spacingHorizontalM};
  border-top: ${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2};
}
`;
