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
        return newInstance
    } else if( element == null) {
        // Remove instance 
        parentDom.removeChild(instance.dom);
        return null;
    } else if (instance.element.type !== element.type) {
        const newInstance = instantiate(element);
        parentDom.replaceChild(newInstance.dom, instance.dom);
        return newInstance;
    } else if (typeof element.type === "string") {
        // update instance 
        updateDomProperties(instance.dom, instance.element.props, element.props);
        instance.childInstances = reconcileChildren(instance, element);
        instance.element = element;
        return instance;
    } else {
        instance.publicInstance.props = element.props;
        const childElement = instance.publicInstance/render();
        const oldChildInstance = instance.childInstance;
        const childInstance = reconcile(parentDom, oldChildInstance, childElement);
        instance.dom = childInstance.dom;
        instance.childInstance = childInstance;
        instance.element = element;
        return instance;
    }
}

function instantiate(element) {
    const {type, props} = element;
    const isDomElement = typeof type === "string";

    // create DOM element
    if(isDomElement) {
        const isTextElement = type === "TEXT ELEMENT";
        const dom = isTextElement ? document.createTextNode("") : document.createElement(type);

        updateDomProperties(dom, [], props);

       //Instantiate and append children
       const childElements = props.children || [];
       const childInstances = childElements.map(instantiate);
       const childDoms = childInstances.map(childInstance => childInstance.dom);
       childDoms.forEach(childDom => dom.appendChild(childDom));

       const instance = { dom, element, childInstances };
       return instance;
    } else {
        const instance = {};
        const publicInstance = createPublicInstance(element, instance);
        const childElement = instantiate(childElement);
        const dom = childInstance.dom;

        Object.assign(instance, { dom, element, childInstance, publicInstance });
        return instance;
    }
}

function reconcileChildren(instance, element)  {
    const dom = instance.dom;
    const childInstances = instance.childInstances;
    const nextChildElements = elemetn.props.children || [];
    const newChildInstances = [];
    const count = Math.max(childInstances.length, nextChildElements.length);
    for(let i = 0; i < count; i++) {
        const childInstance = childInstances[i];
        const childElement = nextChildElements[i];
        const nexChildInstance = reconcile(dom, childInstance, childElement);
        newChildInstances.push(newInstance);
    }
    return newChildInstances;
}

function updateDomProperties(dom, prevProps, nextProps) {
    
    const isEvent = name => name.startsWith("on");
    const isAttribute = name => !isEvent(name) && name != "children";

    // Remove event listeners
    Object.keys(prevProps).filter(isEvent).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[name]);
    });

    // Remove attributes
    Object.keys(prevProps).filter(isAttribute).forEach(name => {
        dom[name] = null;
    })

    //Set attributes
    Object.keys(nextProps).filter(isAttribute).forEach(name => {
        dom[name] = nextProps[name];
    })

    // Add event Listeners
    Object.keys(nextProps).filter(isEvent).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[name]);
    });

}