    gsap.registerPlugin(ScrollTrigger);

window.addEventListener('DOMContentLoaded', () => {
    const horizontalContainer = document.querySelector('.schedule');
    const panels = document.querySelectorAll('.schedule__content');
    const bg = document.querySelector('.global-background');
    const stars = document.querySelector('.stars');
    const topImage = document.querySelector('.schedule__top img'); // トップ画像を取得
    const topSection = document.querySelector('.schedule__top'); // トップセクション

    function setupHorizontalScroll() {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());

        if (window.innerWidth < 768) {
            horizontalContainer.style.transform = 'translateX(0)';
            // 背景を昼に固定
            bg.style.background = "linear-gradient(150deg, rgba(237, 230, 215, 1) 8%, rgba(188, 219, 239, 1) 27%, rgba(255, 233, 189, 1) 46%, rgba(255, 185, 162, 1) 68%, rgba(30, 102, 142, 1) 84%, rgba(36, 64, 86, 1))";
            stars.style.opacity = 0;
            // モバイル表示の場合はトップ画像を初期状態に戻す
            gsap.set(topImage, { width: '40%' });
            return;
        }

        // 全体を制御する1つのタイムライン
        const mainTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: horizontalContainer,
                start: "top top",
                end: () => "+=" + (horizontalContainer.scrollWidth - window.innerWidth + window.innerWidth * 0.5), // 画像拡大分を追加
                scrub: 0.5,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: self => {
                    const progress = self.progress;

                    // 時計針（12時スタート→19時終了）
                const hourStart = 360;   // 12時 → 360°
                const hourEnd = 570;     // 19時 → 570°
                const minuteStart = 0;   // 00分
                const minuteEnd = 2520;  // 7時間分で2520°

                gsap.set(".hour-hand", { rotation: hourStart + (hourEnd - hourStart) * progress });
                gsap.set(".minute-hand", { rotation: minuteStart + (minuteEnd - minuteStart) * progress });

                    // 背景グラデーションの色変化
                    const dayColorTop = "#EDE6D7";  // 朝〜昼の色
                    const nightColorTop = "#1e668e"; // 夜の色

                    const dayColorBottom = "#ffc9a2"; // 昼下部
                    const nightColorBottom = "#243f56"; // 夜下部

                    const topColor = chroma.mix(dayColorTop, nightColorTop, progress).hex();
                    const bottomColor = chroma.mix(dayColorBottom, nightColorBottom, progress).hex();

                    bg.style.background = `linear-gradient(150deg, ${topColor} 8%, ${topColor} 50%, ${bottomColor} 84%, ${bottomColor})`;

                    // 星の出現（夜に近づくとopacity上昇）
                    // 星の出現を遅らせる
                    if (progress < 0.6) {
                        gsap.set(stars, { opacity: 0 }); // まだ完全透明
                    } else {
                        const adjustedProgress = (progress - 0.6) / 0.4; // 0.6〜1.0を0〜1に正規化
                        gsap.set(stars, { opacity: adjustedProgress });
                    }
                }
            }
        });

        // 最初の部分（全体の10%）で画像を拡大
        mainTimeline.to(topImage, {
            width: '100%',
            duration: 0.1, // タイムラインの最初の10%で完了
            ease: "power2.inOut"
        }, 0);

        // 画像拡大後に横スクロールを開始（全体の90%）
        mainTimeline.to(horizontalContainer, {
            x: () => -(horizontalContainer.scrollWidth - window.innerWidth),
            ease: "none",
            duration: 0.9 // タイムラインの残り90%で完了
        }, 0.1); // 0.1は画像拡大後に開始することを示す (タイムラインの10%地点)

        // 各パネルのフェードイン要素に対してアニメーションを設定
        panels.forEach((panel, index) => {
            // 各パネル内のフェードイン要素を取得
            const fadeElements = panel.querySelectorAll('.fadein');
            
            // パネルごとのスクロール進行度を計算するための値
            // 最初のパネル(index=0)は画像拡大後にフェードイン開始
            const panelStart = index === 0 ? 0.1 : (0.1 + (index / (panels.length - 1)) * 0.9);
            const panelEnd = index === 0 ? 0.2 : (0.1 + ((index + 1) / (panels.length - 1)) * 0.9);
            
            // 各フェードイン要素に対してアニメーションを設定
            fadeElements.forEach(elem => {
                let fromVars = { opacity: 0 };
                
                if (elem.classList.contains('fadein-left')) {
                    fromVars.x = -50;
                } else if (elem.classList.contains('fadein-right')) {
                    fromVars.x = 50;
                } else if (elem.classList.contains('fadein-up')) {
                    fromVars.y = -50;
                } else if (elem.classList.contains('fadein-down')) {
                    fromVars.y = 50;
                }
                
                // フェードインアニメーションをメインタイムラインに追加
                mainTimeline.fromTo(elem,
                    fromVars,
                    {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        duration: 0, // タイムラインの5%の期間
                        ease: "power2.out"
                    },
                    // パネルが表示されるタイミングでフェードイン
                    panelStart + (panelEnd - panelStart) * -0.4
                );
            });
        });
    }

    setupHorizontalScroll();

    window.addEventListener('resize', () => {
        setupHorizontalScroll();
    });
});