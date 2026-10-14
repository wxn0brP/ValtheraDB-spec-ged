function parseLine(line) {
    const trimmed = line.trimEnd();
    if (!trimmed)
        return null;
    const match = trimmed.match(/^(\d+)\s+(?:(@[^@]+@)\s+)?(\S+)(?:\s(.*))?$/);
    if (!match)
        return null;
    return {
        level: parseInt(match[1], 10),
        xref: match[2],
        tag: match[3],
        value: match[4] || "",
    };
}
function parseGedcomTree(text) {
    text = text.replace(/^\uFEFF/, "");
    const lines = text.split(/\r?\n/);
    const roots = [];
    const stack = [];
    for (const line of lines) {
        const parsed = parseLine(line);
        if (!parsed)
            continue;
        const node = {
            level: parsed.level,
            xref: parsed.xref,
            tag: parsed.tag,
            value: parsed.value,
            children: [],
        };
        while (stack.length > 0 && stack[stack.length - 1].level >= parsed.level) {
            stack.pop();
        }
        if (stack.length > 0) {
            stack[stack.length - 1].children.push(node);
        }
        else {
            roots.push(node);
        }
        stack.push(node);
    }
    return roots;
}
function nodeToDocument(node) {
    const doc = {};
    if (node.value !== "") {
        doc._value = node.value;
    }
    for (const child of node.children) {
        if (child.tag === "CONT") {
            doc._value = (doc._value || "") + "\n" + child.value;
            continue;
        }
        if (child.tag === "CONC") {
            doc._value = (doc._value || "") + child.value;
            continue;
        }
        const childValue = child.children.length > 0
            ? nodeToDocument(child)
            : child.value !== ""
                ? child.value
                : "";
        const existing = doc[child.tag];
        if (existing === undefined) {
            doc[child.tag] = childValue;
        }
        else if (Array.isArray(existing)) {
            existing.push(childValue);
        }
        else {
            doc[child.tag] = [
                existing,
                childValue,
            ];
        }
    }
    return doc;
}
export function parseGedcomToCollections(text) {
    const roots = parseGedcomTree(text);
    const collections = new Map();
    for (const node of roots) {
        if (node.tag === "TRLR")
            continue;
        const collection = node.tag;
        if (!collections.has(collection)) {
            collections.set(collection, []);
        }
        const doc = nodeToDocument(node);
        if (node.tag === "HEAD") {
            doc._id = "HEAD";
        }
        else {
            doc._id =
                node.xref || `_${collection}_${collections.get(collection).length}`;
        }
        collections.get(collection).push(doc);
    }
    return collections;
}
