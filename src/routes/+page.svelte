<script>
  import {parseMarkdown} from '$lib/vendor/leorpiomd.esm.js'
  const md=`# Welcome to Habl Ecosystem
  Habl Features
  > Connect people with virtual places 
  
  `
</script>
<div class="leorpiomd">
{@html parseMarkdown(md)}
</div>
<nav class="navbar bottom">
  <button class="btn bg-primary">
    Open Me
  </button>
</nav>