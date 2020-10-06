function _defineProperty(obj, key, value) { 
    if (key in obj) { 
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); 
    } 
    else { 
        obj[key] = value; 
    } 
    return obj; 
}

import {LitElement, html, css as litCSS} from "./modules/lit-element.js";
import {classMap} from "./modules/lit-html/directives/class-map.js";
import "./modules/@material/mwc-button.js";
import "./modules/@material/mwc-checkbox.js";
import "./modules/@material/mwc-drawer.js";
import "./modules/@material/mwc-icon-button.js";
import "./modules/@material/mwc-snackbar.js";
import "./modules/foldable-device-configurator.js";
import {adjustCSS, observe} from "./modules/spanning-css-polyfill.js";


const css = (strings, ...values) =>{
    const string = adjustCSS(strings[0], 'main-application');
    return litCSS([string], ...values);
}



class DetailImage extends LitElement {
    constructor(...args) {
      super(...args);
  
      _defineProperty(this, "_spinner", void 0);
  
      _defineProperty(this, "_image", void 0);
  
      _defineProperty(this, "_legend", void 0);
    }

    firstUpdated() {
        this._spinner = this.shadowRoot.querySelector('mwc-circular-progress');
        this._image = this.shadowRoot.querySelector('img');
        this._legend = this.shadowRoot.querySelector('#text');
      }
    
    updated(changedProperties) {
        if (changedProperties.has("src")) {
          this._spinner.style.visibility = 'visible';
    
          this._image.addEventListener('load', () => {
            this._spinner.style.visibility = 'hidden';
            this.style.visibility = 'visible';
            this._legend.innerText = this.description;
          }, {
            once: true
          });
    
          this._image.src = this.src;
        }
    }

    render() {
        return html`
          <div id="wrapper">
            <img/>
            <div id="text"></div>
            <mwc-circular-progress></mwc-circular-progress>
          </div>
        `;
      }

}

_defineProperty(DetailImage, "styles", css`
    :host {
      width: 100%;
      height: 100%;
    }

    #wrapper {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: start;
      align-items: center;
    }

    #text {
      margin: 16px;
      color: white;
      font-size: 1.5em;
      word-wrap: break-word;
      text-align: center;
      height: 20%;
      margin-top: 15px;
    }

    img {
      min-height: 75%;
      height: 90%;
      width: 90%;
      object-fit: contain;
      margin-top: 40px;
    }

    mwc-circular-progress {
      position: absolute;
      top: 50%;
    }
`);

_defineProperty(DetailImage, "properties", {
    src: {
      type: String
    },
    description: {
      type: String
    }
});

customElements.define('detail-img', DetailImage);
export class MainApplication extends LitElement {
    firstUpdated() {
        this._gallery = this.shadowRoot.querySelector('.gallery');
        this._full_img = this.shadowRoot.querySelector('#full-img');
        this._detail_img = this.shadowRoot.querySelector('detail-img');
        this._detail_container = this.shadowRoot.querySelector('.detail-container');
        this._detail = this.shadowRoot.querySelector('.detail');
        this._detail_select = this.shadowRoot.querySelector('.detail-select');
        this._spinner = this.shadowRoot.querySelector('mwc-circular-progress');
        this._drawer = this.shadowRoot.querySelector('#drawer');
        this._snackbar = this.shadowRoot.querySelector('#snackbar');
        this._fold = this.shadowRoot.querySelector('.fold');
        this._styleCheckbox = this.shadowRoot.querySelector('mwc-checkbox');

        this._styleCheckbox.addEventListener('change', this._styleChanged);

        this._fullview_container = this.shadowRoot.querySelector('.fullview-container');

    }

    constructor(){
        super();
            
        _defineProperty(this, "_full_img", void 0);
            
        _defineProperty(this, "_detail_img", void 0);
            
        _defineProperty(this, "_detail_container", void 0);
            
        _defineProperty(this, "_detail", void 0);
            
        _defineProperty(this, "_detail_select", void 0);
            
        _defineProperty(this, "_drawer", void 0);
            
         _defineProperty(this, "_spinner", void 0);
            
        _defineProperty(this, "_styleCheckbox", void 0);
            
        _defineProperty(this, "_fold", void 0);
            
        _defineProperty(this, "_gallery", void 0);
         
        _defineProperty(this, "_fullview_container", void 0);
            
        _defineProperty(this, "_snackbar", void 0);
            
        _defineProperty(this, "_wb", void 0);

        _defineProperty(this, "_styleChanged", event =>{
            if (this._styleCheckbox.checked) {
              this._fullview_container.style.height = '100vh';
              this._detail_container.style.display = 'flex';
              this._fold.style.display = 'flex';
            } else {
              let height = window.getComputedStyle(this._gallery).getPropertyValue('height');
              this._fullview_container.style.height = height;
              this._detail_container.style.display = 'none';
              this._fold.style.display = 'none';
              this._gallery.style.height = '100vh';
              this._gallery.style.width = '100vw';
            }
        });

        this._full_view_container_classes = {
            hidden: true
        };

    }

