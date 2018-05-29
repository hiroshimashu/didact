function render(element, parentDom) {
    const  { type, props }  = element;

    // Create DOM element
    const isTextElement = type ===  "TEXT ELEMENT";
    const dom = isTextElement ? document.createTextNode("") : document.createElement(type);

    // Add event listener
    const isListener = name => name.startsWith('on');
    Object.keys(props).fliter(isListener).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, props[name]);
    });

    // Set properties
    const isAttribute = name => !isListener(name) && name != "children";
    Object.keys(props).filter(isAttribute).forEach(name => {
        dom[name] =  props[name];
    });

    // Render Children
    const childElements = props.children || [];
    childElements.forEach(childElement => render(childElement, dom));


    // Append to parent
    parentDom.appendChild(dom);
}