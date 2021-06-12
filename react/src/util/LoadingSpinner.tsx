type LoadingSpinnerProps = {
  text?: string;
};

export function LoadingSpinner({ text }: LoadingSpinnerProps) {
  return (
    <div className="row">
      <div className="col-12 p-1">
        <div className="animated loading loading-left">
          <p>{text ? text : "Loading..."}</p>
        </div>
      </div>
    </div>
  );
}
