import { useEffect } from "react";
import { Route, Switch } from "wouter";
import { getUserIdentification } from "./auth";
import { URLForm } from "./create/URLForm";
import { Header } from "./Header";
import { ForwardToURL } from "./redirect/ForwardToURL";
import { ShowURL } from "./show/ShowURL";
import { ShortyStore } from "./store";
import { LoginHint } from "./util/LoginHint";

function App() {
  const isLoggedIn = ShortyStore.useState((s) => s.isLoggedIn);

  useEffect(() => {
    getUserIdentification().then((data) => {
      ShortyStore.update((s) => {
        s.isLoggedIn =
          data.clientPrincipal !== null &&
          data.clientPrincipal.userRoles.includes("authenticated");
        s.user = data.clientPrincipal;
      });
    });
  });

  return (
    <>
      <Header />
      <div className="w-90 mt-6">
        <Switch>
          <Route path="/" component={isLoggedIn ? URLForm : LoginHint} />
          <Route path="/:id">
            {(params) => <ForwardToURL id={params.id} />}
          </Route>
          <Route path="/d/:id">
            {(params) =>
              isLoggedIn ? <ShowURL id={params.id} /> : <LoginHint />
            }
          </Route>
          <Route>
            <div className="row">
              <div className="col-12 p-1">Not found.</div>
            </div>
          </Route>
        </Switch>
      </div>
    </>
  );
}

export default App;
