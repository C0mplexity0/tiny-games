import QRCode from "qrcode";
import { getWebServerPort } from "@/web";
import { ip } from "address"; // For getting the local IP address (e.g. 192.168.0.1)


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

export async function generateDeviceQrCode() {
  const url = `http://${ip()}:${getWebServerPort()}/web`;
  const code = await generateQrCode(url);

  return code;
}
