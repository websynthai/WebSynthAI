export interface User {
  username: string;
  imageUrl: string | null;
}

export interface UI {
  id: string;
  userId: string;
  prompt: string;
  img: string;
  uiType: string;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  viewCount: number;
  forkedFrom: string | null;
  user: User;
}
