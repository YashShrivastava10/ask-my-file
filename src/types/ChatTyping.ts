export type Chat = {
  s3_processed: "string";
  metadata: {
    uploadedAt: "string";
    fileName: "string";
    pages: number;
    lastModified: "string";
    fileSize: "string";
    fileType: "string";
  };
  docId: "string";
  s3_raw: "string";
};
