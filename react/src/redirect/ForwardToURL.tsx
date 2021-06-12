import { useEffect, useState } from "react";
import { getURL } from "../functions";
import { Error } from "../util/Error";
import { LoadingSpinner } from "../util/LoadingSpinner";

type ForwardToURLProps = {
  id: string;
};

export function ForwardToURL({ id }: ForwardToURLProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFunctionsError, setIsFunctionsError] = useState<boolean>(false);

  useEffect(() => {
    getURL(id).then((r) => {
      setIsLoading(false);
      if (r === null) {
        console.error("Error fetching URL");
        setIsFunctionsError(true);
      } else {
        window.location.href = r;
      }
    });
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner text="Forwarding..." />;
  }

  if (!isLoading && isFunctionsError) {
    return <Error text="Unable to load URL!" />;
  }

  return <></>;
}
