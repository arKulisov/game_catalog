type NodeType = "container" | "text" | "img" | "button";
type Breakpoint = "base" | "laptop" | "tablet" | "mobile";

type CSSProps = Record<string, string>;

interface PageNode {
  id: string;
  type: NodeType;
  props: Record<string, string | number>;
  styles: Partial<Record<Breakpoint, CSSProps>>;
  children: Array<PageNode>;
}

function renderNode(node: PageNode, parent: HTMLElement | null): HTMLElement {
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
        }
    },
    button: {
        label: "Кнопка",
        icon: "button-icon",
        canHaveChildren: false,
        defaultStyles: { base: { display: "block" } },
        inspector: {
            text: { type: "textarea", label: "Текст" },
            tag: { type: "select", label: "HTML-тег" },
        }
    }
};
const widgetBar = document.querySelector<HTMLElement>(".sidebar__content");
document.addEventListener("DOMContentLoaded", () => {
    if (!widgetBar) return;
    Object.entries(widgets).forEach(([type, widget]) => {
        const widgetElement = document.createElement("div");
        widgetElement.className = "widget";
        widgetElement.title = widget.label;
        widgetBar.appendChild(widgetElement);
    });
});