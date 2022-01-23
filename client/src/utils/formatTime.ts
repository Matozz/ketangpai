export default function formatTime(date) {
  let formatedTime = "yyyy-MM-dd hh:mm:ss";
  const o = {
    "M+": date.getMonth() + 1, // 月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分钟
    "s+": date.getSeconds() //秒
  };

  if (/(y+)/.test(formatedTime)) {
    formatedTime = formatedTime.replace(RegExp.$1, date.getFullYear());
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(formatedTime)) {
      formatedTime = formatedTime.replace(
        RegExp.$1,
        o[k].toString().length == 1 ? "0" + o[k] : o[k]
      );
    }
  }
  // console.log(formatedTime)
  return formatedTime;
}
