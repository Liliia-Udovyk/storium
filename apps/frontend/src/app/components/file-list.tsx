'use client';

import { useState } from 'react';
import { DocumentIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

import { StoredFile } from '@/interfaces';
import { deleteFile, updateFile, cloneFile } from '@/utils/queries/file';
import { ActionsDropdown } from './actions-dropdown';
import Modal from './ui/modal';

interface FileListProps {
  files: StoredFile[];
  refresh: () => void;
}

export default function FileList({ files, refresh }: FileListProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [activeModal, setActiveModal] = useState<'rename' | 'delete' | 'clone' | null>(null);

  const selectedFile = files.find((f) => f.id === selectedId);

  const closeModal = () => {
    setActiveModal(null);
    setSelectedId(null);
    setRenameValue('');
    setIsLoading(false);
  };

  const openRenameModal = (id: number) => {
    const file = files.find(f => f.id === id);
    if (!file) return;
    setSelectedId(id);
    setRenameValue(file.name);
    setActiveModal('rename');
  };

  const openDeleteModal = (id: number) => {
    setSelectedId(id);
    setActiveModal('delete');
  };

  const openCloneModal = (id: number) => {
    setSelectedId(id);
    setActiveModal('clone');
  };

  const handleRename = async () => {
    if (!renameValue.trim() || selectedId === null) return;
    setIsLoading(true);
    try {
      await updateFile(selectedId, { name: renameValue });
      toast.success('File renamed successfully');
      closeModal();
      refresh();
    } catch (err) {
      console.error('Rename failed', err);
      toast.error('Failed to rename file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClone = async () => {
    if (selectedId === null) return;
    setIsLoading(true);
    try {
      await cloneFile(selectedId, selectedFile?.folderId);
      toast.success('File cloned successfully');
      closeModal();
      refresh();
    } catch (err) {
      console.error('Clone failed', err);
      toast.error('Failed to clone file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (selectedId === null) return;
    setIsLoading(true);
    try {
      await deleteFile(selectedId);
      toast.success('File deleted successfully');
      closeModal();
      refresh();
    } catch (err) {
      console.error('Delete failed', err);
      toast.error('Failed to delete file');
    } finally {
      setIsLoading(false);
    }
  };

  if (files.length === 0) {
    return <p className="text-gray-500 text-center">No files in this folder.</p>;
  }

  return (
    <>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {files.map((file) => {
          const fileUrl = file.url.startsWith('http')
            ? file.url
            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${file.url}`;

          return (
            <li key={file.id} className="relative group">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`block rounded-lg p-4 border flex flex-col items-center justify-center space-y-2 transition-shadow
                  ${
                    selectedId === file.id
                      ? 'border-blue-600 bg-blue-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:shadow-md'
                  }`}
                title={file.name}
                onClick={() => setSelectedId(file.id)}
              >
                <DocumentIcon className="h-10 w-10 text-blue-500" />
                <span className="text-center text-sm font-medium truncate w-full">{file.name}</span>
              </a>

              <div className="absolute top-2 right-2 group-hover:opacity-100 transition">
                <ActionsDropdown
                  onRename={() => openRenameModal(file.id)}
                  onClone={() => openCloneModal(file.id)}
                  onRemove={() => openDeleteModal(file.id)}
                />
              </div>
            </li>
          );
        })}
      </ul>

      {activeModal === 'rename' && (
        <Modal
          title="Rename File"
          onClose={closeModal}
          onConfirm={handleRename}
          onCancel={closeModal}
          isLoading={isLoading}
          isDisabled={!renameValue.trim()}
          confirmText="Save changes"
        >
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && renameValue.trim()) {
                handleRename();
              }
            }}
          />
        </Modal>
      )}

      {activeModal === 'delete' && (
        <Modal
          title="Delete File"
          description={`Are you sure you want to delete "${selectedFile?.name}"?`}
          onClose={closeModal}
          onConfirm={handleRemove}
          onCancel={closeModal}
          isLoading={isLoading}
          confirmText="Yes"
          cancelText="No"
        />
      )}

      {activeModal === 'clone' && (
        <Modal
          title="Clone File"
          description={`Are you sure you want to clone "${selectedFile?.name}"?`}
          onClose={closeModal}
          onConfirm={handleClone}
          onCancel={closeModal}
          isLoading={isLoading}
          confirmText="Yes"
          cancelText="No"
        />
      )}
    </>
  );
}
