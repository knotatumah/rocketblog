/*
    Sidebar-entry provides a blog snippet used for navigation
*/

'use strict';

import React from 'react';
import Moment from 'moment';

export default class SidebarEntry extends React.Component
{
    render()
    {
        if (Array.isArray(this.props.post))
        {
            return null;
        }

        const blurb = this.props.post.blurb.substring(0,100) + '...';

        return (
            <div key={this.props.key} className='sideEntry'>
                <div>
                    <a href={'#/sidebar/' + this.props.post._id}><h3>{this.props.post.title}</h3></a>
                    <span>{this.props.post.date ? Moment.unix(this.props.post.date).format('MMMM Do, YYYY') : ''}</span>
                </div>
                <div>
                    <p>{blurb}</p>
                </div>
            </div>
        );
    }
}