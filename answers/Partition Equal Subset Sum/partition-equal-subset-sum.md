Given a **non-empty** array containing **only positive integers**, find if the array can be partitioned into two subsets such that the sum of elements in both subsets is equal.

**Note:**

1. Each of the array element will not exceed 100.
2. The array size will not exceed 200.

**Example 1:**

    Input: [1, 5, 11, 5]

    Output: true

    Explanation: The array can be partitioned as [1, 5, 5] and [11].

**Example 2:**

    Input: [1, 2, 3, 5]

    Output: false

    Explanation: The array cannot be partitioned into equal sum subsets.

可以看做背包问题

背包问题分析

1.01背包问题

dp[i][j]含义：前件物品恰好放入一个容量为v的背包可以获得的最大价值。

dp[i][j] = max(dp[i-1][j],dp[i-1][v-w[i]+v[i]]);

建立背包，表示是否可以拿到总和的一半。由于有memory limit的限制，需要用滚动数组。
注意，这道题不能变形到Presum，因为Presum数组的题目，要求数组是连续的(Subarray Sum)。如果不连续(比如求数组1,3,5,7中能否挑出几个数，使其和为10)，这就是背包问题。
