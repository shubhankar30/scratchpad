// --- Directions
// Check to see if two provided strings are anagrams of eachother.
// One string is an anagram of another if it uses the same characters
// in the same quantity. Only consider characters, not spaces
// or punctuation.  Consider capital letters to be the same as lower case
// --- Examples
//   anagrams('rail safety', 'fairy tales') --> True
//   anagrams('RAIL! SAFETY!', 'fairy tales') --> True
//   anagrams('Hi there', 'Bye there') --> False

console.log(anagrams2('rail safety', 'fairy tales'));


function formKeyValueObject(string) {

	// Declare blank object
	const chars = {};
	
	// Check if character exists at key
	// Clean string
	for (let key of string.replace(/[^\w]/g, '').toLowerCase()) {
		console.log(key);
		if (!chars[key]) {
			chars[key] = 1;
		} else {
			chars[key]++;
		}
	}

	return chars;
}

/*
 The solution to Anagrams (Check if two strings have same number of same characters)
 is to form Key-Value pairs of characters and their occurence and compare the pairs.
 The problem with this is the order of the keys changes so,
 2 for loops would be necessary. 1 in order to traverse the first pair and other to
 traverse all elements of the other one.
	
 This can be solved by many ways.
 
 1. Compare the lengths of the two key value maps
 2. Check if the keys are same

 3. Sorting the strings before so that the characters would be in the 
 same order in the Key-Value pairs.
*/

function anagrams1(stringA, stringB) {
  let objectMapA = formKeyValueObject(stringA);
  let objectMapB = formKeyValueObject(stringB);

  console.log('init');
  console.log(objectMapA);
  console.log(objectMapB);

	// Different number of keys
	// Check if number of characters is same
	if (Object.keys(objectMapA).length !== Object.keys(objectMapB).length){
		return false;
	}
	
	// Check the number of occurences of keys (values)
	for( let key in objectMapA){
		if (objectMapA[key] !== objectMapB[key]){
			return false;
		}
	}

	return true;
}

function cleanString(string) {
	return string.replace(/[^\w]/g, '').toLowerCase().split('').sort().join();
}

function anagrams2(stringA, stringB) {
	return cleanString(stringA) === cleanString(stringB);
}

module.exports = anagrams2;
