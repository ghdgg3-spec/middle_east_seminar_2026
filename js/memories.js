'use strict';

(function () {
  if (typeof firebase === 'undefined') {
    console.warn('Firebase not configured — memories feature disabled.');
    const feed = document.getElementById('memFeed');
    if (feed) feed.innerHTML = '<p class="mem-empty">Firebase 설정이 필요합니다. js/firebase-config.js를 확인하세요.</p>';
    return;
  }

  const db   = firebase.firestore();
  const COL  = 'memories';
  const MAX_MB = 10;  // 원본 크기 제한 (압축 후 Firestore에 저장)

  let selectedFile = null;

  window.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('memFeed')) return;
    initForm();
    subscribeToFeed();
  });

  /* ── Form init ── */
  function initForm() {
    const photoInput = document.getElementById('memPhoto');
    const submitBtn  = document.getElementById('memSubmit');

    photoInput.addEventListener('change', onPhotoChange);
    submitBtn.addEventListener('click', submitPost);
  }

  function onPhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_MB * 1024 * 1024) {
      alert(`사진은 ${MAX_MB}MB 이하만 올릴 수 있습니다.`);
      e.target.value = '';
      return;
    }

    selectedFile = file;
    document.getElementById('memPhotoLabel').textContent = file.name;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const preview = document.getElementById('memPreview');
      preview.innerHTML =
        `<img src="${ev.target.result}" alt="preview">` +
        `<button class="mem-remove-btn" onclick="removeMemPhoto()" type="button">✕</button>`;
      preview.classList.remove('mem-preview--hidden');
    };
    reader.readAsDataURL(file);
  }

  window.removeMemPhoto = function () {
    selectedFile = null;
    document.getElementById('memPhoto').value = '';
    document.getElementById('memPhotoLabel').textContent = '사진 추가';
    const preview = document.getElementById('memPreview');
    preview.innerHTML = '';
    preview.classList.add('mem-preview--hidden');
  };

  /* ── Submit ── */
  async function submitPost() {
    const nicknameEl = document.getElementById('memNickname');
    const messageEl  = document.getElementById('memMessage');
    const nickname   = nicknameEl.value.trim() || '익명';
    const message    = messageEl.value.trim();

    if (!message && !selectedFile) {
      alert('메시지 또는 사진을 입력해주세요.');
      return;
    }

    const btn = document.getElementById('memSubmit');
    btn.disabled    = true;
    btn.textContent = '올리는 중…';

    try {
      let photoUrl = null;
      if (selectedFile) photoUrl = await photoToBase64(selectedFile);

      await db.collection(COL).add({
        nickname,
        message,
        photoUrl,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      nicknameEl.value = '';
      messageEl.value  = '';
      window.removeMemPhoto();
    } catch (err) {
      console.error(err);
      alert('업로드에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      btn.disabled    = false;
      btn.textContent = '공유하기';
    }
  }

  /* ── 사진 → base64 (Firestore 직접 저장, Storage 불필요) ── */
  function photoToBase64(file) {
    // 최대 800px, quality 0.72 → 압축 후 약 100~300KB → base64 ~400KB → Firestore 1MB 제한 이내
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const scale  = Math.min(1, 800 / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  /* ── Real-time feed ── */
  function subscribeToFeed() {
    const feed = document.getElementById('memFeed');

    db.collection(COL)
      .orderBy('timestamp', 'desc')
      .limit(60)
      .onSnapshot(
        (snap) => {
          if (snap.empty) {
            feed.innerHTML = '<p class="mem-empty">아직 공유된 추억이 없습니다. 첫 번째로 남겨보세요! 🌟</p>';
            return;
          }
          feed.innerHTML = '';
          snap.forEach((doc) => feed.appendChild(renderCard(doc.data())));
        },
        (err) => {
          console.error(err);
          feed.innerHTML = '<p class="mem-empty">피드를 불러오지 못했습니다.</p>';
        }
      );
  }

  /* ── Render ── */
  function renderCard(data) {
    const card = document.createElement('div');
    card.className = 'mem-card';

    const time = data.timestamp
      ? new Date(data.timestamp.seconds * 1000).toLocaleString('ko-KR', {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
        })
      : '';

    card.innerHTML =
      `<div class="mem-card-header">` +
        `<span class="mem-nick">${esc(data.nickname || '익명')}</span>` +
        `<span class="mem-time">${time}</span>` +
      `</div>` +
      (data.photoUrl
        ? `<div class="mem-photo"><img src="${data.photoUrl}" alt="추억 사진" loading="lazy"></div>`
        : '') +
      (data.message
        ? `<p class="mem-msg">${esc(data.message).replace(/\n/g, '<br>')}</p>`
        : '');

    return card;
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
