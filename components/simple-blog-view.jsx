'use strict';

import "babel-polyfill"; // For Axios & IE

import React from 'react';
import Entry from './entry.jsx';
import Axios from 'axios';
import { contentHeight } from '../content-height.js';

export default class SimpleBlog extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state =
        {
            isOldest:false, // Enable or disable 'previous' buttons
            isNewest:true,  // Enable or disable 'next' buttons
        }

        // Styling for enabled or disabled buttons
        this.css =
        {
            false:'',
            true:'noNav',
        }
    }

    render()
    {
        let entry;

        if (this.state.post)
        {
            entry = <Entry post={this.state.post} entry={{class: 'bgBlog', isFull: true, needSources: true, needLink: false}}/>;
        }

        return (
            <div>
                <div id='pageHeader'>
                    <span>Space - Rockets - New Frontiers</span>
                </div>
                <div>
                    <div className='entryButtons'>
                        <button disabled={this.state.isOldest} className={'entryFirst ' + this.css[this.state.isOldest]} onClick={this.getEntry.bind(this,'first')}></button>
                        <button disabled={this.state.isOldest} className={'entryPrevious ' + this.css[this.state.isOldest]} onClick={this.getEntry.bind(this,'previous')}></button>
                        <button disabled={this.state.isNewest} className={'entryNext ' + this.css[this.state.isNewest]} onClick={this.getEntry.bind(this,'next')}></button>
                        <button disabled={this.state.isNewest} className={'entryLast ' + this.css[this.state.isNewest]} onClick={this.getEntry.bind(this,'latest')}></button>
                    </div>
                </div>
                { entry }
            </div>
        );
    }

    componentDidMount()
    {
        window.scrollTo(0,0);

        if (this.props.id)
        {
            this.idLookup(this.props.id);
        }
        else
        {
            this.getEntry('latest');
        }
    }
    
    componentWillReceiveProps(nextProps)
    {
        if (nextProps.id)
        {
            this.idLookup(nextProps.id);
        }
        else
        {
            this.getEntry('latest');
        }
    }

    componentDidUpdate()
    {
        window.scrollTo(0,0);
        contentHeight.resetHeight();
    }

    componentWillUnmount()
    {
        //Prevents the footer flashing onto the screen on view changes
        contentHeight.setHeight();
    }

    //Handles previous / next requests
    getEntry(route)
    {
        const _this = this;

        if (route === 'previous' || route === 'next')
        {
            route = route + '/' + this.state.post.date;
        }

        Axios.get(location.protocol + '//' + location.hostname + ':8080/api/' + route)
        .then(function(results)
        {
            if (results.data.status === 'success')
            {
                _this.setState(
                {
                    post: results.data.posts[0],
                    isOldest: results.data.isOldest ? true : false,
                    isNewest: results.data.isNewest ? true : false,
                });
                history.pushState(null, null, '#/simpleblog/'+results.data.posts[0]._id);
            }
        });
    }

    // Get an entry by the id specified in the url
    idLookup(id)
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
        .then(function(results)
        {
            if (results.data.status === 'success')
            {
                _this.setState(
                {
                    post: results.data.posts[0],
                    isOldest: results.data.isOldest ? true : false,
                    isNewest: results.data.isNewest ? true : false,
                });
            }
        });
    }
}