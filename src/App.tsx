import { Demo } from "./pages/demo.tsx";
import { Sample } from "./pages/sample.tsx";

function App() {
  //根据查询字符串渲染不同的页面
  const page = new URLSearchParams(window.location.search).get("page");
  if (page === "demo") {
    return <Demo />;
  }

  return <Sample />;
}

export default App;
