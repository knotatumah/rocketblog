'use strict';

/*
    A small class for all components to set the heigh of #content.
    This is to avoid the flash of content when changing views.
*/
class ContentHeight
{
    //Maintaining height
    setHeight()
    {
        const content = document.getElementById('content');
        clearTimeout(this.timer);
        content.style['min-height'] = getComputedStyle(content)['height'];
    }

    //Removing height
    resetHeight()
    {
        const content = document.getElementById('content');
        content.style['min-height'] = 'auto';
    }
}

export let contentHeight = new ContentHeight();