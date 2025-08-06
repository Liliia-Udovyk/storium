'use client';

import { useState } from 'react';

import { useGetFiles, useGetFolders } from '@/utils/queries';
import Breadcrumbs from './components/breadcrumbs';
import FolderList from './components/folder-list';
import FileList from './components/file-list';
import CreateFolderModal from './components/create-folder-modal';
import UploadFileModal from './components/upload-file-modal';

export default function DashboardPage() {
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showUploadFileModal, setShowUploadFileModal] = useState(false);

  const { folders, isLoading: foldersLoading } = useGetFolders(currentFolderId);
  const { files, isLoading: filesLoading } = useGetFiles(currentFolderId);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-blue-800">Storium</h1>
      </div>

      <Breadcrumbs folderId={currentFolderId ?? undefined} />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Folders</h2>
          <button
            onClick={() => setShowCreateFolderModal(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            + Folder
          </button>
        </div>
        {foldersLoading ? (
          <p>Loading folders...</p>
        ) : (
          <FolderList
            folders={folders}
            selectedId={currentFolderId}
            onSelect={(id) => setCurrentFolderId(id)}
          />
        )}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Files</h2>
          <button
            onClick={() => setShowUploadFileModal(true)}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            + File
          </button>
        </div>
        {filesLoading ? (
          <p>Loading files...</p>
        ) : (
          <FileList files={files} />
        )}
      </div>

      {showCreateFolderModal && (
        <CreateFolderModal
          parentId={currentFolderId}
          onClose={() => setShowCreateFolderModal(false)}
          onSuccess={() => {
          }}
        />
      )}

      {showUploadFileModal && (
        <UploadFileModal
          folderId={currentFolderId}
          onClose={() => setShowUploadFileModal(false)}
          onSuccess={() => {
          }}
        />
      )}
    </div>
  );
}
