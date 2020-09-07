const fs = require("fs");

document.addEventListener("readystatechange", async(event) => {
    const templatePath = localStorage.getItem("templatePath");
    if (templatePath === null) {
        return;
    }

    const buffer = fs.readFileSync(templatePath);
    template = buffer;
    await populateFromTemplateBuffer(buffer);

    templateFilename.textContent = templatePath;
});