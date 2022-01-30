const rad = d => {
  return (d * Math.PI) / 180.0;
};

// 根据经纬度计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
export default function getDistance(lat1, lng1, lat2, lng2) {
  const radLat1 = rad(lat1);
  const radLat2 = rad(lat2);
  const a = radLat1 - radLat2;
  const b = rad(lng1) - rad(lng2);
  let s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
      )
    );
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10; //输出为公里

  return s;
}
