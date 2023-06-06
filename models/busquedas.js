import fs from 'fs'
import axios from 'axios'

class Busquedas {

    historial = ['Tegucigalpa', 'Madrid', 'Bogota'];
    dbPath = './db/database.json'

    constructor() {
        //TODO: leer DB si existe 
        this.leerDb
    }

    get historialCapitalizado(){
        return this.historial.map(lugar => {
          let palabras = lugar.split(' ');
          palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );

          return palabras.join(' ')
          
        })
    }

    get params() {
        return {
            'key': process.env.API_KEY,
            'limit': 5

        }
    }

    get paramsWeather() {
        return {

            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    async ciudad(lugar = '') {

        try {//Es recomendame con las peticiones http meterlas en un try catch por si algo falla lo tenemos controlado
            console.log('\nCiudad: ', lugar);

            const instancia = axios.create({
                baseURL: `https://us1.locationiq.com/v1/search?&q=${lugar}&format=json`,
                params: this.params
            })
            //const resp = await axios.get('https://us1.locationiq.com/v1/search?key=pk.13d75cd7ac6abbd7a03d62bb28fd66ef&q=santiago&format=json');
            const resp = await instancia.get();
            return resp.data.map(resultados => ({ //El map debe usarse con un return para asegurar que el objeto se devuelva en cada iteracion
                //Tambén es importante ponerlo dentro de parentesis para que efectivamente sea un objeto
                id: resultados.place_id,
                nombre: resultados.display_name,
                latitud: resultados.lat,
                longitud: resultados.lon,


            })
            )
            console.log('nombresss', nombres)

        } catch (error) {
            return [];

        }
        //peticion http



    }

    async climaLugar(lat, lon) {

        try {
            //crear instancia de axios 
            const instancia = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?`,
                params: {...this.paramsWeather,lat,lon}
            })

            //con la respuesta debemos extraer la informacion de la data
            const resp = await instancia.get();
            //console.log(resp);
            //retornar un objeto con la informacion necesaria
            const {weather, main} = resp.data;
            return {
                desc: weather[0].description,
                min:main.temp_min,
                max:main.temp_max,
                temp:main.temp            }

        } catch (error) {
            console.log(error)
        }
    }

    agregarHistorial(lugar = ''){
        //TODO: prevenir duplicidad de datos
        if(this.historial.includes(lugar.toLowerCase())){
            return;
        }
        this.historial.unshift(lugar.toLocaleLowerCase())

        

        //Grabar en DB

        this.guardarDB();
    }

    guardarDB(){

        const payload = { //Esto se hace por si se necesitaran mas propiedades que grabar, en este caso no, pero podria pasar cierto

            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload))

    }

    leerDb(){
        if(!fs.existsSync(this.dbPath)) return;
        const info = fs.readFileSync(this.dbPath ,{encoding:'utf-8'});
        const data = JSON.parse(info);

        this.historial = data.historial;
    }


}




export { Busquedas }