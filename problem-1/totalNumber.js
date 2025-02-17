//Iterative Approach (Loop)
// Time Complexity: O(n)
// The loop runs from 1 to `n`, performing `n` additions, making it linear in terms of n.
// Pros:
    // Simple and straightforward implementation.
    // Efficient for small to medium values of `n`.
// Cons:
    // As n grows very large, the runtime increases linearly.
const sum_to_n_a = (n) => {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};


//Recursive Approach
// Time Complexity: O(n)
// Pros:
    // Elegant and concise.
// Cons:
// Not memory efficient.
    // Risk of stack overflow with large `n`.
const sum_to_n_b = (n) => {
  if (n <= 0) {
    return 0;
  }
  return n + sum_to_n_b(n - 1);
};
//Tests
console.log(sum_to_n_b(5)); //15


//Mathematical Formula
// Time Complexity: O(1)
// Pros:
    // Most optimal solution in terms of time and space.
    // Executes instantly even for very large n.
const sum_to_n_c = (n) => {
  return (n * (n + 1)) / 2 || 0;
};
//Tests
console.log(sum_to_n_c(5)); //15

// ==> Most Optimal: The Mathematical Formula is the best choice due to its constant time complexity O(1) and minimal memory usage. It is the fastest method, especially for large values of n, as it avoids loops and recursion.
