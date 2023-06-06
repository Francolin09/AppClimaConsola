import inquirer from 'inquirer'; //La versión mas nueva de inquirer pide que se importe así
import colors from'colors'; //además hay que cambiar el type en el package.json 

const preguntas = [ 
    {
        type: 'list',
        name: 'opcion',
        message:'¿Que deseas hacer?',
        choices: [
            {
                value:1,
                name:`${'1'.green } Buscar ciudad`

            },
            {
                value:2,
                name:`${'2'.green } Historial`

            },
            {
                value:0,
                name:`${'0'.green } Salir`

            }
        ]
    }
]

const inquirerMenu = async () => {
    // console.clear();
    console.log('=========================='.green);
    console.log("  Seleccione una opción".white)
    console.log('==========================\n'.green);

    const {opcion} = await inquirer.prompt(preguntas);

    return opcion;


}

const pausa = async ()=> {

    const question = [
        {
            type:'input',
            name:'enter',
            message:`Presione ${'ENTER'.green} para continuar`
        }
    ]
    console.log('\n')
    await inquirer.prompt(question)
}

const leerInput = async (mensaje) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message: mensaje,
            validate(value){
                if(value.length === 0){
                    return 'Ingresa algún valor'
                }
                return true; 
            }
        }
    ]

    const {desc} = await inquirer.prompt(question);
    return desc;
}

const listadoLugares = async(lugares = []) => { //aca debemos pasarle un arreglo


    const choices = lugares.map((lugar,i) => {//aca mapea ese arreglo y devolvemos un objeto con los valores value y name 
        const indice = `${i+1}`.green
        return {
            
        value: lugar.id,
        name: `${indice} ${lugar.nombre}`
       }
    });
    console.log('choiqueeees',choices)
    

    choices.unshift({
        value:'0',
        name:'o.'.green +' Cancelar'
    })
    const preguntas = [
        {
            type:'list',
            name:'id',
            message:'Seleccione lugar',
            choices
        }
    ]

    const {id} = await inquirer.prompt(preguntas);
    return id;
    

}

const confirmar  = async (mensaje) => {
    const pregunta = [
        {
            type:'confirm',
            name:'ok',
            message: mensaje
        }
    ];

    const {ok} = await inquirer.prompt(pregunta)
    return ok;
}


const mostrarListadoCheckList = async(tareas = []) => {


    const choices = tareas.map((tarea,i) => {
        const indice = `${i+1}`.green
        return {
            
        value: tarea.id,
        name: `${indice} ${tarea.desc}`,
        checked: (tarea.completadoEn) ? true : false
       }
    });

    
    const pregunta = [
        {
            type:'checkbox',
            name:'ids',
            message:'Selecciones',
            choices
        }
    ]

    const {ids} = await inquirer.prompt(pregunta);
    return ids;
    

}




export {
    inquirerMenu,
    pausa,
    leerInput,
    listadoLugares,
    confirmar,
    mostrarListadoCheckList
}