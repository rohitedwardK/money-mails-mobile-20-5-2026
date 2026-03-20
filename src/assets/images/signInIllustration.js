import * as React from 'react';
import { SvgCss } from 'react-native-svg/css';

const xml = `
 <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="Group_14348" data-name="Group 14348" width="215.751" height="223.371" viewBox="0 0 215.751 223.371">
  <defs>
    <linearGradient id="linear-gradient" x1="0.5" y1="0.046" x2="0.5" y2="1.255" gradientUnits="objectBoundingBox">
      <stop offset="0.129"/>
      <stop offset="1" stop-color="#fff"/>
    </linearGradient>
    <linearGradient id="linear-gradient-2" x1="0.507" y1="0.935" x2="0.496" y2="0.373" gradientUnits="objectBoundingBox">
      <stop offset="0.194" stop-color="#ff9c91"/>
      <stop offset="1" stop-color="#f27c6f"/>
    </linearGradient>
   <radialGradient id="radial-gradient" cx="0.5" cy="0.5" r="0.527" gradientUnits="objectBoundingBox">
      <stop offset="0" stop-color="#ffd363"/>
      <stop offset="0.359" stop-color="#ffcb48"/>
      <stop offset="1" stop-color="#ffbb10"/>
    </radialGradient>
  </defs>
  <path id="Path_582" data-name="Path 582" d="M141.011,293.625s2.647-14.949-12.657-24.535c.454,4.017-3.061,10.252-.114,15.58C132.053,291.56,138.59,290.565,141.011,293.625Z" transform="translate(-44.603 -89.593)" fill="#80b377"/>
  <g id="Group_1189" data-name="Group 1189" transform="translate(0 0)">
    <path id="Path_583" data-name="Path 583" d="M144.723,134.962c41.36-.218,65.687,23.786,95.721,85.271,16.665,34.116,45.59,56.607,40.055,95.059-4.245,29.481-26.709,49.732-89.285,40.988s-116.48-.705-124.246-43.659c-8.005-44.285,18.138-72.1,16.778-109.282S103.354,135.179,144.723,134.962Z" transform="translate(-65.442 -134.961)" fill="#50ab32"/>
    <path id="Path_584" data-name="Path 584" d="M234.25,220.233c-30.034-61.485-54.362-85.489-95.721-85.271-27.392.143-45.831,13.78-54.774,33.768,20.633,38.754,71.225,101.276,184.558,108.275C259.7,258.156,244.61,241.439,234.25,220.233Z" transform="translate(-59.248 -134.961)" fill="#50ab32"/>
  </g>
  <g id="Group_1190" data-name="Group 1190" transform="translate(14.618 113.089)">
    <path id="Path_585" data-name="Path 585" d="M80.669,219.467s-7.078,17.124-3.079,32.959c4.446,17.607,25.286,19.384,30.593,27.4,6.252-13.306,6.632-29.78-3.241-39.869C97.8,232.662,82.9,227.93,80.669,219.467Z" transform="translate(-76.365 -219.467)" fill="#80b377"/>
    <path id="Path_586" data-name="Path 586" d="M80.715,226c1.895,18.109,27.605,29.906,26,51.616-1.307,17.627,5.072,30.33,13.915,41.465" transform="translate(-74.894 -217.258)" fill="none" stroke="#2e5e26" stroke-width="1.017"/>
    <path id="Path_587" data-name="Path 587" d="M78.947,265.9c-.775,8.3.55,17.724,9.955,20.7,6.11,1.936,21.761.51,21.761.51a6.5,6.5,0,0,1-5.729-4.521c-1.467-4.407-3.248-9.358-8.079-11.859S82.261,270.649,78.947,265.9Z" transform="translate(-75.555 -203.762)" fill="#80b377"/>
    <path id="Path_588" data-name="Path 588" d="M121.336,261.783c5.071,6.611,8.966,15.3,2.591,22.825-4.143,4.891-18.152,12.013-18.152,12.013a6.494,6.494,0,0,0,2.444-6.876c-1.1-4.511-2.231-9.651.529-14.339S121.059,267.568,121.336,261.783Z" transform="translate(-66.418 -205.154)" fill="#80b377"/>
  </g>
  <g id="Group_1191" data-name="Group 1191" transform="translate(95.849 138.927)">
    <path id="Path_589" data-name="Path 589" d="M161.592,238.774a40.339,40.339,0,0,1-15.64,14.419c-10.888,5.758-11.712,21.4-2.8,38.407,20.476.454,27.877-12.984,27.958-26.407A40.7,40.7,0,0,0,161.592,238.774Z" transform="translate(-137.065 -238.774)" fill="#80b377"/>
    <path id="Path_590" data-name="Path 590" d="M161.592,238.774s2.96,11.239-5.895,28.12-16.626,22.833-18.632,51.026" transform="translate(-137.065 -238.774)" fill="none" stroke="#2e5e26" stroke-width="1.017"/>
    <path id="Path_591" data-name="Path 591" d="M138.558,297.559s4.969-14.346,23-15.265c-2.353,3.287-2.319,10.445-7.489,13.662C147.389,300.118,142.163,296.064,138.558,297.559Z" transform="translate(-136.56 -224.054)" fill="#80b377"/>
  </g>
  <g id="Group_1193" data-name="Group 1193" transform="translate(55.305 14.58)">
    <path id="Path_592" data-name="Path 592" d="M216.62,242.846l-25.886-16.612L163.8,241.15,152.24,324.188c3.181.371,6.383.77,9.617,1.22q8.758,1.224,16.486,1.7l12.392-67.994L205.151,326.4c10.013-1.389,18.08-4.122,24.519-7.917Z" transform="translate(-91.389 -118.669)" fill="#28292a"/>
    <line id="Line_1" data-name="Line 1" x1="10.403" y2="75.276" transform="translate(64.19 130.275)" fill="none" stroke="#3465d9" stroke-width="1.072"/>
    <line id="Line_2" data-name="Line 2" x2="13.6" y2="73.3" transform="translate(120.563 128.687)" fill="none" stroke="#3465d9" stroke-width="1.072"/>
    <path id="Path_593" data-name="Path 593" d="M217.473,260.85l-3.106-18-25.886-16.612L161.551,241.15,158.9,260.189c19.679.483,26.713-15.224,26.713-15.224C193.4,263.238,209.269,262.6,217.473,260.85Z" transform="translate(-89.136 -118.669)" opacity="0.2" fill="url(#linear-gradient)"/>
    <g id="Group_1192" data-name="Group 1192" transform="translate(69.716)">
      <path id="Path_594" data-name="Path 594" d="M167.063,168.594l-2.383-4.7s-3.762-1.444-5-3.414c-3.3-5.247,3.885-14.3,13.175-14.612,9.022-.3,10.209,3.588,10.209,3.588a5.444,5.444,0,0,1,5.34,4.675c.693,4.665-1.325,10.982-1.325,10.982Z" transform="translate(-158.864 -145.856)"/>
      <path id="Path_595" data-name="Path 595" d="M184.238,179.979H171.955l-2.8-12.542,11.7-2.61Z" transform="translate(-155.383 -139.439)" fill="url(#linear-gradient-2)"/>
      <path id="Path_596" data-name="Path 596" d="M186.618,158.9a3.171,3.171,0,0,0-2.29,1.373c-.163-.968-.367-1.971-.641-3.042,0,0-9.7,1.823-13.388-3.958a12.951,12.951,0,0,1-4.537,7.957c.218,1.144.475,2.195.755,3.184a3.244,3.244,0,0,0-2.861-.391c-1.986.733,1.926,8.162,4.815,5.341h0c2.461,4.458,6.185,7.189,9.93,6.354,3.727-.831,5.928-4.867,6.28-9.9C188.347,166.852,188.7,158.725,186.618,158.9Z" transform="translate(-157.426 -143.346)" fill="#ff9c91"/>
    </g>
    <path id="Path_597" data-name="Path 597" d="M173.76,177.4,151,211.066l-21.539-15.644-6.121,9.183,25.131,21.579a7.58,7.58,0,0,0,11.012-1.216l19.858-26.6Z" transform="translate(-101.166 -135.187)" fill="#44474a"/>
    <path id="Path_598" data-name="Path 598" d="M151.882,195.474l7.86,16.207,9.938-13.312L164.1,177.4Z" transform="translate(-91.51 -135.187)" opacity="0.2" fill="url(#linear-gradient-3)"/>
    <path id="Path_599" data-name="Path 599" d="M137.222,198.6c-.32-.106-8.284-6.3-8.284-6.3s-6.248-7.158-9.348-8.442l3.206,5.878-16.028,2.244,1.148,3.1a5.409,5.409,0,0,0,5.072,3.528h12.265l7.694,6.519Z" transform="translate(-106.769 -133.003)" opacity="0.2" fill="url(#linear-gradient-4)"/>
    <path id="Path_600" data-name="Path 600" d="M162.982,177.679a77.14,77.14,0,0,1,18.164-2.508c1.166-.009,2.333-.028,3.5-.094,8.127-.452,15.657-.423,19.914-.347a3.968,3.968,0,0,1,3.882,3.672l4.719,62.6,4.678,28.1s-25.119,7.323-31.75-15.463c0,0-7.107,18.916-27.343,15.81l3.317-27.917-1.338-60.847A3.027,3.027,0,0,1,162.982,177.679Z" transform="translate(-89.189 -136.104)" fill="#1b3d9e"/>
    <path id="Path_601" data-name="Path 601" d="M183.225,217.737a1.665,1.665,0,1,1-1.665-1.665A1.665,1.665,0,0,1,183.225,217.737Z" transform="translate(-82.035 -122.106)" fill="#fff"/>
    <path id="Path_602" data-name="Path 602" d="M183.687,226.343a1.665,1.665,0,1,1-1.665-1.665A1.665,1.665,0,0,1,183.687,226.343Z" transform="translate(-81.879 -119.195)" fill="#fff"/>
    <path id="Path_603" data-name="Path 603" d="M179.584,250.723,178.4,220.255l9.655-26.455-5.476-3.9,7.947-8.5-8.275-6.206" transform="translate(-82.541 -135.932)" fill="none" stroke="#fff" stroke-width="0.508"/>
    <path id="Path_604" data-name="Path 604" d="M212.536,231.6l-.1-.582-1.36-18.039-35.428-8.765-14.784,5.752a9.137,9.137,0,0,0,5.028,3.651c3.379.936,9.926-.384,9.926-.384l2.635.784-.424,1.385S200.619,230.624,212.536,231.6Z" transform="translate(-88.471 -126.117)" opacity="0.2" fill="url(#linear-gradient-5)"/>
    <path id="Path_605" data-name="Path 605" d="M137.222,197.289c-.32-.106-8.284-6.3-8.284-6.3s-6.248-7.158-9.348-8.442l3.206,5.878-16.028,2.244,1.148,3.1a5.409,5.409,0,0,0,5.072,3.528h12.265l7.694,6.519Z" transform="translate(-106.769 -133.447)" fill="#fff"/>
    <path id="Path_606" data-name="Path 606" d="M170.994,175.485,180.9,220.41l2.909-45.674Z" transform="translate(-85.046 -136.087)" fill="#fff"/>
    <path id="Path_607" data-name="Path 607" d="M183.059,220.087,168.347,194.45l4.225-4.722-7.947-7.588,8.056-6.448" transform="translate(-87.2 -135.764)" fill="none" stroke="#fff" stroke-width="0.508"/>
    <path id="Path_608" data-name="Path 608" d="M189.768,208.248c-.336-.039-9.412-4.452-9.412-4.452s-7.6-5.709-10.892-6.322l4.353,5.085L158.6,208.076l1.765,2.792a5.41,5.41,0,0,0,5.693,2.4l12-2.54,8.877,4.783Z" transform="translate(-89.237 -128.396)" fill="#ff9c91"/>
    <path id="Path_609" data-name="Path 609" d="M200.495,174.687c9.409,0,21.54,39.338,16.1,53.281s-41.861-6.858-41.861-6.858l3.942-9.352,25.449,6.915S187.118,174.687,200.495,174.687Z" transform="translate(-83.782 -136.104)" fill="#44474a"/>
  </g>
  <g id="Group_1198" data-name="Group 1198" transform="translate(30.49 18.869)">
    <path id="Path_610" data-name="Path 610" d="M153.951,193.769h-1.3V179.875a28.777,28.777,0,1,0-57.555,0v13.894H93.8a2.53,2.53,0,0,0-2.531,2.531v49.128a7.25,7.25,0,0,0,7.249,7.249h50.714a7.25,7.25,0,0,0,7.249-7.249V196.3A2.53,2.53,0,0,0,153.951,193.769Zm-49.658-13.894a19.582,19.582,0,1,1,39.165,0v13.894H104.293Z" transform="translate(-87.196 -148.372)" opacity="0.2" fill="url(#linear-gradient-6)"/>
    <g id="Group_1197" data-name="Group 1197">
      <g id="Group_1194" data-name="Group 1194" transform="translate(3.829)">
        <path id="Path_611" data-name="Path 611" d="M148.642,202.576H91.087V177.838a28.777,28.777,0,0,1,57.555,0Zm-48.36-9.194h39.165V177.838a19.582,19.582,0,0,0-39.165,0Z" transform="translate(-91.087 -149.061)" fill="#1f1e1d"/>
        <path id="Path_612" data-name="Path 612" d="M93.672,198.242V176.964a25.318,25.318,0,0,1,50.636,0v21.278Z" transform="translate(-90.213 -148.187)" fill="none" stroke="#fff" stroke-width="0.431"/>
      </g>
      <path id="Path_613" data-name="Path 613" d="M139.446,172.033v13.579H100.283V172.033h-9.2v22.773h57.555V172.033Z" transform="translate(-87.258 -141.291)" opacity="0.2" fill="url(#linear-gradient-7)"/>
      <g id="Group_1196" data-name="Group 1196" transform="translate(0 42.671)">
        <path id="Rectangle_1170" data-name="Rectangle 1170" d="M1.891,0H63.322a1.891,1.891,0,0,1,1.891,1.891v51.6A5.417,5.417,0,0,1,59.8,58.908H5.417A5.417,5.417,0,0,1,0,53.491V1.891A1.891,1.891,0,0,1,1.891,0Z" fill="url(#radial-gradient)"/>
        <g id="Group_1195" data-name="Group 1195" transform="translate(25.881 15.393)">
          <path id="Path_614" data-name="Path 614" d="M121.017,199.175a6.727,6.727,0,1,0-11.117,5.087,1.64,1.64,0,0,1,.531,1.653l-2.39,9.135a1.452,1.452,0,0,0,1.405,1.82H119.2a1.4,1.4,0,0,0,1.357-1.758l-2.406-9.2a1.617,1.617,0,0,1,.518-1.638A6.7,6.7,0,0,0,121.017,199.175Z" transform="translate(-107.565 -192.45)" opacity="0.79"/>
          <path id="Path_615" data-name="Path 615" d="M118.363,199.142a6.728,6.728,0,0,0-5.4-6.594,6.72,6.72,0,0,0-3.048,11.693,1.616,1.616,0,0,1,.517,1.637l-2.406,9.2a1.4,1.4,0,0,0,1.357,1.758h7.637a1.039,1.039,0,0,0,1-1.3L115.5,205.91a1.677,1.677,0,0,1,.534-1.692A6.7,6.7,0,0,0,118.363,199.142Z" transform="translate(-107.565 -192.416)"/>
        </g>
      </g>
    </g>
  </g>
  <g id="Group_1199" data-name="Group 1199" transform="translate(102.632 22.348)">
    <line id="Line_3" data-name="Line 3" y2="3.53" transform="translate(5.243)" fill="none" stroke="#fff" stroke-width="0.802"/>
    <line id="Line_4" data-name="Line 4" y2="3.53" transform="translate(5.243 6.956)" fill="none" stroke="#fff" stroke-width="0.802"/>
    <line id="Line_5" data-name="Line 5" x1="3.53" transform="translate(6.956 5.243)" fill="none" stroke="#fff" stroke-width="0.802"/>
    <line id="Line_6" data-name="Line 6" x1="3.53" transform="translate(0 5.243)" fill="none" stroke="#fff" stroke-width="0.802"/>
  </g>
  <g id="Group_1200" data-name="Group 1200" transform="translate(195.492 160.095)">
    <line id="Line_7" data-name="Line 7" y2="3.53" transform="translate(5.243)" fill="none" stroke="#fff" stroke-width="0.802"/>
    <line id="Line_8" data-name="Line 8" y2="3.53" transform="translate(5.243 6.956)" fill="none" stroke="#fff" stroke-width="0.802"/>
    <line id="Line_9" data-name="Line 9" x1="3.53" transform="translate(6.956 5.243)" fill="none" stroke="#fff" stroke-width="0.802"/>
    <line id="Line_10" data-name="Line 10" x1="3.53" transform="translate(0 5.243)" fill="none" stroke="#fff" stroke-width="0.802"/>
  </g>
  <g id="Group_1201" data-name="Group 1201" transform="translate(4.132 160.095)">
    <line id="Line_11" data-name="Line 11" y2="3.53" transform="translate(5.243)" fill="none" stroke="#fff" stroke-width="0.802"/>
    <line id="Line_12" data-name="Line 12" y2="3.53" transform="translate(5.243 6.956)" fill="none" stroke="#fff" stroke-width="0.802"/>
    <line id="Line_13" data-name="Line 13" x1="3.53" transform="translate(6.956 5.243)" fill="none" stroke="#fff" stroke-width="0.802"/>
    <line id="Line_14" data-name="Line 14" x1="3.53" transform="translate(0 5.243)" fill="none" stroke="#fff" stroke-width="0.802"/>
  </g>
  <g id="Group_1202" data-name="Group 1202" transform="translate(115.484 42.045)">
    <line id="Line_15" data-name="Line 15" y2="3.53" transform="translate(5.243)" fill="none" stroke="#fff" stroke-width="0.802"/>
    <line id="Line_16" data-name="Line 16" y2="3.53" transform="translate(5.243 6.956)" fill="none" stroke="#fff" stroke-width="0.802"/>
    <line id="Line_17" data-name="Line 17" x1="3.53" transform="translate(6.956 5.243)" fill="none" stroke="#fff" stroke-width="0.802"/>
    <line id="Line_18" data-name="Line 18" x1="3.53" transform="translate(0 5.243)" fill="none" stroke="#fff" stroke-width="0.802"/>
  </g>
</svg>
`;

export default props => (
  <SvgCss xml={xml} width="100%" height="100%" {...props} />
);
