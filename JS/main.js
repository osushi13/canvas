/*===========================
トップページローディングアニメーション
===========================*/
document.addEventListener('DOMContentLoaded', () => {
  // トップページかどうかを確認
  const isTopPage = () => {
    const path = window.location.pathname;
    return path === '/' || 
           path === '/index.html' || 
           path.endsWith('/index.html') || 
           path === '';
  };

  // トップページでない場合は処理を終了
  if (!isTopPage()) {
    return;
  }

  const loadingContainer = document.querySelector('.loading-container');
  const mainContent = document.querySelector('.main-content');
  const animatedText = document.getElementById('animated-text');
  const startMessage = document.querySelector('.start-message');
  
  // ローディング条件の判定
  // 1. 初回訪問の場合（ローカルストレージに保存）
  const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
  
  // 2. リロードの場合
  const isReload = performance.navigation && 
                   (performance.navigation.type === 1 || 
                   window.performance.getEntriesByType('navigation')[0].type === 'reload');
  
  // 初回訪問またはリロードの場合
  if (!hasVisitedBefore || isReload) {
    // ローディング画面を表示
    loadingContainer.classList.add('active');
    
    // スクロールを無効化
    document.body.style.overflow = 'hidden';
    
    // 文字をクリックしたときの処理
    animatedText.addEventListener('click', () => {
      // アニメーションを開始する
      animatedText.classList.add('animated');
      
      // クリックガイダンスを非表示
      if (startMessage) {
        startMessage.style.opacity = '0';
      }
      
      // アニメーション開始後、一定時間後にフェードアウト
      setTimeout(() => {
        // ローディング画面をフェードアウト
        loadingContainer.classList.add('fade-out');
        
        // メインコンテンツを表示
        setTimeout(() => {
          mainContent.classList.add('visible');
          
          // スクロールを有効化
          document.body.style.overflow = 'auto';
          
          // 訪問済みのフラグをセット（初回のみ）
          if (!hasVisitedBefore) {
            localStorage.setItem('hasVisitedBefore', 'true');
          }
        }, 1000);
      }, 3000);
    });
    
    // ハイライト効果（オプション）
    const letters = document.querySelectorAll('.letter');
    letters.forEach(letter => {
      letter.addEventListener('mouseover', () => {
        if (!animatedText.classList.contains('animated')) {
          letter.style.color = '#D04D17';
        }
      });
      
      letter.addEventListener('mouseout', () => {
        letter.style.color = '#504337';
      });
    });
  } else {
    // 通常のページ遷移でトップページに来た場合
    // ローディング画面は非表示のままで、メインコンテンツを表示
    loadingContainer.classList.remove('active');
    loadingContainer.style.display = 'none';
    mainContent.classList.add('visible');
    document.body.style.overflow = 'auto';
  }
});

/*=================================================
    ファーストビューのスクロールアニメーション制御
===================================================*/

// ScrollTriggerプラグインを登録
ScrollTrigger.register();

