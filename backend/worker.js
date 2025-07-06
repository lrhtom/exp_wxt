import { parentPort } from 'worker_threads';

parentPort.on('message1', (data) => {
  // 模拟耗时操作（如消息处理）
  const processedMsg = `[线程处理] ${data.text}`;
  
  // 将结果返回主线程
  parentPort.postMessage({
    ...data,
    text: processedMsg
  });
});
parentPort.on('message2', (data) => {
  // 模拟耗时操作（如消息处理）
  const processedMsg = `信息太短`;
  
  // 将结果返回主线程
  parentPort.postMessage({
    ...data,
    text: processedMsg
  });
});