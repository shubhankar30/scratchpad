// --- Directions
// Write a function that accepts a positive number N.
// The function should console log a step shape
// with N levels using the # character.  Make sure the
// step has spaces on the right hand side!
// --- Examples
//   steps(2)
//       '# '
//       '##'
//   steps(3)
//       '#  '
//       '## '
//       '###'
//   steps(4)
//       '#   '
//       '##  '
//       '### '
//       '####'

function steps1(n) {
  for (let i = 0; i < n; i++) {
    let line = "";
    for (let j = 0; j < n; j++) {
      if (j <= i){
        line = line + "#";
      } else {
        line = line + "$";
      }
    }
    console.log(line);
  }
}

function steps(n) {
  for(let i = 1; i <= n; i++) {
    let line = "";
    for(let j = 0; j < i; j++) {
      line = line + "#";
    }
    for(let j = 0; j<(n-i); j++) {
      line = line + "$";
    }
    console.log(line);
  }

}

steps1(4);

module.exports = steps;
