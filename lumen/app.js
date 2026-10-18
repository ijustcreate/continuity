(() => {
  const threads = window.LUMEN_THREADS || [];
  const feed = document.getElementById("threadFeed");
  const conceptList = document.getElementById("conceptList");
  const activeContext = document.getElementById("activeContext");
  let activeFilter = "all";
  let activeConcept = null;

  const palette = ["#87d8c6","#efbd86","#85b8e8","#e595a2","#b9a4e8","#9cc77f","#e0a6cf","#8bcfd6"];

  function hashColor(name){
    let n=0; for(const c of name) n=(n*31+c.charCodeAt(0))>>>0;
    return palette[n % palette.length];
  }
  function initials(handle){
    return handle.replace("@","").split(/[-_ ]+/).map(x=>x[0]).join("").slice(0,2).toUpperCase();
  }
  function avatar(user){
    const color = user.color || hashColor(user.handle);
    return '<div class="avatar" style="color:'+color+';background:'+color+'18;border-color:'+color+'55">'+initials(user.handle)+'</div>';
  }
  function allUsers(){
    const map=new Map();
    threads.forEach(t=>{
      map.set(t.author.handle,t.author);
      (t.comments||[]).forEach(c=>map.set(c.author.handle,c.author));
    });
    return [...map.values()];
  }
  function commentsByUser(handle){
    let count=0; threads.forEach(t=>{ if(t.author.handle===handle) count++; (t.comments||[]).forEach(c=>{if(c.author.handle===handle) count++;});});
    return count;
  }
  function renderConcepts(){
    conceptList.innerHTML = allUsers().map(u => {
      return '<div class="concept" data-concept="'+u.handle+'">'+avatar(u)+'<div><div class="name">'+u.handle+'</div><div class="count">'+commentsByUser(u.handle)+' appearances</div></div></div>';
    }).join("");
    conceptList.querySelectorAll(".concept").forEach(el=>el.addEventListener("click",()=>{
      activeConcept = el.dataset.concept;
      render();
    }));
  }
  function commentMarkup(c){
    return '<div class="comment" data-stance="'+c.stance+'"><div class="comment-head">'+avatar(c.author)+'<div><div class="handle">'+c.author.handle+'</div><div class="sub">'+(c.author.bio||"concept account")+'</div></div><span class="relation">'+c.stance+'</span></div><p>'+c.body+'</p></div>';
  }
  function threadVisible(t){
    const filterOk = activeFilter==="all" || (t.comments||[]).some(c=>c.stance===activeFilter);
    const conceptOk = !activeConcept || t.author.handle===activeConcept || (t.comments||[]).some(c=>c.author.handle===activeConcept);
    return filterOk && conceptOk;
  }
  function threadMarkup(t){
    const commentCount=(t.comments||[]).length;
    return '<article class="thread-card" data-thread="'+t.id+'"><div class="post"><div class="post-head">'+avatar(t.author)+'<div class="post-meta"><div class="handle">'+t.author.handle+'</div><div class="sub">'+t.date+' · '+t.author.bio+'</div></div><span class="spawn">spawned by this thought</span></div><h3>'+t.title+'</h3><p>'+t.body+'</p><div class="post-tags">'+t.tags.map(x=>'<span class="tag">'+x+'</span>').join("")+'<span class="tag">'+commentCount+' replies</span></div></div><div class="comments">'+(t.comments||[]).map(commentMarkup).join("")+'</div></article>';
  }
  function render(){
    const visible=threads.filter(threadVisible);
    feed.innerHTML = visible.length ? visible.map(threadMarkup).join("") : '<div class="empty">No threads match this view.</div>';
    if(activeConcept){
      const user=allUsers().find(u=>u.handle===activeConcept);
      activeContext.innerHTML='<div class="eyebrow">CONCEPT FOCUS</div><p><strong>'+activeConcept+'</strong><br>'+(user?.bio||"concept account")+'<br><br>'+commentsByUser(activeConcept)+' recorded appearances across the visible archive.</p>';
    } else {
      activeContext.innerHTML='<div class="eyebrow">ACTIVE THREAD</div><p>Choose a concept on the left to trace where it originated and when it returned.</p>';
    }
  }
  document.getElementById("filters").querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{
    activeFilter=btn.dataset.filter;
    document.querySelectorAll("#filters button").forEach(x=>x.classList.toggle("active",x===btn));
    render();
  }));
  document.getElementById("allFilter").addEventListener("click",()=>{activeConcept=null;render();});
  renderConcepts();
  render();
})();