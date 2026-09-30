/* Passive material parcels for Continuity. These observations NEVER change the fields.
 * A parcel samples the forward-Euler transport/reaction operator in engine.js.
 * A/B -> Q at rate 1; Q -> A and Q -> B at rate J/Q each;
 * Q -> reservoir/new Q at wash rate. Diffusion uses the same 9-point stencil.
 * One exclusive event per DT, so the expectation is the engine's tracer update.
 * A replacement has a NEW identity. Original parcels are never recoloured.
 */
(function(root){'use strict';
const P=typeof module!=='undefined'?require('./engine.js'):root.ContinuityPhysics;
const {W,S,DT}=P;
function rng(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
const moves=[[1,0,4/6],[-1,0,4/6],[0,1,4/6],[0,-1,4/6],[1,1,1/6],[1,-1,1/6],[-1,1,1/6],[-1,-1,1/6]];
class Parcels{
 constructor(model,seed=717171,count=800){
  this.random=rng(seed^0x413ac27);this.items=[];this.nextId=count;this.totalWashed=0;this.originalWashed=0;this.newBindings=0;this.releases=0;this.tick=0;
  const weights=new Float64Array(3*S);let total=0;
  for(let i=0;i<S;i++)for(let state=0;state<3;state++){total+=(state===0?model.a:state===1?model.b:model.q)[i];weights[i*3+state]=total;}
  for(let k=0;k<count;k++){const target=this.random()*total;let l=0,h=weights.length-1;while(l<h){const c=(l+h)>>1;if(weights[c]<target)l=c+1;else h=c;}
   this.items.push({id:k,i:Math.floor(l/3),state:l%3,old:true,dx:this.random()-.5,dy:this.random()-.5,born:0});
  }
 }
 step(model){
  const events=[];this.tick++;
  for(let n=0;n<this.items.length;n++){
   let p=this.items[n];const oldI=p.i,oldState=p.state,active=p.state<2,D=active?.16:2;
   const a=model.a[oldI],b=model.b[oldI],ab=a*b;
   const jOverQ=model.coupling*(4+model.stimulus*model.mask[oldI]+1.8*model.m[oldI])*ab/(1+ab);
   const diffusion=DT*D*20/6,decay=active?DT:0,synthesis=active?0:DT*jOverQ,exchange=active?0:DT*model.wash;
   if(diffusion+decay+2*synthesis+exchange>1+1e-12)throw Error('Parcel probabilities exceed one. Reduce DT, not the outcome.');
   let r=this.random();
   if(r<diffusion){let k=r/(DT*D),move=moves[moves.length-1];for(const v of moves){if(k<v[2]){move=v;break;}k-=v[2];}p.i=((Math.floor(oldI/W)+move[1]+W)%W)*W+(oldI%W+move[0]+W)%W;}
   else {r-=diffusion;
    if(active){if(r<decay){p.state=2;this.releases++;events.push({kind:'release',id:p.id,old:p.old,i:p.i});}}
    else if(r<synthesis){p.state=0;if(!p.old)this.newBindings++;events.push({kind:'bind',id:p.id,old:p.old,i:p.i});}
    else if(r<2*synthesis){p.state=1;if(!p.old)this.newBindings++;events.push({kind:'bind',id:p.id,old:p.old,i:p.i});}
    else if(r<2*synthesis+exchange){
     const removed={...p};p={id:this.nextId++,i:p.i,state:2,old:false,dx:p.dx,dy:p.dy,born:this.tick};this.items[n]=p;this.totalWashed++;if(removed.old)this.originalWashed++;
     events.push({kind:'exchange',id:removed.id,newId:p.id,old:removed.old,i:p.i});
    }
   }
  }
  return events;
 }
 get(id){return this.items.find(p=>p.id===id);}
 stats(){let bound=0,oldBound=0,old=0;for(const p of this.items){if(p.old)old++;if(p.state<2){bound++;if(p.old)oldBound++;}}return{count:this.items.length,bound,oldBound,newBound:bound-oldBound,old,originalWashed:this.originalWashed,newBindings:this.newBindings,releases:this.releases};}
 snapshot(){return this.items.map(p=>({...p}));}
}
const api={Parcels,rng};if(typeof module!=='undefined')module.exports=api;else root.ContinuityParcels=api;
})(typeof globalThis!=='undefined'?globalThis:this);
