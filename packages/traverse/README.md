# Traverse

## Usage

The Traverse class is a simple way to traverse a JSON object. It can be used to find a specific value, or to modify the object with either the "forEach" or "map" methods.

### Example

Using the "forEach" method to modify the object:

```javascript
// Using the "forEach" method to modify the object
import { traverse } from "@json/traverse

const data = {
  name: "John",
  age: 30,
  cars: {
    car1: "Ford",
    car2: "BMW",
    car3: "Fiat"
  }
};

const result = traverse(data).forEach((value, node) => {
  if (node.key === "car1") {
    node.update("Toyota")
  }
});

console.log(result);

const isEqual = data === result; // true (data is mutated)
```

Likewise, using the "map" method to modify the object:

```javascript
// Using the "map" method to create a modified
import { traverse } from "@json/traverse

const data = {
  name: "John",
  age: 30,
  cars: {
    car1: "Ford",
    car2: "BMW",
    car3: "Fiat"
  }
};

const result = traverse(data).map((value, node) => {
  if (node.key === "car1") {
    node.update("Toyota")
  }
});

console.log(result);

const isEqual = data === result; // false (result is a new object)
```
