function formatDate(miliseconds) {
  const date = new Date(miliseconds);
  return `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function logError(username, err, now) {
  console.log(err);
  console.log(
    `ERROR | ${username} | ${now} | ${
      err.toString() || err.fullStack || err.message
    }`
  );
}

export default function log(username, message, level = "debug") {
  const now = Date.now();
  const prettyNow = formatDate(now)
  if (level === "error") {
    logError(username, message, prettyNow);
  } else {
    console.log(
      `${level.toUpperCase()} | ${username} | ${prettyNow} | ${message}`
    );
  }
}
