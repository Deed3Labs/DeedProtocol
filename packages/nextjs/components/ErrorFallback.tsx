interface Props {
  error: Error;
}

export function ErrorFallback({ error }: Props) {
  return (
    <div>
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  );
}
