
var a = [
  ['a', 'aa', 'aaa', 'aaaa'],
  ['a', 'aa', 'aab', 'aaaa'],
  ['b', 'bb', 'bbb', 'bbbb'],
]

let ret = []

function addToArr(arr, [first, ...rest]) {
  let foundObj = arr.filter(item => item.name === first);
  if (foundObj.length > 0) {
    if (rest.length > 0) {
      addToArr(foundObj[0].child, rest);
    }
  } else {
    let o = {
      name: first,
      child: []
    };
    if (rest.length > 0) {
      addToArr(o.child, rest)
    }
    arr.push(o)
  }
}

for(i=0; i<a.length; i++) {
  addToArr(ret, a[i]);
}

console.log(JSON.stringify(ret[0]));


function Node([name, ...children]) {
  this.name = name;
  if (children.length === 0) {
    this.child = [];
  } else {
    this.child = [];
    this.child.push(new Node(children));
  }
}

Node.prototype.addChild = function([name, ...children]) {
  let foundChild = this.child.filter(item => item.name === name);
  if (foundChild.length > 0) {
    if (children.length > 0) {
      foundChild[0].addChild(children);
    }
  } else {
    let o = new Node([name]);
    children.length > 0 && o.addChild(children);
    this.child.push(o);
  }
}


let top = new Node(['top']);
for(let i=0; i<a.length; i++) {
  top.addChild(a[i]);
}
console.log(top);
console.log(JSON.stringify(top.child));

console.log(JSON.stringify(top.child) == JSON.stringify(ret))


// set去重复