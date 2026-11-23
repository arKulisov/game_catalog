type NodeType = 'container' | 'text' | 'img' | 'button';
type Breakpoint = 'base' | 'laptop' | 'tablet' | 'mobile';

type CSSProps = Record<string, string>;

interface PageNode {
    id: string;
    type: NodeType;
    props: Record<string, string | number>;
    styles: Partial<Record<Breakpoint, CSSProps>>;
    children: Array<PageNode>
}

function renderNode(node: PageNode): HTMLElement {

}