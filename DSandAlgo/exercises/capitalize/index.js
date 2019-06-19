// --- Directions
// Write a function that accepts a string.  The function should
// capitalize the first letter of each word in the string then
// return the capitalized string.
// --- Examples
//   capitalize('a short sentence') --> 'A Short Sentence'
//   capitalize('a lazy fox') --> 'A Lazy Fox'
//   capitalize('look, it is working!') --> 'Look, It Is Working!'

capitalize('this is my string')
function capitalize(str) {
  
  for(let i =0; i <str.length; i++) {
    if(str.charAt(i) == " "){
      console.log(str.charAt(i+1));
      str[i+1] = str.charAt(i+1).toUpperCase();
    }
  }

  console.log('RESULT');
  console.log(str)
}

module.exports = capitalize;
