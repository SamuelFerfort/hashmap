class HashMap {
  constructor() {
    this.capacity = 16;
    this.load_factor = 0.75;
    this.buckets = Array(this.capacity);
  }
  hash(key) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = primeNumber * hashCode + key.charCodeAt(i);
    }

    return hashCode % this.capacity;
  }

  set(key, value) {
    const index = this.hash(key);
    if (index < 0 || index >= this.buckets.length) {
      throw new Error("Trying to access index out of bound");
    }
    let bucket = this.buckets;
    if (!bucket[index]) {
      bucket[index] = Node(key, value);
      return;
    }
    let node = bucket[index];
    for (; node; node = node.next) {
      if (node.key == key) {
        node.value = value;
        return;
      }
    }
    let newNode = Node(key, value, bucket[index]);
    bucket[index] = newNode;

    if (this.length() >= this.capacity * this.load_factor) {
      this.resize();
    }
  }
  resize() {
    const oldEntries = this.entries();

    this.capacity *= 2;
    this.buckets = Array(this.capacity);

    for (const entry of oldEntries) {
      this.set(entry.key, entry.value);
    }
  }

  get(key) {
    const index = this.hash(key);
    if (index < 0 || index >= this.buckets.length) {
      throw new Error("Trying to access index out of bound");
    }
    const bucket = this.buckets[index];
    for (let node = bucket; node; node = node.next) {
      if (node.key === key) return node.value;
    }
    return null;
  }

  has(key) {
    const index = this.hash(key);
    if (index < 0 || index >= this.buckets.length) {
      throw new Error("Trying to access index out of bound");
    }
    const bucket = this.buckets[index];
    for (let node = bucket; node; node = node.next) {
      if (node.key === key) return true;
    }
    return false;
  }
  remove(key) {
    const index = this.hash(key);
    if (index < 0 || index >= this.buckets.length) {
      throw new Error("Trying to access index out of bound");
    }
    let bucket = this.buckets;
    if (!this.has(key)) return false;

    if (bucket[index].key === key) {
      bucket[index] = bucket[index].next;
      return true;
    }
    for (let node = bucket[index]; node; node = node.next) {
      if (node.next.key === key) {
        node.next = node.next.next || null;
        return true;
      }
    }
    return false;
  }
  length() {
    let count = 0;
    for (const bucket of this.buckets) {
      let node = bucket;
      while (node) {
        count++;
        node = node.next;
      }
    }
    return count;
  }
  clear() {
    this.buckets = Array(this.capacity);
  }
  keys() {
    let keys = [];
    for (const bucket of this.buckets) {
      let node = bucket;
      while (node) {
        keys.push(node.key);
        node = node.next;
      }
    }
    return keys;
  }

  values() {
    let values = [];
    for (const bucket of this.buckets) {
      let node = bucket;
      while (node) {
        values.push(node.value);
        node = node.next;
      }
    }
    return values;
  }
  entries() {
    let entries = [];
    for (const bucket of this.buckets) {
      let node = bucket;
      while (node) {
        entries.push(node);
        node = node.next;
      }
    }
    return entries;
  }
}

function Node(key, value, next = null) {
  return {
    key,
    value,
    next,
  };
}

const myMap = new HashMap();

myMap.set("apple", 10);
myMap.set("banana", 20);
myMap.set("cherry", 30);

// Check if keys exist
console.log("Does 'apple' exist in the map?", myMap.has("apple")); // Should print: true
console.log("Does 'grape' exist in the map?", myMap.has("grape")); // Should print: false

// Retrieve values
console.log("Value for 'apple':", myMap.get("apple")); // Should print: 10
console.log("Value for 'banana':", myMap.get("banana")); // Should print: 20
console.log("Value for 'grape':", myMap.get("grape")); // Should print: null

// Test removing a key-value pair
console.log("Removing 'banana':", myMap.remove("banana")); // Should print: true
console.log("Does 'banana' exist in the map now?", myMap.has("banana")); // Should print: false

// Check length and capacity
console.log("Length of the map:", myMap.length()); // Should print: 2
console.log("Current capacity of the map:", myMap.capacity); // Should print: 16

// Clear the map
myMap.clear();
console.log("Length of the map after clearing:", myMap.length()); // Should print: 0

// Add some more key-value pairs
myMap.set("grape", 40);
myMap.set("orange", 50);
myMap.set("kiwi", 60);

// Retrieve keys and values
console.log("Keys in the map:", myMap.keys()); // Should print: ['grape', 'orange', 'kiwi']
console.log("Values in the map:", myMap.values()); // Should print: [40, 50, 60]

// Retrieve all entries
console.log("Entries in the map:", myMap.entries());
myMap.clear();

// Check resizing
console.log("Current capacity of the map:", myMap.capacity); // Should print: 16
// Should resize after 12 items
for (let i = 0; i < 12; i++) {
  myMap.set(`key${i}`, i);
}

console.log("Current capacity of the map after filling:", myMap.capacity); // Should print: 16

// Add one more entry to trigger resizing
myMap.set("newKey", 123);

console.log("Current capacity of the map after resizing:", myMap.capacity); // Should print: >= 32
console.log("Value for 'key0':", myMap.get("key0")); // Should print: 0
console.log("Value for 'newKey':", myMap.get("newKey")); // Should print: 123
