import { Router, Route } from "@solidjs/router";
import { onMount } from "solid-js";

import { initAuth } from "./utils/auth";
import Home from "./routes/Home"
import Register from "./routes/Register";
import CreatePost from "./routes/CreatePost";
import Login from "./routes/Login";
import PostDetail from "./routes/PostDetail"
import UserEdit from "./routes/UserEdit"
import UserProfile from "./routes/UserProfile"
import GroupList from "./routes/GroupList";
import GroupCreate from "./routes/GroupCreate";
import FederationCreate from "./routes/FederationCreate";
import GroupDetail from "./routes/GroupDetail";
import GroupPost from "./routes/GroupPost";

function App() {
  onMount(async () => {
    try {
      await initAuth();
    } catch (err) {
      console.error('Auth initialization failed:', err);
    }
  });

  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/create" component={CreatePost} />
      <Route path="/create-post" component={CreatePost} />
      <Route path="/login" component={Login} />
      <Route path="/p/:postId" component={PostDetail} />
      <Route path="/useredit" component={UserEdit} />
      <Route path="/u/:username" component={UserProfile} />
      <Route path="/group-list" component={GroupList} />
      <Route path="/group-create" component={GroupCreate} />
      <Route path="/federation-create" component={FederationCreate} />
      <Route path="/g/:id" component={GroupDetail} />
      <Route path="/g/:id/post" component={GroupPost} />
    </Router>
  );
}

export default App;
