// --- Directions
// Write a function that accepts a positive number N.
// The function should console log a pyramid shape
// with N levels using the # character.  Make sure the
// pyramid has spaces on both the left *and* right hand sides
// --- Examples
//   pyramid(1)
//       '#'
//   pyramid(2)
//       ' # '
//       '###'
//   pyramid(3)
//       '  #  '
//       ' ### '
//       '#####'

function pyramid(n) {

  const midpoint = Math.floor((2 * n -1) / 2 );
  
  // i is number of Rows if you consider a matrix
  // j is columns
  for(let i = 0; i< n; i++){
    let lineString = "";
    // Find a relation between row and n.
    // In this case columns = 2 * n - 1
    for(let j =0; j< 2 * n -1; j++){
      // Take row(i) number of elements on either side of midpoint
      if (midpoint -i <= j && midpoint + i >= j){
        lineString += '#';
      } else {
        lineString += '$';
      }
    }
    console.log(lineString);
  }
}

pyramid(5);

module.exports = pyramid;
