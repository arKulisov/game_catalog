function renderNode(node, parent) {
    const element = elementCreators[node.type]();
    if (parent) {
        parent.appendChild(element);
    }
    return element;
}
const elementCreators = {
    text: () => document.createElement("p"),
    img: () => document.createElement("img"),
    button: () => document.createElement("button"),
    container: () => document.createElement("div"),
};
const widgets = {
    container: {
        label: "Контейнер",
        icon: "container-icon",
        canHaveChildren: true,
        defaultStyles: { base: { display: "flex", flexDirection: "column" } },
        inspector: {
            text: { type: "textarea", label: "Текст" },
            tag: { type: "select", label: "HTML-тег" },
        },
    },
    text: {
        label: "Текст",
        icon: "text-icon",
        canHaveChildren: false,
        defaultStyles: { base: { display: "block" } },
        inspector: {
            text: { type: "textarea", label: "Текст" },
            tag: { type: "select", label: "HTML-тег" },
        },
    },
    img: {
        label: "Изображение",
        icon: "image-icon",
        canHaveChildren: false,
        defaultStyles: { base: { display: "block" } },
        inspector: {
            src: { type: "text", label: "URL изображения" },
            alt: { type: "text", label: "Альтернативный текст" },
        },
    },
    button: {
        label: "Кнопка",
        icon: "button-icon",
        canHaveChildren: false,
        defaultStyles: { base: { display: "block" } },
        inspector: {
            text: { type: "textarea", label: "Текст" },
            tag: { type: "select", label: "HTML-тег" },
        },
    },
};
const widgetBar = document.querySelector(".sidebar__content");
document.addEventListener("DOMContentLoaded", () => {
    if (!widgetBar)
        return;
    Object.entries(widgets).forEach(([type, widget]) => {
        const widgetElement = document.createElement("div");
        widgetElement.classList.add("widget", "is-active");
        widgetElement.title = widget.label;
        widgetElement.dataset.id = type;
        widgetBar.appendChild(widgetElement);
    });
});
const preview = document.querySelector("#preview");
if (preview instanceof HTMLIFrameElement) {
    preview.srcdoc = `
  <!DOCTYPE html>
  <html>
    <head>
      <link rel="stylesheet" href="../editor-preview.css">
      <style>body { margin: 0; padding: 50px 250px}</style>
    </head>
    <body>
    <div class="editor__placeholder"></div>
    </body>
  </html>
`;
}
preview?.addEventListener("load", () => {
    let doc = null;
    let placeholder = null;
    doc = preview?.contentDocument;
    placeholder = doc?.querySelector(".editor__placeholder") ?? null;
    ;
    if (!placeholder)
        return;
    placeholder.addEventListener("pointerenter", () => {
        console.log("pointerenter сработал");
        placeholder.classList.add("is-over");
    });
    placeholder.addEventListener("pointerleave", () => {
        placeholder.classList.remove("is-over");
    });
});
let draggable = false;
let widgetShadow = null;
let offsetX = 0;
let offsetY = 0;
let currX = 0;
let currY = 0;
let widgetWdth = 0;
let widgetHght = 0;
widgetBar?.addEventListener("pointerdown", (e) => {
    if (!(e.target instanceof HTMLElement))
        return;
    const widget = e.target.closest(".widget");
    if (!widget)
        return;
    if (!(widget instanceof HTMLElement))
        return;
    let clone = widget.cloneNode(true);
    if (!(clone instanceof HTMLElement))
        return;
    widgetShadow = clone;
    widgetShadow.classList.add("widget__shadow", "is-active");
    widget.classList.remove("is-active");
    widget.classList.add("not-active");
    if (!(widgetShadow instanceof HTMLElement))
        return;
    document.body.append(widgetShadow);
    widgetShadow.classList.add("widget__shadow");
    const rect = widget.getBoundingClientRect();
    widgetWdth = rect.width;
    widgetHght = rect.height;
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    coordinateClone(e);
    draggable = true;
});
document.addEventListener("pointermove", (e) => {
    if (!draggable)
        return;
    if (!(widgetShadow instanceof HTMLElement))
        return;
    coordinateClone(e);
});
function coordinateClone(e) {
    if (!(widgetShadow instanceof HTMLElement))
        return;
    currX = e.clientX - offsetX;
    currY = e.clientY - offsetY;
    widgetShadow.style.left = currX + "px";
    widgetShadow.style.top = currY + "px";
    widgetShadow.style.width = widgetWdth + "px";
    widgetShadow.style.height = widgetHght + "px";
}
document.addEventListener("pointerup", (e) => {
    draggable = false;
});
export {};
//# sourceMappingURL=script.js.map