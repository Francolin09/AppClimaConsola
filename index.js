import 'dotenv/config'
import { inquirerMenu, leerInput, pausa, listadoLugares } from './helpers/inquirer.js'
import { Busquedas } from './models/busquedas.js';
const main = async () => {
    const busquedas = new Busquedas
    let opt;

    do {
        opt = await inquirerMenu()//ya que en el archivo inquirer es esta funcion la que devuelve la opción y el await es porque queremos que espere a que se termine de ejecutar para seguir con lo demas

        switch (opt) {
            case 1:
                //Mostrar mensaje
                const lugar = await leerInput('Ciudad: ');

                const lugares = await busquedas.ciudad(lugar);//Esto me devuelve un arreglo de objetos 

                const id = await listadoLugares(lugares)

                if (id === '0') continue;


                console.log({ id })

                const lugarSeleccionado = lugares.find(l => l.id === id)
                console.log(lugarSeleccionado)

                //guardar en db
                busquedas.agregarHistorial(lugarSeleccionado.nombre)

                const clima = await busquedas.climaLugar(lugarSeleccionado.latitud, lugarSeleccionado.longitud);
                console.log(clima);


                console.clear() //si se quiere ver todos los resultados anteriores borrar este clear no mas y listo


                console.log('\nInformacion de la ciudad \n'.green);
                console.log('Ciudad: ', lugarSeleccionado.nombre.green);
                console.log('Lat: ', lugarSeleccionado.latitud);
                console.log('Lon: ', lugarSeleccionado.longitud);
                console.log('Temperatura: ', clima.temp);
                console.log('Minima: ', clima.min);
                console.log('Máxima: ', clima.max);
                console.log('Descripcion: ', clima.desc.green)

                break;

            case 2:

                busquedas.historial.forEach((lugar, i) => {
                    const idx = `${i + 1}`.green;
                    console.log(`${idx} ${lugar}`)
                })


                break;
        }

        if (opt !== 0) await pausa();


    } while (opt !== 0);
}
main()