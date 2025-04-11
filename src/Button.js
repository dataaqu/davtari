// A reusable Button component which renders a button element
// It takes "children" (to display inside the button) and an "onClick" handler as props.

export function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
