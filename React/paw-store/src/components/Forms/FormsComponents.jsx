export const Title = ({ children, className }) => {
  return <h2 className={className}>{children}</h2>;
};

export const Form = ({ children, ...props }) => {
  return <form {...props}>{children}</form>;
};

export const Field = ({
  children,
  labelClassName,
  inputClassName,
  inputErrorClassName,
  errorClassName,
  error,
  ...inputProps
}) => {
  const computedInputClass =
    [inputClassName, error && inputErrorClassName].filter(Boolean).join(' ') ||
    undefined;

  return (
    <>
      <label className={labelClassName} htmlFor={inputProps.id}>
        {children}
      </label>
      <input className={computedInputClass} {...inputProps} />
      <div aria-live="assertive">
        {error && <span className={errorClassName}>{error}</span>}
      </div>
    </>
  );
};

export const FieldTextarea = ({
  children,
  labelClassName,
  inputClassName,
  inputErrorClassName,
  errorClassName,
  error,
  ...inputProps
}) => {
  const computedInputClass =
    [inputClassName, error && inputErrorClassName].filter(Boolean).join(' ') ||
    undefined;

  return (
    <>
      <label className={labelClassName} htmlFor={inputProps.id}>
        {children}
      </label>
      <textarea className={computedInputClass} {...inputProps}></textarea>
      <div aria-live="assertive">
        {error && <span className={errorClassName}>{error}</span>}
      </div>
    </>
  );
};

export const Button = ({ children, ...props }) => {
  return <button {...props}>{children}</button>;
};
