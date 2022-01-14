export default {
  pages: [
    "pages/course/course",
    "pages/my/my",
    "pages/message/message",
    "pages/course_overview/course_overview"
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black"
  },
  tabBar: {
    color: "#a9b7b7",
    selectedColor: "#6190E8",
    borderStyle: "black",
    list: [
      {
        // selectedIconPath: "images/icon_consult_press.png",
        // iconPath: "images/icon_consult.png",
        pagePath: "pages/course/course",
        text: "课程"
      },
      {
        // selectedIconPath: "images/icon_consult_press.png",
        // iconPath: "images/icon_consult.png",
        pagePath: "pages/message/message",
        text: "消息"
      },
      {
        // selectedIconPath: "images/icon_mine_press.png",
        // iconPath: "images/icon_mine.png",
        pagePath: "pages/my/my",
        text: "我的"
      }
    ]
  }
};
