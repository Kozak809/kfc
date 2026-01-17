(function() {
  function resize() {
    const children = document.body.children;
    let el = null;
    
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (getComputedStyle(child).display !== 'none') {
        el = child;
        break;
      }
    }
    
    if (!el) return;
    
    const w = window.innerWidth;
    const baseWidth = 1440;
    const scale = w / baseWidth;
    
    el.style.transformOrigin = '0 0';
    el.style.transform = 'scale(' + scale + ')';
    el.style.width = baseWidth + 'px';
    
    document.body.style.height = (el.offsetHeight * scale) + 'px';
    document.body.style.overflow = 'hidden';
    document.body.style.overflowY = 'auto';
  }
  
  window.addEventListener('resize', resize);
  document.addEventListener('DOMContentLoaded', resize);
  resize();
})();