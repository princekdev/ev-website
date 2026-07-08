/* Ownership interactive timeline expand/collapse */
(function () {
  "use strict";
document.querySelectorAll('.own-item').forEach(item=>{
  item.addEventListener('click', ()=>{
    const already = item.classList.contains('active');
    document.querySelectorAll('.own-item').forEach(i=>i.classList.remove('active'));
    if(!already) item.classList.add('active');
  });
});
})();
