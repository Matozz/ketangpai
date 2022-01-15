const globalData = {};

const set = (key: any, val: any) => {
  globalData[key] = val;
};

const get = (key: any) => {
  return globalData[key];
};

export { set as setGlobalData, get as getGlobalData };
