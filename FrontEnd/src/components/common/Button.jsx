export default function Button({
  children,
  loading = false,
  disabled = false,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}