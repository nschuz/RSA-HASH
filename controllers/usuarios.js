const {response} = require('express');
const NodeRSA = require('node-rsa');
//const key = new NodeRSA({b: 512}); //Generamos la llave
const path = require('path');
var fs = require('fs');
const crypto = require('crypto');

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

const usuariosPost = async (req , res)=> {
  console.log('Prueba');
  let {text, signIt, verify, privateKeyGenerated, publicKeyGenerated, fileName} = req.body;
  console.log(signIt);
  console.log(fileName);

  if(signIt){
    let signText = await cipherHash(text, privateKeyGenerated, "Signature.txt");
    res.json({
      ok: true,
      msg: '/Signature.txt',
      signText: signText
    });
    return;
  } else if(verify){
    let hash = checkText(text, publicKeyGenerated);
    if( hash.digesto === hash.digestoDescifrado){
      res.json({
        ok: true,
        msg: 'El mensaje conserva su integridad y su validez'
      })
      return;
    } else{
      res.json({
        ok: true,
        msg: 'El mensaje fue alterado.'
      })
      return;
    }
  }
  //En caso de que algun parametro sea invalido regresamos error
  res.json({
    ok: true,
    msg: 'Error.'
  })
}


const cipherHash = (text, privateKeyGenerated, fileName) => {
  //Método para cifrar el hash
  //Paso 1. Generar el hash del mensaje
  let shasum = crypto.createHash('sha1');
  shasum.update(text);
  const digesto = shasum.digest('hex'); //Ej. "0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33"
  console.log(digesto);
  //Paso 2.Cifrar el digesto con RSA 1024
  let rsa1024 = new NodeRSA({b: 1024});
  rsa1024.importKey(privateKeyGenerated); //Cargamos la llave privada
  const digestoCifrado = rsa1024.encryptPrivate(digesto, 'base64');
  //Paso 3.Concatenar el hash cifrado en el documento original
  let newText = text + digestoCifrado;
  console.log(publicDir)
  console.log(fileName)
  //console.log(newText)
  fs.writeFile(publicDir + "\\" + fileName , newText, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;
    // success case, the file was saved
    console.log('Archivo salvado correctamente!');
  });
  return newText;
}

const checkText = (text, publicKeyGenerated) =>{
  //Método para verificar
  //Paso 1. Obtener el texto original y el digesto cifrado
  let originalText = text.substring(0, text.length - 344);
  let digestoCifrado = text.substring(text.length - 344);
  console.log(originalText);
  console.log(digestoCifrado);
  console.log(publicKeyGenerated);
  //Paso 2. Generar el digesto del mensaje original
  let shasum = crypto.createHash('sha1');
  shasum.update(originalText);
  const digesto = shasum.digest('hex'); //Ej. "0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33"
  //Paso 3. Descifrar el digesto del mensaje
  let rsa1024 = new NodeRSA({b: 1024});
  rsa1024.importKey(publicKeyGenerated);
  //rsa1024.sign()
  let digestoDescifrado = rsa1024.decryptPublic(digestoCifrado,'utf8');
  //let digestoDescifrado = rsa1024.decrypt(digestoCifrado, 'utf8');
  //Paso 4. Verificar los digestos obtenidos
  return {
    digesto,
    digestoDescifrado
  };
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