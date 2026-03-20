import { Router, Route } from "@solidjs/router";
import { onMount } from "solid-js";

import { initAuth, user } from "./utils/auth";
import Home from "./routes/Home"
import Register from "./routes/Register";
import CreatePost from "./routes/CreatePost";
import Login from "./routes/Login";
import PostDetail from "./routes/PostDetail"
import UserEdit from "./routes/UserEdit"
import UserProfile from "./routes/UserProfile"
function App() {
  // 🚀 init auth saat app start
  onMount(() => {
    initAuth();
  });

  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/create" component={CreatePost} />
      <Route path="/login" component={Login} />
      <Route path="/p/:postId" component={PostDetail} />
      <Route path="/useredit" component={UserEdit} />
<Route path="/u/:username" component={UserProfile} />
    </Router>
    
  );
}

export default App;
