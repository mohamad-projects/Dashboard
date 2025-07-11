importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase app in the service worker
firebase.initializeApp({ 
    apiKey: "AIzaSyA6UpjerjBrK-4-AjpauOfKd8yF448cVFM",
    authDomain: "fir-notification-51afa.firebaseapp.com",
    projectId: "fir-notification-51afa",
    storageBucket: "fir-notification-51afa.firebasestorage.app",
    messagingSenderId: "824372752286",
    appId: "1:824372752286:web:c809c5d2e4efb7d6bfb08f",
    measurementId: "G-ZGJ1NFLH7K"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png'  // Optional icon path
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
