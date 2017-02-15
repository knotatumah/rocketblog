'use strict';

import "babel-polyfill"; // For Axios & IE

import React from 'react';
import SidebarEntry from './sidebar-entry.jsx';
import Axios from 'axios';

export default class Sidebar extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            posts: false
        }
    }
    
    render()
    {
        let entries;

        if (this.state.posts)
        {
            entries = this.state.posts.posts.map((post, index) =>
                <SidebarEntry key={index} id={index} post={post} showWhole={this.showWhole}/>
            );
        }

        return (
            <div className='sidebar col-sm-3'>
                { entries }
                <div className='sidebarLink sideEntry'>
                    <a href='#/waterfall'>See More</a>
                </div>
            </div>
        );
    }

    componentDidMount()
    {
        // Getting the latest post

        const _this = this;
        const params =
        {
            find:{},
            show:
            {
                '__v': '0',
                '_id': '1',
                'title': '1',
                'date': '1',
                'blurb': '1',
            },
            sort: -1,
            limit: 4,
        };

        Axios.post(location.protocol + '//' + location.hostname + ':8080/api/query', params)
        .then(function(results){
            if (results.data.status === 'success')
            {
                _this.setState(
                {
                    posts: results.data
                });
            }
        });
    }
}