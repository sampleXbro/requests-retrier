const { RetryManager } = require('../dist/index.cjs');
const { performance } = require('perf_hooks');

// Test 10K requests with mixed priorities
const manager = new RetryManager({ maxConcurrentRequests: 100 });
const start = performance.now();

// Array.from({ length: 10000 }).forEach((_, i) => {
//   const status = 200 + (i % 400); // 200-599 status codes
//   manager.axiosInstance.get(`https://httpbin.org/status/${status}`, {
//     __priority: i % 5
//   }).catch(() => {});
// });

Array.from({ length: 10000 }).forEach((_, i) => {
  const status = 200;
  manager.axiosInstance.get(`https://httpbin.org/status/${status}`, {
    __priority: i % 5
  }).catch(() => {});
});

let concurrent = 0;

manager.on('beforeRetry', () => {
  concurrent++;
  if (concurrent > 100) throw new Error('Concurrency exceeded!');
});

manager.on('afterRetry', () => concurrent--);

manager.on('afterRetry', (config, success) => {
  console.log(`After retry: Successful: ${success}, Priority: ${config.__priority}`);
});

manager.on('onRetryProcessFinished', (metrics) => {
  console.log(`Processed 10K requests in ${performance.now() - start}ms, Metrics: ${JSON.stringify(metrics)}`);
  console.log(`Active requests: ${manager.activeRequests.size}, Requests store: ${manager.requestStore.getAll().length}`);
});