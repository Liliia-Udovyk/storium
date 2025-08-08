'use client';

import { useState } from 'react';
import { Plus, Upload } from 'lucide-react';

import { useFolderContent } from '../hooks/useFolderContent';
import { useUploadFile } from '../hooks/useUploadFile';
import Loader from './ui/loader';
import Button from './ui/button';
import Header from './header';
import Breadcrumbs from './breadcrumbs';
import FolderList from './folder-list';
import FileList from './file-list';
import CreateFolderModal from './create-folder-modal';
import UploadFileModal from './upload-file-modal';

interface FolderViewProps {
  folderId: number | null;
  showBreadcrumbs?: boolean;
}

export default function FolderView({ folderId, showBreadcrumbs = true }: FolderViewProps) {
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
  } = useUploadFile();

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
      <Header />

      {showBreadcrumbs && (
        <div className="mb-6">
          <h1 className="text-xl font-bold text-blue-700">
            {folder?.name || 'Folder'}
          </h1>
          <Breadcrumbs folderId={folderId} />
        </div>
      )}

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Folders</h2>
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => setShowCreateFolderModal(true)}
          >
            New Folder
          </Button>
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
          <Button
            variant="primary"
            icon={<Upload size={16} />}
            onClick={() => setShowUploadFileModal(true)}
          >
            Upload File
          </Button>
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
