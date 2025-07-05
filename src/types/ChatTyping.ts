export type ChatListType = {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
};

export type ChatDetailsType = {
  title: string;
  summary: string;
  metadata: {
    pages: number;
    size: string;
    uploadDate: string;
  };
};
