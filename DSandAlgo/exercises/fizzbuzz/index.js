// --- Directions
// Write a program that console logs the numbers
// from 1 to n. But for multiples of three print
// “fizz” instead of the number and for the multiples
// of five print “buzz”. For numbers which are multiples
// of both three and five print “fizzbuzz”.
// --- Example
//   fizzBuzz(5);
//   1
//   2
//   fizz
//   4
//   buzz

// fizzBuzz1(32);
fizzBuzz2(32);

function fizzBuzz2(n) {
  for(let i = 1;i <= n;i++) {

    if(i % 3 == 0) {
      console.log("Fizz");
      if (!(i % 5 == 0)) {
        continue;
      }
    }

    if(i % 5 == 0){
      console.log("Buzz");
      continue;
    }
    console.log(i);
  }
}

function fizzBuzz1(n) {
  for(let i = 1;i <= n;i++) {
    if((i % 3 == 0) && !(i % 5 == 0)){
      console.log("Fizz");
    } else if(!(i % 3 == 0) && (i % 5 == 0)){
      console.log("Buzz");
    } else if( (i % 3 == 0) && (i % 5 == 0)) {
      console.log("FizzBuzz");
    } else {
      console.log(i);
    }
  }  
}

module.exports = fizzBuzz1;
