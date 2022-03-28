import { links } from "./links";

export function LoginHint() {
  return (
    <div className="row">
      <div className="col-12 p-1">
        <a className="btn btn-warning" href={links.login}>
          Click here to log in to create a short URL
        </a>
      </div>
    </div>
  );
}
