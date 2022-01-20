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
  title: string;
  extra?: string;
  note?: string;
  type: "timeline" | "file" | "checkin" | "notice";
  content?: any;
}
