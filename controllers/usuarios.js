const {response} = require('express');
const NodeRSA = require('node-rsa');
//const key = new NodeRSA({b: 512}); //Generamos la llave
const path = require('path');
var fs = require('fs');

let publicDir = path.join(__dirname, '../public/')
const usuariosGet = (req , res)=>{
  //express parasea los parmas
  const {q ,nombre='No name' , key}= req.query;
  res.sendFile( path.join(__dirname, '../public/prax/prax.html'));
}
const usuariosPut = (req , res)=>{
  //el id es  el nnombre que dimos  en las rutas :id
  const id =req.params.id;
  res.json({
    ok: true,
    msg: 'Put API-Controlador',
    id
  })
}
let getIP = (req) => {
  let ip = req.connection.remoteAddress;
  ip = ip.replace(/:|[a-z]|[A-Z]/g,"");
  return ip;
}
let makeDir = (dir) => {
  if (!fs.existsSync(dir)){ //If it does not exist, we create it
    fs.mkdirSync(dir);
  }
}


const usuariosPost = (req , res)=> {
  let {encrypt, decrypt, generate, privateKeyGenerated, publicKeyGenerated, fileName} = req.body;
  if(generate){
    //We obtain the IP of the request
    //let ip = getIP(req);
    //We check if you have any folder created with your IP address
    //let personalFolder = publicDir + "keys\\"+ ip;
    //makeDir(personalFolder); //Create the directory with its respective ip
    //We generate the keypairs
    console.log("Generating keys");
    let key = new NodeRSA().generateKeyPair();
    let publicKey = key.exportKey("public");
    let privateKey = key.exportKey("private");

    console.log(publicKey);
    //console.log(publicKey);

    let publicKeyFile = publicDir + '\\publicKey.txt';
    let privateKeyFile = publicDir + '\\privateKey.txt';

    //Guardamos las llaves en archivos
    fs.writeFile(publicKeyFile, publicKey, function (err) {
      if (err) throw err;
      console.log('Public key saved!');

    });
    fs.writeFile(privateKeyFile, privateKey, function (err) {
      if (err) throw err;
      console.log('Private key saved!');
    });

    let publicKeyURL = req.protocol + "://" + req.headers.host + "/publicKey.txt";
    let privateKeyURL = req.protocol + "://" + req.headers.host + "/privateKey.txt";
    res.download(__dirname,publicKeyURL);

    res.json({
      ok: true,
      msg: 'Post API-Controlador',
      publicKeyURL,
      privateKeyURL,
      publicKey,
      privateKey
    })
  }

  if(encrypt && publicKeyGenerated) { //Si nos mandan el mensaje de cifrar
    console.log("Cifrando...");

    let punto = fileName.lastIndexOf(".");
    let extension = fileName.substring(punto);
    let name = fileName.substring(0, punto);
    //let publicKey = new NodeRSA();
    let publicKey = new NodeRSA();
    //let public = document.getElementById("PublicKey").value;
    //let private = document.getElementById("PrivateKey").value;
    //publicKey.importKey(public);
    publicKey.importKey(publicKeyGenerated);

    const encrypted = publicKey.encrypt(encrypt, 'base64');

    if(!name){
      name = "text";
      extension = ".txt";
    }

    let publicKeyFile = publicDir + name + "_C" + extension;

    //Guardamos las llaves en archivos
    fs.writeFile(publicKeyFile, encrypted, function (err) {
      if (err) throw err;
      console.log('File _c saved!');
    });
    let pathCrypted = req.protocol + "://" + req.headers.host + "/" + name + "_C"+ extension;


    res.json({
      ok: true,
      msg: 'Post API-Controlador',
      newTextCipher: encrypted,
      pathCrypted
    })
  }
  if(decrypt && privateKeyGenerated) { //Si nos mandan el mensaje de Decifrar
    //let publicKey = document.getElementById("PublicKeyEnter").value;
    //let privateKey = document.getElementById("PrivateKey").value;
    let privateKey = new NodeRSA();
    privateKey.importKey(privateKeyGenerated);

    //messahee_C.txt
    console.log(fileName)
    let punto = fileName.lastIndexOf(".");
    let extension = fileName.substring(punto);
    let name = fileName.substring(0, punto-2);

    console.log("nombre:"+ name);

    if(!name){
      name = "text";
      extension = ".txt";
    }

    let decrypted = privateKey.decrypt(decrypt, 'utf8');

    let publicKeyFile = publicDir + name + "_D" + extension;

    //Guardamos las llaves en archivos
    fs.writeFile(publicKeyFile, decrypted, function (err) {
      if (err) throw err;
      console.log('File _d saved!');
    });
    let pathDecrypted = req.protocol + "://" + req.headers.host + "/" + name + "_D"+ extension;

    res.json({
      ok: true,
      msg: 'Post API-Controlador',
      newText: decrypted,
      pathDecrypted
    })
  }
}

const usuariosDelete = (req , res)=>{
  res.json({
    ok: true,
    msg: 'Delete API-Controlador'
  })
}

module.exports={
  usuariosGet,
  usuariosPut,
  usuariosDelete,
  usuariosPost
}