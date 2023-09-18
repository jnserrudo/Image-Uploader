'use client'
import Image from 'next/image'
import { useState } from 'react'

export default function Home() {
  const [file, setFile] = useState(null)
  const [url, setUrl] = useState("")
  return (
    <div>
      {/* en el formulario tengo un evento para poder enviar el form */}
      <form onSubmit={async (e)=>{
        //hacemos una peticion post,Y COMO ES UNA PETICION, TENDREMOS UNA RESPUESTA 
        e.preventDefault()
        //para enviarlo podria hacerlo por el body en el fetch, pero los body hacen
        //referencia a datos en formato json y este es un archivo
        const formData=new FormData()

        //creamos una propiedad que en este caso le ponemos file por ejemplo y le pasamos el estado que almacena el archivo
        formData.append('file',file)
        const res=await fetch('./api/upload',{
          method:'POST',
          body:formData,
          
          // en el header se aclara que no es un json, sino un formulario
        })
        const data=await res.json()
        console.log(data)
        setUrl(data.url)
      }} >
        <p style={{color:'black !important '}} >pedilo</p>
        <input type='file' onChange={(e)=>setFile(e.target.files[0])} />
        {/* para que ocurra el evento submit, con el onclick de un boton, es suficiente, lo hace
        de manera automatica */}
        <button className='border-black  rounded-md '  >Enviar</button>
         {url.length>0&&<img src={url} />} 
      </form>
    </div>
  )
}
