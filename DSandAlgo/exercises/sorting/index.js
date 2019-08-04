// --- Directions
// Implement bubbleSort, selectionSort, and mergeSort

function bubbleSort(arr) {
    for(let i = 0; i<arr.length; i++) {
        for(let j = 0; j< (arr.length -i -1); j++){
            if(arr[j]>arr[j+1]){
                let temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
    return arr;
}

function selectionSort(arr) {

}

function mergeSort(arr) {

}

function merge(left, right) {

}

let arr = [9,8,7,6,4,3,2];

let yolo = bubbleSort(arr)
console.log(yolo);
module.exports = { bubbleSort, selectionSort, mergeSort, merge };
