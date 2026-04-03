const Spinner = () => {
  return (
    <div className="flex justify-center items-center pt-8">
      <div
        data-test="spinner"
        className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"
        role="status"
      >
        <span data-test="spinner-text" className="sr-only">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Spinner;