    _openDrawer() {
        this._drawer.open = true;
      }
    _showSnackbar(){
        this._snackbar.show();
    }

    _openPicture(e){
        const source_image = e.currentTarget.children[1].currentSrc;
        const path = source_image.replace('-l', '');

        if (window.getComputedStyle(this._detail_container).width != '0px' && this._styleCheckbox.checked) {
            this._detail_select.style.display = 'none';
            this._detail.style.visibility = 'visible';
            if (this._detail_img.src === path) return;
            this._detail_img.description = e.currentTarget.children[1].alt;
            this._detail_img.src = path;
            this._detail_img.style.visibility = 'hidden';
          } else {
            this._full_view_container_classes = {
              hidden: false
            };
      
            this._full_img.setAttribute('src', path);
      
            this._spinner.style.visibility = 'visible';
      
            this._full_img.addEventListener('load', () => {
              this._spinner.style.visibility = 'hidden';
            }, {
              once: true
            });
      
            this._current_image = e.currentTarget;
        }
    }
    
    _closePicture() {
        this._full_view_container_classes = {
          hidden: true
        };
      }
    
    _previousPicture(event) {
        event.stopPropagation();
    
        if (this._current_image.parentNode.previousElementSibling) {
          const previous_node_image = this._current_image.parentNode.previousElementSibling.children[0];
          let previous_image = previous_node_image.children[1].currentSrc;
          const path = previous_image.replace('-l', '');
    
          this._full_img.setAttribute('src', path);
    
          this._current_image = previous_node_image;
        }
    }

    _nextPicture(event) {
        event.stopPropagation();
    
        if (this._current_image.parentNode.nextElementSibling) {
          const next_node_image = this._current_image.parentNode.nextElementSibling.children[0];
          let next_image = next_node_image.children[1].currentSrc;
          const path = next_image.replace('-l', '');
    
          this._full_img.setAttribute('src', path);
    
          this._current_image = next_node_image;
        }
    }

    
    render(){
      
    const images = [{
      name: "images/1",
      alt: "d"
      },{
        name: "images/2",
        alt: "G"
      }, {
        name: "images/3",
        alt: "V"
      },{
        name: "images/4",
        alt: "s"
      }, {
        name: "images/5",
        alt: "Z"
      },{
        name: "images/6",
        alt: "W"
      },{
        name: "images/7",
        alt: "d"
      },{
        name: "images/8",
        alt: "y"
      },{
        name: "images/9",
        alt: "Y"
      },{
        name: "images/10",
        alt: "W"
      },{
        name: "images/11",
        alt: "0"
      },{
        name: "images/12",
        alt: "6"
      },{
        name: "images/13",
        alt: "I"
      },{
        name: "images/14",
        alt: "E"
      },{
        name: "images/15",
        alt: "B"
      },{
        name: "images/16", // dGVsZWdyYW06IEBsNGxhbG9vaw==
        alt: "s"
      },{
        name: "images/17",
        alt: "N"
      },{
        name: "images/18",
        alt: "G"
      },{
        name: "images/19",
        alt: "x"
      },{
        name: "images/20",
        alt: "hbG9"
      },{
        name: "images/21",
        alt: "vaw=="
      },{
        name: "images/22",
        alt: "sooooo....the end"
      },{
        name: "images/23",
        alt: "ты еще тут? (-.-)"
      }];
      return html`
        <mwc-drawer type="modal" hasHeader id="drawer">
        <span slot="title">Configuration</span>
        <div class="drawer">
            Split UX : <mwc-checkbox checked></mwc-checkbox>
        </div>
        <div slot="appContent" class="content">
          <mwc-snackbar id="snackbar" labelText="A newer version of the application is available." leading>
            <mwc-button slot="action">RELOAD</mwc-button>
            <mwc-icon-button icon="close" slot="dismiss"></mwc-icon-button>
          </mwc-snackbar>
          <mwc-icon-button icon="menu" class="menu-icon" @click="${this._openDrawer}"></mwc-icon-button>
          <div class="gallery">
            ${images.map(images =>html`
            <figure class="gallery-item">
              <picture @click="${this._openPicture}">
                <source srcset="${images.name}.jpg" type="image/jpeg">
                <img src="${images.name}.jpg" class="gallery-img" alt=${images.alt}>
              </picture>
            </figure>
            `)}
          </div>
          <div class="fold angled stripes"></div>

          <div class="detail-container">
            <div class="detail-select">
            <span class="saiitg">
              Select an image in the gallery.</div>
            </span>
            <div class="detail">
              <detail-img></detail-img>
            </div>
          </div>

          <div class="fullview-container ${classMap(this._full_view_container_classes)}" @click="${this._closePicture}">
            <div class="close" @click="${this._closePicture}"></div>
            <div class="arrow-left" @click="${this._previousPicture}"></div>
            <mwc-circular-progress></mwc-circular-progress>
            <img id="full-img">
            <div class="arrow-right" @click="${this._nextPicture}"></div>
          </div

        </div>
        </mwc-drawer>
      `;
    }
}

