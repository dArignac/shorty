type ErrorProps = {
  text: string;
  columns?: number;
};

export function Error({ text, columns = 12 }: ErrorProps) {
  return (
    <div className="row">
      <div className={"col-" + columns + " p-1"}>
        <div className="toast toast--danger">
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
}
