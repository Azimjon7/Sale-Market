
(function(){
  function qs(s){return document.querySelector(s)}
  function qsa(s){return Array.from(document.querySelectorAll(s))}
  function updateMarketCart(){
    try{var cart=window.MBStore&&MBStore.getCart?MBStore.getCart():JSON.parse(localStorage.getItem('mujskoy_cart')||localStorage.getItem('mb_cart')||'[]');var count=cart.reduce(function(s,i){return s+Number(i.qty||1)},0);qsa('.js-cart-count,.market-cart-tip').forEach(function(el){el.textContent=count})}catch(e){}
  }
  function bindSearch(){
    qsa('.js-market-search').forEach(function(form){form.addEventListener('submit',function(e){e.preventDefault();var input=form.querySelector('input');var q=(input&&input.value||'').trim();window.location.href='shop.html'+(q?'?q='+encodeURIComponent(q):'');})})
  }
  function applySearchFromUrl(){
    var p=new URLSearchParams(location.search);var q=p.get('q');var input=qs('#shop-search');if(q&&input){input.value=q;setTimeout(function(){input.dispatchEvent(new Event('input',{bubbles:true}))},450)}
  }
  function timer(){
    var root=qs('[data-market-timer]'); if(!root) return; var end=Date.now()+1000*60*60*8+1000*60*17+1000*44;
    function tick(){var left=Math.max(0,end-Date.now());var h=Math.floor(left/36e5);var m=Math.floor(left%36e5/6e4);var s=Math.floor(left%6e4/1000);root.innerHTML='<span>'+String(h).padStart(2,'0')+'</span><span>'+String(m).padStart(2,'0')+'</span><span>'+String(s).padStart(2,'0')+'</span>';}
    tick();setInterval(tick,1000);
  }
  document.addEventListener('DOMContentLoaded',function(){updateMarketCart();bindSearch();applySearchFromUrl();timer();});
  window.addEventListener('storage',updateMarketCart);
})();
