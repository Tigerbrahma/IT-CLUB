/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

// document.body.clientWidth is the same as window.innerWidth
// at this state, so we save this here to have that value
// before A-FRAME changes it.
var initialClientWidth = window.innerWidth;

/**
 * Always Fullscreen component for A-Frame.
 */
AFRAME.registerComponent('always-fullscreen', {
  schema: {
    platform: {
      default: 'mobile',
      oneOf: [
          'mobile', 'desktop', 'all'
      ]
    },
    debug: {default:false}
  },

  init: function () {
    this.mask = this.mask.bind(this);
    this.initialize = this.initialize.bind(this);
    this.updateMasks = this.updateMasks.bind(this);
    this.resizeHandler = this.resizeHandler.bind(this);
    this.orientationChangeHandler = this.orientationChangeHandler.bind(this);
    this.orientationChangeHelper = this.orientationChangeHelper.bind(this);
    this.cancel = this.cancel.bind(this);

    if (!platform) {
      throw new Error("Platform dependency is not available");
    }
  },

  update: function (oldData) {
    if (this.el.sceneEl.hasLoaded) {
      this.initialize();
    } else {
      this.el.sceneEl.addEventListener("loaded", this.initialize);
    }
  },

  initialize: function() {

    var fullscreenButton = document.querySelector('#fullscreenbutton');

    if (fullscreenButton) {
      fullscreenButton.parentNode.removeChild(fullscreenButton);
    }

    this.removeEventListeners();

    if ((platform.os.family == 'iOS' && parseInt(platform.os.version, 10) > 8 || platform.ua.indexOf('like Mac OS X') != -1) && (this.data.platform === 'all' || (this.data.platform === 'mobile' && this.el.sceneEl.isMobile))) {

      // If we are on iOS, go Fullscreen with the Treadmill/Scroll Mask
      this.makeTreadmill();
      this.makeMask();

      window.addEventListener("resize", this.resizeHandler);
      window.addEventListener("orientationchange", this.orientationChangeHandler);

    } else if (this.data.platform === 'all' || (this.data.platform === 'mobile' && this.el.sceneEl.isMobile) || (this.data.platform === 'desktop' && !this.el.sceneEl.isMobile)) {

      // If we are NOT on iOS, go Fullscreen with the Fullscreen API
      this.makeFullscreenMask();

      window.addEventListener("resize", this.resizeHandler);
      document.addEventListener("webkitfullscreenchange", this.updateMasks);
      document.addEventListener("mozfullscreenchange", this.updateMasks);
      document.addEventListener("msfullscreenchange", this.updateMasks);
      document.addEventListener("webkitfullscreenchange", this.updateMasks);
    }

    this.updateMasks();

  },

  removeEventListeners: function() {
    window.removeEventListener("resize", this.resizeHandler);
    window.removeEventListener("orientationchange", this.orientationChangeHandler);
    document.removeEventListener("webkitfullscreenchange", this.updateMasks);
    document.removeEventListener("mozfullscreenchange", this.updateMasks);
    document.removeEventListener("msfullscreenchange", this.updateMasks);
    document.removeEventListener("webkitfullscreenchange", this.updateMasks);
  },

  remove: function () {
    var mask = document.querySelector('#mask');

    if (mask) {
      mask.parentNode.removeChild(mask);
    }

    var treadmill = document.querySelector('#treadmill');

    if (treadmill) {
      treadmill.parentNode.removeChild(treadmill);
    }

    var fullscreenMask = document.querySelector('#fullscreenmask');

    if (fullscreenMask) {
      fullscreenMask.parentNode.removeChild(fullscreenMask);
    }

    var fullscreenButton = document.querySelector('#fullscreenbutton');

    if (fullscreenButton) {
      fullscreenButton.parentNode.removeChild(fullscreenMask);
    }

    this.removeEventListeners();

    window.scrollTo(0, 0);
    this.el.style.height = '100%';
    this.el.sceneEl.resize();
  },

  makeMask: function () {
    var mask = document.querySelector('#mask');

    if (!mask) {
      mask = document.createElement('div');
      mask.id = 'mask';

      document.body.appendChild(mask);
    }

    mask.style.position = 'fixed';
    mask.style.zIndex = 9999999999;
    mask.style.top = 0;
    mask.style.left = 0;
    mask.style.display = 'none';
    mask.style.width = '100%';
    mask.style.height = '100%';
    mask.style.background = '#663399 url(data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22iso-8859-1%22%3F%3E%0A%3C%21--%20Generator%3A%20Adobe%20Illustrator%2019.0.0%2C%20SVG%20Export%20Plug-In%20.%20SVG%20Version%3A%206.00%20Build%200%29%20%20--%3E%0A%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%20version%3D%221.1%22%20id%3D%22Capa_1%22%20x%3D%220px%22%20y%3D%220px%22%20viewBox%3D%220%200%20273.881%20273.881%22%20style%3D%22enable-background%3Anew%200%200%20273.881%20273.881%3B%22%20xml%3Aspace%3D%22preserve%22%20width%3D%22512px%22%20height%3D%22512px%22%3E%0A%3Cg%3E%0A%09%3Cpath%20d%3D%22M249.931%2C144.833c-4.948-29.482-26.584-35.193-35.98-36.267c-6.672-8.979-16.329-13.892-27.432-13.892%20%20%20c-2.663%2C0-5.164%2C0.378-7.411%2C0.794c-6.587-7.586-15.392-11.588-25.698-11.588c-0.209%2C0-0.797%2C0-0.797%2C0V46.715%20%20%20c0-16.276-12.223-28.551-28.5-28.551c-16.277%2C0-28.5%2C12.274-28.5%2C28.551v71.639l-0.704-1.012%20%20%20c-5.389-8.764-14.075-13.786-23.826-13.787c-10.508-0.001-20.65%2C5.932-25.823%2C15.112c-4.94%2C8.771-4.696%2C18.985%2C0.666%2C28.089%20%20%20l62.325%2C119.351c2.486%2C4.759%2C7.364%2C7.774%2C12.733%2C7.774h87.758c7.578%2C0%2C13.878-5.984%2C14.343-13.549l2.039-33.243%20%20%20C246.894%2C193.587%2C254.089%2C169.602%2C249.931%2C144.833z%20M213.304%2C223.771l-2.196%2C35.825c-0.076%2C1.25-1.113%2C2.284-2.365%2C2.284h-87.758%20%20%20c-0.882%2C0-1.691-0.55-2.1-1.332L56.4%2C140.928c-7.929-13.086%2C3.246-25.36%2C14.659-25.359c5.049%2C0.001%2C10.146%2C2.393%2C13.653%2C8.182%20%20%20l7.994%2C12.277c1.653%2C2.54%2C4.218%2C3.676%2C6.712%2C3.676c4.107%2C0%2C8.194-3.087%2C8.194-8.077V46.715c0-11.034%2C8.224-16.551%2C16.5-16.551%20%20%20c8.276%2C0%2C16.5%2C5.517%2C16.5%2C16.551v48.273c0%2C1.346%2C1.107%2C2.377%2C2.363%2C2.377c0.235%2C0%2C0.481-0.037%2C0.721-0.114%20%20%20c2.31-0.744%2C5.726-1.565%2C9.55-1.564c6.569%2C0%2C14.351%2C2.422%2C19.823%2C11.809c0.462%2C0.791%2C1.294%2C1.262%2C2.164%2C1.262%20%20%20c0.278%2C0%2C0.562-0.049%2C0.837-0.15c2.2-0.81%2C6.044-1.932%2C10.449-1.932c6.133%2C0%2C13.355%2C2.176%2C18.743%2C10.4%20%20%20c1.285%2C1.962%2C3.46%2C3.15%2C5.8%2C3.282c7.438%2C0.422%2C23.266%2C4.01%2C27.035%2C26.462c3.618%2C21.558-2.618%2C42.797-24.403%2C75.792%20%20%20C213.466%2C222.956%2C213.329%2C223.358%2C213.304%2C223.771z%22%20fill%3D%22%23FFFFFF%22/%3E%0A%09%3Cpath%20d%3D%22M45.613%2C77.881c0%2C3.313%2C2.686%2C6%2C6%2C6c3.313%2C0%2C6-2.687%2C6-6V20.626l12.17%2C12.003c2.342%2C2.342%2C6.225%2C2.343%2C8.569-0.001%20%20%20c2.343-2.343%2C2.384-6.142%2C0.041-8.485L56.026%2C1.757c-2.342-2.342-6.131-2.343-8.475%2C0.001L24.582%2C24.733%20%20%20c-2.343%2C2.343-2.34%2C6.142%2C0.004%2C8.485c1.171%2C1.171%2C2.708%2C1.757%2C4.244%2C1.757c1.535%2C0%2C2.905-0.586%2C4.077-1.758l12.706-12.873V77.881z%20%20%20%22%20fill%3D%22%23FFFFFF%22/%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3C/svg%3E%0A) 50% 50%/25% 25% no-repeat';

    this.appendCancelButton(mask);
  },

  makeTreadmill: function () {
    var treadmill = document.querySelector('#treadmill');

    if (!treadmill) {
      treadmill = document.createElement('div');
      treadmill.id = 'treadmill';

      document.body.appendChild(treadmill);
    }

    treadmill.style.visibility = 'hidden';
    treadmill.style.position = 'relative';
    treadmill.style.zIndex = 10;
    treadmill.style.left = 0;
    treadmill.style.display = 'block';

    // Why make it such a large number?
    // Huge body height makes the size and position of the scrollbar fixed.
    treadmill.style.width = '1px';
    treadmill.style.height = '9999999999999999px';
  },

  makeFullscreenMask: function () {
    var fullscreenMask = document.querySelector('#fullscreenmask');

    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      if (!fullscreenMask) {
        fullscreenMask = document.createElement('div');
        fullscreenMask.id = 'fullscreenmask';

        document.body.appendChild(fullscreenMask);

        fullscreenMask.addEventListener("click", this.enterFullScreen);
      }

      fullscreenMask.style.position = 'fixed';
      fullscreenMask.style.zIndex = 9999999999;
      fullscreenMask.style.top = 0;
      fullscreenMask.style.left = 0;
      fullscreenMask.style.display = 'block';
      fullscreenMask.style.width = '100%';
      fullscreenMask.style.height = '100%';
      fullscreenMask.style.background = '#663399 url(data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22iso-8859-1%22%3F%3E%0A%3C%21--%20Generator%3A%20Adobe%20Illustrator%2019.0.0%2C%20SVG%20Export%20Plug-In%20.%20SVG%20Version%3A%206.00%20Build%200%29%20%20--%3E%0A%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%20version%3D%221.1%22%20id%3D%22Capa_1%22%20x%3D%220px%22%20y%3D%220px%22%20viewBox%3D%220%200%20297%20297%22%20style%3D%22enable-background%3Anew%200%200%20297%20297%3B%22%20xml%3Aspace%3D%22preserve%22%20width%3D%22512px%22%20height%3D%22512px%22%3E%0A%3Cg%3E%0A%09%3Cpath%20d%3D%22M252.07%2C167.87c-4.949-29.482-26.585-35.193-35.98-36.267c-6.673-8.979-16.33-13.892-27.432-13.892%20%20%20c-2.664%2C0-5.165%2C0.28-7.412%2C0.697c-6.587-7.587-15.832-11.686-26.139-11.686c-0.209%2C0-0.906%2C0.002-0.906%2C0.005v-9.013%20%20%20c15-9.416%2C24.883-25.934%2C24.883-44.716c0-29.225-23.635-53-52.859-53S73.066%2C23.775%2C73.066%2C53c0%2C18.65%2C10.135%2C35.069%2C24.135%2C44.518%20%20%20v43.873l-0.429-1.012c-5.388-8.765-13.937-13.786-23.688-13.787c-10.507-0.001-20.581%2C5.932-25.753%2C15.112%20%20%20c-4.941%2C8.77-4.662%2C18.985%2C0.701%2C28.089l62.342%2C119.392c2.486%2C4.759%2C7.382%2C7.815%2C12.751%2C7.815h87.757%20%20%20c7.578%2C0%2C13.879-6.025%2C14.343-13.59l2.04-33.263C249.032%2C216.644%2C256.227%2C192.64%2C252.07%2C167.87z%20M85.136%2C53%20%20%20c0-22.607%2C18.508-41%2C41.115-41s40.776%2C18.393%2C40.776%2C41c0%2C11.592-4.826%2C22.066-12.826%2C29.531V69.753%20%20%20c0-3.05-0.842-8.673-0.842-8.673c0.761-2.562%2C1.259-5.271%2C1.259-8.08c0-15.649-12.643-28.335-28.293-28.335%20%20%20c-15.648%2C0-28.313%2C12.686-28.313%2C28.335c0%2C2.568%2C0.364%2C5.053%2C1.005%2C7.419c-0.017%2C0.052-0.199%2C0.101-0.216%2C0.152%20%20%20c-0.909%2C2.859-1.599%2C5.939-1.599%2C9.182v12.484C90.201%2C74.793%2C85.136%2C64.438%2C85.136%2C53z%20M215.832%2C245.648%20%20%20c-0.228%2C0.345-0.364%2C0.747-0.39%2C1.16l-2.196%2C35.866c-0.076%2C1.25-1.112%2C2.325-2.365%2C2.325h-87.757c-0.883%2C0-1.692-0.591-2.1-1.373%20%20%20L58.539%2C163.986c-7.93-13.086%2C3.246-25.37%2C14.658-25.369c5.049%2C0%2C10.146%2C2.388%2C13.653%2C8.176l7.994%2C12.275%20%20%20c1.653%2C2.54%2C3.943%2C3.674%2C6.438%2C3.674c4.107%2C0%2C7.918-3.088%2C7.918-8.077V69.753c0-11.035%2C8.224-16.552%2C16.5-16.552%20%20%20c8.276%2C0%2C16.5%2C5.517%2C16.5%2C16.552v48.273c0%2C1.346%2C1.381%2C2.376%2C2.637%2C2.376c0.236%2C0%2C0.618-0.037%2C0.86-0.114%20%20%20c2.311-0.744%2C5.794-1.564%2C9.619-1.564c6.569%2C0%2C14.385%2C2.422%2C19.857%2C11.809c0.462%2C0.792%2C1.311%2C1.262%2C2.181%2C1.262%20%20%20c0.278%2C0%2C0.57-0.049%2C0.845-0.15c2.201-0.81%2C6.048-1.932%2C10.454-1.932c6.133%2C0%2C13.357%2C2.176%2C18.744%2C10.4%20%20%20c1.285%2C1.962%2C3.461%2C3.149%2C5.801%2C3.282c7.438%2C0.422%2C23.267%2C4.01%2C27.036%2C26.462C243.853%2C191.414%2C237.617%2C212.653%2C215.832%2C245.648z%22%20fill%3D%22%23FFFFFF%22/%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3C/svg%3E%0A) 50% 50%/25% 25% no-repeat';

      this.appendCancelButton(fullscreenMask);
    }
  },

  makeFullscreenButton: function() {
    var fullscreenButton = document.querySelector('#fullscreenbutton');

    if (!fullscreenButton) {
      fullscreenButton = document.createElement('button');
      fullscreenButton.id = 'fullscreenbutton';

      var container = document.querySelector("div.a-enter-vr");

      if (!container) {
        var container = document.createElement('div');
        container.className = 'a-enter-vr';
      }

      container.appendChild(fullscreenButton);

      fullscreenButton.addEventListener("click", this.initialize);
    }

    var marginRight = 5;
    var height = '10vh';

    var enterVRButton = document.querySelector("button.a-enter-vr-button");

    if (enterVRButton) {
      marginRight = marginRight + enterVRButton.offsetWidth;
      height = enterVRButton.offsetHeight;
    }

    fullscreenButton.style.position = 'absolute';
    fullscreenButton.style.zIndex = 9999;
    fullscreenButton.style.bottom = 0;
    fullscreenButton.style.right = marginRight + 'px';
    fullscreenButton.style.display = 'block';
    fullscreenButton.style.width = height;
    fullscreenButton.style.height = height;
    fullscreenButton.style.border = 0;
    fullscreenButton.style.cursor = 'pointer';
    fullscreenButton.style.background = '#663399 url(data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22iso-8859-1%22%3F%3E%0A%3C%21--%20Generator%3A%20Adobe%20Illustrator%2019.0.0%2C%20SVG%20Export%20Plug-In%20.%20SVG%20Version%3A%206.00%20Build%200%29%20%20--%3E%0A%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%20version%3D%221.1%22%20id%3D%22Layer_1%22%20x%3D%220px%22%20y%3D%220px%22%20viewBox%3D%220%200%20512%20512%22%20style%3D%22enable-background%3Anew%200%200%20512%20512%3B%22%20xml%3Aspace%3D%22preserve%22%20width%3D%22512px%22%20height%3D%22512px%22%3E%0A%3Cg%3E%0A%09%3Cg%3E%0A%09%09%3Cpath%20d%3D%22M0%2C0v512h512V0H0z%20M195.048%2C420.571v36.571H54.857v-140.19h36.571v77.762l102.88-102.88l25.86%2C25.86L117.291%2C420.571%20%20%20%20H195.048z%20M194.309%2C220.17L91.429%2C117.291v77.757H54.857V54.857h140.19v36.571h-77.762L220.169%2C194.31L194.309%2C220.17z%20%20%20%20%20M457.143%2C457.143h-140.19v-36.571h77.757l-102.878-102.88l25.86-25.86l102.88%2C102.883v-77.762h36.571V457.143z%20M457.143%2C195.048%20%20%20%20h-36.571v-77.757l-102.88%2C102.88l-25.86-25.86L394.714%2C91.429h-77.762V54.857h140.19V195.048z%22%20fill%3D%22%23FFFFFF%22/%3E%0A%09%3C/g%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3C/svg%3E%0A) 50% 50%/100% 100% no-repeat';
  },

  mask: function () {
    var mask = document.querySelector('#mask');
    var treadmill = document.querySelector('#treadmill');

    if (this.isMinimalView()) {

      if (mask && mask.style.display != 'none') {
        mask.style.display = 'none';
      }

      if (treadmill) {
        treadmill.style.display = 'none';
      }

      window.scrollTo(0, 0);
      this.el.style.height = window.innerHeight;
      this.el.sceneEl.resize();

    } else {

      if (mask) {

        mask.style.display = 'block';

        if (treadmill) {
          treadmill.style.display = 'block';
        }

      } else {
        this.makeFullscreenButton();
      }

    }

    /*if (this.data.debug) {
      mask.innerHTML += "<p> Height: " + window.innerHeight + " Min: " + this.getMinimalViewHeight() + " Min-AF: " + Math.round(this.getMinimalViewHeight() / this.changeFactor) + "</p>";
    }*/

  },

  fullscreenMask: function() {
    var fullscreenMask = document.querySelector('#fullscreenmask');

    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      if (fullscreenMask) {
        fullscreenMask.style.display = 'block';
      } else {
        this.makeFullscreenButton();
      }
    } else if (fullscreenMask) {
      fullscreenMask.parentNode.removeChild(fullscreenMask);
    }
  },

  isMinimalView: function () {
    var windowHeight = window.innerHeight;
    var zoom = Math.ceil(document.body.clientWidth / window.innerWidth * 10) / 10;

    if (this.data.debug) {
      console.log("Initial Client-Width: " + initialClientWidth);
      console.log("window.innerHeight: " + windowHeight);
      console.log("Zoom: " + zoom);
      console.log("Change-Factor: " + this.changeFactor);
      console.log("Minimal-ViewHeight: " + this.getMinimalViewHeight());
      console.log("Minimal-ViewHeight AfterFactor: " + Math.round(this.getMinimalViewHeight() / this.changeFactor));
    }

    var currentHeight = windowHeight * zoom;
    var minimalViewHeight = Math.round(this.getMinimalViewHeight() / this.changeFactor);

    // Give it a 20px Threshold, because Chrome on iOS keeps the small Bar in Landscape-Mode
    // But it's only necessary on Landscape
    minimalViewHeight = this.getOrientation() === 'portrait' ? minimalViewHeight : minimalViewHeight - 20;

    return !(currentHeight < minimalViewHeight);
  },

  getMinimalViewHeight: function () {

    var orientation = this.getOrientation();

    // innerHeight in Minimal portrait, landscape, ScreenWidth, Height, Model
    var spec = [
      //[1275, 320, 480, 'iPhone 4S'],
      [1619, 552, 320, 568, 'iPhone 5, 5S'],
      [1640, 551, 375, 667, 'iPhone 6, 6S, 7'],
      [1648, 551, 414, 736, 'iPhone 6, 6S, 7 Plus']
      // TODO: Add iPads
    ];

    var index = null;

    for (var i = 0; i < spec.length; i++) {
      if (window.screen.width == spec[i][2] && window.screen.height == spec[i][3]) {
        index = i;
      }
    }

    if (!index) {
      throw new Error("Couldn't detect iOS Device!");
    }

    if (orientation === 'portrait') {
      return spec[index][0];
    } else {
      return spec[index][1];
    }

  },

  enterFullScreen: function() {
    var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    }
  },

  getOrientation: function() {
    return window.orientation === 0 || window.orientation === 180 ? 'portrait' : 'landscape';
    //return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  },

  updateMasks: function() {
    // A-FRAME changes clientWidth during Rendering - So we need to get that Factor and apply it.
    this.changeFactor = initialClientWidth / document.body.clientWidth;

    if ((platform.os.family == 'iOS' && parseInt(platform.os.version, 10) > 8 || platform.ua.indexOf('like Mac OS X') != -1) && (this.data.platform === 'all' || (this.data.platform === 'mobile' && this.el.sceneEl.isMobile))) {
      // If we are on iOS do the magic...
      this.mask();
    } else if (this.data.platform === 'all' || (this.data.platform === 'mobile' && this.el.sceneEl.isMobile) || (this.data.platform === 'desktop' && !this.el.sceneEl.isMobile)) {
      // If we are NOT on iOS, go Fullscreen with the Fullscreen API
      this.fullscreenMask();
    }
  },

  resizeHandler: function() {

    // This is so that we do things when scrolling ended
    if (this.resizeTimeout) {
      window.clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = window.setTimeout(this.updateMasks, 50);

    if (this.data.debug) {
      console.log("Resize Event");
    }
  },

  orientationChangeHandler: function() {

    this.orientationChangeHelper();

    // TODO: Resize-Handler should not run on orientation-change,
    // but the following code seems useless
    if (this.resizeTimeout) {
      window.clearTimeout(this.resizeTimeout);
    }

    if (this.orientationTimeout) {
      window.clearTimeout(this.orientationTimeout);
    }

    this.orientationTimeout = window.setTimeout(this.updateMasks, 500);

  },

  orientationChangeHelper: function () {

    if ((this.lastInnerWidth && this.lastInnerHeight) && window.innerWidth === this.lastInnerWidth && window.innerHeight === this.lastInnerHeight) {
      this.noChangeCount = this.noChangeCount ? this.noChangeCount + 1 : 1;

      if (this.noChangeCount >= 50) {
        if (this.orientationTimeout) {
          window.clearTimeout(this.orientationTimeout);
        }
        if (this.orientationChangeHelperTimout) {
          window.clearTimeout(this.orientationChangeHelperTimout);
        }

        if (this.data.debug) {
          console.log("Updating Masks after Orientation-Change due to Count.")
        }

        this.noChangeCount = 1;

        this.updateMasks();
      } else {

        if (this.orientationChangeHelperTimout) {
          window.clearTimeout(this.orientationChangeHelperTimout);
        }

        this.orientationChangeHelperTimout = window.setTimeout(this.orientationChangeHelper, 1);
      }
    } else {
      if (this.orientationChangeHelperTimout) {
        window.clearTimeout(this.orientationChangeHelperTimout);
      }

      this.orientationChangeHelperTimout = window.setTimeout(this.orientationChangeHelper, 10);
    }

    this.lastInnerWidth = window.innerWidth;
    this.lastInnerHeight = window.innerHeight;

  },

  cancel: function(evt) {
    if (typeof evt.stopPropagation == "function") {
      evt.stopPropagation();
    } else {
      evt.cancelBubble = true;
    }

    this.remove();
    this.makeFullscreenButton();
  },

  appendCancelButton: function(element) {
    var cancelButton = document.createElement('button');
    cancelButton.className = 'alwaysfullscreencancelbutton';

    element.appendChild(cancelButton);

    cancelButton.style.position = 'fixed';

    cancelButton.style.top = '5vh';
    cancelButton.style.left = '5vh';

    cancelButton.style.width = '5vh';
    cancelButton.style.height = '5vh';

    cancelButton.style.maxWidth = '50px';
    cancelButton.style.maxHeight = '50px';

    cancelButton.style.border = 0;
    cancelButton.style.padding = 0;

    cancelButton.style.display = 'block';
    cancelButton.style.cursor = 'pointer';
    cancelButton.style.background = 'url(data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22iso-8859-1%22%3F%3E%0A%3C%21--%20Generator%3A%20Adobe%20Illustrator%2019.0.0%2C%20SVG%20Export%20Plug-In%20.%20SVG%20Version%3A%206.00%20Build%200%29%20%20--%3E%0A%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%20version%3D%221.1%22%20id%3D%22Capa_1%22%20x%3D%220px%22%20y%3D%220px%22%20viewBox%3D%220%200%2031.112%2031.112%22%20style%3D%22enable-background%3Anew%200%200%2031.112%2031.112%3B%22%20xml%3Aspace%3D%22preserve%22%20width%3D%22512px%22%20height%3D%22512px%22%3E%0A%3Cpolygon%20points%3D%2231.112%2C1.414%2029.698%2C0%2015.556%2C14.142%201.414%2C0%200%2C1.414%2014.142%2C15.556%200%2C29.698%201.414%2C31.112%2015.556%2C16.97%20%20%2029.698%2C31.112%2031.112%2C29.698%2016.97%2C15.556%20%22%20fill%3D%22%23FFFFFF%22/%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3Cg%3E%0A%3C/g%3E%0A%3C/svg%3E%0A) 50% 50%/100% 100% no-repeat';

    cancelButton.addEventListener("click", this.cancel);
  }

});