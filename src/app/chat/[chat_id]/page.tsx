import ChatDetails from "@/components/ChatDetails/ChatDetails";

export type MetaData = {
  fileName: string;
  fileSize: string;
  fileType: string;
  lastModified: string;
  pages: number;
  uploadedAt: string;
  role: string;
};

const ChatDetailsPage = async ({
  params,
}: {
  params: Promise<{ chat_id: string }>;
}) => {
  const docId = (await params).chat_id;
  const metadataResponse = await fetch(
    `${process.env.WEB_URI}/api/metadata/${docId}`
  );

  const metadataData = await metadataResponse.json();

  return <ChatDetails metadata={metadataData.data} docId={docId} />;
};

export default ChatDetailsPage;
