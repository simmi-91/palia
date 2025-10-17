export const LoadingState = ({ color }: { color: string }) => {
  return (
    <div className="text-center">
      <div className={`spinner-border text-${color}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export const ErrorState = ({ error }: { error: any }) => {
  const message = error?.message || "An unknown error occurred";

  return (
    <div className="text-center">
      <div className="text-danger">Error loading data: {message}</div>
    </div>
  );
};

export const EmptyCategoryState = () => (
  <div className="container-fluid">
    <div className="alert alert-info text-center">
      <p>
        <b>Empty dataset</b>
      </p>
      <p>This category is missing entries</p>
    </div>
  </div>
);
