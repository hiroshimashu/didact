let rootInstance = null;


function render(element, container) {
    const prevInstance = rootInstance;
    const nextInstance = reconcile(container, prevInstance, element);
    rootInstance = nextInstance;
}


// Decide whether or not child replacement has occurred.
function reconcile(parentDom, instance, element) {
    if(instance == null) {
        const newInstance = instantiate(element);
        parentDom.appendChild(newInstance.dom);
        return newInstance;
    } else {
        const newInstance = instantiate(element);
        parentDom.replaceChild(newInstance.dom, instance.dom);
        return newInstance;
    }
}

function instantiate(element) {
    const {type, props} = element;

    // createDOM element
    const isTextElement = type === "TEXT ELEMENT";
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
        dom[name] = props[name];
    });

    // Render Children
    const childElements = props.children || [];
    const childInstances = childElements.map(instantiate);
    const childDoms = childInstances.map(childInstance => childInstance.dom);
    childDoms.forEach(childDom => dom.appendChild(childDom));

    const instance = { dom, element, childInstances };
    return instance;
}