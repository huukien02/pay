// Self-destructing service worker.
//
// Dự án này KHÔNG dùng Firebase. File tồn tại để vô hiệu hóa bất kỳ service
// worker Firebase cũ nào còn đăng ký trên localhost (gây cache chunk JS lỗi
// thời -> lỗi React khi mount). Nó tự unregister + xóa cache + reload tab.

self.addEventListener("install", () => {
  self.skipWaiting()
})

self.addEventListener("activate", async () => {
  try {
    const keys = await caches.keys()
    await Promise.all(keys.map((k) => caches.delete(k)))
    await self.registration.unregister()
    const clients = await self.clients.matchAll({ type: "window" })
    clients.forEach((client) => client.navigate(client.url))
  } catch {
    // ignore
  }
})
