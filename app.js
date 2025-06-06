// استيراد الدوال المطلوبة من Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signOut,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

// تكوين Firebase الخاص بك
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
const provider = new GoogleAuthProvider();

// عناصر DOM
const googleSignInBtn = document.getElementById('googleSignIn');
const signOutBtn = document.getElementById('signOut');
const userInfoDiv = document.getElementById('userInfo');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userPhoto = document.getElementById('userPhoto');

// دالة تسجيل الدخول بجوجل
async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, provider);
        // يمكنك الوصول إلى معلومات المستخدم من result.user
        console.log('المستخدم المسجل:', result.user);
    } catch (error) {
        console.error('حدث خطأ أثناء التسجيل:', error);
        alert('حدث خطأ أثناء التسجيل: ' + error.message);
    }
}

// دالة تسجيل الخروج
function signOutUser() {
    signOut(auth).then(() => {
        console.log('تم تسجيل الخروج بنجاح');
    }).catch((error) => {
        console.error('حدث خطأ أثناء تسجيل الخروج:', error);
    });
}

// متابعة حالة المصادقة
onAuthStateChanged(auth, (user) => {
    if (user) {
        // المستخدم مسجل الدخول
        console.log('حالة المستخدم: مسجل الدخول', user);
        
        // تحديث واجهة المستخدم
        googleSignInBtn.style.display = 'none';
        userInfoDiv.style.display = 'block';
        
        // عرض معلومات المستخدم
        userName.textContent = user.displayName || 'مستخدم بدون اسم';
        userEmail.textContent = user.email;
        userPhoto.src = user.photoURL || 'https://via.placeholder.com/80';
        
    } else {
        // لا يوجد مستخدم مسجل الدخول
        console.log('حالة المستخدم: غير مسجل الدخول');
        
        // تحديث واجهة المستخدم
        googleSignInBtn.style.display = 'flex';
        userInfoDiv.style.display = 'none';
    }
});

// إضافة معالج الأحداث للأزرار
googleSignInBtn.addEventListener('click', signInWithGoogle);
signOutBtn.addEventListener('click', signOutUser);
