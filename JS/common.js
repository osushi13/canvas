/*===========================
ボタンホバーアニメーション
===========================*/
document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.c-switch-link');
  buttons.forEach(button => {
      const circle = button.querySelector('.c-switch-link__circle');
      if (!circle) return;
      button.addEventListener('mouseenter', function () {
          const buttonWidth = button.offsetWidth;
          circle.style.transform = `translate(${buttonWidth - 75}px, -50%)`;
      });
      button.addEventListener('mouseleave', function () {
          circle.style.transform = 'translate(0, -50%)';
      });
  });
});


/*===========================
ページ遷移エフェクト
===========================*/
document.addEventListener('DOMContentLoaded', () => {
  // ページめくりエフェクト用のコンテナを作成
  const createPageTurnContainer = () => {
    const container = document.createElement('div');
    container.classList.add('page-turn-container');
    container.innerHTML = `
      <div class="page-turn-overlay"></div>
      <div class="page-turn-page"></div>
    `;
    document.body.appendChild(container);
    return container;
  };

  const pageTurnContainer = createPageTurnContainer();

  // すべてのaタグを選択（.galleryクラスを含む）
  const navigationLinks = document.querySelectorAll('a');
  
  navigationLinks.forEach(link => {
    // リンクの属性を取得
    const href = link.getAttribute('href');
    const target = link.getAttribute('target');
    
    // #だけのリンクや、JavaScriptのvoid(0)などは除外
    if (!href || href === '#' || href.startsWith('javascript:')) {
      return;
    }
    
    // 画像ファイルへのリンクは除外（ギャラリー用である可能性が高い）
    if (href.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return;
    }
    
    link.addEventListener('click', (e) => {
      // target="_blank"の場合は通常の動作を維持（新しいタブで開く）
      if (target === '_blank') {
        return; // イベントをキャンセルせずそのまま実行
      }
      
      // すべてのページ遷移にエフェクトを適用
      e.preventDefault();
      
      // ページめくりエフェクトを開始
      pageTurnContainer.classList.add('page-turning');
      
      // 遷移の遅延
      setTimeout(() => {
        window.location.href = href;
      }, 1200); // アニメーション時間に合わせて調整
    });
  });
});


