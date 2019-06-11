// --- Directions
// Given a string, return the character that is most
// commonly used in the string.
// --- Examples
// maxChar("abcccccccd") === "c"
// maxChar("apple 1231111") === "1"


// Add the letter as key and the count of the character as value to a object
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

function formKeyValueObject2(str) {

	// Declare blank object
	const chars = {};

	for (let char of string){
		chars[char] = chars[char] + 1 || 1;
	}
}

function maxChar(str) {
	let max = 0;
	let maxChar = '';

	let charMap = formKeyValueObject1(str)
	// IMP: To iterate an object using "for", "in" is used instead of "or"
	// Iterate through all the key:value pairs and keep the max pair stored in variable 
	for (let key in charMap) {
		if(charMap[key] > max) {
			max = charMap[key];
			maxChar = key;
		}
	}

	console.log('max char:' + maxChar);
}

module.exports = maxChar;
