function checkLength (string, maxlength) {
  return string.length <= maxlength;
}

//tests
// console.log(checkLength('проверяемая строка', 20));
// console.log(checkLength('проверяемая строка', 18))；
// console.log(checkLength('проверяемая строка', 10));
checkLength('проверяемая строка', 20);


function IsPalindrome (string) {
  string = string.replaceAll(' ', '').toLowerCase();
  const normalizedString = string;
  let reversedString = '';

  for (let i = string.length - 1; i >= 0; i--) {
    reversedString += normalizedString.at(i);
  }

  return reversedString === string;
}

IsPalindrome('топот');

function findNumbers (string) {
  string = String(string);
  let number = '';

  for (let i = 0; i < string.length; i++) {
    if (!isNaN(parseInt(string.at(i), 10))) {
      number += string.at(i);
    }
  }

  return number === '' ? NaN : Number(number);
}

findNumbers('2023 год');
