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
    let bucket = this.buckets[index];
    if (bucket.length === 0) return (bucket = Node(key, value));
    let node = bucket;
    for (; node; node = node.next) {
      if (node.key === key) {
        node.value = value;
        return;
      }
    }

    node.next = Node(key, value);

    if (this.length() / this.capacity > this.load_factor) {
      this.capacity *= 2;
      const oldEntries = this.entries();
      this.buckets = Array(this.capacity);
      for (const [oldKey, oldValue] of oldEntries) {
        this.set(oldKey, oldValue);
      }
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
    let bucket = this.buckets[index];
    if (!this.has(key)) return false;

    if (bucket.key === key) {
      bucket = bucket.next;
      return true;
    }
    for (let node = bucket; node; node = node.next) {
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
    let entries = [];
    for (const bucket of this.buckets) {
      let node = bucket;
      while (node) {
        entries.push([node.key, node.value]);
        node = node.next;
      }
    }
    return keys;
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
