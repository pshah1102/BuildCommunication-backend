const fs = require("fs");

const PDFDocument = require("./pdfkit-tables");

// Load the patients
// const patients = require("./patients.json");

// Create The PDF document
const doc = new PDFDocument();

// Pipe the PDF into a patient's file
const GeneratePDF = (userData) => {
  doc.pipe(fs.createWriteStream(userData._id + ".pdf"));

  // Add the header - https://pspdfkit.com/blog/2019/generate-invoices-pdfkit-node/
  doc
    .image("./logo512.png", 65, 20, { width: 100 })
    .font("Helvetica")
    .fontSize(20)
    .text("Build Communication", 30, 100)
    .fontSize(10)
    .text("Name: " + userData.name, 200, 85, { align: "right" })
    .text("email: " + userData.email, 200, 100, { align: "right" })
    .moveDown();

  doc
    .fillColor("#fc0320")
    .font("Helvetica")
    .fontSize(20)
    .text("Student Report", 225, 150)
    .fillColor("#11111");

  // Create the table - https://www.andronio.me/2017/09/02/pdfkit-tables/
  const table = {
    headers: [
      "Module Name",
      "Previous Score",
      "Current Score",
      "Improvement",
      "Last Attempted",
    ],
    rows: [],
  };

  // Add the patients to the table
  //   for (const patient of patients) {
  //     table.rows.push([]);
  //   }
  if (userData.module1) {
    table.rows.push([
      "Module 1",
      userData.module1.previous,
      userData.module1.score,
      userData.module1.previous < userData.module1.score ? "Yes" : "No",
      userData.module1.date,
    ]);
  }
  if (userData.module2) {
    table.rows.push([
      "Module 2",
      userData.module2.previous,
      userData.module2.score,
      userData.module2.previous < userData.module2.score ? "Yes" : "No",
      userData.module2.date,
    ]);
  }
  if (userData.module3) {
    table.rows.push([
      "Module 3",
      userData.module3.previous,
      userData.module3.score,
      userData.module3.previous < userData.module3.score ? "Yes" : "No",
      userData.module3.date,
    ]);
  }
  if (userData.module4) {
    table.rows.push([
      "Module 4",
      userData.module4.previous,
      userData.module4.score,
      userData.module4.previous < userData.module4.score ? "Yes" : "No",
      userData.module4.date,
    ]);
  }

  // Draw the table
  doc.moveDown().table(table, 30, 200, { width: 550 });

  // Finalize the PDF and end the stream
  doc.end();
};
module.exports = GeneratePDF;
