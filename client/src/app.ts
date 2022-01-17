import Taro from "@tarojs/taro";
import { Component } from "react";
import "./app.scss";
import { setGlobalData } from "./data/global";

class App extends Component {
  componentDidMount() {}

  onLaunch() {
    if (!Taro.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      Taro.cloud.init({
        traceUser: true,
        env: "cloud1-7gweoaho6f4398d8"
      });
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children;
  }
}

export default App;
