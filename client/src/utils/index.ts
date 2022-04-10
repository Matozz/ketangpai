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
