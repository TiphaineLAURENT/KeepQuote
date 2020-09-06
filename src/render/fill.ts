//@ts-check
'use strict';

String.prototype.title = function () {
    return this.replaceAll("_", " ").replace(/\b\w+/g, function (s) {
        return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
    });
};

const { listCommands } = require("docx-templates");
const { ipcRenderer } = require("electron");
const i18n = require("./configs/i18next.config");

const fields = document.querySelector("#fields");

function updateFileLabel(input) {
    const label = input.parentNode.querySelector(".file-name");
    label.textContent = input.value;
}

let template = null;
const templateInput = document.querySelector("input[name='template']");
templateInput.addEventListener("change", async (event) => {
    if (templateInput.files.length === 0) {
        return false;
    }
    template = await templateInput.files[0].arrayBuffer();
    const commands = await listCommands(template, ['{', '}']);

    fields.textContent = "";
    let forloop = false;
    for (const command of commands) {
        if (forloop === true) {
            if (command.type === "END-FOR") {
                forloop = false;
            }
            continue;
        }

        const node = document.createElement("div");
        node.classList.add("field");

        const label = document.createElement("label");
        label.classList.add("label");
        const name = command.code.split(" ").pop();
        label.textContent = name.title();
        node.append(label);

        const control = document.createElement("div");
        control.classList.add("control");
        node.append(control);

        if (command.type === "INS") {
            const input = document.createElement("input")
            input.classList.add("button");
            input.type = "text";
            input.name = name;
            switch (name) {
                case "current_date":
                    const current_date = new Date();
                    input.value = current_date.toLocaleDateString();
                    break;
                case "validity_date":
                    const validity_date = new Date();
                    validity_date.setMonth(validity_date.getMonth() + 1);
                    input.value = validity_date.toLocaleDateString();
                    break;
                case "quote_number":
                    input.value = `DE${Date.now()}`;
            }
            control.append(input);
        } else if (command.type === "FOR") {
            const div = document.createElement("div")
            div.classList.add("file", "is-fullwidth", "is-info", "has-name"); // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
            div.innerHTML = `<label class="file-label">
                                <input class="file-input" type="file" name="${name}" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onchange="updateFileLabel(this);">
                                <span class="file-cta">
                                    <span class="file-icon">
                                        <i class="fas fa-upload"></i>
                                    </span>
                                    <span class="file-label">
                                        ${i18n.t("Excel")}
                                    </span>
                                </span>
                                <span class="file-name">
                                </span>
                            </label>`;
            control.append(div);
            forloop = true;
        }


        fields.append(node);
    }
});

const clearButton = document.querySelector("#clear");
clearButton.addEventListener("click", async (event) => {
    fields.textContent = "";
    templateInput.value = "";
});

const templateLabel = document.querySelector("#templateLabel");
const submitButton = document.querySelector("button[type='submit']");
ipcRenderer.on("language-changed", (event, data) => {
    if (!i18n.hasResourceBundle(data.language, data.namespace)) {
        i18n.addResourceBundle(data.language, data.namespace, data.resource);
    }
    i18n.changeLanguage(data.language);
    templateLabel.textContent = i18n.t("Template");
    const itemsCta = document.querySelectorAll("input[type='file']:not([name='template']) ~ span.file-cta");
    itemsCta.forEach(cta => {
        const label = cta.querySelector(".file-label");
        label.textContent = i18n.t("Items");
    });
    submitButton.textContent = i18n.t("Submit");
    clearButton.textContent = i18n.t("Clear");
});
