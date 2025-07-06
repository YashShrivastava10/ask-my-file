export type ChatListType = {
  docId: string;
  title: string;
  timeAgo: string;
  summary: string;
};

export type ChatDetailsType = {
  metadata: {
    pages: number;
    size: string;
    uploadDate: string;
  };
};
