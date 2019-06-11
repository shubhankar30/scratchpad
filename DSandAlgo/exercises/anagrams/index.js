// --- Directions
// Check to see if two provided strings are anagrams of eachother.
// One string is an anagram of another if it uses the same characters
// in the same quantity. Only consider characters, not spaces
// or punctuation.  Consider capital letters to be the same as lower case
// --- Examples
//   anagrams('rail safety', 'fairy tales') --> True
//   anagrams('RAIL! SAFETY!', 'fairy tales') --> True
//   anagrams('Hi there', 'Bye there') --> False

function formKeyValueObject1(str) {

	// Declare blank object
	const chars = {};
	
	// Check if character exists at key
	for (let char of string){
		if(!chars[char]){
			chars[char] = 1;
		} else {
			chars[char]++;
		}
	}

	return chars;
}

function anagrams(stringA, stringB) {
  let objectMapA = formKeyValueObject1(stringA);
  let objectMapB = formKeyValueObject1(stringB);

  console.log('init');
  console.log(objectMapA);
  console.log(objectMapB);


}

module.exports = anagrams;
