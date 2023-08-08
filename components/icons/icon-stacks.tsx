/**
 * Copyright 2020 Vercel Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

type Props = {
  size?: number;
};

export default function IconStacks({ size = 22 }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      id="svg"
      version="1.1"
      viewBox="0, 0, 400,400">
      <g id="svgg">
        <path id="path0" d="M115.926 95.450 C 116.009 95.588,125.559 110.595,137.148 128.800 L 158.220 161.900 127.910 161.951 L 97.600 162.001 97.600 174.801 L 97.600 187.600 157.150 187.600 C 189.903 187.600,235.532 187.540,258.550 187.467 L 300.400 187.334 300.400 174.667 L 300.400 162.001 270.094 161.951 L 239.789 161.900 260.608 129.200 C 272.058 111.215,281.608 96.208,281.830 95.850 L 282.233 95.200 266.148 95.200 L 250.064 95.200 224.596 135.400 C 210.589 157.510,199.071 175.600,199.002 175.600 C 198.932 175.600,187.415 157.510,173.409 135.400 L 147.943 95.200 131.860 95.200 C 119.046 95.200,115.807 95.251,115.926 95.450 M97.600 225.100 L 97.600 237.800 128.500 237.800 C 145.495 237.800,159.400 237.836,159.400 237.880 C 159.400 237.924,149.804 253.022,138.076 271.430 C 126.348 289.839,116.708 305.013,116.654 305.151 C 116.576 305.352,119.769 305.392,132.498 305.351 L 148.441 305.300 173.612 265.800 C 187.457 244.075,198.882 226.300,199.002 226.300 C 199.123 226.300,210.548 244.075,224.393 265.800 L 249.565 305.300 265.504 305.351 C 278.231 305.392,281.424 305.352,281.347 305.151 C 281.294 305.013,271.654 289.836,259.925 271.425 C 248.196 253.014,238.600 237.916,238.600 237.875 C 238.600 237.834,252.505 237.800,269.500 237.800 L 300.400 237.800 300.400 225.100 L 300.400 212.400 199.000 212.400 L 97.600 212.400 97.600 225.100 " stroke="none" fill="#fbfbfc" fill-rule="evenodd" /><path id="path1" d="M190.100 0.136 C 83.460 5.514,0.029 93.213,0.002 199.958 C -0.026 310.667,89.285 399.996,200.000 399.996 C 325.902 399.996,420.387 285.293,396.374 161.600 C 377.474 64.247,289.186 -4.861,190.100 0.136 M173.406 135.200 C 187.414 157.310,198.931 175.400,199.002 175.400 C 199.072 175.400,210.590 157.310,224.598 135.200 L 250.066 95.000 266.233 95.000 C 275.125 95.000,282.400 95.038,282.400 95.084 C 282.400 95.131,272.868 110.138,261.218 128.434 L 240.037 161.700 270.218 161.751 L 300.400 161.801 300.400 174.701 L 300.400 187.600 260.533 187.600 C 238.607 187.600,192.977 187.660,159.133 187.733 L 97.600 187.866 97.600 174.834 L 97.600 161.801 127.785 161.751 L 157.969 161.700 136.785 128.433 C 125.133 110.137,115.600 95.129,115.600 95.083 C 115.600 95.038,122.876 95.000,131.769 95.000 L 147.939 95.000 173.406 135.200 M300.400 224.999 L 300.400 237.799 269.546 237.849 L 238.692 237.900 260.146 271.578 C 271.946 290.101,281.600 305.289,281.600 305.328 C 281.600 305.368,274.377 305.400,265.550 305.400 L 249.500 305.399 224.331 265.900 C 210.488 244.175,199.090 226.400,199.002 226.400 C 198.915 226.400,187.516 244.175,173.672 265.900 L 148.502 305.400 132.446 305.400 L 116.390 305.400 116.687 304.850 C 116.851 304.548,126.508 289.360,138.149 271.100 L 159.314 237.900 128.457 237.849 L 97.600 237.799 97.600 224.999 L 97.600 212.200 199.000 212.200 L 300.400 212.200 300.400 224.999 " stroke="none" fill="#5444fc" fill-rule="evenodd" /><path id="path2" d="M112.650 161.950 C 120.983 161.979,134.618 161.979,142.950 161.950 C 151.283 161.921,144.465 161.897,127.800 161.897 C 111.135 161.897,104.318 161.921,112.650 161.950 M255.050 161.950 C 263.383 161.979,277.018 161.979,285.350 161.950 C 293.683 161.921,286.865 161.897,270.200 161.897 C 253.535 161.897,246.718 161.921,255.050 161.950 M155.035 187.750 C 159.509 187.780,166.889 187.780,171.435 187.750 C 175.981 187.720,172.320 187.695,163.300 187.695 C 154.280 187.695,150.561 187.720,155.035 187.750 " stroke="none" fill="#8c81fc" fill-rule="evenodd" /><path id="path3" d="M123.750 95.150 C 128.178 95.180,135.423 95.180,139.850 95.150 C 144.278 95.120,140.655 95.095,131.800 95.095 C 122.945 95.095,119.323 95.120,123.750 95.150 M258.150 95.150 C 262.578 95.180,269.823 95.180,274.250 95.150 C 278.678 95.120,275.055 95.095,266.200 95.095 C 257.345 95.095,253.722 95.120,258.150 95.150 M290.850 187.550 C 292.582 187.583,295.418 187.583,297.150 187.550 C 298.882 187.516,297.465 187.489,294.000 187.489 C 290.535 187.489,289.118 187.516,290.850 187.550 M130.836 187.750 C 133.771 187.781,138.631 187.781,141.636 187.750 C 144.641 187.719,142.240 187.693,136.300 187.693 C 130.360 187.693,127.901 187.719,130.836 187.750 " stroke="none" fill="#a49bfc" fill-rule="evenodd" /><path id="path4" d="M255.350 187.550 C 261.317 187.579,271.082 187.579,277.050 187.550 C 283.017 187.521,278.135 187.496,266.200 187.496 C 254.265 187.496,249.382 187.521,255.350 187.550 M104.550 187.750 C 108.428 187.780,114.772 187.780,118.650 187.750 C 122.528 187.720,119.355 187.695,111.600 187.695 C 103.845 187.695,100.673 187.720,104.550 187.750 M148.250 212.350 C 176.163 212.378,221.838 212.378,249.750 212.350 C 277.663 212.322,254.825 212.299,199.000 212.299 C 143.175 212.299,120.338 212.322,148.250 212.350 " stroke="none" fill="#aca5fc" fill-rule="evenodd" />
      </g>
    </svg>
  );
}
