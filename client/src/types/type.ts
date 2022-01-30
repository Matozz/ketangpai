export interface UserInfo {
  avatarUrl: string;
  nickName: string;
  realName: string;
  school: string;
  uid: string;
  type: number;
}

export interface CourseCardProps {
  name: string;
  desc?: string;
  options?: boolean;
  teacher: string;
  avatarUrl?: string;
  premium?: boolean;
  cid?: string;
  type?: 1 | 0;
}

export interface DetailCardProps {
  item: {
    _id: string;
    cid: string;
    title: string;
    extra?: string;
    type: "detail" | "file" | "checkin" | "notice";
    content?: any;
    fileID?: string;
    createTime: string;
    scheduleTime: string;
    finishTime?: string;
  };
  viewType: 0 | 1;
  premium: number;
}
