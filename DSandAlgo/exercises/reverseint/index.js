// --- Directions
// Given an integer, return an integer that is the reverse
// ordering of numbers.
// --- Examples
//   reverseInt(15) === 51
//   reverseInt(981) === 189
//   reverseInt(500) === 5
//   reverseInt(-15) === -51
//   reverseInt(-90) === -9

console.log(myReverseInt(-110));

function myReverseInt(n) {
    var reversedNumber = n.toString().split('').reverse().join('');
    //parseInt removes "-" at the end of reversed string
    return parseInt(reversedNumber) * Math.sign(n);
}

module.exports = myReverseInt;
