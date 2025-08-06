import { Folder } from '@/interfaces';

interface FolderListProps {
  folders: Folder[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export default function FolderList({ folders, selectedId, onSelect }: FolderListProps) {
  return (
    <ul>
      {folders.map(folder => (
        <li
          key={folder.id}
          className={`cursor-pointer p-2 rounded ${selectedId === folder.id ? 'bg-blue-200' : 'hover:bg-gray-100'}`}
          onClick={() => onSelect(folder.id)}
        >
          {folder.name}
        </li>
      ))}
    </ul>
  );
}
