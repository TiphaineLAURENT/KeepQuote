//@ts-check
'use strict';

const createReport = require("docx-templates").default;
const fs = require("fs");
const path = require("path");

const template = fs.readFileSync(path.join(__dirname, "resources/templates/devis.docx"));
const submitButton = document.querySelector("#submitQuote");
submitButton.addEventListener("submit", async(event) => {
    console.log("submit");
    event.preventDefault();
    console.log(event.target.elements);

    const current_date = new Date();
    const validity_date = new Date();
    validity_date.setMonth(validity_date.getMonth() + 1);
    const buffer = await createReport({
        template,
        data: {
            company_name: "Company",
            company_slogan: "",
            current_city: "",
            current_date: current_date.toLocaleDateString(),
            validity_date: validity_date.toLocaleDateString(),
            quote_number: `DE${current_date.getTime()}`
        },
        cmdDelimiter: ['{', '}'],
        failFast: true,
        rejectNullish: true,
        errorHandler: (err, command_code) => {
            console.log(err, command_code);
            return "";
        },
    });
    fs.writeFileSync(path.join(__dirname, "quote.docx"), buffer);
});