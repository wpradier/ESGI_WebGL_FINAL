
            // ============== IMPORTS ==============
            import * as THREE from "/modules/three.js-master/build/three.module.js"; // Element threejs
            // import { OrbitControls } from './jsm/controls/OrbitControls.js'; // Controle de la caméra
            import { FirstPersonControls } from './jsm/controls/FirstPersonControls.js';
            import { GUI } from '/modules/three.js-master/examples/jsm/libs/dat.gui.module.js'; // Ajout d'un GUI
            import Stats from '/modules/three.js-master/examples/jsm/libs/stats.module.js'; // Affichage des stats de la page
            import {OBJLoader} from '/modules/three.js-master/examples/jsm/loaders/OBJLoader.js'; // ajout d'obj
            import {MTLLoader} from '/modules/three.js-master/examples/jsm/loaders/MTLLoader.js'; // obj .mtl (pour texture)
            import { FBXLoader } from '/modules/three.js-master/examples/jsm/loaders/FBXLoader.js';

            // ============== VARIABLES ===============
            let stats,mixer;
            let camera, scene, renderer;
            let mA,mB;
            let gui;
            let spotLight, lightHelper, shadowCameraHelper;
            let controls;
            const clock = new THREE.Clock();

            // ============== APPEL FONCTIONS ==============
            init();
            animate();
            buildGui();

            // ============== FONCTIONS ==============
            function init() {

            scene = new THREE.Scene();
            // scene.background = new THREE.Color( 0x000000 );

            // ============= AFFICHAGE STATS =============
            stats = new Stats(); // création stats
            document.body.appendChild( stats.dom ); // ajout des stats a la scene


            // ============= LIGHT =============
            // ===== AMBIANTE ======
            const ambient = new THREE.AmbientLight( 0xffffff , 0.1 ); // (couleur, intensite)
            scene.add( ambient );

            // ===== LIGHT POINT =====
            const pointLight = new THREE.PointLight(0xffffff, 0.2); // (couleur, intensite)
            pointLight.position.set(0, 300, 0); // position (x, z, y)
            scene.add(pointLight);

            // ===== SPOT LIGHT =====
            spotLight = new THREE.SpotLight( 0xFFFFFF, 0.2); // (couleur, intensite)
            spotLight.position.set( 0, 300, 0 ); // position
            spotLight.angle = Math.PI / 6; // angle d'ouverture
            spotLight.decay = 1.5; // diminution avec la distance
            spotLight.distance = 300; // distance
            scene.add( spotLight );

            // ===== HELPER =====
            lightHelper = new THREE.SpotLightHelper( spotLight ); // ajoute des helpers pour le spotLight
            lightHelper.visible = false; // pas visible
            scene.add( lightHelper ); // ajout des helpers à la scene

            // ===== CONE =====
            const coneGeo = new THREE.ConeGeometry( 110, 400, 60 );
            const coneMaterial = new THREE.MeshBasicMaterial({	color: 0xFFFFFF, opacity: 0.1, transparent: true});
            const cone = new THREE.Mesh(coneGeo, coneMaterial);
            cone.position.set( 0, 200, 0 ); // position
            scene.add(cone);


            // ============== TEXTURES ==============
            // ===== LOADERS =====

            const loaderr = new FBXLoader();
            loaderr.load( 'assets/mainPerson/Clap.fbx', function ( object ) {

            mixer = new THREE.AnimationMixer( object );

            const action = mixer.clipAction( object.animations[ 0 ] );
            action.play();
            object.position.y += 100;
            object.traverse( function ( child ) {

            if ( child.isMesh ) {

            child.castShadow = true;
            child.receiveShadow = true;
        }

        } );

            scene.add( object );

        } );




            const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
            mesh.rotation.x = - Math.PI / 2;
            mesh.receiveShadow = true;
            scene.add( mesh );

            const dirLight = new THREE.DirectionalLight( 0xffffff );
            dirLight.position.set( 3, 10, 10 ); // position
            dirLight.castShadow = true;// envoie des ombres
            dirLight.shadow.camera.top = 2;
            dirLight.shadow.camera.bottom = - 2;
            dirLight.shadow.camera.left = - 2;
            dirLight.shadow.camera.right = 2;
            dirLight.shadow.camera.near = 0.1;//Frustum de la caméra près du plan.
            dirLight.shadow.camera.far = 40;//Plan éloigné du tronc de la caméra.
            scene.add( dirLight );// ajout dans la scene





            const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );//lumière au-dessus de la scène, avec une décoloration passant de la couleur du ciel à la couleur du sol.
            hemiLight.position.set( 0, 20, 0 );// Cette lumière ne peut pas être utilisée pour projeter des ombres.
            scene.add( hemiLight );

            const meshh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
            // depthWrite: calcule toujours la profondeur, mais rend l'objet entier indépendamment
            meshh.rotation.x = - Math.PI / 2;
            meshh.receiveShadow = true; // recois les ombres
            scene.add( meshh );// ajout dans la scene

            // ============== RENDER ==============
            renderer = new THREE.WebGLRenderer( { antialias: true } );
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( window.innerWidth, window.innerHeight );
            document.body.appendChild( renderer.domElement );


            // ============= CAMERA =============
            camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
            camera.position.set(30,200,250);


            // Faire bouger la caméra avec la souris
            // controls = new OrbitControls( camera, renderer.domElement );
            // controls.minDistance = 150; // distance min
            // controls.maxDistance = 300; // distance max
            // controls.maxPolarAngle = Math.PI / 2.3;

            const GeneratorControls = function () {

            this.frequency = oscillator.frequency.value;
            this.wavetype = oscillator.type;

        };

            controls = new FirstPersonControls( camera, renderer.domElement );

            controls.movementSpeed = 250;
            controls.lookSpeed = 0.09;
            controls.noFly = true;
            controls.lookVertical = true;


            window.addEventListener( 'resize', onWindowResize );
        }




            // ============== GUI ==============
            function buildGui() {

            gui = new GUI(); // création gui

            // ========= SETTINGS LIST =========
            const params = { // liste des parametres
            Helper: false, // case à cocher => renvoie true OU false
            Freecam: false
        };

            // ========= SETTINGS FOLDER =========
            const helperFolder = gui.addFolder( 'Helper' ); // création des différentes parties du gui

            // ========= SETTINGS ACTIONS =========
            helperFolder.add( params, 'Helper', true, false ).onChange( function( val ) {
            lightHelper.visible = val; // defini la visibilite des helpers sur true OU false
        });

            gui.add( params, 'Freecam', true, false ).onChange( function( val ) { // permet de désactiver les limites de la camera
            if(val){ // si val == true (donc cocher)
            controls.minDistance = 0;
            controls.maxDistance = 99999999;
            controls.maxPolarAngle = 360;
        } else { // si decocher
            controls.minDistance = 150;
            controls.maxDistance = 300;
            controls.maxPolarAngle = Math.PI / 2.3;
        }
        });

            gui.open(); // Ajout du gui à la scene
        }


            function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( window.innerWidth, window.innerHeight );

        }

            function animate() {

            requestAnimationFrame( animate );

            const delta = clock.getDelta();// metd a l'

            controls.update( delta );

            if ( mixer ) mixer.update( delta );

            renderer.render( scene, camera );
            stats.update();
        }

