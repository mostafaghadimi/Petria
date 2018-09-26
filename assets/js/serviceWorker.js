console.log('ServiceWorker Loaded');

self.addEventListener('push', e => {
    var data = e.data.json();
    console.log('push received');

    self.registration.showNotification(data.title, {
        body: 'Notified by Mostafa Ghadimi',
        icon: ''
    })
})