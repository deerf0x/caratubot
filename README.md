# 📔🤖 CaratuBot
Bot de Discord que genera carátulas en .docx y .pdf basándose en plantillas de Microsoft Word. Posible gracias a Node.js, Discord.js, docxtemplater, pizzip y libreoffice-converter.

## ❓ Uso
El principal comando de este bot es el siguiente:
**>caratula Tema Curso Profesor [Alumno(s)]**
Se requiere un mínimo de 4 argumentos (Tema, Curso, Profesor y un alumno) para proceder a la generación de los archivos .docx y .pdf

## 🛠 Dependencias adicionales
Para la funcionalidad de PDF es necesario tener instalado LibreOffice en el equipo que actuará como servidor.

## ⚙️ Cómo correr su propia instancia
1) Crear un bot y obtener el token en el [Portal de Desarrolladores de Discord](https://discord.com/developers/applications).
2) Clonar este repositorio:
`git clone https://github.com/ncr6/caratubot && cd caratubot`
2) Colocar el token dado por Discord en el atributo 'token' del objeto descrito en **config.json** (línea 3).
3) Instalar dependencias con `npm install --save`
4) Modificar plantilla `template.docx` a su gusto, siempre y cuando se mantenga la estructura de los **{placeholders}**
5) Iniciar el bot con `node bot.js` y disfrutar :D

## ⏳ Próximamente...
- Conversión a PDF sin dependencia de LibreOffice.
- Dockerfile para despliegue en contenedores.
- Correcciones de bugs 🐞
