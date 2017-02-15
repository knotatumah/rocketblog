/*
    Entry returns blog entries that are not used for navigation (i.e. sidebars)
*/

'use strict';

import React from 'react';
import Moment from 'moment';

export default class Entry extends React.Component
{
    render()
    {
        let sources;
        let permalink;
        let content;

        //Full post or blurb?
        if (this.props.entry.isFull)
        {
            content = this.props.post.content.split('<br/>').map((paragraph, index) =>
            {
                return (<p>{paragraph}</p>);
            });
        }
        else
        {
            content = this.props.post.blurb;
        }

        //Append cited sources?
        if (this.props.entry.needSources)
        {
            sources = (
                <div>
                    <p className='entrySlim'>
                        Sources:
                    </p>
                    <ol>
                        {
                            this.props.post.sources.map((source, index) =>
                            {
                                return (<li><a href={source}>{source}</a></li>);
                            })
                        }
                    </ol>
                </div>
            )
        }

        //Append a link that navigates to /#simpleblog?
        if (this.props.entry.needLink)
        {
            permalink = (
                <p>
                    <a href={'#/simpleblog/'+this.props.post._id}>[ Read More ]</a>
                </p>
            )
        }

        return (
            <div className={'entry ' + this.props.entry.class}>
                <div className='entryBlock'>
                    <div className='entryHeader'>
                        <h2 className='entryTitle'>{this.props.post.title}</h2>
                        <span className='entryTime'>{this.props.post.date ? Moment.unix(this.props.post.date).format('MMMM Do, YYYY') : ''}</span>
                    </div>
                    <div className='entryContent'>
                        {content}
                        {permalink}
                        {sources}
                    </div>
                </div>
            </div>
        );
    }
}