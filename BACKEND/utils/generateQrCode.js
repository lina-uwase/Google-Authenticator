import qrcode from 'qrcode';

export const generateQRCode = async (otpauthUrl) => {
  try {
    return await qrcode.toDataURL(otpauthUrl);
  } catch (error) {
    console.error('Error generating QR Code:', error);
    throw error;
  }
};
