export default function Input({
  label,
  error,
  id,
  ...props
}) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>

      <input
        id={id}
        {...props}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}