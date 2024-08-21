import QRCode from "qrcode";


function generateQrCode(string: string) {
  return new Promise<string>((resolve, reject) => {
    QRCode.toDataURL(string, { errorCorrectionLevel: "H" }, function (err, url) {
      if (err) {
        console.error("Failed to generate QR code from string " + string + ": " + err);
        reject();
        return;
      }

      resolve(url);
    });
  });
}

export async function generateDeviceQrCode(url: string) {
  const code = await generateQrCode(url);

  return code;
}
