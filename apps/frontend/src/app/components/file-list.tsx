import { DocumentIcon } from '@heroicons/react/24/outline';

import { StoredFile } from '@/interfaces';

interface FileListProps {
  files: StoredFile[];
  selectedId?: number | null;
  onSelect?: (id: number | null) => void;
}

export default function FileList({ files, selectedId = null, onSelect }: FileListProps) {
  if (files.length === 0) {
    return <p className="text-gray-500 text-center">No files in this folder.</p>;
  }

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {files.map(file => (
        <li key={file.id}>
          <a
            href={file.url.startsWith('http') ? file.url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${file.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`block rounded-lg p-4 border flex flex-col items-center justify-center space-y-2 transition-shadow
              ${
                selectedId === file.id
                  ? 'border-blue-600 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:shadow-md'
              }`}
            title={file.name}
            onClick={() => onSelect?.(file.id)}
          >
            <DocumentIcon className="h-10 w-10 text-blue-500" />
            <span className="text-center text-sm font-medium truncate w-full">{file.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
