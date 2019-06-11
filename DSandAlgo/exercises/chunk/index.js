// --- Directions
// Given an array and chunk size, divide the array into many subarrays
// where each subarray is of length size
// --- Examples
// chunk([1, 2, 3, 4], 2) --> [[ 1, 2], [3, 4]]
// chunk([1, 2, 3, 4, 5], 2) --> [[ 1, 2], [3, 4], [5]]
// chunk([1, 2, 3, 4, 5, 6, 7, 8], 3) --> [[ 1, 2, 3], [4, 5, 6], [7, 8]]
// chunk([1, 2, 3, 4, 5], 4) --> [[ 1, 2, 3, 4], [5]]
// chunk([1, 2, 3, 4, 5], 10) --> [[ 1, 2, 3, 4, 5]]
let valueArray = [4,5,6,7,8,9,10,11,12,13,14];
let limit = 3;
chunk2(valueArray, limit);


function chunk2(array, size) {
  let temp = [];
  let temp2 = [];
  let start = 0;
  let index = 0;

  while(index<array.length){
    temp.push(array.slice(index, index + size));
    index = index + size;
  }

  console.log("RESULT is:")
  console.log(temp)
  
}

function chunk(array, size) {
  let temp = [];
  let temp2 = [];
  let counter = 0;
  for(let i = 0; i < array.length; i++){
    console.log(array[i]);
    if(counter < size){
      console.log('counter:' + counter);
      temp2.push(array[i]);
      counter++;
      if(i == array.length - 1){
        temp.push(temp2);
      }
    } else {
      console.log('iteration')
      console.log(temp2);
      temp.push(temp2);
      temp2=[];
      counter = 0;
      i--;
    }
  }

  console.log("RESULT");
  console.log(temp);
}

module.exports = chunk;
