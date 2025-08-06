import { StoredFile } from '@/interfaces';

interface FileListProps {
  files: StoredFile[];
}

export default function FileList({ files }: FileListProps) {
  return (
    <ul>
      {files.map(file => (
        <li key={file.id} className="p-2 border-b">
          <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {file.name}
          </a>
        </li>
      ))}
      {files.length === 0 && <li>No files in this folder.</li>}
    </ul>
  );
}
