export { default as getContainerHeight } from "./getContainerHeight";
export { default as formatTime } from "./formatTime";
export { default as countdownTime } from "./countdownTime";
export { default as getRandomNumber } from "./getRandomNumber";
export { default as getDistance } from "./getDistance";

export const getCurrentTime = () => {
  const v = new Date();
  return new Date(
    v.getFullYear() +
      "/" +
      (v.getMonth() + 1) +
      "/" +
      v.getDate() +
      " " +
      v.getHours() +
      ":" +
      v.getMinutes()
  ).getTime();
};

export const formatBytes = (a, b?) => {
  if (0 == a) return "0 B";
  var c = 1024,
    d = b || 2,
    e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    f = Math.floor(Math.log(a) / Math.log(c));
  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
};
