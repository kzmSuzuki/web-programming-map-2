import React, { useEffect, useState } from "react";

interface IndicatorProps {
  data?: any[];
}

const Indicator: React.FC<IndicatorProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicators, setIndicators] = useState<number[]>([]);

  // イージング付きスクロール関数
  const smoothScrollTo = (target: number, duration = 800) => {
    const list = document.getElementById("infinite-list");
    if (!list) return;

    const start = list.scrollTop;
    const distance = target - start;
    let startTime: number | null = null;

    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      const easedProgress = easeInOutCubic(progress);
      list.scrollTop = start + distance * easedProgress;

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  // スクロールインジケーター初期化
  useEffect(() => {
    const list = document.getElementById("infinite-list");
    if (!list) return;

    const createScrollIndicator = () => {
      const listItems = list.querySelectorAll("li");
      const visibleItems = Array.from(listItems).filter(
        (item) => !item.classList.contains("force-invisible")
      );

      // インジケーター用のインデックス配列を作成（最初の3つをスキップ、最後の2つも除外）
      const indicatorIndexes = visibleItems
        .map((_, index) => index)
        .filter((index) => index > 2)
        .slice(0, -2); // 最後の2つを除外

      setIndicators(indicatorIndexes);
    };

    // スクロール位置に応じてアクティブインジケーター更新
    const updateIndicator = () => {
      const listItems = list.querySelectorAll("li");
      const visibleItems = Array.from(listItems).filter(
        (item) => !item.classList.contains("force-invisible")
      );

      let newActiveIndex = 0;
      const scrollTop = list.scrollTop;

      for (let i = 0; i < visibleItems.length; i++) {
        const item = visibleItems[i] as HTMLElement;
        const itemTop = item.offsetTop;
        if (scrollTop >= itemTop - 200) {
          newActiveIndex = i;
        }
      }

      setActiveIndex(newActiveIndex);
    };

    // 初期化
    createScrollIndicator();
    updateIndicator();

    // スクロールイベントリスナー
    list.addEventListener("scroll", updateIndicator);

    return () => {
      list.removeEventListener("scroll", updateIndicator);
    };
  }, []);

  // インジケータークリック時のスクロール処理
  const handleIndicatorClick = (index: number) => {
    const list = document.getElementById("infinite-list");
    if (!list) return;

    const listItems = list.querySelectorAll("li");
    const visibleItems = Array.from(listItems).filter(
      (item) => !item.classList.contains("force-invisible")
    );

    const targetItem = visibleItems[index] as HTMLElement;
    if (targetItem) {
      smoothScrollTo(targetItem.offsetTop - 150, 1000);
    }
  };

  return (
    <>
      <p
        style={{
          fontSize: "0.8rem",
          fontWeight: "200",
          position: "absolute",
          width: "200px",
          top: "4%",
          right: "0%",
          transform: "translateY(-50%)",
          zIndex: "1001",
          margin: "0 100px 0 0",
          padding: "0",
        }}
      >
        Your classmates are located in
      </p>
      <div className="scroll-indicator">
        <div className="indicators">
          {indicators.map((index) => {
            const isNumbered = (index + 5) % 5 === 0;
            const isActive = index === activeIndex;
            // 下2つを削除したので、番号計算を調整
            const itemNumber = indicators.length + 3 - index;

            // データから対応するclearedNumを取得（2個下にずらす）
            const dataIndex = indicators.length + 2 - index + 2; // 2個下にずらす
            const clearedNum =
              data && data[dataIndex] && dataIndex >= 0
                ? data[dataIndex].clearedNum
                : 0;
            const maxNum = 10; // 最大値（必要に応じて調整）
            const gaugeWidth = (clearedNum / maxNum) * 100; // パーセンテージ

            // デバッグ情報
            console.log(
              `Index: ${index}, DataIndex: ${dataIndex}, ClearedNum: ${clearedNum}, GaugeWidth: ${gaugeWidth}%`
            );

            return (
              <div
                key={index}
                className={`indicator ${isNumbered ? "numbered" : ""} ${
                  isActive ? "active" : ""
                }`}
                data-index={index}
                onClick={() => handleIndicatorClick(index)}
              >
                {/* ゲージ表示（0の場合は非表示、右端揃えで逆方向に伸ばす） */}
                {clearedNum > 0 && (
                  <div
                    className="gauge-container"
                    style={{
                      position: "absolute",
                      left: "-30px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "20px",
                      height: "5px",
                      background: "transparent",
                      borderRadius: "4px",
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "flex-end", // 右端に揃える
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="gauge-bar"
                      style={{
                        width: `${Math.min(gaugeWidth, 100)}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #00ff88, #00aaff)",
                        borderRadius: "4px",
                        transition: "width 0.3s ease",
                      }}
                    ></div>
                  </div>
                )}

                {isNumbered && (
                  <span onClick={() => handleIndicatorClick(index)}>
                    #{itemNumber}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Indicator;
