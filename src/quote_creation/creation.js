//@ts-check
'use strict';
const { dialog } = require('electron').remote;
const createReport = require("docx-templates").default;
const fs = require("fs");
const path = require("path");

const template = fs.readFileSync(path.join(__dirname, "resources/templates/devis.docx"));

const submitButton = document.querySelector("#quoteForm");
submitButton.addEventListener("submit", async(event) => {
    event.preventDefault();
    console.log(event.target.elements);

    const current_date = new Date();
    const validity_date = new Date();
    validity_date.setMonth(validity_date.getMonth() + 1);
    var buffer = await createReport({
        template,
        data: {
            company_name: "Company",
            company_slogan: "",
            current_city: "",
            current_date: current_date.toLocaleDateString(),
            validity_date: validity_date.toLocaleDateString(),
            quote_number: `DE${current_date.getTime()}`,
            client_fullname: "test",
            test: "test2"
        },
        cmdDelimiter: ['{', '}'],
        failFast: true,
        rejectNullish: true,
        errorHandler: (err, command_code) => {
            console.log(err, command_code);
            return "";
        },
    });

    const quote_path = dialog.showSaveDialogSync({
        title: "Save quote",
        defaultPath: "quote.docx",
        buttonLabel: "Save",
        filters: [{ name: "Word Document", extensions: ["docx"] }]
    });
    if (quote_path !== undefined) {
        fs.writeFileSync(quote_path, buffer, { flag: "w" });
    }

    return false;
});