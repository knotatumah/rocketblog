'use strict';

import React from 'react';
import Header from './header.jsx';
import { contentHeight } from '../content-height.js';

export default class App extends React.Component
{
    render()
    {
        let children;

        //Passing an id if the route has the parameter
        if (!this.props.params.id)
        {
            children = this.props.children;
        }
        else
        {
            children = React.Children.map(
                this.props.children, (child) => React.cloneElement(
                    child,
                    {
                        id: this.props.params.id
                    }
                )
            );
        }

        return (
            <div>
                <Header page={this.props.routes[1].component.name}/>
                <div id='content'>
                    {children}
                </div>
                <div id='footer' className='row'>
                    <div id='footerDetails'>
                        <span>Concept by Zach Stark 2016</span>
                    </div>
                </div>
            </div>
        );
    }
}