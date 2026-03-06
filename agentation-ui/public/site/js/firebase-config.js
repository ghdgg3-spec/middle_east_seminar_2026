// =====================================================
// Firebase 설정
// =====================================================
// firebase.google.com 에서 프로젝트를 만든 뒤
// 아래 값들을 본인 프로젝트의 설정으로 교체하세요.
//
// 경로: Firebase 콘솔 > 프로젝트 설정 > 일반 > 내 앱 > SDK 설정 및 구성
// =====================================================

 const firebaseConfig = {

    apiKey: "AIzaSyA2GNHy8qrlSVnXnXMQpl4JhFKey2SvGsk",

    authDomain: "kmtp2026-seminar.firebaseapp.com",

    projectId: "kmtp2026-seminar",

    storageBucket: "kmtp2026-seminar.firebasestorage.app",

    messagingSenderId: "305338153121",

    appId: "1:305338153121:web:f97e3644dbbfe4732318e0",

    measurementId: "G-KTL22QCJJN"

  };

firebase.initializeApp(firebaseConfig);
