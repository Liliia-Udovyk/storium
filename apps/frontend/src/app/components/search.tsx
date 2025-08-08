'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, Folder, File, X } from 'lucide-react';

import { useSearchFolders } from '@/utils/queries/folder';
import { useSearchFiles } from '@/utils/queries/file';
import Loader from './ui/loader';
import Button from './ui/button';

export default function SearchComponent() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const showResults = debouncedQuery.length > 1;

  const {
    folders,
    isLoading: loadingFolders,
  } = useSearchFolders(showResults ? debouncedQuery : null);

  const {
    files,
    isLoading: loadingFiles,
  } = useSearchFiles(showResults ? debouncedQuery : null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setDropdownOpen(query.trim().length > 0);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    setDropdownOpen(false);
  };

  const handleCloseDropdown = () => {
    setDropdownOpen(false);
    setQuery('');
  };

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search files or folders..."
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        <Search size={18} />
      </div>

      {query && (
        <Button
          variant="icon"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
          icon={<X size={18} />}
        />
      )}

      {dropdownOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded shadow z-50 max-h-80 overflow-auto">
          {loadingFolders || loadingFiles ? (
            <div className="p-4 text-sm text-gray-600">
              <Loader />
            </div>
          ) : (
            <>
              {(folders?.length === 0 && files?.length === 0) ? (
                <div className="p-4 text-sm text-gray-500">No results found.</div>
              ) : (
                <>
                  {folders?.length > 0 && (
                    <div className="px-4 py-2 text-xs text-gray-500 uppercase">Folders</div>
                  )}
                  {folders.map(folder => (
                    <Link
                      key={`folder-${folder.id}`}
                      href={`/folders/${folder.id}`}
                      onClick={handleCloseDropdown}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-gray-800"
                    >
                      <Folder size={16} />
                      {folder.name}
                    </Link>
                  ))}

                  {files?.length > 0 && (
                    <div className="px-4 py-2 text-xs text-gray-500 uppercase">Files</div>
                  )}
                  {files.map(file => {
                    const fileUrl = file.url.startsWith('http')
                      ? file.url
                      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${file.url}`;

                    return (
                      <Link
                        key={`file-${file.id}`}
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleCloseDropdown}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm text-gray-800"
                      >
                        <File size={16} />
                        {file.name}
                      </Link>
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
