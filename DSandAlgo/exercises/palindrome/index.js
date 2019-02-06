// --- Directions
// Given a string, return true if the string is a palindrome
// or false if it is not.  Palindromes are strings that
// form the same word if it is reversed. *Do* include spaces
// and punctuation in determining if the string is a palindrome.
// --- Examples:
//   palindrome("abba") === true
//   palindrome("abcdefg") === false

console.log(palindrome1("asdsa"));

//Compare the first element to the last element of the string until the loop reaches the mid term
function myPalindrome(str) {
let arr = str.split('');
let j = arr.length-1;
let boolPalindrome = true;

    for(var i = 0;i<=j;i++){
        if(arr[i]!==arr[j]){
            boolPalindrome = false;
        }
        j--;
    }

return boolPalindrome;
}

//Reverse the string and compare original string and reversed string
function palindrome1(str){
    let reversedString = str.split('').reverse().join('');
    return reversedString === str;
}

function palindrome2(str){
    return str.split('').every((char, i)=>{
        return char === str[str.length - i - 1];
    });
}

module.exports = palindrome1;
