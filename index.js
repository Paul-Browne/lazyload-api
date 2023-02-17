export const lazyloadAPI = ({
    mapFunc,
    data,
    fireOnInit = false,
    containerElement = document.querySelector(".lazyload-container"),
    startFromIndex = 0,
    offsetPercent = 50,
    onAdd = undefined
} = {}) => {

    if (!mapFunc || !data || !containerElement) return

    let loading = false;
    let lastY = window.scrollY;

    const removeEventListener = () => window.removeEventListener("scroll", handleScroll);

    const isInViewportPlusOffset = (element, offsetPercent) => {
        const wH = window.innerHeight;
        const _offset = wH * (offsetPercent / 100);
        const boundingRect = element.getBoundingClientRect();
        const yPositionBottom = boundingRect.bottom;
        return yPositionBottom <= wH + _offset ? true : false;
    };

    const handleScroll = () => {
        const Y = window.scrollY;
        // only interested when scrolling down...
        if (Y > lastY && !loading) {
            loading = true;
            addToDOM();
            loading = false;
        }
        lastY = Y;
    }

    const addToDOM = () => {
        if (data.length > startFromIndex && isInViewportPlusOffset(containerElement, offsetPercent)) {
            containerElement.querySelector("template").outerHTML = data.filter((_, i) => i === startFromIndex).map(item => mapFunc(item))[0] + "<template></template>";
            startFromIndex += 1;
            onAdd && onAdd();
            addToDOM();
        } else {
            removeEventListener();
        }

    }

    fireOnInit && addToDOM();

    // remove any previous lazyLoader
    window.dispatchEvent(new Event('removeLazyloadListener'));
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("removeLazyloadListener", removeEventListener);

};


/*
<section class="lazyload-container">
    <template></template>
</section>
*/

/*
lazyloadAPI({
    mapFunc: function (item) {
        return `
        <div>
            <h1>${item.name}</h1>
            <p>${item.copy}</p>
        </div>`
    },
    data: [{
        name: "Mike",
        copy: "Hello world!!"
    },
    {
        name: "Mike",
        copy: "Hello world!!"
    }, {
        name: "Mike",
        copy: "Hello world!!"
    }, {
        name: "Mike",
        copy: "Hello world!!"
    }],
    onAdd: function(){  
        // optional
        // some callback when item is added to the DOM
        // for example a GA event
    }    
})
*/