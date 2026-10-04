import { tokens } from '../theming/index.js';

export default `
:host {
  color-scheme: ${tokens.colorScheme};
  display: block;
  color: ${tokens.colorNeutralForeground1};
  font-family: ${tokens.fontFamilyBase};
  min-width: 0;
}
label {
  display: block;
  margin-bottom: ${tokens.spacingVerticalS};
  font-weight: ${tokens.fontWeightSemibold};
}
[role='status'] {
  min-height: 1.5rem;
  font-size: ${tokens.fontSizeBase200};
  color: ${tokens.colorNeutralForeground2};
}
`;
