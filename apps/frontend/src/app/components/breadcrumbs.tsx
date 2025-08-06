import { useFolderBreadcrumb } from "@/utils/queries";

const Breadcrumbs = ({
  folderId,
  onNavigate,
}: {
  folderId?: number | null;
  onNavigate?: (id: number | null) => void;
}) => {
  const { breadcrumbs, isLoading, isError } = useFolderBreadcrumb(folderId);

  if (isLoading || isError) return <p className="text-sm text-gray-500">...</p>;

  return (
    <nav className="text-sm text-gray-600 mb-4">
      <span
        onClick={() => (onNavigate ? onNavigate(null) : (window.location.href = '/'))}
        className="cursor-pointer hover:underline text-blue-600"
      >
        Root
      </span>
      {breadcrumbs.map((crumb, i) => (
        <span key={crumb.id}>
          {' / '}
          <span
            onClick={() =>
              onNavigate
                ? onNavigate(crumb.id)
                : (window.location.href = `/folders/${crumb.id}`)
            }
            className="cursor-pointer hover:underline text-blue-600"
          >
            {crumb.name}
          </span>
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;