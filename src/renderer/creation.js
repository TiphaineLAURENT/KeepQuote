'use strict';

const { dialog } = require('electron').remote;
const { createReport } = require("docx-templates");
const fs = require("fs");
const XLSX = require("xlsx");

function readFileAsync(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsArrayBuffer(file);
    });
}

const form = document.querySelector("#quoteForm");
form.addEventListener("submit", async(event) => {
    event.preventDefault();
    if (template === null) {
        return false;
    }

    const form_data = event.target.elements;

    const data = {};
    for (const input of form_data) {
        if (input.value === "") {
            continue;
        }

        if (input.type === "text") {
            data[input.name] = input.value;
        } else if (input.type === "file") {
            const array = await readFileAsync(input.files[0]);
            const workbook = XLSX.read(array, { type: "array" });
            const [first_sheet] = Object.values(workbook.Sheets);
            data[input.name] = XLSX.utils.sheet_to_json(first_sheet);
        }
    }

    const buffer = await createReport({
        template,
        data: data,
        cmdDelimiter: ['{', '}'],
        failFast: true,
        rejectNullish: true,
        errorHandler: (err, command_code) => {
            console.error(err.name, command_code);
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