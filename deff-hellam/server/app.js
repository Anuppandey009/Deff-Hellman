const express = require('express')
const crypto = require('crypto');
const cors = require('cors')
const CryptoJS = require('crypto-js')
const Joi = require("joi");

const {
  validateBody,
  schemas,
} = require("./helpers/bodyValidate");

const { profileKeyMangenment, homeinfoKeyMangenment } = require('./controllers/deffController');


const app = express()
app.use(express.json())
app.use(cors())



function decryptData(encryptedData, key) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
}
function encryptData(data, key) {
  const jsonDatas = JSON.stringify(data);
  const encryptedData = CryptoJS.AES.encrypt(jsonDatas, key).toString();
  console.log("line 18 encrypt>>>>>>>>>> ",encryptedData);
  return encryptedData;
}

app.post('/encryptdata',validateBody(schemas.validateDetails),(req,res)=>{
    const key = "Anup"; 

// res.send({message: req.body})
const decryptDatas = decryptData(req.body.encryptedText,key)

const currentTime = Date.now();
const  modifiedData ={}
modifiedData.decryptDatas=decryptDatas
modifiedData.currentTime=currentTime
const finalEncryptedData =encryptData(modifiedData,key)
res.send({encryptedData: finalEncryptedData})
})

app.get('/profile',profileKeyMangenment)


app.post('/homeinfo',homeinfoKeyMangenment)

app.listen(5000,()=>{
    console.log("app is listening to port 3000");
})