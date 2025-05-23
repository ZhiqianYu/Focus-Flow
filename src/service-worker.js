// Service Worker - Focus Flow
// 版本号 - 更新时请修改此版本号
const CACHE_NAME = 'focus-flow-v1.0.0';
const STATIC_CACHE_NAME = 'focus-flow-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'focus-flow-dynamic-v1.0.0';

// 需要缓存的静态资源
const STATIC_FILES = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

// 安装 Service Worker
self.addEventListener('install', event => {
  console.log('[Service Worker] 安装中...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] 缓存静态资源');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('[Service Worker] 安装完成');
        // 立即激活新的 Service Worker
        return self.skipWaiting();
      })
  );
});

// 激活 Service Worker
self.addEventListener('activate', event => {
  console.log('[Service Worker] 激活中...');
  
  event.waitUntil(
    // 清理旧缓存
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName.startsWith('focus-flow-')) {
            console.log('[Service Worker] 删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] 激活完成');
      // 立即控制所有客户端
      return self.clients.claim();
    })
  );
});

// 处理请求
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 只处理同源请求
  if (url.origin !== location.origin) {
    return;
  }

  // 对于导航请求，总是尝试网络优先
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // 缓存页面
          return caches.open(DYNAMIC_CACHE_NAME)
            .then(cache => {
              cache.put(request, response.clone());
              return response;
            });
        })
        .catch(() => {
          // 如果离线，返回缓存的 index.html
          return caches.match('./index.html');
        })
    );
    return;
  }

  // 对于其他请求，使用缓存优先策略
  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) {
          // 如果缓存中有，直接返回
          console.log('[Service Worker] 从缓存返回:', request.url);
          return response;
        }

        // 否则从网络获取
        console.log('[Service Worker] 从网络获取:', request.url);
        return fetch(request).then(response => {
          // 检查是否是有效响应
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // 缓存响应
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE_NAME)
            .then(cache => {
              cache.put(request, responseToCache);
            });

          return response;
        });
      })
      .catch(error => {
        console.error('[Service Worker] 获取资源失败:', error);
        // 可以返回一个离线页面
        if (request.destination === 'document') {
          return caches.match('./index.html');
        }
      })
  );
});

// 处理推送通知
self.addEventListener('push', event => {
  console.log('[Service Worker] 收到推送通知');
  
  const options = {
    body: event.data ? event.data.text() : '是时候回顾一下刚才的学习内容了！',
    icon: './assets/icon-192.png',
    badge: './assets/icon-72.png',
    vibrate: [200, 100, 200],
    tag: 'focus-flow-reminder',
    requireInteraction: true,
    actions: [
      {
        action: 'continue',
        title: '继续学习',
        icon: './assets/icon-96.png'
      },
      {
        action: 'break',
        title: '稍后提醒',
        icon: './assets/icon-96.png'
      }
    ],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Focus Flow 学习提醒', options)
  );
});

// 处理通知点击
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] 通知被点击:', event.action);
  
  event.notification.close();

  if (event.action === 'continue') {
    // 继续学习 - 打开应用
    event.waitUntil(
      clients.openWindow('./?action=continue')
    );
  } else if (event.action === 'break') {
    // 稍后提醒 - 5分钟后再次提醒
    event.waitUntil(
      new Promise(resolve => {
        setTimeout(() => {
          self.registration.showNotification('Focus Flow 学习提醒', {
            body: '休息时间结束，继续学习吧！',
            icon: './assets/icon-192.png',
            badge: './assets/icon-72.png',
            tag: 'focus-flow-reminder-delayed'
          });
          resolve();
        }, 5 * 60 * 1000); // 5分钟
      })
    );
  } else {
    // 默认行为 - 打开应用
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then(clientList => {
          // 如果已有窗口打开，聚焦它
          for (const client of clientList) {
            if (client.url.includes('index.html') && 'focus' in client) {
              return client.focus();
            }
          }
          // 否则打开新窗口
          if (clients.openWindow) {
            return clients.openWindow('./');
          }
        })
    );
  }
});

// 后台同步
self.addEventListener('sync', event => {
  console.log('[Service Worker] 后台同步:', event.tag);
  
  if (event.tag === 'sync-config') {
    event.waitUntil(
      // 同步配置到服务器（如果有的话）
      syncConfiguration()
    );
  }
});

// 同步配置函数（示例）
async function syncConfiguration() {
  try {
    // 获取本地存储的配置
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const configRequest = new Request('./config.json');
    const cachedConfig = await cache.match(configRequest);
    
    if (cachedConfig) {
      const config = await cachedConfig.json();
      console.log('[Service Worker] 同步配置:', config);
      // 这里可以将配置同步到服务器
    }
  } catch (error) {
    console.error('[Service Worker] 同步失败:', error);
  }
}

// 监听消息
self.addEventListener('message', event => {
  console.log('[Service Worker] 收到消息:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName.startsWith('focus-flow-')) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  }
});