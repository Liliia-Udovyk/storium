'use client';

import { useState } from 'react';
import Link from 'next/link';

import Breadcrumbs from './breadcrumbs';
import FolderList from './folder-list';
import FileList from './file-list';
import CreateFolderModal from './create-folder-modal';
import UploadFileModal from './upload-file-modal';
import Loader from './ui/loader';
import { useFolderContent } from '../hooks/useFolderContent';
import { useUploadFileMutation } from '@/utils/queries/file';

interface FolderViewProps {
  folderId: number | null;
  showHeader?: boolean;
}

export default function FolderView({ folderId, showHeader = true }: FolderViewProps) {
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showUploadFileModal, setShowUploadFileModal] = useState(false);

  const {
    folder,
    folders,
    files,
    loading,
    errors,
    refreshAll,
  } = useFolderContent(folderId);

  const {
    uploadFile,
    isLoading: uploadingFile,
    error: uploadFileError,
  } = useUploadFileMutation();

  const handleFolderCreated = async () => {
    refreshAll();
    setShowCreateFolderModal(false);
  };

  const handleFileUploaded = async () => {
    refreshAll();
    setShowUploadFileModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="text-2xl font-bold text-blue-800 cursor-pointer">
          Storium
        </Link>
      </div>

      {showHeader && (
        <header className="mb-6">
          <h1 className="text-xl font-bold text-blue-700">
            {folder?.name || 'Folder'}
          </h1>
          <Breadcrumbs folderId={folderId} />
        </header>
      )}

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Folders</h2>
          <button
            onClick={() => setShowCreateFolderModal(true)}
            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + New Folder
          </button>
        </div>
        {loading && !folders.length ? (
          <Loader />
        ) : errors.folders ? (
          <p className="text-red-500">Failed to load folders.</p>
        ) : (
          <FolderList folders={folders ?? []} refresh={refreshAll} />
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Files</h2>
          <button
            onClick={() => setShowUploadFileModal(true)}
            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Upload File
          </button>
        </div>
        {loading && !files.length ? (
          <Loader />
        ) : errors.files ? (
          <p className="text-red-500">Failed to load files.</p>
        ) : (
          <FileList files={files ?? []} refresh={refreshAll} />
        )}
      </section>

      {showCreateFolderModal && (
        <CreateFolderModal
          parentId={folderId}
          onClose={() => setShowCreateFolderModal(false)}
          onSuccess={handleFolderCreated}
        />
      )}

      {showUploadFileModal && (
        <UploadFileModal
          folderId={folderId}
          onClose={() => setShowUploadFileModal(false)}
          onSuccess={handleFileUploaded}
          uploadFile={uploadFile}
          isLoading={uploadingFile}
          error={uploadFileError ?? null}
        />
      )}
    </div>
  );
}
