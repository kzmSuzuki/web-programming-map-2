// src/components/Container.tsx
import React, { useRef, useEffect } from "react";
import ContentsList from "./ContentsList";
import Indicator from "./Indicator";
import useJsonp from "../hooks/useJsonp";
import MouseIcon from "./MouseIcon";
import LoadingIcon from "./LoadingIcon";

interface ContainerProps {
  userEmail: string;
  onScrollComplete?: () => void;
  visible?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  userEmail,
  onScrollComplete,
  visible = false, // 初期値をfalseに変更
}) => {
  const { data, error } = useJsonp(userEmail);
  const listRef = useRef<HTMLUListElement | null>(null);
  const titleContentRef = useRef<HTMLLIElement | null>(null);
  const titleSpanRef = useRef<HTMLSpanElement | null>(null);
  const hasScrolledRef = useRef(false); // 一度だけスクロール実行フラグ

  // 最下部へ一度スクロール（フォント読み込み完了後・1回のみ）
  useEffect(() => {
    if (!data || hasScrolledRef.current) return;
    const el = listRef.current;
    if (!el) return;

    hasScrolledRef.current = true; // フラグを立てて重複実行防止

    // フォント読み込み完了を待ってからスクロール
    Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 500)), // 少し長めのフォールバック
    ]).then(() => {
      // 追加の遅延でレイアウト完全確定を待つ
      requestAnimationFrame(() => {
        if (el && !hasScrolledRef.current) return; // 既に実行済みなら何もしない
        el.scrollTop = el.scrollHeight; // 末尾へ
        console.log("[scroll] executed once:", el.scrollTop, el.scrollHeight);

        // スクロール動作完了後、コールバックを呼び出し
        setTimeout(() => {
          onScrollComplete?.();
        }, 800); // スクロールアニメーション完了を待つ
      });
    });
  }, [data]);

  // タイトルアニメーション: Container表示後に発火
  useEffect(() => {
    if (!visible || !data || !titleSpanRef.current) return;

    // 表示アニメーション完了後に少し遅延してタイトルアニメーション開始
    const timer = setTimeout(() => {
      titleSpanRef.current?.classList.add("active");
    }, 300); // フェードイン完了後に実行

    return () => clearTimeout(timer);
  }, [visible, data]);

  // スクロール制限: data[1].state番目の要素以上にスクロールできないようにする
  useEffect(() => {
    if (!data || !listRef.current) return;

    const handleScroll = () => {
      const el = listRef.current;
      if (!el || !data[1]?.state) return;

      // data[1].state番目のli要素を取得（最初の2つの force-invisible + ContentsList内の要素）
      const targetIndex = Number(data[1].state) + 6; // 0ベースのインデックス
      console.log("[handleScroll] targetIndex: ", targetIndex);

      const targetElement = el.children[
        el.children.length - targetIndex
      ] as HTMLElement;

      if (targetElement) {
        console.log("[handleScroll] targetElement: ", targetElement);
        const targetTop = targetElement.offsetTop;
        console.log("[handleScroll] targetTop: ", targetTop);
        console.log("[handleScroll] scrollTop: ", el.scrollTop);
        if (el.scrollTop < targetTop) {
          el.scrollTop = targetTop;
        }
      }
    };

    const el = listRef.current;
    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [data]);

  // マウス座標追跡機能: 各li要素にマウス位置を追跡
  useEffect(() => {
    if (!data || !listRef.current) return;

    const addMouseTracking = () => {
      const listItems = listRef.current?.querySelectorAll("li");
      if (!listItems) return;

      listItems.forEach((li) => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = li.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          // CSS変数を更新
          (li as HTMLElement).style.setProperty("--mouse-x", x + "px");
          (li as HTMLElement).style.setProperty("--mouse-y", y + "px");
        };

        li.addEventListener("mousemove", handleMouseMove);

        // クリーンアップ用に関数を保存
        (li as any)._handleMouseMove = handleMouseMove;
      });
    };

    const removeMouseTracking = () => {
      const listItems = listRef.current?.querySelectorAll("li");
      if (!listItems) return;

      listItems.forEach((li) => {
        const handleMouseMove = (li as any)._handleMouseMove;
        if (handleMouseMove) {
          li.removeEventListener("mousemove", handleMouseMove);
          delete (li as any)._handleMouseMove;
        }
      });
    };

    // データロード後にマウストラッキングを追加
    const timer = setTimeout(addMouseTracking, 100);

    return () => {
      clearTimeout(timer);
      removeMouseTracking();
    };
  }, [data]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return (
      <>
        <LoadingIcon />
      </>
    );
  }

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
        visibility: visible ? "visible" : "hidden", // 完全に非表示にする
      }}
    >
      <ul
        ref={listRef}
        scroll-animation="z-stack"
        style={{ "--_animation": "z-stack" } as React.CSSProperties}
        id="infinite-list"
      >
        <li className="force-invisible"></li>
        <li className="force-invisible"></li>
        <ContentsList data={data} />
        <li className="title-content" ref={titleContentRef}>
          <p className="title">Web Programming I Skill Map</p>
          <p className="sub-title">
            Chapter 2:{" "}
            <span ref={titleSpanRef} className="title-span">
              BACKEND
            </span>
          </p>
        </li>
        <li className="force-invisible"></li>
        <li className="force-invisible"></li>
      </ul>
      <Indicator data={data} />
      <MouseIcon />
    </div>
  );
};

export default Container;
