// Importando dependencias
const { Client, MessageAttachment } = require('discord.js');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const libre = require('libreoffice-convert');
const fs = require('fs');
const path = require('path');

// Importando config
const config = require('./config.json');

// Creando instancia de Client
const client = new Client();


client.on('ready', () => {
  console.log('Bot listo :D');
});

client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    if (message.content.startsWith(">caratula")) {
        var array = message.content.split(',');
        array = array.map(e => e.trim());
        array[0] = array[0].substr(10);
        if (array.length >= 4) {
            var nombres = [];
            array.slice(3).map(n => nombres.push({"nombre": n}));
            const datos = {
                tema: array[0],
                area: array[1],
                profe: array[2],
                alumnos: nombres, 
            }
            try {
                fillDocxFile(datos);
                const bufferDocx = fs.readFileSync('./caratula.docx');
                const filename = "caratula_" + Date.now();
                const attachmentDocx = new MessageAttachment(bufferDocx, filename+".docx");
                message.channel.send(`${message.author}, aquí está tu carátula en Word:`, attachmentDocx);
                libre.convert(bufferDocx, ".pdf", undefined, (err, done) => {
                    if (err) {
                      console.log(`Error converting file: ${err}`);
                      throw err;
                    }
                    // done = búfer del archivo PDF
                    const attachmentPdf = new MessageAttachment(done, filename+".pdf");
                    message.channel.send(`${message.author}, aquí está tu carátula en PDF:`, attachmentPdf);
                });                
            } catch (error) {
                message.reply("Oh no :( el comando falló. Información adicional: " + error);
            }
        } else {
            message.reply("Tu comando está incompleto :( necesito 4 argumentos como mínimo\n" +
            ">caratula Tema, Curso, Profesor, [Alumno(s)]");
        }
    } else {
        message.reply("Lo siento :( aún no tengo implementado ese comando");
    }
});

// Iniciando sesión en Discord
client.login(config.token);


function fillDocxFile(docxData) {

    // Convirtiendo objeto de error a algo legible y útil
    function replaceErrors(key, value) {
        if (value instanceof Error) {
            return Object.getOwnPropertyNames(value).reduce(function(error, key) {
                error[key] = value[key];
                return error;
            }, {});
        }
        return value;
    }

    function errorHandler(error) {
        console.log(JSON.stringify({error: error}, replaceErrors));

        if (error.properties && error.properties.errors instanceof Array) {
            const errorMessages = error.properties.errors.map(function (error) {
                return error.properties.explanation;
            }).join("\n");
            console.log('errorMessages', errorMessages);
            // errorMessages contiene una descripción precisa del error
        }
        throw error;
    }

    // Cargando template.docx como búfer binario
    var content = fs.readFileSync(path.resolve(__dirname, 'template.docx'), 'binary');

    var zip = new PizZip(content);
    var doc;
    try {
        doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    } catch(error) {
        // Manejando excepciones de rellenado de plantillas
        errorHandler(error);
    }


    // Datos a rellenar en la plantilla
    const cartTema = docxData.tema ? docxData.tema : "Ninguno";
    const cartArea = docxData.area ? docxData.area : "Ninguno";
    const cartProfe = docxData.profe ? docxData.profe : "Ninguno";
    const cartAlumnos = docxData.alumnos ? docxData.alumnos : [{name: "Ninguno"}];
    doc.setData({
        tema: cartTema,
        area: cartArea,
        profe: cartProfe,
        alumnos: cartAlumnos
    });

    try {
        doc.render();
    }
    catch (error) {
        errorHandler(error);
    }

    const buf = doc.getZip().generate({type: 'nodebuffer'});

    // Escribiendo búfer de .docx a fichero
    fs.writeFileSync(path.resolve(__dirname, 'caratula.docx'), buf);
}
