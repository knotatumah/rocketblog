'use strict';

import "babel-polyfill"; // For Axios & IE

import React from 'react';
import Entry from './entry.jsx';
import Axios from 'axios';
import { contentHeight } from '../content-height.js';

export default class Waterfall extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state =
        {
            posts: [],      //Lists of posts
            oldest: null,   //Current oldest post date
        }
    }

    render()
    {
        let entries;
        
        if (this.state.posts)
        {
            entries = (
                this.state.posts.map((entry, index) =>
                {
                    return <Entry post={entry} entry={{class: 'bgBlog waterfall', isFull: false, needSources: false, needLink: true}}/>;
                })
            );
        }

        return(
            <div>
                <div id='pageHeader'>
                    <span>Space - Rockets - New Frontiers</span>
                </div>
                {entries}
                <div className='text-center'>
                    <button className='btn btn-lg' onClick={this.getMore.bind(this)}>Show More</button>
                </div>
            </div>
        );
    }

    componentDidMount()
    {
        const find = {};

        window.scrollTo(0,0);
        this.getEntries(find)
    }

    componentDidUpdate()
    {
        contentHeight.resetHeight();
    }

    componentWillUnmount()
    {
        //Prevents the footer flashing onto the screen on view changes
        contentHeight.setHeight();
    }

    getMore()
    {
        const find = {'date': {$lt: this.state.oldest}};

        this.getEntries(find)
    }

    getEntries(find)
    {
        const _this = this;
        let axiosParams =
        {
            show:
            {
                '__v': '0',
                '_id': '1',
                'title': '1',
                'date': '1',
                'blurb': '1',
            },
            sort: -1,
            limit: 3,
        }

        axiosParams.find = find;

        Axios.post(location.protocol + '//' + location.hostname + ':8080/api/query', axiosParams)
        .then(function(results)
        {
            if (results.data.status === 'success')
            {
                if (results.data.posts.length)
                {
                    const newPosts = results.data.posts;
                    let oldPosts = _this.state.posts;

                    oldPosts = oldPosts.concat(newPosts);
                    _this.setState(
                    {
                        posts: oldPosts,
                        oldest: newPosts[newPosts.length - 1].date,
                    });
                }
            }
        });
    }
}