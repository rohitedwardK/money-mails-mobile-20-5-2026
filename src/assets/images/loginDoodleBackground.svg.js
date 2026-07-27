import * as React from 'react';
import {SvgCss} from 'react-native-svg/css';

const doodleTile = `
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#4a9b2e"/>
    <stop offset="0.32" stop-color="#3d8a27"/>
    <stop offset="0.72" stop-color="#276b22"/>
    <stop offset="1" stop-color="#1a521c"/>
  </linearGradient>
  <pattern id="doodles" width="300" height="300" patternUnits="userSpaceOnUse">
    <g fill="none" stroke="rgba(255,255,255,0.11)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <g transform="translate(15,15) rotate(-12,12,8)">
        <rect x="0" y="0" width="26" height="18" rx="4"/>
        <path d="M0,0 Q13,14 26,0"/>
      </g>
      <g transform="translate(230,10) rotate(8)">
        <circle cx="12" cy="12" r="12"/>
        <path d="M10,7 C7,7 7,12 10,12 C13,12 13,17 10,17" stroke-width="2.8"/>
        <line x1="10" y1="5" x2="10" y2="7"/>
        <line x1="10" y1="17" x2="10" y2="19"/>
      </g>
      <g transform="translate(40,70) rotate(6)">
        <rect x="0" y="6" width="22" height="16" rx="3"/>
        <path d="M0,12 Q11,12 22,12"/>
        <line x1="11" y1="6" x2="11" y2="22"/>
        <path d="M4,6 C4,0 11,0 11,6"/>
        <path d="M18,6 C18,0 11,0 11,6"/>
      </g>
      <g transform="translate(130,25) rotate(-5)">
        <path d="M12,0 C13,8 16,9 24,10 C16,11 13,14 12,22 C11,14 8,11 0,10 C8,9 11,8 12,0 Z" stroke-width="2.2"/>
      </g>
      <g transform="translate(265,72) rotate(15)">
        <circle cx="0" cy="0" r="4"/>
        <circle cx="14" cy="14" r="4"/>
        <line x1="-2" y1="16" x2="16" y2="-2"/>
      </g>
      <g transform="translate(135,88) rotate(-8)">
        <rect x="0" y="0" width="26" height="18" rx="4"/>
        <path d="M20,6 Q28,6 28,10 Q28,14 20,14 Z"/>
        <circle cx="23" cy="10" r="1.8"/>
      </g>
      <g transform="translate(8,145) rotate(10)">
        <path d="M0,10 Q2,4 6,2 L22,8 Q22,14 22,16 L6,22 Q2,20 0,14 Z" stroke-width="2.2"/>
        <path d="M22,10 Q26,10 26,13 Q26,16 22,16"/>
      </g>
      <g transform="translate(60,230) rotate(-6)">
        <path d="M4,0 Q4,14 12,16 Q20,14 20,0 Z" stroke-width="2.2"/>
        <path d="M4,4 Q-2,4 -2,8 Q-2,12 4,12"/>
        <path d="M20,4 Q26,4 26,8 Q26,12 20,12"/>
        <line x1="12" y1="16" x2="12" y2="22"/>
        <path d="M6,22 Q12,24 18,22"/>
      </g>
      <g transform="translate(215,145) rotate(-10)">
        <rect x="0" y="0" width="24" height="18" rx="4"/>
        <path d="M7,7 C7,3 12,3 12,7 C12,3 17,3 17,7 C17,12 12,16 12,16 C12,16 7,12 7,7 Z" stroke-width="2"/>
      </g>
      <g transform="translate(82,8) rotate(18)">
        <path d="M0,4 Q0,0 4,0 L14,0 Q18,0 22,4 Q18,8 14,8 L4,8 Q0,8 0,4 Z"/>
        <circle cx="5" cy="4" r="2"/>
      </g>
      <g transform="translate(270,195) rotate(-14)">
        <rect x="0" y="6" width="20" height="18" rx="3"/>
        <path d="M5,6 C5,0 15,0 15,6"/>
      </g>
      <g transform="translate(195,38) rotate(20)">
        <path d="M6,0 C7,4 10,5 14,6 C10,7 7,10 6,14 C5,10 2,7 -2,6 C2,5 5,4 6,0 Z" stroke-width="2"/>
      </g>
      <g transform="translate(145,250) rotate(12)">
        <rect x="0" y="0" width="22" height="15" rx="3.5"/>
        <path d="M0,0 Q11,12 22,0"/>
      </g>
      <g transform="translate(100,185) rotate(-15)">
        <path d="M4,16 Q4,20 10,20 Q16,20 16,16" stroke-width="2"/>
        <path d="M2,16 L4,8 Q4,0 10,0 Q16,0 16,8 L18,16 Z"/>
        <circle cx="10" cy="0" r="1.5"/>
      </g>
      <g transform="translate(248,265) rotate(5)">
        <rect x="3" y="0" width="22" height="15" rx="3"/>
        <rect x="0" y="4" width="22" height="15" rx="3"/>
        <path d="M0,4 Q11,15 22,4"/>
      </g>
      <g transform="translate(180,105) rotate(25)">
        <circle cx="8" cy="8" r="8" stroke-dasharray="3 2" stroke-width="2.2"/>
        <path d="M5,6 L8,3 L11,6" stroke-width="2.2"/>
        <line x1="8" y1="3" x2="8" y2="13" stroke-width="2.2"/>
      </g>
      <g transform="translate(195,230) rotate(-8)">
        <ellipse cx="10" cy="14" rx="10" ry="4"/>
        <ellipse cx="10" cy="10" rx="10" ry="4"/>
        <ellipse cx="10" cy="6" rx="10" ry="4"/>
      </g>
      <g transform="translate(58,42) rotate(22)">
        <path d="M0,10 L22,0 L18,12 L12,8 Z" stroke-width="2.2"/>
        <line x1="12" y1="8" x2="22" y2="0"/>
      </g>
      <g transform="translate(110,130)">
        <path d="M5,0 C5.5,3 7,4 10,5 C7,6 5.5,8 5,11 C4.5,8 3,6 0,5 C3,4 4.5,3 5,0 Z" stroke-width="1.8"/>
      </g>
      <g transform="translate(35,195) rotate(30)">
        <path d="M4,0 C4.5,2.5 6,3.5 8,4 C6,4.5 4.5,6 4,8 C3.5,6 2,4.5 0,4 C2,3.5 3.5,2.5 4,0 Z" stroke-width="1.8"/>
      </g>
      <g transform="translate(285,130) rotate(-20)">
        <path d="M4,0 C4.5,2.5 6,3.5 8,4 C6,4.5 4.5,6 4,8 C3.5,6 2,4.5 0,4 C2,3.5 3.5,2.5 4,0 Z" stroke-width="1.8"/>
      </g>
      <g transform="translate(170,175) rotate(12)">
        <circle cx="8" cy="8" r="8"/>
        <path d="M7,5 C5,5 5,8 7,8 C9,8 9,11 7,11" stroke-width="2.2"/>
      </g>
      <g transform="translate(250,42) rotate(-10)">
        <path d="M10,0 L20,8 L10,20 L0,8 Z"/>
        <path d="M0,8 L20,8"/>
        <path d="M10,0 L6,8 L10,20"/>
        <path d="M10,0 L14,8 L10,20"/>
      </g>
      <g transform="translate(5,270) rotate(5)">
        <path d="M0,2 L4,2 L8,16 L22,16"/>
        <circle cx="10" cy="20" r="2.5"/>
        <circle cx="20" cy="20" r="2.5"/>
        <path d="M5,6 L24,6 L22,16"/>
      </g>
      <g transform="translate(155,155) rotate(-18)">
        <circle cx="8" cy="8" r="8"/>
        <line x1="2" y1="14" x2="0" y2="22"/>
        <line x1="14" y1="14" x2="16" y2="22"/>
      </g>
      <g transform="translate(118,270) rotate(-8)">
        <rect x="0" y="0" width="20" height="14" rx="3"/>
        <path d="M0,0 Q10,11 20,0"/>
      </g>
      <g transform="translate(75,155) rotate(15)">
        <path d="M6,0 C7,4 10,5 14,6 C10,7 7,10 6,14 C5,10 2,7 -2,6 C2,5 5,4 6,0 Z" stroke-width="2"/>
      </g>
      <g transform="translate(210,280) rotate(10)">
        <rect x="0" y="5" width="18" height="13" rx="3"/>
        <line x1="9" y1="5" x2="9" y2="18"/>
        <path d="M3,5 C3,0 9,0 9,5"/>
        <path d="M15,5 C15,0 9,0 9,5"/>
      </g>
      <g transform="translate(275,225) rotate(-22)">
        <path d="M0,4 Q0,0 4,0 L12,0 Q16,0 18,4 Q16,8 12,8 L4,8 Q0,8 0,4 Z"/>
        <circle cx="4" cy="4" r="1.5"/>
      </g>
      <g transform="translate(290,25)">
        <path d="M3,0 C3.4,2 5,3 7,3.5 C5,4 3.4,5.5 3,7.5 C2.6,5.5 1,4 -1,3.5 C1,3 2.6,2 3,0 Z" stroke-width="1.6"/>
      </g>
      <g transform="translate(30,165) rotate(-8)">
        <circle cx="0" cy="0" r="3.5"/>
        <circle cx="12" cy="12" r="3.5"/>
        <line x1="-2" y1="14" x2="14" y2="-2"/>
      </g>
    </g>
  </pattern>
</defs>
`;

const buildXml = ({width, height}) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${doodleTile}
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#doodles)"/>
</svg>
`;

const LoginDoodleBackground = ({width, height, style}) => (
  <SvgCss xml={buildXml({width, height})} width={width} height={height} style={style} />
);

export default LoginDoodleBackground;
