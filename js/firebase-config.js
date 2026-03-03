// =====================================================
// Firebase 설정
// =====================================================
// firebase.google.com 에서 프로젝트를 만든 뒤
// 아래 값들을 본인 프로젝트의 설정으로 교체하세요.
//
// 경로: Firebase 콘솔 > 프로젝트 설정 > 일반 > 내 앱 > SDK 설정 및 구성
// =====================================================

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
