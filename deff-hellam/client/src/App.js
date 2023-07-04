import React, { useEffect, useState } from "react";
import CryptoJS, { AES } from "crypto-js";
import axios from "axios";

import crypto from "crypto-browserify";
import { Buffer } from "buffer";
import { Transform } from "stream-browserify";
import ENC_UTF8 from "crypto-js/enc-utf8";

global.Buffer = Buffer;
global.Transform = Transform;
window.Transform = Transform;

const App = () => {
  const [inputText, setInputText] = useState("");
  const [encryptedText, setEncryptedText] = useState("");

  // const GET_KEY = () => {
  //   // Generate Diffie-Hellman key pair on the server
  //   const server = crypto.createDiffieHellman(1024);
  //   const serverKeys = server.generateKeys();

  //   // Store the server's private key securely
  //   const serverPrivateKey = server.getPrivateKey("hex");

  //   // Share the server's public key with the client
  //   const serverPublicKey = server.getPublicKey("hex");

  //   function computeSharedSecret(clientPublicKey) {
  //     const sharedSecret = server.computeSecret(clientPublicKey, "hex");
  //     return sharedSecret;
  //   }
  // };

  const GET_KEY = () => {
    // Creating Client

    const client = crypto.createDiffieHellman(256); // 1024 mai karna hai
    const clientPublicKey = client.generateKeys().toString("base64");
      console.log("clientPublicKey>>>>>>>>>> ",clientPublicKey);
    // Get Server Public key
    axios
      .get(`http://localhost:5000/profile`, {
        clientPublicKey: clientPublicKey,
      })
      .then((response) => {
        const serverPublicKey = Buffer.from(response.data, "base64");
        const sharedSecret = client.computeSecret(serverPublicKey, "base64");

        axios
          .post(`http://localhost:5000/homeinfo`, {
            sharedSecret: sharedSecret,
          })
          .then((response) => {
            var iv = Buffer.from(response.data.iv, "hex");

            const decipher = crypto.createDecipheriv(
              "aes-256-cbc",
              sharedSecret,
              iv
            );

            let decrypted = decipher.update(
              response.data.encrypted,
              "hex",
              "utf8"
            );
            decrypted += decipher.final("utf8");

            localStorage.setItem(
              "decrypted_KEY",
              JSON.stringify(decrypted.replaceAll('"', ""))
            );
          });
      });
  };

  useEffect(() => {
    GET_KEY();
  }, []);

  function decryptData(encryptedData, key) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  }
  const encryptData = async (data) => {
    const key = JSON.parse(localStorage.getItem("decrypted_KEY")); // Replace with your own secret key
    console.log("secret----key>>>>>>>>> ", key);
    const datas = CryptoJS.AES.encrypt(data, key).toString();
    const res = await axios.post("http://localhost:5000/encryptdata", {
      encryptedText: datas,
    });
    console.log({ res });
    const decryptDatas = decryptData(res.data.encryptedData, key);
    console.log("decryptDatas>>>>>>>>>> ", decryptDatas);
    setEncryptedText(decryptDatas);
  };

  return (
    <div>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={() => encryptData(inputText)}>Encrypt</button>
      <div>encryptedText :{String(encryptedText)}</div>
    </div>
  );
};

export default App;
