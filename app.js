import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { 
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot,
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDFPkNaiaExQZ6D3y0CKxIn6Pi0nrE9Fno",
    authDomain: "tawasal-431a8.firebaseapp.com",
    projectId: "tawasal-431a8",
    storageBucket: "tawasal-431a8.firebasestorage.app",
    messagingSenderId: "81068658401",
    appId: "1:81068658401:web:b62d4e56a3cdf4108e31a0",
    measurementId: "G-P0Y3K84XL6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// عناصر DOM
const authButton = document.getElementById('authButton');
const chatContainer = document.getElementById('chatContainer');
const authSection = document.getElementById('authSection');
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const usernameModal = document.getElementById('usernameModal');
const usernameInput = document.getElementById('usernameInput');
const saveUsernameButton = document.getElementById('saveUsername');
const userStatus = document.getElementById('userStatus');

// متغيرات التطبيق
let currentUser = null;
let currentUsername = null;

// تسجيل الدخول بجوجل
authButton.addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        currentUser = result.user;
        checkUsername();
    } catch (error) {
        console.error('خطأ في التسجيل:', error);
        alert('حدث خطأ أثناء التسجيل: ' + error.message);
    }
});

// التحقق من وجود اسم مستخدم
async function checkUsername() {
    if (!currentUser) return;
    
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    if (userDoc.exists()) {
        currentUsername = userDoc.data().username;
        setupChat();
    } else {
        showUsernameModal();
    }
}

// عرض نموذج اسم المستخدم
function showUsernameModal() {
    usernameModal.style.display = 'flex';
}

// حفظ اسم المستخدم
saveUsernameButton.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    if (username.length < 3) {
        alert('اسم المستخدم يجب أن يكون 3 أحرف على الأقل');
        return;
    }
    
    try {
        await setDoc(doc(db, 'users', currentUser.uid), {
            username: username,
            createdAt: serverTimestamp()
        });
        currentUsername = username;
        usernameModal.style.display = 'none';
        setupChat();
    } catch (error) {
        console.error('خطأ في حفظ اسم المستخدم:', error);
        alert('حدث خطأ في حفظ اسم المستخدم');
    }
});

// إعداد واجهة الدردشة
function setupChat() {
    authSection.style.display = 'none';
    chatContainer.style.display = 'block';
    userStatus.textContent = `مرحباً ${currentUsername}`;
    authButton.textContent = 'تسجيل الخروج';
    
    // تغيير وظيفة الزر لتسجيل الخروج
    authButton.onclick = () => {
        signOut(auth).then(() => {
            location.reload();
        });
    };
    
    // تحميل الرسائل السابقة والاستماع للجديدة
    loadMessages();
    
    // إرسال رسالة عند الضغط على زر الإرسال
    sendButton.addEventListener('click', sendMessage);
    
    // إرسال رسالة عند الضغط على Enter
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// تحميل الرسائل
function loadMessages() {
    const q = query(collection(db, 'messages'), orderBy('timestamp'));
    
    onSnapshot(q, (snapshot) => {
        messagesContainer.innerHTML = '';
        snapshot.forEach((doc) => {
            const message = doc.data();
            displayMessage(message);
        });
        
        // التمرير لآخر رسالة
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
}

// عرض الرسالة في الواجهة
function displayMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    
    const isCurrentUser = message.userId === currentUser?.uid;
    messageDiv.classList.add(isCurrentUser ? 'sent' : 'received');
    
    const messageInfo = document.createElement('div');
    messageInfo.classList.add('message-info');
    messageInfo.innerHTML = `
        <span>${message.username}</span>
        <span>${new Date(message.timestamp?.toDate()).toLocaleTimeString()}</span>
    `;
    
    const messageText = document.createElement('div');
    messageText.textContent = message.text;
    
    messageDiv.appendChild(messageInfo);
    messageDiv.appendChild(messageText);
    messagesContainer.appendChild(messageDiv);
}

// إرسال رسالة جديدة
async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || !currentUser || !currentUsername) return;
    
    try {
        await addDoc(collection(db, 'messages'), {
            text: text,
            userId: currentUser.uid,
            username: currentUsername,
            timestamp: serverTimestamp()
        });
        
        messageInput.value = '';
    } catch (error) {
        console.error('خطأ في إرسال الرسالة:', error);
        alert('حدث خطأ أثناء إرسال الرسالة');
    }
}

// متابعة حالة المصادقة
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        checkUsername();
    } else {
        currentUser = null;
        currentUsername = null;
        authSection.style.display = 'block';
        chatContainer.style.display = 'none';
        userStatus.textContent = 'غير مسجل الدخول';
        authButton.textContent = 'تسجيل الدخول بجوجل';
    }
});
