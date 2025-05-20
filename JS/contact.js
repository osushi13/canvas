/*=================================================
    日本地図ピン表示
===================================================*/
const pin = document.getElementById('nagoya-pin');
const imgWrap = document.querySelector('.next-event__img-wrap');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      pin.classList.add('show');
    }
  });
}, { threshold: 0.5 });

observer.observe(imgWrap);

/*=================================================
    送信ボタン
===================================================*/

document.addEventListener('DOMContentLoaded', function() {
  const submitButton = document.getElementById('form-submit-button');
  const form = submitButton.closest('form');
  const modal = document.getElementById('form-complete-modal');
  const closeButton = document.querySelector('.form-complete-modal__close');

  // ボタンテキスト部分
  const buttonLabel = submitButton.querySelector('.c-switch-link__label span:first-child');
  const buttonLabelAlt = submitButton.querySelector('.c-switch-link__label span:last-child');

  submitButton.addEventListener('click', function(e) {
      e.preventDefault(); // aタグのリンク動作を無効化

      // ボタンを一時的に非活性に（連打防止）
      submitButton.style.pointerEvents = 'none';
      submitButton.style.opacity = '0.6';

      // ボタンのテキストを「送信中...」に
      buttonLabel.textContent = '送信中...';
      buttonLabelAlt.textContent = '送信中...';

      // フェイク送信（サーバー送信しない）
      setTimeout(() => {
          // モーダル表示（ふわっと）
          modal.classList.add('is-visible');

          // ボタン復活 & テキスト戻す
          submitButton.style.pointerEvents = 'auto';
          submitButton.style.opacity = '1';
          buttonLabel.textContent = '送信する';
          buttonLabelAlt.textContent = '送信する';
      }, 2000); // 2秒待ってからモーダル出す
  });

  // 閉じるボタン
  closeButton.addEventListener('click', function() {
      modal.classList.remove('is-visible');
  });

  // モーダル背景クリックでも閉じる
  modal.addEventListener('click', function(e) {
      if (e.target === modal) {
          modal.classList.remove('is-visible');
      }
  });
});
