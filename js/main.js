let SCENE;
let CAMERA;
let RENDERER;
let CSSRENDERER;
let LOADING_MANAGER;
let IMAGE_LOADER;
let OBJ_LOADER;
let CONTROLS;
let MOUSE;
let RAYCASTER;

let TEXTURE;
let OBJECT;

const _IS_ANIMATED = Symbol('is animated');
const _IS_VISIBLE = Symbol('is visible');

main();


function main() {
    init();
    animate();
}


function init() {
    initScene();
    initCamera();
    initRenderer();
    initCSSRenderer();
    initLoaders();
    initControls();
    initRaycaster();
    initWorld();

    initTexture();
    loadTexture();

    loadModel();
    loadModel1();
    loadModel2();
    loadModel3();

    initEventListeners();

    document.querySelector('.canvas-container').appendChild(RENDERER.domElement);
    document.querySelector('.canvas-container').appendChild(CSSRENDERER.domElement);

}

// Инициализируем сцену и создаем пару источников света
function initScene() {
    SCENE = new THREE.Scene();

    initLights();
    initLights1();
}

// Источники света бывают разными. Чаще всего в подобных задачах используется ambient – заполняющий свет, и directional – свет в определенном направлении. 
// Еще бывают точечные источники света, но нам они пока не нужны. Цвет свечения делаем белым, чтобы не было никаких искажений.
function initLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    SCENE.add(ambient);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(100, 0, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = 50;
    directionalLight.shadow.camera.right = -50;
    directionalLight.shadow.camera.top = -50;
    directionalLight.shadow.camera.bottom = 50;

    SCENE.add(directionalLight);
}

function initLights1() {


    const directionalLight1 = new THREE.DirectionalLight(0xffffff);
    directionalLight1.position.set(0, 100, 100);
    directionalLight1.castShadow = true;
    directionalLight1.shadow.camera.left = -50;
    directionalLight1.shadow.camera.right = 50;
    directionalLight1.shadow.camera.top = 50;
    directionalLight1.shadow.camera.bottom = -50;


    SCENE.add(directionalLight1);
}

// Камреа - сущность, которая определяет точку, в которой мы находимся, и направление, в котором смотрим.
function initCamera() {
    // PerspectiveCamera определяет свой frustum на основе 4 свойств. 
    //  
    // Ширина усеченного конуса - это просто высота, умноженная на aspect.
    CAMERA = new THREE.PerspectiveCamera(
        65, // fov - поле обзора определяет высоту передней и задней частей усеченного конуса, вычисляя правильную высоту, 
        //чтобы получить указанное поле обзора в near единицах измерения от камеры.
        window.innerWidth / window.innerHeight, // aspect - определяет, насколько широким передние и задняя часть усеченного есть. 
        65, // near - определяет, где начинается фронт усечения.
        //100,
        2000 // far - определяет, где он заканчивается. 
    );
    CAMERA.position.y = 150;
    //CAMERA.position.z = 200;
    //CAMERA.rotation.z = CAMERA.rotation.z - 200
}

// Рендерер - отвечает за отрисовку изображения. Его инициализация говорит сама за себя:
function initRenderer() {
    RENDERER = new THREE.WebGLRenderer({
        alpha: true
    });
    RENDERER.setPixelRatio(window.devicePixelRatio);
    RENDERER.setSize(window.innerWidth, window.innerHeight);
    RENDERER.shadowMap.enabled = true;
    RENDERER.shadowMapSort = true;
}


function initCSSRenderer() {
    CSSRENDERER = new THREE.CSS3DRenderer();
    CSSRENDERER.setSize(window.innerWidth, window.innerHeight);
    CSSRENDERER.domElement.style.position = 'absolute';
    CSSRENDERER.domElement.style.top = 0;
}

// Загрузчики нужны для того, чтобы загружать данные разных форматов. Здесь (https://github.com/mrdoob/three.js/tree/dev/examples/js/loaders) есть список вариантов, но нужно только два – один для картинок и один для моделей
function initLoaders() {
    LOADING_MANAGER = new THREE.LoadingManager();
    IMAGE_LOADER = new THREE.ImageLoader(LOADING_MANAGER);
    OBJ_LOADER = new THREE.OBJLoader(LOADING_MANAGER);
}


function initControls() {
    CONTROLS = new THREE.OrbitControls(CAMERA);
    CONTROLS.minPolarAngle = Math.PI * 1 / 4;
    CONTROLS.maxPolarAngle = Math.PI * 3 / 4;
    CONTROLS.minDistance = 10;
    CONTROLS.maxDistance = 150;
    CONTROLS.autoRotate = true;
    CONTROLS.autoRotateSpeed = -1.0;
    CONTROLS.update();

    MOUSE = new THREE.Vector2();
}


function initRaycaster() {
    RAYCASTER = new THREE.Raycaster();
}


