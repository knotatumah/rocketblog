'use strict';

import "babel-polyfill"; // For Axios & IE

import React from 'react';
import ReactDOM from 'react-dom';
import Entry from './entry.jsx';
import Axios from 'axios';
import Sidebar from './sidebar.jsx';
import { contentHeight } from '../content-height.js';

export default class SidebarMain extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {};
    }

    render()
    {
        let entry;

        if (this.state.post)
        {
            entry = <Entry post={this.state.post} entry={{class: 'entrySidebar col-sm-9', isFull: true, needSources: true, needLink: false}}/>;
        }

        return (
            <div className='container-fluid'>
                <div className='sidebarMain col-sm-10 col-sm-offset-1'>
                    <div id='pageHeader' className='col-sm-12'>
                        <span>Space - Rockets - New Frontiers</span>
                    </div>
                    { entry }
                    <Sidebar/>
                </div>
            </div>
        );
    }

    componentDidUpdate()
    {
        window.scrollTo(0,0);
        contentHeight.resetHeight();
    }

    componentDidMount()
    {
        window.scrollTo(0,0);

        if (this.props.id)
        {
            this.getEntry(this.props.id);
        }
        else
        {
            this.getLatest();
        }
    }

    componentWillReceiveProps(nextProps)
    {
        if (nextProps.params.id)
        {
            this.getEntry(nextProps.params.id);
        }
        else
        {
            this.getLatest();
        }
    }

    componentWillUnmount()
    {
        //Prevents the footer flashing onto the screen on view changes
        contentHeight.setHeight();
    }

    getLatest()
    {
        const _this = this;
        
        Axios.get(location.protocol + '//' + location.hostname + ':8080/api/latest')
        .then(function(results){
            _this.setState(
            {
                post: results.data.posts[0]
            });
            history.pushState(null, null, '#/sidebar/'+results.data.posts[0]._id);
        });
    }

    getEntry(id)
    {
        const _this = this;
        const axiosParams = 
        {
            find:
            {
                '_id': id
            },
            show:
            {
                '__v': '0',
                '_id': '1',
                'title': '1',
                'date': '1',
                'content': '1',
                'sources': '1',
            },
            sort: -1,
            limit: 1,
        }

        Axios.post(location.protocol + '//' + location.hostname + ':8080/api/querySingle', axiosParams)
        .then(function(results){
            if (results.data.status === 'success')
            {
                _this.setState(
                {
                    post: results.data.posts[0]
                });
            }
        });
    }
}