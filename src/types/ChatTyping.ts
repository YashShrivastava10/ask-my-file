export type Chat = {
  s3_processed: "string";
  metadata: {
    uploadedAt: "string";
    fileName: "string";
    pages: number;
    lastModified: "string";
    fileSize: "string";
    fileType: "string";
    timeAgo: string;
  };
  docId: "string";
  s3_raw: "string";
  s3_summary: string;
  summary: string;
  role: string;
};