function initTexture() {
    TEXTURE = new THREE.Texture();
}


function initWorld() {
    const sphere = new THREE.SphereGeometry(500, 64, 64);
    sphere.scale(-1, 1, 1);

    const texture = new THREE.Texture();

    const material = new THREE.MeshBasicMaterial({
        map: texture
    });

    IMAGE_LOADER.load('../img/prakticki.jpg', (image) => {
        texture.image = image;
        texture.needsUpdate = true;
    });

    SCENE.add(new THREE.Mesh(sphere, material));
}


function loadTexture() {
    IMAGE_LOADER.load('../img/texture.jpg', (image) => {
        TEXTURE.image = image;
        TEXTURE.needsUpdate = true;
    });
}

// Загрузка моделей. Как и следовало ожидать, она происходит асинхронно. После загрузки модели мы можем поиграть с ее параметрами:

// Notion OOP
function loadModel() {
    OBJ_LOADER.load('../objects/notionOBJ.obj', (object) => {
        object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                //child.material.map = TEXTURE;
                child.material.color.setHSL(Math.random(), 1, 0.5);
                // Делаем текстуру прозрачной дабы не видеть изменение цвета до загрузки объекта
                child.material.transparent = true
                child[_IS_ANIMATED] = false;
            }
        });
        object.scale.x = 0.3;
        object.scale.y = 0.3;
        object.scale.z = 0.3;
        object.rotation.x = 0;
        object.position.y = 45;
        object.position.z = 0;

        OBJECT = object;
        SCENE.add(OBJECT);

    });

}

// undefined link-2
function loadModel1() {
    OBJ_LOADER.load('../objects/link1part.obj', (object) => {
        object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                //child.material.map = TEXTURE;
                child.material.color.setHSL(Math.random(), 1, 0.5);
                // Делаем текстуру прозрачной дабы не видеть изменение цвета до загрузки объекта
                child.material.transparent = true
                child[_IS_ANIMATED] = false;
            }
        });
        object.scale.x = 0.3;
        object.scale.y = 0.3;
        object.scale.z = 0.3;
        object.rotation.x = 0;
        object.position.y = 24;
        object.position.z = 0;

        OBJECT1 = object;

        SCENE.add(OBJECT1);
    });

}
// undefined link-2
function loadModel2() {
    OBJ_LOADER.load('../objects/link2part.obj', (object) => {
        object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                //child.material.map = TEXTURE;
                child.material.color.setHSL(Math.random(), 1, 0.5);
                // Делаем текстуру прозрачной дабы не видеть изменение цвета до загрузки объекта
                child.material.transparent = true
                child[_IS_ANIMATED] = false;
            }
        });
        object.scale.x = 0.3;
        object.scale.y = 0.3;
        object.scale.z = 0.3;
        object.rotation.x = 0;
        object.position.y = 15;
        object.position.z = 0;
        OBJECT2 = object;
        SCENE.add(OBJECT2);
    });

}
// memememem
function loadModel3() {
    OBJ_LOADER.load('../objects/AuthorOBJ.obj', (object) => {
        object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                //child.material.map = TEXTURE;
                child.material.color.setHSL(Math.random(), 1, 0.5);
                // Делаем текстуру прозрачной дабы не видеть изменение цвета до загрузки объекта
                child.material.transparent = true
                child[_IS_ANIMATED] = false;
            }
        });
        object.scale.x = 0.3;
        object.scale.y = 0.3;
        object.scale.z = 0.3;
        object.rotation.x = 0;
        object.position.y = -15;
        object.position.z = 0;

        OBJECT3 = object;

        SCENE.add(OBJECT3);
    });

}

function initEventListeners() {
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    // Слушает нажатия мышкой для ссылок
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    //window.addEventListener('mousedown', onDocumentMouseDown);

    onWindowResize();
}


function onWindowResize() {
    CAMERA.aspect = window.innerWidth / window.innerHeight;
    CAMERA.updateProjectionMatrix();

    RENDERER.setSize(window.innerWidth, window.innerHeight);
    CSSRENDERER.setSize(window.innerWidth, window.innerHeight);
}


