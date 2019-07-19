// --- Description
// Create a queue data structure.  The queue
// should be a class with methods 'add' and 'remove'.
// Adding to the queue should store an element until
// it is removed
// --- Examples
//     const q = new Queue();
//     q.add(1);
//     q.remove(); // returns 1;

class Queue {

  constructor(){
    this.data = [];
  }

  add(element){
    // Adds new element to the start of the array
    this.data.unshift(element);
  }

  remove(){
    // Pop out the last element which will essentially be the first one
    this.data.pop();
  }

  print(){
    console.log('print');
    console.log(this.data);
  }
}

const temp = new Queue;
temp.add(10);
temp.add(20);
temp.add(30);
temp.add(40);

temp.remove();
console.log("ANSWER");
console.log(temp.print());

module.exports = Queue;
