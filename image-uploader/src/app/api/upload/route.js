import { NextResponse } from "next/server"
import fs from "node:fs/promises"

import path, { resolve } from "node:path"

//procedemos a instalar cloudinary npm install cloudinary
//luego lo importamos y luego lo configuramos
import {v2 as cloudinary} from 'cloudinary';
          
require('dotenv').config();

console.log(process.env.APIKEY,process.env.APISECRET)
cloudinary.config({ 
  cloud_name: 'dhqok7v4a', 
  api_key:process.env.APIKEY.toString(), 
  api_secret: process.env.APISECRET.toString() 
});

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
    
    //AHORA SE USARA OTRO METODO, DIRECTAMENTE SE LO SUBE AL BUFFER, YA NO SE LO CREA PARA TOMAR SU DIRECCION DEL ARCHIVO Y LUEGO SUBIRLO

    const res=await new Promise((resolve,reject)=>{
    
      cloudinary.uploader.upload_stream({
//objeto de configuracion, no se uso
      },(err,result)=>{
        !err?resolve(result):reject(err)
      }).end(buffer)
  
    })
    
    console.log(data.get('file'))
    return NextResponse.json({
      message:"imagen subida",
      url:res.secure_url
    })

}