import * as React from 'react';
import { SvgCss } from 'react-native-svg/css';

const xml = `
 <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="18" viewBox="0 0 18 18">
  <defs>
    <linearGradient id="linear-gradient" x1="0.239" y1="-0.137" x2="0.557" y2="0.789" gradientUnits="objectBoundingBox">
      <stop offset="0" stop-color="#ffde5c"/>
      <stop offset="1" stop-color="#bb9417"/>
    </linearGradient>
  </defs>
  <g id="Group_16864" data-name="Group 16864" transform="translate(-32.662 13498.338)">
    <rect id="Rectangle_17525" data-name="Rectangle 17525" width="18" height="18" rx="2" transform="translate(32.662 -13498.338)" fill="url(#linear-gradient)"/>
    <g id="Group_16866" data-name="Group 16866" transform="translate(35.879 -13493.67)">
      <path id="Path_63313" data-name="Path 63313" d="M2055.312,1390.872l-.6-2.948,2.05,1.4,2.051-1.4-.919,4.5h.516l.2-.977,3.06-1.686-1.468,4.518a3.462,3.462,0,0,1,.448.259l1.9-5.837-3.8,2.095.816-3.994-.515.352-2.281,1.557-2.8-1.91.766,3.75Z" transform="translate(-2050.977 -1386.802)" fill="#fff" stroke="rgba(0,0,0,0)" stroke-width="1"/>
      <path id="Path_63314" data-name="Path 63314" d="M1587.262,1695.88c-.019-.019-.039-.037-.06-.055q-.074-.064-.158-.125a3.112,3.112,0,0,0-.446-.266c-.056-.027-.114-.054-.173-.081l-.141-.059a9.44,9.44,0,0,0-6.13,0c-.048.019-.1.039-.141.059s-.118.053-.173.081l-1.527-4.7,3.059,1.686.2.977h.516l-.267-1.307-4.385-2.416,1.958,6.026c-.056.041-.109.083-.158.125l-.061.055a1.434,1.434,0,0,0-.295.383,1.046,1.046,0,0,0-.071.176h.536a.9.9,0,0,1,.061-.087,1.169,1.169,0,0,1,.107-.115c.028-.026.058-.052.09-.079h0a2.375,2.375,0,0,1,.39-.25c.055-.029.112-.057.172-.084s.112-.05.171-.073a8.959,8.959,0,0,1,5.763,0q.089.036.171.073h0q.09.041.172.084a2.385,2.385,0,0,1,.39.25h0q.048.039.09.079a1.151,1.151,0,0,1,.107.115h0a.794.794,0,0,1,.061.086h.537a1.047,1.047,0,0,0-.071-.176A1.434,1.434,0,0,0,1587.262,1695.88Z" transform="translate(-1577.435 -1687.775)" fill="#fff" stroke="rgba(0,0,0,0)" stroke-width="1"/>
    </g>
  </g>
</svg>
`;

export default props => (
  <SvgCss xml={xml} width="100%" height="100%" {...props} />
);