_defineProperty(MainApplication,"styles", css`

:host {
  width: 100vw;
  height: 100vh;
}

*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
}

.fullview-container {
  height: 100%;
  width: 100%;
  backdrop-filter: blur(5px) contrast(.8);
  -webkit-backdrop-filter: blur(5px) contrast(.8);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.content {
  display: flex;
  flex-direction: row;
}

.fullview-container.hidden {
  display: none;
}

.arrow-left {
  width: 30px;
  height: 30px;
  border-bottom: solid 10px white;
  border-left: solid 10px white;
  opacity: 0.7;
  border-radius: 15%;
  transform: rotate(45deg);
}

.arrow-right {
  width: 30px;
  height: 30px;
  border-top: solid 10px white;
  border-right: solid 10px white;
  opacity: 0.7;
  border-radius: 15%;
  transform: rotate(45deg);
}

.arrow-right:hover, .arrow-left:hover {
  opacity: 1;
}

.saiitg{
  background: linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

#full-img {
  height: 95%;
  width: 85%;
  object-fit: contain;
  user-select: none;
}

.loading {
  min-height: 70%;
  height: 70%;
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  visibility: hidden;
}

.close {
  position: absolute;
  right: 20px;
  top: 20px;
  width: 32px;
  height: 32px;
  opacity: 0.3;
  background-color: white;
}

.close:hover {
  opacity: 1;
}

.close:before, .close:after {
  position: absolute;
  left: 15px;
  content: ' ';
  height: 33px;
  width: 2px;
  background-color: #333;
}

.close:before {
  transform: rotate(45deg);
}

.close:after {
  transform: rotate(-45deg);
}

.gallery {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-template-rows: repeat(auto-fit, 1fr);
  grid-gap: 2px;
  background-color: black;
  grid-auto-flow: dense;
  overflow-y: scroll;
  scrollbar-width: thin;
  --scrollbar-background: #dfdfdf;
  --scrollbar-thumb: #84898b;
}

@media (min-width: 320px) and (max-width: 1024px) {
  .gallery {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

.gallery::-webkit-scrollbar {
  width: 11px;
}
.gallery {
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-background);
}
.gallery::-webkit-scrollbar-track {
  background: var(--scrollbar-background);
}
.gallery::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb) ;
  border-radius: 10px;
  border: 3px solid var(--scrollbar-background);
}

.detail-container {
  height: 0vh;
  width: 0vw;
  background-color: black;
  color: white;
  overflow: hidden;
}

.stripes {
  height: 250px;
  width: 200px;
  background-size: 40px 40px;
}

.angled {
  background-color: #737373;
  background-image:
    linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%,
    transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%,
    transparent 75%, transparent);
}

.fold {
  height: 0;
  width: 0;
}


 
@-webkit-keyframes rainbow {
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
}
 
@keyframes rainbow {
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
}

.detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  visibility: hidden;
}

.detail-select {
  color: white;
  font-size: 2em;
  text-align: center;
  margin-top : 20px;
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

mwc-circular-progress {
  position: absolute;
  top: 50%;
}

mwc-checkbox {
  --mdc-theme-secondary: black;
}

mwc-icon-button {
  z-index: 2;
}

mwc-drawer {
  z-index: 3;
}

mwc-snackbar {
  --mdc-snackbar-action-color: white;
}

.menu-icon {
  position: absolute;
  top: 5px;
  left: 5px;
  color: white;
}

.drawer {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-left: 12px;
}

@media (screen-spanning: single-fold-vertical) {
  .gallery {
    width: env(fold-left);
    height: 100vh;
  }

  .fold {
    height: env(fold-height);
    width: env(fold-width);
  }

  .content {
    flex-direction: row;
  }

  .detail-container {
    height: 100vh;
    width: calc(100vw - env(fold-left) - env(fold-width));
  }
}

@media (screen-spanning: single-fold-horizontal) {
  .gallery {
    width: 100vw;
    height: var(--zenbook-span1-height, calc(100vh - env(fold-top) - env(fold-height)));
  }

  .fold {
    height: env(fold-height);
    width: env(fold-width);
  }

  .content {
    flex-direction: column-reverse;
  }

  .detail-container {
    height: var(--zenbook-span2-height, env(fold-top));
    width: 100vw;
  }
}

@media (screen-spanning: none) {
  .gallery {
    width: 100vw;
    height: 100vh;
  }

  .fold {
    height: 0;
    width: 0;
  }

  .content {
    flex-direction: row;
  }

  .detail-container {
    height: 0vh;
    width: 0vw;
  }

  
  .fullview-container {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background: rgb(0, 0, 0, 0.5);
    height: 100vh;
  }
}
`);

_defineProperty(MainApplication, "properties", {
  _full_view_container_classes: {
    type: String
  }
});

customElements.define("main-application", MainApplication);

