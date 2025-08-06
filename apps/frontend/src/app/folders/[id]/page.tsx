import FolderView from "@/app/components/folder-view";

export default function FolderPage({ params }: { params: { id: string } }) {
  const folderId = Number(params.id);
  return <FolderView folderId={folderId} />;
}