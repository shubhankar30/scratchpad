// --- Directions
// Write a function that accepts a string.  The function should
// capitalize the first letter of each word in the string then
// return the capitalized string.
// --- Examples
//   capitalize('a short sentence') --> 'A Short Sentence'
//   capitalize('a lazy fox') --> 'A Lazy Fox'
//   capitalize('look, it is working!') --> 'Look, It Is Working!'

capitalize3('this is my! string')

function capitalize1(str) {
  
  let capitalizedArray = [];
  let temp = str.split(' ');

 for(let word of temp) {
    let firstLetter = word.slice(0,1);
    let remainingWord = word.slice(1, word.length);
    firstLetter = firstLetter.toUpperCase();
    capitalizedArray.push(firstLetter.concat(remainingWord));
  }
  const capitalizedString = capitalizedArray.join(' ');

  console.log('RESULT');
  console.log(capitalizedString)
}

// Divide the words in array
// Traverse array and capitalize each starting letter of array
function capitalize2 (string) {
  const words = [];

  for (let word of string.split(' ')) {
    words.push(word[0].toUpperCase() + word.slice(1));
  }

  words.join(' ');
  console.log("RESULT");
  console.log(words);
}

// Detect ' ' (spaces) in string and capitalize the letter after the space and add it to array.
function capitalize3(string) {

  let capitalizeNext = true;
  let array = string.split('');

  let temp = [];
  for(let i = 0; i< array.length; i++){
    if(capitalizeNext){
      temp.push(array[i].toUpperCase());
    } else {
      temp.push(array[i]);
    }

    if(array[i] === ' '){
      capitalizeNext = true;
    } else {
      capitalizeNext = false;
    }

  }

  console.log("RESULT1");
  console.log(temp.join(''));

}

module.exports = capitalize3;
