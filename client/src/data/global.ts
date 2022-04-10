const globalData = {
  USERINFO: null,
  BINDED: null,
  COURSE_CHECKIN: null,
  COURSE_INFO: null
};

const set = (key: any, val: any) => {
  globalData[key] = val;
};

const get = (key: any) => {
  return globalData[key];
};

export { set as setGlobalData, get as getGlobalData };
