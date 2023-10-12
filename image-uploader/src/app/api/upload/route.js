import { NextResponse } from "next/server"
import fs from "node:fs/promises"

import path, { resolve } from "node:path"

//procedemos a instalar cloudinary npm install cloudinary
//luego lo importamos y luego lo configuramos
import {v2 as cloudinary} from 'cloudinary';
          
//require('dotenv').config();

console.log(process.env.APIKEY,process.env.APISECRET)
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key:process.env.APIKEY,
  api_secret: process.env.APISECRET 
});


/*
PODEMOS CREAR RUTAS QUE PROCESEN CODIGO DE BACKEND, PARA ESTO ES BASTANTE COMUN TENER UNA CARPETA LLAMADA API, DENTRO DE LA CUAL
TENEMOS UNA CARPETA PARA CADA RUTA, EN ESTE CASO UNA LLAMADA UPLOAD, PARA CADA UNA RUTA, SE CREA UN ARCHIVO route.js, ESTOS
HACEN REFERENCIA A RUTAS DE BACKEND
*/

export const POST= async(request)=>{
    //SE RECIBIRA UNA FORMULARIO
    //ESTE NEXT RESPONSE ES PARA PODER RETORNAR UNA RESPUESTA
    const data= await request.formData()
    //este data seria el formulario

    const file=data.get('file')
    if(!file){
        return NextResponse.json({message:"imagen subida"}).status(400)

    }

    //este metodo arraybuffer es para convertirlo a bytes
    const bytes=await file.arrayBuffer()
    const buffer=Buffer.from(bytes)
    //un buffer es un espacio en memoria donde estara el archivo

    //con esto tambien podemos tambien crear un archivo con los datos que tenemos en el buffer y guardarlo

    //guardar un archivo

    const direccionArchivo=path.join(process.cwd(),'public',file.name)
    console.log(direccionArchivo)
    //COMO VERCEL(DONDE SE PUEDE DEPLOYAR), NO PERMITE GUARDAR LOS ARCHIVOS CREADOS DE LA APP(lo que tiene sentido porque
    //sino como que tendria que hacer build a cada rato o en el momento que se creen archivos para tenerlos actualizados creo yo)
    //ENTONCES LO QUE SE HARA ES NO USAR const res= await cloudinary.uploader.upload(direccionArchivo), AHORA SE SUBIRA EL BUFFER

   // await fs.writeFile(direccionArchivo,buffer)
    //el writline espera la direccion y el archivo
    //writefile espera una direccion absoluta, por lo que esto lo obtenemos gracias a la dependencia
    // path, puesto que la direccion puede variar con los sistemas operativos


    //esto lo que hace es tomar el archivo(imagen) de la direccion que le pasamos, esta direccion ya estara 
    //creada al usar el writeline y lo sube a cloudinary
    //const res= await cloudinary.uploader.upload(direccionArchivo)
    //console.log(res)
    //ES DECIR SUBE UN ARCHIVO QUE SE TENGA YA GUARDADO, EN ESTE CASO SUBE UN ARCHIVO QUE ACABAMOS DE CREAR CON EL WRITELINE 
    


    //AHORA SE USARA OTRO METODO, DIRECTAMENTE SE SUBE AL BUFFER QUE ESTA EN MEMORIA, YA NO SE LO CREA PARA TOMAR SU DIRECCION DEL ARCHIVO Y LUEGO SUBIRLO

    const res=await new Promise((resolve,reject)=>{
    
      //ESTE UPLOAD STREAM ES PARA ENVIARLE DATOS DE A POCO EN FORMATO CRUDO Y LO SIGUIENTE ES QUE SE PUEDE AGREGAR UN TIPO O OBJETO DE CONFIGURACION 
      cloudinary.uploader.upload_stream({
//objeto de configuracion, no se uso
      },(err,result)=>{
        !err?resolve(result):reject(err)
      }).end(buffer)
      //LA IMAGEN SE SUBE AL FINAL, PARA ESTO SE TIENE QUE ESPERAR A QUE TODO ESTO TERMINE 
  
    })
    //GRACIAS A LO QUE SE REALIZA EN LA PROMESA PODEMOS OBTENER UNA RESPUESTA DE LA SUBIDA A CLOUDINARY SIN CREAR O ALMACENAR UN ARCHIVO

    console.log(data.get('file'))
    return NextResponse.json({
      message:"imagen subida",
      url:res.secure_url
    })

}