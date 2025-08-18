import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // react-router-domが提供する、現在のURL情報を取得するためのフック
  const { pathname } = useLocation();

  // pathname（URLのパス部分）が変わるたびに、以下の処理を実行する
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // このコンポーネント自体は、画面には何も表示しない
  return null;
};

export default ScrollToTop;
