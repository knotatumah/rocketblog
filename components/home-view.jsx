'use strict';

import React from 'react';
import { contentHeight } from '../content-height.js';

export default class Home extends React.Component
{
    render()
    {
        return (
            <div id='content' className='container-fluid'>
                <div id='hero'>
                    <div>
                        <span>A Space Blog Concept</span>
                    </div>
                    <div>
                        <span>Powered by Node and Express</span>
                    </div>
                    <div>
                        <span>Using MongoDB and Mongoose</span>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount()
    {
        window.scrollTo(0,0);
        contentHeight.resetHeight();
    }

    componentWillUnmount()
    {
        //Prevents the footer flashing onto the screen on view changes
        contentHeight.setHeight();
    }
}