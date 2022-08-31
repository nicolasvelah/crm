import CryptoJS from 'crypto-js';

const secret = `${process.env.REACT_APP_CRYPTO_SECRET!}`;

const decrypt = (data: string, isJson: boolean = false): any => {
  //console.log('entro descryp', data, isJson);
  const decryptedData = CryptoJS.AES.decrypt(data, secret).toString(
    CryptoJS.enc.Utf8
  );

  //console.log('descrypt>>>>', decryptedData);
  if (isJson) {
    return JSON.parse(decryptedData);
  }
  return decryptedData;
};

const crypt = (data:any): any => {
  const crypData = CryptoJS.AES.encrypt(
    JSON.stringify({ data }),
    `${process.env.REACT_APP_CRYPTO_SECRET}`
  ).toString();
  //console.log('crypData', decryptedData);
  return crypData;
};

// eslint-disable-next-line import/prefer-default-export
export { decrypt, crypt };
