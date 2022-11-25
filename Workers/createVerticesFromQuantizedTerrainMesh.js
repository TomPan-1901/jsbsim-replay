/*! For license information please see createVerticesFromQuantizedTerrainMesh.js.LICENSE.txt */
define(["./AxisAlignedBoundingBox-f07e0e43","./Matrix2-c339372d","./defaultValue-65031fc5","./TerrainEncoding-5ceb0ee9","./IndexDatatype-53de8b23","./ComponentDatatype-1b227f17","./Transforms-a48d25e5","./WebMercatorProjection-b33ee193","./createTaskProcessorWorker","./RuntimeError-23f4777c","./AttributeCompression-9d180a12","./WebGLConstants-f5c279b9","./combine-96aed74b"],(function(e,t,r,n,o,i,a,s,c,d,h,u,l){"use strict";function I(){a.DeveloperError.throwInstantiationError()}Object.defineProperties(I.prototype,{errorEvent:{get:a.DeveloperError.throwInstantiationError},credit:{get:a.DeveloperError.throwInstantiationError},tilingScheme:{get:a.DeveloperError.throwInstantiationError},ready:{get:a.DeveloperError.throwInstantiationError},readyPromise:{get:a.DeveloperError.throwInstantiationError},hasWaterMask:{get:a.DeveloperError.throwInstantiationError},hasVertexNormals:{get:a.DeveloperError.throwInstantiationError},availability:{get:a.DeveloperError.throwInstantiationError}});const g=[];I.getRegularGridIndices=function(e,t){let n=g[e];r.defined(n)||(g[e]=n=[]);let o=n[t];return r.defined(o)||(o=e*t<i.CesiumMath.SIXTY_FOUR_KILOBYTES?n[t]=new Uint16Array((e-1)*(t-1)*6):n[t]=new Uint32Array((e-1)*(t-1)*6),f(e,t,o,0)),o};const m=[];I.getRegularGridIndicesAndEdgeIndices=function(e,t){let n=m[e];r.defined(n)||(m[e]=n=[]);let o=n[t];if(!r.defined(o)){const r=I.getRegularGridIndices(e,t),i=E(e,t),a=i.westIndicesSouthToNorth,s=i.southIndicesEastToWest,c=i.eastIndicesNorthToSouth,d=i.northIndicesWestToEast;o=n[t]={indices:r,westIndicesSouthToNorth:a,southIndicesEastToWest:s,eastIndicesNorthToSouth:c,northIndicesWestToEast:d}}return o};const T=[];function E(e,t){const r=new Array(t),n=new Array(e),o=new Array(t),i=new Array(e);let a;for(a=0;a<e;++a)i[a]=a,n[a]=e*t-1-a;for(a=0;a<t;++a)o[a]=(a+1)*e-1,r[a]=(t-a-1)*e;return{westIndicesSouthToNorth:r,southIndicesEastToWest:n,eastIndicesNorthToSouth:o,northIndicesWestToEast:i}}function f(e,t,r,n){let o=0;for(let i=0;i<t-1;++i){for(let t=0;t<e-1;++t){const t=o,i=t+e,a=i+1,s=t+1;r[n++]=t,r[n++]=i,r[n++]=s,r[n++]=s,r[n++]=i,r[n++]=a,++o}++o}}function p(e,t,r,n){let o=e[0];const i=e.length;for(let a=1;a<i;++a){const i=e[a];r[n++]=o,r[n++]=i,r[n++]=t,r[n++]=t,r[n++]=i,r[n++]=t+1,o=i,++t}return n}I.getRegularGridAndSkirtIndicesAndEdgeIndices=function(e,t){let n=T[e];r.defined(n)||(T[e]=n=[]);let i=n[t];if(!r.defined(i)){const r=e*t,a=(e-1)*(t-1)*6,s=2*e+2*t,c=r+s,d=a+6*Math.max(0,s-4),h=E(e,t),u=h.westIndicesSouthToNorth,l=h.southIndicesEastToWest,g=h.eastIndicesNorthToSouth,m=h.northIndicesWestToEast,T=o.IndexDatatype.createTypedArray(c,d);f(e,t,T,0),I.addSkirtIndices(u,l,g,m,r,T,a),i=n[t]={indices:T,westIndicesSouthToNorth:u,southIndicesEastToWest:l,eastIndicesNorthToSouth:g,northIndicesWestToEast:m,indexCountWithoutSkirts:a}}return i},I.addSkirtIndices=function(e,t,r,n,o,i,a){let s=o;a=p(e,s,i,a),s+=e.length,a=p(t,s,i,a),s+=t.length,a=p(r,s,i,a),s+=r.length,p(n,s,i,a)},I.heightmapTerrainQuality=.25,I.getEstimatedLevelZeroGeometricErrorForAHeightmap=function(e,t,r){return 2*e.maximumRadius*Math.PI*I.heightmapTerrainQuality/(t*r)},I.prototype.requestTileGeometry=a.DeveloperError.throwInstantiationError,I.prototype.getLevelMaximumGeometricError=a.DeveloperError.throwInstantiationError,I.prototype.getTileDataAvailable=a.DeveloperError.throwInstantiationError,I.prototype.loadTileDataAvailability=a.DeveloperError.throwInstantiationError;const y=32767,N=new t.Cartesian3,w=new t.Cartesian3,S=new t.Cartesian3,M=new t.Cartographic,b=new t.Cartesian2;function x(e,r,n,o,a,s,c,d,h){let u=Number.POSITIVE_INFINITY;const l=a.north,I=a.south;let g=a.east;const m=a.west;g<m&&(g+=i.CesiumMath.TWO_PI);const T=e.length;for(let E=0;E<T;++E){const a=e[E],T=n[a],f=o[a];M.longitude=i.CesiumMath.lerp(m,g,f.x),M.latitude=i.CesiumMath.lerp(I,l,f.y),M.height=T-r;const p=s.cartographicToCartesian(M,N);t.Matrix4.multiplyByPoint(c,p,p),t.Cartesian3.minimumByComponent(p,d,d),t.Cartesian3.maximumByComponent(p,h,h),u=Math.min(u,M.height)}return u}function A(e,t,n,o,a,c,d,h,u,l,I,g,m,T){const E=r.defined(d),f=u.north,p=u.south;let y=u.east;const w=u.west;y<w&&(y+=i.CesiumMath.TWO_PI);const S=n.length;for(let r=0;r<S;++r){const u=n[r],S=a[u],x=c[u];M.longitude=i.CesiumMath.lerp(w,y,x.x)+m,M.latitude=i.CesiumMath.lerp(p,f,x.y)+T,M.height=S-l;const A=h.cartographicToCartesian(M,N);if(E){const e=2*u;b.x=d[e],b.y=d[e+1]}let C,W;o.hasWebMercatorT&&(C=(s.WebMercatorProjection.geodeticLatitudeToMercatorAngle(M.latitude)-I)*g),o.hasGeodeticSurfaceNormals&&(W=h.geodeticSurfaceNormal(A)),t=o.encode(e,t,A,x,M.height,b,C,W)}}function C(e,t){let n;return"function"==typeof e.slice&&(n=e.slice(),"function"!=typeof n.sort&&(n=void 0)),r.defined(n)||(n=Array.prototype.slice.call(e)),n.sort(t),n}return c((function(c,d){const h=c.quantizedVertices,u=h.length/3,l=c.octEncodedNormals,g=c.westIndices.length+c.eastIndices.length+c.southIndices.length+c.northIndices.length,m=c.includeWebMercatorT,T=c.exaggeration,E=c.exaggerationRelativeHeight,f=1!==T,p=t.Rectangle.clone(c.rectangle),W=p.west,v=p.south,P=p.east,D=p.north,k=t.Ellipsoid.clone(c.ellipsoid),F=c.minimumHeight,H=c.maximumHeight,_=c.relativeToCenter,G=a.Transforms.eastNorthUpToFixedFrame(_,k),V=t.Matrix4.inverseTransformation(G,new t.Matrix4);let Y,O;m&&(Y=s.WebMercatorProjection.geodeticLatitudeToMercatorAngle(v),O=1/(s.WebMercatorProjection.geodeticLatitudeToMercatorAngle(D)-Y));const B=h.subarray(0,u),R=h.subarray(u,2*u),L=h.subarray(2*u,3*u),j=r.defined(l),U=new Array(u),z=new Array(u),q=new Array(u),Q=m?new Array(u):[],K=f?new Array(u):[],X=w;X.x=Number.POSITIVE_INFINITY,X.y=Number.POSITIVE_INFINITY,X.z=Number.POSITIVE_INFINITY;const Z=S;Z.x=Number.NEGATIVE_INFINITY,Z.y=Number.NEGATIVE_INFINITY,Z.z=Number.NEGATIVE_INFINITY;let J=Number.POSITIVE_INFINITY,$=Number.NEGATIVE_INFINITY,ee=Number.POSITIVE_INFINITY,te=Number.NEGATIVE_INFINITY;for(let e=0;e<u;++e){const r=B[e],n=R[e],o=r/y,a=n/y,c=i.CesiumMath.lerp(F,H,L[e]/y);M.longitude=i.CesiumMath.lerp(W,P,o),M.latitude=i.CesiumMath.lerp(v,D,a),M.height=c,J=Math.min(M.longitude,J),$=Math.max(M.longitude,$),ee=Math.min(M.latitude,ee),te=Math.max(M.latitude,te);const d=k.cartographicToCartesian(M);U[e]=new t.Cartesian2(o,a),z[e]=c,q[e]=d,m&&(Q[e]=(s.WebMercatorProjection.geodeticLatitudeToMercatorAngle(M.latitude)-Y)*O),f&&(K[e]=k.geodeticSurfaceNormal(d)),t.Matrix4.multiplyByPoint(V,d,N),t.Cartesian3.minimumByComponent(N,X,X),t.Cartesian3.maximumByComponent(N,Z,Z)}const re=C(c.westIndices,(function(e,t){return U[e].y-U[t].y})),ne=C(c.eastIndices,(function(e,t){return U[t].y-U[e].y})),oe=C(c.southIndices,(function(e,t){return U[t].x-U[e].x})),ie=C(c.northIndices,(function(e,t){return U[e].x-U[t].x}));let ae;F<0&&(ae=new n.EllipsoidalOccluder(k).computeHorizonCullingPointPossiblyUnderEllipsoid(_,q,F));let se=F;se=Math.min(se,x(c.westIndices,c.westSkirtHeight,z,U,p,k,V,X,Z)),se=Math.min(se,x(c.southIndices,c.southSkirtHeight,z,U,p,k,V,X,Z)),se=Math.min(se,x(c.eastIndices,c.eastSkirtHeight,z,U,p,k,V,X,Z)),se=Math.min(se,x(c.northIndices,c.northSkirtHeight,z,U,p,k,V,X,Z));const ce=new e.AxisAlignedBoundingBox(X,Z,_),de=new n.TerrainEncoding(_,ce,se,H,G,j,m,f,T,E),he=de.stride,ue=new Float32Array(u*he+g*he);let le=0;for(let e=0;e<u;++e){if(j){const t=2*e;b.x=l[t],b.y=l[t+1]}le=de.encode(ue,le,q[e],U[e],z[e],b,Q[e],K[e])}const Ie=Math.max(0,2*(g-4)),ge=c.indices.length+3*Ie,me=o.IndexDatatype.createTypedArray(u+g,ge);me.set(c.indices,0);const Te=1e-4,Ee=($-J)*Te,fe=(te-ee)*Te,pe=-Ee,ye=Ee,Ne=fe,we=-fe;let Se=u*he;return A(ue,Se,re,de,z,U,l,k,p,c.westSkirtHeight,Y,O,pe,0),Se+=c.westIndices.length*he,A(ue,Se,oe,de,z,U,l,k,p,c.southSkirtHeight,Y,O,0,we),Se+=c.southIndices.length*he,A(ue,Se,ne,de,z,U,l,k,p,c.eastSkirtHeight,Y,O,ye,0),Se+=c.eastIndices.length*he,A(ue,Se,ie,de,z,U,l,k,p,c.northSkirtHeight,Y,O,0,Ne),I.addSkirtIndices(re,oe,ne,ie,u,me,c.indices.length),d.push(ue.buffer,me.buffer),{vertices:ue.buffer,indices:me.buffer,westIndicesSouthToNorth:re,southIndicesEastToWest:oe,eastIndicesNorthToSouth:ne,northIndicesWestToEast:ie,vertexStride:he,center:_,minimumHeight:F,maximumHeight:H,occludeePointInScaledSpace:ae,encoding:de,indexCountWithoutSkirts:c.indices.length}}))}));