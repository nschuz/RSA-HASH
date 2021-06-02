let url = window.location.href;

let signIt = async () =>{
  let originalText = document.getElementById("textEncrypt").value;
  let privateKey = document.getElementById("insertPrivate").value;
  let fileName = document.getElementById("file").value;
  if(originalText === "") return alert("Write a message");
  if(privateKey === "") return alert("Write a public key");
  let requestJSON = {
    "text": originalText,
    "privateKeyGenerated": privateKey,
    "fileName": fileName,
    "signIt": true
  }
  //JSON.stringify(requestJSON);
  await postData(url, requestJSON)
  //await makeRequest(requestJSON, "textCrypted");
}

let verifyDocument = async ()=>{
  let originalText = document.getElementById("textDecryp").value;
  let publicKey = document.getElementById("privateKeyEnter").value;
  //let fileName = document.getElementById("file").value;
  if(originalText === "") return alert("Write a message");
  if(publicKey === "") return alert("Write a public key");
  let requestJSON = {
    "text": originalText,
    "publicKeyGenerated": publicKey,
    "verify": true
  }
  await postData2(url, requestJSON)
}


async function postData2(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      //'Content-Type':'application/x-www-form-urlencoded',
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "http://localhost:${8080}/tarea1",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  var json = await response.json();
  console.log(json.signText);
  document.getElementById("textDecrypted").value = json.msg;
  //document.getElementById("downloadDecryptedFile").href = json.msg;
  return response.json(); // parses JSON response into native JavaScript objects
}




async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      //'Content-Type':'application/x-www-form-urlencoded',
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "http://localhost:${8080}/tarea1",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  var json = await response.json();
  console.log(json.signText);
  document.getElementById("textCrypted").value = json.signText;
  document.getElementById("downloadEncryptedFile").href = json.msg;

  return response.json(); // parses JSON response into native JavaScript objects
}





let encrypt = async () => {
  let originalText = document.getElementById("textEncrypt").value;
  let publicKey = document.getElementById("PublicKeyEnter").value;
  let fileName = document.getElementById("file").value;
  let indexPath = fileName.lastIndexOf("\\");
  fileName = fileName.substring(indexPath+1);
  if(originalText === "") return alert("Write a message");
  if(publicKey === "") return alert("Write a public key");
  let textAreaToUpdate = "textCrypted";
  originalText = {
    "encrypt": originalText,
    "publicKeyGenerated": publicKey,
    fileName
  }
  originalText = JSON.stringify(originalText);
  await makeRequest(originalText, textAreaToUpdate);
}

let generate = async () => {
  let textAreaToUpdate = "PublicKey";
  let json = {
    "generate": true
  }
  json = JSON.stringify(json);
  await makeRequest(json, textAreaToUpdate);
}

let decrypt = async () =>{
  let originalText = document.getElementById("textDecryp").value;
  let privateKey = document.getElementById("privateKeyEnter").value;
  let fileName = document.getElementById("fileDecrypt").value;
  let indexPath = fileName.lastIndexOf("\\");
  fileName = fileName.substring(indexPath+1);
  let textAreaToUpdate = "textDecrypted";
  if(originalText === "") return alert("Write a message");
  if(privateKey === "") return alert("Write a private key");
  originalText = {
    "decrypt": originalText,
    "privateKeyGenerated": privateKey,
    fileName
  }
  originalText = JSON.stringify(originalText);
  await makeRequest(originalText, textAreaToUpdate);
}

let makeRequest = async (json, textAreaToUpdate) => {
  
  const response = await fetch(url, {
   
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
   /*  headers: {
      'Content-Type': 'application/json'
    }, */
    headers: {
           'Content-Type': 'application/json',
            //'Content-Type':'application/x-www-form-urlencoded',
             "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "http://localhost:${8080}/tarea1",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
  
  },
    body: json // body data type must match "Content-Type" header
  }).then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error('Something went wrong on api server!');
    }
  })
    .then(response => {
      console.log(response.msg);
      document.getElementById(textAreaToUpdate).value = response.signText;
      document.getElementById("downloadEncryptedFile").href = response.msg;
    }).catch(error => {
      console.log(error);
    });
}





















//
function leerArchivo(e) {
  var archivo = e.target.files[0];
  if (!archivo) {
    return;
  }
  var lector = new FileReader();
  lector.onload = function(e) {
    var contenido = e.target.result;
    mostrarContenido(contenido);
    
  };
  lector.readAsText(archivo, 'ISO-8859-1');
}

function leerArchivo2(e) {
  var archivo = e.target.files[0];
  if (!archivo) {
    return;
  }
  var lector = new FileReader();
  lector.onload = function(e) {
    var contenido = e.target.result;
    mostrarContenido2(contenido);
  };
  lector.readAsText(archivo, 'ISO-8859-1');
}

function leerArchivo3(e) {
  var archivo = e.target.files[0];
  if (!archivo) {
    return;
  }
  var lector = new FileReader();
  lector.onload = function(e) {
    var contenido = e.target.result;
    mostrarContenido3(contenido);
  };
  lector.readAsText(archivo, 'ISO-8859-1');
}

function leerArchivo4(e) {
  var archivo = e.target.files[0];
  if (!archivo) {
    return;
  }
  var lector = new FileReader();
  lector.onload = function(e) {
    var contenido = e.target.result;
    mostrarContenido4(contenido);
  };
  lector.readAsText(archivo, 'ISO-8859-1');
}





function mostrarContenido(contenido) {
  var elemento = document.getElementById('textEncrypt');
  elemento.innerHTML = contenido;
}
function mostrarContenido2(contenido) {
  var elemento = document.getElementById('textDecryp');
  elemento.innerHTML = contenido;
}

function mostrarContenido3(contenido) {
  var elemento = document.getElementById('insertPrivate');
  elemento.innerHTML = contenido;
}

function mostrarContenido4(contenido) {
  var elemento = document.getElementById('privateKeyEnter');
  elemento.innerHTML = contenido;
}




document.getElementById('file')
  .addEventListener('change', leerArchivo, false);
  document.getElementById('fileDecrypt')
  .addEventListener('change', leerArchivo2, false);
document.getElementById('file3')
  .addEventListener('change', leerArchivo3, false);
document.getElementById('file4')
  .addEventListener('change', leerArchivo4, false);