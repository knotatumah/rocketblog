'use strict';

import React from 'react';

export default class Header extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state =
        {
            SimpleBlog: 'inactive',
            SidebarMain: 'inactive',
            Waterfall: 'inactive',
        }

        /*
            CSS for links & link containers.
            The two animate in different directions to create a moving "mask"
        */
        this.css =
        {
            container:
            {
                inactive: 'navButton navMain',
                animating: 'navButton navMain animateUp',
                active: 'navButton navMain buttonActive animateDown',
            },
            link:
            {
                inactive: 'navTitle',
                animating: 'navTitle animateDown',
                active: 'navTitle buttonActive animateUp',
            }
        }

        this.animation =
        {
            activeId: '',
            timer: false,
            isTimerRunning: false,
        }
    }
    render()
    {

        return(
            <div id='header'>
                <div id='logoContainer'>
                    <a id='logo' href='#/'>
                        <img src='./images/logo.png'/>
                    </a>
                </div>
                <div id='nav'>
                    <ul>
                        <li>
                            <div id='simpleBlog' className={this.css.container[this.state.SimpleBlog]}>
                                <a id='simpleBlogLink' className={this.css.link[this.state.SimpleBlog]} href='#/simpleblog'>Simple Blog</a>
                            </div>
                            <div className='navButton navSub'><span className='navTitle'>Simple Blog</span></div>
                        </li>
                        <li>
                            <div id='sidebar' className={this.css.container[this.state.SidebarMain]}>
                                <a id='sidebarLink' className={this.css.link[this.state.SidebarMain]} href='#/sidebar'>Sidebar</a>
                            </div>
                            <div className='navButton navSub'><span className='navTitle'>Sidebar</span></div>
                        </li>
                        <li>
                            <div id='waterfall' className={this.css.container[this.state.Waterfall]}>
                                <a id='waterfallLink' className={this.css.link[this.state.Waterfall]} href='#/waterfall'>Waterfall</a>
                            </div>
                            <div className='navButton navSub'><span className='navTitle'>Waterfall</span></div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }

    componentDidMount()
    {
        this.animateNav(this.props.page);
    }

    componentWillReceiveProps(newProps)
    {
        this.animateNav(newProps.page);
    }

    animateNav(newId)
    {
        let animation = this.animation;

        if (animation.activeId === newId)
        {
            return;
        }

        // Reset current button
        if (animation.activeId && animation.activeId !== 'home')
        {
            let newState = {};
            newState[animation.activeId] = 'inactive';

            this.setState(newState);
            clearTimeout(animation.timer);
        }

        animation.activeId = newId;

        // Set new animation into progress
        if (newId !== 'home')
        {
            let _this = this;
            let newState = {};

            newState[newId] = 'animating';
            this.setState(newState);

            animation.timer = window.setTimeout(function()
            {
                let newId = _this.animation.activeId;
                let newState = {};

                newState[newId] = 'active';
                _this.setState(newState);
                _this.animation.isTimerRunning = false;
            },
            750);
        }
    }
}