export default {
  pages: [
    "pages/course/course",
    "pages/my/my",
    "pages/message/message",
    "pages/course_overview/course_overview",
    "pages/course_detail/course_detail",
    "pages/course_file/course_file",
    "pages/course_checkin/course_checkin",
    "pages/course_notice/course_notice",
    "pages/user_bind/user_bind",
    "pages/courseware/courseware",
    "pages/course_create/course_create",
    "pages/member/member"
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
        selectedIconPath: "images/tab_icon/course-filled.png",
        iconPath: "images/tab_icon/course-outlined.png",
        pagePath: "pages/course/course"
        // text: "课程"
      },
      {
        selectedIconPath: "images/tab_icon/message-filled.png",
        iconPath: "images/tab_icon/message-outlined.png",
        pagePath: "pages/message/message"
        // text: "消息"
      },
      {
        selectedIconPath: "images/tab_icon/my-filled.png",
        iconPath: "images/tab_icon/my-outlined.png",
        pagePath: "pages/my/my"
        // text: "我的"
      }
    ]
  }
};
