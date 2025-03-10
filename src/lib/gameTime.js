import moment from "moment-timezone";

export function gameTime(time) {
  // Convert the given UTC time to IST (Asia/Kolkata)
  const givenTime = moment(time).tz("Asia/Kolkata");
  const currentTime = moment().tz("Asia/Kolkata");
  // if (givenTime.isBefore(currentTime)) {
  //   console.log("expired");
  // }
  // Calculate the difference
  const diffSeconds = givenTime.diff(currentTime, "seconds");
  const diffMinutes = givenTime.diff(currentTime, "minutes");
  const diffHours = givenTime.diff(currentTime, "hours");
  const diffDays = givenTime.diff(currentTime, "days");

  // Format numbers with leading zeroes
  const formatNumber = (num) => num.toString().padStart(2, "0");

  // Display time based on conditions
  if (diffSeconds < 60) {
    return `${formatNumber(diffSeconds)}s`; // Show only seconds
  } else if (diffMinutes < 60) {
    return `${formatNumber(diffMinutes)}m ${formatNumber(diffSeconds - diffMinutes * 60)}s`; // Show minutes + seconds
  } else if (diffHours < 24) {
    return `${diffHours}h ${formatNumber(diffMinutes % 60)}m`; // Show hours + minutes
  } else {
    return `${diffDays}d`; // Show days only
  }
}

// else if (diffHours < 1) {
//   return `${formatNumber(diffMinutes)}m`; // Show minutes only
// }
