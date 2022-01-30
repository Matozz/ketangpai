export default function countdownTime(finishTime: string) {
  let finishTimestamp = new Date(finishTime).getTime();

  let seconds = 0,
    minutes = 0,
    hours = 0,
    milliseconds = 0,
    isFinished = false;

  if (Date.now() < finishTimestamp) {
    milliseconds = Math.floor(finishTimestamp - Date.now());

    let second = Math.floor(milliseconds / 1000);
    hours = Math.floor((second / 3600) % 60);
    minutes = Math.floor((second / 60) % 60);
    seconds = Math.floor(second % 60);
  } else {
    isFinished = true;
  }

  return { part: { hours, minutes, seconds }, milliseconds, isFinished };
}