function onMouseMove(event) {
    MOUSE.x = (event.clientX / window.innerWidth) * 2 - 1;
    MOUSE.y = -(event.clientY / window.innerHeight) * 2 + 1;

    var raycaster = new THREE.Raycaster(),
        INTERSECTED;
    var mouse = new THREE.Vector2();

    event.preventDefault();
    // обновляем "выбирающий" луч вместе с камерой и движением мыши   
    raycaster.setFromCamera(MOUSE, CAMERA);

    var intersects = raycaster.intersectObjects(OBJECT.children);
    // Если луч пересекается
    if (intersects.length > 0) {
        // Меняем курсор мыши
        document.body.style.cursor = "pointer";
        //intersects[0].object.material.transparent = false;
        // задаем материал при наведении
        intersects[0].object.material.color.setHex(Math.random() * 0xff00000 - 0xff00000);
        // Выравниваем объект лицом на камеру
        intersects[0].object.lookAt(CAMERA.position);
    } // Иначе меняем курсор на дефолтный   
    else {
        document.body.style.cursor = "default"
    }

    intersects = raycaster.intersectObjects(OBJECT1.children);
    if (intersects.length > 0) {
        // Меняем курсор мыши
        document.body.style.cursor = "pointer";
        // задаем материал при наведении
        intersects[0].object.material.color.setHex(Math.random() * 0xff00000 - 0xff00000);
        // Выравниваем объект лицом на камеру
        intersects[0].object.lookAt(CAMERA.position);
    }

    intersects = raycaster.intersectObjects(OBJECT2.children);
    if (intersects.length > 0) {
        // Меняем курсор мыши
        document.body.style.cursor = "pointer";
        // задаем материал при наведении
        intersects[0].object.material.color.setHex(Math.random() * 0xff00000 - 0xff00000);
        // Выравниваем объект лицом на камеру
        intersects[0].object.lookAt(CAMERA.position);
    }

    intersects = raycaster.intersectObjects(OBJECT3.children);
    if (intersects.length > 0) {
        // Меняем курсор мыши
        document.body.style.cursor = "pointer";
        // задаем материал при наведении
        intersects[0].object.material.color.setHex(Math.random() * 0xff00000 - 0xff00000);
        // Выравниваем объект лицом на камеру
        intersects[0].object.lookAt(CAMERA.position);
    }

    intersects = raycaster.intersectObjects(OBJECT4.children);
    if (intersects.length > 0) {
        // Меняем курсор мыши
        document.body.style.cursor = "pointer";
        // задаем материал при наведении
        intersects[0].object.material.color.setHex(Math.random() * 0xff00000 - 0xff00000);
        // Выравниваем объект лицом на камеру
        intersects[0].object.lookAt(CAMERA.position);
    }
}

// Остается запустить шарманку
function animate() {
    requestAnimationFrame(animate);
    CONTROLS.update();
    render();
}


function render() {
    CAMERA.lookAt(SCENE.position);

    RAYCASTER.setFromCamera(MOUSE, CAMERA);

    RENDERER.render(SCENE, CAMERA);
    CSSRENDERER.render(SCENE, CAMERA);
}



// Фунцкия нажатия кнопки мыши
function onDocumentMouseDown(event) {
    var raycaster = new THREE.Raycaster(),
        INTERSECTED;
    var mouse = new THREE.Vector2();


    event.preventDefault();

    // обновляем "выбирающий" луч вместе с камерой и движением мыши   
    raycaster.setFromCamera(MOUSE, CAMERA);

    var intersects = raycaster.intersectObjects(OBJECT.children);
    if (intersects.length > 0) {
        // говорим открыть окно
        window.open("https://ronimizy.notion.site/ronimizy/is-oop-y25-cb73d6ab0b394a6ea58d337dcc061bd9", "_self");
        intersects[0].object.lookAt(CAMERA.position);
        /*
        		// Двигаем объект
        		// Меняем курсор мыши
        		document.body.style.cursor = "move";
        		var direction = new THREE.Vector3(1,0,0); 
        		var speed = 0.5; 
        		var vector = direction.multiplyScalar( speed, speed, speed ); 
        		// Поворачиваем объект на камеру
        		//	intersects[0].object.lookAt(CAMERA.position);
        				// Отключаем автоповорот и орбитаконтрол
        		CONTROLS.enabled = false;
        		CONTROLS.autoRotate = false;
        		intersects[0].object.position.x += vector.x; 
        		intersects[0].object.position.y += vector.y; 
        		intersects[0].object.position.z += vector.z;
        		intersects[0].point.x =intersects[0].object.position.x;
        		intersects[0].point.y =intersects[0].object.position.y;
        		intersects[0].point.z =intersects[0].object.position.z;
        */
    } else { // Иначе меняем курсор на дефолтный включаем орбитконтрол и автоповорот  
        document.body.style.cursor = "default";
    };

    intersects = raycaster.intersectObjects(OBJECT1.children);
    if (intersects.length > 0) {
        window.open("https://www.youtube.com/watch?v=x4Xf4mmbecE", "_self");
        intersects[0].object.lookAt(CAMERA.position);
    }
    intersects = raycaster.intersectObjects(OBJECT2.children);
    if (intersects.length > 0) {
        window.open("https://www.youtube.com/watch?v=QstRt7ddYJg", "_self");
        intersects[0].object.lookAt(CAMERA.position);
    }
    intersects = raycaster.intersectObjects(OBJECT3.children);
    if (intersects.length > 0) {
        window.open("https://github.com/DianaNeumann", "_self");
        intersects[0].object.lookAt(CAMERA.position);
    }   
};
