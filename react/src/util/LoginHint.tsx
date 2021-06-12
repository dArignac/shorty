import { links } from "./links";

export function LoginHint() {
  return (
    <div className="row">
      <div className="col-12 p-1">
        <a className="btn btn-warning" href={links.login}>
          Please log in to create a short URL
          <i className="fa-wrapper fa fa-chevron-right pad-left"></i>
        </a>
      </div>
    </div>
  );
}
