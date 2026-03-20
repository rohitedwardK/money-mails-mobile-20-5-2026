import * as React from 'react';
import { SvgCss } from 'react-native-svg/css';

const xml = `
 <svg xmlns="http://www.w3.org/2000/svg" id="direction-svgrepo-com" width="9.467" height="9.467" viewBox="0 0 9.467 9.467">
  <path id="Path_62982" data-name="Path 62982" d="M5.4,2.053,2.053,5.4,5.4,8.746,8.746,5.4Zm.279-.837L9.583,5.121a.394.394,0,0,1,0,.558L5.678,9.583a.394.394,0,0,1-.558,0L1.216,5.678a.394.394,0,0,1,0-.558L5.121,1.216a.394.394,0,0,1,.558,0Zm.116,3.395V3.625L7.175,5.005,5.794,6.386V5.4H4.611V6.583H3.822V5.005a.394.394,0,0,1,.394-.394Z" transform="translate(-0.666 -0.666)"/>
</svg>
`;

export default props => (
  <SvgCss xml={xml} width="100%" height="100%" {...props} />
);
