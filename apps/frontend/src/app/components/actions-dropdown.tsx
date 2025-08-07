import { FC } from 'react';
import { CopyIcon, Trash2Icon, PencilIcon } from 'lucide-react';

import { DropdownMenu } from './ui/dropdown-menu';

interface ActionsDropdownProps {
  onRename: () => void;
  onClone: () => void;
  onRemove: () => void;
}

export const ActionsDropdown: FC<ActionsDropdownProps> = ({ onRename, onClone, onRemove }) => {
  return (
    <DropdownMenu
      actions={[
        {
          label: 'Rename',
          onClick: onRename,
          icon: <PencilIcon className="w-4 h-4" />,
        },
        {
          label: 'Clone',
          onClick: onClone,
          icon: <CopyIcon className="w-4 h-4" />,
        },
        {
          label: 'Delete',
          onClick: onRemove,
          icon: <Trash2Icon className="w-4 h-4 text-red-500" />,
        },
      ]}
    />
  );
};
