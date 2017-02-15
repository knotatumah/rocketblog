'use strict';

//Core components
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute, Redirect} from 'react-router';

//Main application
import App from './components/app.jsx';

//Views
import Home from './components/home-view.jsx';
import SimpleBlog from './components/simple-blog-view.jsx';
import Waterfall from './components/waterfall-view.jsx';
import SidebarMain from './components/sidebar-view.jsx';

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path='/' component={App}>
            <IndexRoute component={Home}/>
            <Route path='/simpleblog(/:id)' component={SimpleBlog}/>
            <Route path='/sidebar(/:id)' component={SidebarMain}/>
            <Route path='/waterfall' component={Waterfall}/>
        </Route>
    </Router>
), document.getElementById('main'));