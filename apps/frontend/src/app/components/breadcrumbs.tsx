import { useFolderBreadcrumb } from '@/utils/queries';

const Breadcrumbs = ({ folderId }: { folderId?: number }) => {
  const { breadcrumbs, isLoading, isError } = useFolderBreadcrumb(folderId);

  if (isLoading) return <p>Loading breadcrumbs...</p>;
  if (isError) return <p>Error loading breadcrumbs.</p>;

  return (
    <nav>
      {breadcrumbs.map((crumb, i) => (
        <span key={crumb.id}>
          {crumb.name}
          {i < breadcrumbs.length - 1 && ' / '}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
