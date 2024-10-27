const checkLength = (string, maxLength) => string.length <= maxLength;

function isPalindrome(string) {
  const normalizedString = string.replaceAll(' ','').toLowerCase();
  let newString = '';
  for (let i = normalizedString.length - 1; i >= 0; i--) {
    newString += normalizedString[i];
  }
  return (newString === normalizedString);
}

function getDigitsFromString(string) {
  let digit = '';
  for (let i = 0; i <= String(string).length - 1; i++) {
    const currentSymbol = String(string)[i];
    if (!isNaN(currentSymbol) && currentSymbol !== ' ') {
      digit += currentSymbol;
    }
  }
  return digit.length === 0 ? NaN : digit;
}

const getTimeInMinutes = (time) => {
  const hoursAndMinutes = time.split(':');
  return Number(hoursAndMinutes[0]) * 60 + Number(hoursAndMinutes[1]);
};

function checkMeetingTime(workStart, workEnd, meetingStart, duration) {
  const meetingStartInMinutes = getTimeInMinutes(meetingStart);
  return meetingStartInMinutes >= getTimeInMinutes(workStart) &&
  meetingStartInMinutes + duration <= getTimeInMinutes(workEnd);
}

checkMeetingTime();
getDigitsFromString();
isPalindrome();
checkLength();
