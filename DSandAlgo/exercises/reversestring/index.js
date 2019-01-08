// --- Directions
// Given a string, return a new string with the reversed
// order of characters

console.log(reverse1("asds"));
console.log(reverse2("asds"));
console.log(reverse3("asds"));
console.log(reverse4("asds"));

//Convert String to array -> Reverse it -> Convert it back to string


function reverse1(str) {
    //Concise version:
    // return str.split('').reverse().join('');
    var arr = str.split('');
    arr.reverse();
    return arr.join('');
}

function reverse2(str){

    let reversedString = '';

    //Instead of traditional for loop, use of. Iterates every character in string 
    for(let character of str){
        reversedString = character + reversedString;
    }
    return reversedString;
}

function reverse3(str){
    //Reduce used o combine the array elements in a singular element
    return str.split('').reduce((reversedString, character)=> {
        return character + reversedString;
    }, '');
}


function myReverse(str){
    //Copying the elements from the main array to a different array.
    var arr = str.split('');
    var arr2 = [];
    var j =0;
    //Copy the last character of first array to first character of reversedArray
    for(var i = arr.length-1;i>=0;i--){
        arr2[j] = arr[i];
        j++;
    }
    return arr2.join('');
}

module.exports = reverse1;
