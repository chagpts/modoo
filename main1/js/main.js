(function(){
  const navbar=document.getElementById('navbar');
  const menuToggle=document.getElementById('menuToggle');
  const mainMenu=document.getElementById('mainMenu');
  const onScroll=()=>navbar&&navbar.classList.toggle('scrolled',window.scrollY>20);
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  menuToggle?.addEventListener('click',()=>mainMenu?.classList.toggle('open'));
  mainMenu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mainMenu.classList.remove('open')));

  const revealEls=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.14});
    revealEls.forEach(el=>observer.observe(el));
  }else{revealEls.forEach(el=>el.classList.add('visible'))}
})();
