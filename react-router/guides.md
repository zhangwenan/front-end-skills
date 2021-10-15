https://reactrouter.com/core/guides/philosophy/dynamic-routing

# Dynamic Routing
在应用渲染之前，就已经定义好的路由，可以理解为静态路由。
相对的，就是动态路由。
静态路由，server端有express，客户端如angular(在app渲染前，就定义好了)

```
const App = () => (
  <AppLayout>
    <Route path="/invoices" component={Invoices} />
  </AppLayout>
);

const Invoices = () => (
  <Layout>
    {/* always show the nav */}
    <InvoicesNav />

    <Media query={PRETTY_SMALL}>
      {screenIsSmall =>
        screenIsSmall ? (
          // small screen has no redirect
          <Switch>
            <Route
              exact
              path="/invoices/dashboard"
              component={Dashboard}
            />
            <Route path="/invoices/:id" component={Invoice} />
          </Switch>
        ) : (
          // large screen does!
          <Switch>
            <Route
              exact
              path="/invoices/dashboard"
              component={Dashboard}
            />
            <Route path="/invoices/:id" component={Invoice} />
            <Redirect from="/invoices" to="/invoices/dashboard" />
          </Switch>
        )
      }
    </Media>
  </Layout>
);
```

# 例子
`<Switch>`会在子组件中寻找第一个匹配的`<Route>`，这里的匹配是部分匹配(从起始位置开始匹配)，而不是全部匹配。
因此，`<Route>`放置的顺序需要特别注意。如需完全匹配，需要指定exact,比如: `<Route exact path="/">`
路由会展示第一个匹配的选项。比如：
```
<Switch>
  // 这里，如果 / 这个路由写在第一个，那么，后面的路由，都不会被执行
  <Route path="/">
    <Home />
  </Route>
  <Route path="/about">
    <About />
  </Route>
  <Route path="/users">
    <Users />
  </Route>
</Switch>
```

# 嵌套路由 Nested Routing

```
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/topics">Topics</Link>
          </li>
        </ul>

        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/topics">
            <Topics />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Topics() {
  let match = useRouteMatch();

  return (
    <div>
      <h2>Topics</h2>

      <ul>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>
            Props v. State
          </Link>
        </li>
      </ul>

      <Switch>
        <Route path={`${match.path}/:topicId`}>
          <Topic />
        </Route>
        <Route path={match.path}>
          <h3>Please select a topic.</h3>
        </Route>
      </Switch>
    </div>
  );
}

function Topic() {
  let { topicId } = useParams();
  return <h3>Requested topic ID: {topicId}</h3>;
}
```



# 主要组件 Primary Components
React Router中有3类主要组件：
* routers, 比如：`<BrowserRouter>`、`<HashRouter>`
* route matchers, 比如：`<Route>`、`<Switch>`
* navigation， 比如：`<Link>`、`<NavLink>`、`<Redirect>`

##  Routers
BrowserRouter: 跟普通Url一致。需要server端的配置。
HashRouter: URL带#符号。路由切换，不会发起http请求。

Router通常放在应用顶部。常见的做法是将`<App>`包裹起来。比如：
```
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

function App() {
  return <h1>Hello React Router</h1>;
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
```

##  Route Matchers

##  Navigation (or Route Changers)
* `<Link>`
* `<NavLink>`
* `<Redirect>`

```
<Link to="/">Home</Link>
// <a href="/">Home</a>

<NavLink to="/react" activeClassName="hurray">
  React
</NavLink>
// When the URL is /react, this renders:
// <a href="/react" className="hurray">React</a>

// 强制跳转。只要渲染该组件，就会直接跳转
<Redirect to="/login" />
```

# Code Splitting
webpack: webpack默认支持`import()`语法。


@babel/plugin-syntax-dynamic-import: 使用babel编译JSX文件，则需要使用该插件，才能识别`import()`语法，因为，babel默认无法识别`import()`，这个插件仅仅是告诉babel，只要保留`import()`语法即可。因为后面的webpack会处理。
```
{
  "presets": ["@babel/preset-react"],
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
}
```

loadable-components: 
https://github.com/smooth-code/loadable-components
https://loadable-components.com/docs/getting-started/

```
import loadable from "@loadable/component";
import Loading from "./Loading.js";

const LoadableComponent = loadable(() => import("./Dashboard.js"), {
  fallback: <Loading />
});

export default class LoadableDashboard extends React.Component {
  render() {
    return <LoadableComponent />;
  }
}
```

# Scroll Restoration (滚动复原)
浏览器已经开始通过`history.pushState`，自行实现该功能。
并且用户对于滚动条的需求，通常非常多变。
因此，react router默认不再支持，而是需要用户实现。


##  Scroll to top
默认情况下，浏览器前进、后退按钮，还会停留在原先的位置。
如果，需要在点击前进、后退时，滚动到最顶部。那么，可以这样实现：
```
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
```

// 这样，App中所有路由切换，都会触发ScrollToTop
```
function App() {
  return (
    <Router>
      <ScrollToTop />
      <App />
    </Router>
  );
}
```

##  Generic Solution（通用方案）

前进、后退时，记录滚动条位置。该方案并未实现。



##  Deep Redux Integration
