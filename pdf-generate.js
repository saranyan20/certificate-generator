const fs = require("fs");
const { promisify } = require("util");
const { degrees, PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
//const align=require('center-align');

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

const sizePicker = (len) => {
  if (len >= 45) return 10;
  else if (len >= 35) return 11;
  return 15;
};

async function processFile(existingPdfBytes, name, college, id) {
  var dir = "./generated certificates";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const fontBytes = fs.readFileSync("./res/Oswald.ttf");
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);

  const oswaldfont = await pdfDoc.embedFont(fontBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const { width, height } = firstPage.getSize();
  console.log("generating........");
  firstPage.drawText(name, {
    x: 435,
    y: height / 2 + 38,
    size: 15,
    font: helveticaFont,
    color: rgb(0.22, 0.2, 0.2),
    rotate: degrees(0),
  });

  firstPage.drawText(college, {
    x: 390,
    y: height / 2 + 5,
    size: sizePicker(college.length),
    font: helveticaFont,
    color: rgb(0.22, 0.2, 0.2),
    rotate: degrees(0),
  });

  firstPage.drawText(id, {
    x: 38,
    y: 25,
    size: 13,
    font: oswaldfont,
    color: rgb(0.0, 0.42, 0.7),
    rotate: degrees(0),
  });

  const pdfBytes = await pdfDoc.save();

  // const write=async()=>{
  //   await writeFileAsync(`./generated certificates/${name}.pdf`,pdfBytes);
  // }
  await writeFileAsync(`./generated certificates/${name.trim()}.pdf`, pdfBytes);
}

async function generate(name, college, id) {
  let existingPdfBytes = await readFileAsync("./res/certificate.pdf");
  await processFile(existingPdfBytes, name, college, id);
}
// readFileAsync(`./generated certificates/nanda.pdf`,async (err,data)=>{
//   if (err)
//     throw err;
//   else
//   {
//     console.log(data);
//   }
// });
// generate(align("ADITYA KUMAR SINGH PUNDIR",25),
// "ARYA COLLEGE OF ENGINEERING AND I. T.",
// "41SIT24FD002");
module.exports = generate;
