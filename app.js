// استيراد Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { 
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

// تكوين Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDFPkNaiaExQZ6D3y0CKxIn6Pi0nrE9Fno",
    authDomain: "tawasal-431a8.firebaseapp.com",
    projectId: "tawasal-431a8",
    storageBucket: "tawasal-431a8.firebasestorage.app",
    messagingSenderId: "81068658401",
    appId: "1:81068658401:web:b62d4e56a3cdf4108e31a0",
    measurementId: "G-P0Y3K84XL6"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// عناصر DOM
const chatPage = document.getElementById('chatPage');
const profilePage = document.getElementById('profilePage');

// دالة تسجيل الدخول
async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, provider);
        updateUI(result.user);
    } catch (error) {
        console.error('Error signing in:', error);
    }
}

// دالة تحديث الواجهة
function updateUI(user) {
    if (user) {
        // تحميل الدردشات
        loadChats();
        
        // تحميل بيانات البروفايل
        loadProfile(user);
    } else {
        // عرض واجهة تسجيل الدخول
    }
}

// دالة تحميل الدردشات
function loadChats() {
    const q = query(collection(db, "chats"), orderBy("lastMessageTime", "desc"));
    
    onSnapshot(q, (snapshot) => {
        const chatList = document.querySelector('.chat-list');
        chatList.innerHTML = '';
        
        snapshot.forEach((doc) => {
            const chat = doc.data();
            displayChat(chat);
        });
    });
}

// دالة عرض دردشة واحدة
function displayChat(chat) {
    const chatElement = document.createElement('div');
    chatElement.className = 'chat-item';
    chatElement.innerHTML = `
        <img src="${chat.photoURL || 'default-profile.png'}" alt="صورة المستخدم">
        <div class="chat-info">
            <h3>${chat.name}</h3>
            <p>${chat.lastMessage || 'لا توجد رسائل'}</p>
        </div>
        <span class="time">${new Date(chat.lastMessageTime?.toDate()).toLocaleTimeString()}</span>
    `;
    
    document.querySelector('.chat-list').appendChild(chatElement);
}

// دالة تحميل البروفايل
function loadProfile(user) {
    const profileContent = document.querySelector('.profile-content');
    profileContent.innerHTML = `
        <div class="profile-header">
            <img src="${user.photoURL || 'default-profile.png'}" alt="صورة البروفايل">
            <h2>${user.displayName || 'مستخدم'}</h2>
            <p>${user.email || ''}</p>
        </div>
        <button id="signOutBtn">تسجيل الخروج</button>
    `;
    
    document.getElementById('signOutBtn').addEventListener('click', signOutUser);
}

// دالة تسجيل الخروج
function signOutUser() {
    signOut(auth).then(() => {
        // إعادة توجيه إلى صفحة تسجيل الدخول
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
}

// متابعة حالة المصادقة
onAuthStateChanged(auth, (user) => {
    updateUI(user);
});
