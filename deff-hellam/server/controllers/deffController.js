const crypto = require("crypto");



 module.exports={
    profileKeyMangenment: async (req, res, next) => {
    try {
      const server = crypto.createDiffieHellman(256);
      const serverPublicKey = server.generateKeys().toString("base64");   // This generates the Public key from the backend
      res.send(serverPublicKey);
    } catch (err) {
      // console.log("12088", err);
      common.logError(err);
      res
        .status(400)
        .json({
          status: 3,
          message: err
        })
        .end();
    }
  },

  homeinfoKeyMangenment: async (req, res, next) => {
    try {
      const key =
        "Anup";
      const sharedSecret = Buffer.from(req.body.sharedSecret, "base64");  // This key is coming from Frontend
      const iv = crypto.randomBytes(16);

      const cipher = crypto.createCipheriv("aes-256-cbc", sharedSecret, iv);
      let encrypted = cipher.update(key, "utf8", "hex");
      encrypted += cipher.final("hex");
      console.log("encrypted>>>>>>>>>>>>>> ", encrypted);     // This  we are encrypting the key i.e Key = "Anup"

      res.send({ encrypted: encrypted, iv: iv.toString("hex") });
    } catch (err) {
      // console.log("12088", err);
      common.logError(err);
      res
        .status(400)
        .json({
          status: 3,
          message: err
        })
        .end();
    }
  }
 }


