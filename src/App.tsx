import { Demo } from "./pages/demo.tsx";
import { SamplesIndex } from "./pages/index";

function App() {
  //根据查询字符串渲染不同的页面
  const page = new URLSearchParams(window.location.search).get("page");
  if (page === "demo") {
    return <Demo />;
  }

  return <SamplesIndex />;
}

export default App;
