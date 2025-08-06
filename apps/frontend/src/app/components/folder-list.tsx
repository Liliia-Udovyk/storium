'use client';

import Link from 'next/link';
import { Folder } from '@/interfaces';
import { FolderIcon } from '@heroicons/react/24/outline';

interface FolderListProps {
  folders: Folder[];
  selectedId: number | null;
}

export default function FolderList({ folders, selectedId }: FolderListProps) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {folders.map(folder => (
        <li key={folder.id}>
          <Link
            href={`/folders/${folder.id}`}
            className={`block w-full rounded-lg p-4 border flex flex-col items-center justify-center space-y-2 transition-shadow
              ${
                selectedId === folder.id
                  ? 'border-blue-600 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:shadow-md'
              }`}
          >
            <FolderIcon className="h-10 w-10 text-blue-500" />
            <span className="text-center text-sm font-medium truncate w-full">{folder.name}</span>
          </Link>
        </li>
      ))}
      {folders.length === 0 && (
        <p className="col-span-full text-gray-500 text-center">No folders here.</p>
      )}
    </ul>
  );
}
