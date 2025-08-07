'use client';

import { useState } from 'react';

import Modal from './ui/modal';
import { createFolder } from '@/utils/queries/folder';

interface CreateFolderModalProps {
  parentId: number | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateFolderModal({
  parentId,
  onClose,
  onSuccess,
}: CreateFolderModalProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      setIsLoading(true);
      await createFolder({ name, parentId });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to create folder. Please try again.');
    }
    setIsLoading(false);
    setName('');
  };

  return (
    <Modal
      title="Create New Folder"
      onClose={onClose}
      onCancel={onClose}
      onConfirm={handleSubmit}
      isLoading={isLoading}
      isDisabled={!name.trim()}
      confirmText="Create"
      error={error ?? null}
    >
      <input
        type="text"
        placeholder="Folder name"
        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isLoading}
        autoFocus
      />
    </Modal>
  );
}
