import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class ThreadPool {
  constructor(size) {
    this.size = size;
    this.workers = [];      // 活跃的工作线程
    this.taskQueue = [];    // 待处理任务队列
  }

  runTask(taskData) {
    return new Promise((resolve) => {
      // 如果有空闲线程，立即执行
      if (this.workers.length < this.size) {
        const worker = new Worker(path.join(__dirname, 'worker.js'));
        this.workers.push(worker);

        worker.postMessage(taskData);
        worker.on('message', (result) => {
          resolve(result);
          worker.terminate(); // 任务完成后终止线程
          this.workers = this.workers.filter(w => w !== worker);
          this._processQueue(); // 检查队列中是否有等待的任务
        });
      } else {
        // 无空闲线程，加入队列
        this.taskQueue.push({ taskData, resolve });
      }
    });
  }

  _processQueue() {
    if (this.taskQueue.length > 0 && this.workers.length < this.size) {
      const { taskData, resolve } = this.taskQueue.shift();
      this.runTask(taskData).then(resolve);
    }
  }
}