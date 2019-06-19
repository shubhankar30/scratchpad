// --- Directions
// Write a function that accepts a string.  The function should
// capitalize the first letter of each word in the string then
// return the capitalized string.
// --- Examples
//   capitalize('a short sentence') --> 'A Short Sentence'
//   capitalize('a lazy fox') --> 'A Lazy Fox'
//   capitalize('look, it is working!') --> 'Look, It Is Working!'

capitalize('this is my! string')

function capitalize(str) {
  
  let capitalizedArray = [];
  let temp = str.split(' ');
  console.log(temp);

 for(const word of temp) {
    let firstLetter = word.slice(0,1);
    let remainingWord = word.slice(1, word.length);
    firstLetter = firstLetter.toUpperCase();
    capitalizedArray.push(firstLetter.concat(remainingWord));
  }
  const capitalizedString = capitalizedArray.join(' ');

  console.log('RESULT');
  console.log(capitalizedString)
}

module.exports = capitalize;