document.addEventListener('DOMContentLoaded', () => {
    // 必要な要素の取得
    const titleElement = document.querySelector('.fv__title');
    const dateElement = document.querySelector('.fv__date');
    const copySection = document.querySelector('.fv__copy');
    const mainContent = document.querySelector('.main__content');
    
    // 状態管理用の変数
    let isFixed = false;
    let lastScrollPosition = 0;

    // 背景画像のズームアニメーション設定
    gsap.to(".fv__wrapper", {
        scale: 2.0,
        ease: "none",
        scrollTrigger: {
            trigger: ".fv",
            start: "top top",     // 画面最上部に要素の上端が来たら開始
            end: "bottom top",    // 要素の下端が画面最上部に来たら終了
            scrub: true,          // スクロール量に応じてアニメーションを進行
            pin: true,            // 要素を固定
            onUpdate: (self) => {
                // スクロール50%を超えたらタイトルと日付を散らばらせる
                if (self.progress > 0.5) {
                    titleElement.classList.add('scatter');
                    dateElement.classList.add('scatter');
                } else {
                    titleElement.classList.remove('scatter');
                    dateElement.classList.remove('scatter');
                }
            }
        }
    });

    // スクロールイベントの制御
    window.addEventListener('scroll', () => {
        // スクロール位置の取得
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const copySectionRect = copySection.getBoundingClientRect();
        
        // スクロール方向の判定
        const isScrollingDown = scrollPosition > lastScrollPosition;

        // コピーセクションの表示制御
        if (scrollPosition > windowHeight * 0.8) {
            copySection.classList.add('is-visible');
            const fadeStart = windowHeight * 1.1;  // フェードイン開始位置
            const fadeEnd = windowHeight * 2.2;    // フェードアウト終了位置

            // 透明度の計算
            if (scrollPosition > fadeStart) {
                let opacity;
                if (isScrollingDown) {
                    // 下スクロール時の透明度計算
                    opacity = 1 - (scrollPosition - fadeStart) / (fadeEnd - fadeStart);
                } else {
                    // 上スクロール時の透明度計算
                    opacity = 1 - (fadeEnd - scrollPosition) / (fadeEnd - fadeStart);
                }
                // 透明度を0.3から1.0の間に制限
                copySection.style.opacity = Math.max(0.3, Math.min(1, opacity));
            }
        } else {
            copySection.classList.remove('is-visible');
        }

        // セクションの固定/解除制御
        if (scrollPosition > windowHeight && !isFixed && isScrollingDown) {
            copySection.classList.add('is-fixed');
            isFixed = true;
        } else if (scrollPosition <= windowHeight) {
            copySection.classList.remove('is-fixed');
            isFixed = false;
        }

        // 現在のスクロール位置を保存
        lastScrollPosition = scrollPosition;
    });
});

/*=================================================
    スワイパー
===================================================*/


// 左から右に動くスライダー
document.addEventListener('DOMContentLoaded', function() {
    // スライド要素の総数を取得
    const slideLength = document.querySelectorAll('.gallery__slider--first .swiper-slide').length;
    
    // 最初のスライダーの初期化
    const swiper = new Swiper('.gallery__slider--first', {
      slidesPerView: 'auto',      // スライドの表示数を自動設定
      centeredSlides: true,       // スライドを中央寄せに
      spaceBetween: 16,           // スライド間のスペース（px）
      loop: true,                 // 無限ループを有効化
      loopedSlides: slideLength,  // ループ用のスライド数
      speed: 8000,                // アニメーション速度（ms）
      autoplay: {
        delay: 0,                 // 自動再生の待ち時間なし
        disableOnInteraction: false,  // ユーザー操作後も自動再生を継続
      },
      freeMode: {
        enabled: true,            // 自由なスライド操作を有効化
        momentum: false,          // 慣性スクロールを無効化
      },
      grabCursor: true,           // グラブカーソルを表示
      breakpoints: {
        1025: {                   // 1025px以上の画面幅での設定
          spaceBetween: 10,
        }
      },
      on: {
        touchEnd: function() {     // タッチ終了時の処理
          this.slideTo(this.activeIndex + 1);
        }
      }
    });
});


// 右から左に動くスライダー
document.addEventListener('DOMContentLoaded', function() {
    // スライド要素の総数を取得
    const slideLength = document.querySelectorAll('.gallery__slider--last .swiper-slide').length;
    
    // 2番目のスライダーの初期化
    const swiper = new Swiper('.gallery__slider--last', {
      slidesPerView: 'auto',      // スライドの表示数を自動設定
      centeredSlides: true,       // スライドを中央寄せに
      spaceBetween: 16,           // スライド間のスペース（px）
      loop: true,                 // 無限ループを有効化
      loopedSlides: slideLength,  // ループ用のスライド数
      speed: 8000,                // アニメーション速度（ms）
      autoplay: {
        delay: 0,                 // 自動再生の待ち時間なし
        disableOnInteraction: false,  // ユーザー操作後も自動再生を継続
        reverseDirection: true     // 逆方向に設定
      },
      freeMode: {
        enabled: true,            // 自由なスライド操作を有効化
        momentum: false,          // 慣性スクロールを無効化
      },
      grabCursor: true,           // グラブカーソルを表示
      breakpoints: {
        1025: {                   // 1025px以上の画面幅での設定
          spaceBetween: 10,
        }
      },
      on: {
        touchEnd: function() {     // タッチ終了時の処理
          this.slideTo(this.activeIndex - 1);
        }
      }
    });
});