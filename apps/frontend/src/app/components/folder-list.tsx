'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FolderIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

import { Folder } from '@/interfaces';
import { updateFolder, cloneFolder, deleteFolder } from '@/utils/queries/folder';
import Modal from './ui/modal';
import { ActionsDropdown } from './actions-dropdown';

interface FolderListProps {
  folders: Folder[];
  refresh: () => void;
}

export default function FolderList({ folders, refresh }: FolderListProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeModal, setActiveModal] = useState<'rename' | 'delete' | 'clone' | null>(null);

  const selectedFolder = folders.find(f => f.id === selectedId);

  const closeModal = () => {
    setActiveModal(null);
    setSelectedId(null);
    setRenameValue('');
    setIsLoading(false);
  };

  const openRenameModal = (id: number) => {
    const folder = folders.find(f => f.id === id);
    if (!folder) return;
    setSelectedId(id);
    setRenameValue(folder.name);
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
      await updateFolder(selectedId, { name: renameValue });
      toast.success('Folder renamed successfully');
      closeModal();
      refresh();
    } catch (err) {
      console.error('Rename failed', err);
      toast.error('Failed to rename folder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClone = async () => {
    if (selectedId === null) return;
    setIsLoading(true);
    try {
      await cloneFolder(selectedId);
      toast.success('Folder cloned successfully');
      closeModal();
      refresh();
    } catch (err) {
      console.error('Clone failed', err);
      toast.error('Failed to clone folder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (selectedId === null) return;
    setIsLoading(true);
    try {
      await deleteFolder(selectedId);
      toast.success('Folder deleted successfully');
      closeModal();
      refresh();
    } catch (err) {
      console.error('Delete failed', err);
      toast.error('Failed to delete folder');
    } finally {
      setIsLoading(false);
    }
  };

  if (folders.length === 0) {
    return <p className="text-gray-500 text-center">No folders here.</p>;
  }

  return (
    <>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {folders.map(folder => (
          <li key={folder.id} className="relative group">
            <Link
              href={`/folders/${folder.id}`}
              className={`block w-full rounded-lg p-4 border flex flex-col items-center justify-center space-y-2 transition-shadow
                ${
                  selectedId === folder.id
                    ? 'border-blue-600 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:shadow-md'
                }`}
              onClick={() => setSelectedId(folder.id)}
            >
              <FolderIcon className="h-10 w-10 text-blue-500" />
              <span className="text-center text-sm font-medium truncate w-full">{folder.name}</span>
            </Link>

            <div className="absolute top-2 right-2 group-hover:opacity-100 transition">
              <ActionsDropdown
                onRename={() => openRenameModal(folder.id)}
                onClone={() => openCloneModal(folder.id)}
                onRemove={() => openDeleteModal(folder.id)}
              />
            </div>
          </li>
        ))}
      </ul>

      {activeModal === 'rename' && (
        <Modal
          title="Rename Folder"
          onClose={closeModal}
          onConfirm={handleRename}
          onCancel={closeModal}
          isLoading={isLoading}
          isDisabled={!renameValue.trim()}
          confirmText="Rename"
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
          title="Delete Folder"
          description={`Are you sure you want to delete "${selectedFolder?.name}"?`}
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
          title="Clone Folder"
          description={`Are you sure you want to clone folder "${selectedFolder?.name}" with all files?`}
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
