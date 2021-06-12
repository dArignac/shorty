import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { getURL } from "../functions";
import { Error } from "../util/Error";
import { LoadingSpinner } from "../util/LoadingSpinner";
import styles from "./ShowURL.module.scss";

type ShowURLProps = {
  id: string;
};

export function ShowURL({ id }: ShowURLProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFunctionsError, setIsFunctionsError] = useState<boolean>(false);
  const [url, setURL] = useState<string | null>(null);

  const [qrCodeGenerationSuccess, setQRCodeGenerationSuccess] =
    useState<boolean | null>(null);
  const [qrCode, setQRCode] = useState<string>("");

  useEffect(() => {
    getURL(id).then((r) => {
      setIsLoading(false);
      if (r === null) {
        console.error("Error fetching URL");
        setIsFunctionsError(true);
      } else {
        setURL(r);
        QRCode.toDataURL(r, { errorCorrectionLevel: "M" })
          .then((qr) => {
            setQRCode(qr);
            setQRCodeGenerationSuccess(true);
          })
          .catch((e) => {
            console.error("qr code generation failed", e);
            setQRCodeGenerationSuccess(false);
          });
      }
    });
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isLoading && isFunctionsError) {
    return <Error text="Unable to load URL!" />;
  }

  const shortURL = process.env.REACT_APP_DOMAIN + "/" + id;

  let qrCodeHTML;
  if (qrCodeGenerationSuccess === null) {
    qrCodeHTML = <div>Generating QR code...</div>;
  } else if (!qrCodeGenerationSuccess) {
    qrCodeHTML = (
      <div className="toast toast--warning">
        <p>Unable to generate QR code!</p>
      </div>
    );
  } else if (qrCodeGenerationSuccess) {
    qrCodeHTML = (
      <div>
        <img className={styles.img} src={qrCode} alt={"QR code for " + url} />
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-12 p-1">
        <p>
          <strong>URL:</strong> <a href={url!}>{url}</a>
        </p>
        <p>
          <strong>Short-URL:</strong> <a href={shortURL}>{shortURL}</a>
        </p>
      </div>
      <div className="col-12 p-1">{qrCodeHTML}</div>
    </div>
  );
}
