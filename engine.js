/* Continuity / local reaction-diffusion model. No target shape or neighbour graph.
 * Eight-neighbour finite-difference diffusion on a periodic 64 x 64 bath.
 * J = c(4 + s + 1.8m) q ab/(1+ab)
 * a'=.16 Lap(a)+J-a; b'=.16 Lap(b)+J-b; q'=2 Lap(q)-2J+a+b.
 * Every reaction and transport conserves a+b+q. m is dimensionless catalytic history.
 */
(function(root){'use strict';
 const W=64,S=W*W,DT=.04;
 const L=new Int32Array(S),R=new Int32Array(S),U=new Int32Array(S),D=new Int32Array(S),UL=new Int32Array(S),UR=new Int32Array(S),DL=new Int32Array(S),DR=new Int32Array(S);
 for(let y=0;y<W;y++)for(let x=0;x<W;x++){const i=y*W+x;L[i]=y*W+(x+W-1)%W;R[i]=y*W+(x+1)%W;U[i]=((y+W-1)%W)*W+x;D[i]=((y+1)%W)*W+x;}
 for(let i=0;i<S;i++){UL[i]=U[L[i]];UR[i]=U[R[i]];DL[i]=D[L[i]];DR[i]=D[R[i]];}
 function random(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
 class Model{
 constructor(seed=717171){
  this.a=new Float64Array(S);this.b=new Float64Array(S);this.q=new Float64Array(S);this.m=new Float64Array(S);
  this.na=new Float64Array(S);this.nb=new Float64Array(S);this.nq=new Float64Array(S);this.nm=new Float64Array(S);
  this.time=0;this.coupling=1;this.wash=0;this.learn=0;this.stimulus=0;this.mask=new Float64Array(S);
  const r=random(seed),spots=[];for(let j=0;j<7;j++)spots.push([25+14*r(),23+17*r()]);
  for(let y=0;y<W;y++)for(let x=0;x<W;x++){
   let env=0;for(const p of spots)env+=Math.exp(-((x-p[0])**2+(y-p[1])**2)/35.28);
   const i=y*W+x;this.a[i]=r()<.3?env/.3:0;this.b[i]=r()<.3?env/.3:0;this.q[i]=.8;
  }
 }
 clone(){const c=Object.create(Model.prototype);for(const k of ['a','b','q','m','mask'])c[k]=this[k].slice();for(const k of ['na','nb','nq','nm'])c[k]=new Float64Array(S);for(const k of ['time','coupling','wash','learn','stimulus'])c[k]=this[k];if(this.oa){for(const k of ['oa','ob','oq'])c[k]=this[k].slice();for(const k of ['noa','nob','noq'])c[k]=new Float64Array(S);}return c;}
 label(){this.oa=this.a.slice();this.ob=this.b.slice();this.oq=this.q.slice();this.noa=new Float64Array(S);this.nob=new Float64Array(S);this.noq=new Float64Array(S);}
 pulse(x=43,y=30){for(let j=0;j<S;j++){const dx=j%W-x,dy=Math.floor(j/W)-y;this.mask[j]=Math.exp(-(dx*dx+dy*dy)/85);}}
 puncture(x=32,y=32,r=7){const hit=[];for(let j=0;j<S;j++){if((j%W-x)**2+(Math.floor(j/W)-y)**2<r*r){hit.push(j);this.q[j]+=this.a[j]+this.b[j];this.a[j]=0;this.b[j]=0;if(this.oa){this.oq[j]+=this.oa[j]+this.ob[j];this.oa[j]=0;this.ob[j]=0;}}}return hit;}
 isolate(which){for(let i=0;i<S;i++){if(which==='a'){this.q[i]+=this.b[i];this.b[i]=0;}else{this.q[i]+=this.a[i];this.a[i]=0;}}}
 step(count=1){
  for(let t=0;t<count;t++){
   const a=this.a,b=this.b,q=this.q,m=this.m,na=this.na,nb=this.nb,nq=this.nq,nm=this.nm;
   const oa=this.oa,ob=this.ob,oq=this.oq,noa=this.noa,nob=this.nob,noq=this.noq;
   for(let i=0;i<S;i++){
    const l=L[i],r=R[i],u=U[i],d=D[i],ul=UL[i],ur=UR[i],dl=DL[i],dr=DR[i],ai=a[i],bi=b[i],qi=q[i],mi=m[i],st=this.stimulus*this.mask[i];
    const ab=ai*bi,J=this.coupling*(4+st+1.8*mi)*qi*ab/(1+ab);
    na[i]=ai+DT*(.16*((4*(a[l]+a[r]+a[u]+a[d])+a[ul]+a[ur]+a[dl]+a[dr]-20*ai)/6)+J-ai);
    nb[i]=bi+DT*(.16*((4*(b[l]+b[r]+b[u]+b[d])+b[ul]+b[ur]+b[dl]+b[dr]-20*bi)/6)+J-bi);
    nq[i]=qi+DT*(2*((4*(q[l]+q[r]+q[u]+q[d])+q[ul]+q[ur]+q[dl]+q[dr]-20*qi)/6)-2*J+ai+bi);
    nm[i]=mi+DT*(.02*((4*(m[l]+m[r]+m[u]+m[d])+m[ul]+m[ur]+m[dl]+m[dr]-20*mi)/6)+this.learn*st*(ai+bi)/(1+ai+bi)*(1-mi)-.0002*mi);
    if(oa){
     const pa=oa[i],pb=ob[i],pq=oq[i],labelled=J*(qi>1e-200?pq/qi:0);
     noa[i]=pa+DT*(.16*((4*(oa[l]+oa[r]+oa[u]+oa[d])+oa[ul]+oa[ur]+oa[dl]+oa[dr]-20*pa)/6)+labelled-pa);
     nob[i]=pb+DT*(.16*((4*(ob[l]+ob[r]+ob[u]+ob[d])+ob[ul]+ob[ur]+ob[dl]+ob[dr]-20*pb)/6)+labelled-pb);
     noq[i]=pq+DT*(2*((4*(oq[l]+oq[r]+oq[u]+oq[d])+oq[ul]+oq[ur]+oq[dl]+oq[dr]-20*pq)/6)-2*labelled+pa+pb-this.wash*pq);
    }
   }
   this.a=na;this.na=a;this.b=nb;this.nb=b;this.q=nq;this.nq=q;this.m=nm;this.nm=m;
   if(oa){this.oa=noa;this.noa=oa;this.ob=nob;this.nob=ob;this.oq=noq;this.noq=oq;}
   this.time+=DT;
  }
 }
 metrics(){let area=0,total=0,active=0,old=0,trace=0,peak=0,min=Infinity;for(let i=0;i<S;i++){const v=this.a[i]+this.b[i];area+=v>1?1:0;active+=v;total+=v+this.q[i];trace+=this.m[i];peak=Math.max(peak,v);min=Math.min(min,this.a[i],this.b[i],this.q[i]);if(this.oa)old+=this.oa[i]+this.ob[i];}return{area,total,active,original:this.oa?old/Math.max(active,1e-300):1,trace,peak,min,time:this.time};}
 components(){const seen=new Uint8Array(S),stack=[],sizes=[];for(let i=0;i<S;i++){if(seen[i]||this.a[i]+this.b[i]<=1)continue;let n=0;seen[i]=1;stack.push(i);while(stack.length){const j=stack.pop();n++;for(const k of [L[j],R[j],U[j],D[j]])if(!seen[k]&&this.a[k]+this.b[k]>1){seen[k]=1;stack.push(k);}}sizes.push(n);}return sizes.sort((a,b)=>b-a);}
 }
 const api={Model,W,S,DT};if(typeof module!=='undefined')module.exports=api;else root.ContinuityPhysics=api;
})(typeof globalThis!=='undefined'?globalThis:this);
