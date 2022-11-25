import BoundingSphere from"../../Core/BoundingSphere.js";import Cartesian3 from"../../Core/Cartesian3.js";import Cartographic from"../../Core/Cartographic.js";import Clock from"../../Core/Clock.js";import defaultValue from"../../Core/defaultValue.js";import defined from"../../Core/defined.js";import destroyObject from"../../Core/destroyObject.js";import DeveloperError from"../../Core/DeveloperError.js";import Event from"../../Core/Event.js";import EventHelper from"../../Core/EventHelper.js";import HeadingPitchRange from"../../Core/HeadingPitchRange.js";import Matrix4 from"../../Core/Matrix4.js";import ScreenSpaceEventType from"../../Core/ScreenSpaceEventType.js";import BoundingSphereState from"../../DataSources/BoundingSphereState.js";import ConstantPositionProperty from"../../DataSources/ConstantPositionProperty.js";import DataSourceCollection from"../../DataSources/DataSourceCollection.js";import DataSourceDisplay from"../../DataSources/DataSourceDisplay.js";import Entity from"../../DataSources/Entity.js";import EntityView from"../../DataSources/EntityView.js";import Property from"../../DataSources/Property.js";import Cesium3DTileset from"../../Scene/Cesium3DTileset.js";import computeFlyToLocationForRectangle from"../../Scene/computeFlyToLocationForRectangle.js";import ImageryLayer from"../../Scene/ImageryLayer.js";import SceneMode from"../../Scene/SceneMode.js";import TimeDynamicPointCloud from"../../Scene/TimeDynamicPointCloud.js";import knockout from"../../ThirdParty/knockout.js";import Animation from"../Animation/Animation.js";import AnimationViewModel from"../Animation/AnimationViewModel.js";import BaseLayerPicker from"../BaseLayerPicker/BaseLayerPicker.js";import createDefaultImageryProviderViewModels from"../BaseLayerPicker/createDefaultImageryProviderViewModels.js";import createDefaultTerrainProviderViewModels from"../BaseLayerPicker/createDefaultTerrainProviderViewModels.js";import CesiumWidget from"../CesiumWidget/CesiumWidget.js";import ClockViewModel from"../ClockViewModel.js";import FullscreenButton from"../FullscreenButton/FullscreenButton.js";import Geocoder from"../Geocoder/Geocoder.js";import getElement from"../getElement.js";import HomeButton from"../HomeButton/HomeButton.js";import InfoBox from"../InfoBox/InfoBox.js";import NavigationHelpButton from"../NavigationHelpButton/NavigationHelpButton.js";import ProjectionPicker from"../ProjectionPicker/ProjectionPicker.js";import SceneModePicker from"../SceneModePicker/SceneModePicker.js";import SelectionIndicator from"../SelectionIndicator/SelectionIndicator.js";import subscribeAndEvaluate from"../subscribeAndEvaluate.js";import Timeline from"../Timeline/Timeline.js";import VRButton from"../VRButton/VRButton.js";import Cesium3DTileFeature from"../../Scene/Cesium3DTileFeature.js";import JulianDate from"../../Core/JulianDate.js";import CesiumMath from"../../Core/Math.js";const boundingSphereScratch=new BoundingSphere;function onTimelineScrubfunction(e){const t=e.clock;t.currentTime=e.timeJulian,t.shouldAnimate=!1}function getCesium3DTileFeatureDescription(e){const t=e.getPropertyIds();let i="";return t.forEach((function(t){const o=e.getProperty(t);defined(o)&&(i+=`<tr><th>${t}</th><td>${o}</td></tr>`)})),i.length>0&&(i=`<table class="cesium-infoBox-defaultTable"><tbody>${i}</tbody></table>`),i}function getCesium3DTileFeatureName(e){let t;const i=[],o=e.getPropertyIds();for(t=0;t<o.length;t++){const n=o[t];/^name$/i.test(n)?i[0]=e.getProperty(n):/name/i.test(n)?i[1]=e.getProperty(n):/^title$/i.test(n)?i[2]=e.getProperty(n):/^(id|identifier)$/i.test(n)?i[3]=e.getProperty(n):/element/i.test(n)?i[4]=e.getProperty(n):/(id|identifier)$/i.test(n)&&(i[5]=e.getProperty(n))}const n=i.length;for(t=0;t<n;t++){const e=i[t];if(defined(e)&&""!==e)return e}return"Unnamed Feature"}function pickEntity(e,t){const i=e.scene.pick(t.position);if(defined(i)){const e=defaultValue(i.id,i.primitive.id);if(e instanceof Entity)return e;if(i instanceof Cesium3DTileFeature)return new Entity({name:getCesium3DTileFeatureName(i),description:getCesium3DTileFeatureDescription(i),feature:i})}if(defined(e.scene.globe))return pickImageryLayerFeature(e,t.position)}const scratchStopTime=new JulianDate;function trackDataSourceClock(e,t,i){if(defined(i)){const o=i.clock;if(defined(o)&&(o.getValue(t),defined(e))){const t=o.startTime;let i=o.stopTime;JulianDate.equals(t,i)&&(i=JulianDate.addSeconds(t,CesiumMath.EPSILON2,scratchStopTime)),e.updateFromClock(),e.zoomTo(t,i)}}}const cartesian3Scratch=new Cartesian3;function pickImageryLayerFeature(e,t){const i=e.scene,o=i.camera.getPickRay(t),n=i.imageryLayers.pickImageryLayerFeatures(o,i);if(!defined(n))return;const r=new Entity({id:"Loading...",description:"Loading feature information..."});return n.then((function(t){if(e.selectedEntity!==r)return;if(!defined(t)||0===t.length)return void(e.selectedEntity=createNoFeaturesEntity());const i=t[0],o=new Entity({id:i.name,description:i.description});if(defined(i.position)){const t=e.scene.globe.ellipsoid.cartographicToCartesian(i.position,cartesian3Scratch);o.position=new ConstantPositionProperty(t)}e.selectedEntity=o}),(function(){e.selectedEntity===r&&(e.selectedEntity=createNoFeaturesEntity())})),r}function createNoFeaturesEntity(){return new Entity({id:"None",description:"No features found."})}function enableVRUI(e,t){const i=e._geocoder,o=e._homeButton,n=e._sceneModePicker,r=e._projectionPicker,s=e._baseLayerPicker,a=e._animation,c=e._timeline,d=e._fullscreenButton,l=e._infoBox,u=e._selectionIndicator,m=t?"hidden":"visible";if(defined(i)&&(i.container.style.visibility=m),defined(o)&&(o.container.style.visibility=m),defined(n)&&(n.container.style.visibility=m),defined(r)&&(r.container.style.visibility=m),defined(s)&&(s.container.style.visibility=m),defined(a)&&(a.container.style.visibility=m),defined(c)&&(c.container.style.visibility=m),defined(d)&&d.viewModel.isFullscreenEnabled&&(d.container.style.visibility=m),defined(l)&&(l.container.style.visibility=m),defined(u)&&(u.container.style.visibility=m),e._container){const i=t||!defined(d)?0:d.container.clientWidth;e._vrButton.container.style.right=`${i}px`,e.forceResize()}}function Viewer(e,t){if(!defined(e))throw new DeveloperError("container is required.");e=getElement(e),t=defaultValue(t,defaultValue.EMPTY_OBJECT);const i=(!defined(t.globe)||!1!==t.globe)&&(!defined(t.baseLayerPicker)||!1!==t.baseLayerPicker);if(!i&&defined(t.selectedImageryProviderViewModel))throw new DeveloperError("options.selectedImageryProviderViewModel is not available when not using the BaseLayerPicker widget. Either specify options.imageryProvider instead or set options.baseLayerPicker to true.");if(!i&&defined(t.selectedTerrainProviderViewModel))throw new DeveloperError("options.selectedTerrainProviderViewModel is not available when not using the BaseLayerPicker widget. Either specify options.terrainProvider instead or set options.baseLayerPicker to true.");const o=this,n=document.createElement("div");n.className="cesium-viewer",e.appendChild(n);const r=document.createElement("div");r.className="cesium-viewer-cesiumWidgetContainer",n.appendChild(r);const s=document.createElement("div");s.className="cesium-viewer-bottom",n.appendChild(s);const a=defaultValue(t.scene3DOnly,!1);let c,d,l=!1;defined(t.clockViewModel)?(d=t.clockViewModel,c=d.clock):(c=new Clock,d=new ClockViewModel(c),l=!0),defined(t.shouldAnimate)&&(c.shouldAnimate=t.shouldAnimate);const u=new CesiumWidget(r,{imageryProvider:!i&&!defined(t.imageryProvider)&&void 0,clock:c,skyBox:t.skyBox,skyAtmosphere:t.skyAtmosphere,sceneMode:t.sceneMode,mapProjection:t.mapProjection,globe:t.globe,orderIndependentTranslucency:t.orderIndependentTranslucency,contextOptions:t.contextOptions,useDefaultRenderLoop:t.useDefaultRenderLoop,targetFrameRate:t.targetFrameRate,showRenderLoopErrors:t.showRenderLoopErrors,useBrowserRecommendedResolution:t.useBrowserRecommendedResolution,creditContainer:defined(t.creditContainer)?t.creditContainer:s,creditViewport:t.creditViewport,scene3DOnly:a,shadows:t.shadows,terrainShadows:t.terrainShadows,mapMode2D:t.mapMode2D,blurActiveElementOnCanvasFocus:t.blurActiveElementOnCanvasFocus,requestRenderMode:t.requestRenderMode,maximumRenderTimeChange:t.maximumRenderTimeChange,depthPlaneEllipsoidOffset:t.depthPlaneEllipsoidOffset,msaaSamples:t.msaaSamples});let m=t.dataSources,h=!1;defined(m)||(m=new DataSourceCollection,h=!0);const f=u.scene,p=new DataSourceDisplay({scene:f,dataSourceCollection:m}),y=new EventHelper;let g,_;if(y.add(c.onTick,Viewer.prototype._onTick,this),y.add(f.morphStart,Viewer.prototype._clearTrackedObject,this),!defined(t.selectionIndicator)||!1!==t.selectionIndicator){const e=document.createElement("div");e.className="cesium-viewer-selectionIndicatorContainer",n.appendChild(e),g=new SelectionIndicator(e,f)}if(!defined(t.infoBox)||!1!==t.infoBox){const e=document.createElement("div");e.className="cesium-viewer-infoBoxContainer",n.appendChild(e),_=new InfoBox(e);const t=_.viewModel;y.add(t.cameraClicked,Viewer.prototype._onInfoBoxCameraClicked,this),y.add(t.closeClicked,Viewer.prototype._onInfoBoxClockClicked,this)}const S=document.createElement("div");let v,w,k,E,C,T,P,D,B,b,V,M,I,j,L;if(S.className="cesium-viewer-toolbar",n.appendChild(S),!defined(t.geocoder)||!1!==t.geocoder){const e=document.createElement("div");let i;e.className="cesium-viewer-geocoderContainer",S.appendChild(e),defined(t.geocoder)&&"boolean"!==typeof t.geocoder&&(i=Array.isArray(t.geocoder)?t.geocoder:[t.geocoder]),v=new Geocoder({container:e,geocoderServices:i,scene:f}),y.add(v.viewModel.search.beforeExecute,Viewer.prototype._clearObjects,this)}if(defined(t.homeButton)&&!1===t.homeButton||(w=new HomeButton(S,f),defined(v)&&y.add(w.viewModel.command.afterExecute,(function(){const e=v.viewModel;e.searchText="",e.isSearchInProgress&&e.search()})),y.add(w.viewModel.command.beforeExecute,Viewer.prototype._clearTrackedObject,this)),!0===t.sceneModePicker&&a)throw new DeveloperError("options.sceneModePicker is not available when options.scene3DOnly is set to true.");if(a||defined(t.sceneModePicker)&&!1===t.sceneModePicker||(k=new SceneModePicker(S,f)),t.projectionPicker&&(E=new ProjectionPicker(S,f)),i){const e=defaultValue(t.imageryProviderViewModels,createDefaultImageryProviderViewModels()),i=defaultValue(t.terrainProviderViewModels,createDefaultTerrainProviderViewModels());C=new BaseLayerPicker(S,{globe:f.globe,imageryProviderViewModels:e,selectedImageryProviderViewModel:t.selectedImageryProviderViewModel,terrainProviderViewModels:i,selectedTerrainProviderViewModel:t.selectedTerrainProviderViewModel});T=S.getElementsByClassName("cesium-baseLayerPicker-dropDown")[0]}if(defined(t.imageryProvider)&&!1!==t.imageryProvider&&(i&&(C.viewModel.selectedImagery=void 0),f.imageryLayers.removeAll(),f.imageryLayers.addImageryProvider(t.imageryProvider)),defined(t.terrainProvider)&&(i&&(C.viewModel.selectedTerrain=void 0),f.terrainProvider=t.terrainProvider),!defined(t.navigationHelpButton)||!1!==t.navigationHelpButton){let e=!0;try{if(defined(window.localStorage)){const t=window.localStorage.getItem("cesium-hasSeenNavHelp");defined(t)&&Boolean(t)?e=!1:window.localStorage.setItem("cesium-hasSeenNavHelp","true")}}catch(R){}P=new NavigationHelpButton({container:S,instructionsInitiallyVisible:defaultValue(t.navigationInstructionsInitiallyVisible,e)})}if(!defined(t.animation)||!1!==t.animation){const e=document.createElement("div");e.className="cesium-viewer-animationContainer",n.appendChild(e),D=new Animation(e,new AnimationViewModel(d))}if(!defined(t.timeline)||!1!==t.timeline){const e=document.createElement("div");e.className="cesium-viewer-timelineContainer",n.appendChild(e),B=new Timeline(e,c),B.addEventListener("settime",onTimelineScrubfunction,!1),B.zoomTo(c.startTime,c.stopTime)}if(defined(t.fullscreenButton)&&!1===t.fullscreenButton||(M=document.createElement("div"),M.className="cesium-viewer-fullscreenContainer",n.appendChild(M),b=new FullscreenButton(M,t.fullscreenElement),V=subscribeAndEvaluate(b.viewModel,"isFullscreenEnabled",(function(e){M.style.display=e?"block":"none",defined(B)&&(B.container.style.right=`${M.clientWidth}px`,B.resize())}))),t.vrButton){const e=document.createElement("div");e.className="cesium-viewer-vrContainer",n.appendChild(e),I=new VRButton(e,f,t.fullScreenElement),j=subscribeAndEvaluate(I.viewModel,"isVREnabled",(function(t){e.style.display=t?"block":"none",defined(b)&&(e.style.right=`${M.clientWidth}px`),defined(B)&&(B.container.style.right=`${e.clientWidth}px`,B.resize())})),L=subscribeAndEvaluate(I.viewModel,"isVRMode",(function(e){enableVRUI(o,e)}))}this._baseLayerPickerDropDown=T,this._fullscreenSubscription=V,this._vrSubscription=j,this._vrModeSubscription=L,this._dataSourceChangedListeners={},this._automaticallyTrackDataSourceClocks=defaultValue(t.automaticallyTrackDataSourceClocks,!0),this._container=e,this._bottomContainer=s,this._element=n,this._cesiumWidget=u,this._selectionIndicator=g,this._infoBox=_,this._dataSourceCollection=m,this._destroyDataSourceCollection=h,this._dataSourceDisplay=p,this._clockViewModel=d,this._destroyClockViewModel=l,this._toolbar=S,this._homeButton=w,this._sceneModePicker=k,this._projectionPicker=E,this._baseLayerPicker=C,this._navigationHelpButton=P,this._animation=D,this._timeline=B,this._fullscreenButton=b,this._vrButton=I,this._geocoder=v,this._eventHelper=y,this._lastWidth=0,this._lastHeight=0,this._allowDataSourcesToSuspendAnimation=!0,this._entityView=void 0,this._enableInfoOrSelection=defined(_)||defined(g),this._clockTrackedDataSource=void 0,this._trackedEntity=void 0,this._needTrackedEntityUpdate=!1,this._selectedEntity=void 0,this._zoomIsFlight=!1,this._zoomTarget=void 0,this._zoomPromise=void 0,this._zoomOptions=void 0,this._selectedEntityChanged=new Event,this._trackedEntityChanged=new Event,knockout.track(this,["_trackedEntity","_selectedEntity","_clockTrackedDataSource"]),y.add(m.dataSourceAdded,Viewer.prototype._onDataSourceAdded,this),y.add(m.dataSourceRemoved,Viewer.prototype._onDataSourceRemoved,this),y.add(f.postUpdate,Viewer.prototype.resize,this),y.add(f.postRender,Viewer.prototype._postRender,this);const x=m.length;for(let A=0;A<x;A++)this._dataSourceAdded(m,m.get(A));this._dataSourceAdded(void 0,p.defaultDataSource),y.add(m.dataSourceAdded,Viewer.prototype._dataSourceAdded,this),y.add(m.dataSourceRemoved,Viewer.prototype._dataSourceRemoved,this),u.screenSpaceEventHandler.setInputAction((function(e){o.selectedEntity=pickEntity(o,e)}),ScreenSpaceEventType.LEFT_CLICK),u.screenSpaceEventHandler.setInputAction((function(e){const t=pickEntity(o,e);defined(t)?Property.getValueOrUndefined(t.position,o.clock.currentTime)?o.trackedEntity=t:o.zoomTo(t):defined(o.trackedEntity)&&(o.trackedEntity=void 0)}),ScreenSpaceEventType.LEFT_DOUBLE_CLICK)}function zoomToOrFly(e,t,i,o){if(!defined(t))throw new DeveloperError("zoomTarget is required.");cancelZoom(e);const n=new Promise((t=>{e._completeZoom=function(e){t(e)}}));return e._zoomPromise=n,e._zoomIsFlight=o,e._zoomOptions=i,Promise.resolve(t).then((function(t){if(e._zoomPromise===n)if(t instanceof ImageryLayer)t.getViewableRectangle().then((function(t){return computeFlyToLocationForRectangle(t,e.scene)})).then((function(t){e._zoomPromise===n&&(e._zoomTarget=t)}));else if(t instanceof Cesium3DTileset)e._zoomTarget=t;else if(t instanceof TimeDynamicPointCloud)e._zoomTarget=t;else if(t.isLoading&&defined(t.loadingEvent)){const i=t.loadingEvent.addEventListener((function(){i(),e._zoomPromise===n&&(e._zoomTarget=t.entities.values.slice(0))}))}else Array.isArray(t)?e._zoomTarget=t.slice(0):(t=defaultValue(t.values,t),defined(t.entities)&&(t=t.entities.values),Array.isArray(t)?e._zoomTarget=t.slice(0):e._zoomTarget=[t])})),e.scene.requestRender(),n}function clearZoom(e){e._zoomPromise=void 0,e._zoomTarget=void 0,e._zoomOptions=void 0}function cancelZoom(e){const t=e._zoomPromise;defined(t)&&(clearZoom(e),e._completeZoom(!1))}function updateZoomTarget(e){const t=e._zoomTarget;if(!defined(t)||e.scene.mode===SceneMode.MORPHING)return;const i=e.scene,o=i.camera,n=defaultValue(e._zoomOptions,{});let r;if(t instanceof Cesium3DTileset)return t.readyPromise.then((function(){const i=t.boundingSphere;defined(n.offset)||(n.offset=new HeadingPitchRange(0,-.5,i.radius)),r={offset:n.offset,duration:n.duration,maximumHeight:n.maximumHeight,complete:function(){e._completeZoom(!0)},cancel:function(){e._completeZoom(!1)}},e._zoomIsFlight?o.flyToBoundingSphere(t.boundingSphere,r):(o.viewBoundingSphere(i,n.offset),o.lookAtTransform(Matrix4.IDENTITY),e._completeZoom(!0)),clearZoom(e)})).catch((()=>{cancelZoom(e)}));if(t instanceof TimeDynamicPointCloud)return t.readyPromise.then((function(){const i=t.boundingSphere;defined(n.offset)||(n.offset=new HeadingPitchRange(0,-.5,i.radius)),r={offset:n.offset,duration:n.duration,maximumHeight:n.maximumHeight,complete:function(){e._completeZoom(!0)},cancel:function(){e._completeZoom(!1)}},e._zoomIsFlight?o.flyToBoundingSphere(i,r):(o.viewBoundingSphere(i,n.offset),o.lookAtTransform(Matrix4.IDENTITY),e._completeZoom(!0)),clearZoom(e)}));if(t instanceof Cartographic)return r={destination:i.mapProjection.ellipsoid.cartographicToCartesian(t),duration:n.duration,maximumHeight:n.maximumHeight,complete:function(){e._completeZoom(!0)},cancel:function(){e._completeZoom(!1)}},e._zoomIsFlight?o.flyTo(r):(o.setView(r),e._completeZoom(!0)),void clearZoom(e);const s=t,a=[];for(let d=0,l=s.length;d<l;d++){const t=e._dataSourceDisplay.getBoundingSphere(s[d],!1,boundingSphereScratch);if(t===BoundingSphereState.PENDING)return;t!==BoundingSphereState.FAILED&&a.push(BoundingSphere.clone(boundingSphereScratch))}if(0===a.length)return void cancelZoom(e);e.trackedEntity=void 0;const c=BoundingSphere.fromBoundingSpheres(a);e._zoomIsFlight?(clearZoom(e),o.flyToBoundingSphere(c,{duration:n.duration,maximumHeight:n.maximumHeight,complete:function(){e._completeZoom(!0)},cancel:function(){e._completeZoom(!1)},offset:n.offset})):(o.viewBoundingSphere(c,n.offset),o.lookAtTransform(Matrix4.IDENTITY),clearZoom(e),e._completeZoom(!0))}function updateTrackedEntity(e){if(!e._needTrackedEntityUpdate)return;const t=e._trackedEntity,i=e.clock.currentTime,o=Property.getValueOrUndefined(t.position,i);if(!defined(o))return;const n=e.scene,r=e._dataSourceDisplay.getBoundingSphere(t,!1,boundingSphereScratch);if(r===BoundingSphereState.PENDING)return;const s=n.mode;s!==SceneMode.COLUMBUS_VIEW&&s!==SceneMode.SCENE2D||(n.screenSpaceCameraController.enableTranslate=!1),s!==SceneMode.COLUMBUS_VIEW&&s!==SceneMode.SCENE3D||(n.screenSpaceCameraController.enableTilt=!1);const a=r!==BoundingSphereState.FAILED?boundingSphereScratch:void 0;e._entityView=new EntityView(t,n,n.mapProjection.ellipsoid),e._entityView.update(i,a),e._needTrackedEntityUpdate=!1}Object.defineProperties(Viewer.prototype,{container:{get:function(){return this._container}},bottomContainer:{get:function(){return this._bottomContainer}},cesiumWidget:{get:function(){return this._cesiumWidget}},selectionIndicator:{get:function(){return this._selectionIndicator}},infoBox:{get:function(){return this._infoBox}},geocoder:{get:function(){return this._geocoder}},homeButton:{get:function(){return this._homeButton}},sceneModePicker:{get:function(){return this._sceneModePicker}},projectionPicker:{get:function(){return this._projectionPicker}},baseLayerPicker:{get:function(){return this._baseLayerPicker}},navigationHelpButton:{get:function(){return this._navigationHelpButton}},animation:{get:function(){return this._animation}},timeline:{get:function(){return this._timeline}},fullscreenButton:{get:function(){return this._fullscreenButton}},vrButton:{get:function(){return this._vrButton}},dataSourceDisplay:{get:function(){return this._dataSourceDisplay}},entities:{get:function(){return this._dataSourceDisplay.defaultDataSource.entities}},dataSources:{get:function(){return this._dataSourceCollection}},canvas:{get:function(){return this._cesiumWidget.canvas}},scene:{get:function(){return this._cesiumWidget.scene}},shadows:{get:function(){return this.scene.shadowMap.enabled},set:function(e){this.scene.shadowMap.enabled=e}},terrainShadows:{get:function(){return this.scene.globe.shadows},set:function(e){this.scene.globe.shadows=e}},shadowMap:{get:function(){return this.scene.shadowMap}},imageryLayers:{get:function(){return this.scene.imageryLayers}},terrainProvider:{get:function(){return this.scene.terrainProvider},set:function(e){this.scene.terrainProvider=e}},camera:{get:function(){return this.scene.camera}},postProcessStages:{get:function(){return this.scene.postProcessStages}},clock:{get:function(){return this._clockViewModel.clock}},clockViewModel:{get:function(){return this._clockViewModel}},screenSpaceEventHandler:{get:function(){return this._cesiumWidget.screenSpaceEventHandler}},targetFrameRate:{get:function(){return this._cesiumWidget.targetFrameRate},set:function(e){this._cesiumWidget.targetFrameRate=e}},useDefaultRenderLoop:{get:function(){return this._cesiumWidget.useDefaultRenderLoop},set:function(e){this._cesiumWidget.useDefaultRenderLoop=e}},resolutionScale:{get:function(){return this._cesiumWidget.resolutionScale},set:function(e){this._cesiumWidget.resolutionScale=e}},useBrowserRecommendedResolution:{get:function(){return this._cesiumWidget.useBrowserRecommendedResolution},set:function(e){this._cesiumWidget.useBrowserRecommendedResolution=e}},allowDataSourcesToSuspendAnimation:{get:function(){return this._allowDataSourcesToSuspendAnimation},set:function(e){this._allowDataSourcesToSuspendAnimation=e}},trackedEntity:{get:function(){return this._trackedEntity},set:function(e){if(this._trackedEntity!==e){this._trackedEntity=e,cancelZoom(this);const t=this.scene,i=t.mode;defined(e)&&defined(e.position)?this._needTrackedEntityUpdate=!0:(this._needTrackedEntityUpdate=!1,i!==SceneMode.COLUMBUS_VIEW&&i!==SceneMode.SCENE2D||(t.screenSpaceCameraController.enableTranslate=!0),i!==SceneMode.COLUMBUS_VIEW&&i!==SceneMode.SCENE3D||(t.screenSpaceCameraController.enableTilt=!0),this._entityView=void 0,this.camera.lookAtTransform(Matrix4.IDENTITY)),this._trackedEntityChanged.raiseEvent(e),this.scene.requestRender()}}},selectedEntity:{get:function(){return this._selectedEntity},set:function(e){if(this._selectedEntity!==e){this._selectedEntity=e;const t=defined(this._selectionIndicator)?this._selectionIndicator.viewModel:void 0;defined(e)?defined(t)&&t.animateAppear():defined(t)&&t.animateDepart(),this._selectedEntityChanged.raiseEvent(e)}}},selectedEntityChanged:{get:function(){return this._selectedEntityChanged}},trackedEntityChanged:{get:function(){return this._trackedEntityChanged}},clockTrackedDataSource:{get:function(){return this._clockTrackedDataSource},set:function(e){this._clockTrackedDataSource!==e&&(this._clockTrackedDataSource=e,trackDataSourceClock(this._timeline,this.clock,e))}}}),Viewer.prototype.extend=function(e,t){if(!defined(e))throw new DeveloperError("mixin is required.");e(this,t)},Viewer.prototype.resize=function(){const e=this._cesiumWidget,t=this._container,i=t.clientWidth,o=t.clientHeight,n=defined(this._animation),r=defined(this._timeline);if(e.resize(),i===this._lastWidth&&o===this._lastHeight)return;const s=o-125,a=this._baseLayerPickerDropDown;if(defined(a)&&(a.style.maxHeight=`${s}px`),defined(this._geocoder)){this._geocoder.searchSuggestionsContainer.style.maxHeight=`${s}px`}defined(this._infoBox)&&(this._infoBox.viewModel.maxHeight=s);const c=this._timeline;let d,l=0,u=0,m=0;if(n&&"hidden"!==window.getComputedStyle(this._animation.container).visibility){const e=this._lastWidth;d=this._animation.container,i>900?(l=169,e<=900&&(d.style.width="169px",d.style.height="112px",this._animation.resize())):i>=600?(l=136,(e<600||e>900)&&(d.style.width="136px",d.style.height="90px",this._animation.resize())):(l=106,(e>600||0===e)&&(d.style.width="106px",d.style.height="70px",this._animation.resize())),u=l+5}if(r&&"hidden"!==window.getComputedStyle(this._timeline.container).visibility){const e=this._fullscreenButton,t=this._vrButton,i=c.container,o=i.style;m=i.clientHeight+3,o.left=`${l}px`;let n=0;defined(e)&&(n+=e.container.clientWidth),defined(t)&&(n+=t.container.clientWidth),o.right=`${n}px`,c.resize()}this._bottomContainer.style.left=`${u}px`,this._bottomContainer.style.bottom=`${m}px`,this._lastWidth=i,this._lastHeight=o},Viewer.prototype.forceResize=function(){this._lastWidth=0,this.resize()},Viewer.prototype.render=function(){this._cesiumWidget.render()},Viewer.prototype.isDestroyed=function(){return!1},Viewer.prototype.destroy=function(){let e;this.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK),this.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);const t=this.dataSources,i=t.length;for(e=0;e<i;e++)this._dataSourceRemoved(t,t.get(e));return this._dataSourceRemoved(void 0,this._dataSourceDisplay.defaultDataSource),this._container.removeChild(this._element),this._element.removeChild(this._toolbar),this._eventHelper.removeAll(),defined(this._geocoder)&&(this._geocoder=this._geocoder.destroy()),defined(this._homeButton)&&(this._homeButton=this._homeButton.destroy()),defined(this._sceneModePicker)&&(this._sceneModePicker=this._sceneModePicker.destroy()),defined(this._projectionPicker)&&(this._projectionPicker=this._projectionPicker.destroy()),defined(this._baseLayerPicker)&&(this._baseLayerPicker=this._baseLayerPicker.destroy()),defined(this._animation)&&(this._element.removeChild(this._animation.container),this._animation=this._animation.destroy()),defined(this._timeline)&&(this._timeline.removeEventListener("settime",onTimelineScrubfunction,!1),this._element.removeChild(this._timeline.container),this._timeline=this._timeline.destroy()),defined(this._fullscreenButton)&&(this._fullscreenSubscription.dispose(),this._element.removeChild(this._fullscreenButton.container),this._fullscreenButton=this._fullscreenButton.destroy()),defined(this._vrButton)&&(this._vrSubscription.dispose(),this._vrModeSubscription.dispose(),this._element.removeChild(this._vrButton.container),this._vrButton=this._vrButton.destroy()),defined(this._infoBox)&&(this._element.removeChild(this._infoBox.container),this._infoBox=this._infoBox.destroy()),defined(this._selectionIndicator)&&(this._element.removeChild(this._selectionIndicator.container),this._selectionIndicator=this._selectionIndicator.destroy()),this._destroyClockViewModel&&(this._clockViewModel=this._clockViewModel.destroy()),this._dataSourceDisplay=this._dataSourceDisplay.destroy(),this._cesiumWidget=this._cesiumWidget.destroy(),this._destroyDataSourceCollection&&(this._dataSourceCollection=this._dataSourceCollection.destroy()),destroyObject(this)},Viewer.prototype._dataSourceAdded=function(e,t){t.entities.collectionChanged.addEventListener(Viewer.prototype._onEntityCollectionChanged,this)},Viewer.prototype._dataSourceRemoved=function(e,t){const i=t.entities;i.collectionChanged.removeEventListener(Viewer.prototype._onEntityCollectionChanged,this),defined(this.trackedEntity)&&i.getById(this.trackedEntity.id)===this.trackedEntity&&(this.trackedEntity=void 0),defined(this.selectedEntity)&&i.getById(this.selectedEntity.id)===this.selectedEntity&&(this.selectedEntity=void 0)},Viewer.prototype._onTick=function(e){const t=e.currentTime,i=this._dataSourceDisplay.update(t);this._allowDataSourcesToSuspendAnimation&&(this._clockViewModel.canAnimate=i);const o=this._entityView;if(defined(o)){const e=this._trackedEntity;this._dataSourceDisplay.getBoundingSphere(e,!1,boundingSphereScratch)===BoundingSphereState.DONE&&o.update(t,boundingSphereScratch)}let n,r=!1;const s=this.selectedEntity,a=defined(s)&&this._enableInfoOrSelection;if(a&&s.isShowing&&s.isAvailable(t)){this._dataSourceDisplay.getBoundingSphere(s,!0,boundingSphereScratch)!==BoundingSphereState.FAILED?n=boundingSphereScratch.center:defined(s.position)&&(n=s.position.getValue(t,n)),r=defined(n)}const c=defined(this._selectionIndicator)?this._selectionIndicator.viewModel:void 0;defined(c)&&(c.position=Cartesian3.clone(n,c.position),c.showSelection=a&&r,c.update());const d=defined(this._infoBox)?this._infoBox.viewModel:void 0;defined(d)&&(d.showInfo=a,d.enableCamera=r,d.isCameraTracking=this.trackedEntity===this.selectedEntity,a?(d.titleText=defaultValue(s.name,s.id),d.description=Property.getValueOrDefault(s.description,t,"")):(d.titleText="",d.description=""))},Viewer.prototype._onEntityCollectionChanged=function(e,t,i){const o=i.length;for(let n=0;n<o;n++){const e=i[n];this.trackedEntity===e&&(this.trackedEntity=void 0),this.selectedEntity===e&&(this.selectedEntity=void 0)}},Viewer.prototype._onInfoBoxCameraClicked=function(e){if(e.isCameraTracking&&this.trackedEntity===this.selectedEntity)this.trackedEntity=void 0;else{const e=this.selectedEntity.position;defined(e)?this.trackedEntity=this.selectedEntity:this.zoomTo(this.selectedEntity)}},Viewer.prototype._clearTrackedObject=function(){this.trackedEntity=void 0},Viewer.prototype._onInfoBoxClockClicked=function(e){this.selectedEntity=void 0},Viewer.prototype._clearObjects=function(){this.trackedEntity=void 0,this.selectedEntity=void 0},Viewer.prototype._onDataSourceChanged=function(e){this.clockTrackedDataSource===e&&trackDataSourceClock(this.timeline,this.clock,e)},Viewer.prototype._onDataSourceAdded=function(e,t){this._automaticallyTrackDataSourceClocks&&(this.clockTrackedDataSource=t);const i=t.entities.id,o=this._eventHelper.add(t.changedEvent,Viewer.prototype._onDataSourceChanged,this);this._dataSourceChangedListeners[i]=o},Viewer.prototype._onDataSourceRemoved=function(e,t){const i=this.clockTrackedDataSource===t,o=t.entities.id;if(this._dataSourceChangedListeners[o](),this._dataSourceChangedListeners[o]=void 0,i){const t=e.length;this._automaticallyTrackDataSourceClocks&&t>0?this.clockTrackedDataSource=e.get(t-1):this.clockTrackedDataSource=void 0}},Viewer.prototype.zoomTo=function(e,t){return zoomToOrFly(this,e,{offset:t},!1)},Viewer.prototype.flyTo=function(e,t){return zoomToOrFly(this,e,t,!0)},Viewer.prototype._postRender=function(){updateZoomTarget(this),updateTrackedEntity(this)};export default Viewer;