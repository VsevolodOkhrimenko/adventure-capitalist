export function getDateDiff(oldDate, newDate) {
  return newDate - oldDate
}

export function pad(n, z) {
  z = z || 2;
  return ('00' + n).slice(-z);
}

export function msToTime(s) {
  const ms = s % 1000;
  s = (s - ms) / 1000;
  const secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;
  const hrs = (s - mins) / 60;
  return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
}

export function msToseconds(s) {
  const ms = s % 1000;
  const secs = (s - ms) / 1000;
  return parseInt(secs);
}
