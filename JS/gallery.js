/*=================================================
    gallery__grid 関連のアニメーション
===================================================*/

//3. 画像のモーダル
$(".gallery").modaal({
	type: 'image',
	overlay_close:true,//モーダル背景クリック時に閉じるか
	before_open:function(){// モーダルが開く前に行う動作
		$('html').css('overflow-y','hidden');/*縦スクロールバーを出さない*/
	},
	after_close:function(){// モーダルが閉じた後に行う動作
		$('html').css('overflow-y','scroll');/*縦スクロールバーを出す*/
	}
});


/*=================================================
    voice 関連のアニメーション
===================================================*/

document.addEventListener('DOMContentLoaded', function() {
  const voiceItems = document.querySelectorAll('.voice1');
  const wrapper = document.querySelector('.voice__wrapper');
  if (!wrapper) return; // voice__wrapperがなければ処理を終了
  
  const originalPositions = [
    { top: '0px', left: '140px' }, // voice__yuuki
    { top: '40px', left: '40px' }, // voice__motibette
    { top: '264px', left: '0px' }, // voice__warai
    { top: '50px', left: '140px' }, // voice__hanasu
    { top: '68px', left: '140px' }, // voice__motibebaku
    { top: '200px', left: '140px' }, // voice__ano
    { top: '255px', left: '140px' }, // voice__mataikitai
    { top: '340px', left: '140px' }, // voice__kaeri
    { bottom: '73px', left: '0px' }, // voice__tadaima
    { top: '60px', right: '210px' }, // voice__konnnani
    { top: '0px', right: '0px' }, // voice__tanosiiha
    { top: '150px', right: '148px' }, // voice__hatusannka
    { bottom: '380px', right: '54px' }, // voice__ibasyoa
    { bottom: '347px', right: '280px' }, // voice__kinntyou
    { bottom: '30px', right: '40px' }, // voice__mata
    { bottom: '0px', right: '180px' }, // voice__sns
    { bottom: '180px', left: '130px' }
  ];
  
  // 各要素にポジションと遅延を設定
  voiceItems.forEach(function(item, index) {
    if (index >= originalPositions.length) return; // 配列の長さをチェック
    
    const position = originalPositions[index];
    
    // 絶対位置を設定
    item.style.position = 'absolute';
    
    // 位置を設定（文字列として直接設定）
    for (const key in position) {
      item.style[key] = position[key];
    }
    
    // アニメーション開始遅延をランダムに設定
    const delay = Math.random() * 12; // 0〜12秒の間でランダム
    item.style.animationDelay = delay + 's';
    
    // アニメーションの持続時間をランダムに設定
    const duration = 5 + Math.random() * 3; // 5〜8秒の間でランダム
    item.style.animationDuration = duration + 's';
  });
  
  // アニメーションクラスを追加
  setTimeout(function() {
    voiceItems.forEach(function(item) {
      item.classList.add('animate');
    });
  }, 500);
  
  // 各要素にアニメーション終了イベントを設定
  voiceItems.forEach(function(item) {
    item.addEventListener('animationend', function() {
      // アニメーション終了時の処理
      item.classList.remove('animate');
      
      // スタイルをリセット
      item.style.opacity = '0';
      item.style.visibility = 'hidden';
      item.style.transform = 'scale(0.8)';
      
      // 遅延を再設定
      const newDelay = Math.random() * 4 + 0.5; // 0.5〜4.5秒の間でランダム
      item.style.animationDelay = newDelay + 's';
      
      // 少し遅延してからアニメーション再開
      setTimeout(function() {
        item.classList.add('animate');
      }, 100);
    });
  });
});


/*=================================================
    story 関連のアニメーション
===================================================*/
document.addEventListener('DOMContentLoaded', function() {
  // story-container内のセクションを取得
  const storyContainer = document.querySelector('.story-container');
  
  // コンテナがなければ終了
  if (!storyContainer) return;
  
  const sections = storyContainer.querySelectorAll('.section');
  
  // セクションがなければ終了
  if (sections.length === 0) return;
  
  // Intersection Observer設定
  const observerOptions = {
    root: null, // ビューポートをルートとして使用
    rootMargin: '-20% 0px', // 上下20%の余白を設定
    threshold: 0.2 // 要素が50%表示されたらコールバックを実行
  };
  
  // 現在アクティブなセクションのインデックス
  let activeIndex = 0;
  
  // セクションが表示されたときのコールバック
  const handleIntersect = (entries, observer) => {
    entries.forEach(entry => {
      // 要素が表示されているか
      if (entry.isIntersecting) {
        const section = entry.target;
        const index = Array.from(sections).indexOf(section);
        
        // アクティブなインデックスを更新
        activeIndex = index;
        
        // セクションをアクティブに
        section.classList.add('active');
        
        // 他のセクションからアクティブクラスを削除
        sections.forEach((s, i) => {
          if (i !== index) {
            s.classList.remove('active');
          }
        });
      }
    });
  };
  
  // Intersection Observerを作成
  const observer = new IntersectionObserver(handleIntersect, observerOptions);
  
  // 各セクションを監視対象に
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // キーボードナビゲーション
  window.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      navigateToSection(activeIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      navigateToSection(activeIndex - 1);
    }
  });
  
  // 指定したインデックスのセクションに移動
  function navigateToSection(index) {
    // インデックスの範囲チェック
    if (index < 0 || index >= sections.length) return;
    
    // 該当セクションにスクロール
    sections[index].scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
  
  // ナビゲーションドットの作成
  function createNavDots() {
    const navContainer = document.createElement('div');
    navContainer.className = 'story-nav-dots';
    
    sections.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'story-nav-dot';
      dot.setAttribute('aria-label', `セクション ${i+1} へ移動`);
      
      // 最初のドットをアクティブに
      if (i === 0) {
        dot.classList.add('active');
      }
      
      // クリックイベント
      dot.addEventListener('click', () => {
        navigateToSection(i);
      });
      
      navContainer.appendChild(dot);
    });
    
    storyContainer.appendChild(navContainer);
    
    // アクティブセクションが変わったらドットも更新
    const updateActiveDot = () => {
      const dots = navContainer.querySelectorAll('.story-nav-dot');
      dots.forEach((dot, i) => {
        if (i === activeIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };
    
    // activeIndexの変更を監視
    Object.defineProperty(window, 'activeIndex', {
      set: function(newValue) {
        activeIndex = newValue;
        updateActiveDot();
      }
    });
  }
  
  // // ナビゲーションドットを作成
  // createNavDots();
  
  // タッチスワイプ機能
  let touchStartY = 0;
  let touchStartX = 0;
  
  storyContainer.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  
  storyContainer.addEventListener('touchend', e => {
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    
    const diffY = touchStartY - touchEndY;
    const diffX = touchStartX - touchEndX;
    
    // 縦方向のスワイプが横方向より大きい場合
    if (Math.abs(diffY) > Math.abs(diffX)) {
      if (diffY > 70) { // 下へのスワイプ
        navigateToSection(activeIndex + 1);
      } else if (diffY < -70) { // 上へのスワイプ
        navigateToSection(activeIndex - 1);
      }
    }
  }, { passive: true });
});