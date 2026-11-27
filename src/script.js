const defaultStyles = {
    container: {
        base: {
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            width: "100%",
            minHeight: "300px",
            padding: "16px",
            boxSizing: "border-box",
            border: "1px dashed #c0c0c0",
            borderRadius: "8px",
            background: "#fafafa",
        },
    },
    text: {
        base: {
            display: "block",
            margin: "0",
            padding: "8px",
            minHeight: "24px",
            boxSizing: "border-box",
            fontFamily: "sans-serif",
            fontSize: "16px",
            lineHeight: "1.4",
        },
    },
    img: {
        base: {
            display: "block",
            width: "200px",
            height: "150px",
            boxSizing: "border-box",
            border: "1px dashed #c0c0c0",
            borderRadius: "8px",
            background: "#f0f0f0",
            objectFit: "cover",
        },
    },
    button: {
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 20px",
            minWidth: "120px",
            minHeight: "40px",
            boxSizing: "border-box",
            border: "none",
            borderRadius: "6px",
            background: "#3b82f6",
            color: "#ffffff",
            fontFamily: "sans-serif",
            fontSize: "14px",
            cursor: "pointer",
        },
    },
};
const mediaQueries = {
    laptop: "(max-width: 1200px)",
    tablet: "(max-width: 900px)",
    mobile: "(max-width: 600px)",
};
function applyStyles() {
    Object.entries(defaultStyles).forEach(([type, breakpoints]) => {
        Object.entries(breakpoints).forEach(([breakpoint, styles]) => {
            const css = Object.entries(styles)
                .map(([prop, value]) => `${prop}: ${value};`)
                .join(" ");
            if (breakpoint === "base") {
                previewStyle.textContent += `.${type} { ${css} }\n`;
            }
            else {
                const query = mediaQueries[breakpoint];
                previewStyle.textContent += `@media ${query} { .${type} { ${css} } }\n`;
            }
        });
    });
}
function renderNode(id, parent) {
    const node = widgets[id];
    const tag = node.tag || "div";
    const element = document.createElement(tag);
    const elementId = crypto.randomUUID();
    element.dataset.id = elementId;
    element.classList.add(id, `${id}__${elementId}`, "element");
    if (parent) {
        parent.appendChild(element);
    }
    else {
        doc?.body.appendChild(element);
    }
    activateElement(element);
    placeholder?.remove();
    widgetShadow?.remove();
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
        tag: "div",
        canHaveChildren: true,
        inspector: {
            text: { type: "textarea", label: "Текст" },
            tag: { type: "select", label: "HTML-тег" },
        },
    },
    text: {
        label: "Текст",
        tag: "p",
        canHaveChildren: false,
        inspector: {
            text: { type: "textarea", label: "Текст" },
            tag: { type: "select", label: "HTML-тег" },
        },
    },
    img: {
        label: "Изображение",
        tag: "img",
        canHaveChildren: false,
        inspector: {
            src: { type: "text", label: "URL изображения" },
            alt: { type: "text", label: "Альтернативный текст" },
        },
    },
    button: {
        label: "Кнопка",
        tag: "button",
        canHaveChildren: false,
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
let doc = null;
let placeholder = null;
let previewStyle = null;
preview?.addEventListener("load", () => {
    doc = preview?.contentDocument;
    if (!doc)
        return;
    placeholder = doc.querySelector(".editor__placeholder") ?? null;
    previewStyle = doc.head.querySelector('style');
    if (!placeholder)
        return;
    applyStyles();
    doc.addEventListener("pointerdown", (e) => {
        console.log('click');
        if (!(e.target instanceof HTMLElement))
            return;
        console.log(e.target);
        const element = e.target.closest(".element") ?? null;
        if (!element || !(element instanceof HTMLElement))
            return;
        activateElement(element);
    });
});
function activateElement(element) {
    element.classList.add("active__element");
}
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
    if (preview)
        preview.style.pointerEvents = "none";
    draggable = true;
});
document.addEventListener("pointermove", (e) => {
    if (!draggable)
        return;
    if (!(widgetShadow instanceof HTMLElement))
        return;
    coordinateClone(e);
    if (!preview)
        return;
    if (!doc)
        return;
    const rect = preview.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const el = doc.elementFromPoint(x, y);
    const isOver = !!el?.closest(".editor__placeholder");
    placeholder?.classList.toggle("is-over", isOver);
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
    if (!draggable)
        return;
    if (!(e.target instanceof HTMLElement))
        return;
    if (!(widgetShadow instanceof HTMLElement))
        return;
    const id = widgetShadow.dataset.id;
    if (!id)
        return;
    if (!(id in widgets))
        return;
    renderNode(id, null);
    if (preview) {
        preview.style.pointerEvents = "auto";
    }
    draggable = false;
});
export {};
//# sourceMappingURL=script.js.map